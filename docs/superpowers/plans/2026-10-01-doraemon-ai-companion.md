# Doraemon AI Companion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cross-platform, 24/7 Wi-Fi connected AI desktop screen mate and mobile companion inspired by Doraemon with 4D gadget powers and Discord cloud vault.

**Architecture:** A lightweight Node.js PC daemon running on port 4242 provides low-latency (<20ms) WebSockets and REST APIs for native Windows control, screen capture, and bidirectional clipboard sync. A React + Framer Motion frontend serves both as a floating PC desktop screen mate (Doraemon walking along the bottom, playing iconic gadget chimes on click) and as a responsive mobile PWA over LAN. All persistent state, tasks, and project backups sync permanently to a dedicated `#doraemon-companion` channel on the `cherry stuff ( ids only )` Discord server.

**Tech Stack:** Node.js, Express, `ws` (WebSocket), React, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Web Audio API, `screenshot-desktop`, Google Gemini SDK (`@google/genai` / REST), Discord.js / Webhooks.

**Spec:** `docs/superpowers/specs/2026-10-01-doraemon-ai-companion-design.md`

## Global Constraints

- **Safe Discord Operations**: Never delete any existing messages or channels on Discord server `cherry stuff ( ids only )` (Guild ID `1550548416667451474`). Only create the `#doraemon-companion` channel if missing, and only append/update bot messages.
- **Zero PC Clutter**: Keep local PC storage minimal. Permanent logs, session summaries, and project bundles must sync to Discord.
- **24/7 Home Wi-Fi LAN**: Server binds to `0.0.0.0:4242` so mobile phone connects directly via `http://<LAN_IP>:4242`.
- **Pure Doraemon Persona**: Faithful anime aesthetics (blue robotic cat, golden bell, whiskers, white 4D pouch, dorayaki snacking, iconic gadget chime SFX).
- **Anti-AI Slop UI**: Framer Motion physics, tactile press feedback (`active:scale-95`), semantic border radii, framed borders, and vector SVGs (no raw emojis as icons).

## Review Focus

1. **Local Network Pairing Failure**: Phone cannot connect if PC firewall blocks port 4242 or wrong LAN IP is picked; ensure auto-discovery detects primary LAN interface and logs clear pairing instructions and QR code.
2. **Audio Autoplay Blocking**: Browsers block Web Audio API if no prior user interaction; ensure the Doraemon gadget chime initializes on the first click gesture.
3. **Clipboard Permission Limits**: Browsers require user gesture or secure context for `navigator.clipboard`; provide server-side fallback endpoints for seamless sync.
4. **WebSocket Reconnection Storm**: Phone dropping Wi-Fi must reconnect with exponential backoff and buffer outbound actions.
5. **Discord Rate Limiting**: Discord webhook/bot calls must be asynchronous and non-blocking to prevent UI lag.

---

### Task 1: Project Scaffolding & Discord Channel Provisioning

**Files:**
- Create: `package.json`
- Create: `server/discordBridge.js`
- Create: `server/tests/discordBridge.test.js`

**Interfaces:**
- Consumes: `C:\Users\Satyam\.gemini\config\cherry_memory\discord_config.json`
- Produces: `ensureCompanionChannel(): Promise<string>` (returns channel ID for `#doraemon-companion`), `sendDiscordEmbed(title, description, fields): Promise<boolean>`

- [ ] **Step 1: Write failing test for Discord Bridge**

```javascript
// server/tests/discordBridge.test.js
import assert from 'node:assert';
import test from 'node:test';
import { ensureCompanionChannel, formatDoraemonEmbed } from '../discordBridge.js';

test('formatDoraemonEmbed builds valid Discord embed structure', () => {
  const embed = formatDoraemonEmbed('Test Title', 'Test Desc', [{ name: 'Status', value: 'Active' }]);
  assert.strictEqual(embed.title, 'Test Title');
  assert.strictEqual(embed.description, 'Test Desc');
  assert.strictEqual(embed.color, 0x0099FF); // Doraemon Blue
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test server/tests/discordBridge.test.js`  
Expected: FAIL (cannot find module `../discordBridge.js`)

- [ ] **Step 3: Implement Discord Bridge & root package.json**

Create `package.json` and `server/discordBridge.js` with functions to load `discord_config.json`, verify/create `#doraemon-companion` on guild `1550548416667451474`, and post rich Doraemon blue embeds safely.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test server/tests/discordBridge.test.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json server/discordBridge.js server/tests/discordBridge.test.js
git commit -m "feat: setup project structure and discord channel bridge"
```

---

### Task 2: Windows System Controller & Clipboard Engine

**Files:**
- Create: `server/systemController.js`
- Create: `server/tests/systemController.test.js`

**Interfaces:**
- Consumes: PowerShell / Windows WScript / `child_process`
- Produces: 
  - `adjustVolume(direction: 'up' | 'down' | 'mute'): Promise<{ success: boolean }>`
  - `toggleMediaPlayPause(): Promise<{ success: boolean }>`
  - `launchApp(appName: string): Promise<{ success: boolean }>`
  - `getClipboard(): Promise<string>`
  - `setClipboard(text: string): Promise<boolean>`

- [ ] **Step 1: Write failing test for System Controller**

```javascript
// server/tests/systemController.test.js
import assert from 'node:assert';
import test from 'node:test';
import { validateAppName, sanitizeClipboardInput } from '../systemController.js';

test('validateAppName allows approved whitelist apps', () => {
  assert.strictEqual(validateAppName('code'), true);
  assert.strictEqual(validateAppName('chrome'), true);
  assert.strictEqual(validateAppName('spotify'), true);
  assert.strictEqual(validateAppName('calc'), true);
  assert.strictEqual(validateAppName('rmdir /s /q c:'), false);
});

test('sanitizeClipboardInput handles strings safely', () => {
  assert.strictEqual(sanitizeClipboardInput('hello world'), 'hello world');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test server/tests/systemController.test.js`  
Expected: FAIL

- [ ] **Step 3: Implement Windows System Controller**

Create `server/systemController.js` implementing PowerShell commands for media keys (`[System.Windows.Forms.SendKeys]::SendWait` or audio API commands), safe application launch whitelist, and Windows clipboard synchronization.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test server/tests/systemController.test.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/systemController.js server/tests/systemController.test.js
git commit -m "feat: implement native windows controller and clipboard bridge"
```

---

### Task 3: Real-Time WebSocket & REST Server with LAN Pairing

**Files:**
- Create: `server/server.js`
- Create: `server/screenVision.js`
- Create: `server/tests/server.test.js`

**Interfaces:**
- Consumes: `systemController.js`, `discordBridge.js`, `os.networkInterfaces`
- Produces: Express app on port `4242`, WebSocket server on `/ws`, LAN IP detection, Screen capture handler

- [ ] **Step 1: Write failing test for LAN IP detection and server packet router**

```javascript
// server/tests/server.test.js
import assert from 'node:assert';
import test from 'node:test';
import { getLocalLanIp, handleIncomingEvent } from '../server.js';

test('getLocalLanIp returns valid IPv4 address or fallback', () => {
  const ip = getLocalLanIp();
  assert.match(ip, /^(?:\d{1,3}\.){3}\d{1,3}$/);
});

test('handleIncomingEvent handles volume action', async () => {
  const res = await handleIncomingEvent({ type: 'MEDIA_CONTROL', action: 'mute' });
  assert.strictEqual(res.success, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test server/tests/server.test.js`  
Expected: FAIL

- [ ] **Step 3: Implement Server & Screen Vision module**

Build `server/server.js` with Express + `ws`, LAN IP QR code generation, REST endpoints (`/api/health`, `/api/screen-vision`, `/api/clipboard`), and real-time WebSocket event dispatching. In `server/screenVision.js`, integrate desktop capture with Gemini multimodal model.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test server/tests/server.test.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/server.js server/screenVision.js server/tests/server.test.js
git commit -m "feat: implement express & websocket server with lan pairing"
```

---

### Task 4: Doraemon Screen Mate Vector Art, Walking Physics & SFX Chime

**Files:**
- Create: `client/src/components/DoraemonAvatar.jsx`
- Create: `client/src/components/DoraemonWalker.jsx`
- Create: `client/src/utils/doraemonAudio.js`
- Create: `client/src/tests/doraemonAudio.test.js`

**Interfaces:**
- Consumes: Web Audio API, Framer Motion
- Produces: 
  - `<DoraemonWalker />`: Physics walker along bottom of screen with boundary bounce.
  - `<DoraemonAvatar state={state} onClick={...} />`: Pure Doraemon SVG avatar with animated eyes, bell, whiskers, and dorayaki snack.
  - `playDoraemonChime()`: Synthesizes the iconic 3-note gadget reveal chime in Web Audio.

- [ ] **Step 1: Write failing test for Doraemon Audio Synthesizer logic**

```javascript
// client/src/tests/doraemonAudio.test.js
import assert from 'node:assert';
import test from 'node:test';
import { getGadgetChimeFrequencies } from '../utils/doraemonAudio.js';

test('getGadgetChimeFrequencies returns iconic ascending melody', () => {
  const freqs = getGadgetChimeFrequencies();
  assert.deepStrictEqual(freqs, [523.25, 659.25, 783.99, 1046.50]); // C5, E5, G5, C6
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test client/src/tests/doraemonAudio.test.js`  
Expected: FAIL

- [ ] **Step 3: Implement Doraemon Avatar, Walker & Audio Synthesizer**

Develop `DoraemonAvatar.jsx` with faithful SVG vector geometry, expressions (`idle`, `walk`, `eating`, `sleep`, `shocked`, `gadget`), `DoraemonWalker.jsx` with Framer Motion desktop walking loop, and `doraemonAudio.js` utilizing Web Audio API oscillators.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test client/src/tests/doraemonAudio.test.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add client/src/components/DoraemonAvatar.jsx client/src/components/DoraemonWalker.jsx client/src/utils/doraemonAudio.js client/src/tests/doraemonAudio.test.js
git commit -m "feat: add pure doraemon screen mate avatar, walker physics and sfx chime"
```

---

### Task 5: 4D Gadget Deck & Mobile PWA Responsive Experience

**Files:**
- Create: `client/src/components/GadgetDeck.jsx`
- Create: `client/src/components/RemoteCard.jsx`
- Create: `client/src/components/ClipboardCard.jsx`
- Create: `client/src/components/VisionCard.jsx`
- Create: `client/src/components/FocusCard.jsx`
- Create: `client/src/components/VoiceCard.jsx`
- Create: `client/src/App.jsx`
- Create: `client/index.html`

**Interfaces:**
- Consumes: WebSocket connection to `ws://<HOST>:4242/ws`
- Produces: 
  - Desktop floating HUD mode (draggable, compact/expanded)
  - Mobile PWA viewport mode (full-screen touch-friendly 4D gadget control deck)

- [ ] **Step 1: Write failing test for Gadget state management**

```javascript
// client/src/tests/gadgetState.test.js
import assert from 'node:assert';
import test from 'node:test';
import { initialGadgetState, reduceGadgetAction } from '../utils/gadgetState.js';

test('reduceGadgetAction opens and closes 4D pocket', () => {
  const state = initialGadgetState();
  assert.strictEqual(state.isPocketOpen, false);
  const next = reduceGadgetAction(state, { type: 'TOGGLE_POCKET' });
  assert.strictEqual(next.isPocketOpen, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test client/src/tests/gadgetState.test.js`  
Expected: FAIL

- [ ] **Step 3: Implement 4D Gadget Deck & Mobile PWA App**

Build `GadgetDeck.jsx` and individual cards with tactile press feedback (`active:scale-95`), Lucide vector icons, and Framer Motion layouts. Implement `App.jsx` with viewport detection for seamless PC Desktop Screen Mate vs Mobile Phone PWA switching.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test client/src/tests/gadgetState.test.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add client/src/components/ client/src/utils/gadgetState.js client/src/App.jsx client/index.html client/src/tests/gadgetState.test.js
git commit -m "feat: implement 4d gadget deck and mobile pwa interface"
```

---

### Task 6: End-to-End Integration, Discord Vault Sync & Cloud Archive

**Files:**
- Create: `server/tests/e2eIntegration.test.js`
- Create: `start.bat`
- Modify: `server/discordBridge.js`

**Interfaces:**
- Consumes: All modules
- Produces: Complete running system with auto-provisioned Discord `#doraemon-companion` channel and project cloud bundle.

- [ ] **Step 1: Write failing end-to-end integration test**

```javascript
// server/tests/e2eIntegration.test.js
import assert from 'node:assert';
import test from 'node:test';
import http from 'node:http';

test('server health endpoint returns status ok and lan ip', async () => {
  // Test local health endpoint
  const res = await fetch('http://localhost:4242/api/health').catch(() => null);
  // Handled in step 3
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test server/tests/e2eIntegration.test.js`  
Expected: FAIL

- [ ] **Step 3: Wire full integration, health check & 1-click startup script**

Finalize `server/server.js`, build client assets with Vite (`npm run build`), create `start.bat` for 1-click Windows launch (starts server, opens desktop screen mate, displays LAN QR code for phone), and auto-create the `#doraemon-companion` Discord channel.

- [ ] **Step 4: Run tests & verify complete flow**

Run all tests: `npm test`  
Expected: All suites PASS.

- [ ] **Step 5: Push Project Bundle to Discord `#active-projects` / `#doraemon-companion`**

Package the project bundle and archive to Discord cloud hub via `discord_push.js` adhering to Zero PC Clutter protocol.

- [ ] **Step 6: Commit**

```bash
git add server/ client/ start.bat
git commit -m "feat: complete doraemon companion end-to-end integration and discord vault sync"
```
