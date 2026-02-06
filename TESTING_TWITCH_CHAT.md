# Testing Live Twitch Chat Integration - Complete Guide

## 🚀 Quick Start Testing Checklist

Follow these steps in order to test your Twitch integration:

### ✅ Step 1: Start Backend Server
```bash
cd backend
npm run dev
```

**Expected output:**
```
🚀 AI Streamer Backend Server running on port 3001
✅ Google Gemini initialized (model: gemini-3.0-flash)
✅ Connected to Twitch channel: michaelinzo
```

❌ **If you see errors:**
- `⚠️ Gemini API key not configured` → Add GEMINI_API_KEY to .env
- `Login authentication failed` → Your TWITCH_ACCESS_TOKEN is invalid
- Server crashes → Check .env syntax (no spaces, quotes, or blank lines)

---

### ✅ Step 2: Connect Frontend to Backend

1. Open the AI Streamer Companion app
2. Go to **Backend Server** tab
3. Click **"Connect to Backend"** button
4. Wait for green **"Connected"** badge

❌ **If connection fails:**
- Make sure backend is running (check terminal)
- URL should be `ws://localhost:3001`
- Try restarting both frontend and backend

---

### ✅ Step 3: Run Automated Tests

1. On Backend Server tab, go to **Testing** sub-tab
2. Click **"Run Quick Test"** button
3. Wait for all 5 checks to complete
4. All should show green ✓ checkmarks

**What it checks:**
- ✓ Backend connection
- ✓ WebSocket active
- ✓ Twitch connected
- ✓ Health status
- ✓ Ready to listen

❌ **If any test fails:**
- Go to **Diagnostics** tab for detailed analysis
- Check backend terminal for error messages
- Review .env file configuration

---

### ✅ Step 4: Send Real Twitch Message

1. Open your Twitch channel: `https://www.twitch.tv/michaelinzo`
2. Make sure you're logged into Twitch
3. **Send a message in chat:** `"Hello Nova!"`
4. Switch to **Live Messages** tab in the testing interface
5. **Your message should appear within 1-2 seconds**

✓ **Success indicators:**
- Message shows up in Live Messages tab
- Backend terminal logs: `Message from YourUsername: Hello Nova!`
- Message also appears in Live Monitor tab
- AI may respond (30% chance, 5-10 second delay)

❌ **If message doesn't appear:**
- Wrong channel in .env → Check TWITCH_CHANNEL spelling
- Token missing chat:read permission → Regenerate token
- Backend not actually connected → Check terminal for Twitch errors

---

### ✅ Step 5: Verify AI Responses

**AI response behavior:**
- Responds to ~30% of messages (to avoid spam)
- 5-10 second delay for processing
- Avatar shows emotions (thinking → happy/excited)
- Voice synthesis reads response (if enabled)

**To test AI:**
1. Send multiple messages in Twitch chat
2. At least one should get an AI response
3. Watch Live Monitor tab for:
   - Thinking animation on avatar
   - AI response in chat feed
   - Voice audio playing (if enabled)

❌ **If AI never responds:**
- Check backend terminal for Gemini errors
- Verify GEMINI_API_KEY in .env
- Check Gemini API quotas (free tier limits)
- Make sure messages aren't from the bot itself

---

## 🔍 Advanced Testing

### Test Backend Logs Viewer

1. Go to **Backend Server** → **Live Logs** tab
2. Send messages in Twitch
3. Logs should show:
   ```
   💬 Chat from YourUsername: Your message
   🤖 AI Response: Nova's reply
   ```

### Test Live Monitor Integration

1. Go to **Live Monitor** tab
2. Messages from Twitch should appear in Live Chat Feed
3. AI responses show with avatar animation
4. Sentiment analysis should work
5. Engagement metrics update in real-time

### Test Diagnostics Tool

1. Go to **Backend Server** → **Diagnostics** tab
2. Click **"Run Full Diagnostics"**
3. Review all 6 system checks
4. Fix any errors or warnings shown

---

## 🐛 Common Issues & Solutions

### Issue: "Backend server is not running"
**Cause:** Backend isn't started or crashed
**Solution:**
```bash
cd backend
npm run dev
```

### Issue: "Twitch is not connected"
**Cause:** Invalid credentials in .env
**Solution:**
1. Go to https://twitchtokengenerator.com
2. Select scopes: `chat:read`, `chat:write`, `channel:moderate`
3. Copy **ACCESS TOKEN** (starts with "oauth:")
4. Update .env:
   ```
   TWITCH_ACCESS_TOKEN=oauth:your_token_here
   TWITCH_CLIENT_ID=your_client_id
   TWITCH_CHANNEL=michaelinzo
   ```
5. Restart backend

### Issue: "WebSocket connection failed"
**Cause:** Backend not running or wrong URL
**Solution:**
- Start backend first
- Verify URL is `ws://localhost:3001` (not http://)
- Try restarting both frontend and backend

### Issue: Messages appear but AI never responds
**Cause:** Missing or invalid GEMINI_API_KEY
**Solution:**
1. Get API key: https://aistudio.google.com/app/apikey
2. Add to .env:
   ```
   GEMINI_API_KEY=AIzaSy...your_key_here
   ```
3. Restart backend
4. Check terminal for "✅ Google Gemini initialized"

### Issue: "Login authentication failed"
**Cause:** Expired or invalid Twitch token
**Solution:**
1. Generate new token at twitchtokengenerator.com
2. Use **ACCESS TOKEN** (not refresh token)
3. Select required scopes
4. Update .env and restart

### Issue: Wrong channel being monitored
**Cause:** TWITCH_CHANNEL misconfigured
**Solution:**
- Must be lowercase
- No # symbol
- Example: `TWITCH_CHANNEL=michaelinzo` ✓
- NOT: `TWITCH_CHANNEL=#MichaelInzo` ✗

---

## 📊 Testing Best Practices

### 1. Always Check Backend Terminal
Keep the backend terminal visible to see:
- Connection status
- Incoming messages
- AI responses
- Errors in real-time

### 2. Test with Real Stream
- Don't rely only on simulation mode
- Send actual Twitch messages
- Verify end-to-end flow

### 3. Monitor Multiple Interfaces
Watch all these at once:
- Twitch chat (web browser)
- Backend terminal (console logs)
- Live Monitor tab (app interface)
- Backend Logs tab (real-time logs)

### 4. Test AI Response Rate
- Send 10+ messages
- Expect 2-4 AI responses
- This is normal (30% response rate)
- Prevents chat spam

### 5. Check All Features
Test each component:
- ✓ Message reception
- ✓ AI responses
- ✓ Avatar emotions
- ✓ Voice synthesis
- ✓ Sentiment analysis
- ✓ Engagement metrics

---

## 🎯 Success Criteria

Your integration is working correctly if:

✅ Backend starts without errors  
✅ Frontend connects via WebSocket  
✅ Quick Test shows all green checkmarks  
✅ Twitch messages appear within 1-2 seconds  
✅ AI responds to some messages (not all)  
✅ Avatar shows emotions during responses  
✅ Live Monitor displays chat feed  
✅ Backend logs show message flow  

---

## 🆘 Still Not Working?

1. **Run Full Diagnostics**
   - Backend Server → Diagnostics tab
   - Review all failed checks

2. **Check Troubleshooting Tab**
   - Backend Server → Troubleshooting tab
   - Common errors with solutions

3. **Review Environment Variables**
   ```bash
   cat backend/.env
   ```
   Verify all required keys are present

4. **Check API Quotas**
   - Gemini: https://console.cloud.google.com
   - Make sure you're not rate limited

5. **Restart Everything**
   ```bash
   # Stop backend (Ctrl+C)
   cd backend
   npm run dev
   
   # Refresh frontend browser
   # Reconnect on Backend tab
   ```

---

## 📝 Testing Workflow Summary

```
1. Start backend → See success messages in terminal
2. Connect frontend → Green "Connected" badge
3. Run quick test → All checks pass
4. Send Twitch message → Appears in app within 1-2 seconds
5. Wait for AI response → 30% chance, 5-10 second delay
6. Monitor Live Monitor tab → See full chat feed with avatar
7. Check logs → Backend Logs tab shows message flow
```

**This workflow should complete successfully in under 2 minutes.**

---

## 🔗 Useful Links

- **Gemini API Key:** https://aistudio.google.com/app/apikey
- **Twitch Token Generator:** https://twitchtokengenerator.com
- **Twitch Developer Console:** https://dev.twitch.tv/console
- **Backend Documentation:** See `backend/README.md`
- **Full Troubleshooting Guide:** See `BACKEND_TROUBLESHOOTING.md`

---

## 💡 Pro Tips

- **Keep backend terminal visible** while testing
- **Test during non-live stream** first to avoid viewer confusion
- **AI responds to ~30% of messages** by design (not a bug)
- **Gemini free tier has limits** - monitor your quota
- **Token expires** - regenerate if authentication fails
- **.env changes require restart** - always restart backend after editing

---

**Need more help?** Use the AI Support chatbot (floating icon bottom-right) for instant assistance!
