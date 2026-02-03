# 🚀 Real-Time Chat Integration - Complete Guide

This guide explains how to connect your AI Streamer Companion to **real** Twitch and YouTube live streams.

---

## 📋 Quick Start (5 Minutes)

### 1. Start the Backend Server

```bash
cd backend
npm install
cp .env.example .env
```

### 2. Get Your Credentials

#### Twitch (TwitchTokenGenerator.com)
1. Visit: https://twitchtokengenerator.com
2. **Important:** Select these OAuth scopes:
   - ✅ `chat:read` - Read chat messages
   - ✅ `chat:edit` - Send messages to chat
   - ✅ `channel:moderate` - Moderation actions
   - ✅ `channel:read:polls` - Read poll data
   - ✅ `channel:manage:polls` - Create/manage polls
3. Click "Generate Token"
4. Save these values:
   - **Access Token** → `TWITCH_ACCESS_TOKEN`
   - **Refresh Token** → `TWITCH_REFRESH_TOKEN`
   - **Client ID** → `TWITCH_CLIENT_ID`

**Note:** Use the ACCESS TOKEN (not Client Secret) in your `.env` file.

#### YouTube (Google Cloud Console)
1. Visit: https://console.cloud.google.com
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create OAuth 2.0 credentials
5. Get your **API Key** → `YOUTUBE_API_KEY`
6. Get **Live Chat ID** from your stream URL

#### OpenAI (Platform)
1. Visit: https://platform.openai.com/api-keys
2. Create new API key
3. Copy to `OPENAI_API_KEY`

### 3. Configure Environment

Edit `backend/.env`:

```env
# Twitch - From TwitchTokenGenerator.com
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_ACCESS_TOKEN=your_access_token_here
TWITCH_REFRESH_TOKEN=your_refresh_token_here
TWITCH_CHANNEL=your_channel_name_lowercase

# YouTube - From Google Cloud Console
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_LIVE_CHAT_ID=your_live_chat_id

# OpenAI - From Platform
OPENAI_API_KEY=sk-your-key-here

# Server Config (leave as default)
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 4. Start Everything

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Connect in the UI

1. Open http://localhost:5173
2. Go to **Backend Server** tab
3. Click "Connect to Backend"
4. Backend URL: `ws://localhost:3001`
5. Wait for "Connected" status
6. Go to **Live Monitor** tab
7. Toggle "Start Monitoring"

**🎉 You're now connected to real chat!**

---

## 🔍 Troubleshooting

### "Cannot connect to backend"

**Problem:** WebSocket connection fails

**Solutions:**
- Ensure backend is running: `npm run dev` in `backend/` folder
- Check backend console for errors
- Verify WebSocket URL: `ws://localhost:3001` (not `http://`)
- Check firewall/antivirus settings

### "Twitch connection failed"

**Problem:** Backend can't connect to Twitch IRC

**Solutions:**
1. **Token Expired:**
   - Regenerate token at https://twitchtokengenerator.com
   - Copy new ACCESS_TOKEN and REFRESH_TOKEN to `.env`
   - Restart backend: `npm run dev`

2. **Wrong Scopes:**
   - Ensure you selected all required scopes (see Step 2 above)
   - Regenerate token with correct scopes

3. **Channel Name:**
   - Must be lowercase
   - Don't include `#` symbol
   - Example: `michaelinzo` not `#MichaelInzo`

4. **Using Client Secret instead of Access Token:**
   - Use the ACCESS TOKEN from TwitchTokenGenerator
   - NOT the Client Secret from Twitch Developer Console

### "YouTube API quota exceeded"

**Problem:** Hit YouTube's daily API quota

**Solutions:**
- YouTube has a daily quota of 10,000 units
- Each chat message fetch costs ~5-10 units
- Wait 24 hours for quota reset
- OR request quota increase in Google Cloud Console
- Reduce polling frequency if needed

### "OpenAI API error"

**Problem:** AI responses fail to generate

**Solutions:**
1. **Invalid API Key:**
   - Verify key starts with `sk-`
   - Check key is active in OpenAI Platform
   - Regenerate if needed

2. **No Credits:**
   - Add billing information in OpenAI Platform
   - Ensure account has credits

3. **Rate Limit:**
   - Using free tier? Rate limits are low
   - Upgrade to paid tier for higher limits

### "Backend connects but no chat messages appear"

**Problem:** Connected but no messages flow

**Solutions:**
1. **Twitch:**
   - Ensure you're actually live streaming
   - Test by typing in your own chat
   - Check backend console for message logs

2. **YouTube:**
   - Verify `YOUTUBE_LIVE_CHAT_ID` is correct
   - Get it from your stream URL while live
   - Check API quota hasn't been exceeded

3. **Backend Logs:**
   - Check backend console for errors
   - Look for message receive logs
   - Verify WebSocket connection is maintained

---

## 🏗️ Architecture Overview

```
┌─────────────────────────┐
│   Frontend (Browser)    │
│   React + TypeScript    │
│   localhost:5173        │
└───────────┬─────────────┘
            │
            │ WebSocket (ws://localhost:3001)
            │
┌───────────▼─────────────┐
│   Backend (Node.js)     │
│   Express + WebSocket   │
│   localhost:3001        │
└───────────┬─────────────┘
            │
    ┌───────┴────────┐
    │                │
┌───▼────┐      ┌────▼────┐
│ Twitch │      │ YouTube │
│  IRC   │      │LiveChat │
│  API   │      │  API    │
└────────┘      └─────────┘
```

### Communication Flow

1. **Frontend → Backend:**
   - User clicks "Connect" in Platforms tab
   - Frontend sends connection request via WebSocket
   - Backend receives and initiates platform connection

2. **Platform → Backend:**
   - Twitch/YouTube sends chat messages to backend
   - Backend processes messages
   - Backend generates AI response (if enabled)

3. **Backend → Frontend:**
   - Backend sends messages via WebSocket
   - Frontend displays in Live Monitor
   - Avatar reacts with emotions and speech

4. **Backend → Platform:**
   - Backend sends AI responses back to chat
   - Users see AI responses in real Twitch/YouTube chat

---

## 📝 Environment Variables Reference

### Required for Twitch

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `TWITCH_CLIENT_ID` | Your app's client ID | `abc123xyz...` | TwitchTokenGenerator.com |
| `TWITCH_ACCESS_TOKEN` | OAuth access token | `abc123xyz...` | TwitchTokenGenerator.com |
| `TWITCH_REFRESH_TOKEN` | OAuth refresh token | `def456uvw...` | TwitchTokenGenerator.com |
| `TWITCH_CHANNEL` | Your channel name (lowercase) | `michaelinzo` | Your Twitch username |

### Required for YouTube

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `YOUTUBE_API_KEY` | API key for YouTube Data API | `AIza...` | Google Cloud Console |
| `YOUTUBE_LIVE_CHAT_ID` | Live chat ID from stream | `EiEKG...` | Stream URL while live |

### Required for AI Responses

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` | platform.openai.com |

### Server Configuration

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `PORT` | Backend server port | `3001` | Don't change unless needed |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` | Update if deploying |

---

## 🚀 Production Deployment

### Local Development ✅
Already configured! Just run `npm run dev`

### Cloud Hosting Options

#### Heroku
```bash
cd backend
heroku create ai-streamer-backend
heroku config:set TWITCH_CLIENT_ID=...
# Set all other env vars
git push heroku main
```

#### Railway.app
```bash
cd backend
railway init
railway up
# Configure env vars in Railway dashboard
```

#### AWS EC2
1. Launch Ubuntu instance
2. Install Node.js 18+
3. Clone repository
4. Configure `.env`
5. Use PM2: `pm2 start npm --name "ai-streamer" -- start`
6. Configure security group to allow port 3001

#### DigitalOcean
1. Create Droplet (Ubuntu)
2. Install Node.js
3. Clone repository
4. Configure `.env`
5. Use systemd or PM2
6. Configure firewall

### Important for Production

1. **Environment Variables:**
   - Never commit `.env` to git
   - Use platform's secret management
   - Rotate tokens regularly

2. **HTTPS/WSS:**
   - Use secure WebSocket (wss://) in production
   - Configure SSL certificate
   - Update `FRONTEND_URL` to production domain

3. **Process Management:**
   - Use PM2 or systemd
   - Configure auto-restart on crash
   - Set up monitoring/logging

4. **Security:**
   - Enable rate limiting
   - Add authentication if needed
   - Keep dependencies updated
   - Use environment-specific configs

---

## 📚 Additional Resources

### Official Documentation
- **Twitch:** https://dev.twitch.tv/docs
- **YouTube:** https://developers.google.com/youtube/v3
- **OpenAI:** https://platform.openai.com/docs

### Project Documentation
- **[backend/README.md](./backend/README.md)** - Backend quick start
- **[BACKEND_DEPLOYMENT_GUIDE.md](./BACKEND_DEPLOYMENT_GUIDE.md)** - Full deployment guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues
- **[PLATFORM_GUIDE.md](./PLATFORM_GUIDE.md)** - Platform-specific setup

### Community & Support
- Check GitHub Issues for common problems
- Review backend console logs for errors
- Use `/health` endpoint to check backend status

---

## 🎯 Next Steps

Once you have real chat working:

1. **Customize AI Personality** - Make responses match your style
2. **Enable Voice Synthesis** - Have avatar speak responses
3. **Configure Vision AI** - Add gameplay commentary
4. **Set Up Performance Tracking** - Monitor your gaming metrics
5. **Create Custom Commands** - Add chat commands for your community
6. **Deploy to Production** - Move to cloud hosting
7. **Monitor Performance** - Set up logging and metrics

---

## ✅ Checklist

Before going live, verify:

- [ ] Backend server running without errors
- [ ] Frontend connected to backend (green badge)
- [ ] Twitch connected (if using Twitch)
- [ ] YouTube connected (if using YouTube)
- [ ] AI responses working (test in simulator first)
- [ ] Voice synthesis enabled and working
- [ ] Avatar emotions syncing with responses
- [ ] Chat messages appearing in Live Monitor
- [ ] Sentiment analysis showing data
- [ ] No console errors in browser or backend

**Ready to stream with your AI companion! 🎉**
