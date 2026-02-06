# Backend Connection Testing Guide

## 🎯 What You'll Test

- AI response generati

## 📋 Prerequisites
Before testing, ensure you hav
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

**❌




2. Go to **Diagnostics** su
4. Wait 10-15 seconds for completion
**W

- ✅ YouTube connection
- ✅ Network connectivity
**Expected Result:**
- YouTube may be yellow/warning (optional)






- ✅ Check backend connection
- ✅ Check Twitch connection
- ✅ Listen for messages
---

1. Open your Twitch 
   https://www.twitch.tv/YOUR_CHANN

   ```

3. In the app, go to *
**Expected Result:**
- ✅ Shows your username, message, timestamp
- **"WebSocket connection error"** → Firewall blocking port 3001

---

### Step 6: Monitor Live Chat Feed

3. Send multiple messages

- ✅ All messages appear instantly (
- ✅ Sentiment analysis shows colors

---
### Step 7: Test Connecti
1. Go to **Backend Serve
3. Observe ping/pong message
**Expected Behavior:**
- ✅ Pong received within 1 s
- ✅ No reconnection atte

- Review logs in **L




- [ ] All diagnostics passed

- [





- Red error message

**Solutions:**
2. Check port 3001 is not in
4. Check URL is exactly `ws://
---
### Issue: "Backend conn
**Symptoms:**



3. Make sure you're sending messages t

---
### Is
**Symptoms:**
- No A

1. Check `GEMINI_API_KEY` is set in `.
3. Che
5. Remember: A
---

**Symptoms:**


1. Check backend terminal for crash errors
3. Disable VPN/proxy if active
5. Try increasing keepalive frequency in backend code

### Issue: "Port 3001 already
**Symptoms:**
- Error: `EADDRINUSE`
**Solutions:**

   

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

- **AI Response Generation:** 5-10 seconds
- **Total Round Trip:** 7-12 seconds

- ✅ Performance tracking
- **Keepalive Interval:** 30 seconds
Happy streaming! 🚀
- **Reconnect Attempts:** Max 5
- **Reconnect Delay:** Exponential backoff (1s, 2s, 4s, 8s, 16s)


- **Response Probability:** ~30% of messages
- **Configurable:** In backend `index.js` (line ~150)





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

5. Frontend should auto-reconnect

**Expected:** Successful reconnection within 30 seconds

### Test Error Handling

1. Connect to backend
2. Invalidate Twitch token in `.env`
3. Restart backend


**Expected:** Clear error messages, no crashes





### Frontend Logs (Browser Console)
```javascript
// Enable verbose WebSocket logging
localStorage.setItem('debug', 'websocket')



Already verbose by default. Check terminal output for:

- `⚠️` = Warning/Config issue  
- `❌` = Error/Failure
- `Message from...` = Incoming chat

### Connection History
Go to **Backend Server** → **History** tab to see:
- All connection events

- Error details
- Reconnection attempts



## 🎯 Success Criteria

Your backend connection is working correctly if:

1. ✅ **Connection Established**
   - Green "Connected" badge

   - Server status showing

2. ✅ **Chat Integration Working**

   - < 2 second latency



   - At least 1 AI response seen

   - No Gemini API errors

4. ✅ **Connection Stable**
   - No disconnections for 5+ minutes
   - Ping/pong working
   - No reconnection attempts

5. ✅ **Error Handling**
   - Clear error messages

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



   - Look for error messages



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

- ✅ Stream analytics

Happy streaming! 🚀
