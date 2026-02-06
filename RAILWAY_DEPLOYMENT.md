# 🚂 Railway.app Deployment Guide for AI Streamer Backend

Railway is a modern deployment platform that's easier to use than Heroku and offers generous free tier with better performance.

## 📋 Prerequisites

1. **Railway Account** - Sign up at https://railway.app (free tier available)
2. **GitHub Account** - For connecting repository
3. **API Credentials Ready**:
   - Twitch Client ID & Secret
   - Twitch Access & Refresh Tokens
   - Google Gemini API Key

## 🌟 Why Railway?

- ✅ **Free $5 credit/month** (enough for small projects)
- ✅ **No sleep mode** on free tier
- ✅ **Automatic HTTPS & WebSocket support**
- ✅ **GitHub integration with auto-deploy**
- ✅ **Built-in environment variable management**
- ✅ **Better performance than Heroku free tier**
- ✅ **Simple pricing:** $0.000231/GB-hour, $0.20/GB egress

## 🚀 Method 1: Deploy from GitHub (Recommended)

### Step 1: Push Backend to GitHub

If you haven't already, push your backend code to GitHub:

```bash
cd backend

# Initialize git repository
git init

# Create .gitignore
echo "node_modules/
.env
dist/
*.log" > .gitignore

# Commit code
git add .
git commit -m "Initial backend setup for Railway"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/ai-streamer-backend.git
git branch -M main
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your `ai-streamer-backend` repository
6. Railway will automatically detect it's a Node.js project

### Step 3: Configure Environment Variables

In Railway dashboard:

1. Click on your project
2. Go to **Variables** tab
3. Add the following variables:

```env
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here
TWITCH_ACCESS_TOKEN=your_access_token_here
TWITCH_REFRESH_TOKEN=your_refresh_token_here
TWITCH_CHANNEL=your_channel_name

GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.0-flash-001

NODE_ENV=production
FRONTEND_URL=*
```

**Optional YouTube variables:**
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CLIENT_ID=your_youtube_client_id_here
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret_here
```

### Step 4: Deploy

Railway will automatically:
1. Detect Node.js
2. Run `npm install`
3. Run `npm run build`
4. Start your app with `npm start`

### Step 5: Get Your Deployment URL

1. Click on your service in Railway dashboard
2. Go to **Settings** tab
3. Under **Domains**, you'll see your Railway URL like:
   ```
   https://your-project-name.up.railway.app
   ```
4. **Save this URL** - you'll need it for your frontend!

### Step 6: Enable WebSocket Support

Railway automatically supports WebSockets - no additional configuration needed!

## 🖥️ Method 2: Deploy with Railway CLI

### Install Railway CLI

```bash
# macOS/Linux
npm i -g @railway/cli

# Or with Homebrew
brew install railway
```

### Login to Railway

```bash
railway login
```

### Deploy Your Backend

```bash
cd backend

# Initialize Railway project
railway init

# Link to existing project or create new
railway link

# Set environment variables
railway variables set TWITCH_CLIENT_ID=your_client_id
railway variables set TWITCH_ACCESS_TOKEN=your_token
railway variables set GEMINI_API_KEY=your_key
# ... set all other variables

# Deploy
railway up
```

## 🔗 Step 7: Connect Frontend to Railway Backend

1. Open your frontend app (the Spark app)
2. Go to **Backend Server** tab
3. Enter your Railway backend URL:
   ```
   wss://your-project-name.up.railway.app
   ```
   Note: Use `wss://` (secure WebSocket)
4. Click "Connect to Backend"
5. Configure platform connections

## 📊 Monitoring Your Deployment

### View Logs

In Railway dashboard:
1. Click on your service
2. Go to **Deployments** tab
3. Click on the latest deployment
4. View real-time logs

Or with CLI:
```bash
railway logs
```

### View Metrics

Railway dashboard shows:
- CPU usage
- Memory usage
- Network traffic
- Request count

### Check Service Status

```bash
railway status
```

## 🔄 Automatic Deploys

Railway automatically redeploys when you push to your main branch:

```bash
# Make changes to your code
git add .
git commit -m "Updated feature"
git push origin main

# Railway will automatically detect and deploy!
```

## 🔧 Troubleshooting

### Issue: Build Failed

**Check build logs in Railway dashboard**

Common causes:
- Missing dependencies in `package.json`
- TypeScript compilation errors
- Missing environment variables during build

**Solution:**
```bash
# Test build locally first
npm run build

# If successful, commit and push
git push origin main
```

### Issue: WebSocket Connection Refused

**Solution:**
1. Verify you're using `wss://` (not `ws://`)
2. Check Railway service is running (green status)
3. Make sure PORT is not hardcoded (Railway sets it automatically)
4. Verify FRONTEND_URL allows your domain

### Issue: Twitch/YouTube Connection Fails

**Solution:**
1. Check environment variables in Railway dashboard
2. Verify tokens haven't expired
3. View logs for specific errors: `railway logs`
4. Regenerate tokens at https://twitchtokengenerator.com

### Issue: Service Crashes on Startup

**Check logs:**
```bash
railway logs
```

**Common causes:**
- Missing required environment variables
- Database connection issues
- Port binding problems

**Solution:**
Make sure your server listens on Railway's PORT:
```typescript
const PORT = process.env.PORT || 3001;
```

## 💰 Pricing & Usage

### Free Tier
- **$5 free credits per month**
- **500 hours execution time**
- **100 GB egress**
- **No credit card required**
- **Great for hobby projects**

### Estimate Your Costs

For 24/7 operation:
- **Hours per month:** 720 hours
- **Memory usage:** ~512 MB (0.5 GB)
- **Cost:** ~$0.083/day or $2.50/month (within free tier!)

### Monitor Usage

1. Go to Railway dashboard
2. Click on your account (top right)
3. View **Usage** section
4. Track credits remaining

## 🎯 Advanced Features

### Custom Domains

1. Go to Railway dashboard
2. Click on your service
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter your custom domain
6. Update DNS records as shown

### Environment-Specific Variables

Create separate environments:

```bash
# Create staging environment
railway environment create staging

# Switch to staging
railway environment use staging

# Deploy to staging
railway up
```

### Add Database (if needed)

```bash
# Add PostgreSQL
railway add postgresql

# Add Redis
railway add redis
```

Railway automatically injects connection strings into your app!

### Scale Your Service

Railway automatically scales based on demand. For manual control:

1. Go to **Settings** tab
2. Adjust **Resources**:
   - CPU: 0.5-8 vCPU
   - Memory: 512 MB - 8 GB

## 🔐 Security Best Practices

1. **Never commit secrets** - Use Railway environment variables
2. **Use Railway's automatic HTTPS** - Free SSL included
3. **Rotate tokens regularly** - Update in Variables tab
4. **Enable GitHub security features** - Dependabot, secret scanning
5. **Review access logs** - Monitor for suspicious activity

## 📝 Useful Railway Commands

```bash
# View all projects
railway list

# Link to project
railway link

# View environment variables
railway variables

# Set variable
railway variables set KEY=value

# View logs
railway logs

# Open service in browser
railway open

# Restart service
railway restart

# Delete service
railway delete
```

## 🚀 Deploy Updates

Every push to main branch auto-deploys. Or manually:

```bash
railway up
```

To rollback:
1. Go to Railway dashboard
2. Click **Deployments**
3. Select previous deployment
4. Click **Rollback**

## 🎯 Performance Optimization

### 1. Enable Build Caching

Railway automatically caches `node_modules` between builds.

### 2. Health Checks

Railway automatically monitors your service. Optional custom health endpoint:

```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});
```

### 3. Optimize Start Time

In `package.json`:
```json
{
  "scripts": {
    "start": "NODE_ENV=production node dist/server.js"
  }
}
```

## 🆚 Railway vs Heroku Comparison

| Feature | Railway | Heroku Free |
|---------|---------|-------------|
| Price | $5 credit/month | 1000 hours/month |
| Sleep mode | No sleep | Sleeps after 30min |
| Build time | Fast | Slow |
| Deploy | Auto from GitHub | Manual or GitHub |
| SSL | Free automatic | Free automatic |
| WebSocket | Native support | Supported |
| Logs | Persistent | Limited |
| Databases | Easy add-ons | Paid add-ons |
| Best for | Hobby & production | Testing only |

**Verdict:** Railway is better for 24/7 operation on free tier!

## 🎉 You're Live!

Your backend is now running 24/7 on Railway!

**Next Steps:**
1. Test connection from frontend
2. Monitor usage in Railway dashboard
3. Set up GitHub auto-deploys
4. Add custom domain (optional)
5. Go live on Twitch!

## 📞 Support

If you encounter issues:

1. **Check logs:** `railway logs` or dashboard
2. **Review environment variables:** Railway dashboard → Variables
3. **Restart service:** Railway dashboard → Restart
4. **Check Railway status:** https://railway.app/status
5. **Community Discord:** https://discord.gg/railway
6. **Docs:** https://docs.railway.app

---

**Pro Tip:** Railway doesn't sleep your app like Heroku does, so your 24/7 streaming bot stays always-on even on the free tier! 🎮✨
