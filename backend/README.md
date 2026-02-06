# 🎮 AI Streamer Companion Backend Server

Production-ready backend server for connecting your AI Streamer Companion to **real** Twitch and YouTube live streams with 24/7 operation support.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
nano .env

# Build TypeScript
npm run build

# Start development server
npm run dev
```

Server runs on `http://localhost:3001`

### Deploy to Cloud (24/7)

Choose your platform:

#### Railway (Recommended) ⭐
- ✅ $5 free credit/month
- ✅ No sleep mode
- ✅ Auto-deploy from GitHub
- ✅ 5 minute setup

See [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md)

#### Heroku
- ✅ Free tier available
- ⚠️ Sleeps after 30 minutes
- ✅ Easy deployment

See [HEROKU_DEPLOYMENT.md](../HEROKU_DEPLOYMENT.md)

## 📋 Features

### Twitch Integration
- ✅ Real-time IRC chat connection
- ✅ Send/receive messages
- ✅ Create polls
- ✅ Auto-reconnect
- ✅ Token refresh

### YouTube Integration  
- ✅ Live chat polling
- ✅ Send/receive messages
- ✅ OAuth authentication

### AI Features
- ✅ Google Gemini 3 integration
- ✅ Personality-based responses
- ✅ Sentiment analysis
- ✅ Context-aware replies

### WebSocket Server
- ✅ Real-time frontend communication
- ✅ Auto-reconnect
- ✅ Message broadcasting
- ✅ Connection status updates

## 🔧 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Twitch (Required)
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here
TWITCH_ACCESS_TOKEN=your_access_token_here
TWITCH_REFRESH_TOKEN=your_refresh_token_here
TWITCH_CHANNEL=your_channel_name

# Google Gemini (Required)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.0-flash-001

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Optional: YouTube
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### Getting API Keys

**Twitch:**
1. Go to https://twitchtokengenerator.com
2. Select scopes: `chat:read`, `chat:edit`, `channel:moderate`
3. Generate and save tokens

**Gemini:**
1. Go to https://aistudio.google.com/app/apikey
2. Create API key
3. Copy to .env

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.ts          # Main server file
│   └── services/          # Service modules
│       ├── twitch.ts      # Twitch integration
│       ├── youtube.ts     # YouTube integration
│       └── ai.ts          # Gemini AI integration
├── dist/                  # Compiled JavaScript
├── .env.example           # Environment template
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── Procfile               # Heroku config
├── railway.json           # Railway config
├── nixpacks.toml          # Railway build config
├── app.json               # Heroku app manifest
└── Dockerfile             # Docker config
```

## 🔌 API Endpoints

### REST API

```bash
GET  /health                     # Health check
GET  /api/status                 # Connection status
POST /api/connect/twitch         # Connect to Twitch
POST /api/connect/youtube        # Connect to YouTube  
POST /api/disconnect/twitch      # Disconnect Twitch
POST /api/disconnect/youtube     # Disconnect YouTube
POST /api/message/send           # Send chat message
POST /api/poll/create            # Create poll
POST /api/personality/update     # Update AI personality
```

### WebSocket Events

**From Backend to Frontend:**
```typescript
{ type: 'chat_message', data: ChatMessage }
{ type: 'connection_status', platform: string, connected: boolean }
{ type: 'poll_created', data: Poll }
{ type: 'error', message: string }
```

**From Frontend to Backend:**
```typescript
{ type: 'connect_twitch' }
{ type: 'connect_youtube' }
{ type: 'disconnect_twitch' }
{ type: 'disconnect_youtube' }
{ type: 'send_message', data: { platform, message } }
{ type: 'update_personality', data: Personality }
```

## 🧪 Testing

### Test Backend Connection
```bash
curl http://localhost:3001/health
```

Response:
```json
{"status": "healthy", "timestamp": "2024-01-01T00:00:00.000Z"}
```

### Test Twitch Connection
```bash
curl -X POST http://localhost:3001/api/connect/twitch
```

### Test Message Sending
```bash
curl -X POST http://localhost:3001/api/message/send \
  -H "Content-Type: application/json" \
  -d '{"platform": "twitch", "message": "Hello from API!"}'
```

## 📊 Monitoring

### View Logs

**Local:**
```bash
npm run dev
# Logs appear in terminal
```

**Railway:**
```bash
railway logs
# Or view in Railway dashboard
```

**Heroku:**
```bash
heroku logs --tail
```

### Health Check

Backend exposes `/health` endpoint for monitoring:

```typescript
GET /health

Response:
{
  "status": "healthy",
  "uptime": 12345,
  "connections": {
    "twitch": true,
    "youtube": false
  }
}
```

## 🔐 Security

1. **Never commit `.env` file**
   ```bash
   # Already in .gitignore
   echo ".env" >> .gitignore
   ```

2. **Use environment variables**
   ```typescript
   // ✅ Good
   const token = process.env.TWITCH_ACCESS_TOKEN
   
   // ❌ Bad
   const token = "abc123"
   ```

3. **Rotate tokens regularly**
   - Twitch tokens expire
   - Regenerate at https://twitchtokengenerator.com

4. **Use HTTPS/WSS in production**
   - Railway/Heroku provide automatic SSL
   - Always use `wss://` for WebSocket

## 🐛 Troubleshooting

### Twitch Connection Issues

**Error:** "Login authentication failed"

**Solution:**
1. Regenerate token at https://twitchtokengenerator.com
2. Verify scopes: `chat:read`, `chat:edit`
3. Check `.env` for typos
4. Ensure channel name is lowercase

### WebSocket Connection Failed

**Error:** "WebSocket connection refused"

**Solution:**
1. Check server is running
2. Verify PORT is not in use
3. Check firewall settings
4. Use correct protocol (ws:// for local, wss:// for production)

### AI Response Issues

**Error:** "Gemini API error"

**Solution:**
1. Verify API key is correct
2. Check quota limits at https://aistudio.google.com
3. Ensure model name is correct: `gemini-3.0-flash-001`

## 📚 Documentation

- **[Deployment Quick Start](../DEPLOYMENT_QUICKSTART.md)** - Get deployed in 10 minutes
- **[Railway Deployment](../RAILWAY_DEPLOYMENT.md)** - Detailed Railway guide
- **[Heroku Deployment](../HEROKU_DEPLOYMENT.md)** - Detailed Heroku guide
- **[Backend Integration](../BACKEND_DEPLOYMENT_GUIDE.md)** - Full backend guide

## 🛠️ Development

### Build TypeScript
```bash
npm run build
```

### Watch Mode
```bash
npm run dev
# Auto-restart on file changes
```

### Production Mode
```bash
npm run build
npm start
```

## 📦 Dependencies

### Core
- `express` - Web server
- `ws` - WebSocket server
- `tmi.js` - Twitch IRC client
- `@google/generative-ai` - Gemini AI
- `googleapis` - YouTube API

### Dev
- `typescript` - Type safety
- `nodemon` - Auto-restart
- `ts-node` - TypeScript execution

## 🎯 Best Practices

1. **Use TypeScript** - Type safety prevents runtime errors
2. **Error Handling** - Wrap API calls in try-catch
3. **Logging** - Log all important events
4. **Reconnection** - Auto-reconnect on disconnects
5. **Rate Limiting** - Respect API rate limits
6. **Token Refresh** - Auto-refresh expired tokens

## 🆘 Support

**Issues?**
1. Check logs first
2. Verify environment variables
3. Test API endpoints
4. Review documentation
5. Check API status pages

**Common Issues:**
- Not live on Twitch → Can't receive messages
- Token expired → Regenerate at twitchtokengenerator.com
- Wrong channel name → Must be lowercase
- API quota exceeded → Check usage limits

## 📄 License

MIT License - See LICENSE file

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

**Ready to deploy?** See [DEPLOYMENT_QUICKSTART.md](../DEPLOYMENT_QUICKSTART.md) to get your backend running 24/7 in under 10 minutes! 🚀
