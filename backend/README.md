# AI Streamer Backend Server

This is the backend server that enables **real** Twitch and YouTube live chat integration for the AI Streamer Companion frontend.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Twitch - Get from https://twitchtokengenerator.com
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
TWITCH_ACCESS_TOKEN=your_access_token
TWITCH_REFRESH_TOKEN=your_refresh_token
TWITCH_CHANNEL=your_channel_name

# YouTube - Get from https://console.cloud.google.com
YOUTUBE_API_KEY=your_api_key
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REFRESH_TOKEN=your_refresh_token
YOUTUBE_LIVE_CHAT_ID=your_live_chat_id

# OpenAI - Get from https://platform.openai.com
OPENAI_API_KEY=your_openai_api_key

# Server Config
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Build and Run

**Development mode** (with auto-restart):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server status and connection information.

### Status
```
GET /status
```
Returns detailed server information including uptime and active connections.

### WebSocket
```
ws://localhost:3001
```
WebSocket connection for real-time chat integration.

## 🔌 WebSocket Protocol

### Messages from Frontend to Backend

#### Connect to Twitch
```json
{
  "type": "connect_twitch",
  "payload": {
    "channel": "your_channel_name",
    "accessToken": "your_access_token",
    "clientId": "your_client_id"
  }
}
```

#### Connect to YouTube
```json
{
  "type": "connect_youtube",
  "payload": {
    "liveChatId": "your_live_chat_id",
    "apiKey": "your_api_key"
  }
}
```

#### Send Message
```json
{
  "type": "send_message",
  "payload": {
    "platform": "twitch",
    "message": "Hello chat!"
  }
}
```

#### Create Poll
```json
{
  "type": "create_poll",
  "payload": {
    "platform": "twitch",
    "question": "What game should we play next?",
    "options": ["Game A", "Game B", "Game C"],
    "duration": 60
  }
}
```

### Messages from Backend to Frontend

#### Chat Message
```json
{
  "type": "chat_message",
  "payload": {
    "platform": "twitch",
    "username": "viewer123",
    "message": "Great stream!",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "aiResponse": "Thanks for watching! 🎮"
  }
}
```

#### Connection Status
```json
{
  "type": "twitch_connected",
  "payload": {
    "channel": "your_channel",
    "status": "connected"
  }
}
```

## 🔧 Configuration

### Twitch Setup

1. Go to https://twitchtokengenerator.com
2. Select these scopes:
   - `chat:read`
   - `chat:edit`
   - `channel:moderate`
   - `channel:read:polls`
   - `channel:manage:polls`
3. Click "Generate Token"
4. Copy the Access Token, Refresh Token, and Client ID to your `.env` file

### YouTube Setup

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Create OAuth 2.0 credentials
5. Get your Live Chat ID from a live stream
6. Copy credentials to your `.env` file

### OpenAI Setup

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy to your `.env` file

## 📦 Project Structure

```
backend/
├── src/
│   ├── server.ts           # Main server file
│   ├── services/
│   │   ├── twitch.ts       # Twitch integration
│   │   ├── youtube.ts      # YouTube integration
│   │   └── ai.ts           # AI response generation
├── dist/                   # Compiled JavaScript (generated)
├── .env                    # Environment variables (create from .env.example)
├── .env.example            # Example environment file
├── package.json
├── tsconfig.json
└── README.md
```

## 🐛 Troubleshooting

### "Cannot connect to Twitch"
- Verify your access token is valid and not expired
- Check that your channel name is correct (lowercase, no #)
- Ensure you have the required OAuth scopes

### "YouTube API quota exceeded"
- YouTube has daily API quotas - wait 24 hours or request quota increase
- Reduce polling frequency if needed

### "OpenAI API error"
- Check your API key is valid
- Ensure you have credits in your OpenAI account
- Verify your API key has the correct permissions

### WebSocket connection fails
- Check the FRONTEND_URL in .env matches your frontend URL
- Verify CORS settings
- Check firewall/network settings

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.
