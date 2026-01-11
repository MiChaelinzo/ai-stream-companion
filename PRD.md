# AI Streamer Companion Dashboard

**Powered by Google Gemini 3** 🌟

An intelligent AI streamer personality management and live streaming integration platform that enables streamers to maintain audience engagement across Twitch and YouTube while focused on gameplay. Built for the Gemini 3 Global Hackathon, showcasing advanced AI reasoning, low-latency performance, and multimodal potential.

**Experience Qualities**:
1. **Intelligent** - The AI should feel smart and capable, powered by Gemini 3's advanced reasoning to generate contextually appropriate responses that enhance the streaming experience
2. **Engaging** - Every interaction should feel lively and entertaining, leveraging Gemini 3's creative generation to keep chat active and viewers invested
3. **Connected** - Seamless integration with streaming platforms creates a unified live engagement experience with sub-2-second response times

**Complexity Level**: Light Application (multiple features with basic state)
This is a comprehensive tool for managing AI streamer personality, connecting to live streaming platforms (Twitch/YouTube), and automating chat engagement. It provides essential platform integration features with intelligent response management powered by Gemini 3 Flash for speed and Gemini 3 Pro for deep reasoning.

## Essential Features

### Platform Connection Management
- **Functionality**: Connect to Twitch (via IRC/OAuth) and YouTube (via Live Chat API) with credential management and connection status monitoring
- **Purpose**: Enable real-time integration with actual streaming platforms for live chat reading and AI response posting
- **Trigger**: User navigates to Platforms tab and clicks Connect button for desired platform
- **Progression**: Select platform → Enter credentials (OAuth token for Twitch, API key for YouTube) → Verify connection → Monitor live status → Disconnect when needed
- **Success criteria**: Successfully authenticate with platforms, display connection status, and enable live chat monitoring when stream is active

### Response Templates & Quick Replies
- **Functionality**: Create, save, and deploy custom response templates for common scenarios with variable placeholders and keyboard shortcuts
- **Purpose**: Enable instant, personalized responses to frequent chat situations without waiting for AI generation
- **Trigger**: User creates template from response history or builds from scratch, then triggers with hotkey or dropdown
- **Progression**: Create template with variables → Assign keyboard shortcut → Use shortcut during stream → Variables auto-fill → Deploy instantly
- **Success criteria**: Templates deploy in under 100ms, support dynamic variables (username, game, time), and can be organized by category

### Live Stream Monitoring
- **Functionality**: Real-time dashboard showing connected platforms, live status, message counts, AI response metrics, live chat feed, and integrated chat simulation for testing
- **Purpose**: Provide visibility into active streams, AI companion performance across platforms, and testing environment for sentiment analysis validation
- **Trigger**: User navigates to Monitor tab after connecting platforms or activates chat simulation
- **Progression**: View platform status → Start monitoring when live or enable simulation → Watch real-time chat feed → See engagement statistics with sentiment overlay → Analyze emotion patterns → Review AI insights → Stop monitoring/simulation when done
- **Success criteria**: Display accurate live stream status, real-time message updates with sentiment indicators, engagement analytics with platform indicators, and realistic chat simulation for testing

### Stream Behavior Settings
- **Functionality**: Configure AI response automation including auto-respond toggle, response delays, message frequency, rate limiting, greeting automation, and poll generation intervals
- **Purpose**: Control how the AI behaves during live streams to prevent spam and create natural engagement
- **Trigger**: User accesses Settings tab while platforms are connected
- **Progression**: Enable auto-respond → Adjust timing settings (delay, frequency, rate limits) → Configure engagement features (greetings, polls) → Save preferences
- **Success criteria**: Settings persist and control AI behavior, preventing over-posting while maintaining engagement

### AI Personality Configuration
- **Functionality**: Define the AI streamer's name, personality traits, tone, response style, and behavioral preferences with preset personalities for quick setup
- **Purpose**: Create a unique, memorable AI character that aligns with the streamer's brand using pre-configured personalities or custom settings
- **Trigger**: User accesses personality panel or first-time setup
- **Progression**: View current personality → Choose preset (Nova, Zen, Spark, Sage, Sunny, Glitch) or customize → Edit traits (name, bio, tone preset, interests, emoji/slang preferences) → Preview changes → Save configuration
- **Success criteria**: Personality saves persist and influence all AI-generated responses with consistent tone, style, and behavior

### Personality Presets
- **Functionality**: Six pre-configured personality templates with distinct tones and characteristics
- **Purpose**: Allow streamers to quickly adopt a fully-formed AI personality that matches their streaming style
- **Trigger**: User clicks preset button in personality configuration
- **Progression**: Browse presets → Preview personality description → Apply preset → Fine-tune if desired
- **Success criteria**: Preset instantly applies all personality attributes (name, bio, tone, interests, style, emoji/slang preferences)

**Available Presets**:
- **Nova** (⚡ Energetic): High-energy gaming companion, enthusiastic and playful
- **Zen** (😌 Chill): Calm and supportive, creates relaxing vibes
- **Spark** (🔥 Chaotic): Unpredictable and wild, embraces chaos and memes
- **Sage** (🧠 Supportive): Strategic and analytical, focuses on helpful insights
- **Sunny** (😊 Wholesome): Kind and positive, spreads joy and encouragement
- **Glitch** (✨ Sarcastic): Witty and sharp, masters playful roasting and banter

### Tone Customization
- **Functionality**: Select from predefined tone presets or create custom tone descriptions
- **Purpose**: Fine-tune communication style beyond basic personality traits
- **Trigger**: User selects tone preset dropdown or enters custom tone description
- **Progression**: Select tone preset → Read description → Adjust custom tone text if needed → Enable/disable emoji and slang toggles
- **Success criteria**: AI responses reflect selected tone characteristics consistently

**Tone Presets**:
- **Energetic**: High energy, enthusiastic, uses exclamation points frequently
- **Chill**: Relaxed and calm, keeps intensity low
- **Sarcastic**: Witty comebacks and playful roasting
- **Supportive**: Encouraging and uplifting focus
- **Chaotic**: Unpredictable and embraces randomness
- **Wholesome**: Pure positivity and kindness
- **Custom**: User-defined tone description

### Live Chat Simulation
- **Functionality**: Simulated chat interface where users can test AI responses in real-time
- **Purpose**: Allow streamers to refine their AI's personality and ensure appropriate responses
- **Trigger**: User types message in chat simulation
- **Progression**: Message appears in chat → AI analyzes context → Response generated with personality → Display in chat with timestamp
- **Success criteria**: Responses feel natural, on-brand, and contextually appropriate

### Smart Response Generator
- **Functionality**: AI generates contextual responses to common streaming scenarios (greetings, questions, gameplay comments) using Gemini 3 Flash for <2s latency
- **Purpose**: Maintain chat engagement without streamer input during intense gameplay using Gemini 3's advanced reasoning
- **Trigger**: Chat message received or scenario selected
- **Progression**: Input message/scenario → Gemini 3 analyzes context and personality → Generate 2-3 response options → User can regenerate or approve
- **Success criteria**: Multiple quality response options generated within 2 seconds using Gemini 3 Flash

### Gemini 3 Vision Gameplay Analysis (NEW)
- **Functionality**: Real-time screen capture and AI analysis of gameplay using Gemini 3 Vision API to understand game state, player actions, and notable moments
- **Purpose**: Enable context-aware AI commentary by "seeing" what's happening on screen, detecting highlights, and generating engaging stream commentary
- **Trigger**: User enables vision analysis and clicks "Start Analysis" to capture screen
- **Progression**: Start screen capture → Capture frames at intervals → Vision API analyzes gameplay → Detect game, scene, actions, emotions → Generate commentary → Highlight detection → Display insights
- **Success criteria**: Accurate game detection (85%+), natural commentary generation, highlight detection, minimal performance impact, 2-4s analysis latency

**Vision Features**:
- **Screen Capture**: Browser-native screen sharing API for gameplay capture
- **Game Detection**: Identify game title, genre, and current scene
- **Action Recognition**: Understand player actions, UI elements, game state
- **Emotion Detection**: Determine gameplay intensity (exciting, tense, calm, chaotic)
- **Auto Commentary**: Generate natural stream commentary based on visual analysis
- **Highlight Detection**: Flag exciting moments worth clipping
- **Strategic Suggestions**: Provide gameplay tips based on visual context
- **Multi-Game Support**: Works with any game without manual configuration
- **Configurable Analysis**: 5-60 second intervals, confidence thresholds
- **Vision Stats**: Track analyses, highlights, commentaries, games detected

### Activity & Poll Creator
- **Functionality**: AI suggests and generates polls, questions, and chat activities
- **Purpose**: Keep viewers engaged during gameplay with minimal streamer effort
- **Trigger**: User requests activity suggestion or automated interval
- **Progression**: Request activity → AI generates relevant poll/question based on game/context → Preview with options → Copy or deploy
- **Success criteria**: Activities are relevant, engaging, and easy to deploy

### Response History & Analytics
- **Functionality**: Track all AI responses, common topics, and engagement patterns with visual charts and exportable reports
- **Purpose**: Help streamers understand what works and refine AI behavior with data-driven insights
- **Trigger**: User accesses Analytics tab
- **Progression**: View response timeline → Filter by platform/date → See engagement charts → Export data → Identify top-performing responses
- **Success criteria**: Clear visualization of AI activity with interactive charts showing messages per hour, response times, sentiment analysis, and top keywords

### Command System & Moderation
- **Functionality**: Custom chat commands with dynamic responses, cooldowns, and permission levels (viewer, subscriber, moderator, broadcaster)
- **Purpose**: Automate common viewer requests and moderate chat with custom bot commands
- **Trigger**: User creates command with trigger word and response, viewers use !command in chat
- **Progression**: Define command trigger → Set response (static or dynamic) → Configure cooldown and permissions → Enable command → Use in chat
- **Success criteria**: Commands respond instantly, respect cooldowns, validate permissions, and support variables like {user}, {game}, {uptime}

### Sentiment Analysis Dashboard
- **Functionality**: Advanced real-time sentiment tracking with emotion detection, engagement scoring, trend visualization, stability metrics, and AI-powered actionable insights
- **Purpose**: Provide comprehensive emotional intelligence about chat activity, enabling streamers to gauge viewer mood, detect engagement patterns, and respond proactively to community sentiment shifts
- **Trigger**: Live monitoring active or simulation running, automatic analysis of all incoming messages with continuous metric updates
- **Progression**: Messages analyzed for sentiment and emotions → Aggregated mood score with stability index → Real-time trend chart visualization → Engagement score calculation → AI insights generated → Alerts on significant sentiment changes → Historical sentiment patterns tracked
- **Success criteria**: Accurate multi-dimensional sentiment classification (positive/neutral/negative + 5 emotion categories), real-time trend visualization with velocity indicators, engagement score (0-100) with actionable recommendations, stability metrics to detect volatility, and intelligent alert system for mood shifts

**Advanced Sentiment Features**:
- **Real-time Sentiment Monitor**: Live mood gauge with score (-100 to +100), trend direction (up/down/stable), velocity indicator, and stability percentage
- **Sentiment Trend Chart**: Rolling 30-point visualization showing sentiment evolution over time with positive/negative peak detection
- **Engagement Score**: Composite metric (0-100) combining sentiment trend, message rate, response rate, and viewer diversity with level classification (low/medium/high/very-high)
- **Emotion Detection**: Five-category analysis (joy, excitement, frustration, confusion, appreciation) with dominant emotion identification and keyword-based pattern matching
- **AI Insights Panel**: Smart recommendations based on sentiment patterns including warnings for negative spikes, opportunities for polls/engagement, and actionable tips for improvement
- **Chat Simulation**: Testing environment with auto-generation of realistic chat messages at configurable rates (slow/medium/fast) to validate sentiment analysis accuracy

### AI Response Quality Rating
- **Functionality**: Viewers can thumbs up/down AI responses, with feedback used to improve future responses
- **Purpose**: Crowd-source quality control and continuously improve AI personality
- **Trigger**: Each AI response displays rating buttons, streamer reviews ratings in analytics
- **Progression**: AI responds → Rating buttons shown → Viewers vote → Aggregate score tracked → Low-rated patterns identified → Personality adjustments suggested
- **Success criteria**: Rating system integrated in chat UI, scores persist, and analytics show response quality trends over time

### VTuber Avatar Model
- **Functionality**: 3D animated avatar that appears in the stream interface with automatic idle animations, emotional expressions, reactive movements synchronized to AI activity, realistic phoneme-based lip-sync for speech animation, advanced emotion-to-commentary synchronization, text-to-speech voice synthesis for audible responses, and customizable visual skins for personalized appearance
- **Purpose**: Provide a visual and audible personality representation similar to VTuber models (like Neuro-sama) that brings the AI companion to life with expressive animations, natural speech movements, realistic voice output, intelligent emotion transitions synced to commentary content, and unique visual styles matching the streamer's brand
- **Trigger**: Avatar automatically appears in the Monitor tab and animates continuously when monitoring or simulation is active, speaks when AI generates responses, skin selection accessed via Personality configuration
- **Progression**: Avatar displays personality → Performs idle animations (breathing, head swaying, blinking, ear twitching) → Receives commentary text with sentiment → Analyzes text for emotional keywords and patterns → Generates synchronized emotion timeline → Converts text to phoneme sequence → Text-to-speech engine speaks the text audibly → Coordinates emotion transitions with lip movements and audio → Reacts with intensity-based expressions (happy, excited, thinking, confused, surprised, sad) → Mouth morphs through phoneme shapes synchronized with actual speech → Headphone speakers pulse with speaking tension → Eyes and head movements reflect emotional state → Smooth transitions between emotional states → Returns to neutral when idle → User selects skin from gallery → Avatar instantly updates with new color palette and style
- **Success criteria**: Smooth 60fps 3D rendering, natural idle movements, realistic phoneme-accurate mouth sync during AI responses with proper mouth shapes for each sound, emotion changes based on commentary content analysis (not just sentiment), smooth emotion transitions with intensity curves, phoneme intensity boosted by active emotion (excited = 1.4x, sad = 0.8x), real-time sync indicators showing current phoneme and emotion, instant skin switching without visual glitches, clear and natural voice output synchronized with visuals, configurable voice settings (gender, pitch, speed, volume), distinctive character design with headphones and anime-inspired aesthetic

### Voice Synthesis (Text-to-Speech) (NEW)
- **Functionality**: Browser-native speech synthesis that converts AI-generated text responses into audible speech with configurable voice settings including gender, pitch, speed, volume, and specific voice selection
- **Purpose**: Make the avatar speak out loud, creating a more immersive and engaging streaming companion experience similar to Neuro-sama where viewers can hear the AI's personality through voice
- **Trigger**: Automatically triggered when AI generates a response (chat reply, vision commentary, simulated message response), or manually via voice test button
- **Progression**: AI generates text response → Voice synthesis enabled check → Text passed to speech engine → Voice configured (gender, pitch, speed, volume) → Audio playback begins → Phoneme detection for lip-sync → Progress tracking (0-100%) → Speech completes → Avatar returns to silent state
- **Success criteria**: Natural-sounding voice output, accurate synchronization between audio and lip movements, configurable voice characteristics that persist, clear voice activity indicators, sub-500ms latency from text to speech start, smooth integration with existing emotion and phoneme systems

**Voice Synthesis Features**:
- **Browser Compatibility**: Web Speech API support detection with graceful fallback
- **Voice Selection**: Auto-select best voice based on gender preference or manually choose from available voices
- **Gender Options**: Female, Male, Neutral voice presets with intelligent voice matching
- **Pitch Control**: Low (0.8x), Normal (1.0x), High (1.3x) pitch adjustment
- **Speed Control**: Slow (0.8x), Normal (1.0x), Fast (1.3x) speech rate
- **Volume Control**: 0-100% volume slider with visual indicator
- **Voice Activity Monitor**: Real-time indicator showing speaking status, progress bar, current text being spoken
- **Phoneme Integration**: Speech boundary events trigger phoneme changes for accurate lip-sync
- **Test Function**: Preview voice with sample phrases to test settings before going live
- **Persistence**: Voice settings saved and restored across sessions
- **Multi-trigger**: Works with chat responses, vision commentary, and simulated messages

**Phoneme Lip-Sync System**:
- **Phoneme Detection**: Analyzes AI response text and converts to phoneme sequence with timing
- **Mouth Shapes**: 15 distinct phoneme mouth shapes with parameters (openness, width, height, roundness, tension)
- **Interpolation**: Smooth transitions between phoneme shapes using eased interpolation
- **Intensity Multipliers**: Phoneme animations amplified or subdued based on active emotion (excited = 1.4x, happy = 1.2x, sad = 0.8x, thinking = 0.9x)
- **Real-time Display**: Live phoneme indicator showing current sound being spoken
- **Speech Synchronization**: Precise timing aligned with response delivery duration

**Emotion-to-Commentary Sync System** (NEW):
- **Content Analysis**: Scans commentary for emotional keywords (wow, amazing, hmm, confused, etc.) and punctuation patterns (! for excitement, ? for curiosity)
- **Emotion Timeline**: Generates sequence of emotions with intensity and duration based on sentence structure and word choice
- **Sentiment Integration**: Combines chat sentiment (positive/neutral/negative) with text analysis for contextual emotion selection
- **Dynamic Transitions**: Smooth emotion changes with configurable transition times (150-300ms)
- **Intensity Curves**: Emotions have varying intensity levels (0.0-1.0) affecting expression strength
- **Coordinated Animation**: Emotion state and phoneme system work together - emotions affect mouth movement intensity, eye size, head tilt
- **Visual Feedback**: Real-time sync monitor displays current phoneme, active emotion, intensity percentage, and sync status
- **Keyword Detection**: 7 emotion categories with 50+ trigger keywords
- **Automatic Return**: Avatar returns to neutral emotion after commentary finishes with gentle transition
- **Phoneme Boost**: Active emotions amplify lip-sync movements for more expressive speech

**Commentary Sync Monitor** (NEW):
- **Live Phoneme Display**: Real-time indicator of current phoneme being spoken with color-coded visualization
- **Emotion Tracker**: Shows active emotion name and intensity bar (0-100%)
- **Sync Status Grid**: Three-indicator system (Lip Sync, Emotion, Timing) showing green when active
- **Visual Progress**: Animated bars showing phoneme activity and emotion intensity in real-time
- **Speech Preview**: Displays current commentary text being spoken
- **Color-Coded States**: Different colors for vowels (pink), consonants (purple), silence (gray), emotions (contextual)

**Avatar Skin System**:
- **Visual Styles**: 8 distinct appearance themes each with unique color palettes and material properties
- **Style Library**: Default Kawaii (purple/pink), Cyberpunk (neon chrome), Pastel Dream (soft colors), Neon Nights (vibrant glow), Fantasy Elf (mystical green/gold), Retro Wave (80s synthwave), Monochrome (black/white), Cosmic Star (galaxy-inspired)
- **Customization**: Each skin modifies all avatar components (skin tone, eyes, hair, body, accessories) with coordinated color schemes
- **Material Properties**: Skins control metalness, roughness, and emissive intensity for distinct visual feels (matte, glossy, glowing)
- **Preview System**: Visual skin selector with color swatches and descriptions
- **Persistence**: Selected skin saves with personality configuration and loads automatically

## Edge Case Handling

- **Platform Connection Failures**: Clear error messages when credentials are invalid or API limits are reached, with guidance on resolution
- **Stream Offline**: Disable monitoring when stream ends, prevent message sending when not live
- **Rate Limiting**: Respect platform message limits (Twitch/YouTube) with built-in throttling to prevent bot bans
- **Token Expiration**: Detect expired OAuth tokens and prompt user to reconnect
- **Inappropriate Content**: AI filters responses to avoid offensive, controversial, or brand-unsafe content
- **Repetitive Questions**: System detects repeated questions and varies response phrasing
- **Context Loss**: AI maintains conversation history to provide coherent multi-turn responses
- **Off-Topic Messages**: AI gracefully handles random or unrelated chat messages with personality
- **Empty State**: Helpful onboarding guides users through platform connection and personality setup on first launch
- **API Failures**: Graceful fallback with cached responses when LLM unavailable
- **Multiple Platforms Live**: Handle simultaneous monitoring of Twitch and YouTube streams with unified chat feed

## Design Direction

The design should evoke a futuristic streaming control center - sleek, high-tech, and energetic. Think neon-accented dashboard with smooth animations, giving the feeling of an AI command center. The interface should feel professional yet playful, technical yet accessible.

## Color Selection

A vibrant cyber-streaming aesthetic with electric purple as the hero color, complemented by deep space blacks and neon accents.

- **Primary Color**: Electric Purple (oklch(0.65 0.25 300)) - Represents AI intelligence and streaming energy, used for primary actions and branding
- **Secondary Colors**: 
  - Deep Space (oklch(0.15 0.02 270)) - Rich dark background for that "control center" feel
  - Cyber Blue (oklch(0.70 0.20 240)) - Secondary actions and AI response indicators
- **Accent Color**: Neon Pink (oklch(0.75 0.24 340)) - CTAs, active states, and live indicators demanding immediate attention
- **Foreground/Background Pairings**: 
  - Primary Purple (oklch(0.65 0.25 300)): White text (oklch(0.98 0 0)) - Ratio 5.2:1 ✓
  - Deep Space (oklch(0.15 0.02 270)): Light text (oklch(0.92 0.01 270)) - Ratio 12.8:1 ✓
  - Neon Pink (oklch(0.75 0.24 340)): Dark text (oklch(0.15 0.02 270)) - Ratio 9.5:1 ✓
  - Cyber Blue (oklch(0.70 0.20 240)): Dark text (oklch(0.15 0.02 270)) - Ratio 7.8:1 ✓

## Font Selection

Typography should feel modern and tech-forward, with geometric precision that reflects AI/streaming culture while maintaining excellent readability.

- **Primary Font**: Space Grotesk - A tech-savvy geometric sans with personality for headlines and UI elements
- **Secondary Font**: Inter - Clean, readable sans-serif for body text and chat messages

**Typographic Hierarchy**:
- H1 (App Title): Space Grotesk Bold/32px/tight letter-spacing (-0.02em)
- H2 (Section Headers): Space Grotesk SemiBold/24px/normal letter-spacing
- H3 (Card Titles): Space Grotesk Medium/18px/normal letter-spacing
- Body (Chat/Content): Inter Regular/15px/relaxed line-height (1.6)
- Small (Metadata): Inter Regular/13px/normal line-height (1.4)
- Button Labels: Space Grotesk Medium/14px/uppercase/wide letter-spacing (0.05em)

## Animations

Animations should reinforce the AI-powered, real-time nature of streaming. Smooth, purposeful motion creates energy without distraction.

- **Chat Messages**: Slide in from right with subtle fade (200ms ease-out) for new messages
- **AI Thinking**: Pulsing glow effect on AI avatar while generating responses
- **Button Interactions**: Quick scale (0.98) on press with color transition (150ms)
- **Panel Transitions**: Smooth slide/fade between views (300ms ease-in-out)
- **Poll Creation**: Stagger animation for poll options appearing (100ms delay each)
- **Success States**: Satisfying bounce + glow effect when actions complete
- **Live Indicators**: Continuous gentle pulse on "live" badges

## Component Selection

**Components**:
- **Card**: Primary container for platform connections, stream monitoring, settings panels, personality config, chat window, and analytics
- **Tabs**: Switch between Monitor, Platforms, Settings, Chat Simulator, Response Generator, Polls, and Personality views
- **Input/Textarea**: Platform credentials, personality configuration, and chat message entry
- **Button**: Primary actions (Connect, Start Monitoring, Generate, Send, Save) with variant="default" for primary, "outline" for secondary
- **Badge**: Status indicators (Live, Connected, Monitoring, AI Thinking, Active) with custom colors for platforms
- **ScrollArea**: Chat message history, live feed, and response logs
- **Dialog**: Poll creation workflow and detailed settings
- **Avatar**: AI personality avatar with status indicator
- **Progress**: Show AI response generation progress
- **Separator**: Divide sections within cards
- **Select**: Choose personality presets, tone, or response style
- **Switch**: Toggle auto-respond, greetings, polls, emoji/slang usage
- **Slider**: Adjust response delay, poll interval, message frequency, rate limits
- **Alert**: Important notices for platform integration instructions and connection status

**Customizations**:
- Custom chat bubble component with gradient backgrounds for AI vs user messages
- Animated typing indicator for AI response generation
- Live pulse effect for active streaming status
- Gradient borders on cards using Tailwind's border-gradient patterns

**States**:
- Buttons: Default (electric purple), Hover (brighten 10%), Active (scale 0.98), Loading (pulse animation)
- Inputs: Default (subtle border), Focus (neon glow ring), Error (pink accent), Success (green glow)
- Cards: Default (elevated shadow), Hover (lift higher with glow), Active (border accent)

**Icon Selection**:
- Robot (AI personality avatar)
- ChatCircle (chat/messaging)
- Lightning (AI generation)
- ChartLine (analytics)
- GearSix (settings)
- Broadcast (live streaming/monitoring)
- Question (polls)
- Sparkle (AI thinking/magic)
- ArrowRight (send messages)
- Plus (create new)
- TwitchLogo (Twitch platform)
- YoutubeLogo (YouTube platform)
- Link (platform connections)
- CheckCircle (connected status)
- XCircle (disconnected status)
- Info (help/guidance)
- Clock (timing settings)
- Users (viewer count)
- Eye (monitoring)
- Waveform (engagement)

**Spacing**:
- Card padding: p-6 (24px) for primary containers
- Section gaps: gap-6 (24px) between major sections
- Element spacing: gap-4 (16px) for related elements
- Tight grouping: gap-2 (8px) for closely related items
- Page margins: px-6 py-8 for comfortable viewport spacing

**Mobile**:
- Stack tabs vertically on mobile (<768px)
- Full-width cards with reduced padding (p-4)
- Collapsible personality settings panel
- Bottom-anchored chat input for thumb accessibility
- Hide analytics charts in favor of key metrics on small screens
- Single column layout throughout
