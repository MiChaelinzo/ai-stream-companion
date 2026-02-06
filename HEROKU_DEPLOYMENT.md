# 🚀 Heroku Deployment Guide for AI Streamer Backend

This guide will help you deploy your AI Streamer Companion backend to Heroku for 24/7 streaming.

## 📋 Prerequisites

1. **Heroku Account** - Sign up at https://heroku.com (free tier available)
2. **Heroku CLI** - Install from https://devcenter.heroku.com/articles/heroku-cli
3. **Git** - For deploying code
4. **API Credentials Ready**:
   - Twitch Client ID & Secret
   - Twitch Access & Refresh Tokens
   - Google Gemini API Key

## 🔧 Step 1: Install Heroku CLI

### macOS
```bash
brew tap heroku/brew && brew install heroku
```

### Windows
Download and install from: https://devcenter.heroku.com/articles/heroku-cli

### Linux
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

## 🔑 Step 2: Login to Heroku

```bash
heroku login
```

This will open your browser for authentication.

## 📦 Step 3: Prepare Your Backend

Navigate to the backend directory:

```bash
cd backend
```

Initialize git if not already done:

```bash
git init
git add .
git commit -m "Initial backend setup for Heroku"
```

## 🌐 Step 4: Create Heroku App

```bash
# Create a new Heroku app (it will generate a unique name)
heroku create

# Or specify your own name
heroku create my-ai-streamer-backend
```

You'll see output like:
```
Creating app... done, ⬢ my-ai-streamer-backend
https://my-ai-streamer-backend.herokuapp.com/ | https://git.heroku.com/my-ai-streamer-backend.git
```

**Save this URL** - you'll need it to connect your frontend!

## 🔐 Step 5: Set Environment Variables

Set all your environment variables on Heroku:

```bash
# Twitch Configuration
heroku config:set TWITCH_CLIENT_ID=your_client_id_here
heroku config:set TWITCH_CLIENT_SECRET=your_client_secret_here
heroku config:set TWITCH_ACCESS_TOKEN=your_access_token_here
heroku config:set TWITCH_REFRESH_TOKEN=your_refresh_token_here
heroku config:set TWITCH_CHANNEL=your_channel_name

# Google Gemini Configuration
heroku config:set GEMINI_API_KEY=your_gemini_api_key_here
heroku config:set GEMINI_MODEL=gemini-3.0-flash-001

# Server Configuration
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=*

# Optional: YouTube Configuration
heroku config:set YOUTUBE_API_KEY=your_youtube_api_key_here
```

### Get Your Tokens

**Twitch Tokens:**
1. Go to https://twitchtokengenerator.com
2. Select scopes: `chat:read`, `chat:edit`, `channel:moderate`
3. Copy the Access Token, Refresh Token, and Client ID

**Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Copy the key

## 🚀 Step 6: Deploy to Heroku

```bash
# Deploy your code
git push heroku main

# Or if you're on master branch
git push heroku master
```

You'll see the build process:
```
remote: Building source:
remote: -----> Node.js app detected
remote: -----> Installing dependencies
remote: -----> Build succeeded!
remote: -----> Launching...
remote: https://my-ai-streamer-backend.herokuapp.com/ deployed to Heroku
```

## ✅ Step 7: Verify Deployment

Check if your app is running:

```bash
# Open your app in browser
heroku open

# View logs
heroku logs --tail
```

You should see in the logs:
```
🚀 Backend server running on port 12345
🎮 AI Streamer Backend Ready!
📡 WebSocket server: wss://your-app-name.herokuapp.com
```

## 🔗 Step 8: Connect Frontend to Heroku Backend

1. Open your frontend app (the Spark app)
2. Go to **Backend Server** tab
3. Enter your Heroku backend URL:
   ```
   wss://your-app-name.herokuapp.com
   ```
   Note: Use `wss://` (secure WebSocket) instead of `ws://`
4. Click "Connect to Backend"
5. Once connected, configure your platform connections

## 📊 Step 9: Monitor Your Backend

### View Real-Time Logs
```bash
heroku logs --tail
```

### Check App Status
```bash
heroku ps
```

### View All Config Variables
```bash
heroku config
```

### Restart Your App
```bash
heroku restart
```

## 🔧 Troubleshooting

### Issue: "Application Error"

**Check logs:**
```bash
heroku logs --tail
```

**Common causes:**
- Missing environment variables
- Build failed
- Port binding issue (Heroku automatically sets PORT)

### Issue: WebSocket Connection Failed

**Solution:**
1. Make sure you're using `wss://` (not `ws://`)
2. Check if dyno is running: `heroku ps`
3. Verify FRONTEND_URL allows your domain

### Issue: Twitch Connection Fails

**Solution:**
1. Verify all Twitch env vars are set: `heroku config`
2. Check if tokens are expired - regenerate at https://twitchtokengenerator.com
3. View logs for specific error: `heroku logs --tail`

### Issue: Out of Free Dyno Hours

**Solution:**
- Heroku free tier has 550 hours/month (reduced to 450 if not verified)
- Add a credit card for 1000 hours/month
- Or upgrade to Eco plan ($5/month for 1000 hours)

## 💰 Pricing & Plans

### Free Tier (Eco Dynos)
- **Cost:** $0/month
- **Hours:** 1000 hours/month with credit card verification
- **Sleep:** Apps sleep after 30 mins of inactivity
- **Best for:** Testing and development

### Eco Plan
- **Cost:** $5/month
- **Hours:** 1000 hours/month shared across all apps
- **Sleep:** Apps can sleep
- **Best for:** Small projects and hobby apps

### Basic Plan
- **Cost:** $7/month per dyno
- **No sleep:** Always-on
- **Best for:** Production 24/7 streaming

**For 24/7 uptime, you need Basic plan or higher.**

## 🔄 Updating Your Backend

When you make changes to your backend code:

```bash
# Commit changes
git add .
git commit -m "Updated backend features"

# Deploy to Heroku
git push heroku main

# View deployment logs
heroku logs --tail
```

## 🎯 Advanced Configuration

### Enable Automatic Deploys from GitHub

1. Go to https://dashboard.heroku.com
2. Select your app
3. Go to **Deploy** tab
4. Connect to GitHub repository
5. Enable **Automatic Deploys** from main branch

### Add Custom Domain

```bash
heroku domains:add www.yourdomain.com
```

### Scale Dynos

```bash
# Scale up to 2 dynos
heroku ps:scale web=2

# Scale down to 1
heroku ps:scale web=1
```

### Add Monitoring

```bash
# View metrics
heroku logs --tail

# Add New Relic monitoring (free tier available)
heroku addons:create newrelic:wayne
```

## 🔐 Security Best Practices

1. **Never commit `.env` file** - Always use Heroku config vars
2. **Use HTTPS/WSS** - Heroku provides free SSL
3. **Rotate tokens regularly** - Update via `heroku config:set`
4. **Enable 2FA** on Heroku account
5. **Review app access** regularly in Heroku dashboard

## 📝 Useful Heroku Commands

```bash
# View all apps
heroku apps

# Rename app
heroku apps:rename new-name

# View current config
heroku config

# Set single config var
heroku config:set KEY=value

# Unset config var
heroku config:unset KEY

# Open app in browser
heroku open

# SSH into dyno
heroku run bash

# View app info
heroku info

# Destroy app (careful!)
heroku apps:destroy --app app-name
```

## 🎉 You're Live!

Your backend is now running 24/7 on Heroku! 

**Next Steps:**
1. Test the connection from your frontend
2. Go live on Twitch
3. Monitor logs for any issues
4. Consider upgrading to Basic plan for always-on service

## 📞 Support

If you encounter issues:

1. **Check logs first:** `heroku logs --tail`
2. **Verify config:** `heroku config`
3. **Restart app:** `heroku restart`
4. **Check Heroku status:** https://status.heroku.com
5. **Review docs:** https://devcenter.heroku.com

---

**Pro Tip:** Set up a monitoring service like UptimeRobot (free) to ping your Heroku app every 5 minutes to prevent it from sleeping on free tier!
