# 🚀 Quick Deployment Guide - 24/7 Streaming Backend

Get your AI Streamer Companion backend running 24/7 in under 10 minutes!

## 🎯 Choose Your Platform

| Platform | Best For | Free Tier | 24/7 Uptime | Setup Time |
|----------|----------|-----------|-------------|------------|
| **Railway** ⭐ | Hobby & Production | $5/month credit | ✅ Yes | 5 minutes |
| **Heroku** | Testing | 1000 hrs/month | ❌ Sleeps | 10 minutes |

**Recommendation:** Use Railway for 24/7 uptime without sleep mode!

---

## 🚂 Railway Deployment (Recommended)

### 1️⃣ Get Your Credentials

**Twitch Tokens:**
1. Go to https://twitchtokengenerator.com
2. Select scopes: `chat:read`, `chat:edit`, `channel:moderate`
3. Click "Generate Token"
4. Save: **Access Token**, **Refresh Token**, **Client ID**

**Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Save the key

### 2️⃣ Push to GitHub

```bash
cd backend
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/ai-streamer-backend.git
git push -u origin main
```

### 3️⃣ Deploy to Railway

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your `ai-streamer-backend` repo
5. Railway auto-detects Node.js and starts building!

### 4️⃣ Add Environment Variables

In Railway dashboard → **Variables** tab:

```env
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
TWITCH_ACCESS_TOKEN=your_access_token
TWITCH_REFRESH_TOKEN=your_refresh_token
TWITCH_CHANNEL=your_channel_name
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-3.0-flash-001
NODE_ENV=production
FRONTEND_URL=*
```

### 5️⃣ Get Your Backend URL

In Railway dashboard → **Settings** → **Domains**:
```
https://your-project.up.railway.app
```

### 6️⃣ Connect Frontend

1. Open your Spark app
2. Go to **Backend Server** tab
3. Enter URL: `wss://your-project.up.railway.app`
4. Click **Connect**
5. Go to **Platforms** tab
6. Connect to Twitch
7. Go to **Live Monitor** → **Start Monitoring**

**✅ You're Live!** Your backend is running 24/7!

---

## 🟣 Heroku Deployment (Alternative)

### 1️⃣ Install Heroku CLI

**macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**Windows/Linux:** https://devcenter.heroku.com/articles/heroku-cli

### 2️⃣ Deploy

```bash
cd backend
heroku login
heroku create my-ai-streamer-backend

# Set environment variables
heroku config:set TWITCH_CLIENT_ID=your_id
heroku config:set TWITCH_ACCESS_TOKEN=your_token
heroku config:set GEMINI_API_KEY=your_key
# ... set all variables

# Deploy
git push heroku main
```

### 3️⃣ Get Your URL

```bash
heroku info
# Look for "Web URL"
```

### 4️⃣ Connect Frontend

Use `wss://your-app.herokuapp.com`

**⚠️ Note:** Heroku free tier sleeps after 30 minutes of inactivity. Upgrade to Basic ($7/month) for 24/7 uptime.

---

## 🔧 Environment Variables Reference

### Required Variables

```env
# Twitch (Required)
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
TWITCH_ACCESS_TOKEN=your_twitch_access_token
TWITCH_CHANNEL=your_channel_name

# AI (Required)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.0-flash-001

# Server
NODE_ENV=production
FRONTEND_URL=*
```

### Optional Variables

```env
# Twitch OAuth Refresh
TWITCH_REFRESH_TOKEN=your_refresh_token

# YouTube Integration
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
```

---

## 🧪 Testing Your Deployment

### 1. Check Backend Status

Open in browser:
```
https://your-backend-url.com/health
```

Should return:
```json
{"status": "healthy", "timestamp": "..."}
```

### 2. Test WebSocket Connection

In frontend:
- Go to **Backend Server** tab
- Enter your backend URL (with `wss://`)
- Click "Connect"
- Look for green "Connected" status

### 3. Test Twitch Connection

- Go to **Platforms** tab
- Click "Connect to Twitch"
- Go to **Live Monitor** tab
- Toggle "Start Monitoring"
- Go live on Twitch and send a chat message
- Message should appear in Live Monitor!

---

## 📊 Monitoring Your Backend

### Railway

**View Logs:**
1. Railway dashboard → Your project
2. Click **Deployments** tab
3. View real-time logs

**Check Usage:**
1. Account menu → **Usage**
2. Monitor credit consumption

### Heroku

**View Logs:**
```bash
heroku logs --tail
```

**Check Status:**
```bash
heroku ps
```

---

## 🐛 Troubleshooting

### Connection Issues

**Problem:** "Failed to connect to backend"

**Solutions:**
1. ✅ Use `wss://` (not `ws://`)
2. ✅ Check backend is running (Railway/Heroku dashboard)
3. ✅ Verify URL is correct (no trailing slash)
4. ✅ Check CORS settings (FRONTEND_URL variable)

### Twitch Issues

**Problem:** "Twitch connection failed"

**Solutions:**
1. ✅ Verify tokens are correct
2. ✅ Check if tokens expired → regenerate at https://twitchtokengenerator.com
3. ✅ Ensure scopes include `chat:read` and `chat:edit`
4. ✅ Check channel name is lowercase

### Build Issues

**Problem:** "Build failed"

**Solutions:**
1. ✅ Test build locally: `npm run build`
2. ✅ Check package.json scripts are correct
3. ✅ Verify all dependencies are in package.json
4. ✅ Review build logs in Railway/Heroku

---

## 💰 Cost Comparison

### Railway (Recommended for 24/7)

| Plan | Cost | Hours | Sleep Mode | Best For |
|------|------|-------|------------|----------|
| Free | $5 credit/month | ~720 hours | ❌ No | Small projects |
| Hobby | Pay as you go | Unlimited | ❌ No | Production |

**Estimated monthly cost for 24/7:** ~$2-5

### Heroku

| Plan | Cost | Hours | Sleep Mode | Best For |
|------|------|-------|------------|----------|
| Free | $0 | 1000 | ✅ Yes | Testing |
| Eco | $5/month | 1000 shared | ✅ Yes | Hobby |
| Basic | $7/month | Unlimited | ❌ No | Production |

**For 24/7:** Need Basic plan at $7/month

---

## 🎯 Best Practices

### 1. Keep Tokens Secure
- ❌ Never commit `.env` file
- ✅ Use platform's environment variables
- ✅ Rotate tokens regularly

### 2. Monitor Usage
- ✅ Check logs daily for errors
- ✅ Monitor credit/hour usage
- ✅ Set up alerts for issues

### 3. Update Regularly
- ✅ Keep dependencies updated
- ✅ Monitor for security vulnerabilities
- ✅ Test before deploying updates

### 4. Backup Configuration
- ✅ Document all environment variables
- ✅ Keep tokens in password manager
- ✅ Store deployment configs in repo

---

## 🆘 Quick Links

### Railway
- **Dashboard:** https://railway.app/dashboard
- **Docs:** https://docs.railway.app
- **Status:** https://railway.app/status
- **Discord:** https://discord.gg/railway

### Heroku
- **Dashboard:** https://dashboard.heroku.com
- **Docs:** https://devcenter.heroku.com
- **Status:** https://status.heroku.com
- **Support:** https://help.heroku.com

### APIs
- **Twitch Token Generator:** https://twitchtokengenerator.com
- **Twitch Dev Console:** https://dev.twitch.tv/console
- **Gemini API:** https://aistudio.google.com/app/apikey
- **YouTube API:** https://console.cloud.google.com

---

## 🎉 Success Checklist

- [ ] Backend deployed to Railway or Heroku
- [ ] All environment variables configured
- [ ] Backend URL saved
- [ ] Frontend connected to backend
- [ ] Twitch connection tested
- [ ] Live chat monitoring working
- [ ] AI responses generating
- [ ] Logs showing no errors

**Congratulations!** Your AI Streamer Companion is now running 24/7! 🎮✨

---

## 📚 Detailed Guides

For detailed step-by-step instructions, see:
- **Railway:** [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
- **Heroku:** [HEROKU_DEPLOYMENT.md](./HEROKU_DEPLOYMENT.md)
- **Backend Setup:** [BACKEND_DEPLOYMENT_GUIDE.md](./BACKEND_DEPLOYMENT_GUIDE.md)
