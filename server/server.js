// server/server.js
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

import * as system from './systemController.js';
import * as discord from './discordBridge.js';
import * as vision from './screenVision.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getLocalLanIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

export async function handleIncomingEvent(event) {
  if (!event || typeof event !== 'object' || !event.type) {
    return { success: false, error: 'Invalid event payload' };
  }

  try {
    switch (event.type) {
      case 'MEDIA_CONTROL': {
        if (event.action === 'volume') {
          return await system.adjustVolume(event.direction || 'mute');
        } else if (event.action === 'toggle') {
          return await system.toggleMediaPlayPause();
        } else if (event.action === 'next') {
          return await system.mediaNextTrack();
        } else if (event.action === 'prev') {
          return await system.mediaPrevTrack();
        }
        return { success: false, error: 'Unknown media action' };
      }

      case 'APP_LAUNCH': {
        return await system.launchApp(event.app);
      }

      case 'CLIPBOARD_SET': {
        const ok = await system.setClipboard(event.text || '');
        return { success: ok, text: event.text };
      }

      case 'CLIPBOARD_GET': {
        const text = await system.getClipboard();
        return { success: true, text };
      }

      case 'SYSTEM_LOCK': {
        return await system.lockPc();
      }

      case 'SCREEN_VISION': {
        const base64 = await vision.captureScreenBase64();
        const analysis = await vision.analyzeScreenWithGemini(base64, event.query || 'What is on my screen?');
        return analysis;
      }

      case 'DISCORD_SYNC': {
        const ok = await discord.sendDiscordEmbed(
          event.title || 'Doraemon Companion Update',
          event.description || 'Activity logged from 4D Gadget Deck',
          event.fields || []
        );
        return { success: ok };
      }

      default:
        return { success: false, error: `Unhandled event type: ${event.type}` };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function createDoraemonServer(port = 4242) {
  const app = express();
  app.use(express.json());

  // CORS for local network access
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });

  // REST endpoints
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      companion: 'Doraemon 4D Hub',
      lanIp: getLocalLanIp(),
      port,
      time: new Date().toISOString()
    });
  });

  app.post('/api/action', async (req, res) => {
    const result = await handleIncomingEvent(req.body);
    res.json(result);
  });

  app.get('/api/clipboard', async (req, res) => {
    const text = await system.getClipboard();
    res.json({ success: true, text });
  });

  app.post('/api/clipboard', async (req, res) => {
    const ok = await system.setClipboard(req.body.text || '');
    res.json({ success: ok });
  });

  app.post('/api/screen-vision', async (req, res) => {
    const base64 = await vision.captureScreenBase64();
    const result = await vision.analyzeScreenWithGemini(base64, req.body.query);
    res.json(result);
  });

  // Serve static client if dist folder exists
  const distPath = path.join(__dirname, '..', 'client', 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });

  function broadcast(data, excludeWs = null) {
    const msg = JSON.stringify(data);
    wss.clients.forEach(client => {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  }

  wss.on('connection', (ws) => {
    // Send welcome and sync state
    ws.send(JSON.stringify({
      type: 'INIT',
      lanIp: getLocalLanIp(),
      port,
      companion: 'Doraemon 4D Hub Online'
    }));

    ws.on('message', async (raw) => {
      try {
        const event = JSON.parse(raw.toString());
        const response = await handleIncomingEvent(event);
        
        // Reply back to sender with result
        ws.send(JSON.stringify({
          type: 'ACTION_RESPONSE',
          originalType: event.type,
          result: response
        }));

        // Broadcast state sync to other connected clients (Phone <-> PC)
        broadcast({
          type: 'SYNC_EVENT',
          event,
          result: response
        }, ws);
      } catch (e) {
        ws.send(JSON.stringify({ type: 'ERROR', error: e.message }));
      }
    });
  });

  return { app, server, wss, port };
}

// Start if executed directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  const PORT = process.env.PORT || 4242;
  const { server } = createDoraemonServer(PORT);
  server.listen(PORT, '0.0.0.0', () => {
    const lanIp = getLocalLanIp();
    console.log(`\n========================================================`);
    console.log(`🐱🔔 DORAEMON AI COMPANION — 4D GADGET CORE RUNNING!`);
    console.log(`========================================================`);
    console.log(`💻 PC Screen Mate : http://localhost:${PORT}`);
    console.log(`📱 Phone PWA Access: http://${lanIp}:${PORT}`);
    console.log(`📡 WebSocket Bus   : ws://${lanIp}:${PORT}/ws`);
    console.log(`☁️  Discord Vault  : #doraemon-companion connected`);
    console.log(`========================================================\n`);
  });
}
