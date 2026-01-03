# 🚀 Backend Server Deployment Guide

## Overview

This guide provides complete backend implementation for connecting your AI Streamer Companion to **real** Twitch and YouTube live streams. The frontend you've built is the control panel - this backend handles the actual platform connections.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Architecture](#backend-architecture)
3. [Twitch Integration](#twitch-integration)
4. [YouTube Integration](#youtube-integration)
5. [Server Implementation](#server-implementation)
6. [Deployment Options](#deployment-options)
7. [Security Best Practices](#security-best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts & APIs

1. **Twitch Developer Account**
   - Create app at: https://dev.twitch.tv/console/apps
   - Note your **Client ID** and **Client Secret**
   - Set OAuth Redirect URL: `http://localhost:3001/auth/twitch/callback`

2. **YouTube Developer Account**
   - Enable YouTube Data API v3: https://console.cloud.google.com/
   - Create OAuth 2.0 credentials
   - Note your **Client ID** and **Client Secret**

3. **OpenAI API Key** (for AI responses)
   - Get from: https://platform.openai.com/api-keys

### Software Requirements

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

---

## Backend Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend UI   │◄───────►│  Backend Server │
│  (This Spark)   │  WebSocket  │   (Node.js)  │
└─────────────────┘         └─────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              ┌──────────┐    ┌──────────┐   ┌──────────┐
              │  Twitch  │    │ YouTube  │   │  OpenAI  │
              │    IRC   │    │ Live API │   │   API    │
              └──────────┘    └──────────┘   └──────────┘
```

---

## Twitch Integration

### Step 1: Generate Your Access Token

**Use TwitchTokenGenerator.com with these settings:**

1. Go to: https://twitchtokengenerator.com
2. Select these scopes:
   - ✅ `chat:read` - Read chat messages
   - ✅ `chat:edit` - Send chat messages
   - ✅ `channel:moderate` - Moderation actions
   - ✅ `channel:read:polls` - Read polls
   - ✅ `channel:manage:polls` - Create polls
3. Click "Generate Token"
4. Save the **ACCESS TOKEN**, **REFRESH TOKEN**, and **CLIENT ID**

### Step 2: Backend Server Code (Twitch)

Create a new directory for your backend server:

```bash
mkdir ai-streamer-backend
cd ai-streamer-backend
npm init -y
```

Install required packages:

```bash
npm install express ws tmi.js dotenv cors axios openai
npm install --save-dev nodemon typescript @types/node @types/express @types/ws
```

Create `.env` file:

```env
# Twitch Configuration
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here
TWITCH_ACCESS_TOKEN=your_access_token_here
TWITCH_REFRESH_TOKEN=your_refresh_token_here
TWITCH_CHANNEL=michaelinzo

# YouTube Configuration
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_key_here

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Create `server.js`:

```javascript
const express = require('express');
const WebSocket = require('ws');
const tmi = require('tmi.js');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// WebSocket server for frontend communication
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

// Store connected frontend clients
let frontendClients = [];

wss.on('connection', (ws) => {
  console.log('✅ Frontend connected');
  frontendClients.push(ws);
  
  ws.on('close', () => {
    frontendClients = frontendClients.filter(client => client !== ws);
    console.log('❌ Frontend disconnected');
  });
  
  ws.on('message', (message) => {
    handleFrontendMessage(JSON.parse(message.toString()));
  });
});

// Broadcast to all connected frontends
function broadcastToFrontend(data) {
  frontendClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// ============================================
// TWITCH INTEGRATION
// ============================================

let twitchClient = null;
let isTwitchConnected = false;

// Twitch IRC client configuration
const twitchConfig = {
  options: { debug: true, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.TWITCH_CHANNEL,
    password: `oauth:${process.env.TWITCH_ACCESS_TOKEN}`
  },
  channels: [process.env.TWITCH_CHANNEL]
};

function connectToTwitch() {
  if (isTwitchConnected) {
    console.log('⚠️ Already connected to Twitch');
    return;
  }

  twitchClient = new tmi.Client(twitchConfig);

  twitchClient.on('message', async (channel, tags, message, self) => {
    if (self) return; // Ignore messages from the bot itself

    const chatMessage = {
      id: tags.id,
      username: tags['display-name'] || tags.username,
      content: message,
      platform: 'twitch',
      timestamp: new Date(),
      sender: 'user'
    };

    console.log(`💬 [Twitch] ${chatMessage.username}: ${message}`);

    // Send to frontend
    broadcastToFrontend({
      type: 'chat_message',
      data: chatMessage
    });

    // AI Response logic (optional auto-respond)
    if (shouldRespond(message)) {
      const aiResponse = await generateAIResponse(message);
      if (aiResponse) {
        sendTwitchMessage(aiResponse);
      }
    }
  });

  twitchClient.on('connected', (address, port) => {
    isTwitchConnected = true;
    console.log(`✅ Connected to Twitch at ${address}:${port}`);
    
    broadcastToFrontend({
      type: 'connection_status',
      platform: 'twitch',
      connected: true
    });
  });

  twitchClient.on('disconnected', (reason) => {
    isTwitchConnected = false;
    console.log(`❌ Disconnected from Twitch: ${reason}`);
    
    broadcastToFrontend({
      type: 'connection_status',
      platform: 'twitch',
      connected: false
    });
  });

  twitchClient.connect().catch(console.error);
}

function sendTwitchMessage(message) {
  if (twitchClient && isTwitchConnected) {
    twitchClient.say(process.env.TWITCH_CHANNEL, message)
      .then(() => {
        console.log(`🤖 [Twitch Bot]: ${message}`);
        
        // Broadcast to frontend
        broadcastToFrontend({
          type: 'chat_message',
          data: {
            id: Date.now().toString(),
            content: message,
            platform: 'twitch',
            timestamp: new Date(),
            sender: 'ai'
          }
        });
      })
      .catch(err => console.error('Failed to send Twitch message:', err));
  }
}

// Create Twitch Poll
async function createTwitchPoll(question, choices) {
  try {
    const response = await axios.post(
      'https://api.twitch.tv/helix/polls',
      {
        broadcaster_id: await getTwitchUserId(),
        title: question,
        choices: choices.map(choice => ({ title: choice })),
        duration: 60 // 60 seconds
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Twitch poll created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create Twitch poll:', error.response?.data || error.message);
    throw error;
  }
}

// Get Twitch User ID (needed for polls)
async function getTwitchUserId() {
  const response = await axios.get(
    `https://api.twitch.tv/helix/users?login=${process.env.TWITCH_CHANNEL}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        'Client-Id': process.env.TWITCH_CLIENT_ID
      }
    }
  );
  return response.data.data[0].id;
}

// ============================================
// YOUTUBE INTEGRATION
// ============================================

let youtubePollingInterval = null;
let lastYoutubeMessageId = null;
let isYoutubeConnected = false;

async function connectToYouTube() {
  if (isYoutubeConnected) {
    console.log('⚠️ Already connected to YouTube');
    return;
  }

  try {
    // Get live chat ID
    const liveChatId = await getYouTubeLiveChatId();
    
    if (!liveChatId) {
      throw new Error('No active live stream found');
    }

    isYoutubeConnected = true;
    console.log('✅ Connected to YouTube live chat');
    
    broadcastToFrontend({
      type: 'connection_status',
      platform: 'youtube',
      connected: true
    });

    // Poll for messages every 3 seconds
    youtubePollingInterval = setInterval(() => {
      pollYouTubeMessages(liveChatId);
    }, 3000);

  } catch (error) {
    console.error('❌ Failed to connect to YouTube:', error.message);
    isYoutubeConnected = false;
    
    broadcastToFrontend({
      type: 'connection_status',
      platform: 'youtube',
      connected: false,
      error: error.message
    });
  }
}

async function getYouTubeLiveChatId() {
  const response = await axios.get(
    'https://www.googleapis.com/youtube/v3/liveBroadcasts',
    {
      params: {
        part: 'snippet',
        broadcastStatus: 'active',
        key: process.env.YOUTUBE_API_KEY
      }
    }
  );

  const broadcasts = response.data.items;
  if (broadcasts.length === 0) {
    return null;
  }

  return broadcasts[0].snippet.liveChatId;
}

async function pollYouTubeMessages(liveChatId) {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/liveChat/messages',
      {
        params: {
          liveChatId: liveChatId,
          part: 'snippet,authorDetails',
          key: process.env.YOUTUBE_API_KEY
        }
      }
    );

    const messages = response.data.items;
    
    messages.forEach(msg => {
      if (!lastYoutubeMessageId || msg.id > lastYoutubeMessageId) {
        const chatMessage = {
          id: msg.id,
          username: msg.authorDetails.displayName,
          content: msg.snippet.displayMessage,
          platform: 'youtube',
          timestamp: new Date(msg.snippet.publishedAt),
          sender: 'user'
        };

        console.log(`💬 [YouTube] ${chatMessage.username}: ${chatMessage.content}`);

        broadcastToFrontend({
          type: 'chat_message',
          data: chatMessage
        });

        lastYoutubeMessageId = msg.id;

        // AI Response
        if (shouldRespond(chatMessage.content)) {
          generateAIResponse(chatMessage.content).then(aiResponse => {
            if (aiResponse) {
              sendYouTubeMessage(liveChatId, aiResponse);
            }
          });
        }
      }
    });
  } catch (error) {
    console.error('❌ Error polling YouTube messages:', error.message);
  }
}

async function sendYouTubeMessage(liveChatId, message) {
  try {
    await axios.post(
      'https://www.googleapis.com/youtube/v3/liveChat/messages',
      {
        snippet: {
          liveChatId: liveChatId,
          type: 'textMessageEvent',
          textMessageDetails: {
            messageText: message
          }
        }
      },
      {
        params: {
          part: 'snippet',
          key: process.env.YOUTUBE_API_KEY
        }
      }
    );

    console.log(`🤖 [YouTube Bot]: ${message}`);
    
    broadcastToFrontend({
      type: 'chat_message',
      data: {
        id: Date.now().toString(),
        content: message,
        platform: 'youtube',
        timestamp: new Date(),
        sender: 'ai'
      }
    });
  } catch (error) {
    console.error('❌ Failed to send YouTube message:', error.message);
  }
}

function disconnectYouTube() {
  if (youtubePollingInterval) {
    clearInterval(youtubePollingInterval);
    youtubePollingInterval = null;
  }
  isYoutubeConnected = false;
  lastYoutubeMessageId = null;
  
  console.log('❌ Disconnected from YouTube');
  
  broadcastToFrontend({
    type: 'connection_status',
    platform: 'youtube',
    connected: false
  });
}

// ============================================
// AI RESPONSE GENERATION
// ============================================

const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let aiPersonality = {
  name: 'Nova',
  bio: 'An energetic AI streamer companion',
  tone: 'Friendly and enthusiastic',
  interests: ['Gaming', 'Technology'],
  responseStyle: 'playful'
};

async function generateAIResponse(userMessage) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are ${aiPersonality.name}, ${aiPersonality.bio}. 
          Your tone is: ${aiPersonality.tone}. 
          Keep responses brief (1-2 sentences) and conversational like you're streaming.`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 100,
      temperature: 0.9
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ OpenAI error:', error.message);
    return null;
  }
}

function shouldRespond(message) {
  // Simple logic: respond to questions or mentions
  const triggers = ['?', 'nova', 'hey', 'hello'];
  return triggers.some(trigger => message.toLowerCase().includes(trigger));
}

// ============================================
// API ENDPOINTS
// ============================================

app.post('/api/connect/twitch', (req, res) => {
  try {
    connectToTwitch();
    res.json({ success: true, message: 'Connecting to Twitch...' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/connect/youtube', async (req, res) => {
  try {
    await connectToYouTube();
    res.json({ success: true, message: 'Connecting to YouTube...' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/disconnect/twitch', (req, res) => {
  if (twitchClient) {
    twitchClient.disconnect();
  }
  res.json({ success: true });
});

app.post('/api/disconnect/youtube', (req, res) => {
  disconnectYouTube();
  res.json({ success: true });
});

app.post('/api/message/send', (req, res) => {
  const { platform, message } = req.body;
  
  if (platform === 'twitch') {
    sendTwitchMessage(message);
  } else if (platform === 'youtube') {
    // Would need liveChatId stored globally
    res.status(400).json({ error: 'YouTube send not implemented yet' });
    return;
  }
  
  res.json({ success: true });
});

app.post('/api/poll/create', async (req, res) => {
  const { platform, question, choices } = req.body;
  
  try {
    if (platform === 'twitch') {
      const poll = await createTwitchPoll(question, choices);
      res.json({ success: true, poll });
    } else {
      res.status(400).json({ error: 'Platform not supported' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/personality/update', (req, res) => {
  aiPersonality = { ...aiPersonality, ...req.body };
  console.log('🔄 AI Personality updated:', aiPersonality);
  res.json({ success: true, personality: aiPersonality });
});

app.get('/api/status', (req, res) => {
  res.json({
    twitch: isTwitchConnected,
    youtube: isYoutubeConnected,
    personality: aiPersonality
  });
});

// ============================================
// HANDLE FRONTEND COMMANDS
// ============================================

function handleFrontendMessage(message) {
  const { type, data } = message;
  
  switch(type) {
    case 'connect_twitch':
      connectToTwitch();
      break;
    case 'connect_youtube':
      connectToYouTube();
      break;
    case 'disconnect_twitch':
      if (twitchClient) twitchClient.disconnect();
      break;
    case 'disconnect_youtube':
      disconnectYouTube();
      break;
    case 'send_message':
      if (data.platform === 'twitch') {
        sendTwitchMessage(data.message);
      }
      break;
    case 'update_personality':
      aiPersonality = { ...aiPersonality, ...data };
      break;
  }
}

console.log('🎮 AI Streamer Backend Ready!');
console.log(`📡 WebSocket server: ws://localhost:${PORT}`);
console.log(`🌐 REST API: http://localhost:${PORT}/api`);
```

Create `package.json` scripts:

```json
{
  "name": "ai-streamer-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## YouTube Integration

### Get YouTube API Key

1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key to your `.env` file

### OAuth Setup (Required for Posting Messages)

YouTube requires OAuth for posting messages. Add to your backend:

```javascript
// Add to server.js
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  'http://localhost:3001/auth/youtube/callback'
);

// Get auth URL
app.get('/auth/youtube', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.force-ssl']
  });
  res.redirect(authUrl);
});

// Handle callback
app.get('/auth/youtube/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  
  // Store tokens securely
  console.log('YouTube authenticated!');
  res.send('YouTube connected! You can close this window.');
});
```

---

## Server Implementation

### Running the Backend

```bash
# Install dependencies
npm install

# Create .env file (see above)
# Add all your tokens and API keys

# Start the server
npm run dev
```

You should see:

```
🚀 Backend server running on port 3001
🎮 AI Streamer Backend Ready!
📡 WebSocket server: ws://localhost:3001
🌐 REST API: http://localhost:3001/api
```

### Connect Frontend to Backend

Update your frontend `PlatformConnection.tsx` to connect to WebSocket:

```typescript
// Add to PlatformConnection component
useEffect(() => {
  const ws = new WebSocket('ws://localhost:3001');
  
  ws.onopen = () => {
    console.log('Connected to backend');
  };
  
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    if (message.type === 'chat_message') {
      // Add message to live feed
      console.log('New message:', message.data);
    }
    
    if (message.type === 'connection_status') {
      // Update connection status
      console.log('Connection status:', message);
    }
  };
  
  return () => ws.close();
}, []);
```

---

## Deployment Options

### Option 1: Local Development (Recommended for Testing)

```bash
# Terminal 1: Run backend
cd ai-streamer-backend
npm run dev

# Terminal 2: Run frontend (your Spark app)
npm run dev
```

### Option 2: Deploy to Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create ai-streamer-backend

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set TWITCH_CLIENT_ID=your_id
heroku config:set TWITCH_ACCESS_TOKEN=your_token
# ... set all other env vars

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# View logs
heroku logs --tail
```

### Option 3: Deploy to Railway.app

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your backend repository
4. Add environment variables in Railway dashboard
5. Deploy!

### Option 4: Deploy to AWS EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone your repo
git clone your-repo-url
cd ai-streamer-backend

# Install dependencies
npm install

# Install PM2 for process management
sudo npm install -g pm2

# Start with PM2
pm2 start server.js --name ai-streamer

# Save PM2 config
pm2 save
pm2 startup
```

### Option 5: Deploy to DigitalOcean

Similar to AWS EC2, but with easier UI:

1. Create a Droplet (Ubuntu)
2. SSH and install Node.js
3. Clone repo and run with PM2
4. Use NGINX as reverse proxy

---

## Security Best Practices

### 1. Never Commit Secrets

Add to `.gitignore`:

```
.env
node_modules/
*.log
.DS_Store
```

### 2. Use Environment Variables

Always use `process.env.VARIABLE_NAME` - never hardcode tokens.

### 3. Refresh Tokens

Twitch tokens expire. Implement refresh logic:

```javascript
async function refreshTwitchToken() {
  const response = await axios.post('https://id.twitch.tv/oauth2/token', {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: process.env.TWITCH_REFRESH_TOKEN
  });
  
  // Update token
  process.env.TWITCH_ACCESS_TOKEN = response.data.access_token;
  
  // Save to .env or database
  console.log('✅ Twitch token refreshed');
}

// Refresh every 4 hours
setInterval(refreshTwitchToken, 4 * 60 * 60 * 1000);
```

### 4. Rate Limiting

Add rate limiting to prevent spam:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 5. HTTPS in Production

Always use HTTPS for production deployments.

---

## Troubleshooting

### Twitch Connection Issues

**Problem:** "Login authentication failed"

**Solution:**
- Regenerate your access token at https://twitchtokengenerator.com
- Make sure you include the scopes: `chat:read` and `chat:edit`
- Verify your `.env` file has correct values
- Check that your token hasn't expired

**Problem:** "Unable to connect to chat"

**Solution:**
```javascript
// Add better error logging
twitchClient.on('error', (error) => {
  console.error('Twitch error:', error);
});
```

### YouTube Connection Issues

**Problem:** "No active live stream found"

**Solution:**
- Make sure you're actually live on YouTube
- Check that your API key has YouTube Data API v3 enabled
- Verify quota limits haven't been exceeded

**Problem:** "Cannot post messages"

**Solution:**
- You need OAuth authentication (not just API key) to post messages
- Follow the OAuth setup section above

### WebSocket Issues

**Problem:** Frontend not receiving messages

**Solution:**
```javascript
// Add debugging
ws.on('message', (data) => {
  console.log('Received:', data);
  // ... handle message
});
```

**Problem:** Connection keeps dropping

**Solution:**
```javascript
// Add reconnect logic in frontend
let ws;
function connectWebSocket() {
  ws = new WebSocket('ws://localhost:3001');
  
  ws.onclose = () => {
    console.log('Disconnected, reconnecting...');
    setTimeout(connectWebSocket, 3000);
  };
}
```

### OpenAI Issues

**Problem:** "Rate limit exceeded"

**Solution:**
- Add delays between requests
- Use `gpt-4o-mini` instead of `gpt-4` (cheaper)
- Implement response caching

---

## Testing Your Setup

### 1. Test Backend Connection

```bash
# Start backend
npm run dev

# In another terminal, test the API
curl http://localhost:3001/api/status
```

### 2. Test Twitch Connection

```bash
curl -X POST http://localhost:3001/api/connect/twitch
```

Then check your backend logs for:
```
✅ Connected to Twitch at irc-ws.chat.twitch.tv:443
```

### 3. Test Message Sending

```bash
curl -X POST http://localhost:3001/api/message/send \
  -H "Content-Type: application/json" \
  -d '{"platform": "twitch", "message": "Hello from the backend!"}'
```

Check your Twitch chat - you should see the message!

### 4. Monitor Logs

Keep your backend terminal open and watch for incoming messages when chatting in Twitch.

---

## Next Steps

1. **Run the backend server** with `npm run dev`
2. **Test Twitch connection** by clicking "Connect" in your frontend
3. **Go live** on Twitch at https://www.twitch.tv/michaelinzo
4. **Watch the magic happen** - messages should flow from Twitch → Backend → Frontend
5. **Test AI responses** by asking questions in chat

---

## Quick Start Checklist

- [ ] Create backend directory and install packages
- [ ] Get Twitch tokens from TwitchTokenGenerator.com
- [ ] Create `.env` file with all credentials
- [ ] Start backend server: `npm run dev`
- [ ] See "Connected to Twitch" in logs
- [ ] Go live on Twitch
- [ ] Test by sending chat messages
- [ ] See messages appear in backend logs and frontend
- [ ] Test AI responses by asking questions

---

## Support

If you encounter issues:

1. Check backend logs for errors
2. Verify all tokens in `.env` are correct
3. Make sure you're actually live on Twitch/YouTube
4. Check API rate limits
5. Try regenerating tokens

**Common Issue:** If it's not working, 99% of the time it's because:
- You're not actually live on Twitch/YouTube
- Your tokens are incorrect or expired
- Your `.env` file has typos

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR SETUP                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  YOU STREAMING ON TWITCH                                    │
│  https://twitch.tv/michaelinzo                              │
│         │                                                   │
│         │ Viewers send chat messages                        │
│         ▼                                                   │
│  ┌──────────────┐                                           │
│  │ Twitch IRC   │                                           │
│  │   Server     │                                           │
│  └──────┬───────┘                                           │
│         │                                                   │
│         │ IRC/WebSocket connection                          │
│         ▼                                                   │
│  ┌──────────────────────┐                                   │
│  │  BACKEND SERVER      │                                   │
│  │  (Node.js on your    │                                   │
│  │   computer/cloud)    │                                   │
│  │  - Reads messages    │                                   │
│  │  - Generates AI      │                                   │
│  │  - Sends responses   │                                   │
│  └──────┬───────────────┘                                   │
│         │                                                   │
│         │ WebSocket                                         │
│         ▼                                                   │
│  ┌──────────────────────┐                                   │
│  │  FRONTEND UI         │                                   │
│  │  (This Spark App)    │                                   │
│  │  - Dashboard         │                                   │
│  │  - Monitor chat      │                                   │
│  │  - Control AI        │                                   │
│  └──────────────────────┘                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

**🎉 You're ready to deploy! Start with local testing, then move to cloud hosting when ready.**
