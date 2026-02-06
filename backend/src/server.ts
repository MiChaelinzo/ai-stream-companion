import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import { TwitchService } from './services/twitch';
import { YouTubeService } from './services/youtube';
import { AIService } from './services/ai';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

const twitchService = new TwitchService();
const youtubeService = new YouTubeService();
const aiService = new AIService();

const connectedClients: Set<WebSocket> = new Set();

wss.on('connection', (ws: WebSocket) => {
  console.log('Frontend client connected');
  connectedClients.add(ws);

  ws.on('message', async (rawMessage: Buffer | string) => {
    try {
      const messageStr = rawMessage.toString();
      const data = JSON.parse(messageStr);

      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', payload: {} }));
        return;
      }

      console.log('Received message from frontend:', data);

      switch (data.type) {
        case 'connect_twitch':
          await handleTwitchConnect(data.payload);
          break;
        case 'disconnect_twitch':
          await handleTwitchDisconnect();
          break;
        case 'connect_youtube':
          await handleYouTubeConnect(data.payload);
          break;
        case 'disconnect_youtube':
          await handleYouTubeDisconnect();
          break;
        case 'send_message':
          await handleSendMessage(data.payload);
          break;
        case 'create_poll':
          await handleCreatePoll(data.payload);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        payload: { message: 'Failed to process message' }
      }));
    }
  });

  ws.on('close', () => {
    console.log('Frontend client disconnected');
    connectedClients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.send(JSON.stringify({
    type: 'connected',
    payload: { message: 'Backend server connected' }
  }));

  setTimeout(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'connection_status',
        payload: {
          twitch: twitchService.isConnected(),
          youtube: youtubeService.isConnected(),
          gemini: aiService.isConfigured()
        }
      }));
    }
  }, 500);
});

async function handleTwitchConnect(payload: any) {
  try {
    const { channel, accessToken, clientId } = payload;
    
    await twitchService.connect(channel, accessToken, clientId);
    
    twitchService.onMessage(async (chatMessage) => {
      const aiResponse = await aiService.generateResponse(chatMessage.message, chatMessage.username);
      
      broadcastToClients({
        type: 'chat_message',
        payload: {
          platform: 'twitch',
          username: chatMessage.username,
          message: chatMessage.message,
          timestamp: new Date(),
          aiResponse: aiResponse
        }
      });

      if (aiResponse) {
        await twitchService.sendMessage(aiResponse);
        
        broadcastToClients({
          type: 'ai_response',
          payload: {
            platform: 'twitch',
            message: aiResponse,
            timestamp: new Date()
          }
        });
      }
    });

    broadcastToClients({
      type: 'twitch_connected',
      payload: { channel, status: 'connected' }
    });

    console.log(`Connected to Twitch channel: ${channel}`);
  } catch (error) {
    console.error('Twitch connection error:', error);
    broadcastToClients({
      type: 'error',
      payload: { 
        platform: 'twitch',
        message: error instanceof Error ? error.message : 'Failed to connect to Twitch'
      }
    });
  }
}

async function handleTwitchDisconnect() {
  try {
    twitchService.disconnect();
    broadcastToClients({
      type: 'twitch_disconnected',
      payload: { status: 'disconnected' }
    });
    console.log('Disconnected from Twitch');
  } catch (error) {
    console.error('Twitch disconnection error:', error);
  }
}

async function handleYouTubeConnect(payload: any) {
  try {
    const { liveChatId, apiKey } = payload;
    
    await youtubeService.connect(liveChatId, apiKey);
    
    youtubeService.onMessage(async (chatMessage) => {
      const aiResponse = await aiService.generateResponse(chatMessage.message, chatMessage.username);
      
      broadcastToClients({
        type: 'chat_message',
        payload: {
          platform: 'youtube',
          username: chatMessage.username,
          message: chatMessage.message,
          timestamp: new Date(),
          aiResponse: aiResponse
        }
      });

      if (aiResponse) {
        await youtubeService.sendMessage(aiResponse);
        
        broadcastToClients({
          type: 'ai_response',
          payload: {
            platform: 'youtube',
            message: aiResponse,
            timestamp: new Date()
          }
        });
      }
    });

    broadcastToClients({
      type: 'youtube_connected',
      payload: { liveChatId, status: 'connected' }
    });

    console.log(`Connected to YouTube live chat: ${liveChatId}`);
  } catch (error) {
    console.error('YouTube connection error:', error);
    broadcastToClients({
      type: 'error',
      payload: { 
        platform: 'youtube',
        message: error instanceof Error ? error.message : 'Failed to connect to YouTube'
      }
    });
  }
}

async function handleYouTubeDisconnect() {
  try {
    youtubeService.disconnect();
    broadcastToClients({
      type: 'youtube_disconnected',
      payload: { status: 'disconnected' }
    });
    console.log('Disconnected from YouTube');
  } catch (error) {
    console.error('YouTube disconnection error:', error);
  }
}

async function handleSendMessage(payload: any) {
  try {
    const { platform, message } = payload;
    
    if (platform === 'twitch') {
      await twitchService.sendMessage(message);
    } else if (platform === 'youtube') {
      await youtubeService.sendMessage(message);
    }

    console.log(`Sent message to ${platform}: ${message}`);
  } catch (error) {
    console.error('Send message error:', error);
    broadcastToClients({
      type: 'error',
      payload: { message: 'Failed to send message' }
    });
  }
}

async function handleCreatePoll(payload: any) {
  try {
    const { platform, question, options, duration } = payload;
    
    if (platform === 'twitch') {
      const poll = await twitchService.createPoll(question, options, duration);
      broadcastToClients({
        type: 'poll_created',
        payload: { platform: 'twitch', poll }
      });
    }

    console.log(`Created poll on ${platform}`);
  } catch (error) {
    console.error('Create poll error:', error);
    broadcastToClients({
      type: 'error',
      payload: { message: 'Failed to create poll' }
    });
  }
}

function broadcastToClients(message: any) {
  const messageStr = JSON.stringify(message);
  connectedClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    version: '1.0.0',
    uptime: process.uptime(),
    connections: {
      twitch: twitchService.isConnected(),
      youtube: youtubeService.isConnected(),
      clients: connectedClients.size
    },
    gemini: {
      configured: aiService.isConfigured()
    },
    twitch: {
      channel: process.env.TWITCH_CHANNEL || null,
      username: process.env.TWITCH_CHANNEL || null
    }
  });
});

app.get('/status', (req: Request, res: Response) => {
  res.json({
    server: 'AI Streamer Backend',
    version: '1.0.0',
    uptime: process.uptime(),
    connections: {
      twitch: twitchService.isConnected(),
      youtube: youtubeService.isConnected(),
      frontendClients: connectedClients.size
    },
    gemini: {
      configured: aiService.isConfigured()
    }
  });
});

async function initializeServices() {
  console.log('🔧 Initializing services...');
  
  if (process.env.TWITCH_ACCESS_TOKEN && process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CHANNEL) {
    try {
      console.log(`📺 Auto-connecting to Twitch channel: ${process.env.TWITCH_CHANNEL}`);
      
      const token = process.env.TWITCH_ACCESS_TOKEN.replace('oauth:', '');
      
      await twitchService.connect(
        process.env.TWITCH_CHANNEL,
        token,
        process.env.TWITCH_CLIENT_ID
      );
      
      twitchService.onMessage(async (chatMessage) => {
        console.log(`💬 Message from ${chatMessage.username}: ${chatMessage.message}`);
        
        const shouldRespond = Math.random() < 0.3;
        
        if (shouldRespond) {
          console.log('🤖 Generating AI response...');
          const aiResponse = await aiService.generateResponse(chatMessage.message, chatMessage.username);
          
          broadcastToClients({
            type: 'chat_message',
            payload: {
              platform: 'twitch',
              username: chatMessage.username,
              message: chatMessage.message,
              timestamp: new Date(),
              aiResponse: aiResponse
            }
          });

          if (aiResponse) {
            console.log(`✨ AI Response: ${aiResponse}`);
            
            await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 5000));
            
            await twitchService.sendMessage(aiResponse);
            
            broadcastToClients({
              type: 'ai_response',
              payload: {
                platform: 'twitch',
                message: aiResponse,
                timestamp: new Date()
              }
            });
          } else {
            console.log('⚠️ No AI response generated (check GEMINI_API_KEY)');
          }
        } else {
          broadcastToClients({
            type: 'chat_message',
            payload: {
              platform: 'twitch',
              username: chatMessage.username,
              message: chatMessage.message,
              timestamp: new Date()
            }
          });
        }
      });
      
      console.log(`✅ Twitch auto-connect successful`);
    } catch (error) {
      console.error('❌ Twitch auto-connect failed:', error);
      console.error('   Check your .env file:');
      console.error('   - TWITCH_ACCESS_TOKEN (no "oauth:" prefix)');
      console.error('   - TWITCH_CLIENT_ID');
      console.error('   - TWITCH_CHANNEL (lowercase, no #)');
    }
  } else {
    console.log('⚠️ Twitch credentials not configured in .env');
    console.log('   Add TWITCH_ACCESS_TOKEN, TWITCH_CLIENT_ID, and TWITCH_CHANNEL to enable');
  }
  
  if (process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_LIVE_CHAT_ID) {
    try {
      console.log(`📺 Auto-connecting to YouTube...`);
      await youtubeService.connect(process.env.YOUTUBE_LIVE_CHAT_ID, process.env.YOUTUBE_API_KEY);
      
      youtubeService.onMessage(async (chatMessage) => {
        const aiResponse = await aiService.generateResponse(chatMessage.message, chatMessage.username);
        
        broadcastToClients({
          type: 'chat_message',
          payload: {
            platform: 'youtube',
            username: chatMessage.username,
            message: chatMessage.message,
            timestamp: new Date(),
            aiResponse: aiResponse
          }
        });

        if (aiResponse) {
          await youtubeService.sendMessage(aiResponse);
          
          broadcastToClients({
            type: 'ai_response',
            payload: {
              platform: 'youtube',
              message: aiResponse,
              timestamp: new Date()
            }
          });
        }
      });
      
      console.log(`✅ YouTube auto-connect successful`);
    } catch (error) {
      console.error('❌ YouTube auto-connect failed:', error);
    }
  }
}

server.listen(PORT, async () => {
  console.log(`🚀 AI Streamer Backend Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  
  await initializeServices();
  
  console.log('\n✅ Server initialization complete');
  console.log('👀 Waiting for chat messages...\n');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    twitchService.disconnect();
    youtubeService.disconnect();
  });
});
