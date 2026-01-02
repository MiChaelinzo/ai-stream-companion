# AI Streamer Companion - Platform Integration Guide

## Overview

The AI Streamer Companion now supports **live integration with Twitch and YouTube**, enabling your AI companion to read and respond to chat messages in real-time during your streams.

## Quick Start

### 1. Configure Your AI Personality
- Navigate to the **Personality** tab
- Choose a preset (Nova, Zen, Spark, etc.) or customize your own
- Define name, tone, interests, and communication style

### 2. Connect Your Streaming Platform

#### Twitch Setup
1. Create a separate Twitch account for your bot
2. Visit [twitchapps.com/tmi](https://twitchapps.com/tmi) to generate an OAuth token
3. Go to the **Platforms** tab
4. Click "Connect Twitch"
5. Enter:
   - Bot username
   - OAuth token (starts with `oauth:`)
   - Channel name to monitor
6. Click Connect

#### YouTube Setup
1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable YouTube Data API v3
3. Create an API key in credentials section
4. Start your live stream
5. Go to the **Platforms** tab
6. Click "Connect YouTube"
7. Enter:
   - YouTube API key
   - Live Chat ID from your stream
8. Click Connect

### 3. Configure Stream Behavior
Navigate to the **Settings** tab to control:
- **Auto-Respond**: Enable/disable automatic responses
- **Response Delay**: Natural timing before responding (0-30s)
- **Message Frequency**: Respond to every Nth message
- **Max Messages Per Minute**: Rate limiting (1-30)
- **Auto-Greet**: Welcome new chatters
- **Auto-Polls**: Generate engagement polls at intervals

### 4. Start Monitoring
1. Go to the **Monitor** tab
2. Start your live stream on Twitch/YouTube
3. Click "Start Monitoring"
4. Watch your AI companion engage with chat in real-time!

## Features

### Live Monitor
- Real-time chat feed from connected platforms
- Message statistics (total messages, AI responses, unique viewers)
- Platform status indicators (Twitch/YouTube live badges)
- Unified chat feed showing messages from all connected platforms

### Chat Simulator
- Test AI responses before going live
- Refine personality settings
- Preview response quality

### Response Generator
- Generate multiple response options for common scenarios
- Greetings, questions, compliments, help requests
- Preview and regenerate until satisfied

### Poll Creator
- Manually create polls
- AI-generated polls based on stream context
- Save poll history

## Important Notes

### Rate Limits
- Both Twitch and YouTube have rate limits on bot messages
- Configure "Max Messages Per Minute" to stay within limits
- Default is 10 messages/minute (safe for most platforms)

### Bot Verification
- For large-scale Twitch use, bots require verification
- Small channels can use unverified bots
- See Twitch Developer documentation for details

### Production Deployment
This application provides the **configuration interface** for platform connections. For production use with persistent real-time chat monitoring, you would need:

1. **Backend Service**: A server (Node.js, Python) that maintains persistent connections to chat APIs
2. **WebSocket Connection**: Real-time communication between backend and frontend
3. **Message Queue**: Handle high-volume chat during large streams
4. **Secure Credential Storage**: OAuth tokens should be stored securely server-side

The current implementation stores credentials locally and provides the foundation for integration - ideal for:
- Testing AI personality and responses
- Configuring behavior settings
- Planning your AI companion strategy
- Small-scale personal use

## Tips for Best Results

### Personality
- Be specific in tone descriptions
- Use interests relevant to your content
- Test responses in Chat Simulator first

### Response Settings
- Start with lower message frequency (respond to every 3rd-5th message)
- Add 3-5 second delay for natural timing
- Adjust based on chat speed

### Engagement
- Enable auto-greetings for community building
- Use polls during slow moments or loading screens
- Let AI handle repetitive questions while you focus on gameplay

## Troubleshooting

### Connection Issues
- **Twitch**: Ensure OAuth token starts with `oauth:` and is from your bot account
- **YouTube**: Verify API key has YouTube Data API v3 enabled
- **Both**: Check that credentials are entered correctly (no extra spaces)

### No Messages Appearing
- Ensure stream is live (check platform status)
- Verify monitoring is enabled
- Check that chat is active on your stream

### Rate Limit Errors
- Reduce "Max Messages Per Minute"
- Increase "Message Frequency" (respond less often)
- Add longer "Response Delay"

## API Documentation Links

- [Twitch Chat Documentation](https://dev.twitch.tv/docs/chat)
- [Twitch IRC Guide](https://dev.twitch.tv/docs/irc)
- [YouTube Live Chat API](https://developers.google.com/youtube/v3/live/docs)
- [Google Cloud Console](https://console.cloud.google.com)

## Support

For questions about:
- AI personality and responses: Use Chat Simulator to experiment
- Platform connections: See Integration Guide in Platforms tab
- Stream behavior: Adjust settings and test with simulated traffic first
