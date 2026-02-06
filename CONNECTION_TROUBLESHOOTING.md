# Connection Troubleshooting Guide

## 🔍 Diagnosing "Frontend client connected → Frontend client disconnected" Issue

This immediate disconnect pattern indicates a WebSocket handshake or keepalive issue. Follow these steps to fix it:

### ✅ Solution 1: Updated Backend Server (Recommended)

The backend server has been updated with:
- **WebSocket keepalive (ping/pong)** - Prevents idle connection timeouts
- **Auto-initialization of Twitch/YouTube** - Connects automatically on startup
- **Better error handling and logging** - Shows exactly what's happening

**To apply the fix:**

1. **Stop your backend server** (Ctrl+C in the terminal)

2. **Restart the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Check for these messages:**
   ```
   🚀 AI Streamer Backend Server running on port 3001
   📡 WebSocket server ready
   ✅ Google Gemini gemini-3.0-flash-001 initialized successfully
   📺 Auto-connecting to Twitch channel: michaelinzo
   ✅ Twitch auto-connect successful
   ✅ Server initialization complete
   👀 Waiting for chat messages...
   ```

4. **In the frontend, go to Backend tab and click "Connect to Backend"**

5. **The connection should now stay active**

---

## 🐛 Common Issues and Fixes

### Issue 1: Backend connects but immediately disconnects

**Symptoms:**
```
Frontend client connected
Frontend client disconnected
```

**Causes:**
- No keepalive mechanism (ping/pong)
- Frontend closing connection due to no response
- Network/firewall blocking WebSocket

**Fix:**
✅ **Already fixed** - The updated server.ts now includes:
- 30-second ping intervals
- Proper pong handling
- Connection status broadcasts

---

### Issue 2: "Login authentication failed" in backend

**Symptoms:**
```
❌ Twitch auto-connect failed: Login authentication failed
```

**Causes:**
- Invalid TWITCH_ACCESS_TOKEN
- Token has expired
- Token has wrong format (includes/excludes "oauth:")

**Fix:**
1. Go to https://twitchtokengenerator.com
2. Select scopes: `chat:read`, `chat:write`, `channel:moderate`
3. Click "Generate Token"
4. Copy the **ACCESS TOKEN** (not refresh token)
5. Update backend/.env:
   ```env
   TWITCH_ACCESS_TOKEN=your_token_here
   ```
   ⚠️ **DO NOT include "oauth:" prefix** - the code adds it automatically

6. Restart backend: `npm run dev`

---

### Issue 3: Connection works but no chat messages appear

**Symptoms:**
- Backend shows "Connected to Twitch"
- No messages appear in frontend
- Backend terminal shows no incoming messages

**Causes:**
- Wrong TWITCH_CHANNEL in .env
- Token doesn't have `chat:read` permission
- Not actually live on Twitch

**Fix:**
1. Verify TWITCH_CHANNEL in backend/.env:
   ```env
   TWITCH_CHANNEL=michaelinzo
   ```
   ⚠️ Must be **lowercase**, **no # symbol**

2. Test by sending a message in your Twitch chat while streaming

3. Check backend terminal - should see:
   ```
   💬 Message from YourUsername: Hello!
   ```

4. If nothing appears, regenerate token with `chat:read` scope

---

### Issue 4: Messages appear but AI never responds

**Symptoms:**
- Chat messages show in frontend
- No AI responses generated
- Backend terminal shows "⚠️ No AI response generated"

**Causes:**
- Missing or invalid GEMINI_API_KEY
- Gemini API quota exceeded
- API key doesn't have proper permissions

**Fix:**
1. Get a Gemini API key:
   - Go to https://aistudio.google.com/app/apikey
   - Click "Create API key"
   - Copy the entire key (starts with "AIza...")

2. Add to backend/.env:
   ```env
   GEMINI_API_KEY=AIza...your_key_here
   ```

3. Restart backend: `npm run dev`

4. Check for this message:
   ```
   ✅ Google Gemini gemini-3.0-flash-001 initialized successfully
   ```

5. Send a test message in Twitch chat
   - AI responds to ~30% of messages randomly
   - May take 5-15 seconds for response
   - Check backend terminal for "🤖 Generating AI response..."

---

### Issue 5: "Port 3001 already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Causes:**
- Backend is already running
- Another process is using port 3001
- Previous backend didn't shut down cleanly

**Fix (Windows):**
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Fix (Mac/Linux):**
```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9
```

**Then restart backend:**
```bash
cd backend
npm run dev
```

---

### Issue 6: Backend crashes immediately on startup

**Symptoms:**
- Backend starts but crashes within 1-2 seconds
- Error about parsing or syntax
- ".env" related errors

**Causes:**
- Syntax error in .env file
- Extra spaces, quotes, or special characters
- Missing required dependencies

**Fix:**
1. Check backend/.env file format:
   ```env
   GEMINI_API_KEY=your_key_here
   TWITCH_ACCESS_TOKEN=your_token_here
   TWITCH_CLIENT_ID=your_client_id_here
   TWITCH_CHANNEL=michaelinzo
   ```
   
   ❌ **Wrong:**
   ```env
   GEMINI_API_KEY = "your_key_here"  # No spaces, no quotes!
   TWITCH_CHANNEL=#michaelinzo       # No # symbol!
   ```

2. Verify dependencies are installed:
   ```bash
   cd backend
   npm install
   ```

3. Try starting with verbose logging:
   ```bash
   npm run dev
   ```

---

## 🔧 Step-by-Step Testing Procedure

Follow these steps in order to verify everything works:

### Step 1: Verify Backend Starts Properly
```bash
cd backend
npm run dev
```

**Expected output:**
```
🚀 AI Streamer Backend Server running on port 3001
📡 WebSocket server ready
✅ Google Gemini gemini-3.0-flash-001 initialized successfully
📺 Auto-connecting to Twitch channel: michaelinzo
✅ Twitch auto-connect successful
✅ Server initialization complete
👀 Waiting for chat messages...
```

**If you see errors here**, fix them before continuing. See issues above.

---

### Step 2: Connect Frontend to Backend

1. Open the frontend app (http://localhost:5173)
2. Go to **Backend** tab
3. Click **"Connect to Backend"**
4. Should see green "Connected" badge
5. Backend terminal should show:
   ```
   Frontend client connected
   ```
   ✅ **Connection should stay active** (no immediate disconnect)

---

### Step 3: Test Twitch Chat Reception

1. Open your Twitch stream in another window: https://www.twitch.tv/michaelinzo
2. **You must be live streaming** (or use Twitch Studio to go live)
3. Send a test message in your Twitch chat: "Hello Nova!"
4. Check backend terminal:
   ```
   💬 Message from michaelinzo: Hello Nova!
   ```
5. Check frontend **Live Monitor** tab:
   - Message should appear in the chat feed
   - Should show timestamp and username

**If message doesn't appear:**
- Verify TWITCH_CHANNEL is correct in .env
- Verify token has `chat:read` permission
- Verify you're actually live on Twitch

---

### Step 4: Test AI Responses

1. Send multiple messages in Twitch chat
2. AI responds to ~30% randomly (to avoid spam)
3. When AI responds, backend terminal shows:
   ```
   🤖 Generating AI response...
   ✨ AI Response: Hey michaelinzo! Thanks for saying hi! 👋
   ```
4. Response appears in Twitch chat after 5-15 seconds
5. Frontend shows AI response in Live Monitor

**If AI never responds:**
- Check GEMINI_API_KEY is valid
- Check backend terminal for Gemini errors
- Check API quota: https://aistudio.google.com/

---

## 📋 Quick Checklist

Before asking for help, verify:

- [ ] Backend server starts without errors
- [ ] Backend shows "✅ Google Gemini initialized"
- [ ] Backend shows "✅ Twitch auto-connect successful"
- [ ] Frontend connects and stays connected (no immediate disconnect)
- [ ] You are live streaming on Twitch
- [ ] TWITCH_CHANNEL matches your channel name (lowercase, no #)
- [ ] TWITCH_ACCESS_TOKEN is valid and recent
- [ ] GEMINI_API_KEY is valid and has quota remaining
- [ ] Port 3001 is not blocked by firewall
- [ ] No spaces or quotes in .env file

---

## 🆘 Still Having Issues?

If you've tried everything above and it still doesn't work:

1. **Run diagnostics in the frontend:**
   - Go to Backend tab → Diagnostics
   - Click "Run Full Diagnostics"
   - Screenshot the results

2. **Capture backend logs:**
   - Copy the entire backend terminal output
   - Include from startup to the error

3. **Check browser console:**
   - Press F12 in browser
   - Go to Console tab
   - Look for WebSocket or connection errors
   - Screenshot any errors in red

4. **Verify environment:**
   - Node.js version: `node --version` (should be 18+)
   - npm version: `npm --version`
   - Operating system

5. **Share the information:**
   - Backend terminal output
   - Frontend diagnostic results
   - Browser console errors
   - Your .env file (⚠️ **remove actual API keys first!**)

---

## 🎯 Expected Behavior When Working

**Backend Terminal:**
```
🚀 AI Streamer Backend Server running on port 3001
📡 WebSocket server ready
✅ Google Gemini gemini-3.0-flash-001 initialized successfully
📺 Auto-connecting to Twitch channel: michaelinzo
✅ Twitch auto-connect successful
✅ Server initialization complete
👀 Waiting for chat messages...

Frontend client connected
💬 Message from viewer123: This is awesome!
🤖 Generating AI response...
✨ AI Response: Thanks viewer123! Glad you're enjoying it! 🎮
```

**Frontend:**
- Backend tab shows green "Connected" badge
- Live Monitor shows real-time chat messages
- AI responses appear after 5-15 seconds
- Avatar reacts to messages with emotions

**Twitch Chat:**
- Your bot account sends responses
- Responses appear as regular chat messages
- ~30% of viewer messages get a response

---

## 💡 Pro Tips

1. **Keep backend terminal visible** - It shows real-time logs and errors
2. **AI responds randomly to 30% of messages** - This is intentional to avoid spam
3. **Responses have 5-15 second delay** - Makes it feel more natural
4. **Test on actual Twitch stream first** - Don't rely on simulators
5. **Check Gemini quotas regularly** - Free tier has daily limits
6. **Restart backend after .env changes** - Changes don't apply until restart
7. **Use lowercase channel names** - Twitch IRC is case-sensitive

---

## 📚 Additional Resources

- [Twitch Token Generator](https://twitchtokengenerator.com)
- [Google Gemini API Keys](https://aistudio.google.com/app/apikey)
- [Twitch Developer Docs](https://dev.twitch.tv/docs)
- [Google Gemini Docs](https://ai.google.dev/docs)

---

**Last Updated:** January 2025
**Version:** 1.0.0
