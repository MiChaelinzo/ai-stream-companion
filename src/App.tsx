import { useState } from "react";
import { useKV } from "@github/spark/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalityConfig } from "@/components/PersonalityConfig";
import { ChatSimulator } from "@/components/ChatSimulator";
import { ResponseGenerator } from "@/components/ResponseGenerator";
import { PollCreator } from "@/components/PollCreator";
import { PlatformConnection } from "@/components/PlatformConnection";
import { StreamSettings } from "@/components/StreamSettings";
import { LiveMonitor } from "@/components/LiveMonitor";
import { ResponseTemplates } from "@/components/ResponseTemplates";
import { ChatCommands } from "@/components/ChatCommands";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { SentimentMonitor } from "@/components/SentimentMonitor";
import { 
  AIPersonality, 
  ChatMessage, 
  Poll, 
  PlatformConnection as PlatformConnectionType,
  PlatformType,
  StreamSettings as StreamSettingsType,
  ResponseTemplate,
  ChatCommand
} from "@/lib/types";
import { Robot, ChatCircle, Lightning, Question, Link as LinkIcon, GearSix, Broadcast, ChartLine, Terminal, ListChecks } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const defaultPersonality: AIPersonality = {
  name: "Nova",
  bio: "An energetic AI streamer companion who loves gaming and connecting with the community.",
  tone: "Friendly, enthusiastic, and supportive with a touch of playful humor.",
  interests: ["Gaming", "Technology", "Memes", "Community"],
  responseStyle: "playful",
  tonePreset: "energetic",
  emoji: true,
  slang: true,
};

const defaultStreamSettings: StreamSettingsType = {
  autoRespond: true,
  responseDelay: 3,
  pollInterval: 15,
  enablePolls: true,
  enableGreetings: true,
  messageFrequency: 3,
  maxMessagesPerMinute: 10,
};

function App() {
  const [personality, setPersonality] = useKV<AIPersonality>("ai-personality", defaultPersonality);
  const [messages, setMessages] = useKV<ChatMessage[]>("chat-messages", []);
  const [polls, setPolls] = useKV<Poll[]>("polls", []);
  const [twitchConnection, setTwitchConnection] = useKV<PlatformConnectionType | null>("twitch-connection", null);
  const [youtubeConnection, setYoutubeConnection] = useKV<PlatformConnectionType | null>("youtube-connection", null);
  const [streamSettings, setStreamSettings] = useKV<StreamSettingsType>("stream-settings", defaultStreamSettings);
  const [liveMessages, setLiveMessages] = useKV<ChatMessage[]>("live-messages", []);
  const [templates, setTemplates] = useKV<ResponseTemplate[]>("response-templates", []);
  const [commands, setCommands] = useKV<ChatCommand[]>("chat-commands", []);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResponses, setGeneratedResponses] = useState<string[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const currentPersonality = personality || defaultPersonality;
  const currentStreamSettings = streamSettings || defaultStreamSettings;

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const emojiInstruction = currentPersonality.emoji ? "Use emojis naturally in your responses." : "Do not use emojis.";
    const slangInstruction = currentPersonality.slang ? "Use internet slang and casual language where appropriate." : "Use proper grammar and avoid slang.";
    
    const prompt = (window.spark.llmPrompt as any)`You are ${currentPersonality.name}, an AI streamer companion with the following characteristics:

Bio: ${currentPersonality.bio}
Tone: ${currentPersonality.tone}
Interests: ${currentPersonality.interests.join(", ")}
Response Style: ${currentPersonality.responseStyle}

Communication Guidelines:
- ${emojiInstruction}
- ${slangInstruction}

A viewer just said: "${userMessage}"

Generate a ${currentPersonality.responseStyle} response that matches your personality. Keep it natural and conversational, like you're streaming. Response should be 1-3 sentences.`;

    const response = await window.spark.llm(prompt, "gpt-4o-mini");
    return response.trim();
  };

  const analyzeSentiment = async (message: string): Promise<'positive' | 'neutral' | 'negative'> => {
    try {
      const prompt = (window.spark.llmPrompt as any)`Analyze the sentiment of this chat message: "${message}"

Classify it as one of: positive, neutral, or negative.

Return ONLY the classification word, nothing else.`;

      const result = await window.spark.llm(prompt, "gpt-4o-mini");
      const sentiment = result.trim().toLowerCase();
      
      if (sentiment.includes('positive')) return 'positive';
      if (sentiment.includes('negative')) return 'negative';
      return 'neutral';
    } catch (error) {
      return 'neutral';
    }
  };

  const handleSendMessage = async (content: string) => {
    const sentiment = await analyzeSentiment(content);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      sentiment,
    };

    setMessages((current) => [...(current || []), userMessage]);
    setIsGenerating(true);

    try {
      const aiResponse = await generateAIResponse(content);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        votes: { up: 0, down: 0 },
      };
      setMessages((current) => [...(current || []), aiMessage]);
    } catch (error) {
      toast.error("Failed to generate AI response");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateResponses = async (scenario: string, context: string) => {
    setIsGenerating(true);
    setGeneratedResponses([]);

    try {
      const scenarioDescriptions: Record<string, string> = {
        greeting: "A new viewer just joined the stream and said hello",
        question: "A viewer is asking about the gameplay or strategy",
        compliment: "A viewer is complimenting your skills or the stream",
        help: "A viewer is asking for help or advice",
        random: "A viewer sent a random chat message",
      };

      const emojiInstruction = currentPersonality.emoji ? "Use emojis naturally in your responses." : "Do not use emojis.";
      const slangInstruction = currentPersonality.slang ? "Use internet slang and casual language where appropriate." : "Use proper grammar and avoid slang.";

      const prompt = (window.spark.llmPrompt as any)`You are ${currentPersonality.name}, an AI streamer companion.

Personality:
- Bio: ${currentPersonality.bio}
- Tone: ${currentPersonality.tone}
- Interests: ${currentPersonality.interests.join(", ")}
- Style: ${currentPersonality.responseStyle}

Communication Guidelines:
- ${emojiInstruction}
- ${slangInstruction}

Scenario: ${scenarioDescriptions[scenario]}
${context ? `Additional context: ${context}` : ""}

Generate 3 different ${currentPersonality.responseStyle} responses that ${currentPersonality.name} could use. Each response should be 1-2 sentences and feel natural.

Return as JSON with this format:
{
  "responses": ["response1", "response2", "response3"]
}`;

      const response = await window.spark.llm(prompt, "gpt-4o-mini", true);
      const parsed = JSON.parse(response);
      setGeneratedResponses(parsed.responses || []);
    } catch (error) {
      toast.error("Failed to generate responses");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreatePoll = (question: string, options: string[]) => {
    const newPoll: Poll = {
      id: Date.now().toString(),
      question,
      options,
      createdAt: new Date(),
    };
    setPolls((current) => [newPoll, ...(current || [])]);
  };

  const handleDeletePoll = (id: string) => {
    setPolls((current) => (current || []).filter((p) => p.id !== id));
    toast.success("Poll deleted");
  };

  const handleGeneratePoll = async (context: string) => {
    setIsGenerating(true);

    try {
      const prompt = (window.spark.llmPrompt as any)`You are ${currentPersonality.name}, an AI streamer companion.

${context ? `Current context: ${context}` : "You're streaming and playing games."}

Generate an engaging poll question with 3-4 options that would be fun for stream viewers. The poll should relate to the streaming context and encourage chat interaction.

Return as JSON:
{
  "question": "the poll question",
  "options": ["option1", "option2", "option3", "option4"]
}`;

      const response = await window.spark.llm(prompt, "gpt-4o-mini", true);
      const parsed = JSON.parse(response);
      
      if (parsed.question && parsed.options) {
        handleCreatePoll(parsed.question, parsed.options);
        toast.success("AI poll generated!");
      }
    } catch (error) {
      toast.error("Failed to generate poll");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlatformConnect = (platform: PlatformType, credentials: any) => {
    if (platform === 'twitch') {
      setTwitchConnection((current) => ({
        platform: 'twitch',
        isConnected: true,
        username: credentials.username,
        channelId: credentials.channelId,
        accessToken: credentials.accessToken,
        isLive: false,
      }));
    } else {
      setYoutubeConnection((current) => ({
        platform: 'youtube',
        isConnected: true,
        channelId: credentials.liveId,
        accessToken: credentials.apiKey,
        isLive: false,
      }));
    }
  };

  const handlePlatformDisconnect = (platform: PlatformType) => {
    if (platform === 'twitch') {
      setTwitchConnection(() => null);
      setIsMonitoring(false);
    } else {
      setYoutubeConnection(() => null);
      setIsMonitoring(false);
    }
  };

  const handleToggleMonitoring = () => {
    setIsMonitoring((prev) => {
      const newState = !prev;
      if (newState) {
        toast.success("Started monitoring live chat");
        if (twitchConnection) {
          setTwitchConnection((current) => current ? { ...current, isLive: true } : null);
        }
        if (youtubeConnection) {
          setYoutubeConnection((current) => current ? { ...current, isLive: true } : null);
        }
      } else {
        toast.info("Stopped monitoring live chat");
      }
      return newState;
    });
  };

  const handleVoteOnResponse = (messageId: string, vote: 'up' | 'down') => {
    setMessages((current) => 
      (current || []).map(msg => {
        if (msg.id === messageId) {
          const votes = msg.votes || { up: 0, down: 0 };
          return {
            ...msg,
            votes: {
              up: vote === 'up' ? votes.up + 1 : votes.up,
              down: vote === 'down' ? votes.down + 1 : votes.down,
            }
          };
        }
        return msg;
      })
    );
  };

  const handleCreateTemplate = (template: Omit<ResponseTemplate, "id" | "createdAt" | "usageCount">) => {
    const newTemplate: ResponseTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date(),
      usageCount: 0,
    };
    setTemplates((current) => [newTemplate, ...(current || [])]);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((current) => (current || []).filter(t => t.id !== id));
  };

  const handleUseTemplate = (id: string) => {
    setTemplates((current) => 
      (current || []).map(t => 
        t.id === id ? { ...t, usageCount: (t.usageCount || 0) + 1 } : t
      )
    );
  };

  const handleCreateCommand = (command: Omit<ChatCommand, "id" | "createdAt" | "usageCount">) => {
    const newCommand: ChatCommand = {
      ...command,
      id: Date.now().toString(),
      createdAt: new Date(),
      usageCount: 0,
    };
    setCommands((current) => [newCommand, ...(current || [])]);
  };

  const handleDeleteCommand = (id: string) => {
    setCommands((current) => (current || []).filter(c => c.id !== id));
  };

  const handleToggleCommand = (id: string, enabled: boolean) => {
    setCommands((current) => 
      (current || []).map(c => 
        c.id === id ? { ...c, enabled } : c
      )
    );
  };

  const liveStats = {
    totalMessages: (liveMessages || []).length,
    aiResponses: (liveMessages || []).filter(m => m.sender === 'ai').length,
    uniqueViewers: new Set((liveMessages || []).filter(m => m.username).map(m => m.username)).size,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.65_0.25_300_/_0.1),transparent_50%)] pointer-events-none" />
      
      <div className="relative">
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-glow">
                  <Robot size={24} weight="bold" className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">AI Streamer Companion</h1>
                  <p className="text-sm text-muted-foreground">Twitch & YouTube live chat integration</p>
                </div>
              </div>
              <Badge className="bg-accent/20 text-accent border-accent/30 hover:bg-accent/30 px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
                Active
              </Badge>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <Tabs defaultValue="monitor" className="space-y-6">
            <TabsList className="grid w-full grid-cols-10 max-w-6xl mx-auto bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="monitor" className="gap-2">
                <Broadcast size={18} weight="bold" />
                <span className="hidden sm:inline">Monitor</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <ChartLine size={18} weight="bold" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="platforms" className="gap-2">
                <LinkIcon size={18} weight="bold" />
                <span className="hidden sm:inline">Platforms</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <GearSix size={18} weight="bold" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-2">
                <ChatCircle size={18} weight="bold" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="responses" className="gap-2">
                <Lightning size={18} weight="fill" />
                <span className="hidden sm:inline">Responses</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-2">
                <ListChecks size={18} weight="bold" />
                <span className="hidden sm:inline">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="commands" className="gap-2">
                <Terminal size={18} weight="bold" />
                <span className="hidden sm:inline">Commands</span>
              </TabsTrigger>
              <TabsTrigger value="polls" className="gap-2">
                <Question size={18} weight="bold" />
                <span className="hidden sm:inline">Polls</span>
              </TabsTrigger>
              <TabsTrigger value="personality" className="gap-2">
                <Robot size={18} weight="bold" />
                <span className="hidden sm:inline">Personality</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monitor" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LiveMonitor
                    messages={liveMessages || []}
                    twitchConnection={twitchConnection || null}
                    youtubeConnection={youtubeConnection || null}
                    isMonitoring={isMonitoring}
                    onToggleMonitoring={handleToggleMonitoring}
                    stats={liveStats}
                  />
                </div>
                <div>
                  <SentimentMonitor
                    messages={liveMessages || []}
                    isLive={isMonitoring}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsDashboard messages={[...(messages || []), ...(liveMessages || [])]} />
            </TabsContent>

            <TabsContent value="platforms" className="space-y-6">
              <PlatformConnection
                twitchConnection={twitchConnection || null}
                youtubeConnection={youtubeConnection || null}
                onConnect={handlePlatformConnect}
                onDisconnect={handlePlatformDisconnect}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <StreamSettings
                settings={currentStreamSettings}
                onUpdate={setStreamSettings}
                isConnected={twitchConnection?.isConnected || youtubeConnection?.isConnected || false}
              />
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <ChatSimulator
                messages={messages || []}
                onSendMessage={handleSendMessage}
                isGenerating={isGenerating}
                personality={currentPersonality}
                onVote={handleVoteOnResponse}
              />
            </TabsContent>

            <TabsContent value="responses" className="space-y-6">
              <ResponseGenerator
                onGenerate={handleGenerateResponses}
                isGenerating={isGenerating}
                generatedResponses={generatedResponses}
              />
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <ResponseTemplates
                templates={templates || []}
                onCreateTemplate={handleCreateTemplate}
                onDeleteTemplate={handleDeleteTemplate}
                onUseTemplate={handleUseTemplate}
              />
            </TabsContent>

            <TabsContent value="commands" className="space-y-6">
              <ChatCommands
                commands={commands || []}
                onCreateCommand={handleCreateCommand}
                onDeleteCommand={handleDeleteCommand}
                onToggleCommand={handleToggleCommand}
              />
            </TabsContent>

            <TabsContent value="polls" className="space-y-6">
              <PollCreator
                polls={polls || []}
                onCreatePoll={handleCreatePoll}
                onDeletePoll={handleDeletePoll}
                onGeneratePoll={handleGeneratePoll}
                isGenerating={isGenerating}
              />
            </TabsContent>

            <TabsContent value="personality" className="space-y-6">
              <PersonalityConfig personality={currentPersonality} onUpdate={setPersonality} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;