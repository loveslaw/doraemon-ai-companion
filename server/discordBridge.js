// server/discordBridge.js
import fs from 'node:fs';
import path from 'node:path';

const MEMORY_CONFIG_PATH = String.raw`C:\Users\Satyam\.gemini\config\cherry_memory\discord_config.json`;

export function loadDiscordConfig() {
  if (fs.existsSync(MEMORY_CONFIG_PATH)) {
    try {
      const data = fs.readFileSync(MEMORY_CONFIG_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.warn('[discordBridge] Failed to load config:', e.message);
    }
  }
  return {
    bot_token: process.env.DISCORD_BOT_TOKEN || '',
    guild_id: '1550548416667451474',
    channels: {}
  };
}

export function formatDoraemonEmbed(title, description, fields = []) {
  return {
    title: `🔔 ${title}`,
    description,
    color: 0x0099FF, // Doraemon Blue
    fields: fields.map(f => ({ name: f.name, value: f.value, inline: f.inline || false })),
    footer: {
      text: 'Cherry 🍒 × Doraemon 4D Hub • Zero PC Clutter'
    },
    timestamp: new Date().toISOString()
  };
}

export async function ensureCompanionChannel() {
  const config = loadDiscordConfig();
  const token = config.bot_token;
  const guildId = config.guild_id || '1550548416667451474';

  if (!token) {
    console.warn('[discordBridge] No bot token found; mock channel mode active');
    return 'mock-channel-id';
  }

  // Check if channel already cached
  if (config.channels && config.channels['doraemon-companion']) {
    return config.channels['doraemon-companion'];
  }

  try {
    // 1. Fetch current channels from guild
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      console.error(`[discordBridge] Fetch channels failed: ${res.status} ${res.statusText}`);
      return null;
    }

    const channels = await res.json();
    const existing = channels.find(c => c.name === 'doraemon-companion');
    if (existing) {
      // Save to config
      config.channels['doraemon-companion'] = existing.id;
      fs.writeFileSync(MEMORY_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
      return existing.id;
    }

    // 2. Locate category "💻 DEV & PROJECTS" or "🍒 CHERRY CORE"
    const category = channels.find(c => c.type === 4 && (c.name.includes('DEV') || c.name.includes('CHERRY')));

    // 3. Create channel
    const createRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'doraemon-companion',
        type: 0, // Guild Text Channel
        parent_id: category ? category.id : null,
        topic: '🐱🔔 Doraemon AI Desktop Companion & 4D Gadget Hub — Realtime sync, tasks, habits & cloud vault'
      })
    });

    if (createRes.ok) {
      const newChannel = await createRes.json();
      config.channels['doraemon-companion'] = newChannel.id;
      fs.writeFileSync(MEMORY_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
      console.log(`[discordBridge] Successfully created #doraemon-companion (ID: ${newChannel.id})`);
      
      // Post intro embed
      await sendDiscordEmbed(
        'Doraemon AI Companion Online! 🐱🔔',
        'Hello Satyam! Doraemon Screen Mate & 4D Gadget Deck is active over your 24/7 Home Wi-Fi network.',
        [
          { name: '4D Gadgets', value: 'Anywhere Remote • Copy-Paste Cannon • Screen Vision • Voice', inline: false },
          { name: 'Zero PC Clutter', value: 'All notes, focus sessions and tasks will be vaulted here safely.', inline: false }
        ],
        newChannel.id
      );

      return newChannel.id;
    } else {
      console.error(`[discordBridge] Channel creation failed: ${createRes.status}`);
      return null;
    }
  } catch (err) {
    console.error('[discordBridge] Error ensuring channel:', err);
    return null;
  }
}

export async function sendDiscordEmbed(title, description, fields = [], channelId = null) {
  const config = loadDiscordConfig();
  const token = config.bot_token;
  const targetChannelId = channelId || (config.channels && config.channels['doraemon-companion']) || (config.channels && config.channels['tasks-roadmap']);

  if (!token || !targetChannelId) {
    console.warn('[discordBridge] Missing token or target channel');
    return false;
  }

  const embed = formatDoraemonEmbed(title, description, fields);

  try {
    const res = await fetch(`https://discord.com/api/v10/channels/${targetChannelId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    });

    return res.ok;
  } catch (err) {
    console.error('[discordBridge] sendDiscordEmbed error:', err.message);
    return false;
  }
}
