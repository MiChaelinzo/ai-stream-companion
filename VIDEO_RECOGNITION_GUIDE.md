# Video Recognition Guide

## Overview

The AI Streamer Companion now includes powerful video analysis capabilities powered by Gemini 3 AI. Upload gameplay videos to get automated frame-by-frame analysis, highlight detection, commentary generation, and performance insights.

## Features

### 🎬 Video Upload & Processing
- **Supported Formats**: MP4, WebM, MOV
- **Max File Size**: 100MB (configurable)
- **Frame Extraction**: Automatically extracts key frames at specified intervals
- **Smart Analysis**: AI analyzes each frame for content, actions, and events

### 🤖 AI-Powered Analysis

#### Frame Analysis
- **Game Detection**: Identifies the game being played with confidence scoring
- **Scene Description**: Detailed description of what's happening in each frame
- **Object Detection**: Lists visible characters, UI elements, and objects
- **Action Recognition**: Identifies player actions and game events
- **Emotion Mapping**: Suggests appropriate emotional reactions for commentary

#### Key Moments Detection
The AI automatically identifies:
- **Highlights**: Epic plays, achievements, victories
- **Actions**: Significant gameplay actions
- **Events**: Important game events (boss battles, level ups, etc.)
- **Scene Changes**: Transitions between areas or game states

#### Commentary Generation
- **Streamer-Style Commentary**: AI generates engaging commentary lines
- **Multiple Styles**: Hype, analytical, casual, educational, or comedic
- **Context-Aware**: Commentary reflects actual gameplay events
- **Voice-Ready**: Commentary can be used with TTS/SSML features

#### Performance Insights
- **Skill Assessment**: AI evaluates player skill level
- **Strengths Analysis**: Identifies what the player does well
- **Improvement Areas**: Suggests specific areas for growth
- **Coaching Tips**: Actionable advice for better gameplay

## How to Use

### 1. Navigate to Vision Tab
Go to the **Vision AI** tab in the main application.

### 2. Upload Video
1. Click the **upload area** or drag & drop your video file
2. Supported formats: MP4, WebM, MOV (max 100MB)
3. Wait for the video to load

### 3. Analyze Video
1. Click **"Analyze Video"** button
2. Watch the progress bar as frames are extracted and analyzed
3. Processing time varies based on video length (typically 30-120 seconds)

### 4. Review Results
The analysis results include multiple tabs:

#### Overview Tab
- Game detection and genre
- Video summary
- Key statistics (duration, frames analyzed, highlights found)

#### Commentary Tab
- AI-generated commentary lines
- Ready to use for voiceovers or stream narration
- Can be spoken using the Voice & SSML features

#### Key Moments Tab
- Timestamp-based list of highlights
- Type classification (highlight, action, event, scene-change)
- Description of what happened
- Jump-to-time functionality

#### Frames Tab
- Visual grid of all analyzed frames
- Thumbnails with timestamps
- Quick preview of frame-by-frame analysis

#### Performance Tab
- Skill level assessment
- Identified strengths
- Areas for improvement
- Coaching suggestions

## Configuration Options

### Frame Extraction Settings
```typescript
frameInterval: 2 // Extract one frame every 2 seconds
maxFrames: 30    // Maximum 30 frames total
```

### Analysis Settings
- **detectKeyMoments**: Enable/disable highlight detection
- **generateCommentary**: Enable/disable commentary generation
- **analyzePerformance**: Enable/disable skill assessment
- **commentaryStyle**: Choose between hype/analytical/casual/educational/comedic

## Integration with Other Features

### With Voice & SSML
1. Analyze your video to get commentary
2. Go to **Voice & SSML** tab
3. Paste commentary into SSML Editor
4. Use Auto-Enhancement for expressive speech
5. Test with your avatar's voice

### With Avatar
- Commentary emotion tags sync with avatar emotions
- Use during streams to react to your own highlights
- Perfect for creating recap videos with AI narration

### With Performance Tracking
- Compare video analysis insights with live performance metrics
- Track improvement over multiple gameplay sessions
- Use AI coaching suggestions from both sources

## Use Cases

### 📹 Highlight Reel Creation
1. Upload full stream VOD
2. AI identifies highlight moments with timestamps
3. Use key moments list to quickly create highlight clips
4. Get pre-written commentary for each highlight

### 🎓 Gameplay Review & Learning
1. Upload practice session or ranked game
2. Review performance insights
3. Get specific improvement suggestions
4. Track progress over multiple uploads

### 🎙️ Content Creation
1. Upload raw gameplay footage
2. Generate commentary automatically
3. Use commentary for voiceover scripts
4. Identify best moments for social media clips

### 📊 Streaming Preparation
1. Review previous stream VODs
2. Analyze what content performed well
3. Identify engaging moments
4. Plan better content for future streams

## Technical Details

### Processing Pipeline
1. **Video Loading**: File loaded into browser video element
2. **Frame Extraction**: Canvas API extracts JPEG frames at intervals
3. **Frame Analysis**: Each frame sent to Gemini 3 Vision API
4. **Aggregation**: AI combines frame analyses into overall insights
5. **Commentary Generation**: AI creates engaging commentary based on full context

### Performance Optimization
- **Adaptive Frame Selection**: Only analyzes key frames to save API calls
- **Progressive Analysis**: Updates UI as frames are processed
- **Client-Side Processing**: Frame extraction happens in browser
- **Efficient Encoding**: Frames compressed to JPEG for API transmission

### Data Storage
- **Persistent Storage**: Analysis results saved using useKV
- **History**: Keep up to 50 most recent video analyses
- **Thumbnails**: Frame thumbnails stored as base64 data URLs
- **Metadata**: File info, timestamps, and insights all persisted

## Tips & Best Practices

### For Best Results
✅ **DO:**
- Upload clear, well-lit gameplay footage
- Use standard resolutions (720p, 1080p)
- Keep videos under 5 minutes for faster processing
- Provide game context in file name if possible

❌ **DON'T:**
- Upload extremely long videos (will be slow to process)
- Use heavily compressed or low-quality footage
- Include non-gameplay content (loading screens, menus)
- Upload copyrighted content you don't own

### Optimization Tips
- **Shorter Videos = Faster Analysis**: Break long streams into segments
- **Key Moments Only**: Trim to the most interesting parts before uploading
- **Good Lighting**: Better visibility = better AI analysis
- **Stable Camera**: Less motion blur = clearer frame analysis

## Troubleshooting

### Video Won't Upload
- Check file size (must be under 100MB)
- Verify file format (MP4, WebM, or MOV)
- Try converting video to MP4 with standard codec
- Clear browser cache and try again

### Analysis is Slow
- Large videos take longer (expected behavior)
- Reduce maxFrames setting for faster processing
- Increase frameInterval to skip more frames
- Check internet connection (API calls required)

### Poor Analysis Quality
- Upload higher quality video
- Ensure gameplay is clearly visible
- Avoid heavily edited or filtered footage
- Try different sections of the video

### Memory Issues
- Close other browser tabs
- Refresh the page before uploading large videos
- Use browser's task manager to monitor memory
- Consider uploading shorter clips

## API Usage

The video analysis feature uses the Gemini 3 API extensively:
- **Vision API**: For frame-by-frame image analysis
- **Text Generation**: For commentary and insights
- **JSON Mode**: For structured data extraction

Typical API calls per video:
- 1 call per frame (default: 30 frames)
- 1 call for overall analysis
- Total: ~31 API calls per video

## Future Enhancements

Planned features for future updates:
- Batch video processing
- Real-time live stream analysis
- Advanced filtering and search
- Export analysis to JSON/CSV
- Video timestamp markers
- Clip creation tools
- Multi-game comparison
- Team/multiplayer analysis
- Custom commentary templates
- Integration with OBS for direct capture

## Example Workflow

### Creating a Highlight Reel with Commentary

1. **Record Your Stream**
   - Stream your gameplay as usual
   - Save the VOD or local recording

2. **Upload to Analyzer**
   - Go to Vision AI tab
   - Upload your gameplay video
   - Wait for analysis to complete

3. **Review Key Moments**
   - Check the "Key Moments" tab
   - Identify timestamps of highlights
   - Note the AI-generated descriptions

4. **Generate Commentary**
   - Review the "Commentary" tab
   - Copy engaging commentary lines
   - Edit or customize as needed

5. **Create Highlight Clips**
   - Use timestamps to cut your video (external editor)
   - Add AI commentary as voiceover
   - Use Voice & SSML to generate audio

6. **Polish & Share**
   - Add your intro/outro
   - Export final highlight reel
   - Share on social media with engagement boost!

## Related Documentation

- **[VISION_SETUP_GUIDE.md](./VISION_SETUP_GUIDE.md)**: General vision AI setup
- **[SCREENSHOT_RECOGNITION_GUIDE.md](./SCREENSHOT_RECOGNITION_GUIDE.md)**: Screenshot analysis
- **[VOICE_SYNTHESIS_GUIDE.md](./VOICE_SYNTHESIS_GUIDE.md)**: Voice and SSML features
- **[GEMINI_INTEGRATION.md](./GEMINI_INTEGRATION.md)**: Gemini 3 API details

## Support

Need help with video analysis?
- Check the **AI Support** tab for instant help
- Review the **Troubleshooting** section above
- See **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for common issues

---

**Note**: Video analysis requires an active internet connection and uses the Gemini 3 API. Processing time depends on video length and number of frames analyzed. All analysis happens in your browser with results stored locally.
