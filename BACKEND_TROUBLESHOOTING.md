# 🔧 Backend Connection Troubleshooting Guide

## "I'm connected via backend and live streaming on Twitch but nothing is happening"

This guide will help you diagnose and fix issues when your backend is connected but you're not seeing chat messages or AI responses.

---

## 🎯 Quick Diagnostic Checklist

Run through these checks in order:

### ✅ Step 1: Verify Backend Server is Running

**Check your backend terminal:**
```bash
cd backend
npm run dev
```

**You should see:**
```
🚀 AI Streamer Backend Server running on port 3001
📡 WebSocket server ready
🌐 Frontend URL: http://localhost:5173
💚 Health check: http://localhost:3001/health
✅ Google Gemini gemini-3.0-flash-001 initialized successfully
```

❌ **If you see warnings about GEMINI_API_KEY:**
- Your `.env` file is missing or incomplete
- See "Step 2: Configure Environment Variables" below

---

### ✅ Step 2: Configure Environment Variables

**Check your `.env` file exists:**
```bash
cd backend
ls -la | grep .env
```

**You should see:** `.env` file (not just `.env.example`)

**If missing, create it:**
```bash
cp .env.example .env
```

**Edit `.env` with your credentials:**
```bash
# Gemini API Configuration (REQUIRED)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.0-flash-001

# Twitch Configuration
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CLIENT_SECRET=your_client_secret_here
TWITCH_ACCESS_TOKEN=your_access_token_here
TWITCH_CHANNEL=michaelinzo

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:5173
```

⚠️ **Important:** Replace ALL placeholder values!

---

### ✅ Step 3: Get Gemini API Key (REQUIRED)

The backend **requires** a Gemini API key to generate AI responses.

**Get your key:**
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Select project or create new one
4. Copy the API key
5. Paste into `.env` file: `GEMINI_API_KEY=your_actual_key_here`
6. Restart backend server

**Verify it's working:**
- Backend terminal should show: `✅ Google Gemini gemini-3.0-flash-001 initialized successfully`
- Not: `⚠️ Google Gemini API key not configured`

---

### ✅ Step 4: Connect Frontend to Backend

**In the web app:**
1. Go to **Backend Server** tab
2. Verify URL is `ws://localhost:3001` (default)
3. Click "Connect to Backend"
4. Watch for success message

**Check browser console (F12):**
```
✅ Connected to backend server
```

❌ **If you see connection errors:**
- Backend server not running → Start it (Step 1)
- Wrong URL → Verify `ws://localhost:3001`
- Firewall blocking → Temporarily disable to test
- Port already in use → Change PORT in `.env` to 3002

---

### ✅ Step 5: Connect to Twitch Chat

**Get your Twitch credentials:**
1. Go to: https://twitchtokengenerator.com
2. Select these scopes:
   - ✅ `chat:read` (Read chat messages)
   - ✅ `chat:edit` (Send chat messages)
3. Click "Generate Token"
4. Authorize with your Twitch account
5. Copy these values:
   - **Access Token** (long string)
   - **Client ID** (provided by the site)

**Update `.env` file:**
```bash
TWITCH_ACCESS_TOKEN=your_access_token_from_above
TWITCH_CLIENT_ID=your_client_id_from_above
TWITCH_CHANNEL=michaelinzo
```

**Restart backend server:**
```bash
# Press Ctrl+C to stop
npm run dev
```

---

### ✅ Step 6: Verify Twitch Connection

**Backend terminal should show:**
```
✅ Connected to Twitch channel: michaelinzo
```

❌ **If you see errors:**

**Error: "Login authentication failed"**
- Your access token is wrong or expired
- Regenerate token at twitchtokengenerator.com
- Make sure you authorized the correct Twitch account

**Error: "Unable to connect to chat"**
- Check your internet connection
- Verify channel name is correct (lowercase, no #)
- Twitch IRC may be temporarily down

**Error: "No response from backend"**
- Frontend not connected to backend
- Go to "Backend Server" tab and click "Connect"

---

### ✅ Step 7: Test Chat Messages

**Send a test message in your Twitch chat:**
1. Go to: https://www.twitch.tv/michaelinzo/chat
2. Type: "Hello Nova!"
3. Send the message

**Watch backend terminal:**
```
Message from YourUsername: Hello Nova!
```

**Watch frontend "Live Monitor" tab:**
- Message should appear in Live Chat Feed
- AI should respond within 5-10 seconds (30% chance)

---

### ✅ Step 8: Verify AI Responses

**Backend terminal should show:**
```
AI Response: Hey! 👋 Thanks for saying hi!
```

**Twitch chat should show:**
- Nova (your AI) posting a response

❌ **If AI doesn't respond:**

**Check Gemini API key:**
```bash
# Backend terminal should NOT show:
⚠️ Google Gemini API key not configured
```

**If you see that warning:**
- Add GEMINI_API_KEY to `.env` file
- Get key from: https://aistudio.google.com/app/apikey
- Restart backend

**AI only responds to 30% of messages:**
- This is intentional to avoid spam
- Send multiple messages to test
- Or temporarily edit `backend/src/services/ai.ts` line 47:
  ```typescript
  const shouldRespond = Math.random() > 0.7; // Change to > 0 to respond to all
  ```

---

## 🐛 Common Issues & Solutions

### Issue: "Backend connected but no chat messages appear"

**Cause:** Backend server not actually connected to Twitch IRC

**Solutions:**
1. Check backend terminal for connection confirmation
2. Verify `.env` has correct TWITCH_ACCESS_TOKEN
3. Ensure TWITCH_CHANNEL matches your channel name (lowercase)
4. Regenerate Twitch token if expired (60-day expiration)
5. Check Twitch status: https://status.twitch.tv

---

### Issue: "Chat messages appear but AI never responds"

**Cause:** Gemini API not configured or quota exceeded

**Solutions:**
1. Add GEMINI_API_KEY to `.env` file
2. Restart backend server
3. Check for API errors in backend terminal
4. Verify API key at: https://aistudio.google.com/
5. Check API quota usage (free tier has limits)
6. Wait 1 minute and try again (rate limiting)

---

### Issue: "WebSocket connection failed"

**Cause:** Backend server not running or firewall blocking

**Solutions:**
1. Start backend: `cd backend && npm run dev`
2. Check PORT in `.env` matches frontend URL
3. Temporarily disable firewall to test
4. Try different port (change PORT in `.env` to 3002)
5. Update frontend URL: Backend tab → Enter new ws://localhost:3002

---

### Issue: "Token expired or invalid"

**Cause:** Twitch access tokens expire after ~60 days

**Solutions:**
1. Go to: https://twitchtokengenerator.com
2. Generate new token with same scopes
3. Copy new ACCESS_TOKEN to `.env`
4. Restart backend server
5. Reconnect frontend to backend

---

### Issue: "API quota exceeded"

**Cause:** Too many Gemini API calls

**Solutions:**
1. Wait for quota to reset (daily limit)
2. Reduce message frequency in Stream Settings
3. Check usage at: https://aistudio.google.com/
4. Upgrade to paid tier if needed
5. Use simulation mode instead for testing

---

## 📊 Connection Flow Diagram

```
┌─────────────┐         WebSocket         ┌─────────────┐
│   Frontend  │ ◄──────────────────────► │   Backend   │
│   (React)   │    ws://localhost:3001    │  (Node.js)  │
└─────────────┘                           └──────┬──────┘
                                                 │
                                    ┌────────────┼────────────┐
                                    │                         │
                               Twitch IRC                Gemini API
                          (Chat Messages)          (AI Responses)
                                    │                         │
                              Your Channel              AI Generation
                             michaelinzo
```

**Each connection must work:**
1. ✅ Frontend → Backend (WebSocket)
2. ✅ Backend → Twitch (IRC)
3. ✅ Backend → Gemini (API)

**If ANY connection fails, the system won't work!**

---

## 🧪 Testing Steps (In Order)

### Test 1: Backend Server Health

```bash
curl http://localhost:3001/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-...",
  "connections": {
    "twitch": true,
    "youtube": false,
    "clients": 1
  }
}
```

---

### Test 2: Frontend Connection

**Browser console (F12):**
```javascript
// Check WebSocket status
console.log('Backend connected:', backendService.isConnected());
```

**Should return:** `true`

---

### Test 3: Twitch Chat

**Send message in Twitch chat**

**Backend terminal should immediately show:**
```
Message from YourUsername: your message here
```

**If not:** Backend not connected to Twitch IRC

---

### Test 4: AI Response

**Send multiple messages in Twitch chat**

**Backend terminal should eventually show:**
```
AI Response: [generated response]
```

**If never happens:** Gemini API not configured

---

## 📝 Environment File Template

Copy this complete template to your `.env`:

```bash
# ================================
# GEMINI API (REQUIRED FOR AI)
# ================================
# Get your key: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIza...your_key_here
GEMINI_MODEL=gemini-3.0-flash-001

# ================================
# TWITCH CONFIGURATION
# ================================
# Generate token: https://twitchtokengenerator.com
# Required scopes: chat:read, chat:edit
TWITCH_ACCESS_TOKEN=your_access_token_here
TWITCH_CLIENT_ID=your_client_id_here
TWITCH_CHANNEL=michaelinzo

# Optional (for advanced features)
TWITCH_CLIENT_SECRET=your_client_secret_here
TWITCH_REFRESH_TOKEN=your_refresh_token_here

# ================================
# YOUTUBE CONFIGURATION (OPTIONAL)
# ================================
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_LIVE_CHAT_ID=your_live_chat_id_here

# ================================
# SERVER CONFIGURATION
# ================================
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=change_this_to_random_string

# ================================
# DEBUG (OPTIONAL)
# ================================
DEBUG=true
```

---

## 🚀 Quick Start Checklist

Use this checklist to ensure everything is configured:

- [ ] Backend folder exists with code
- [ ] `.env` file created (not just `.env.example`)
- [ ] GEMINI_API_KEY added to `.env`
- [ ] TWITCH_ACCESS_TOKEN added to `.env`
- [ ] TWITCH_CLIENT_ID added to `.env`
- [ ] TWITCH_CHANNEL set to your channel name
- [ ] `npm install` run in backend folder
- [ ] Backend server started with `npm run dev`
- [ ] Backend terminal shows Gemini initialized
- [ ] Backend terminal shows Twitch connected
- [ ] Frontend connected to backend (Backend tab)
- [ ] Live Monitor tab open and watching
- [ ] Sent test message in Twitch chat
- [ ] Message appears in Live Monitor
- [ ] AI response appears after a few messages

**If ALL boxes checked and still not working → Report as bug with backend terminal logs**

---

## 🔍 Debug Mode

Enable detailed logging:

**Backend terminal:**
```bash
DEBUG=* npm run dev
```

**Frontend console (F12):**
```javascript
localStorage.setItem('debug', 'true');
location.reload();
```

**This will show:**
- All WebSocket messages
- Every API call
- Detailed error messages
- Connection state changes

---

## 📞 Still Not Working?

If you've tried everything above and it's still not working:

1. **Capture backend terminal output:**
   - Copy the last 50 lines from terminal
   - Look for error messages in red
   
2. **Check browser console:**
   - Press F12 → Console tab
   - Copy any error messages
   
3. **Verify your setup:**
   - Backend running? → Check terminal
   - Frontend connected? → Check "Backend Server" tab
   - Twitch connected? → Check backend terminal for "✅ Connected to Twitch"
   - Gemini configured? → Check backend terminal for "✅ Google Gemini initialized"

4. **Common mistakes:**
   - Forgot to restart backend after editing `.env`
   - Using `.env.example` instead of `.env`
   - Access token expired (regenerate)
   - Wrong channel name (should be lowercase)
   - Missing Gemini API key
   - Firewall blocking WebSocket port

---

## 🆘 Emergency Recovery

If nothing works, start fresh:

```bash
# 1. Stop everything
# Press Ctrl+C in backend terminal
# Close browser

# 2. Clean backend
cd backend
rm -rf node_modules
rm -f .env
npm install
cp .env.example .env

# 3. Edit .env with your credentials
nano .env  # or use your editor

# 4. Restart backend
npm run dev

# 5. Verify output shows:
# ✅ Google Gemini initialized
# ✅ Connected to Twitch channel

# 6. Open frontend
# Go to Backend Server tab
# Click "Connect to Backend"

# 7. Test in Twitch chat
# Send message
# Watch Live Monitor tab
```

---

**Last Updated:** January 2025

**Found this helpful?** Star the repo and share with other streamers!
