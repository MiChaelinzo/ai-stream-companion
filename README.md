# 🤖 AI Streamer Companion

An intelligent AI personality management dashboard for Twitch and YouTube streamers. Configure your AI companion, test responses, analyze sentiment, and see your VTuber avatar come to life!

## ✨ What This App Does

### ✅ Fully Functional (No Backend Required)
- **AI Personality Configuration** - 6 presets + custom personalities
- **Chat Simulation** - Test with realistic generated chat messages
- **AI Response Generation** - Powered by OpenAI GPT models
- **Sentiment Analysis** - Real-time emotion and engagement tracking
- **VTuber Avatar** - 3D animated character with 15-phoneme lip-sync
- **8 Avatar Skins** - Cyberpunk, Pastel, Neon, Fantasy, and more
- **Response Templates** - Save and reuse common responses
- **Chat Commands** - Custom bot commands with variables
- **Poll Generator** - AI-powered poll creation
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

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Comprehensive setup and backend integration guide
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

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix UI)
- **3D Graphics:** Three.js
- **AI:** OpenAI GPT models
- **Icons:** Phosphor Icons
- **Charts:** Recharts
- **State:** React hooks + Spark KV storage

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
- OpenAI API key (for AI responses)
- Optional: Backend service for live platform connections

## 🔮 Future Enhancements

- Voice synthesis for TTS
- More avatar models and customization
- Chat mini-games
- Multi-language support
- Custom avatar creator

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
