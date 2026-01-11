# Commentary-to-Avatar Emotion Sync System

## Overview

The AI Streamer Companion now features an advanced **Commentary-to-Avatar Emotion Sync** system that dynamically coordinates:

- 🎭 **Emotion transitions** based on commentary content and sentiment
- 👄 **Lip-sync movements** with phoneme-accurate mouth shapes
- 💫 **Visual effects** that respond to speech intensity
- 🎯 **Real-time synchronization** between all animation layers

## How It Works

### 1. Emotion Analysis Pipeline

When the avatar speaks, the system:

1. **Analyzes the commentary text** for emotional keywords and patterns
2. **Processes sentiment** (positive, neutral, negative) from chat context
3. **Generates an emotion timeline** with intensity curves
4. **Synchronizes emotions** with the phoneme sequence

### 2. Phoneme-to-Mouth Shape Mapping

The lip-sync system uses 15 distinct phonemes:

| Phoneme | Sound | Mouth Shape | Example Words |
|---------|-------|-------------|---------------|
| A | "ah" | Wide open | "amazing", "haha" |
| E | "eh" | Wide, less open | "epic", "well" |
| I | "ee" | Very wide, narrow | "this", "is" |
| O | "oh" | Round, open | "oh", "awesome" |
| U | "oo" | Small, round | "you", "cool" |
| M/B/P | Bilabial | Closed | "boom", "pog" |
| F/V | Labiodental | Slight gap | "five", "very" |
| TH | Dental | Tongue visible | "that", "thing" |
| L | Lateral | Mouth open, tongue up | "love", "lol" |
| R | Rhotic | Rounded, pursed | "right", "really" |
| W | Labial-velar | Very round | "wow", "what" |

### 3. Emotion Timeline System

Commentary is broken into emotional segments:

```typescript
// Example: "Wow! That was amazing! Let's see what happens next..."

Emotions Generated:
[
  { emotion: 'surprised', intensity: 0.9, duration: 800ms },  // "Wow!"
  { emotion: 'excited', intensity: 0.8, duration: 1000ms },   // "That was amazing!"
  { emotion: 'thinking', intensity: 0.6, duration: 1200ms },  // "Let's see what happens..."
  { emotion: 'neutral', intensity: 0.3, duration: 500ms }     // Return to neutral
]
```

### 4. Phoneme Intensity Boosting

Different emotions amplify mouth movements:

- **Excited**: 1.4x intensity (more animated)
- **Happy**: 1.2x intensity
- **Surprised**: 1.3x intensity
- **Thinking**: 0.9x intensity (more subtle)
- **Sad**: 0.8x intensity (subdued)
- **Neutral**: 1.0x intensity

## Visual Sync Features

### Real-Time Indicators

The **Commentary Sync Monitor** displays:
- Current phoneme being spoken
- Active emotion and intensity level
- Sync status (Lip Sync, Emotion, Timing)
- Live preview of commentary text

### Avatar Reactions

The 3D avatar responds with:
- **Dynamic mouth shapes** following phoneme sequence
- **Eye expressions** matching emotional state
- **Head movements** that complement emotions
- **Accessory glows** (headphones pulse when speaking)
- **Smooth transitions** between emotional states

### Emotion-Specific Animations

| Emotion | Eye Behavior | Mouth Shape | Head Movement | Intensity |
|---------|-------------|-------------|---------------|-----------|
| **Excited** | Large, bright | Wide open | Slight bob | High |
| **Happy** | Squinted smile | Curved up | Gentle sway | Medium |
| **Thinking** | Looking aside | Small, neutral | Tilted down | Low |
| **Confused** | Asymmetric | Small curve | Side tilt | Medium |
| **Surprised** | Very large | Round, open | Slight back | High |
| **Sad** | Drooped | Downturned | Forward tilt | Low |

## Keyword Detection

The system automatically detects emotional keywords:

**Excited**: wow, amazing, incredible, awesome, epic, insane, crazy, fire, pog, hype  
**Happy**: good, nice, great, love, happy, glad, enjoy, fun, yay, cool  
**Thinking**: hmm, think, wonder, maybe, consider, interesting, curious  
**Confused**: what, why, confused, strange, weird, huh, wait  
**Surprised**: whoa, wait, oh, unexpected, sudden, surprise, omg  
**Sad**: unfortunately, sad, sorry, miss, lost, fail, bad

## Integration Points

### Chat Response
When responding to chat, the avatar:
1. Analyzes the viewer's sentiment
2. Generates a response matching personality
3. Syncs emotions to response content
4. Animates with appropriate intensity

### Gameplay Commentary
During vision-based gameplay analysis:
1. AI generates contextual commentary
2. System detects game highlights
3. Emotion set to "excited" for key moments
4. Intensity boosted for hype moments

### Chat Simulation
In simulation mode:
1. Simulated messages carry sentiment tags
2. Responses adapt emotional tone
3. Avatar reacts naturally to conversation flow
4. Transitions smoothly between emotional states

## Performance Optimization

- **Interpolation**: Smooth transitions between phonemes (ease-in-out curves)
- **Timing**: Phoneme durations match natural speech (80-100ms per sound)
- **Caching**: Mouth shapes pre-calculated for instant lookup
- **Frame-perfect sync**: Uses `requestAnimationFrame` for 60fps animation

## Configuration

The system is fully automatic but respects:
- **Personality settings** (energetic vs chill affects base intensity)
- **Response style** (playful has more expressive emotions)
- **Tone preset** (chaotic uses faster transitions)

## Technical Architecture

```
Commentary Text Input
        ↓
┌───────────────────┐
│ Emotion Analyzer  │ → Detects keywords, sentiment, punctuation
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Emotion Sequencer │ → Generates timeline with transitions
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Phoneme Analyzer  │ → Converts text to phoneme sequence
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Phoneme Sequencer │ → Times mouth shapes to match speech
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Avatar Renderer   │ → Applies to 3D model in real-time
└───────────────────┘
```

## Future Enhancements

Potential additions to the sync system:
- Voice synthesis integration (Text-to-Speech)
- Breath markers between sentences
- Micro-expressions during pauses
- Eye tracking to "look at" active chat
- Gesture animations timed to emphasis words
- Multiple emotion layers (primary + secondary)

## Usage Example

```typescript
// Automatic sync when avatar speaks
<VTuberAvatar
  isSpeaking={true}
  speechText="Wow! That play was incredible!"
  sentiment="positive"
  emotion="excited"
  onPhonemeChange={(phoneme) => console.log('Speaking:', phoneme)}
  onEmotionChange={(emotion, intensity) => 
    console.log(`Emotion: ${emotion} at ${intensity * 100}%`)
  }
/>
```

The system handles all synchronization automatically - no manual timing required!
