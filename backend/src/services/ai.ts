import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export class AIService {
  private genAI: GoogleGenerativeAI | null;
  private model: any;
  private modelName: string;
  private personality: {
    name: string;
    bio: string;
    tone: string;
    interests: string[];
  };

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-3.0-flash-001';
    
    if (!apiKey) {
      console.warn('⚠️ Google Gemini API key not configured. AI responses will be disabled.');
      console.warn('   Get your API key from: https://aistudio.google.com/app/apikey');
      this.genAI = null;
      this.model = null;
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: this.modelName });
      console.log(`✅ Google Gemini ${this.modelName} initialized successfully`);
    }

    this.personality = {
      name: 'Nova',
      bio: 'An energetic AI streamer companion who loves gaming and connecting with the community.',
      tone: 'Friendly, enthusiastic, and supportive with a touch of playful humor.',
      interests: ['Gaming', 'Technology', 'Memes', 'Community']
    };
  }

  async generateResponse(message: string, username: string): Promise<string | null> {
    if (!this.model) {
      return null;
    }

    try {
      // Respond to 30% of messages to avoid spam
      const shouldRespond = Math.random() > 0.7;
      
      if (!shouldRespond) {
        return null;
      }

      const prompt = `You are ${this.personality.name}, an AI streamer companion.

Bio: ${this.personality.bio}
Tone: ${this.personality.tone}
Interests: ${this.personality.interests.join(', ')}

A viewer named ${username} just said: "${message}"

Respond naturally as if you're streaming live. Keep your response 1-2 sentences, friendly and engaging. Use emojis occasionally. Be conversational and match their energy.

Your response:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim() || null;
    } catch (error: any) {
      console.error('Gemini AI response generation error:', error);
      
      // Provide helpful error messages
      if (error?.message?.includes('API_KEY_INVALID')) {
        console.error('❌ Invalid Gemini API key. Get a valid key from: https://aistudio.google.com/app/apikey');
      } else if (error?.message?.includes('quota')) {
        console.error('❌ Gemini API quota exceeded. Check your usage at: https://aistudio.google.com/');
      }
      
      return null;
    }
  }

  updatePersonality(personality: Partial<typeof this.personality>): void {
    this.personality = { ...this.personality, ...personality };
    console.log(`✅ Personality updated: ${this.personality.name}`);
  }

  getModelInfo(): { provider: string; model: string; configured: boolean } {
    return {
      provider: 'Google Gemini',
      model: this.modelName,
      configured: this.model !== null
    };
  }

  isConfigured(): boolean {
    return this.model !== null;
  }
}
