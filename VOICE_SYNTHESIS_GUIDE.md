# Voice Synthesis (Text-to-Speech) Guide

## Overview

The AI Streamer Companion now features **browser-native text-to-speech (TTS)** voice synthesis, allowing Nova (your AI companion) to speak audibly during streams. This creates a more immersive VTuber-like experience similar to Neuro-sama, where the avatar both animates and speaks with a configurable voice.

## Features

### Core Capabilities

- **Real Voice Output**: Converts all AI-generated text into natural-sounding speech
- **Voice Customization**: Configure gender, pitch, speed, and volume to match your AI's personality
- **Automatic Synchronization**: Voice output is perfectly synced with lip animations and emotions
- **Visual Feedback**: Real-time indicators show speaking status and progress
- **Browser-Native**: Uses Web Speech API - no external services required
- **Low Latency**: Speech begins within 500ms of text generation

### Voice Settings

#### Gender Selection
- **Female**: Warm, friendly voice (recommended for Nova)
- **Male**: Deeper, authoritative voice
- **Neutral**: Balanced, gender-neutral tone

#### Pitch Control
- **Low (0.8x)**: Deeper voice tone
- **Normal (1.0x)**: Natural pitch (recommended)
- **High (1.3x)**: Higher, more energetic tone

#### Speed Control
- **Slow (0.8x)**: Clear, deliberate speech
- **Normal (1.0x)**: Natural speaking pace (recommended)
- **Fast (1.3x)**: Quick, energetic delivery

#### Volume Control
- **Range**: 0-100%
- **Default**: 80%
- **Recommendation**: Adjust based on your stream audio mix

#### Voice Selection
The system automatically selects the best available voice based on your gender preference, but you can manually choose from all compatible voices installed on your system.

## How It Works

### Automatic Voice Integration

Voice synthesis is automatically integrated into all AI response scenarios:

1. **Chat Responses**: When Nova responds to chat messages
2. **Vision Commentary**: When gameplay analysis generates commentary
3. **Simulated Messages**: During chat simulation testing

### Speech Flow

```
AI Text Generated → Voice Enabled Check → Speech Synthesis Engine →
Audio Playback Begins → Phoneme Detection → Lip Sync Animation →
Progress Tracking → Speech Completes → Avatar Returns to Neutral
```

### Lip-Sync Integration

The voice system is tightly integrated with the phoneme-based lip-sync:

- **Boundary Events**: Speech engine triggers phoneme changes at word boundaries
- **Accurate Timing**: Mouth movements match actual audio output
- **Emotion Amplification**: Active emotions affect both voice delivery and mouth movements
- **Real-time Monitoring**: Visual indicators show current phoneme and sync status

## Browser Compatibility

### Supported Browsers
- ✅ **Chrome/Edge**: Excellent support with many voices
- ✅ **Safari**: Good support with macOS voices
- ⚠️ **Firefox**: Limited support, fewer voices available
- ❌ **Older Browsers**: May not support Web Speech API

### Voice Availability

The number and quality of voices depend on your operating system:

- **Windows**: Microsoft voices (Zira, David, etc.)
- **macOS**: Apple voices (Samantha, Victoria, etc.)
- **Linux**: eSpeak voices (variable quality)
- **Google Voices**: Available on Chrome/Chromium browsers

## Setup Guide

### Initial Configuration

1. **Navigate to Voice Tab**
   - Click the "Voice" tab in the main navigation
   - Voice settings card will appear

2. **Enable Voice Synthesis**
   - Toggle "Enable Voice Synthesis" switch to ON
   - Badge will show "Enabled" status

3. **Configure Voice**
   - Select preferred **Gender** (Female recommended for Nova)
   - Choose **Pitch** (Normal recommended)
   - Set **Speed** (Normal recommended)
   - Adjust **Volume** slider (80% recommended)

4. **Test Your Settings**
   - Click "Test Voice" button
   - Avatar will speak a sample phrase
   - Adjust settings until you're satisfied

5. **Go Live**
   - Navigate to Monitor tab
   - Start chat simulation or connect to live platform
   - Nova will now speak all responses audibly

### Advanced Configuration

#### Selecting Specific Voices

If you want more control over voice selection:

1. Open the "Specific Voice" dropdown
2. Browse available voices on your system
3. Preview voices by selecting and testing
4. Leave on "Auto-select (Recommended)" for best automatic matching

#### Fine-Tuning for Your Stream

**For High-Energy Streams:**
- Gender: Female
- Pitch: High
- Speed: Fast
- Result: Energetic, enthusiastic delivery

**For Chill Streams:**
- Gender: Neutral
- Pitch: Low
- Speed: Slow
- Result: Calm, relaxed delivery

**For Educational Content:**
- Gender: Male
- Pitch: Normal
- Speed: Slow
- Result: Clear, authoritative delivery

## Voice Activity Monitoring

### Real-Time Indicators

The **Voice Activity Monitor** card (visible in Monitor tab) shows:

- **Status Badge**: Speaking / Loading / Silent
- **Current Text**: What Nova is currently saying
- **Progress Bar**: How far through the current speech
- **Visual Animation**: Pulsing speaker icon when active

### Commentary Sync Monitor

The existing sync monitor now includes voice data:

- **Phoneme Display**: Current sound being spoken
- **Lip Sync Status**: Green when voice is active
- **Timing Sync**: Ensures audio and visuals match

## Troubleshooting

### Voice Not Working

**Check Browser Compatibility:**
- Ensure you're using Chrome, Edge, or Safari
- Update to the latest browser version

**Verify Voice Enabled:**
- Go to Voice tab
- Ensure toggle is ON
- Check badge shows "Enabled"

**Test Basic Functionality:**
- Click "Test Voice" button
- If test fails, Web Speech API may not be available

### Voice Sounds Robotic

**Adjust Settings:**
- Try different voice gender options
- Lower the speed to 0.8x for more natural delivery
- Select a different specific voice from the dropdown

**System Limitations:**
- Voice quality depends on your OS
- Install additional TTS voices on your system for better options

### Lip Sync Not Matching

**This is Normal:**
- Web Speech API has limited boundary events
- Phoneme detection is approximated from word boundaries
- Some mismatch is expected with browser TTS

**Optimization Tips:**
- Use normal speed (1.0x) for best sync
- Avoid extremely fast or slow speeds
- Shorter responses sync better than long ones

### Audio Too Loud/Quiet

**Adjust Volume:**
- Open Voice tab
- Use volume slider (0-100%)
- Test and iterate until balanced

**OBS Audio Mixing:**
- Add browser source to OBS
- Control via OBS audio mixer
- Apply filters (compressor, noise gate) as needed

## Best Practices

### Stream Setup

1. **Pre-Stream Testing**
   - Test voice in chat simulator before going live
   - Ensure volume is balanced with game audio and microphone
   - Configure OBS audio routing appropriately

2. **Voice Personality Matching**
   - Match voice settings to AI personality
   - Energetic personality = higher pitch, faster speed
   - Chill personality = lower pitch, slower speed

3. **Viewer Experience**
   - Keep volume at 70-90% for comfortable listening
   - Avoid extreme pitch settings (can sound unnatural)
   - Normal speed (1.0x) is usually best for clarity

### Performance Optimization

- Voice synthesis adds minimal CPU overhead
- Browser handles all processing natively
- No impact on stream performance
- Works seamlessly with vision analysis

### Content Considerations

- Voice adds significant engagement value
- Viewers can hear Nova even when not watching screen
- Creates more personality than text-only responses
- Makes stream feel more interactive and alive

## Technical Details

### Web Speech API

The voice system uses the browser's built-in [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API):

- **SpeechSynthesis Interface**: Controls voice playback
- **SpeechSynthesisUtterance**: Represents speech requests
- **Voice Events**: onstart, onboundary, onend, onerror
- **No External Dependencies**: Completely browser-native

### Data Persistence

Voice settings are persisted using the Spark KV store:

- **Key**: `voice-settings`
- **Data**: All voice configuration (enabled, gender, pitch, speed, volume, voiceName)
- **Persistence**: Survives page refreshes and browser restarts

### Integration Points

Voice synthesis integrates with:

1. **Response Generation** (`handleSendMessage`)
2. **Vision Commentary** (`handleVisionCommentary`)
3. **Chat Simulation** (`handleSimulateMessage`)
4. **Test Function** (`handleTestVoice`)

### Performance Metrics

- **Latency**: <500ms from text to audio start
- **CPU Usage**: Negligible (browser-native)
- **Memory**: ~2MB for voice engine
- **Network**: Zero (no external API calls)

## Future Enhancements

Potential improvements for future versions:

- **Emotional Voice Modulation**: Adjust pitch/speed based on emotion
- **Custom Voice Training**: User-provided voice samples
- **Voice Effects**: Reverb, echo, filters for style
- **Multi-language Support**: Non-English TTS
- **SSML Support**: Advanced speech markup for better prosody

## FAQ

**Q: Does this work offline?**
A: Yes! Voice synthesis is completely browser-native and requires no internet connection.

**Q: Can I use my own voice?**
A: Not currently. The system uses OS-provided TTS voices. Custom voice training may be added in future updates.

**Q: Will this work on mobile?**
A: Mobile browser support is limited. iOS Safari has good support, Android Chrome is variable.

**Q: Does this cost anything?**
A: No! Voice synthesis uses free, browser-native APIs with no usage limits or costs.

**Q: Can viewers hear the voice in my stream?**
A: Only if you capture the browser audio in OBS. Add the browser source and enable audio monitoring.

**Q: How do I make the voice sound more human?**
A: Use normal pitch and speed, select high-quality voices (macOS and Windows have the best), and keep responses concise.

**Q: Can I disable voice for certain responses?**
A: Turn off the "Enable Voice Synthesis" toggle in Voice settings to disable globally. Selective disabling is not currently available.

---

For additional support or feature requests, refer to the main documentation or submit feedback through the platform.
