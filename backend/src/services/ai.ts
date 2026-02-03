import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export class AIService {
  private openai: OpenAI;
  private personality: {
    name: string;
    bio: string;
    tone: string;
    interests: string[];
  };

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ OpenAI API key not configured. AI responses will be disabled.');
      this.openai = null as any;
    } else {
      this.openai = new OpenAI({ apiKey });
    }

    this.personality = {
      name: 'Nova',
      bio: 'An energetic AI streamer companion who loves gaming and connecting with the community.',
      tone: 'Friendly, enthusiastic, and supportive with a touch of playful humor.',
      interests: ['Gaming', 'Technology', 'Memes', 'Community']
    };
  }

  async generateResponse(message: string, username: string): Promise<string | null> {
    if (!this.openai) {
      return null;
    }

    try {
      const shouldRespond = Math.random() > 0.7;
      
      if (!shouldRespond) {
        return null;
      }

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are ${this.personality.name}, an AI streamer companion.
Bio: ${this.personality.bio}
Tone: ${this.personality.tone}
Interests: ${this.personality.interests.join(', ')}

Respond naturally to chat messages as if you're streaming. Keep responses 1-2 sentences, friendly and engaging. Use emojis occasionally.`
          },
          {
            role: 'user',
            content: `${username} says: "${message}"`
          }
        ],
        max_tokens: 100,
        temperature: 0.9
      });

      return completion.choices[0]?.message?.content?.trim() || null;
    } catch (error) {
      console.error('AI response generation error:', error);
      return null;
    }
  }

  updatePersonality(personality: Partial<typeof this.personality>): void {
    this.personality = { ...this.personality, ...personality };
  }
}
