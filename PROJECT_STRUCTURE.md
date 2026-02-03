# 📂 Project Structure

## Overview

This project consists of two main parts:
1. **Frontend** - The React UI (runs in browser)
2. **Backend** - The Node.js server (handles platform connections)

```
ai-streamer-companion/
├── frontend files (root directory)
└── backend/              ← NEW: Real chat integration server
```

---

## 🎨 Frontend Structure

**Location:** Root directory (`/`)

```
.
├── src/
│   ├── App.tsx                      # Main application
│   ├── components/
│   │   ├── BackendConnection.tsx    # NEW: Backend connection UI
│   │   ├── LiveMonitor.tsx          # Live chat monitor
│   │   ├── VTuberAvatar.tsx         # Animated avatar
│   │   ├── PersonalityConfig.tsx    # AI personality settings
│   │   ├── VoiceSettingsConfig.tsx  # Voice/SSML config
│   │   ├── GameplayVisionAnalyzer.tsx # Vision AI
│   │   └── ... (30+ more components)
│   ├── lib/
│   │   ├── backend-service.ts       # NEW: WebSocket client
│   │   └── types.ts                 # TypeScript types
│   └── hooks/
│       └── use-speech-synthesis.ts  # Voice synthesis
├── index.html
├── package.json
└── ... (config files)
```

**Key Files:**
- `src/App.tsx` - Main UI with tabs
- `src/components/BackendConnection.tsx` - Connect to backend server
- `src/lib/backend-service.ts` - WebSocket communication

---

## 🔌 Backend Structure

**Location:** `backend/` directory

```
backend/
├── src/
│   ├── server.ts              # Main WebSocket server
│   ├── services/
│   │   ├── twitch.ts          # Twitch IRC integration
│   │   ├── youtube.ts         # YouTube Live Chat API
│   │   └── ai.ts              # AI response generation
├── dist/                      # Compiled JavaScript (generated)
├── package.json               # Backend dependencies
├── tsconfig.json              # TypeScript config
├── nodemon.json               # Dev server config
├── .env                       # Your credentials (create from .env.example)
├── .env.example               # Environment template
├── .gitignore
├── start.sh                   # Quick start (Linux/Mac)
├── start.bat                  # Quick start (Windows)
└── README.md                  # Backend documentation
```

**Key Files:**
- `src/server.ts` - WebSocket server and routing
- `src/services/twitch.ts` - Twitch chat connection
- `src/services/youtube.ts` - YouTube chat connection
- `.env` - Your API keys and tokens (YOU CREATE THIS)

---

## 🗂️ Documentation Structure

```
.
├── README.md                        # Main project README
├── BACKEND_INTEGRATION.md           # NEW: Integration overview
├── REAL_TIME_CHAT_GUIDE.md          # NEW: Complete chat setup
├── BACKEND_DEPLOYMENT_GUIDE.md      # Backend deployment options
├── QUICK_START.md                   # Quick start guide
├── TROUBLESHOOTING.md               # Common issues & fixes
├── GEMINI_INTEGRATION.md            # Gemini 3 AI details
├── VOICE_SYNTHESIS_GUIDE.md         # Voice/SSML guide
├── VISION_SETUP_GUIDE.md            # Gameplay vision setup
├── PLATFORM_GUIDE.md                # Platform API details
├── REQUIREMENTS.md                  # System requirements
├── HACKATHON_SUBMISSION.md          # Hackathon info
└── backend/
    └── README.md                    # Backend quick start
```

**Start Here:**
1. **[README.md](./README.md)** - Project overview
2. **[REAL_TIME_CHAT_GUIDE.md](./REAL_TIME_CHAT_GUIDE.md)** - Connect to Twitch/YouTube
3. **[backend/README.md](./backend/README.md)** - Backend setup
4. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - If you have issues

---

## 🚀 Quick Reference

### Start Frontend (Always Required)
```bash
npm install        # First time only
npm run dev        # Starts on http://localhost:5173
```

### Start Backend (For Real Chat)
```bash
cd backend
npm install        # First time only
cp .env.example .env  # First time only, then edit
npm run dev        # Starts on http://localhost:3001
```

### Both Running?
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001
- **WebSocket:** ws://localhost:3001

---

## 📍 Where to Find Things

### In the Frontend UI

#### Backend Connection
- Tab: **Backend Server**
- Purpose: Connect to backend for real chat
- Shows: Connection status, server info

#### Live Chat Monitor
- Tab: **Live Monitor**
- Purpose: View and respond to chat
- Shows: Messages, AI responses, sentiment

#### AI Configuration
- Tab: **Personality**
- Purpose: Configure AI personality
- Customize: Name, bio, tone, interests

#### Voice Settings
- Tab: **Voice & SSML**
- Purpose: Configure text-to-speech
- Adjust: Pitch, speed, volume, SSML

#### Vision AI
- Tab: **Vision AI**
- Purpose: Gameplay analysis
- Features: Auto-commentary, highlights

#### Performance Tracking
- Tab: **Performance**
- Purpose: Track gaming metrics
- Shows: APM, accuracy, combos, coaching

### In the Backend

#### Environment Configuration
- File: `backend/.env`
- Contains: API keys, tokens, config
- **IMPORTANT:** Create from `.env.example`

#### Main Server
- File: `backend/src/server.ts`
- Handles: WebSocket, routing, clients

#### Platform Services
- Twitch: `backend/src/services/twitch.ts`
- YouTube: `backend/src/services/youtube.ts`
- AI: `backend/src/services/ai.ts`

---

## 🔍 Common File Locations

### Adding New Components
```bash
src/components/YourComponent.tsx
```

### Adding Backend Routes
```typescript
// backend/src/server.ts
app.get('/your-route', (req, res) => { ... });
```

### Configuring Environment
```bash
# Development
backend/.env

# Production
Set environment variables in hosting platform
```

### Viewing Logs
```bash
# Frontend (browser console)
F12 → Console tab

# Backend (terminal)
Terminal where you ran `npm run dev`
```

---

## 🎯 Development Workflow

### 1. Frontend Development (No Backend)
Use simulation mode:
- Go to **Live Monitor** tab
- Toggle "Auto-generate messages"
- Test UI, avatar, voice, etc.

### 2. Backend Development (With Real Chat)
Connect to platforms:
1. Start backend: `cd backend && npm run dev`
2. Open frontend UI
3. Go to **Backend Server** tab
4. Click "Connect"
5. Go to **Platforms** tab
6. Connect Twitch/YouTube
7. Test with real chat

### 3. Testing Changes

**Frontend:**
- Edit files in `src/`
- Vite hot-reloads automatically
- Check browser console for errors

**Backend:**
- Edit files in `backend/src/`
- Nodemon restarts automatically
- Check terminal console for errors

---

## 📦 Dependencies

### Frontend (`package.json`)
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Three.js** - 3D avatar
- **Framer Motion** - Animations
- **Phosphor Icons** - Icons

### Backend (`backend/package.json`)
- **Express** - HTTP server
- **ws** - WebSocket server
- **tmi.js** - Twitch IRC client
- **googleapis** - YouTube API
- **openai** - AI responses
- **TypeScript** - Type safety

---

## 🛠️ Configuration Files

### Frontend Config
- `vite.config.ts` - Vite bundler
- `tsconfig.json` - TypeScript
- `tailwind.config.js` - Styling
- `components.json` - shadcn

### Backend Config
- `backend/tsconfig.json` - TypeScript
- `backend/nodemon.json` - Dev server
- `backend/.env` - Environment (YOU CREATE)

---

## 🎨 UI Tab Structure

```
AI Streamer Companion UI
├── Home               # Feature overview
├── Backend Server     # NEW: Connect to backend
├── Live Monitor       # Real-time chat
├── Personality        # AI config
├── Voice & SSML       # Speech settings
├── Vision AI          # Gameplay analysis
├── Performance        # Metrics tracking
├── Chat Test          # Test responses
├── Sentiment          # Emotion analysis
├── Analytics          # Stats dashboard
├── AI Responses       # Response generator
├── Templates          # Response templates
├── Commands           # Chat commands
├── Polls              # Poll creator
├── Platforms          # Connect platforms
└── Stream Settings    # General settings
```

---

## 📝 Files You Need to Create

**IMPORTANT:** These files are NOT included in the repository:

1. **`backend/.env`**
   - Copy from `backend/.env.example`
   - Add your API keys and tokens
   - Never commit to git

2. **`backend/node_modules/`**
   - Created by `npm install`
   - Takes ~100MB of space

3. **`backend/dist/`**
   - Created by `npm run build`
   - Compiled JavaScript output

---

## 🚫 Files to Ignore

These are automatically generated (DO NOT EDIT):

- `node_modules/` - Frontend dependencies
- `backend/node_modules/` - Backend dependencies
- `backend/dist/` - Compiled backend
- `.env` - Your credentials (gitignored)
- `*.log` - Log files

---

## 🎯 Quick Tips

### Finding Code
- **Component:** `src/components/ComponentName.tsx`
- **Type definition:** `src/lib/types.ts`
- **Backend route:** `backend/src/server.ts`
- **Backend service:** `backend/src/services/`

### Adding Features
1. Frontend component → `src/components/`
2. Backend route → `backend/src/server.ts`
3. Backend service → `backend/src/services/`
4. Type definition → `src/lib/types.ts`

### Debugging
- Frontend errors → Browser console (F12)
- Backend errors → Terminal console
- WebSocket issues → Network tab (F12)
- API errors → Backend console logs

---

## 📚 Learn More

- **Frontend:** Check `src/App.tsx` to understand structure
- **Backend:** Check `backend/src/server.ts` for WebSocket protocol
- **Types:** Check `src/lib/types.ts` for data structures
- **Docs:** Start with `README.md` → `REAL_TIME_CHAT_GUIDE.md`

---

**Need help?** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or [REAL_TIME_CHAT_GUIDE.md](./REAL_TIME_CHAT_GUIDE.md)
