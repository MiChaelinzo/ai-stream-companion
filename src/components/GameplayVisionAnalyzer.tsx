import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GameplayAnalysis, VisionSettings } from "@/lib/types";
import { Eye, Play, Stop, Camera, Sparkle, Lightning, Target, ChatCircle } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GameplayVisionAnalyzerProps {
  settings: VisionSettings;
  onAnalysisComplete?: (analysis: GameplayAnalysis) => void;
  onCommentaryGenerated?: (commentary: string) => void;
}

export function GameplayVisionAnalyzer({ 
  settings, 
  onAnalysisComplete,
  onCommentaryGenerated 
}: GameplayVisionAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<GameplayAnalysis | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<GameplayAnalysis[]>([]);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [isGeneratingCommentary, setIsGeneratingCommentary] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScreenCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopAnalysis();
      });

      setIsAnalyzing(true);
      toast.success("Screen capture started");

      if (settings.enabled) {
        startPeriodicAnalysis();
      }
    } catch (error) {
      toast.error("Failed to start screen capture");
      console.error(error);
    }
  };

  const stopScreenCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsAnalyzing(false);
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const analyzeFrame = async (frameData: string) => {
    try {
      const base64Image = frameData.split(',')[1];
      
      const reactToActions = settings.reactToActions ?? true;
      const includeGameplayTips = settings.includeGameplayTips ?? true;
      
      const prompt = (window.spark.llmPrompt as any)`You are an AI gameplay analyst powered by Gemini 3 Vision. Analyze this gameplay screenshot and provide detailed insights.

Game Context: ${settings.gameContext || "Unknown game - identify from the screenshot"}

Analyze the image carefully and provide a JSON response with:
{
  "game": "detected game name or genre",
  "scene": "detailed description of what's happening in this scene",
  "objects": ["visible objects, UI elements, characters, weapons, items"],
  "action": "current player action or game state - be specific",
  "emotion": "emotional tone - choose from: exciting, tense, calm, chaotic, intense, triumphant, challenging",
  ${includeGameplayTips ? '"suggestion": "optional gameplay tip, strategy advice, or tactical observation",' : ''}
  ${reactToActions ? '"highlights": ["notable moments, impressive plays, or interesting events worth commenting on"]' : '"highlights": []'}
}

Focus on:
- What makes this moment interesting or noteworthy
- Player performance and skill execution
- Exciting or tense moments worth highlighting
- Strategic decisions visible in the scene
${includeGameplayTips ? '- Helpful tips that viewers would appreciate' : ''}

Be specific, concise, and focus on what would be interesting to stream viewers. If this is a highlight-worthy moment, make it clear in the highlights array.`;

      const response = await window.spark.llm(prompt, "gpt-4o", true);
      const parsed = JSON.parse(response);

      const analysis: GameplayAnalysis = {
        id: Date.now().toString(),
        timestamp: new Date(),
        game: parsed.game || "Unknown",
        scene: parsed.scene || "",
        objects: parsed.objects || [],
        action: parsed.action || "",
        emotion: parsed.emotion || "neutral",
        suggestion: parsed.suggestion,
        commentary: undefined,
        highlights: parsed.highlights || [],
      };

      const shouldGenerateCommentary = () => {
        const frequency = settings.commentaryFrequency || 'highlights-only';
        const hasHighlights = analysis.highlights && analysis.highlights.length > 0;
        const isExciting = ['exciting', 'tense', 'chaotic', 'intense', 'triumphant'].includes(analysis.emotion.toLowerCase());
        
        if (frequency === 'all') return true;
        if (frequency === 'highlights-only') return hasHighlights || isExciting;
        if (frequency === 'occasional') return Math.random() > 0.5 || hasHighlights;
        
        return false;
      };

      if (settings.autoCommentary && shouldGenerateCommentary()) {
        setIsGeneratingCommentary(true);
        const commentary = await generateCommentary(analysis);
        setIsGeneratingCommentary(false);
        analysis.commentary = commentary;
        if (onCommentaryGenerated && commentary) {
          onCommentaryGenerated(commentary);
        }
      }

      setCurrentAnalysis(analysis);
      setRecentAnalyses(prev => [analysis, ...prev].slice(0, 10));
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysis);
      }

      return analysis;
    } catch (error) {
      console.error("Frame analysis error:", error);
      return null;
    }
  };

  const generateCommentary = async (analysis: GameplayAnalysis): Promise<string> => {
    try {
      const commentaryStyle = settings.commentaryStyle || 'hype';
      const includeGameplayTips = settings.includeGameplayTips ?? true;
      
      const styleDescriptions = {
        hype: "high-energy, excited, use exclamations and dynamic language. React enthusiastically to action.",
        analytical: "strategic, thoughtful, focus on tactics and decision-making. Explain why things work.",
        casual: "relaxed, friendly, conversational. Like chatting with a friend watching the game.",
        educational: "informative, teaching-focused, explain mechanics and strategies. Help viewers learn.",
        comedic: "funny, lighthearted, find humor in moments. Make entertaining observations."
      };

      const tipsInstruction = includeGameplayTips 
        ? "Optionally include a quick gameplay tip if relevant." 
        : "Focus only on commentary, no tips.";

      const prompt = (window.spark.llmPrompt as any)`Generate natural, engaging stream commentary based on this gameplay analysis:

Game: ${analysis.game}
Scene: ${analysis.scene}
Action: ${analysis.action}
Emotion: ${analysis.emotion}
Highlights: ${analysis.highlights?.join(", ") || "None"}
${analysis.suggestion ? `Suggestion: ${analysis.suggestion}` : ""}

Commentary Style: ${commentaryStyle} - Be ${styleDescriptions[commentaryStyle]}

${tipsInstruction}

Create a brief (1-2 sentences) commentary that sounds natural for a live stream. Match the ${commentaryStyle} style perfectly. Be engaging and authentic.`;

      const commentary = await window.spark.llm(prompt, "gpt-4o");
      return commentary.trim();
    } catch (error) {
      return "";
    }
  };

  const analyzeCurrentFrame = async () => {
    const frame = captureFrame();
    if (!frame) {
      toast.error("Failed to capture frame");
      return;
    }
    
    setCapturedFrame(frame);
    toast.info("Analyzing gameplay...");
    await analyzeFrame(frame);
    toast.success("Analysis complete!");
  };

  const startPeriodicAnalysis = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(async () => {
      const frame = captureFrame();
      if (frame) {
        await analyzeFrame(frame);
      }
    }, settings.analysisInterval * 1000);
  };

  const stopAnalysis = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopScreenCapture();
    toast.info("Gameplay analysis stopped");
  };

  const startAnalysis = async () => {
    await startScreenCapture();
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye size={20} weight="bold" className="text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Gemini 3 Vision Analysis
                  <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
                    <Sparkle size={12} weight="fill" className="mr-1" />
                    AI Powered
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Real-time gameplay analysis with Gemini Vision API
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {!isAnalyzing ? (
                <Button onClick={startAnalysis} className="gap-2">
                  <Play size={18} weight="fill" />
                  Start Analysis
                </Button>
              ) : (
                <>
                  <Button onClick={analyzeCurrentFrame} variant="outline" className="gap-2">
                    <Camera size={18} weight="bold" />
                    Capture
                  </Button>
                  <Button onClick={stopAnalysis} variant="destructive" className="gap-2">
                    <Stop size={18} weight="fill" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!settings.enabled && (
            <Alert className="border-accent/30 bg-accent/5">
              <Lightning size={16} weight="fill" className="text-accent" />
              <AlertDescription>
                Vision analysis is disabled. Enable it in Vision Settings to start automatic analysis.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  muted
                  playsInline
                />
                {!isAnalyzing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Eye size={48} weight="duotone" className="text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Click Start Analysis to begin
                      </p>
                    </div>
                  </div>
                )}
                {isAnalyzing && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge className="bg-red-500/20 text-red-500 border-red-500/30 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                      LIVE
                    </Badge>
                    {isGeneratingCommentary && (
                      <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse">
                        <ChatCircle size={12} weight="fill" className="mr-1" />
                        Generating...
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="space-y-4">
              {currentAnalysis ? (
                <Card className="border-accent/20 bg-accent/5">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target size={16} weight="bold" className="text-accent" />
                      Current Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="text-xs text-muted-foreground">Game</span>
                        <Badge variant="secondary">{currentAnalysis.game}</Badge>
                      </div>
                      <div className="flex items-start justify-between">
                        <span className="text-xs text-muted-foreground">Emotion</span>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {currentAnalysis.emotion}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="text-xs font-medium">Scene</p>
                      <p className="text-sm text-muted-foreground">{currentAnalysis.scene}</p>
                    </div>

                    {currentAnalysis.action && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Action</p>
                        <p className="text-sm text-muted-foreground">{currentAnalysis.action}</p>
                      </div>
                    )}

                    {currentAnalysis.commentary && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium flex items-center gap-1">
                          <ChatCircle size={14} weight="fill" />
                          AI Commentary
                        </p>
                        <p className="text-sm text-accent italic">"{currentAnalysis.commentary}"</p>
                      </div>
                    )}

                    {currentAnalysis.suggestion && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Suggestion</p>
                        <p className="text-sm text-muted-foreground">{currentAnalysis.suggestion}</p>
                      </div>
                    )}

                    {currentAnalysis.highlights && currentAnalysis.highlights.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Highlights</p>
                        <div className="flex flex-wrap gap-1">
                          {currentAnalysis.highlights.map((highlight, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2 py-8">
                      <Sparkle size={32} weight="duotone" className="text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Waiting for analysis...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {recentAnalyses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Recent Analyses</h3>
                <Badge variant="secondary">{recentAnalyses.length}</Badge>
              </div>
              <ScrollArea className="h-48 rounded-lg border border-border bg-muted/30">
                <div className="p-4 space-y-2">
                  {recentAnalyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="p-3 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">{analysis.game}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(analysis.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{analysis.scene}</p>
                      {analysis.commentary && (
                        <p className="text-xs text-accent italic mt-1 line-clamp-1">
                          "{analysis.commentary}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
