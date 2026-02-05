import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PaperPlaneRight,
  Microphone,
  Image as ImageIcon,
  Video,
  File as FileIcon,
  X,
  ArrowDown,
  Lightbulb,
  Stop,
  DotsThree,
  SmileyWink,
  ThumbsUp,
  Star,
  ArrowCounterClockwise,
  Download,
  Play,
  Pause,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { SupportChatMessage, SupportChatRecommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AISupportChatboxProps {
  onSendMessage?: (message: SupportChatMessage) => void;
  initialMessages?: SupportChatMessage[];
  autoRecommendations?: boolean;
  enableVoice?: boolean;
  enableFileUpload?: boolean;
  className?: string;
}

export function AISupportChatbox({
  onSendMessage,
  initialMessages = [],
  autoRecommendations = true,
  enableVoice = true,
  enableFileUpload = true,
  className,
}: AISupportChatboxProps) {
  const [messages, setMessages] = useState<SupportChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [recommendations, setRecommendations] = useState<SupportChatRecommendation[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && autoRecommendations) {
      generateRecommendations();
    }
  }, [messages, autoRecommendations]);

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
    setShowScrollButton(false);
  };

  const handleScroll = () => {
    if (scrollViewportRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollViewportRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    const viewport = scrollViewportRef.current;
    if (viewport) {
      viewport.addEventListener('scroll', handleScroll);
      return () => viewport.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const context = messages
        .slice(-5)
        .map((m) => `${m.sender}: ${m.content}`)
        .join("\n");

      const prompt = (window.spark.llmPrompt as any)`You are a friendly and helpful AI support assistant for the AI Streamer Companion application. You help users with:
- Setting up their streaming bot
- Connecting to Twitch/YouTube
- Configuring personality and voice settings
- Troubleshooting issues
- Understanding features like Vision AI, Performance Tracking, and SSML

User's message: "${userMessage}"

Recent context:
${context}

Provide a helpful, concise, and friendly response. If the user has a technical issue, provide step-by-step guidance. If they're asking about features, explain clearly with examples.

Keep your response under 3 sentences unless detailed steps are needed.`;

      const response = await window.spark.llm(prompt, "gpt-4o");
      return response.trim();
    } catch (error) {
      console.error("Failed to generate AI response:", error);
      return "I'm having trouble connecting right now. Please try again in a moment!";
    }
  };

  const generateRecommendations = async () => {
    try {
      const recentMessages = messages.slice(-3).map((m) => m.content).join(" | ");
      
      const prompt = (window.spark.llmPrompt as any)`Based on this support chat conversation, generate 3 quick action recommendations or helpful suggestions:

Recent messages: "${recentMessages}"

Return as JSON:
{
  "recommendations": [
    {
      "text": "short actionable suggestion",
      "category": "setup|troubleshooting|feature|best-practice|general",
      "priority": 1-5
    }
  ]
}`;

      const response = await window.spark.llm(prompt, "gpt-4o", true);
      const parsed = JSON.parse(response);
      
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        const newRecs: SupportChatRecommendation[] = parsed.recommendations.map((r: any) => ({
          id: Date.now().toString() + Math.random(),
          text: r.text,
          category: r.category || 'general',
          priority: r.priority || 3,
        }));
        setRecommendations(newRecs);
      }
    } catch (error) {
      console.error("Failed to generate recommendations:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedFile) return;

    const userMessage: SupportChatMessage = {
      id: Date.now().toString(),
      content: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
      type: selectedFile ? getFileType(selectedFile) : "text",
      fileName: selectedFile?.name,
      fileSize: selectedFile?.size,
      status: "sent",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setSelectedFile(null);
    onSendMessage?.(userMessage);

    setIsTyping(true);

    setTimeout(async () => {
      const aiResponse = await generateAIResponse(userMessage.content);
      const aiMessage: SupportChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "support",
        timestamp: new Date(),
        type: "text",
        status: "delivered",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getFileType = (file: File): SupportChatMessage['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'file';
  };

  const handleFileSelect = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    setSelectedFile(file);
    setUploadingFile(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadingFile(false);
          toast.success(`${file.name} ready to send`);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const voiceMessage: SupportChatMessage = {
          id: Date.now().toString(),
          content: `Voice message (${recordingDuration}s)`,
          sender: "user",
          timestamp: new Date(),
          type: "audio",
          fileUrl: audioUrl,
          voiceRecording: true,
          duration: recordingDuration,
          status: "sent",
        };

        setMessages((prev) => [...prev, voiceMessage]);
        onSendMessage?.(voiceMessage);
        
        stream.getTracks().forEach(track => track.stop());
        setRecordingDuration(0);

        toast.success("Voice message sent!");
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      toast.success("Recording started");
    } catch (error) {
      toast.error("Failed to access microphone");
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const handleRecommendationClick = (recommendation: SupportChatRecommendation) => {
    setInputText(recommendation.text);
    setShowRecommendations(false);
  };

  const togglePlayAudio = (messageId: string, audioUrl: string) => {
    if (playingAudio === messageId) {
      setPlayingAudio(null);
    } else {
      const audio = new Audio(audioUrl);
      audio.play();
      setPlayingAudio(messageId);
      audio.onended = () => setPlayingAudio(null);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="border-b border-border/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <SmileyWink size={20} weight="bold" className="text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Support Assistant</CardTitle>
              <CardDescription className="text-xs">
                Always here to help • Response time ~2s
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-accent/20 text-accent border-accent/30">
            <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
            Online
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
        {showRecommendations && recommendations.length > 0 && (
          <div className="p-4 border-b border-border/50 bg-muted/30 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lightbulb size={16} className="text-accent" weight="bold" />
                Quick Actions
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRecommendations(false)}
                className="h-6 w-6 p-0"
              >
                <X size={14} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendations.map((rec) => (
                <Button
                  key={rec.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleRecommendationClick(rec)}
                  className="text-xs h-7"
                >
                  {rec.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 relative min-h-0 overflow-hidden">
          <div 
            ref={scrollViewportRef}
            className="h-full overflow-y-auto p-4 chat-scrollbar"
          >
            <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Welcome to Support! 👋</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    I'm your AI assistant. Ask me anything about setting up your stream,
                    connecting platforms, or using features!
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {[
                    "How do I connect to Twitch?",
                    "Set up voice settings",
                    "What is Vision AI?",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputText(suggestion)}
                      className="text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-slide-in",
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback
                    className={cn(
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    )}
                  >
                    {message.sender === "user" ? "U" : "AI"}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    "flex flex-col gap-1 max-w-[80%]",
                    message.sender === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg p-3 shadow-sm",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    )}
                  >
                    {message.type === "text" && (
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    )}

                    {message.type === "image" && (
                      <div className="space-y-2">
                        <div className="w-48 h-32 bg-muted/50 rounded flex items-center justify-center">
                          <ImageIcon size={32} className="text-muted-foreground" />
                        </div>
                        {message.content && (
                          <p className="text-sm">{message.content}</p>
                        )}
                      </div>
                    )}

                    {message.type === "video" && (
                      <div className="space-y-2">
                        <div className="w-56 h-32 bg-muted/50 rounded flex items-center justify-center">
                          <Video size={32} className="text-muted-foreground" />
                        </div>
                        {message.content && (
                          <p className="text-sm">{message.content}</p>
                        )}
                      </div>
                    )}

                    {message.type === "audio" && message.fileUrl && (
                      <div className="flex items-center gap-2 min-w-[200px]">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePlayAudio(message.id, message.fileUrl!)}
                          className="h-8 w-8 p-0"
                        >
                          {playingAudio === message.id ? (
                            <Pause size={16} weight="fill" />
                          ) : (
                            <Play size={16} weight="fill" />
                          )}
                        </Button>
                        <div className="flex-1">
                          <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-current w-0 transition-all" />
                          </div>
                          <p className="text-xs mt-1 opacity-70">
                            {message.duration}s
                          </p>
                        </div>
                      </div>
                    )}

                    {message.type === "file" && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-muted/50 flex items-center justify-center">
                          <FileIcon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {message.fileName}
                          </p>
                          <p className="text-xs opacity-70">
                            {formatFileSize(message.fileSize)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 px-1">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.status && message.sender === "user" && (
                      <Badge variant="outline" className="text-[10px] h-4 px-1">
                        {message.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 animate-slide-in">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-card border border-border rounded-lg p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" />
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-typing"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-typing"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {showScrollButton && (
          <div className="absolute bottom-28 right-8 z-10">
            <Button
              size="sm"
              onClick={scrollToBottom}
              className="rounded-full w-10 h-10 p-0 shadow-lg"
            >
              <ArrowDown size={18} weight="bold" />
            </Button>
          </div>
        )}

        {uploadingFile && (
          <div className="px-4 py-2 border-t border-border/50 bg-muted/20 flex-shrink-0">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Uploading {selectedFile?.name}...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1" />
            </div>
          </div>
        )}

        <div className="p-4 border-t border-border/50 flex-shrink-0">
          <div className="flex gap-2">
            <div className="flex gap-1">
              {enableFileUpload && (
                <>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10 w-10 p-0">
                        <DotsThree size={20} weight="bold" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => imageInputRef.current?.click()}>
                        <ImageIcon size={16} className="mr-2" />
                        Upload Image
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => videoInputRef.current?.click()}>
                        <Video size={16} className="mr-2" />
                        Upload Video
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                        <FileIcon size={16} className="mr-2" />
                        Upload File
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              {enableVoice && (
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={isRecording ? stopRecording : startRecording}
                  className="h-10 w-10 p-0"
                >
                  {isRecording ? (
                    <Stop size={20} weight="bold" />
                  ) : (
                    <Microphone size={20} weight="bold" />
                  )}
                </Button>
              )}
            </div>

            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              placeholder={
                isRecording
                  ? `Recording... ${recordingDuration}s`
                  : "Type your message..."
              }
              disabled={isRecording}
              className="flex-1"
            />

            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() && !selectedFile}
              className="h-10 px-4"
            >
              <PaperPlaneRight size={18} weight="bold" />
            </Button>
          </div>

          {isRecording && (
            <div className="mt-2 text-xs text-destructive flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              Recording... {recordingDuration}s
            </div>
          )}

          {selectedFile && (
            <div className="mt-2 flex items-center justify-between bg-muted/50 rounded p-2">
              <div className="flex items-center gap-2 text-sm">
                <FileIcon size={16} />
                <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
                className="h-6 w-6 p-0"
              >
                <X size={14} />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
