# 🚀 Quick Start Guide - Backend Setup

## 30-Minute Setup for Live Twitch Integration

This is the fastest path to get your AI streamer working with real Twitch chat.

---

## Step 1: Get Twitch Tokens (5 minutes)

### Using TwitchTokenGenerator.com

1. **Go to:** https://twitchtokengenerator.com

2. **Select these scopes:**
   - ✅ `chat:read` - Read chat messages
   - ✅ `chat:edit` - Send chat messages
   - ✅ `channel:manage:polls` - Create polls (optional)

3. **Click "Generate Token"**

4. **Save these values:**
   ```
   ACCESS TOKEN: [long string starting with letters]
   CLIENT ID: [short string of random characters]
   REFRESH TOKEN: [another long string]
   ```

**⚠️ Important:** Use your actual streaming account (michaelinzo) when authorizing!

---

## Step 2: Create Backend Server (10 minutes)

### A. Create Project

```bash
# Open terminal in a new folder
mkdir ai-streamer-backend
cd ai-streamer-backend
npm init -y
```

### B. Install Packages

```bash
npm install express ws tmi.js dotenv cors axios @google/generative-ai
```

### C. Create `.env` File

Create a file called `.env` in the `ai-streamer-backend` folder:

```env
TWITCH_CLIENT_ID=paste_client_id_here
TWITCH_ACCESS_TOKEN=paste_access_token_here
TWITCH_REFRESH_TOKEN=paste_refresh_token_here
TWITCH_CHANNEL=michaelinzo

GEMINI_API_KEY=your_gemini_key_here
GEMINI_MODEL=gemini-3.0-flash-001

PORT=3001
```

**Replace the placeholders** with your actual values from Step 1.

### D. Create `server.js`

Create a file called `server.js` and copy the complete code from:
**[BACKEND_DEPLOYMENT_GUIDE.md](./BACKEND_DEPLOYMENT_GUIDE.md)** (search for "Create `server.js`")

Or use this minimal version to start:

```javascript
const express = require('express');
const WebSocket = require('ws');
const tmi = require('tmi.js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });
let frontendClients = [];

wss.on('connection', (ws) => {
  console.log('✅ Frontend connected');
  frontendClients.push(ws);
  
  ws.on('close', () => {
    frontendClients = frontendClients.filter(client => client !== ws);
  });
});

function broadcastToFrontend(data) {
  frontendClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Twitch Configuration
const twitchClient = new tmi.Client({
  options: { debug: true },
  connection: { reconnect: true, secure: true },
  identity: {
    username: process.env.TWITCH_CHANNEL,
    password: `oauth:${process.env.TWITCH_ACCESS_TOKEN}`
  },
  channels: [process.env.TWITCH_CHANNEL]
});

// Handle Twitch Messages
twitchClient.on('message', (channel, tags, message, self) => {
  if (self) return;

  const chatMessage = {
    id: tags.id,
    username: tags['display-name'],
    content: message,
    platform: 'twitch',
    timestamp: new Date(),
    sender: 'user'
  };

  console.log(`💬 [Twitch] ${chatMessage.username}: ${message}`);

  broadcastToFrontend({
    type: 'chat_message',
    data: chatMessage
  });
});

twitchClient.on('connected', () => {
  console.log('✅ Connected to Twitch!');
  broadcastToFrontend({
    type: 'connection_status',
    platform: 'twitch',
    connected: true
  });
});

// Connect to Twitch
twitchClient.connect().catch(console.error);

console.log('🎮 AI Streamer Backend Ready!');
console.log(`📡 WebSocket: ws://localhost:${PORT}`);
```

---

## Step 3: Run the Backend (2 minutes)

```bash
# In the ai-streamer-backend folder
node server.js
```

**You should see:**
```
🚀 Backend running on port 3001
🎮 AI Streamer Backend Ready!
📡 WebSocket: ws://localhost:3001
✅ Connected to Twitch!
```

**✅ If you see this, your backend is working!**

---

## Step 4: Connect Frontend to Backend (5 minutes)

### Option A: Quick Test (No Code Changes)

1. **Open browser console** (F12) on your Spark app
2. **Run this code:**

```javascript
const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => console.log('✅ Connected to backend!');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('📨 Received:', message);
};
```

3. **Go to your Twitch chat** and send a message
4. **Check the console** - you should see the message appear!

### Option B: Full Integration

Add a new component for WebSocket connection:

```typescript
// src/hooks/useBackendConnection.ts
import { useEffect, useRef } from 'react';

export function useBackendConnection(onMessage: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    
    ws.onopen = () => {
      console.log('✅ Connected to backend');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('❌ Disconnected from backend');
      // Reconnect after 3 seconds
      setTimeout(() => {
        wsRef.current = new WebSocket('ws://localhost:3001');
      }, 3000);
    };
    
    wsRef.current = ws;
    
    return () => {
      ws.close();
    };
  }, [onMessage]);

  return wsRef;
}
```

Then use it in `App.tsx`:

```typescript
// Add to App.tsx
import { useBackendConnection } from '@/hooks/useBackendConnection';

// Inside App component
useBackendConnection((data) => {
  if (data.type === 'chat_message') {
    setLiveMessages((current) => [...current, data.data]);
  }
  
  if (data.type === 'connection_status') {
    console.log(`${data.platform} connection:`, data.connected);
  }
});
```

---

## Step 5: Test Live! (5 minutes)

### Testing Checklist

1. **✅ Backend is running** (see terminal with "Connected to Twitch")
2. **✅ Frontend is open** (your Spark app)
3. **✅ Go live on Twitch:** https://www.twitch.tv/michaelinzo
4. **✅ Send a test message** in your Twitch chat
5. **✅ Check backend terminal** - should show the message
6. **✅ Check frontend** - message should appear in Monitor tab

### Troubleshooting

**Problem:** "Login authentication failed"
- **Fix:** Regenerate your token at TwitchTokenGenerator.com
- Make sure you're using YOUR channel name (michaelinzo)

**Problem:** Not seeing messages
- **Fix:** Make sure you're actually live on Twitch
- Check that your channel name is correct in `.env`

**Problem:** "Cannot connect to WebSocket"
- **Fix:** Make sure backend is running (`node server.js`)
- Check port 3001 isn't being used by another app

---

## Step 6: Add AI Responses (Optional)

To make the bot respond automatically:

1. **Get OpenAI API key:** https://platform.openai.com/api-keys

2. **Add to `.env`:**
```env
OPENAI_API_KEY=sk-your-key-here
```

3. **Update `server.js`** (full code in BACKEND_DEPLOYMENT_GUIDE.md)

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  YOU GO LIVE ON TWITCH                          │
│  https://twitch.tv/michaelinzo                  │
│                                                 │
│                    │                            │
│         Viewers send chat messages              │
│                    │                            │
│                    ▼                            │
│         ┌──────────────────┐                    │
│         │  Twitch Server   │                    │
│         └────────┬─────────┘                    │
│                  │                              │
│                  │ IRC Connection               │
│                  │                              │
│                  ▼                              │
│         ┌──────────────────┐                    │
│         │  YOUR BACKEND    │                    │
│         │  (server.js)     │                    │
│         │  Running on      │                    │
│         │  localhost:3001  │                    │
│         └────────┬─────────┘                    │
│                  │                              │
│                  │ WebSocket                    │
│                  │                              │
│                  ▼                              │
│         ┌──────────────────┐                    │
│         │  YOUR FRONTEND   │                    │
│         │  (Spark App)     │                    │
│         │  localhost:5173  │                    │
│         └──────────────────┘                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎯 What Each Token Does

### ACCESS TOKEN
- Allows your backend to connect to Twitch
- **Like:** Your password to login
- **Used for:** Sending/receiving messages

### CLIENT ID
- Identifies your application
- **Like:** Your app's username
- **Used for:** API requests (polls, etc.)

### REFRESH TOKEN
- Gets new access tokens when they expire
- **Like:** A "remember me" cookie
- **Used for:** Staying connected long-term

---

## 🔒 Security Checklist

- ✅ Never commit `.env` file to Git
- ✅ Add `.env` to `.gitignore`
- ✅ Don't share tokens in screenshots
- ✅ Regenerate tokens if accidentally exposed
- ✅ Use environment variables, never hardcode

---

## 🚀 Next Steps

After basic setup works:

1. **Add AI auto-responses** (see full guide)
2. **Deploy to cloud** (Heroku/Railway - always online)
3. **Add YouTube integration** (similar process)
4. **Create poll commands** (see BACKEND_DEPLOYMENT_GUIDE.md)
5. **Customize avatar** (already works in frontend!)

---

## 📖 Full Documentation

- **[BACKEND_DEPLOYMENT_GUIDE.md](./BACKEND_DEPLOYMENT_GUIDE.md)** - Complete reference
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Feature overview
- **[PLATFORM_GUIDE.md](./PLATFORM_GUIDE.md)** - Platform APIs

---

## 🆘 Need Help?

### Common Issues

| Issue | Solution |
|-------|----------|
| "Login failed" | Regenerate token with correct account |
| "Port already in use" | Change PORT in .env to 3002 |
| "Cannot find module" | Run `npm install` in backend folder |
| "No messages showing" | Make sure you're actually live on Twitch |
| "Token expired" | Regenerate access token |

### Debug Checklist

1. ✅ Backend terminal shows "Connected to Twitch"
2. ✅ You are live on Twitch
3. ✅ Channel name in .env matches your Twitch username
4. ✅ Access token is correct (no spaces/typos)
5. ✅ Port 3001 is not blocked by firewall

---

**🎉 That's it! You now have a working AI streamer companion connected to real Twitch chat!**
