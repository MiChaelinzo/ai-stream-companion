import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VideoAnalysisResult, VideoFrame } from '@/lib/types';
import { 
  VideoCamera, 
  Upload, 
  X, 
  Play, 
  Pause, 
  Check, 
  Lightning, 
  ChartBar,
  Star,
  Info,
  Eye,
  SpeakerHigh,
  Clock
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface VideoAnalyzerProps {
  onAnalysisComplete?: (result: VideoAnalysisResult) => void;
  maxFileSizeMB?: number;
  frameInterval?: number;
  maxFrames?: number;
}

export function VideoAnalyzer({ 
  onAnalysisComplete,
  maxFileSizeMB = 100,
  frameInterval = 2,
  maxFrames = 30
}: VideoAnalyzerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [extractedFrames, setExtractedFrames] = useState<VideoFrame[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }

    if (file.size > maxFileSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxFileSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
    setAnalysisResult(null);
    setExtractedFrames([]);
    toast.success('Video loaded successfully');
  };

  const extractFrames = async (video: HTMLVideoElement, interval: number, max: number): Promise<VideoFrame[]> => {
    const frames: VideoFrame[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to create canvas context');
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const duration = video.duration;
    const frameCount = Math.min(Math.floor(duration / interval), max);
    
    for (let i = 0; i < frameCount; i++) {
      const timestamp = i * interval;
      
      await new Promise<void>((resolve) => {
        video.currentTime = timestamp;
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          frames.push({
            timestamp,
            dataUrl,
          });
          
          setProgress(((i + 1) / frameCount) * 30);
          resolve();
        };
      });
    }

    return frames;
  };

  const analyzeFrame = async (frame: VideoFrame, frameIndex: number, totalFrames: number): Promise<VideoFrame> => {
    const prompt = (window.spark.llmPrompt as any)`You are an expert gameplay analyst. Analyze this video frame from a gaming session.

**Frame timestamp:** ${frame.timestamp.toFixed(2)} seconds

Describe what you see in detail:
1. What game or type of game is this?
2. What is happening in this scene?
3. What objects, characters, or UI elements are visible?
4. What action or event is taking place?
5. What is the player doing?

Return as JSON:
{
  "game": "detected game name or 'Unknown'",
  "scene": "description of the scene",
  "objects": ["object1", "object2", "object3"],
  "action": "what's happening",
  "emotion": "suggested emotion for commentary (excited/focused/tense/calm)",
  "isHighlight": true/false,
  "highlightType": "action/event/scene-change or null"
}`;

    try {
      const response = await window.spark.llm(prompt, "gpt-4o", true);
      const parsed = JSON.parse(response);
      
      frame.analysis = {
        id: `frame-${frameIndex}`,
        timestamp: new Date(),
        game: parsed.game || 'Unknown',
        scene: parsed.scene || '',
        objects: parsed.objects || [],
        action: parsed.action || '',
        emotion: parsed.emotion || 'neutral',
        highlights: parsed.isHighlight ? [parsed.highlightType || 'moment'] : [],
      };

      setProgress(30 + ((frameIndex + 1) / totalFrames) * 40);
    } catch (error) {
      console.error('Failed to analyze frame:', error);
    }

    return frame;
  };

  const generateOverallAnalysis = async (frames: VideoFrame[], duration: number): Promise<{
    summary: string;
    commentary: string[];
    keyMoments: VideoAnalysisResult['keyMoments'];
    gameDetection: VideoAnalysisResult['gameDetection'];
    performanceInsights: VideoAnalysisResult['performanceInsights'];
  }> => {
    setCurrentStep('Generating overall analysis and commentary...');
    
    const frameDescriptions = frames
      .filter(f => f.analysis)
      .map((f, i) => `[${f.timestamp.toFixed(1)}s] ${f.analysis?.scene}`)
      .join('\n');

    const prompt = (window.spark.llmPrompt as any)`You are an expert gaming analyst and streamer commentator. Analyze this complete gameplay video session.

**Video Duration:** ${duration.toFixed(1)} seconds
**Analyzed Frames:** ${frames.length}

**Frame-by-frame descriptions:**
${frameDescriptions}

Generate a comprehensive analysis as JSON:
{
  "summary": "2-3 sentence overview of the entire gameplay session",
  "detectedGame": {
    "name": "game name",
    "confidence": 0.0-1.0,
    "genre": "fps/moba/fighting/racing/rhythm/strategy/other"
  },
  "keyMoments": [
    {
      "timestamp": seconds,
      "description": "what happened",
      "type": "highlight/action/event/scene-change"
    }
  ],
  "commentary": [
    "engaging commentary line 1 about the gameplay",
    "engaging commentary line 2 about key moments",
    "engaging commentary line 3 about player performance"
  ],
  "performanceInsights": {
    "skillLevel": "beginner/intermediate/advanced/expert",
    "strengths": ["strength1", "strength2"],
    "improvements": ["improvement1", "improvement2"]
  }
}`;

    try {
      const response = await window.spark.llm(prompt, "gpt-4o", true);
      const parsed = JSON.parse(response);
      
      return {
        summary: parsed.summary || '',
        commentary: parsed.commentary || [],
        keyMoments: parsed.keyMoments || [],
        gameDetection: parsed.detectedGame,
        performanceInsights: parsed.performanceInsights,
      };
    } catch (error) {
      console.error('Failed to generate overall analysis:', error);
      return {
        summary: 'Analysis completed',
        commentary: [],
        keyMoments: [],
        gameDetection: undefined,
        performanceInsights: undefined,
      };
    }
  };

  const analyzeVideo = async () => {
    if (!selectedFile || !videoRef.current) return;

    setIsAnalyzing(true);
    setProgress(0);
    setCurrentStep('Extracting frames from video...');
    
    const startTime = Date.now();

    try {
      const video = videoRef.current;
      
      await new Promise<void>((resolve) => {
        if (video.readyState >= 2) {
          resolve();
        } else {
          video.onloadedmetadata = () => resolve();
        }
      });

      const frames = await extractFrames(video, frameInterval, maxFrames);
      setExtractedFrames(frames);
      setCurrentStep(`Analyzing ${frames.length} frames with AI...`);

      const analyzedFrames: VideoFrame[] = [];
      for (let i = 0; i < frames.length; i++) {
        const analyzed = await analyzeFrame(frames[i], i, frames.length);
        analyzedFrames.push(analyzed);
      }

      setProgress(70);
      const overallAnalysis = await generateOverallAnalysis(analyzedFrames, video.duration);
      setProgress(100);

      const result: VideoAnalysisResult = {
        id: Date.now().toString(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        duration: video.duration,
        frameCount: frames.length,
        fps: Math.round(frames.length / video.duration),
        analyzedFrames,
        overallSummary: overallAnalysis.summary,
        keyMoments: overallAnalysis.keyMoments,
        gameDetection: overallAnalysis.gameDetection,
        commentary: overallAnalysis.commentary,
        performanceInsights: overallAnalysis.performanceInsights,
        uploadedAt: new Date(),
        processingTime: (Date.now() - startTime) / 1000,
      };

      setAnalysisResult(result);
      setCurrentStep('Analysis complete!');
      toast.success('Video analysis completed successfully!');
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error('Video analysis failed:', error);
      toast.error('Failed to analyze video');
      setCurrentStep('Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearVideo = () => {
    setSelectedFile(null);
    setVideoPreviewUrl(null);
    setAnalysisResult(null);
    setExtractedFrames([]);
    setProgress(0);
    setCurrentStep('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <VideoCamera size={24} weight="bold" className="text-primary" />
              </div>
              <div>
                <CardTitle>Video Analysis</CardTitle>
                <CardDescription>Upload gameplay videos for AI-powered analysis and commentary</CardDescription>
              </div>
            </div>
            {selectedFile && (
              <Button variant="ghost" size="sm" onClick={clearVideo}>
                <X size={18} weight="bold" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedFile ? (
            <div className="space-y-4">
              <Alert className="bg-accent/10 border-accent/30">
                <Info size={20} className="text-accent" />
                <AlertDescription className="text-sm">
                  <strong className="text-accent">Video Analysis Features:</strong> Upload gameplay videos (up to {maxFileSizeMB}MB). The AI will extract frames, analyze gameplay, detect key moments, and generate commentary. Perfect for reviewing your streams or creating highlight reels!
                </AlertDescription>
              </Alert>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border/50 rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Upload size={48} weight="bold" className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2">Click to upload video</p>
                <p className="text-sm text-muted-foreground">
                  Supports MP4, WebM, MOV (max {maxFileSizeMB}MB)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <Eye size={24} weight="bold" className="mx-auto mb-2 text-primary" />
                  <p className="font-semibold text-sm">Frame Analysis</p>
                  <p className="text-xs text-muted-foreground">AI analyzes key frames</p>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <Star size={24} weight="bold" className="mx-auto mb-2 text-accent" />
                  <p className="font-semibold text-sm">Highlight Detection</p>
                  <p className="text-xs text-muted-foreground">Finds epic moments</p>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <SpeakerHigh size={24} weight="bold" className="mx-auto mb-2 text-secondary" />
                  <p className="font-semibold text-sm">Auto Commentary</p>
                  <p className="text-xs text-muted-foreground">Generates reactions</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <VideoCamera size={24} weight="fill" className="text-primary" />
                  <div>
                    <p className="font-semibold">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={analyzeVideo}
                  disabled={isAnalyzing}
                  className="gap-2"
                >
                  <Lightning size={18} weight="bold" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Video'}
                </Button>
              </div>

              {videoPreviewUrl && (
                <div className="rounded-lg overflow-hidden bg-black/50">
                  <video
                    ref={videoRef}
                    src={videoPreviewUrl}
                    controls
                    className="w-full max-h-96"
                  />
                </div>
              )}

              {isAnalyzing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{currentStep}</span>
                    <span className="font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {analysisResult && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-accent/20">
                <ChartBar size={24} weight="bold" className="text-accent" />
              </div>
              <div>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Processed {analysisResult.frameCount} frames in {analysisResult.processingTime.toFixed(1)}s
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="commentary">Commentary</TabsTrigger>
                <TabsTrigger value="highlights">Key Moments</TabsTrigger>
                <TabsTrigger value="frames">Frames</TabsTrigger>
                <TabsTrigger value="insights">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {analysisResult.gameDetection && (
                  <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {analysisResult.gameDetection.gameName}
                    </Badge>
                    <Badge variant="outline">
                      {analysisResult.gameDetection.genre}
                    </Badge>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {Math.round(analysisResult.gameDetection.confidence * 100)}% confidence
                    </span>
                  </div>
                )}

                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Info size={18} weight="bold" />
                    Summary
                  </h4>
                  <p className="text-sm text-muted-foreground">{analysisResult.overallSummary}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/20 rounded-lg text-center">
                    <Clock size={24} weight="bold" className="mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{formatDuration(analysisResult.duration)}</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg text-center">
                    <Eye size={24} weight="bold" className="mx-auto mb-2 text-accent" />
                    <p className="text-2xl font-bold">{analysisResult.frameCount}</p>
                    <p className="text-xs text-muted-foreground">Frames Analyzed</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg text-center">
                    <Star size={24} weight="bold" className="mx-auto mb-2 text-secondary" />
                    <p className="text-2xl font-bold">{analysisResult.keyMoments.length}</p>
                    <p className="text-xs text-muted-foreground">Key Moments</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg text-center">
                    <SpeakerHigh size={24} weight="bold" className="mx-auto mb-2 text-chart-1" />
                    <p className="text-2xl font-bold">{analysisResult.commentary.length}</p>
                    <p className="text-xs text-muted-foreground">Commentary Lines</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="commentary" className="space-y-4">
                {analysisResult.commentary.length > 0 ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-3 pr-4">
                      {analysisResult.commentary.map((comment, index) => (
                        <div key={index} className="p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-primary/20 mt-1">
                              <SpeakerHigh size={16} weight="bold" className="text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <SpeakerHigh size={48} weight="bold" className="mx-auto mb-4 opacity-50" />
                    <p>No commentary generated</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="highlights" className="space-y-4">
                {analysisResult.keyMoments.length > 0 ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-3 pr-4">
                      {analysisResult.keyMoments.map((moment, index) => (
                        <div key={index} className="p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="mt-1">
                              {formatDuration(moment.timestamp)}
                            </Badge>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={
                                  moment.type === 'highlight' ? 'bg-accent/20 text-accent border-accent/30' :
                                  moment.type === 'action' ? 'bg-primary/20 text-primary border-primary/30' :
                                  'bg-secondary/20 text-secondary border-secondary/30'
                                }>
                                  {moment.type}
                                </Badge>
                              </div>
                              <p className="text-sm">{moment.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Star size={48} weight="bold" className="mx-auto mb-4 opacity-50" />
                    <p>No key moments detected</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="frames" className="space-y-4">
                <ScrollArea className="h-96">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pr-4">
                    {analysisResult.analyzedFrames.map((frame, index) => (
                      <div key={index} className="space-y-2">
                        <div className="relative rounded-lg overflow-hidden bg-muted/20 aspect-video">
                          <img
                            src={frame.dataUrl}
                            alt={`Frame at ${frame.timestamp}s`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <Badge variant="secondary" className="text-xs">
                              {formatDuration(frame.timestamp)}
                            </Badge>
                          </div>
                        </div>
                        {frame.analysis && (
                          <div className="text-xs text-muted-foreground">
                            <p className="font-semibold truncate">{frame.analysis.action}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                {analysisResult.performanceInsights ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <ChartBar size={18} weight="bold" />
                        Skill Level
                      </h4>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {analysisResult.performanceInsights.skillLevel}
                      </Badge>
                    </div>

                    <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-accent">
                        <Check size={18} weight="bold" />
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.performanceInsights.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Check size={16} weight="bold" className="text-accent mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-secondary">
                        <Lightning size={18} weight="bold" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.performanceInsights.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Lightning size={16} weight="bold" className="text-secondary mt-0.5 flex-shrink-0" />
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <ChartBar size={48} weight="bold" className="mx-auto mb-4 opacity-50" />
                    <p>No performance insights available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
