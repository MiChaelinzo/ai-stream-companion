# 🔧 Troubleshooting Guide

Complete solutions for common setup issues and errors with the AI Streamer Companion.

---

## 📋 Table of Contents

- [Voice Synthesis Issues](#-voice-synthesis-issues)
- [Vision/Screen Capture Problems](#-visionscreen-capture-problems)
- [Avatar Rendering Issues](#-avatar-rendering-issues)
- [Platform Connection Problems](#-platform-connection-problems)
- [Chat Simulation Not Working](#-chat-simulation-not-working)
- [Performance & Lag Issues](#-performance--lag-issues)
- [API & Network Errors](#-api--network-errors)
- [Browser Compatibility Issues](#-browser-compatibility-issues)
- [SSML Not Working](#-ssml-not-working)
- [Backend Connection Failures](#-backend-connection-failures)
- [Data Persistence Problems](#-data-persistence-problems)
- [General Debugging Tips](#-general-debugging-tips)

---

## 🔊 Voice Synthesis Issues

### Problem: Voice Not Speaking / No Audio Output

**Symptoms:**
- Avatar mouth moves but no sound
- "Test Voice" button does nothing
- Voice settings UI shows enabled but silent

**Solutions:**

1. **Check Browser Support**
   ```javascript
   // Open browser console (F12) and run:
   console.log('Speech Synthesis:', 'speechSynthesis' in window);
   ```
   - If `false`, your browser doesn't support Web Speech API
   - Solution: Use Chrome 90+, Firefox 88+, or Edge 90+

2. **Check System Volume**
   - Ensure system volume is not muted
   - Check browser tab is not muted (right-click tab → Unmute)
   - Verify site permissions allow audio playback

3. **Enable Voice in Settings**
   - Go to **Voice** tab
   - Toggle "Enable Voice" to ON
   - Set volume to 80% or higher
   - Click "Test Voice" to verify

4. **Wait for Voice Loading**
   ```javascript
   // In browser console:
   speechSynthesis.getVoices(); // Should return array of voices
   ```
   - Voices load asynchronously on first page load
   - Refresh page if voices array is empty
   - Wait 2-3 seconds after page load before testing

5. **Try Different Voice Gender**
   - Switch between Male/Female
   - Some browsers have better quality for one gender
   - macOS/Safari: Female voices typically better
   - Windows/Chrome: Both genders work well

6. **Check for Browser Extensions**
   - Disable ad blockers temporarily
   - Disable privacy extensions that block APIs
   - Test in incognito/private mode

**Still Not Working?**
- Check browser console (F12) for error messages
- Try a different browser
- Restart browser completely
- Check OS speech synthesis settings (macOS: System Preferences → Accessibility → Speech)

---

### Problem: Voice Sounds Robotic / Unnatural

**Symptoms:**
- Voice is monotone
- No emotion or expression
- SSML tags not having effect

**Solutions:**

1. **Enable SSML**
   - Go to **Voice** tab
   - Ensure "Enable SSML" is toggled ON
   - Use **SSML Editor** to test advanced features

2. **Use AI Auto-Enhancement**
   - Go to **Voice** tab → **Auto-Enhancement** section
   - Paste your text
   - Select sentiment (Positive/Neutral/Negative)
   - Click "Enhance with AI"
   - Copy enhanced SSML to editor and test

3. **Browser Limitations**
   - Not all browsers support all SSML tags
   - Chrome: Best SSML support
   - Firefox: Moderate SSML support
   - Safari: Limited SSML support
   - Solution: Use Chrome for best results

4. **Manual SSML Tuning**
   ```xml
   <prosody pitch="+20%" rate="110%">
     That was <emphasis level="strong">amazing</emphasis>!
     <break time="300ms"/>
   </prosody>
   ```
   - Add emphasis to key words
   - Use breaks for natural pauses
   - Adjust pitch and rate for emotion

5. **Voice Quality Settings**
   - Set pitch to "Normal" or "High" (not "Low")
   - Set speed to 95-110% (not too fast)
   - Higher speeds can sound more robotic

**Note:** Browser-native TTS has inherent limitations. For ultra-realistic voices, consider:
- Google Cloud Text-to-Speech (backend integration)
- Amazon Polly (backend integration)
- ElevenLabs (premium option)

---

### Problem: Lip-Sync Not Matching Speech

**Symptoms:**
- Avatar mouth movements don't match words
- Delayed or early mouth movements
- Mouth stuck in one position

**Solutions:**

1. **Check Voice Activity Monitor**
   - Go to **Monitor** tab (right sidebar)
   - Watch "Voice Activity Monitor" card
   - Verify "Current Phoneme" is changing during speech
   - If stuck on "silence", phoneme detection is broken

2. **Refresh Voice System**
   - Stop any playing speech
   - Disable and re-enable voice in **Voice** tab
   - Test with a simple phrase first

3. **Browser Speech Events**
   - Chrome/Edge: Full phoneme boundary support
   - Firefox/Safari: Limited boundary events
   - Solution: Use Chrome for best lip-sync

4. **Reduce Speech Speed**
   - Very fast speech (>130%) reduces accuracy
   - Set speed to 100-110% for best sync
   - Lower speeds (80-95%) also work well

5. **Check Commentary Sync Monitor**
   - Go to **Monitor** tab (right sidebar)
   - Watch "Commentary Sync Monitor" card
   - Verify phoneme, emotion, and intensity values update
   - If all values are static, sync system is not active

**Technical Check:**
```javascript
// In browser console during speech:
speechSynthesis.speaking; // Should be true
// Check if boundary events fire:
const utterance = new SpeechSynthesisUtterance("Test");
utterance.onboundary = (e) => console.log("Boundary:", e);
speechSynthesis.speak(utterance);
```

---

## 👁️ Vision/Screen Capture Problems

### Problem: Screen Capture Not Working / Permission Denied

**Symptoms:**
- "Start Analysis" button does nothing
- Error: "Permission denied" or "NotAllowedError"
- No screen selection dialog appears

**Solutions:**

1. **Browser Support Check**
   - Chrome 72+: Full support ✅
   - Firefox 66+: Full support ✅
   - Safari 13+: Full support ✅
   - Edge 79+: Full support ✅
   - Older browsers: Not supported ❌

2. **Grant Screen Capture Permission**
   - Click "Start Analysis" in **Vision** tab
   - Browser will show screen picker dialog
   - Select screen/window/tab to capture
   - Click "Share" or "Allow"
   - **Important:** Check "Share audio" if capturing with sound

3. **macOS Permission Issues**
   - macOS 10.15+ requires screen recording permission
   - Go to: System Preferences → Security & Privacy → Screen Recording
   - Enable permission for your browser (Chrome, Firefox, etc.)
   - **Must restart browser** after granting permission

4. **HTTPS Requirement**
   - Screen capture only works over HTTPS
   - `localhost` is allowed (development)
   - `http://` URLs will fail (except localhost)
   - Solution: Deploy to HTTPS domain or use localhost

5. **Popup Blockers**
   - Disable popup blockers for your domain
   - Allow site permissions in browser settings
   - Try in incognito mode to test without extensions

6. **Reset Permissions**
   - Chrome: Click padlock icon → Site settings → Reset permissions
   - Firefox: Click padlock icon → Clear permissions → Reload
   - Safari: Safari → Settings → Websites → Camera/Screen Recording

**Still Not Working?**
- Check browser console for specific error
- Try selecting different window/tab instead of entire screen
- Restart browser after permission changes
- Update browser to latest version

---

### Problem: Gameplay Commentary Not Generated

**Symptoms:**
- Screen captures successfully but no commentary
- Vision analysis stats show 0 analyses
- No AI reactions to gameplay

**Solutions:**

1. **Verify Vision Settings**
   - Go to **Vision** tab
   - Ensure "Enable Vision Analysis" is ON
   - Check "Auto Commentary" is enabled
   - Set analysis interval to 15-30 seconds (not too fast)

2. **Check Screen Capture Active**
   - After clicking "Start Analysis", verify status changes to "Active"
   - Green indicator should appear
   - If red/inactive, screen sharing was denied or stopped

3. **Enter Game Context**
   - In **Vision** tab, enter specific game name
   - Example: "Playing Elden Ring" or "League of Legends gameplay"
   - More specific = better AI analysis
   - Generic "gaming" may produce weak commentary

4. **Adjust Confidence Threshold**
   - Default is 70% confidence
   - Lower to 50% if getting no commentary
   - Higher (80-90%) for only very confident observations

5. **Commentary Frequency**
   - Set to "All Actions" instead of "Highlights Only"
   - Highlights detection requires significant events
   - Test with "All Actions" first to verify system works

6. **Check Vision Stats Card**
   - Go to **Vision** tab
   - Review "Vision Analysis Stats" card
   - Check "Total Analyses" counter
   - If 0 after 30+ seconds, analysis is not running

7. **Network/API Issues**
   - Gemini Vision API calls may fail silently
   - Check browser console (F12) for 4xx/5xx errors
   - Verify internet connection is stable
   - Try increasing analysis interval to reduce API load

**Test Vision Manually:**
- Capture a simple, clear screen (desktop, game menu)
- Wait for one analysis interval
- Check **Commentary History** for any results
- If still nothing, check console for errors

---

### Problem: Vision Analysis Too Slow / Laggy

**Symptoms:**
- App freezes during screen capture
- High CPU/memory usage
- Browser becomes unresponsive

**Solutions:**

1. **Increase Analysis Interval**
   - Set to 45-60 seconds instead of 10-15
   - Vision API calls are intensive
   - Longer intervals reduce system load

2. **Reduce Screen Resolution**
   - Capture specific window instead of entire 4K screen
   - Lower resolution = faster processing
   - Full HD (1920x1080) is sufficient

3. **Close Other Tabs/Apps**
   - Vision analysis + 3D avatar + chat is resource-intensive
   - Close unnecessary browser tabs
   - Quit other heavy applications

4. **Disable Avatar While Testing**
   - Avatar rendering adds GPU load
   - Minimize avatar card if not needed
   - Focus on vision testing first

5. **Hardware Recommendations**
   - Minimum: 8GB RAM, quad-core CPU
   - Recommended: 16GB RAM, 6-core CPU
   - Integrated GPU sufficient for avatar
   - Dedicated GPU helps but not required

6. **Browser Performance Mode**
   - Chrome: Enable hardware acceleration (Settings → System)
   - Disable background tabs throttling temporarily
   - Close dev tools (F12) when not debugging

---

## 🎨 Avatar Rendering Issues

### Problem: Avatar Not Displaying / Black Screen

**Symptoms:**
- Avatar card shows black/blank area
- No 3D model visible
- Error messages about WebGL

**Solutions:**

1. **Enable Hardware Acceleration**
   - Chrome: Settings → System → "Use hardware acceleration when available" = ON
   - Firefox: Settings → General → Performance → Uncheck "Use recommended performance settings" → Check "Use hardware acceleration when available"
   - Edge: Same as Chrome
   - **Restart browser after changing**

2. **Check WebGL Support**
   ```javascript
   // In browser console:
   const canvas = document.createElement('canvas');
   console.log('WebGL:', canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
   ```
   - If `null`, WebGL is not available
   - Update graphics drivers
   - Enable GPU in browser flags

3. **Update Graphics Drivers**
   - NVIDIA: GeForce Experience or nvidia.com
   - AMD: AMD Software or amd.com
   - Intel: intel.com/support
   - macOS: Update system (drivers included)

4. **Browser WebGL Flags**
   - Chrome: Visit `chrome://flags`
   - Search "WebGL" and enable all WebGL features
   - Search "GPU" and enable hardware acceleration
   - Restart browser

5. **Test on Different Browser**
   - Chrome usually has best WebGL support
   - Try Chrome if using Firefox/Safari
   - Edge (Chromium) also works well

6. **Disable Browser Extensions**
   - Privacy/security extensions may block WebGL
   - Test in incognito/private mode
   - Whitelist your domain if using extensions

**Still Black Screen?**
- Check browser console for Three.js errors
- Try refreshing page (Ctrl+R / Cmd+R)
- Clear browser cache and reload
- Verify GPU is not blacklisted: `chrome://gpu`

---

### Problem: Avatar Emotions Not Changing

**Symptoms:**
- Avatar stays in neutral expression
- No emotion changes during chat
- Sentiment detected but avatar doesn't react

**Solutions:**

1. **Check Sentiment Analysis**
   - Go to **Sentiment** tab
   - Verify sentiment is being detected
   - If sentiment is always "neutral", AI analysis may have issues

2. **Use Chat Simulation**
   - Go to **Monitor** tab
   - Enable "Auto-generate messages"
   - Watch avatar for emotion changes
   - Simulation includes varied sentiments to trigger emotions

3. **Manual Emotion Testing**
   - Go to **Chat** tab
   - Send strongly positive message: "This is amazing! I love this! 🔥"
   - Avatar should switch to "happy" or "excited"
   - Send negative message: "This is boring and bad"
   - Avatar should show "confused" or "sad"

4. **Check Emotion Sync Monitor**
   - Go to **Monitor** tab (right sidebar)
   - Watch "Commentary Sync Monitor" card
   - Verify "Current Emotion" field changes
   - If stuck on "neutral", emotion system is not active

5. **Sentiment Threshold**
   - Avatar requires 3+ positive messages for "excited"
   - Or 2+ negative messages for "confused"
   - Single messages may not trigger changes
   - This is intentional to avoid erratic switching

6. **Refresh Avatar State**
   - Switch to different tab and back to **Monitor**
   - Stop and restart chat simulation
   - Send new test messages

**Emotion Trigger Logic:**
- Positive sentiment → Happy (1 message) → Excited (3+ messages)
- Negative sentiment → Confused (2+ messages) → Sad (sustained)
- Thinking → During AI response generation
- Surprised → Vision API highlight detection
- Neutral → Default state, no strong sentiment

---

### Problem: Avatar Skins Not Changing

**Symptoms:**
- Selecting different skin has no effect
- Avatar appearance doesn't update
- All skins look the same

**Solutions:**

1. **Save Personality Configuration**
   - Go to **Personality** tab
   - Select desired skin from dropdown
   - Avatar should update immediately in **Monitor** tab
   - If not, go to **Monitor** tab to see changes

2. **Check Avatar Visibility**
   - Go to **Monitor** tab (right sidebar)
   - Ensure "VTuber Avatar" card is visible and expanded
   - Avatar only renders when visible on screen

3. **Force Refresh**
   - Change to a different skin
   - Go to another tab
   - Return to **Monitor** tab
   - Avatar should re-render with new skin

4. **Clear Cached State**
   - Open browser console (F12)
   - Run: `localStorage.clear()`
   - Refresh page
   - Reconfigure personality with desired skin

5. **Verify Skin Names**
   - Available skins: Default Kawaii, Cyberpunk, Pastel Dream, Neon Nights, Fantasy Elf, Retro Wave, Monochrome, Cosmic Star
   - Ensure you're selecting from dropdown (not typing)

**Skin Colors Reference:**
- **Default Kawaii:** Pink/purple tones
- **Cyberpunk:** Bright purple/pink neon
- **Pastel Dream:** Soft pastels (pink/lavender/mint)
- **Neon Nights:** Cyan/magenta high contrast
- **Fantasy Elf:** Emerald green/gold
- **Retro Wave:** 80s pink/cyan
- **Monochrome:** Black/white/gray
- **Cosmic Star:** Deep purple/blue with stars

---

## 🔌 Platform Connection Problems

### Problem: Twitch Token Generation Fails

**Symptoms:**
- Redirected to Twitch but no token appears
- Error: "Invalid client ID"
- Token field remains empty

**Solutions:**

1. **Use Correct Tool**
   - Go to: https://twitchtokengenerator.com
   - NOT dev.twitch.tv (that's for app creation)
   - Clear distinction: App creation vs Token generation

2. **Select Required Scopes**
   - Minimum required scopes for chat bot:
     - `chat:read` - Read chat messages
     - `chat:edit` - Send chat messages
     - `channel:read:subscriptions` - Read sub status (optional)
     - `moderator:read:followers` - Read followers (optional)
   - Click each scope to select
   - Then click "Generate Token"

3. **Authorize with Correct Account**
   - Twitch will ask you to log in
   - **Use the Twitch account you stream with**
   - Not a bot account (unless you want bot to send messages as separate user)
   - Click "Authorize"

4. **Copy ALL Token Fields**
   - **Access Token** - Long alphanumeric string (copy this)
   - **Client ID** - Also provided (copy this too)
   - **Refresh Token** - Optional but recommended
   - Save all three securely

5. **Using Your Own Client ID/Secret (Advanced)**
   - Create app at: https://dev.twitch.tv/console/apps
   - Set redirect URL to: `https://twitchtokengenerator.com`
   - Copy Client ID and Client Secret
   - Paste into TwitchTokenGenerator "Optional" fields
   - Generate token using your credentials

6. **Token Expiration**
   - Tokens expire after ~60 days
   - If connection suddenly stops working, regenerate token
   - Use refresh token to auto-renew (backend implementation)

**Common Errors:**
- "Invalid client ID" → Using wrong client ID or typo
- "Scope not permitted" → Your Twitch account lacks permission (use streamer account)
- "Redirect URI mismatch" → If using own app, set redirect correctly

**Still Not Working?**
- Try in incognito mode (clear cookies)
- Disable browser extensions
- Use Chrome or Firefox (Safari can be problematic)
- Check Twitch status: https://status.twitch.tv

---

### Problem: YouTube API Key Not Working

**Symptoms:**
- Error: "Invalid API key"
- Error: "API key not activated"
- Connection test fails

**Solutions:**

1. **Create Project in Google Cloud Console**
   - Go to: https://console.cloud.google.com
   - Click "Select a project" → "New Project"
   - Name it "AI Streamer Companion"
   - Click "Create"

2. **Enable YouTube Data API v3**
   - In Google Cloud Console, go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click on it → Click "Enable"
   - Wait 1-2 minutes for activation

3. **Create API Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated key
   - Click "Restrict Key" (recommended)

4. **Restrict API Key (Security)**
   - Under "API restrictions":
     - Select "Restrict key"
     - Check "YouTube Data API v3"
   - Under "Application restrictions":
     - Choose "HTTP referrers"
     - Add your domain (e.g., `localhost:5173` for dev, `yourdomain.com` for prod)
   - Click "Save"

5. **Get Live Chat ID**
   - Not the same as channel ID!
   - Start a live stream on YouTube
   - Get live chat ID from stream URL or API
   - Format: `abc123xyz...` (long alphanumeric)
   - See [PLATFORM_GUIDE.md](./PLATFORM_GUIDE.md) for detailed steps

6. **Check API Quota**
   - YouTube API has daily quota (10,000 units/day free tier)
   - Live chat polling uses ~5-10 units per request
   - High-frequency polling depletes quota quickly
   - Solution: Increase polling interval or upgrade quota

**Quota Management:**
- Check current usage: Google Cloud Console → APIs & Services → Dashboard
- Request quota increase: IAM & Admin → Quotas
- Or reduce polling frequency in backend

**Common Errors:**
- "Daily quota exceeded" → Wait until midnight PST for quota reset
- "API not enabled" → Ensure YouTube Data API v3 is enabled in console
- "Invalid live chat ID" → Get correct ID from active live stream (not channel ID)

---

### Problem: "Monitoring" Shows Connected But No Messages

**Symptoms:**
- Platform shows "Connected" status
- Live monitoring enabled
- But no messages appear in chat feed

**Solutions:**

1. **Verify Backend is Running**
   - This app requires a backend server for live connections
   - Frontend shows "Connected" based on saved credentials
   - Actual connection requires backend bridge
   - See [QUICK_START.md](./QUICK_START.md) for backend setup

2. **Backend Not Deployed?**
   - If you haven't set up backend yet, monitoring won't receive real messages
   - Use **Chat Simulation** instead (in **Monitor** tab)
   - Click "Auto-generate messages" to test AI behavior
   - Deploy backend when ready for real Twitch/YouTube

3. **Check Backend Console**
   - If backend is running, check its console logs
   - Should see: "Connected to Twitch IRC" or "Polling YouTube chat"
   - Errors in backend logs indicate connection issues

4. **WebSocket Connection Failed**
   - Frontend connects to backend via WebSocket
   - Default: `ws://localhost:3000` (development)
   - Ensure backend WebSocket server is running
   - Check browser console for WebSocket errors

5. **Firewall Blocking Connection**
   - Firewall may block IRC (port 6667) or WebSocket (port 3000)
   - Temporarily disable firewall to test
   - Add exceptions for your backend ports

6. **Platform API Rate Limiting**
   - Twitch: ~20 messages/30 seconds (IRC)
   - YouTube: Polling every 5-10 seconds recommended
   - Too frequent requests = rate limit ban (temporary)
   - Backend should handle rate limiting automatically

**Testing Without Backend:**
- Use "Chat Simulation" feature
- Generates realistic AI messages locally
- Tests all features except real platform integration
- Perfect for development and personality tuning

---

## 💬 Chat Simulation Not Working

### Problem: Auto-Generate Messages Not Starting

**Symptoms:**
- Click "Auto-generate messages" but nothing happens
- Simulation toggle appears on but no messages
- Message count stays at 0

**Solutions:**

1. **Check Simulation Status**
   - Go to **Monitor** tab
   - Find "Chat Simulation" card
   - Ensure toggle is ON (green/active state)
   - Status should say "Simulation Running"

2. **Wait for Message Interval**
   - Simulation generates messages every 3 seconds
   - Not instant - wait 5-10 seconds after enabling
   - Watch for messages to appear in "Live Chat Feed"

3. **Check Browser Console**
   - Open console (F12)
   - Look for JavaScript errors
   - Errors indicate code issue (report as bug)

4. **Restart Simulation**
   - Toggle OFF
   - Wait 2 seconds
   - Toggle ON again
   - Should see first message within 10 seconds

5. **Check Stream Settings**
   - Go to **Settings** tab
   - Verify "Message Frequency" is set (default: 3)
   - Not set to 0 or very high number

6. **Clear State and Refresh**
   - Browser console: `localStorage.clear()`
   - Refresh page (Ctrl+R / Cmd+R)
   - Reconfigure settings
   - Try simulation again

**Still Not Working?**
- Try different browser
- Disable all browser extensions
- Check browser console for errors
- Report issue with console error messages

---

### Problem: AI Not Responding to Simulated Messages

**Symptoms:**
- Simulation generates user messages
- But AI never responds
- Only see user messages, no AI replies

**Solutions:**

1. **Enable Auto-Respond**
   - Go to **Settings** tab
   - Toggle "Auto Respond" to ON
   - This enables AI to reply automatically

2. **Check Response Delay**
   - In **Settings** tab, check "Response Delay" setting
   - Default: 3 seconds
   - AI waits this long before responding
   - Increase if responses too fast, decrease if too slow

3. **AI Response Probability**
   - AI responds to ~30% of messages (by design)
   - Not every message gets a response (realistic)
   - This prevents spam and feels more natural
   - Math.random() > 0.7 in code

4. **Wait Longer**
   - Response requires:
     - Message generation (3s)
     - Response delay (3s)
     - AI generation (<2s)
   - Total ~8-10 seconds for first AI response

5. **Check API Connectivity**
   - Open browser console
   - Look for 5xx errors (API issues)
   - If many errors, API may be rate limited
   - Wait 1 minute and try again

6. **Check Personality Configuration**
   - Go to **Personality** tab
   - Ensure personality is configured (not blank)
   - Default "Nova" should be present
   - Reset to preset if corrupted

**Manual Test:**
- Go to **Chat** tab
- Type a message manually
- Click send
- AI should respond within 5 seconds
- If this works, simulation AI is enabled but probability-based

---

## ⚡ Performance & Lag Issues

### Problem: App Slow / Laggy / Unresponsive

**Symptoms:**
- UI freezes when clicking buttons
- Long delays between actions
- Avatar stutters or drops frames
- High CPU/memory usage

**Solutions:**

1. **Close Unnecessary Tabs**
   - Each tab consumes memory
   - Close other browser tabs
   - Especially video/social media tabs

2. **Disable Avatar Temporarily**
   - Minimize or close "VTuber Avatar" card
   - 3D rendering is GPU-intensive
   - Test without avatar to isolate issue

3. **Reduce Vision Analysis Frequency**
   - Set analysis interval to 60 seconds (maximum)
   - Or disable vision entirely if not needed
   - Vision is most resource-intensive feature

4. **Disable Chat Simulation**
   - Auto-generating messages adds load
   - Turn off when not actively testing
   - Use manual chat testing instead

5. **Clear Browser Cache**
   - Chrome: Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
   - Time range: "All time"
   - Click "Clear data"

6. **Restart Browser**
   - Close ALL browser windows
   - Reopen browser
   - Go directly to app
   - Fresh start clears memory leaks

7. **Check System Resources**
   - Windows: Task Manager (Ctrl+Shift+Esc)
   - macOS: Activity Monitor
   - Linux: System Monitor or `top`
   - Look for high CPU/memory usage
   - Close other heavy apps (Discord, OBS, games)

8. **Lower Graphics Settings**
   - Disable hardware acceleration (paradoxically can help old GPUs)
   - Close other GPU-intensive apps
   - Lower screen resolution
   - Disable browser animations

9. **Update Browser**
   - Chrome: Settings → About Chrome → Auto-updates
   - Firefox: Menu → Help → About Firefox
   - Edge: Settings → About Microsoft Edge
   - Older versions can be slower

10. **Hardware Upgrade (If Persistent)**
    - Upgrade RAM (8GB minimum, 16GB recommended)
    - Use SSD instead of HDD
    - Update graphics drivers
    - Consider newer CPU

**Optimization Checklist:**
- ✅ Vision disabled or 60s interval
- ✅ Avatar minimized if not needed
- ✅ Simulation off when not testing
- ✅ Browser cache cleared
- ✅ Only 1-2 browser tabs open
- ✅ Latest browser version
- ✅ Hardware acceleration enabled (Chrome settings)

---

### Problem: API Requests Taking Too Long

**Symptoms:**
- AI responses take 10+ seconds
- Vision analysis times out
- "Generating..." indicator stays forever

**Solutions:**

1. **Check Internet Speed**
   - Run speed test: https://fast.com
   - Minimum: 5 Mbps download
   - Recommended: 10+ Mbps
   - High latency (>200ms) causes delays

2. **Switch to Faster Model**
   - App uses Gemini 3 Flash by default (fast)
   - If manually changed to Pro, switch back to Flash
   - Flash: <2s responses
   - Pro: 3-5s responses (more capable but slower)

3. **Reduce Vision Frequency**
   - Vision API calls are slowest (2-5s each)
   - Increase interval to 45-60 seconds
   - Capture smaller screen area (window vs full screen)

4. **Check API Rate Limits**
   - Gemini API has rate limits
   - If you're hammering API, it slows down
   - Reduce simulation speed
   - Space out manual tests

5. **Network Proxy/VPN**
   - VPNs add latency
   - Disable VPN temporarily to test
   - Use faster VPN server if required
   - Direct connection preferred

6. **Time of Day**
   - Google APIs may be slower during peak hours
   - Test at different times
   - Early morning/late night often faster

7. **Check Gemini API Status**
   - Visit: https://status.cloud.google.com
   - Check for Gemini API incidents
   - Outages are rare but possible

**Performance Targets:**
- Chat response: <2 seconds (Gemini Flash)
- Sentiment analysis: <1 second
- Vision analysis: 2-5 seconds
- SSML enhancement: 1-3 seconds

If consistently above these, network is likely the issue.

---

## 🌐 API & Network Errors

### Problem: "Failed to generate AI response" Error

**Symptoms:**
- Error toast appears
- Console shows API error
- AI doesn't respond to messages

**Solutions:**

1. **Check Console for Specific Error**
   - Open browser console (F12)
   - Look for error details:
     - `401 Unauthorized` → API key issue
     - `429 Too Many Requests` → Rate limited
     - `500 Internal Server Error` → Gemini API down
     - `Network Error` → Internet connectivity

2. **Rate Limit Exceeded (429)**
   - Wait 60 seconds before retrying
   - Reduce message frequency
   - Don't spam test messages
   - Spark runtime may have quotas

3. **Network Connectivity (Network Error)**
   - Check internet connection
   - Try loading google.com
   - Restart router if unstable
   - Switch to different network (mobile hotspot)

4. **Gemini API Outage (500/503)**
   - Check https://status.cloud.google.com
   - Wait for Google to resolve
   - Try again in 10-15 minutes
   - No action needed on your end

5. **Prompt Too Long**
   - Very long personality descriptions may exceed token limit
   - Go to **Personality** tab
   - Shorten bio and tone descriptions
   - Keep under 500 words total

6. **Invalid JSON Mode Response**
   - Some API calls use JSON mode
   - If Gemini returns non-JSON, parsing fails
   - Usually transient - retry works
   - Report if persistent for specific features

**Temporary Workaround:**
- Use **Response Templates** for pre-written messages
- Manually type responses during API outages
- Simulation still works without API (messages only, no AI responses)

---

### Problem: Sentiment Analysis Always Returns "Neutral"

**Symptoms:**
- All messages classified as neutral
- Even obviously positive/negative messages
- Sentiment monitor stuck at 0

**Solutions:**

1. **Check API Connectivity**
   - Sentiment uses Gemini API
   - If API is down, defaults to neutral
   - Test API with chat response (if that works, sentiment should too)

2. **Message Too Short**
   - Very short messages (1-2 words) may return neutral
   - Example: "ok", "hi", "yes"
   - This is technically correct (no strong sentiment)

3. **Test with Clear Sentiment**
   - Positive: "This is amazing! I love this so much! 🔥😍"
   - Negative: "This is terrible and boring. I hate this."
   - Should return positive/negative respectively

4. **Sentiment Prompt Issue**
   - If persistent, sentiment prompt may have issue
   - Check browser console for errors in `analyzeSentiment` function
   - Report as bug with example messages

5. **Wait for Analysis**
   - Sentiment analysis is async
   - Takes 1-2 seconds per message
   - Watch for sentiment to populate (may not be instant)

6. **Force Refresh**
   - Clear messages: Go to **Monitor** → Stop simulation → Refresh
   - Send new test messages
   - Check if sentiment updates

**Expected Behavior:**
- Clear positive messages → "positive"
- Clear negative messages → "negative"
- Questions, facts, greetings → "neutral"
- ~60-70% of real chat is neutral (normal)

---

## 🌐 Browser Compatibility Issues

### Problem: Features Not Working in Safari

**Symptoms:**
- Voice synthesis doesn't work
- SSML tags ignored
- Screen capture permission issues

**Solutions:**

1. **Known Safari Limitations**
   - SSML support: Very limited (only `<break>` and `<emphasis>`)
   - Phoneme boundaries: Not supported (lip-sync less accurate)
   - Screen recording: Requires macOS 10.15+ permission
   - Solution: **Use Chrome or Firefox for best experience**

2. **Enable Screen Recording (macOS)**
   - System Preferences → Security & Privacy → Screen Recording
   - Enable Safari
   - Restart Safari

3. **Safari Voice Settings**
   - macOS voices typically better quality than other browsers
   - Female voices recommended
   - SSML won't work - disable it and use plain text

4. **IndexedDB Issues**
   - Safari private mode blocks IndexedDB
   - Use normal (non-private) window
   - Check Settings → Privacy → Block All Cookies = OFF

5. **Update to Latest Safari**
   - macOS: System Preferences → Software Update
   - Safari updates with OS updates
   - Requires macOS 12+ for best compatibility

**Recommendation:** For full feature support, use Chrome 90+ or Firefox 88+.

---

### Problem: Features Not Working in Firefox

**Symptoms:**
- Some SSML tags ignored
- Occasional rendering issues

**Solutions:**

1. **Enable Permissions**
   - Firefox is strict with permissions
   - Click padlock icon → Permissions
   - Allow "Use Microphone" (for speech)
   - Allow "Share Screen" (for vision)

2. **SSML Support**
   - Firefox supports most SSML tags
   - Prosody (pitch/rate) partially supported
   - Volume changes not supported
   - Stick to emphasis and breaks for best results

3. **IndexedDB Quota**
   - Firefox limits storage per site
   - If storing lots of messages, may hit quota
   - Clear old data periodically
   - Go to Settings → Privacy → Manage Data → Remove site

4. **Hardware Acceleration**
   - Settings → General → Performance
   - Uncheck "Use recommended performance settings"
   - Check "Use hardware acceleration when available"
   - Restart Firefox

**Firefox is generally well-supported.** Most issues relate to SSML limitations.

---

## 🎵 SSML Not Working

### Problem: SSML Tags Have No Effect

**Symptoms:**
- Tags like `<emphasis>` ignored
- Prosody changes don't apply
- Voice sounds identical with or without SSML

**Solutions:**

1. **Browser SSML Support**
   - Chrome: Best support (all basic tags)
   - Firefox: Moderate support (emphasis, breaks)
   - Safari: Minimal support (breaks only)
   - Edge: Same as Chrome (Chromium-based)
   - **Solution: Use Chrome**

2. **Enable SSML in Settings**
   - Go to **Voice** tab
   - Toggle "Enable SSML" = ON
   - Without this, SSML is stripped

3. **Test Basic Tags First**
   ```xml
   Hello <break time="500ms"/> world
   ```
   - Start with simple break tag
   - If this works, browser supports some SSML
   - If not, browser may not support SSML at all

4. **Avoid Unsupported Tags**
   - `<say-as>`: Rarely supported
   - `<audio>`: Not supported by Web Speech API
   - `<mark>`: Not supported
   - Stick to: `<break>`, `<emphasis>`, `<prosody>`

5. **Proper XML Syntax**
   ```xml
   <!-- ✅ CORRECT -->
   <prosody pitch="+10%">Hello</prosody>
   
   <!-- ❌ WRONG -->
   <prosody pitch=+10%>Hello</prosody>  <!-- Missing quotes -->
   <prosody pitch="10">Hello</prosody>   <!-- Missing unit -->
   <Prosody pitch="+10%">Hello</Prosody> <!-- Wrong case -->
   ```
   - Use lowercase tags
   - Quote all attribute values
   - Include units (%, ms)
   - Close all tags

6. **Test AI Auto-Enhancement**
   - Go to **Voice** tab → **Auto-Enhancement**
   - Let AI generate SSML for you
   - Copy output to SSML Editor
   - Test if AI-generated SSML works

7. **Fallback to Plain Text**
   - If SSML doesn't work on your browser
   - Disable SSML feature
   - Use expressive plain text instead
   - Example: "That was... AMAZING!!!" (instead of emphasis tags)

**Browser SSML Feature Matrix:**

| Tag | Chrome | Firefox | Safari | Edge |
|-----|--------|---------|--------|------|
| `<break>` | ✅ | ✅ | ✅ | ✅ |
| `<emphasis>` | ✅ | ⚠️ | ⚠️ | ✅ |
| `<prosody pitch>` | ✅ | ⚠️ | ❌ | ✅ |
| `<prosody rate>` | ✅ | ⚠️ | ❌ | ✅ |
| `<prosody volume>` | ⚠️ | ❌ | ❌ | ⚠️ |

✅ = Fully supported | ⚠️ = Partial support | ❌ = Not supported

---

## 🔙 Backend Connection Failures

### Problem: "Backend Not Connected" Warning

**Symptoms:**
- Warning message about backend not available
- Live monitoring doesn't receive messages
- "Connected" status but no data flow

**Solutions:**

1. **Backend Required for Live Platforms**
   - This is not an error if you haven't deployed backend yet
   - Frontend works standalone for testing/simulation
   - Real Twitch/YouTube requires backend server
   - See [QUICK_START.md](./QUICK_START.md) to deploy backend

2. **Backend Server Not Running**
   - If you have backend code, ensure it's running
   - Node.js: `node server.js` or `npm start`
   - Python: `python server.py`
   - Check terminal for "Server running on port 3000" message

3. **Wrong WebSocket URL**
   - Frontend expects: `ws://localhost:3000` (dev)
   - Or: `wss://your-backend.com` (production)
   - Update WebSocket URL in frontend code if using custom domain
   - Check `PlatformConnection.tsx` for WebSocket connection code

4. **Firewall Blocking WebSocket**
   - Port 3000 (default) may be blocked
   - Temporarily disable firewall to test
   - Add firewall exception for port 3000
   - Or use different port (update both frontend and backend)

5. **CORS Issues**
   - Backend must allow frontend origin
   - Express: `app.use(cors({ origin: 'http://localhost:5173' }))`
   - Check backend console for CORS errors

6. **Backend Crashed**
   - Check backend terminal/logs for errors
   - Common: Twitch IRC connection failed, YouTube API error
   - Restart backend after fixing issues

**Testing Without Backend:**
- Use "Chat Simulation" in **Monitor** tab
- All AI features work without backend
- Only missing: Real platform message streaming
- Perfect for development and personality testing

---

## 💾 Data Persistence Problems

### Problem: Settings Not Saving / Lost After Refresh

**Symptoms:**
- Personality resets to default after page reload
- Templates disappear
- Messages not persisting

**Solutions:**

1. **Check IndexedDB Support**
   ```javascript
   // In browser console:
   console.log('IndexedDB:', 'indexedDB' in window);
   ```
   - If `false`, browser doesn't support persistence
   - Use modern browser (Chrome 90+, Firefox 88+)

2. **Private/Incognito Mode**
   - IndexedDB is disabled in private browsing
   - Use normal browser window
   - Data persists only in normal mode

3. **Browser Storage Settings**
   - Chrome: Settings → Privacy → Site Settings → Cookies → Allow all cookies
   - Firefox: Settings → Privacy → History → "Remember history"
   - Don't use "Clear data on exit" setting

4. **Storage Quota Exceeded**
   - Browser limits storage per site (~10GB)
   - If storing thousands of messages, may hit limit
   - Clear old data in **Monitor** tab
   - Or clear browser storage: `localStorage.clear()`

5. **Check Spark KV Status**
   - Open browser console
   - Run: `await spark.kv.keys()`
   - Should return array of keys
   - If error, KV system is not working

6. **Force Save Test**
   ```javascript
   // In browser console:
   await spark.kv.set('test-key', { value: 'test' });
   await spark.kv.get('test-key'); // Should return { value: 'test' }
   ```
   - If this works, persistence is functional
   - Issue may be specific to component state management

**Data Backup:**
- Export personality config: Copy from **Personality** tab
- Export templates: Copy from **Templates** tab
- Save to text file as backup
- Re-import after clearing storage if needed

---

### Problem: Messages Disappearing from Live Monitor

**Symptoms:**
- Messages appear then disappear
- Chat feed empties unexpectedly
- Message count resets

**Solutions:**

1. **Message Limit**
   - App may limit messages to prevent memory issues
   - Check code for `.slice()` operations
   - Typically keeps last 50-100 messages
   - Older messages are automatically removed

2. **State Management Issue**
   - If rapid deletion, may be state bug
   - Check browser console for errors
   - Refresh page to reset state

3. **Clear Messages Button**
   - Ensure you didn't accidentally click "Clear"
   - Some features have clear/reset buttons
   - Check **Monitor** tab for clear buttons

4. **Simulation Reset**
   - Stopping and restarting simulation may clear messages
   - By design to provide fresh test environment
   - Use manual chat testing if you want to keep history

5. **Browser Storage Cleared**
   - Another tab or extension may have cleared storage
   - Privacy extensions sometimes auto-clear data
   - Disable extensions or whitelist your domain

---

## 🐛 General Debugging Tips

### Enable Debug Mode

```javascript
// Open browser console (F12) and run:
localStorage.setItem('debug', 'true');
// Reload page
// More verbose console logging will appear
```

### Check Browser Console

1. Press F12 (or Cmd+Option+I on Mac)
2. Go to "Console" tab
3. Look for red error messages
4. Copy error text when reporting bugs

### Check Network Tab

1. Open DevTools (F12) → "Network" tab
2. Filter by "Fetch/XHR"
3. Look for failed requests (red)
4. Click on failed request → "Response" tab
5. See exact API error message

### Test in Clean Environment

1. Open incognito/private window
2. Navigate to app
3. Test feature that's failing
4. If works → Extension or cache issue
5. If still fails → App or browser issue

### Verify API Connectivity

```javascript
// Test Gemini API directly:
const prompt = spark.llmPrompt`Say hello`;
const response = await spark.llm(prompt, "gpt-4o");
console.log(response); // Should return AI greeting
```

### Check System Resources

- **Chrome:** Menu → More Tools → Task Manager
  - Shows per-tab memory and CPU usage
  - High usage indicates performance issue

- **Firefox:** about:performance
  - Shows which tabs are consuming resources

### Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 401 | Unauthorized | API key issue (Spark handles this) |
| 403 | Forbidden | Missing permissions or wrong token |
| 429 | Rate Limited | Wait 60s, reduce request frequency |
| 500 | Server Error | Gemini API issue, wait and retry |
| 503 | Service Unavailable | Gemini API down, check status |

### Report Bugs Effectively

Include in bug report:
1. **Browser & version** (Chrome 120, Firefox 115, etc.)
2. **Operating System** (Windows 11, macOS 14, etc.)
3. **Steps to reproduce** (1. Go to X tab, 2. Click Y, 3. See error)
4. **Expected vs actual behavior**
5. **Console errors** (screenshot or copy text)
6. **Screenshots/video** if visual issue

---

## 🆘 Still Need Help?

### Documentation Resources

- **[QUICK_START.md](./QUICK_START.md)** - 30-minute setup guide
- **[BACKEND_DEPLOYMENT_GUIDE.md](./BACKEND_DEPLOYMENT_GUIDE.md)** - Full deployment reference
- **[PLATFORM_GUIDE.md](./PLATFORM_GUIDE.md)** - Twitch/YouTube API setup
- **[VOICE_SYNTHESIS_GUIDE.md](./VOICE_SYNTHESIS_GUIDE.md)** - TTS and SSML details
- **[EMOTION_SYNC_GUIDE.md](./EMOTION_SYNC_GUIDE.md)** - Avatar sync documentation
- **[REQUIREMENTS.md](./REQUIREMENTS.md)** - System requirements

### Get Support

- 🐛 **GitHub Issues** - Report bugs or request features
- 💬 **GitHub Discussions** - Ask questions, share tips
- 📧 **Email** - For private inquiries
- 🤝 **Community** - Help others in discussions

### Before Asking for Help

✅ Read this troubleshooting guide
✅ Check browser console for errors
✅ Try in different browser
✅ Test in incognito mode
✅ Search existing GitHub issues
✅ Review relevant documentation

When asking for help, include:
- What you're trying to do
- What you expected to happen
- What actually happened
- Error messages (console, terminal)
- Browser and OS versions
- Steps you've already tried

---

**Last Updated:** January 2025

**Found a solution not listed here?** Please contribute by opening a pull request!
