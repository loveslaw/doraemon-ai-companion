# 🐱🔔 Doraemon AI Companion & 4D Gadget Hub
### *By Cherry 🍒 *

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Powered by Cherry 🍒](https://img.shields.io/badge/AI%20Co--Pilot-Cherry%20%F0%9F%8D%92-ff2e63.svg)](https://github.com)
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Framer%20Motion-0288D1.svg)](https://vitejs.dev)
[![Network](https://img.shields.io/badge/Network-24%2F7%20Home%20Wi--Fi%20LAN%20%28%3C20ms%29-4caf50.svg)](https://github.com)
[![Storage](https://img.shields.io/badge/Storage-Discord%20Master%20Vault%20%28Zero%20PC%20Clutter%29-5865F2.svg)](https://discord.com)

A cross-device, highly customized, and ultra-powerful AI companion inspired by **Doraemon** and desktop screen mates (Hey Taby / Shimeji), running simultaneously on **Windows PC** and your **Mobile Phone** over a **24/7 Home Wi-Fi network**.

---

## ✨ Features at a Glance

### 1. 🐱 Pure Doraemon Desktop Screen Mate
* **Screen Walker Physics**: Doraemon walks along the bottom edge of your PC screen, turns around at boundaries, and idles with gentle breathing.
* **Snack Breaks & Sits**: Automatically takes breaks to munch delicious Dorayaki 🥞 or take a quick snooze with expanding sleep bubbles.
* **Iconic Gadget Chime SFX**: Click on Doraemon anywhere on your screen to play the synthesized ascending **Doraemon Gadget Reveal Chime** (`C5-E5-G5-C6`) and pop his **4D Gadget Pocket**!

### 2. 📱 Seamless Mobile Phone PWA
* Connect directly from your bed or anywhere in the house via local Wi-Fi (`http://<PC_LAN_IP>:4242`).
* Zero latency (<20ms) real-time WebSocket connection to your PC.
* Full-touch interface with tactile press physics (`active:scale-95`).

### 3. 🎒 The 4D Gadget Deck
* 🎮 **Anywhere Remote**: Control PC Master Volume (Up, Down, Mute), toggle Play/Pause, Next/Prev tracks, and 1-tap launch apps (VS Code, Chrome, Spotify, Terminal, Calculator).
* 📋 **Copy-Paste Cannon**: Instant bidirectional clipboard synchronization between Phone and PC with zero friction.
* 🔍 **Anywhere Screen Lens**: On-demand PC screenshot capture analyzed by Google Gemini multimodal AI to debug code, explain errors, or summarize content in witty Hinglish.
* ⏱️ **Time-Furoshiki Focus**: 25-minute Pomodoro timer, daily habit checklist, and 1-click cloud vaulting.
* 🎙️ **Translation Konnyaku**: Two-way Hinglish conversational voice interaction with speech recognition and speech synthesis.

### 4. ☁️ Discord Master Cloud Hub (Zero PC Clutter)
* **Master Vault**: Persistent notes, completed tasks, pomodoro focus records, and code bundles are archived permanently to `#doraemon-companion` on the Discord server.
* **Zero PC Clutter**: No heavy local databases or bloat.
* **Strict Safe Mode**: Strictly non-destructive — never modifies or deletes existing Discord messages.

---

## 🏗️ Architecture

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

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** (v18 or higher)
* Windows 10 / 11

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/loveslaw/doraemon-ai-companion.git
cd doraemon-ai-companion
npm install
```

### 2. Start with 1 Click
Double-click **`start.bat`** or run in your terminal:
```bash
node server/server.js
```

### 3. Open on PC & Phone
* **On PC**: Visit [http://localhost:4242](http://localhost:4242) in your browser.
* **On Phone**: Open `http://<YOUR_PC_LAN_IP>:4242` on your phone's browser (displayed in your console on startup).

---

## 🧪 Testing Suite

Run all unit, component, and end-to-end integration tests:
```bash
npm test
```

---

## 🍒 About Cherry Systems

Created by **Satyam** & co-piloted by **Cherry 🍒** — crafting intelligent, playful, and tactile AI experiences with zero bloat and high aesthetic motion design.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
