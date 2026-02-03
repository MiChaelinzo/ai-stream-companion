# Screenshot Recognition Guide

## Overview

The **Screenshot Analyzer** feature provides AI-powered image recognition for uploaded screenshots, particularly useful for analyzing gameplay captures, stream moments, and generating commentary suggestions.

## Features

### 🖼️ Image Recognition
- **Upload & Analyze**: Upload screenshots (PNG, JPG, WebP up to 10MB)
- **AI Analysis**: Powered by GPT-4o for comprehensive image understanding
- **Gaming Focus**: Specialized in gaming content and stream scenarios

### 🎯 Analysis Components

#### 1. Visual Description
- Comprehensive 2-3 sentence description of the image
- Scene composition and overall content

#### 2. Object Detection
- Identifies major elements, characters, UI components
- Lists detected objects and features
- Game-specific element recognition

#### 3. Game Context
- Identifies the game (if applicable)
- Describes the scene or gameplay situation
- Provides context for what's happening

#### 4. Streamer Commentary Suggestions
- **Suggested Response**: Natural, enthusiastic streamer comment
- **Action Items**: 2-3 specific talking points
- **Highlights**: Noteworthy elements worth calling out

#### 5. Mood & Atmosphere
- Overall tone and vibe of the image
- Emotional context
- Suggested streaming energy level

#### 6. Technical Assessment
- Resolution impression
- Image quality evaluation
- Clarity and visibility notes

## How to Use

### Basic Upload Flow

1. **Navigate to Vision Tab**
   ```
   Main App → Vision AI Tab → Screenshot Analyzer (top section)
   ```

2. **Upload Screenshot**
   - Click "Select Screenshot" button
   - Choose image file from your device
   - Wait for AI analysis (typically 5-10 seconds)

3. **Review Results**
   - View AI-generated description
   - Check detected objects and elements
   - Read suggested streamer responses
   - See commentary suggestions

### Analysis Cards

Each analyzed screenshot displays:

```
┌─────────────────────────────────────────┐
│ 📸 Filename.png • 2.3 MB • 85% confidence│
│ Dec 20, 2024, 3:45 PM                   │
├─────────────────────────────────────────┤
│ [Screenshot Preview - Click to Enlarge] │
├─────────────────────────────────────────┤
│ Description: [AI description here]       │
│                                          │
│ Game Context: [Game & situation]         │
│                                          │
│ 💬 Suggested Response:                   │
│    "Streamer comment here..."           │
│                                          │
│ Detected Elements: [Object badges]       │
│                                          │
│ Highlights:                              │
│ • Notable point 1                        │
│ • Notable point 2                        │
│                                          │
│ Commentary Suggestions:                  │
│ → Talk about this                        │
│ → Mention that                           │
│ → React to this element                  │
└─────────────────────────────────────────┘
```

## Use Cases

### 1. Pre-Stream Content Planning
```
Upload screenshots from recent gameplay
↓
Review AI commentary suggestions
↓
Prepare talking points for stream
```

### 2. Live Stream Assistance
```
Viewer sends screenshot in Discord/chat
↓
Upload to analyzer during break
↓
Get instant commentary ideas
↓
Discuss on stream
```

### 3. Highlight Analysis
```
Upload epic moment screenshot
↓
Get AI description and hype suggestions
↓
Use for social media posts
↓
Craft engaging captions
```

### 4. Game Recognition
```
Upload unfamiliar game screenshot
↓
AI identifies game and context
↓
Research and prepare commentary
```

## Tips for Best Results

### Image Quality
✅ **Good Screenshots:**
- High resolution (1080p or higher)
- Clear, visible elements
- Good lighting/contrast
- In-game HUD visible

❌ **Avoid:**
- Heavily compressed images
- Blurry or motion-blurred captures
- Extremely dark or overexposed images
- Screenshots with watermarks covering content

### Content Types

**Optimal for:**
- Gameplay screenshots
- Game UI captures
- Epic moments/highlights
- Character close-ups
- Scene compositions
- In-game cinematics

**Works with:**
- Stream overlays
- Desktop captures
- Game menus
- Achievement screens
- Scoreboard screenshots

## Integration with Other Features

### 🎙️ Voice Synthesis
Use suggested responses with Voice & SSML tab:
1. Copy suggested response from analysis
2. Go to Voice & SSML tab
3. Paste into SSML Editor
4. Add expression and speak

### 🎭 Avatar Integration
Analysis mood influences avatar emotion:
- **Exciting screenshot** → Happy/Excited avatar
- **Tense moment** → Focused/Thinking avatar
- **Sad scene** → Compassionate avatar

### 📊 Live Monitor
Use commentary suggestions during live streams:
1. Analyze screenshot
2. Copy suggested talking points
3. Reference during live chat responses
4. React naturally with AI-generated ideas

## Technical Details

### Supported Formats
- **PNG** (recommended for screenshots)
- **JPG/JPEG** (good compression)
- **WebP** (modern format)

### File Size Limits
- Maximum: **10 MB per file**
- Recommended: **2-5 MB** for optimal speed
- Minimum: No minimum (but higher quality = better analysis)

### Processing Time
- **Upload**: Instant (local file reading)
- **AI Analysis**: 5-15 seconds depending on:
  - Image size
  - Complexity of content
  - API response time

### Confidence Scores
Analysis includes confidence rating:
- **90-100%**: Very high confidence, detailed analysis
- **80-89%**: High confidence, reliable results
- **70-79%**: Good confidence, accurate main points
- **Below 70%**: Lower confidence, verify suggestions

## Privacy & Data

### Storage
- Screenshots are **stored locally in your browser**
- Analysis results saved to browser storage (IndexedDB)
- **No uploads to external servers** except AI API
- Images can be deleted anytime

### Data Handling
```
Your Screenshot
    ↓
Convert to base64 (local)
    ↓
Send to OpenAI API for analysis
    ↓
Receive text analysis
    ↓
Store locally in browser
```

### Clearing Data
- **Individual**: Click ❌ on any analysis card
- **All**: Click "Clear All" button
- **Browser**: Clear browser data removes everything

## Troubleshooting

### "Failed to analyze screenshot"
**Causes:**
- File too large (>10MB)
- Invalid image format
- Corrupted file
- API timeout

**Solutions:**
1. Reduce image size/quality
2. Convert to PNG or JPG
3. Re-capture the screenshot
4. Try again (temporary API issue)

### Low Confidence Scores
**Reasons:**
- Blurry or unclear image
- Unfamiliar game/content
- Heavy visual effects or filters
- Partial UI obstruction

**Improvements:**
- Use higher resolution screenshots
- Capture clearer moments
- Include more context in frame
- Remove heavy post-processing

### "File size must be under 10MB"
**Solutions:**
- Use image compression tools
- Reduce screenshot resolution
- Convert PNG to JPG (smaller size)
- Crop unnecessary parts

### Analysis Too Generic
**Tips:**
- Upload gameplay-focused screenshots
- Include visible HUD/UI elements
- Capture specific moments/actions
- Add game context in filename

## Best Practices

### 📸 Screenshot Capture
```python
1. Use native game screenshot feature (highest quality)
2. Capture during interesting moments
3. Include relevant UI elements
4. Avoid excessive motion blur
5. Good lighting/contrast
```

### 💬 Using Suggested Responses
```python
1. Review AI suggestion
2. Adapt to your personality/style
3. Add personal touches
4. Maintain authenticity
5. Don't read word-for-word
```

### 📚 Building a Library
```python
1. Analyze multiple screenshots per game
2. Keep successful commentary suggestions
3. Note which games get best analysis
4. Build reference library over time
5. Review before streaming same game
```

## Example Workflow

### Pre-Stream Preparation
```bash
1 hour before stream:
  ├─ Upload 3-5 screenshots from last session
  ├─ Review AI commentary suggestions
  ├─ Note highlights and talking points
  ├─ Prepare 2-3 discussion topics
  └─ Set avatar personality to match game mood

During stream:
  ├─ Reference prepared talking points
  ├─ React to similar moments naturally
  ├─ Use suggested responses as inspiration
  └─ Screenshot new moments for next time
```

### Post-Stream Analysis
```bash
After stream:
  ├─ Upload best moment screenshots
  ├─ Get AI descriptions for social media
  ├─ Use suggested responses for posts
  ├─ Plan highlight reel commentary
  └─ Archive for future reference
```

## Advanced Features

### Batch Analysis (Future)
Currently: One screenshot at a time
Future: Multi-upload with batch processing

### Custom Prompts (Future)
Currently: Standard analysis template
Future: Customize AI analysis focus

### Export Results (Future)
Currently: View in-app only
Future: Export as JSON/PDF

## API Information

### Model Used
- **GPT-4o** (OpenAI)
- Optimized for image understanding
- Multimodal capabilities
- Latest vision model

### Request Format
```javascript
{
  image: "base64_encoded_image",
  prompt: "Analyze this gaming screenshot...",
  model: "gpt-4o",
  json_mode: true
}
```

### Response Structure
```json
{
  "description": "string",
  "detectedObjects": ["string"],
  "gameContext": "string",
  "actionItems": ["string"],
  "mood": "string",
  "suggestedResponse": "string",
  "highlights": ["string"],
  "technicalDetails": {
    "resolution": "string",
    "quality": "string",
    "clarity": "string"
  },
  "confidence": 0.85
}
```

## Feedback & Improvement

### Rate Analysis Quality
Consider these factors:
- ✅ Accurate game identification
- ✅ Relevant commentary suggestions
- ✅ Helpful action items
- ✅ Natural suggested responses
- ✅ Appropriate mood assessment

### Common Improvements Needed
If analysis is:
- **Too generic**: Upload more specific screenshots
- **Wrong game**: Include more identifying elements
- **Missing context**: Capture fuller scene
- **Incorrect mood**: Review lighting/composition

## Related Features

### 🎮 Gameplay Vision Analyzer
- Automatic screenshot capture
- Continuous analysis
- Real-time commentary
- Integrated with Vision Settings

### 🎨 Avatar Emotions
- Sync with analysis mood
- React to screenshot content
- Visual personality expression

### 🔊 Voice Synthesis
- Speak suggested responses
- SSML enhancement
- Expressive delivery

---

## Quick Reference

| Action | Location | Shortcut |
|--------|----------|----------|
| Upload Screenshot | Vision Tab → Screenshot Analyzer | Click "Select Screenshot" |
| View Analysis | Scroll to Analysis Results | Auto-appears after upload |
| Enlarge Image | Click screenshot preview | Click again to close |
| Delete Analysis | Click ❌ on card | Confirms deletion |
| Clear All | Top-right button | Removes all analyses |
| Use Suggestion | Copy suggested response | Paste to Voice/Chat |

---

**Need Help?** Check the **AI Support** tab for instant assistance with screenshot analysis features!
