# Backend Connection Testing Guide

This guide will help you test the real backend server connection for your AI Streamer Companion app.

## 🎯 What You'll Test

- WebSocket connection between frontend and backend
- Real Twitch chat integration
- AI response generation via Gemini
- Message flow and latency
- Connection stability and keepalive

## 📋 Prerequisites

Before testing, ensure you have:

1. ✅ **Backend server running** (see `backend/README.md`)
2. ✅ **Valid Twitch credentials** in `backend/.env`
3. ✅ **Gemini API key** configured in `backend/.env`
4. ✅ **Frontend running** (`npm run dev`)

## 🚀 Step-by-Step Testing Process

### Step 1: Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

**Expected Output:**
```
🚀 AI Streamer Backend Server running on port 3001
✅ Google Gemini initialized
✅ Connected to Twitch channel: your_channel_name
```

**❌ Troubleshooting:**
- If you see `⚠️ Gemini API key not configured` → Add `GEMINI_API_KEY` to `.env`
- If you see `Login authentication failed` → Your `TWITCH_ACCESS_TOKEN` is invalid
- If server crashes → Check `.env` file syntax (no extra spaces, quotes, or blank lines)

---

### Step 2: Connect Frontend to Backend

1. Open the app in your browser
2. Go to **Backend Server** tab → **Connection** sub-tab
3. Verify URL is `ws://localhost:3001`
4. Click **"Connect to Backend"** button
5. Wait for green **"Connected"** badge (3-5 seconds)

**Expected Result:**
- ✅ Green "Connected" badge appears
- ✅ Toast notification: "Connected to backend server"
- ✅ Server Status panel shows version, uptime, platform connections

**❌ Troubleshooting:**
- **"Connection timeout"** → Backend not running or wrong URL
- **"Connection failed"** → Check backend terminal for errors
- **"WebSocket connection error"** → Firewall blocking port 3001

---

### Step 3: Run Automated Diagnostics

1. Stay on **Backend Server** tab
2. Go to **Diagnostics** sub-tab
3. Click **"Run Full Diagnostics"**
4. Wait 10-15 seconds for completion

**What Gets Tested:**
- ✅ Backend server health
- ✅ WebSocket connection
- ✅ Twitch connection status
- ✅ YouTube connection status (if configured)
- ✅ Gemini API configuration
- ✅ Network connectivity

**Expected Result:**
All checks should show green ✓ except:
- YouTube may be yellow/warning (optional)

**❌ If Any Test Fails:**
Read the detailed error messages and follow the suggested fixes

---

### Step 4: Test Real Twitch Chat

1. Go to **Backend Server** tab → **Live Chat Testing** sub-tab
2. Click **"Run Quick Test"** button
3. All 5 tests should pass (green checkmarks)

**Expected Test Results:**
- ✅ Check backend connection
- ✅ Verify WebSocket is active
- ✅ Check Twitch connection
- ✅ Fetch backend health
- ✅ Listen for messages

---

### Step 5: Send a Real Twitch Message

1. Open your Twitch stream in a separate window/tab:
   ```
   https://www.twitch.tv/YOUR_CHANNEL_NAME
   ```

2. Send a test message in Twitch chat:
   ```
   Hello Nova!
   ```

3. In the app, go to **Backend Server** → **Live Chat Testing** → **Live Messages** tab

**Expected Result:**
- ✅ Your message appears within 1-2 seconds
- ✅ Shows your username, message, timestamp
- ✅ Backend terminal logs: `Message from YourUsername: Hello Nova!`

**AI Response (30% chance):**
- May take 5-10 seconds
- AI responds in Twitch chat
- Response appears in Live Messages feed

---

### Step 6: Monitor Live Chat Feed

1. Go to **Live Monitor** tab in the main app
2. Keep Twitch stream open
3. Send multiple messages
4. Watch the feed update in real-time

**What to Observe:**
- ✅ All messages appear instantly (< 2 seconds)
- ✅ Avatar reacts with emotions
- ✅ Sentiment analysis shows colors
- ✅ Engagement score updates
- ✅ AI occasionally responds

---

### Step 7: Test Connection Stability (Keepalive)

1. Go to **Backend Server** tab → **Keepalive Test** sub-tab
2. Keep the connection open for 2+ minutes
3. Observe ping/pong messages

**Expected Behavior:**
- ✅ Ping sent every 30 seconds
- ✅ Pong received within 1 second
- ✅ No disconnections
- ✅ No reconnection attempts

**❌ If Connection Drops:**
- Check backend terminal for errors
- Review logs in **Live Logs** tab
- Verify firewall isn't closing idle connections

---

## 🔍 Verification Checklist

After completing all steps, verify:

- [ ] Backend connected (green badge)
- [ ] All diagnostics passed
- [ ] All quick tests passed
- [ ] Received at least 3 Twitch messages
- [ ] Saw AI respond at least once
- [ ] Avatar showed emotions during responses
- [ ] Connection stayed stable for 2+ minutes
- [ ] No errors in backend terminal
- [ ] No errors in browser console

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to backend"

**Symptoms:**
- Red error message
- Connection timeout
- "Failed to connect" toast

**Solutions:**
1. Verify backend is running: `cd backend && npm run dev`
2. Check port 3001 is not in use: `lsof -i :3001`
3. Try restarting both frontend and backend
4. Check URL is exactly `ws://localhost:3001` (not http://)

---

### Issue: "Backend connected but no chat messages"

**Symptoms:**
- Green "Connected" badge
- No messages appearing
- Backend seems idle

**Solutions:**
1. Verify `TWITCH_CHANNEL` in `.env` matches your actual channel (lowercase, no #)
2. Check Twitch token has `chat:read` scope
3. Make sure you're sending messages to the CORRECT Twitch channel
4. Check backend terminal for "Message from..." logs
5. Try generating a new access token from twitchtokengenerator.com

---

### Issue: "Chat appears but AI never responds"

**Symptoms:**
- Messages show up
- No AI responses
- Backend logs show messages

**Solutions:**
1. Check `GEMINI_API_KEY` is set in `.env`
2. Verify API key is valid at https://aistudio.google.com/app/apikey
3. Check backend terminal for Gemini errors
4. Restart backend after adding/updating API key
5. Remember: AI responds to ~30% of messages (intentional)

---

### Issue: "Connection keeps dropping"

**Symptoms:**
- Frequent disconnections
- Multiple reconnection attempts
- Unstable connection

**Solutions:**
1. Check backend terminal for crash errors
2. Verify `.env` file has no syntax errors
3. Disable VPN/proxy if active
4. Check system resources (CPU/memory)
5. Try increasing keepalive frequency in backend code

---

### Issue: "Port 3001 already in use"

**Symptoms:**
- Backend won't start
- Error: `EADDRINUSE`

**Solutions:**
1. Kill existing process:
   ```bash
   lsof -ti:3001 | xargs kill
   ```
2. Or change port in `backend/index.js` and frontend connection URL

---

## 📊 Expected Performance Metrics

### Message Latency
- **Twitch → Frontend:** < 2 seconds
- **AI Response Generation:** 5-10 seconds
- **Total Round Trip:** 7-12 seconds

### Connection Stability
- **Keepalive Interval:** 30 seconds
- **Pong Timeout:** 5 seconds
- **Reconnect Attempts:** Max 5
- **Reconnect Delay:** Exponential backoff (1s, 2s, 4s, 8s, 16s)

### AI Response Rate
- **Response Probability:** ~30% of messages
- **Configurable:** In backend `index.js` (line ~150)

---

## 🎓 Advanced Testing

### Test Keepalive Under Load

1. Open multiple browser tabs with the app
2. Connect all to backend
3. Send rapid messages in Twitch
4. Monitor ping/pong in each tab

**Expected:** All connections stay alive

### Test Reconnection Logic

1. Connect to backend
2. Stop backend server (Ctrl+C)
3. Watch frontend attempt reconnections
4. Restart backend
5. Frontend should auto-reconnect

**Expected:** Successful reconnection within 30 seconds

### Test Error Handling

1. Connect to backend
2. Invalidate Twitch token in `.env`
3. Restart backend
4. Observe error messages

**Expected:** Clear error messages, no crashes

---

## 📝 Logging & Debugging

### Frontend Logs (Browser Console)
```javascript
// Enable verbose WebSocket logging
localStorage.setItem('debug', 'websocket')
```

### Backend Logs
Already verbose by default. Check terminal output for:
- `✅` = Success/Connected
- `⚠️` = Warning/Config issue  
- `❌` = Error/Failure
- `Message from...` = Incoming chat

### Connection History
Go to **Backend Server** → **History** tab to see:
- All connection events
- Timestamps
- Error details
- Reconnection attempts

---

## 🎯 Success Criteria

Your backend connection is working correctly if:

1. ✅ **Connection Established**
   - Green "Connected" badge
   - No connection errors
   - Server status showing

2. ✅ **Chat Integration Working**
   - Twitch messages appear in app
   - < 2 second latency
   - All messages captured

3. ✅ **AI Responding**
   - At least 1 AI response seen
   - Responses relevant to messages
   - No Gemini API errors

4. ✅ **Connection Stable**
   - No disconnections for 5+ minutes
   - Ping/pong working
   - No reconnection attempts

5. ✅ **Error Handling**
   - Clear error messages
   - No app crashes
   - Graceful reconnection

---

## 🆘 Getting Help

If you're still having issues:

1. **Check Documentation:**
   - `backend/README.md`
   - `QUICK_START.md`
   - `CONNECTION_TROUBLESHOOTING.md`

2. **Review Connection History:**
   - Backend Server → History tab
   - Look for error patterns

3. **Run Full Diagnostics:**
   - Backend Server → Diagnostics tab
   - Follow suggested fixes

4. **Check Backend Terminal:**
   - Look for error messages
   - Verify startup messages

5. **AI Support Chat:**
   - Use built-in AI Support tab
   - Upload screenshots
   - Get instant help

---

## 🎉 You're All Set!

Once all tests pass, your AI Streamer Companion is ready for:
- ✅ Real-time Twitch chat monitoring
- ✅ AI-powered responses
- ✅ Sentiment analysis
- ✅ Avatar reactions
- ✅ Performance tracking
- ✅ Stream analytics

Happy streaming! 🚀
