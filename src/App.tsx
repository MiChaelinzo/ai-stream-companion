import { useState, useEffect } from "react";
import { useKV } from "@github/spark/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
import { SentimentTrendChart } from "@/components/SentimentTrendChart";
import { EngagementScore } from "@/components/EngagementScore";
import { SentimentInsights } from "@/components/SentimentInsights";
import { EmotionDetection } from "@/components/EmotionDetection";
import { ChatSimulation } from "@/components/ChatSimulation";
import { VTuberAvatar } from "@/components/VTuberAvatar";
import { SystemStatusCard } from "@/components/SystemStatusCard";
import { TwitchIntegrationGuide } from "@/components/TwitchIntegrationGuide";
import { GameplayVisionAnalyzer } from "@/components/GameplayVisionAnalyzer";
import { VisionSettingsConfig } from "@/components/VisionSettingsConfig";
import { VisionStatsCard } from "@/components/VisionStatsCard";
import { CommentaryHistory } from "@/components/CommentaryHistory";
import { CommentarySyncMonitor } from "@/components/CommentarySyncMonitor";
import { VoiceSettingsConfig } from "@/components/VoiceSettingsConfig";
import { VoiceActivityMonitor } from "@/components/VoiceActivityMonitor";
import { SSMLEditor } from "@/components/SSMLEditor";
import { AutoSSMLEnhancer } from "@/components/AutoSSMLEnhancer";
import { SSMLInfoCard } from "@/components/SSMLInfoCard";
import { PerformanceMetricsTracker } from "@/components/PerformanceMetricsTracker";
import { AICoachingPanel } from "@/components/AICoachingPanel";
import { PerformanceSessionManager } from "@/components/PerformanceSessionManager";
import { SkillProgressDashboard } from "@/components/SkillProgressDashboard";
import { PerformanceSimulator } from "@/components/PerformanceSimulator";
import { BackendConnection } from "@/components/BackendConnection";
import { AISupportChatbox } from "@/components/AISupportChatbox";
import { ScreenshotAnalyzer } from "@/components/ScreenshotAnalyzer";
import { VideoAnalyzer } from "@/components/VideoAnalyzer";
import { QuickActionsPanel } from "@/components/QuickActionsPanel";
import { StreamGoals } from "@/components/StreamGoals";
import { ViewerEngagementGames } from "@/components/ViewerEngagementGames";
import { StreamHighlightsDetector } from "@/components/StreamHighlightsDetector";
import { TwitchChatTester } from "@/components/TwitchChatTester";
import { DeploymentGuide } from "@/components/DeploymentGuide";
import { 
  AIPersonality, 
  ChatMessage, 
  Poll, 
  PlatformConnection as PlatformConnectionType,
  PlatformType,
  StreamSettings as StreamSettingsType,
  ResponseTemplate,
  ChatCommand,
  VisionSettings,
  GameplayAnalysis,
  PerformanceMetric,
  PerformanceSession,
  AICoachingSuggestion,
  SkillProgress,
  SupportChatMessage,
  VideoAnalysisResult,
  StreamGoal,
  StreamHighlight,
} from "@/lib/types";
import { useSpeechSynthesis, VoiceSettings } from "@/hooks/use-speech-synthesis";
import { Robot, ChatCircle, Lightning, Question, Link as LinkIcon, GearSix, Broadcast, ChartLine, Terminal, ListChecks, Smiley, Key, Eye, SpeakerHigh, Info, Trophy, MagnifyingGlass, House, PlugsConnected, Headset, Target, GameController, Sparkle, Rocket } from "@phosphor-icons/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  avatarSkin: "default",
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

const defaultVisionSettings: VisionSettings = {
  enabled: false,
  analysisInterval: 15,
  autoCommentary: true,
  detectHighlights: true,
  gameContext: '',
  confidenceThreshold: 0.7,
  commentaryStyle: 'hype',
  commentaryFrequency: 'highlights-only',
  includeGameplayTips: true,
  reactToActions: true,
};

const defaultVoiceSettings: VoiceSettings = {
  enabled: true,
  gender: 'female',
  pitch: 'normal',
  speed: 'normal',
  volume: 0.8,
  enableSSML: true,
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
  const [visionSettings, setVisionSettings] = useKV<VisionSettings>("vision-settings", defaultVisionSettings);
  const [gameplayAnalyses, setGameplayAnalyses] = useKV<GameplayAnalysis[]>("gameplay-analyses", []);
  const [voiceSettings, setVoiceSettings] = useKV<VoiceSettings>("voice-settings", defaultVoiceSettings);
  const [performanceSessions, setPerformanceSessions] = useKV<PerformanceSession[]>("performance-sessions", []);
  const [coachingSuggestions, setCoachingSuggestions] = useKV<AICoachingSuggestion[]>("coaching-suggestions", []);
  const [skillProgress, setSkillProgress] = useKV<SkillProgress[]>("skill-progress", []);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResponses, setGeneratedResponses] = useState<string[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);
  const [chatSimulationRate, setChatSimulationRate] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [avatarEmotion, setAvatarEmotion] = useState<"neutral" | "happy" | "excited" | "thinking" | "confused" | "surprised" | "sad">("neutral");
  const [avatarSpeaking, setAvatarSpeaking] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState("");
  const [currentSentiment, setCurrentSentiment] = useState<'positive' | 'neutral' | 'negative'>('neutral');
  const [avatarCurrentPhoneme, setAvatarCurrentPhoneme] = useState<string>('silence');
  const [avatarCurrentEmotion, setAvatarCurrentEmotion] = useState<string>('neutral');
  const [avatarEmotionIntensity, setAvatarEmotionIntensity] = useState<number>(0);
  const [isPerformanceTracking, setIsPerformanceTracking] = useState(false);
  const [currentPerformanceSession, setCurrentPerformanceSession] = useState<PerformanceSession | null>(null);
  const [latestPerformanceMetric, setLatestPerformanceMetric] = useState<PerformanceMetric | null>(null);
  const [performanceSimulationInterval, setPerformanceSimulationInterval] = useState<NodeJS.Timeout | null>(null);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [simulationSkillLevel, setSimulationSkillLevel] = useState(50);
  const [isAnalyzingPerformance, setIsAnalyzingPerformance] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [tabSearchQuery, setTabSearchQuery] = useState("");
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [supportChatMessages, setSupportChatMessages] = useKV<SupportChatMessage[]>("support-chat-messages", []);
  const [videoAnalyses, setVideoAnalyses] = useKV<VideoAnalysisResult[]>("video-analyses", []);
  const [showFloatingSupport, setShowFloatingSupport] = useState(false);
  const [streamGoals, setStreamGoals] = useKV<StreamGoal[]>("stream-goals", []);
  const [streamHighlights, setStreamHighlights] = useKV<StreamHighlight[]>("stream-highlights", []);

  const currentPersonality = personality || defaultPersonality;
  const currentStreamSettings = streamSettings || defaultStreamSettings;
  const currentVoiceSettings = voiceSettings || defaultVoiceSettings;

  const { speak, stop, speechState, availableVoices, isSupported } = useSpeechSynthesis(currentVoiceSettings);

  useEffect(() => {
    if ((liveMessages || []).length > 0) {
      const recentMessages = (liveMessages || []).slice(-5);
      const sentiments = recentMessages
        .filter(m => m.sentiment)
        .map(m => m.sentiment);
      
      if (sentiments.length > 0) {
        const positiveCount = sentiments.filter(s => s === 'positive').length;
        const negativeCount = sentiments.filter(s => s === 'negative').length;
        
        if (positiveCount > negativeCount && positiveCount >= 3) {
          setAvatarEmotion("excited");
        } else if (negativeCount > positiveCount && negativeCount >= 2) {
          setAvatarEmotion("confused");
        }
      }
    }
  }, [liveMessages]);

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

    const response = await window.spark.llm(prompt, "gpt-4o");
    return response.trim();
  };

  const analyzeSentiment = async (message: string): Promise<'positive' | 'neutral' | 'negative'> => {
    try {
      const prompt = (window.spark.llmPrompt as any)`Analyze the sentiment of this chat message: "${message}"

Classify it as one of: positive, neutral, or negative.

Return ONLY the classification word, nothing else.`;

      const result = await window.spark.llm(prompt, "gpt-4o");
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
    setCurrentSentiment(sentiment);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      sentiment,
    };

    setMessages((current) => [...(current || []), userMessage]);
    setIsGenerating(true);
    setAvatarEmotion("thinking");
    setCurrentSpeechText("");

    try {
      const aiResponse = await generateAIResponse(content);
      setCurrentSpeechText(aiResponse);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
        votes: { up: 0, down: 0 },
      };
      setMessages((current) => [...(current || []), aiMessage]);
      
      setAvatarSpeaking(true);
      await speak(aiResponse, setAvatarCurrentPhoneme);
      
      setTimeout(() => {
        setAvatarSpeaking(false);
        setCurrentSpeechText("");
        setAvatarEmotion("neutral");
        setCurrentSentiment('neutral');
      }, 1000);
    } catch (error) {
      toast.error("Failed to generate AI response");
      console.error(error);
      setAvatarEmotion("confused");
      setAvatarSpeaking(false);
      setCurrentSpeechText("");
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

      const response = await window.spark.llm(prompt, "gpt-4o", true);
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

      const response = await window.spark.llm(prompt, "gpt-4o", true);
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

  const handleGameplayAnalysis = (analysis: GameplayAnalysis) => {
    setGameplayAnalyses((current) => [analysis, ...(current || [])].slice(0, 50));
    
    const currentVisionSettings = visionSettings || defaultVisionSettings;
    if (currentVisionSettings.detectHighlights && analysis.highlights && analysis.highlights.length > 0) {
      toast.success(`🎮 Highlight detected: ${analysis.highlights[0]}`);
    }
  };

  const handleVisionCommentary = async (commentary: string) => {
    setAvatarSpeaking(true);
    setCurrentSpeechText(commentary);
    setAvatarEmotion("excited");
    setCurrentSentiment('positive');

    const commentaryMessage: ChatMessage = {
      id: Date.now().toString() + '_vision',
      content: `🎮 ${commentary}`,
      sender: 'ai',
      timestamp: new Date(),
      platform: 'simulator',
    };
    setLiveMessages((current) => [...(current || []), commentaryMessage]);

    await speak(commentary, setAvatarCurrentPhoneme);

    setTimeout(() => {
      setAvatarSpeaking(false);
      setCurrentSpeechText("");
      setAvatarEmotion("neutral");
      setCurrentSentiment('neutral');
    }, 1000);
  };

  const handleSimulateMessage = async (content: string, sentiment: 'positive' | 'neutral' | 'negative') => {
    const usernames = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Drew', 'Parker', 'Avery', 'Quinn'];
    const username = usernames[Math.floor(Math.random() * usernames.length)];
    
    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random(),
      content,
      sender: 'user',
      timestamp: new Date(),
      username,
      platform: 'simulator',
      sentiment,
    };

    setLiveMessages((current) => [...(current || []), newMessage]);

    if (currentStreamSettings.autoRespond && Math.random() > 0.7) {
      setAvatarEmotion("thinking");
      setCurrentSentiment(sentiment);
      
      setTimeout(async () => {
        try {
          const aiResponse = await generateAIResponse(content);
          setCurrentSpeechText(aiResponse);
          
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString() + Math.random(),
            content: aiResponse,
            sender: 'ai',
            timestamp: new Date(),
            platform: 'simulator',
          };
          setLiveMessages((current) => [...(current || []), aiMessage]);
          
          setAvatarSpeaking(true);
          await speak(aiResponse, setAvatarCurrentPhoneme);
          
          setTimeout(() => {
            setAvatarSpeaking(false);
            setCurrentSpeechText("");
            setAvatarEmotion("neutral");
            setCurrentSentiment('neutral');
          }, 1000);
        } catch (error) {
          console.error('Failed to generate AI response', error);
          setAvatarSpeaking(false);
          setCurrentSpeechText("");
          setAvatarEmotion("neutral");
        }
      }, currentStreamSettings.responseDelay * 1000);
    }
  };

  const handleToggleSimulation = () => {
    if (isSimulating) {
      if (simulationInterval) {
        clearInterval(simulationInterval);
        setSimulationInterval(null);
      }
      setIsSimulating(false);
      toast.info('Chat simulation stopped');
    } else {
      setIsSimulating(true);
      toast.success('Chat simulation started');
      
      const intervalTimes = {
        slow: 600000,
        medium: 360000,
        fast: 180000,
      };
      
      const intervalTime = intervalTimes[chatSimulationRate];
      
      const interval = setInterval(() => {
        const sentiments: Array<'positive' | 'neutral' | 'negative'> = ['positive', 'neutral', 'negative'];
        const weights = [0.5, 0.3, 0.2];
        
        const random = Math.random();
        let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
        
        if (random < weights[0]) sentiment = 'positive';
        else if (random < weights[0] + weights[1]) sentiment = 'neutral';
        else sentiment = 'negative';

        const sampleMessages = {
          positive: [
            "This is so good! 🔥",
            "Love this content!",
            "Amazing gameplay!",
            "You're the best!",
            "This is so entertaining 😂",
            "Great stream today!",
            "Keep it up! ⚡",
            "Awesome! 👏",
          ],
          neutral: [
            "What game is this?",
            "When did you start?",
            "How long have you been playing?",
            "What's next?",
            "Interesting",
            "Hello everyone",
          ],
          negative: [
            "This is boring",
            "Not a fan of this",
            "Why are you doing that?",
            "This doesn't make sense",
            "I don't like this",
          ],
        };

        const messages = sampleMessages[sentiment];
        const message = messages[Math.floor(Math.random() * messages.length)];
        handleSimulateMessage(message, sentiment);
      }, intervalTime);
      
      setSimulationInterval(interval);
    }
  };

  const handleChatRateChange = (rate: 'slow' | 'medium' | 'fast') => {
    setChatSimulationRate(rate);
    
    if (isSimulating) {
      if (simulationInterval) {
        clearInterval(simulationInterval);
        setSimulationInterval(null);
      }
      setIsSimulating(false);
      
      toast.info(`Rate changed to ${rate}. Restart simulation to apply.`);
    }
  };

  const handleTestVoice = async () => {
    const testPhrases = [
      `Hey everyone! I'm ${currentPersonality.name}, your AI streaming companion!`,
      `Thanks for watching the stream! Let's have some fun together!`,
      `That was an amazing play! Great job!`,
    ];
    const randomPhrase = testPhrases[Math.floor(Math.random() * testPhrases.length)];
    
    setAvatarSpeaking(true);
    setAvatarEmotion("happy");
    setCurrentSpeechText(randomPhrase);
    
    try {
      await speak(randomPhrase, setAvatarCurrentPhoneme);
      toast.success("Voice test complete!");
    } catch (error) {
      toast.error("Voice test failed");
    } finally {
      setTimeout(() => {
        setAvatarSpeaking(false);
        setAvatarEmotion("neutral");
        setCurrentSpeechText("");
      }, 500);
    }
  };

  const enhanceTextWithSSML = async (text: string, sentiment: 'positive' | 'neutral' | 'negative'): Promise<string> => {
    try {
      const prompt = (window.spark.llmPrompt as any)`You are an expert SSML (Speech Synthesis Markup Language) engineer specializing in creating highly expressive and natural-sounding speech patterns.

**Text to enhance:** "${text}"
**Detected Sentiment:** ${sentiment}

**SSML Enhancement Guidelines:**

1. **Breaks and Pauses:**
   - Use <break time="Xms"/> for natural conversation flow
   - Short pauses (200-300ms) after commas or between clauses
   - Medium pauses (400-600ms) for dramatic effect or emphasis
   - Long pauses (800-1000ms) only for very dramatic moments
   - Always place breaks naturally at punctuation or thought boundaries

2. **Emphasis:**
   - <emphasis level="strong"> for KEY words, IMPORTANT points, or EXCITEMENT
   - <emphasis level="moderate"> for words that need mild emphasis
   - <emphasis level="reduced"> for less important words or asides
   - Don't over-emphasize; use sparingly for maximum impact

3. **Prosody (Pitch, Rate, Volume):**
   - <prosody pitch="+X%" rate="X%" volume="X%">text</prosody>
   - For POSITIVE sentiment:
     * pitch: +10% to +30% (higher, more energetic)
     * rate: 105% to 120% (slightly faster, more excited)
     * Use on excited words, celebrations, achievements
   - For NEGATIVE sentiment:
     * pitch: -10% to -20% (lower, more serious/sad)
     * rate: 80% to 95% (slower, more thoughtful)
     * Use on disappointed, sad, or serious phrases
   - For NEUTRAL sentiment:
     * pitch: -5% to +5% (natural variation)
     * rate: 95% to 105% (near normal)
     * Use subtle variations for natural speech

4. **Emotion Mapping:**
   - Excited/Happy: high pitch (+20%), faster rate (115%), strong emphasis
   - Sad/Disappointed: low pitch (-15%), slower rate (85%), reduced emphasis
   - Surprised: sudden pitch change (+25%), brief pause before
   - Thoughtful: normal pitch, slower rate (90%), moderate pauses
   - Welcoming: warm pitch (+10%), normal-slow rate (95%), moderate emphasis

5. **Practical Examples:**
   - "That was <emphasis level="strong">amazing</emphasis>!" → <prosody pitch="+20%" rate="115%">That was <break time="200ms"/><emphasis level="strong">amazing</emphasis>!</prosody>
   - "Oh no..." → <prosody pitch="-15%" rate="85%">Oh <break time="300ms"/>no<break time="500ms"/></prosody>
   - "Welcome everyone!" → <prosody pitch="+10%">Welcome <emphasis level="moderate">everyone</emphasis>!</prosody>

**Critical Requirements:**
- Return ONLY the SSML-enhanced text
- Do NOT include explanations, markdown, or extra formatting
- Ensure all SSML tags are properly closed
- Make it sound natural and expressive, not robotic
- Balance enhancement with naturalness - don't overdo it

**Enhanced SSML output:**`;

      const enhanced = await window.spark.llm(prompt, "gpt-4o");
      return enhanced.trim();
    } catch (error) {
      console.error('Failed to enhance text with SSML:', error);
      return text;
    }
  };

  const startPerformanceSession = (game: string, gameType: PerformanceSession['gameType']) => {
    const newSession: PerformanceSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      game,
      gameType,
      metrics: [],
      averageAPM: 0,
      averageAccuracy: 0,
      maxCombo: 0,
      totalActions: 0,
      duration: 0,
    };
    setCurrentPerformanceSession(newSession);
    setIsPerformanceTracking(true);
    toast.success(`Performance tracking started for ${game}`);
  };

  const stopPerformanceSession = async () => {
    if (!currentPerformanceSession) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - currentPerformanceSession.startTime.getTime()) / 1000);
    
    const completedSession: PerformanceSession = {
      ...currentPerformanceSession,
      endTime,
      duration,
    };

    setPerformanceSessions((current) => [completedSession, ...(current || [])].slice(0, 100));
    
    await updateSkillProgress(completedSession);
    
    setIsPerformanceTracking(false);
    setCurrentPerformanceSession(null);
    setLatestPerformanceMetric(null);
    toast.success("Performance session saved");
  };

  const addPerformanceMetric = (metric: PerformanceMetric) => {
    if (!currentPerformanceSession) return;

    const updatedMetrics = [...currentPerformanceSession.metrics, metric];
    const totalAPM = updatedMetrics.reduce((sum, m) => sum + m.apm, 0);
    const totalAccuracy = updatedMetrics.reduce((sum, m) => sum + m.accuracy, 0);
    const maxCombo = Math.max(currentPerformanceSession.maxCombo, metric.combo);
    
    const updatedSession: PerformanceSession = {
      ...currentPerformanceSession,
      metrics: updatedMetrics,
      averageAPM: totalAPM / updatedMetrics.length,
      averageAccuracy: totalAccuracy / updatedMetrics.length,
      maxCombo,
      totalActions: currentPerformanceSession.totalActions + Math.floor(metric.apm / 3),
    };

    setCurrentPerformanceSession(updatedSession);
    setLatestPerformanceMetric(metric);

    if (updatedMetrics.length % 5 === 0) {
      analyzePerformanceAndCoach(updatedSession);
    }
  };

  const analyzePerformanceAndCoach = async (session: PerformanceSession) => {
    setIsAnalyzingPerformance(true);
    
    try {
      const recentMetrics = session.metrics.slice(-10);
      const avgAPM = recentMetrics.reduce((sum, m) => sum + m.apm, 0) / recentMetrics.length;
      const avgAccuracy = recentMetrics.reduce((sum, m) => sum + m.accuracy, 0) / recentMetrics.length;
      const avgCombo = recentMetrics.reduce((sum, m) => sum + m.combo, 0) / recentMetrics.length;

      const prompt = (window.spark.llmPrompt as any)`You are an expert gaming performance coach analyzing a player's metrics in ${session.game} (${session.gameType}).

**Current Performance:**
- Average APM: ${avgAPM.toFixed(1)}
- Average Accuracy: ${avgAccuracy.toFixed(1)}%
- Average Combo: ${avgCombo.toFixed(1)}
- Session Duration: ${Math.floor(session.metrics.length / 2)} minutes

**Analysis Task:**
Generate 1-3 actionable coaching suggestions to help improve their gameplay. Focus on the weakest areas.

Return as JSON:
{
  "suggestions": [
    {
      "category": "apm|accuracy|combo|strategy|positioning|timing|mechanics",
      "severity": "info|suggestion|warning|critical",
      "title": "Brief title",
      "message": "Clear explanation",
      "improvementTips": ["tip1", "tip2", "tip3"],
      "targetMetric": "metric name",
      "currentValue": ${avgAPM},
      "targetValue": target_number,
      "priority": 1-10
    }
  ]
}`;

      const response = await window.spark.llm(prompt, "gpt-4o", true);
      const parsed = JSON.parse(response);
      
      if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        const newSuggestions: AICoachingSuggestion[] = parsed.suggestions.map((s: any) => ({
          id: Date.now().toString() + Math.random(),
          timestamp: new Date(),
          category: s.category || 'strategy',
          severity: s.severity || 'suggestion',
          title: s.title,
          message: s.message,
          improvementTips: s.improvementTips || [],
          targetMetric: s.targetMetric,
          currentValue: s.currentValue,
          targetValue: s.targetValue,
          priority: s.priority || 5,
        }));

        setCoachingSuggestions((current) => [...newSuggestions, ...(current || [])].slice(0, 20));
      }
    } catch (error) {
      console.error('Failed to analyze performance:', error);
    } finally {
      setIsAnalyzingPerformance(false);
    }
  };

  const updateSkillProgress = async (session: PerformanceSession) => {
    const existingSkill = (skillProgress || []).find(s => s.game === session.game);

    const skillRating = calculateSkillRating(session);

    if (existingSkill) {
      const updatedSkill: SkillProgress = {
        ...existingSkill,
        sessionsPlayed: existingSkill.sessionsPlayed + 1,
        totalPlayTime: existingSkill.totalPlayTime + session.duration,
        averageAPM: (existingSkill.averageAPM * existingSkill.sessionsPlayed + session.averageAPM) / (existingSkill.sessionsPlayed + 1),
        averageAccuracy: (existingSkill.averageAccuracy * existingSkill.sessionsPlayed + session.averageAccuracy) / (existingSkill.sessionsPlayed + 1),
        maxCombo: Math.max(existingSkill.maxCombo, session.maxCombo),
        skillRating,
        trend: skillRating > existingSkill.skillRating ? 'improving' : skillRating < existingSkill.skillRating ? 'declining' : 'stable',
        lastPlayed: new Date(),
        milestones: updateMilestones(existingSkill.milestones, session),
      };

      setSkillProgress((current) => 
        (current || []).map(s => s.game === session.game ? updatedSkill : s)
      );
    } else {
      const newSkill: SkillProgress = {
        game: session.game,
        gameType: session.gameType,
        sessionsPlayed: 1,
        totalPlayTime: session.duration,
        averageAPM: session.averageAPM,
        averageAccuracy: session.averageAccuracy,
        maxCombo: session.maxCombo,
        skillRating,
        trend: 'stable',
        lastPlayed: new Date(),
        milestones: [
          { title: 'First Session', achieved: true, achievedAt: new Date() },
          { title: '50 APM Average', achieved: session.averageAPM >= 50 },
          { title: '100 APM Average', achieved: session.averageAPM >= 100 },
          { title: '60% Accuracy', achieved: session.averageAccuracy >= 60 },
          { title: '80% Accuracy', achieved: session.averageAccuracy >= 80 },
          { title: '10+ Combo', achieved: session.maxCombo >= 10 },
          { title: '50+ Combo', achieved: session.maxCombo >= 50 },
        ],
      };

      setSkillProgress((current) => [newSkill, ...(current || [])]);
    }
  };

  const calculateSkillRating = (session: PerformanceSession): number => {
    const apmScore = Math.min((session.averageAPM / 300) * 40, 40);
    const accuracyScore = (session.averageAccuracy / 100) * 40;
    const comboScore = Math.min((session.maxCombo / 100) * 20, 20);
    return Math.floor(apmScore + accuracyScore + comboScore);
  };

  const updateMilestones = (existing: SkillProgress['milestones'], session: PerformanceSession) => {
    return existing.map(m => {
      if (m.achieved) return m;
      
      if (m.title === '50 APM Average' && session.averageAPM >= 50) {
        return { ...m, achieved: true, achievedAt: new Date() };
      }
      if (m.title === '100 APM Average' && session.averageAPM >= 100) {
        return { ...m, achieved: true, achievedAt: new Date() };
      }
      if (m.title === '60% Accuracy' && session.averageAccuracy >= 60) {
        return { ...m, achieved: true, achievedAt: new Date() };
      }
      if (m.title === '80% Accuracy' && session.averageAccuracy >= 80) {
        return { ...m, achieved: true, achievedAt: new Date() };
      }
      if (m.title === '10+ Combo' && session.maxCombo >= 10) {
        return { ...m, achieved: true, achievedAt: new Date() };
      }
      if (m.title === '50+ Combo' && session.maxCombo >= 50) {
        return { ...m, achieved: true, achievedAt: new Date() };
      }
      
      return m;
    });
  };

  const generateSimulatedMetric = (skillLevel: number): PerformanceMetric => {
    const baseAPM = 50 + (skillLevel / 100) * 250;
    const baseAccuracy = 30 + (skillLevel / 100) * 65;
    const baseCombo = 3 + (skillLevel / 100) * 47;

    const variance = 0.15;
    
    return {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date(),
      apm: Math.max(0, baseAPM + (Math.random() - 0.5) * baseAPM * variance),
      accuracy: Math.max(0, Math.min(100, baseAccuracy + (Math.random() - 0.5) * baseAccuracy * variance)),
      combo: Math.max(0, Math.floor(baseCombo + (Math.random() - 0.5) * baseCombo * variance)),
      reactionTime: Math.max(100, 500 - (skillLevel / 100) * 300 + (Math.random() - 0.5) * 100),
      decisionsPerMinute: Math.max(10, 20 + (skillLevel / 100) * 80 + (Math.random() - 0.5) * 20),
    };
  };

  const togglePerformanceSimulation = () => {
    if (performanceSimulationInterval) {
      clearInterval(performanceSimulationInterval);
      setPerformanceSimulationInterval(null);
      toast.info('Performance simulation stopped');
    } else {
      const interval = setInterval(() => {
        const metric = generateSimulatedMetric(simulationSkillLevel);
        addPerformanceMetric(metric);
      }, 2000 / simulationSpeed);
      
      setPerformanceSimulationInterval(interval);
      toast.success('Performance simulation started');
    }
  };

  const handleTogglePerformanceTracking = () => {
    if (isPerformanceTracking) {
      if (performanceSimulationInterval) {
        clearInterval(performanceSimulationInterval);
        setPerformanceSimulationInterval(null);
      }
      stopPerformanceSession();
    } else {
      toast.error('Please configure a session first');
    }
  };

  const dismissCoachingSuggestion = (id: string) => {
    setCoachingSuggestions((current) => (current || []).filter(s => s.id !== id));
  };

  const clearAllCoachingSuggestions = () => {
    setCoachingSuggestions(() => []);
    toast.success('All suggestions cleared');
  };

  const handleQuickAction = (template: string) => {
    if (isMonitoring || isSimulating) {
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '_quick',
        content: template,
        sender: 'ai',
        timestamp: new Date(),
        platform: 'simulator',
      };
      setLiveMessages((current) => [...(current || []), aiMessage]);
    } else {
      toast.info('Start monitoring or simulation to send messages');
    }
  };

  const handleCustomQuickAction = async (text: string) => {
    handleQuickAction(text);
  };

  const handleCreateGoal = (goal: Omit<StreamGoal, "id" | "createdAt" | "completed" | "completedAt">) => {
    const newGoal: StreamGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date(),
      completed: false,
    };
    setStreamGoals((current) => [newGoal, ...(current || [])]);
  };

  const handleUpdateGoalProgress = (goalId: string, newValue: number) => {
    setStreamGoals((current) =>
      (current || []).map((g) =>
        g.id === goalId ? { ...g, currentValue: newValue } : g
      )
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setStreamGoals((current) => (current || []).filter((g) => g.id !== goalId));
  };

  const handleCompleteGoal = (goalId: string) => {
    setStreamGoals((current) =>
      (current || []).map((g) =>
        g.id === goalId ? { ...g, completed: true, completedAt: new Date() } : g
      )
    );
  };

  const handleHighlightDetected = (highlight: StreamHighlight) => {
    setStreamHighlights((current) => [highlight, ...(current || [])].slice(0, 100));
  };

  const handleEngagementGameMessage = (content: string) => {
    if (isMonitoring || isSimulating) {
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '_game',
        content,
        sender: 'ai',
        timestamp: new Date(),
        platform: 'simulator',
      };
      setLiveMessages((current) => [...(current || []), aiMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        </div>
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.65_0.25_300_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.65_0.25_300_/_0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.65_0.25_300_/_0.05),transparent_70%)]" />
        
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <circle cx="100" cy="100" r="2" fill="oklch(0.65 0.25 300)" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="50" r="1.5" fill="oklch(0.75 0.24 340)" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="150" cy="150" r="1.5" fill="oklch(0.70 0.20 240)" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="5s" repeatCount="indefinite" />
              </circle>
              <line x1="100" y1="100" x2="50" y2="50" stroke="oklch(0.65 0.25 300)" strokeWidth="0.5" opacity="0.2" />
              <line x1="100" y1="100" x2="150" y2="150" stroke="oklch(0.65 0.25 300)" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
        
        <div className="absolute top-1/4 left-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-scanning" />
        <div className="absolute top-1/3 right-1/4 w-1 h-24 bg-gradient-to-b from-transparent via-accent/20 to-transparent animate-scanning" style={{ animationDelay: '2s', animationDuration: '8s' }} />
      </div>
      
      <div className="relative z-10">
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-glow">
                  <Robot size={24} weight="bold" className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">AI Streamer Companion</h1>
                  <p className="text-sm text-muted-foreground">Development Tool & Simulator • Powered by Gemini 3</p>
                </div>
              </div>
              <Badge className="bg-accent/20 text-accent border-accent/30 hover:bg-accent/30 px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
                Simulation Ready
              </Badge>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="space-y-4">
              <div className="relative max-w-md">
                <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tabs (e.g., 'voice', 'chat', 'performance')..."
                  value={tabSearchQuery}
                  onChange={(e) => setTabSearchQuery(e.target.value)}
                  className="pl-10 bg-card/50 backdrop-blur-sm border-border/50"
                />
              </div>

              <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-card/50 backdrop-blur-sm p-3">
                {[
                  { value: "home", icon: House, label: "Home" },
                  { value: "deploy", icon: Rocket, label: "Deploy 24/7", badge: "NEW" },
                  { value: "backend", icon: PlugsConnected, label: "Backend Server", badge: isBackendConnected ? "Connected" : "Disconnected" },
                  { value: "support", icon: Headset, label: "AI Support" },
                  { value: "monitor", icon: Broadcast, label: "Live Monitor" },
                  { value: "personality", icon: Robot, label: "Personality" },
                  { value: "voice", icon: SpeakerHigh, label: "Voice & SSML" },
                  { value: "vision", icon: Eye, label: "Vision AI" },
                  { value: "performance", icon: Trophy, label: "Performance" },
                  { value: "quick-actions", icon: Lightning, label: "Quick Actions" },
                  { value: "stream-goals", icon: Target, label: "Stream Goals" },
                  { value: "engagement-games", icon: GameController, label: "Engagement Games" },
                  { value: "highlights", icon: Sparkle, label: "Highlights" },
                  { value: "chat", icon: ChatCircle, label: "Chat Test" },
                  { value: "sentiment", icon: Smiley, label: "Sentiment" },
                  { value: "analytics", icon: ChartLine, label: "Analytics" },
                  { value: "responses", icon: Lightning, label: "AI Responses" },
                  { value: "templates", icon: ListChecks, label: "Templates" },
                  { value: "commands", icon: Terminal, label: "Commands" },
                  { value: "polls", icon: Question, label: "Polls" },
                  { value: "platforms", icon: LinkIcon, label: "Platforms" },
                  { value: "settings", icon: GearSix, label: "Stream Settings" },
                ].filter(tab => 
                  tabSearchQuery === "" || 
                  tab.label.toLowerCase().includes(tabSearchQuery.toLowerCase()) ||
                  tab.value.toLowerCase().includes(tabSearchQuery.toLowerCase())
                ).map((tab) => (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value} 
                    className="gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative"
                  >
                    <tab.icon size={18} weight="bold" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <Badge 
                        className={`ml-2 text-[10px] px-1.5 py-0 ${
                          tab.badge === "NEW"
                            ? 'bg-accent/30 text-accent border-accent/40'
                            : isBackendConnected 
                            ? 'bg-accent/30 text-accent border-accent/40' 
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        {tab.badge}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabSearchQuery && (
                <p className="text-sm text-muted-foreground px-2">
                  Showing {[
                    "home", "deploy", "backend", "support", "monitor", "personality", "voice", "vision", "performance",
                    "quick-actions", "stream-goals", "engagement-games", "highlights",
                    "chat", "sentiment", "analytics", "responses", "templates",
                    "commands", "polls", "platforms", "settings"
                  ].filter(value => 
                    value.toLowerCase().includes(tabSearchQuery.toLowerCase()) ||
                    ["Home", "Deploy 24/7", "Backend Server", "AI Support", "Live Monitor", "Personality", "Voice & SSML", "Vision AI", "Performance",
                     "Quick Actions", "Stream Goals", "Engagement Games", "Highlights",
                     "Chat Test", "Sentiment", "Analytics", "AI Responses", "Templates",
                     "Commands", "Polls", "Platforms", "Stream Settings"]
                    .find((_, i) => ["home", "deploy", "backend", "support", "monitor", "personality", "voice", "vision", "performance",
                                    "quick-actions", "stream-goals", "engagement-games", "highlights",
                                    "chat", "sentiment", "analytics", "responses", "templates",
                                    "commands", "polls", "platforms", "settings"][i] === value)
                    ?.toLowerCase().includes(tabSearchQuery.toLowerCase())
                  ).length} tabs matching "{tabSearchQuery}"
                </p>
              )}
            </div>

            <TabsContent value="home" className="space-y-6">
              <Alert className="bg-gradient-to-r from-accent/20 via-primary/20 to-secondary/20 border-accent/40 animate-pulse-glow">
                <Rocket size={20} className="text-accent" />
                <AlertDescription className="text-sm">
                  <strong className="text-accent">NEW: Deploy Your Backend 24/7!</strong> Get your AI Streamer running continuously in the cloud. Railway offers free tier with no sleep mode. Check the <strong>Deploy 24/7</strong> tab for step-by-step guides!
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                  onClick={() => setActiveTab("deploy")}
                  className="group cursor-pointer bg-gradient-to-br from-accent/20 to-primary/10 border-2 border-accent/40 rounded-lg p-6 hover:border-accent/60 transition-all hover:shadow-lg hover:shadow-accent/20 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full -mr-8 -mt-8" />
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className="p-3 rounded-full bg-accent/30 group-hover:bg-accent/40 transition-colors animate-pulse">
                      <Rocket size={24} weight="bold" className="text-accent" />
                    </div>
                    <h3 className="font-bold text-lg">Deploy Backend 24/7</h3>
                  </div>
                  <p className="text-sm text-muted-foreground relative z-10">
                    Deploy your backend to Railway or Heroku for continuous 24/7 streaming operation
                  </p>
                  <div className="flex gap-2 mt-3 relative z-10">
                    <Badge className="bg-accent/30 text-accent border-accent/40">
                      NEW ✨
                    </Badge>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      Free Tier
                    </Badge>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab("support")}
                  className="group cursor-pointer bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-lg p-6 hover:border-secondary/40 transition-all hover:shadow-lg hover:shadow-secondary/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-secondary/20 group-hover:bg-secondary/30 transition-colors">
                      <Headset size={24} weight="bold" className="text-secondary" />
                    </div>
                    <h3 className="font-bold text-lg">AI Support</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get instant help with voice, text, file uploads, and smart recommendations
                  </p>
                  <Badge className="mt-3 bg-accent/20 text-accent border-accent/30">
                    Always Available
                  </Badge>
                </div>

                <div 
                  onClick={() => setActiveTab("backend")}
                  className="group cursor-pointer bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-6 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-accent/20 group-hover:bg-accent/30 transition-colors">
                      <PlugsConnected size={24} weight="bold" className="text-accent" />
                    </div>
                    <h3 className="font-bold text-lg">Backend Server</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connect to backend server for REAL Twitch/YouTube chat integration
                  </p>
                  <Badge className={`mt-3 ${isBackendConnected ? 'bg-accent/20 text-accent border-accent/30' : 'bg-muted text-muted-foreground'}`}>
                    {isBackendConnected ? 'Connected' : 'Not Connected'}
                  </Badge>
                </div>

                <div 
                  onClick={() => setActiveTab("monitor")}
                  className="group cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <Broadcast size={24} weight="bold" className="text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Live Monitor</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Monitor live chat with AI responses, avatar reactions, and sentiment analysis
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab("personality")}
                  className="group cursor-pointer bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-6 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-accent/20 group-hover:bg-accent/30 transition-colors">
                      <Robot size={24} weight="bold" className="text-accent" />
                    </div>
                    <h3 className="font-bold text-lg">Personality</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Configure AI personality, tone, interests, and avatar appearance
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab("voice")}
                  className="group cursor-pointer bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-lg p-6 hover:border-secondary/40 transition-all hover:shadow-lg hover:shadow-secondary/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-secondary/20 group-hover:bg-secondary/30 transition-colors">
                      <SpeakerHigh size={24} weight="bold" className="text-secondary" />
                    </div>
                    <h3 className="font-bold text-lg">Voice & SSML</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Configure text-to-speech, SSML, and AI-enhanced voice expressiveness
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab("vision")}
                  className="group cursor-pointer bg-gradient-to-br from-chart-2/10 to-chart-2/5 border border-chart-2/20 rounded-lg p-6 hover:border-chart-2/40 transition-all hover:shadow-lg hover:shadow-chart-2/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-chart-2/20 group-hover:bg-chart-2/30 transition-colors">
                      <Eye size={24} weight="bold" className="text-chart-2" />
                    </div>
                    <h3 className="font-bold text-lg">Vision AI</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Analyze gameplay with Gemini Vision and generate automatic commentary
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab("performance")}
                  className="group cursor-pointer bg-gradient-to-br from-chart-5/10 to-chart-5/5 border border-chart-5/20 rounded-lg p-6 hover:border-chart-5/40 transition-all hover:shadow-lg hover:shadow-chart-5/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-chart-5/20 group-hover:bg-chart-5/30 transition-colors">
                      <Trophy size={24} weight="bold" className="text-chart-5" />
                    </div>
                    <h3 className="font-bold text-lg">Performance</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track gameplay metrics (APM, accuracy, combos) with AI coaching
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab("quick-actions")}
                  className="group cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <Lightning size={24} weight="bold" className="text-primary" />
                    </div>
                    <h3 className="font-bold text-lg">Quick Actions</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    One-click preset messages for common stream moments
                  </p>
                  <Badge className="mt-3 bg-primary/20 text-primary border-primary/30">
                    NEW ✨
                  </Badge>
                </div>

                <div 
                  onClick={() => setActiveTab("stream-goals")}
                  className="group cursor-pointer bg-gradient-to-br from-chart-1/10 to-chart-1/5 border border-chart-1/20 rounded-lg p-6 hover:border-chart-1/40 transition-all hover:shadow-lg hover:shadow-chart-1/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-chart-1/20 group-hover:bg-chart-1/30 transition-colors">
                      <Target size={24} weight="bold" className="text-chart-1" />
                    </div>
                    <h3 className="font-bold text-lg">Stream Goals</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track follower milestones and custom achievements
                  </p>
                  <Badge className="mt-3 bg-accent/20 text-accent border-accent/30">
                    NEW ✨
                  </Badge>
                </div>

                <div 
                  onClick={() => setActiveTab("engagement-games")}
                  className="group cursor-pointer bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-6 hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-accent/20 group-hover:bg-accent/30 transition-colors">
                      <GameController size={24} weight="bold" className="text-accent" />
                    </div>
                    <h3 className="font-bold text-lg">Engagement Games</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Interactive trivia, predictions, and challenges for viewers
                  </p>
                  <Badge className="mt-3 bg-accent/20 text-accent border-accent/30">
                    NEW ✨
                  </Badge>
                </div>

                <div 
                  onClick={() => setActiveTab("highlights")}
                  className="group cursor-pointer bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-lg p-6 hover:border-secondary/40 transition-all hover:shadow-lg hover:shadow-secondary/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-secondary/20 group-hover:bg-secondary/30 transition-colors">
                      <Sparkle size={24} weight="bold" className="text-secondary" />
                    </div>
                    <h3 className="font-bold text-lg">Highlights Detector</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AI-powered detection of exciting moments and clip-worthy content
                  </p>
                  <Badge className="mt-3 bg-secondary/20 text-secondary border-secondary/30">
                    NEW ✨
                  </Badge>
                </div>

                <div 
                  onClick={() => setActiveTab("analytics")}
                  className="group cursor-pointer bg-gradient-to-br from-chart-1/10 to-chart-1/5 border border-chart-1/20 rounded-lg p-6 hover:border-chart-1/40 transition-all hover:shadow-lg hover:shadow-chart-1/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-full bg-chart-1/20 group-hover:bg-chart-1/30 transition-colors">
                      <ChartLine size={24} weight="bold" className="text-chart-1" />
                    </div>
                    <h3 className="font-bold text-lg">Analytics</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    View detailed chat analytics, engagement metrics, and trends
                  </p>
                </div>
              </div>

              <Alert className="bg-accent/10 border-accent/30">
                <Info size={20} className="text-accent" />
                <AlertDescription className="text-sm">
                  <strong className="text-accent">Getting Started:</strong> New here? Check out <strong>AI Support</strong> for instant help! Connect the <strong>Backend Server</strong> tab to enable REAL Twitch/YouTube chat, or use the <strong>Live Monitor</strong> tab for simulation mode. The AI companion features voice, emotions, and gameplay commentary powered by Gemini 3.
                </AlertDescription>
              </Alert>

              <TwitchIntegrationGuide />
            </TabsContent>

            <TabsContent value="deploy" className="space-y-6">
              <DeploymentGuide />
            </TabsContent>

            <TabsContent value="backend" className="space-y-6">
              <BackendConnection 
                onConnectionChange={(connected) => setIsBackendConnected(connected)}
              />
              <TwitchChatTester 
                isConnected={isBackendConnected}
                twitchChannel={twitchConnection?.channelId || 'michaelinzo'}
              />
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              <Alert className="bg-accent/10 border-accent/30">
                <Headset size={20} className="text-accent" />
                <AlertDescription className="text-sm">
                  <strong className="text-accent">AI Support Assistant:</strong> Get instant help with setup, troubleshooting, and feature questions. Supports text, voice messages, and file uploads. Your conversation is saved and you'll get smart recommendations!
                </AlertDescription>
              </Alert>
              
              <div className="h-[700px]">
                <AISupportChatbox
                  initialMessages={supportChatMessages || []}
                  onSendMessage={(message) => {
                    setSupportChatMessages((current) => [...(current || []), message]);
                  }}
                  autoRecommendations={true}
                  enableVoice={true}
                  enableFileUpload={true}
                  className="h-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="setup" className="space-y-6">
              <Alert className="bg-accent/10 border-accent/30">
                <Info size={20} className="text-accent" />
                <AlertDescription className="text-sm">
                  <strong className="text-accent">Ready to test!</strong> This is a fully functional AI companion simulator. Use the <strong>Monitor</strong> tab to enable chat simulation and see your AI respond in real-time with voice, emotions, and gameplay commentary.
                </AlertDescription>
              </Alert>
              <TwitchIntegrationGuide />
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Alert className="bg-primary/10 border-primary/30">
                <Trophy size={20} className="text-primary" />
                <AlertDescription className="text-sm">
                  <strong className="text-primary">Performance Tracking:</strong> Track your gameplay metrics including APM (Actions Per Minute), accuracy, combos, and get AI-powered coaching suggestions to improve your skills.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <PerformanceMetricsTracker
                    isTracking={isPerformanceTracking}
                    onToggleTracking={handleTogglePerformanceTracking}
                    currentSession={currentPerformanceSession}
                    latestMetric={latestPerformanceMetric || undefined}
                  />
                  <AICoachingPanel
                    suggestions={coachingSuggestions || []}
                    onDismiss={dismissCoachingSuggestion}
                    onClearAll={clearAllCoachingSuggestions}
                    isAnalyzing={isAnalyzingPerformance}
                  />
                </div>
                <div className="space-y-6">
                  <PerformanceSessionManager
                    onStartSession={startPerformanceSession}
                    isTracking={isPerformanceTracking}
                  />
                  <PerformanceSimulator
                    isSimulating={!!performanceSimulationInterval}
                    onToggleSimulation={togglePerformanceSimulation}
                    simulationSpeed={simulationSpeed}
                    onSpeedChange={setSimulationSpeed}
                    skillLevel={simulationSkillLevel}
                    onSkillLevelChange={setSimulationSkillLevel}
                  />
                </div>
              </div>

              <SkillProgressDashboard skillData={skillProgress || []} />
            </TabsContent>

            <TabsContent value="voice" className="space-y-6">
              <VoiceSettingsConfig
                settings={currentVoiceSettings}
                onUpdate={setVoiceSettings}
                availableVoices={availableVoices}
                onTestVoice={handleTestVoice}
                isSupported={isSupported}
              />
              <SSMLInfoCard />
              <SSMLEditor
                onSpeak={async (text) => {
                  setAvatarSpeaking(true);
                  setAvatarEmotion("happy");
                  setCurrentSpeechText(text);
                  await speak(text, setAvatarCurrentPhoneme);
                  setTimeout(() => {
                    setAvatarSpeaking(false);
                    setAvatarEmotion("neutral");
                    setCurrentSpeechText("");
                  }, 500);
                }}
                isSpeaking={avatarSpeaking}
                onStop={stop}
                ssmlEnabled={currentVoiceSettings.enableSSML ?? true}
                onToggleSSML={(enabled) => setVoiceSettings((current) => ({ 
                  ...currentVoiceSettings,
                  ...current,
                  enableSSML: enabled 
                }))}
              />
              <AutoSSMLEnhancer onEnhance={enhanceTextWithSSML} />
            </TabsContent>

            <TabsContent value="vision" className="space-y-6">
              <Alert className="bg-primary/10 border-primary/30">
                <Eye size={20} className="text-primary" />
                <AlertDescription className="text-sm">
                  <strong className="text-primary">Vision AI Features:</strong> Upload screenshots or videos for instant analysis, or use automated gameplay vision. Get AI-powered commentary suggestions, detected elements, and streamer response ideas.
                </AlertDescription>
              </Alert>
              
              <VideoAnalyzer 
                onAnalysisComplete={(result) => {
                  setVideoAnalyses((current) => [result, ...(current || [])].slice(0, 50));
                  toast.success('Video analysis complete!');
                }}
                maxFileSizeMB={100}
                frameInterval={2}
                maxFrames={30}
              />
              
              <ScreenshotAnalyzer 
                onAnalysisComplete={(analysis) => {
                  toast.success('Screenshot analysis complete!');
                  if (analysis.analysis.suggestedResponse) {
                    console.log('Suggested response:', analysis.analysis.suggestedResponse);
                  }
                }}
              />
              
              <VisionStatsCard 
                analyses={gameplayAnalyses || []}
                isActive={visionSettings?.enabled || false}
              />
              <VisionSettingsConfig 
                settings={visionSettings || defaultVisionSettings}
                onUpdate={setVisionSettings}
              />
              <GameplayVisionAnalyzer 
                settings={visionSettings || defaultVisionSettings}
                onAnalysisComplete={handleGameplayAnalysis}
                onCommentaryGenerated={handleVisionCommentary}
              />
              <CommentaryHistory 
                analyses={gameplayAnalyses || []}
                onClear={() => setGameplayAnalyses(() => [])}
              />
            </TabsContent>

            <TabsContent value="monitor" className="space-y-6">
              <SystemStatusCard 
                hasConnections={!!(twitchConnection?.isConnected || youtubeConnection?.isConnected)}
                isSimulating={isSimulating}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <LiveMonitor
                    messages={liveMessages || []}
                    twitchConnection={twitchConnection || null}
                    youtubeConnection={youtubeConnection || null}
                    isMonitoring={isMonitoring}
                    onToggleMonitoring={handleToggleMonitoring}
                    stats={liveStats}
                  />
                  <ChatSimulation
                    onSimulateMessage={handleSimulateMessage}
                    isRunning={isSimulating}
                    onToggle={handleToggleSimulation}
                    messageRate={chatSimulationRate}
                    onRateChange={handleChatRateChange}
                  />
                </div>
                <div className="space-y-6">
                  <VTuberAvatar
                    personality={currentPersonality}
                    isLive={isMonitoring || isSimulating}
                    isSpeaking={avatarSpeaking}
                    emotion={avatarEmotion}
                    speechText={currentSpeechText}
                    skin={currentPersonality.avatarSkin || 'default'}
                    sentiment={currentSentiment}
                    onPhonemeChange={setAvatarCurrentPhoneme}
                    onEmotionChange={(emotion, intensity) => {
                      setAvatarCurrentEmotion(emotion);
                      setAvatarEmotionIntensity(intensity);
                    }}
                  />
                  <VoiceActivityMonitor 
                    speechState={speechState}
                    isEnabled={currentVoiceSettings.enabled}
                  />
                  <CommentarySyncMonitor
                    isSpeaking={avatarSpeaking}
                    currentPhoneme={avatarCurrentPhoneme}
                    currentEmotion={avatarCurrentEmotion}
                    emotionIntensity={avatarEmotionIntensity}
                    speechText={currentSpeechText}
                  />
                  <SentimentMonitor
                    messages={liveMessages || []}
                    isLive={isMonitoring || isSimulating}
                  />
                  <EngagementScore
                    messages={liveMessages || []}
                    isLive={isMonitoring || isSimulating}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SentimentTrendChart messages={liveMessages || []} />
                <EmotionDetection messages={liveMessages || []} />
              </div>

              <SentimentInsights messages={liveMessages || []} />
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SentimentMonitor
                  messages={[...(messages || []), ...(liveMessages || [])]}
                  isLive={isMonitoring}
                />
                <EngagementScore
                  messages={[...(messages || []), ...(liveMessages || [])]}
                  isLive={isMonitoring}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SentimentTrendChart messages={[...(messages || []), ...(liveMessages || [])]} />
                <EmotionDetection messages={[...(messages || []), ...(liveMessages || [])]} />
              </div>

              <SentimentInsights messages={[...(messages || []), ...(liveMessages || [])]} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsDashboard messages={[...(messages || []), ...(liveMessages || [])]} />
            </TabsContent>

            <TabsContent value="platforms" className="space-y-6">
              <Alert className="bg-destructive/10 border-destructive/30">
                <Info size={20} className="text-destructive" />
                <AlertDescription className="text-sm">
                  <strong className="text-destructive">Backend Required:</strong> This stores your platform credentials, but live chat integration requires a separate backend server. See <strong>QUICK_START.md</strong> or <strong>BACKEND_DEPLOYMENT_GUIDE.md</strong> for complete setup instructions with working code.
                </AlertDescription>
              </Alert>
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

            <TabsContent value="quick-actions" className="space-y-6">
              <QuickActionsPanel
                onActionClick={handleQuickAction}
                onCustomAction={handleCustomQuickAction}
              />
            </TabsContent>

            <TabsContent value="stream-goals" className="space-y-6">
              <Alert className="bg-primary/10 border-primary/30">
                <Target size={20} className="text-primary" />
                <AlertDescription className="text-sm">
                  <strong className="text-primary">Track Your Progress:</strong> Set and achieve streaming milestones! Track follower goals, subscriber targets, and custom achievements to stay motivated and celebrate wins with your community.
                </AlertDescription>
              </Alert>
              <StreamGoals
                goals={streamGoals || []}
                onCreateGoal={handleCreateGoal}
                onUpdateProgress={handleUpdateGoalProgress}
                onDeleteGoal={handleDeleteGoal}
                onCompleteGoal={handleCompleteGoal}
              />
            </TabsContent>

            <TabsContent value="engagement-games" className="space-y-6">
              <Alert className="bg-accent/10 border-accent/30">
                <GameController size={20} className="text-accent" />
                <AlertDescription className="text-sm">
                  <strong className="text-accent">Boost Engagement:</strong> Launch interactive games in chat! Run trivia, predictions, word challenges, and reaction tests to keep your viewers engaged and entertained.
                </AlertDescription>
              </Alert>
              <ViewerEngagementGames
                messages={liveMessages || []}
                onSendMessage={handleEngagementGameMessage}
                isLive={isMonitoring || isSimulating}
              />
            </TabsContent>

            <TabsContent value="highlights" className="space-y-6">
              <Alert className="bg-accent/10 border-accent/30">
                <Sparkle size={20} className="text-accent" />
                <AlertDescription className="text-sm">
                  <strong className="text-accent">Never Miss a Moment:</strong> AI automatically detects exciting stream moments based on chat activity, sentiment spikes, and key events. Perfect for finding clip-worthy content!
                </AlertDescription>
              </Alert>
              <StreamHighlightsDetector
                messages={liveMessages || []}
                isLive={isMonitoring || isSimulating}
                onHighlightDetected={handleHighlightDetected}
              />
            </TabsContent>

            <TabsContent value="personality" className="space-y-6">
              <PersonalityConfig personality={currentPersonality} onUpdate={setPersonality} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <Toaster position="bottom-right" />
      {!showFloatingSupport && activeTab !== "support" && (
        <button
          onClick={() => setShowFloatingSupport(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-accent to-secondary shadow-2xl hover:shadow-accent/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-pulse-glow"
          aria-label="Open AI Support"
        >
          <Headset size={28} weight="bold" className="text-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full animate-pulse" />
        </button>
      )}
      
      {showFloatingSupport && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-card/95 backdrop-blur-xl border-2 border-accent/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-in">
          <div className="bg-gradient-to-r from-accent to-secondary p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Headset size={20} weight="bold" className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">AI Support Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setShowFloatingSupport(false)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center transition-colors"
              aria-label="Close support"
            >
              <span className="text-white text-lg font-bold">×</span>
            </button>
          </div>
          
          <div className="flex-1 min-h-0">
            <AISupportChatbox
              initialMessages={supportChatMessages || []}
              onSendMessage={(message) => {
                setSupportChatMessages((current) => [...(current || []), message]);
              }}
              autoRecommendations={true}
              enableVoice={true}
              enableFileUpload={true}
              className="h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;