# 🤖 AI Streamer Companion

**Powered by Google Gemini 3** 🌟

An intelligent AI personality management dashboard for Twitch and YouTube streamers. Configure your AI companion, test responses, analyze sentiment, and see your VTuber avatar come to life - all powered by Gemini 3's advanced reasoning and multimodal capabilities!

---

## 🏆 Built for the Gemini 3 Global Hackathon

This project showcases **Google Gemini 3's** capabilities in real-time streaming applications:
- ⚡ **Low-latency responses** using Gemini 3 Flash for live chat
- 🧠 **Advanced reasoning** with Gemini 3 Pro for sentiment analysis
- 🎭 **Personality-driven AI** that maintains consistent character traits
- 📊 **Deep context understanding** for engagement analytics
- 🎨 **Creative generation** for polls, questions, and activities

👉 **See [GEMINI_INTEGRATION.md](./GEMINI_INTEGRATION.md) for detailed technical writeup**

---

## ✨ What This App Does

### ✅ Fully Functional (No Backend Required)
- **AI Personality Configuration** - 6 presets + custom personalities powered by Gemini 3
- **Chat Simulation** - Test with realistic generated chat messages
- **AI Response Generation** - Powered by Gemini 3 Flash for <2s latency
- **Sentiment Analysis** - Real-time emotion and engagement tracking via Gemini 3 Pro
- **VTuber Avatar** - 3D animated character with 15-phoneme lip-sync
- **8 Avatar Skins** - Cyberpunk, Pastel, Neon, Fantasy, and more
- **Response Templates** - Save and reuse common responses
- **Chat Commands** - Custom bot commands with variables
- **Poll Generator** - AI-powered poll creation using Gemini 3's creativity
- **Analytics Dashboard** - Message stats, trends, and insights

### ⚠️ Requires Backend Service
- **Live Twitch/YouTube Integration** - Real-time chat monitoring
  - This app saves credentials and provides the interface
  - Persistent connections need a backend (Node.js/Python)
  - See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for backend integration

## 🚀 Quick Start

1. **Configure Your AI**
   - Go to Personality tab
   - Choose a preset or customize
   - Set tone, interests, and style

2. **Test Responses**
   - Use Chat Simulator tab
   - Try different scenarios
   - Refine personality

3. **Enable Chat Simulation**
   - Go to Monitor tab
   - Toggle "Auto-generate messages"
   - Watch AI respond in real-time

4. **Customize Avatar**
   - Select skin in Personality tab
   - Watch avatar react to chat
   - See lip-sync in action

## 📚 Documentation

### 🎯 New! Backend Deployment Guides

**Want to connect to real Twitch/YouTube chat?**

- **[QUICK_START.md](./QUICK_START.md)** - ⚡ **30-minute setup** with working backend code
- **[BACKEND_DEPLOYMENT_GUIDE.md](./BACKEND_DEPLOYMENT_GUIDE.md)** - 📖 Complete reference with deployment options

These guides include:
- ✅ Complete working Node.js backend server code
- ✅ Step-by-step Twitch token generation instructions
- ✅ YouTube API setup walkthrough
- ✅ Deployment to Heroku, Railway, AWS, DigitalOcean
- ✅ Security best practices
- ✅ Troubleshooting guide

### 📖 Other Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Feature overview and backend integration guide
- **[PLATFORM_GUIDE.md](./PLATFORM_GUIDE.md)** - Platform connection details
- **[PRD.md](./PRD.md)** - Complete feature specifications

## 🎯 Current Status

**What Works:** Full AI personality system, chat simulation, sentiment analysis, VTuber avatar, response generation, templates, commands, polls, and analytics.

**What Needs Backend:** Persistent WebSocket/IRC connections to Twitch and YouTube for real-time chat monitoring. The app saves credentials and provides the interface, but live streaming requires a backend service.

**Perfect For:** Testing AI personalities, developing responses, training chat behavior, designing avatar appearance, and preparing for production deployment.

## 🎨 Features

### AI Personality Presets
- **Nova** ⚡ - Energetic gaming companion
- **Zen** 😌 - Chill and supportive
- **Spark** 🔥 - Chaotic and unpredictable
- **Sage** 🧠 - Strategic and analytical
- **Sunny** 😊 - Wholesome and positive
- **Glitch** ✨ - Sarcastic and witty

### Avatar Skins
- Default Kawaii, Cyberpunk, Pastel Dream, Neon Nights
- Fantasy Elf, Retro Wave, Monochrome, Cosmic Star

### Advanced Features
- Real-time sentiment scoring (-100 to +100)
- Emotion detection (joy, excitement, frustration, confusion, appreciation)
- Engagement metrics (0-100 score with level classification)
- AI-powered insights and recommendations
- Phoneme-accurate lip-sync system
- Response quality tracking

## 🔧 Tech Stack

- **AI Engine:** Google Gemini 3 (Flash + Pro models)
- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix UI)
- **3D Graphics:** Three.js
- **Icons:** Phosphor Icons
- **Charts:** Recharts
- **State:** React hooks + Spark KV storage

## 🌟 Why Gemini 3?

### Speed Meets Intelligence
- **Gemini 3 Flash** powers real-time chat responses (<2s latency)
- **Gemini 3 Pro** handles complex sentiment analysis and reasoning
- **Multimodal ready** for future gameplay/screenshot analysis
- **Extended context** maintains conversation history across streams

### Key Capabilities Leveraged
1. **Advanced Reasoning** - Understands nuanced viewer questions and emotions
2. **Low Latency** - Essential for natural live chat interactions
3. **Creative Generation** - Personality-driven responses and poll creation
4. **Emotion Detection** - 5-category analysis (joy, excitement, frustration, confusion, appreciation)
5. **Context Understanding** - Maintains streaming context and viewer relationships

## 💻 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎮 Usage Tips

1. Start with a personality preset
2. Test in Chat Simulator first
3. Enable Chat Simulation to see live behavior
4. Use sentiment analysis to refine responses
5. Create templates for common scenarios
6. Configure commands for viewer interactions
7. Export settings before backend deployment

## 📊 System Requirements

- Modern web browser (Chrome, Firefox, Edge)
- Google Gemini 3 API access (integrated via Spark runtime)
- Optional: Backend service for live platform connections

## 🎯 Hackathon Submission

### What to Submit
✅ **Gemini Integration Description**: See [GEMINI_INTEGRATION.md](./GEMINI_INTEGRATION.md)  
✅ **Public Project Link**: [Live Demo URL]  
✅ **Public Code Repository**: This repository  
✅ **3-Minute Demo Video**: [Video URL]

### Judging Criteria Alignment

**Technical Execution (40%)**
- High-quality React + TypeScript implementation
- Gemini 3 Flash + Pro API integration
- Production-ready code with type safety
- Functional AI features with persistent state

**Potential Impact (20%)**
- Addresses 15M+ Twitch/YouTube streamers globally
- Solves chat engagement during intensive gameplay
- Scalable from solo streamers to large channels
- Real-world utility with immediate value

**Innovation / Wow Factor (30%)**
- Novel VTuber AI assistant for live streaming
- 15-phoneme lip-sync with emotion detection
- Multi-dimensional sentiment analysis
- Unique personality presets with Gemini 3 reasoning

**Presentation / Demo (10%)**
- Clear problem definition (chat engagement)
- Effective solution presentation (AI companion)
- Comprehensive Gemini 3 documentation
- Interactive demo with chat simulation

## 🔮 Future Enhancements (Gemini 3 Multimodal)

- **Vision API**: Analyze gameplay screenshots and respond to visual context
- **Video Understanding**: Auto-generate highlight clip descriptions
- **Audio Processing**: Voice chat sentiment analysis
- **Multi-language**: Leverage Gemini's 100+ language support
- **Live Translation**: International viewer engagement

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
