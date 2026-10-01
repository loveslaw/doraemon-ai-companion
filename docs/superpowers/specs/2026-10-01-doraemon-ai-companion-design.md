# Design Spec: Doraemon AI Companion (Screen Mate & 4D Gadget Hub)

**Date**: 2026-10-01  
**Author**: Cherry 🍒 & Satyam  
**Status**: Approved (Brainstorming Phase Complete)  
**Target Directory**: `C:\Users\Satyam\.gemini\antigravity\scratch\doraemon-ai-companion`

---

## 1. Executive Summary & Vision

A cross-device, highly customized, and ultra-powerful AI companion inspired by **Doraemon** and desktop screen mates (like Hey Taby & Shimeji), operating across both **Windows PC** and **Mobile Phone** over a **24/7 Home Wi-Fi network**.

The companion features:
1. **Interactive Desktop Screen Mate**: A pure Doraemon character who walks along the bottom of the PC screen, reacts to activities, eats dorayaki, sips tea, sleeps with bubbles, and upon being clicked plays the iconic **Doraemon Gadget Reveal chime** to open his **4D Gadget Pocket**.
2. **Mobile PWA (Phone Hub)**: A sleek, touch-first responsive mobile interface accessible from bed or anywhere in the house over 24/7 Wi-Fi, featuring a live reactive Doraemon face and 1-tap gadget controls.
3. **4D Gadget Superpowers**:
   - **Anywhere Remote**: Control PC volume, mute, play/pause, media playback, and launch favorite apps (VS Code, Chrome, Terminal, etc.).
   - **Copy-Paste Cannon**: Instant bidirectional clipboard sync between Phone and PC with zero friction.
   - **Anywhere Screen Lens**: On-demand PC screen capture analyzed by Gemini multimodal AI to debug code, summarize content, or answer questions in Hinglish.
   - **Translation Konnyaku (Voice)**: Real-time two-way voice conversation in witty, friendly Hinglish.
   - **Time Furoshiki (Productivity)**: Pomodoro focus timer, habit tracker, and daily task checklist.
4. **Discord Master Cloud Hub**:
   - Dedicated new Discord channel on `cherry stuff ( ids only )` (e.g. `#doraemon-companion`) created specifically for this project.
   - All tasks, session logs, notes, and backups are stored permanently in Discord to ensure **Zero PC Clutter** while maintaining strict **Safe Mode** (never deleting existing channels or messages).

---

## 2. System Architecture

```
   ┌─────────────────────────────────────────────────────────────┐
   │                     HOME WI-FI (24/7 LAN)                   │
   │                                                             │
   │   📱 Phone (PWA / Mobile UI)      💻 PC Desktop Companion   │
   │   - Remote PC Controls            - Doraemon Screen Walker  │
   │   - Voice & Chat (Mic)            - Iconic Chime on Click   │
   │   - Clipboard Sync Button         - Floating 4D Gadget Deck │
   │            ▲                                ▲               │
   │            │     Real-Time WebSocket (<20ms) │               │
   │            └───────────────┬────────────────┘               │
   │                            ▼                                │
   │                ⚙️ DORAEMON LOCAL CORE (PC)                  │
   │       Node.js + Express + WebSocket Server (:4242)          │
   │       - Windows Native Controller (Media, Apps, Screen)     │
   │       - Bidirectional Clipboard Bridge                      │
   │       - Gemini Multimodal Intelligence Engine               │
   └────────────────────────────┬────────────────────────────────┘
                                │
                    Secure HTTPS / Discord API
                                ▼
            ☁️ DISCORD MASTER VAULT (`cherry stuff`)
            - Dedicated `#doraemon-companion` channel
            (Zero PC Clutter • 100% Safe Mode • Permanent Cloud)
```

### 2.1 Backend Core (`server.js`)
- Runs as a background Node.js service on port `4242` binding to `0.0.0.0`.
- Displays the local LAN IP (e.g. `http://192.168.x.x:4242`) and an ASCII/terminal QR code on startup for effortless phone pairing.
- Exposes:
  - **WebSocket Server (`ws://`)**: Handles instant real-time events (`volume_change`, `media_toggle`, `clipboard_push`, `clipboard_pull`, `app_launch`, `mood_change`, `voice_transcript`).
  - **REST Endpoints (`/api/*`)**:
    - `POST /api/screen-vision`: Captures desktop screenshot and sends to Gemini with query.
    - `POST /api/clipboard`: Updates or retrieves Windows clipboard.
    - `POST /api/system`: Executes Windows command (volume, app launch, lock).
    - `POST /api/discord/sync`: Pushes logs and tasks to `#doraemon-companion`.

### 2.2 Frontend Client Stack
- Modern React + Vite with Tailwind CSS and **Framer Motion** physics.
- **Doraemon Screen Mate Component**:
  - Pure Doraemon character vector art & animation states (walking, idle bob, jumping, dorayaki munching, sleeping bubble, shocked, celebratory).
  - Physics-based walking along the screen edge with collision boundaries.
  - Interactive audio synthesizer / Web Audio API playing the iconic gadget chime on click.
- **4D Gadget Deck Component**:
  - Smooth spring modal (`layout`, `AnimatePresence`) expanding from Doraemon's belly pocket.
  - Remote controller card, clipboard card, screen vision card, and productivity timer.
- **Responsive Viewports**:
  - Automatically switches between desktop floating companion mode and mobile PWA phone layout.

---

## 3. Detailed Component Specifications

### 3.1 Doraemon Avatar & Animations
- **Base Aesthetics**: Classic round blue robotic cat, white face/belly, red collar with metallic glowing golden bell, round red nose, 6 whiskers, red round tail, white pouch.
- **Animation States**:
  - `WALK`: Feet pattering across the screen, tail wagging.
  - `IDLE`: Gentle breathing bob; blinks every 3-5 seconds.
  - `EATING`: Munching a delicious dorayaki when a task is completed or PC is idle.
  - `SLEEP`: Sits down with an expanding/popping snot bubble.
  - `GADGET_REVEAL`: Reaches into 4D pocket, bell glows golden, eyes sparkle, chime plays.
  - `TALKING`: Mouth opens and closes in sync with AI voice output.

### 3.2 System & Media Controller
- Media controls use native Windows shortcuts via lightweight PowerShell / Node script execution:
  - Volume up/down, mute toggle.
  - Play/pause (MediaPlayPause virtual key), Next track, Previous track.
  - App launcher: VS Code (`code`), Chrome, Terminal (`wt`), Spotify, Notepad, Calculator.

### 3.3 Clipboard Bridge
- Uses native clipboard access on PC.
- Phone PWA provides a 1-tap "Send to PC" button that reads the phone clipboard and immediately dispatches a WebSocket packet to set the PC clipboard.
- "Copy PC to Phone" button dispatches a request and returns the PC's current clipboard string to the phone.

### 3.4 Screen Vision Intelligence
- Captures active primary screen using desktop screenshot library (`screenshot-desktop`).
- Encodes image to Base64 and invokes Gemini API (`gemini-1.5-flash` or latest available).
- Returns analysis in witty Hinglish with actionable advice.

### 3.5 Discord Master Cloud Hub Integration
- Server: `cherry stuff ( ids only )` (Guild ID: `1550548416667451474`).
- **Channel Provisioning**: Automatically create a dedicated text channel `#doraemon-companion` under the appropriate category if it does not already exist.
- **Sync Events**:
  - Task completion logs.
  - Daily summary & focus stats.
  - Project code backups (`discord_push.js` bundle push).
- **Zero PC Clutter Policy**: No local databases, state files are backed up to Discord embeds.
- **Safe Mode**: Strict prohibition on deleting any existing channels or user messages.

---

## 4. Resilience & Error Handling

1. **Network Disconnection**:
   - Phone PWA implements exponential backoff WebSocket reconnection.
   - When connection is lost, an offline indicator appears; actions queue locally and flush on reconnection.
2. **Audio Fallback**:
   - Web Audio synthesized chime runs fully offline without relying on external MP3 hosting.
3. **API Graceful Degradation**:
   - If Gemini API key is unset or rate-limited, system actions (remote, clipboard, timer) continue functioning seamlessly with local fallback responses.

---

## 5. Verification & Testing Plan

1. **Local Server & WebSocket Test**: Verify server starts on port `4242` and accepts WebSocket connections from both localhost and LAN IP.
2. **Windows Controller Test**: Verify volume mute/unmute and app launcher trigger without error.
3. **Clipboard Bridge Test**: Send text from mobile simulator / curl to verify PC clipboard updates.
4. **Doraemon Animation & SFX Test**: Verify all states (walk, idle, eating, gadget reveal) animate cleanly at 60 FPS and audio chime triggers on click.
5. **Discord Channel Creation & Sync Test**: Verify the bot creates or locates `#doraemon-companion` on `cherry stuff` and posts formatted embeds without deleting anything.
