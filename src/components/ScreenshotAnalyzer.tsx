import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Image, Upload, X, Sparkle, Eye, Trash, Stack, Play, Pause } from "@phosphor-icons/react";
import { toast } from "sonner";

interface ScreenshotAnalysis {
  id: string;
  timestamp: Date;
  imageUrl: string;
  fileName: string;
  fileSize: number;
  analysis: {
    description: string;
    detectedObjects: string[];
    gameContext?: string;
    actionItems?: string[];
    mood?: string;
    suggestedResponse?: string;
    highlights?: string[];
    technicalDetails?: {
      resolution?: string;
      quality?: string;
      clarity?: string;
    };
  };
  confidence: number;
}

interface ScreenshotAnalyzerProps {
  onAnalysisComplete?: (analysis: ScreenshotAnalysis) => void;
  maxFileSize?: number;
}

interface BatchProgress {
  total: number;
  completed: number;
  failed: number;
  currentFile: string;
}

export function ScreenshotAnalyzer({ 
  onAnalysisComplete,
  maxFileSize = 10 * 1024 * 1024
}: ScreenshotAnalyzerProps) {
  const [analyses, setAnalyses] = useState<ScreenshotAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchProgress, setBatchProgress] = useState<BatchProgress | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} (not an image)`);
        continue;
      }

      if (file.size > maxFileSize) {
        invalidFiles.push(`${file.name} (too large)`);
        continue;
      }

      validFiles.push(file);
    }

    if (invalidFiles.length > 0) {
      toast.error(`Skipped ${invalidFiles.length} invalid file(s)`, {
        description: invalidFiles.slice(0, 3).join(', ') + (invalidFiles.length > 3 ? '...' : ''),
      });
    }

    if (validFiles.length === 0) {
      toast.error('No valid files to analyze');
      return;
    }

    if (validFiles.length === 1) {
      await analyzeScreenshot(validFiles[0]);
    } else {
      setIsBatchMode(true);
      await analyzeBatch(validFiles);
    }
  };

  const analyzeScreenshot = async (file: File, isBatch: boolean = false) => {
    if (!isBatch) {
      setIsAnalyzing(true);
      setUploadProgress(0);
    }

    try {
      const reader = new FileReader();
      
      reader.onprogress = (e) => {
        if (e.lengthComputable && !isBatch) {
          const progress = (e.loaded / e.total) * 50;
          setUploadProgress(progress);
        }
      };

      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;
        if (!isBatch) setUploadProgress(60);

        const base64Data = imageDataUrl.split(',')[1];

        if (!isBatch) setUploadProgress(70);

        const prompt = (window.spark.llmPrompt as any)`You are an expert image analyst specializing in gaming screenshots and stream content analysis.

**Image Analysis Task:**

Analyze this screenshot/image in detail and provide:

1. **Description**: A comprehensive 2-3 sentence description of what you see
2. **Detected Objects/Elements**: List all major objects, UI elements, characters, or features visible
3. **Game Context** (if gaming screenshot): Identify the game, scene, or gameplay situation
4. **Action Items**: Suggest 2-3 specific things the streamer could comment on or discuss
5. **Mood/Atmosphere**: Describe the overall mood or tone of the image
6. **Suggested Response**: Write a natural, enthusiastic streamer response (1-2 sentences) 
7. **Highlights**: Note any particularly interesting or noteworthy elements worth calling out
8. **Technical Details**: Comment on image quality, resolution impression, clarity

Return your analysis as JSON in this exact format:
{
  "description": "detailed description here",
  "detectedObjects": ["object1", "object2", "object3"],
  "gameContext": "game name and situation",
  "actionItems": ["item1", "item2", "item3"],
  "mood": "mood description",
  "suggestedResponse": "streamer comment here",
  "highlights": ["highlight1", "highlight2"],
  "technicalDetails": {
    "resolution": "resolution impression",
    "quality": "quality assessment",
    "clarity": "clarity assessment"
  },
  "confidence": 0.85
}

Be specific, enthusiastic, and helpful. If it's a gaming screenshot, provide game-specific insights.`;

        if (!isBatch) setUploadProgress(80);

        const response = await window.spark.llm(prompt, "gpt-4o", true);
        const analysisData = JSON.parse(response);

        if (!isBatch) setUploadProgress(90);

        const newAnalysis: ScreenshotAnalysis = {
          id: Date.now().toString() + Math.random(),
          timestamp: new Date(),
          imageUrl: imageDataUrl,
          fileName: file.name,
          fileSize: file.size,
          analysis: {
            description: analysisData.description || 'No description available',
            detectedObjects: analysisData.detectedObjects || [],
            gameContext: analysisData.gameContext,
            actionItems: analysisData.actionItems || [],
            mood: analysisData.mood,
            suggestedResponse: analysisData.suggestedResponse,
            highlights: analysisData.highlights || [],
            technicalDetails: analysisData.technicalDetails || {},
          },
          confidence: analysisData.confidence || 0.75,
        };

        setAnalyses((current) => [newAnalysis, ...current]);
        if (!isBatch) {
          setUploadProgress(100);
          toast.success('Screenshot analyzed successfully!');
          setSelectedImage(imageDataUrl);
          setTimeout(() => {
            setUploadProgress(0);
          }, 1000);
        }
        
        if (onAnalysisComplete) {
          onAnalysisComplete(newAnalysis);
        }
      };

      reader.onerror = () => {
        throw new Error('Failed to read file');
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Screenshot analysis error:', error);
      if (!isBatch) {
        toast.error('Failed to analyze screenshot');
        setUploadProgress(0);
      }
      throw error;
    } finally {
      if (!isBatch) {
        setIsAnalyzing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleDeleteAnalysis = (id: string) => {
    setAnalyses((current) => current.filter(a => a.id !== id));
    toast.success('Analysis deleted');
  };

  const analyzeBatch = async (files: File[]) => {
    setIsAnalyzing(true);
    setIsPaused(false);
    setQueuedFiles(files);
    
    const progress: BatchProgress = {
      total: files.length,
      completed: 0,
      failed: 0,
      currentFile: files[0]?.name || '',
    };
    
    setBatchProgress(progress);
    toast.success(`Starting batch analysis of ${files.length} screenshots`);

    for (let i = 0; i < files.length; i++) {
      if (isPaused) {
        toast.info('Batch analysis paused');
        setIsAnalyzing(false);
        return;
      }

      const file = files[i];
      progress.currentFile = file.name;
      setBatchProgress({ ...progress });

      try {
        await analyzeScreenshot(file, true);
        progress.completed++;
      } catch (error) {
        progress.failed++;
        console.error(`Failed to analyze ${file.name}:`, error);
      }

      setBatchProgress({ ...progress });
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsAnalyzing(false);
    setIsBatchMode(false);
    setQueuedFiles([]);
    
    const successCount = progress.completed;
    const failCount = progress.failed;
    
    if (failCount === 0) {
      toast.success(`Batch complete! Analyzed ${successCount} screenshot${successCount > 1 ? 's' : ''}`);
    } else {
      toast.warning(`Batch complete! ${successCount} succeeded, ${failCount} failed`);
    }
    
    setBatchProgress(null);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
    if (isPaused) {
      toast.info('Resuming batch analysis');
      const remainingFiles = queuedFiles.slice(batchProgress?.completed || 0);
      analyzeBatch(remainingFiles);
    } else {
      toast.info('Pausing batch analysis');
    }
  };

  const cancelBatch = () => {
    setIsPaused(false);
    setIsAnalyzing(false);
    setIsBatchMode(false);
    setQueuedFiles([]);
    setBatchProgress(null);
    toast.info('Batch analysis cancelled');
  };

  const handleClearAll = () => {
    setAnalyses([]);
    setSelectedImage(null);
    toast.success('All analyses cleared');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Image size={24} weight="bold" className="text-primary" />
                Screenshot Analyzer
              </CardTitle>
              <CardDescription>
                Upload gameplay screenshots for AI-powered analysis and commentary suggestions
              </CardDescription>
            </div>
            {analyses.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="gap-2"
              >
                <Trash size={16} />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isAnalyzing}
            />
            
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {isBatchMode ? (
                  <Stack size={32} weight="bold" className="text-primary" />
                ) : (
                  <Upload size={32} weight="bold" className="text-primary" />
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">
                  {isBatchMode ? 'Batch Analysis Mode' : 'Upload screenshots to analyze'}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, or WebP • Max {(maxFileSize / 1024 / 1024).toFixed(0)}MB per file • Multiple files supported
                </p>
              </div>

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="gap-2"
              >
                {isBatchMode ? (
                  <Stack size={18} weight="bold" />
                ) : (
                  <Upload size={18} weight="bold" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Select Screenshot(s)'}
              </Button>
            </div>
          </div>

          {batchProgress && (
            <div className="space-y-3">
              <Alert className="bg-primary/10 border-primary/30">
                <Stack size={20} className="text-primary" />
                <AlertDescription className="text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      Batch Analysis Progress
                    </span>
                    <span className="text-xs">
                      {batchProgress.completed + batchProgress.failed} / {batchProgress.total}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Current: {batchProgress.currentFile}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs bg-accent/20 text-accent border-accent/30">
                      ✓ {batchProgress.completed} completed
                    </Badge>
                    {batchProgress.failed > 0 && (
                      <Badge variant="outline" className="text-xs bg-destructive/20 text-destructive border-destructive/30">
                        ✗ {batchProgress.failed} failed
                      </Badge>
                    )}
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Progress 
                  value={((batchProgress.completed + batchProgress.failed) / batchProgress.total) * 100} 
                  className="h-2" 
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePause}
                    disabled={!isAnalyzing}
                    className="gap-2 flex-1"
                  >
                    {isPaused ? (
                      <>
                        <Play size={16} weight="fill" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause size={16} weight="fill" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelBatch}
                    className="gap-2 flex-1 text-destructive hover:bg-destructive/10"
                  >
                    <X size={16} weight="bold" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isAnalyzing && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Analyzing screenshot...</span>
                <span className="font-medium">{uploadProgress.toFixed(0)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {analyses.length > 0 && (
            <Alert className="bg-accent/10 border-accent/30">
              <Eye size={20} className="text-accent" />
              <AlertDescription className="text-sm">
                <strong className="text-accent">{analyses.length}</strong> screenshot{analyses.length > 1 ? 's' : ''} analyzed • 
                Click any analysis below to view details
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {analyses.length > 0 && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkle size={20} weight="fill" className="text-accent" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {analyses.map((analysis, index) => (
                  <div key={analysis.id}>
                    {index > 0 && <Separator className="my-6" />}
                    
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {analysis.fileName}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {formatFileSize(analysis.fileSize)}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                analysis.confidence >= 0.8 
                                  ? 'bg-accent/20 text-accent border-accent/30' 
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {(analysis.confidence * 100).toFixed(0)}% confidence
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {analysis.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAnalysis(analysis.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X size={18} weight="bold" />
                        </Button>
                      </div>

                      <div 
                        className="relative rounded-lg overflow-hidden border border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => setSelectedImage(analysis.imageUrl)}
                      >
                        <img
                          src={analysis.imageUrl}
                          alt={analysis.fileName}
                          className="w-full h-auto max-h-64 object-contain bg-muted"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                          <Badge className="bg-primary text-primary-foreground">
                            Click to enlarge
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold mb-1 text-primary">Description</h4>
                          <p className="text-sm text-foreground/90">{analysis.analysis.description}</p>
                        </div>

                        {analysis.analysis.gameContext && (
                          <div>
                            <h4 className="text-sm font-semibold mb-1 text-secondary">Game Context</h4>
                            <p className="text-sm text-foreground/90">{analysis.analysis.gameContext}</p>
                          </div>
                        )}

                        {analysis.analysis.suggestedResponse && (
                          <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
                            <h4 className="text-sm font-semibold mb-1 text-accent flex items-center gap-2">
                              <Sparkle size={16} weight="fill" />
                              Suggested Streamer Response
                            </h4>
                            <p className="text-sm text-foreground/90 italic">"{analysis.analysis.suggestedResponse}"</p>
                          </div>
                        )}

                        {analysis.analysis.detectedObjects.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Detected Elements</h4>
                            <div className="flex flex-wrap gap-2">
                              {analysis.analysis.detectedObjects.map((obj, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {obj}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {analysis.analysis.highlights && analysis.analysis.highlights.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Highlights</h4>
                            <ul className="space-y-1">
                              {analysis.analysis.highlights.map((highlight, i) => (
                                <li key={i} className="text-sm text-foreground/90 flex items-start gap-2">
                                  <span className="text-accent mt-0.5">•</span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysis.analysis.actionItems && analysis.analysis.actionItems.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Commentary Suggestions</h4>
                            <ul className="space-y-1">
                              {analysis.analysis.actionItems.map((item, i) => (
                                <li key={i} className="text-sm text-foreground/90 flex items-start gap-2">
                                  <span className="text-primary mt-0.5">→</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysis.analysis.mood && (
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Mood/Atmosphere</h4>
                            <p className="text-sm text-muted-foreground">{analysis.analysis.mood}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <Button
              variant="outline"
              size="icon"
              className="absolute -top-12 right-0 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X size={20} weight="bold" />
            </Button>
            <img
              src={selectedImage}
              alt="Enlarged screenshot"
              className="max-w-full max-h-[calc(100vh-100px)] object-contain rounded-lg border border-border"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
