import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { generateSSMLExample, wrapWithSSML, parseSSML } from "@/lib/ssml-parser";
import { Play, Pause, Code, Sparkle, Info } from "@phosphor-icons/react";
import { toast } from "sonner";

interface SSMLEditorProps {
  onSpeak: (text: string) => Promise<void>;
  isSpeaking: boolean;
  onStop: () => void;
  ssmlEnabled: boolean;
  onToggleSSML: (enabled: boolean) => void;
}

export function SSMLEditor({ onSpeak, isSpeaking, onStop, ssmlEnabled, onToggleSSML }: SSMLEditorProps) {
  const [text, setText] = useState('');
  const [selectedExample, setSelectedExample] = useState<'pause' | 'emphasis' | 'pitch' | 'mixed'>('pause');
  const [quickPause, setQuickPause] = useState<number>(500);
  const [quickEmphasis, setQuickEmphasis] = useState<'strong' | 'moderate' | 'reduced'>('strong');
  const [quickPitch, setQuickPitch] = useState<'low' | 'medium' | 'high'>('high');
  const [quickRate, setQuickRate] = useState<'slow' | 'medium' | 'fast'>('fast');

  const handleLoadExample = (type: typeof selectedExample) => {
    const example = generateSSMLExample(type);
    setText(example);
    toast.success(`Loaded ${type} example`);
  };

  const handleSpeak = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text");
      return;
    }

    if (!ssmlEnabled && /<[^>]+>/.test(text)) {
      toast.error("SSML is disabled. Enable it in settings to use SSML tags.");
      return;
    }

    try {
      await onSpeak(text);
    } catch (error) {
      toast.error("Failed to speak text");
    }
  };

  const handleWrapSelection = (type: 'pause' | 'emphasis' | 'pitch' | 'rate') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (!selectedText) {
      toast.error("Please select some text first");
      return;
    }

    let wrapped = '';
    switch (type) {
      case 'pause':
        wrapped = `${selectedText}<break time="${quickPause}ms"/>`;
        break;
      case 'emphasis':
        wrapped = wrapWithSSML(selectedText, { emphasis: quickEmphasis });
        break;
      case 'pitch':
        wrapped = wrapWithSSML(selectedText, { pitch: quickPitch });
        break;
      case 'rate':
        wrapped = wrapWithSSML(selectedText, { rate: quickRate });
        break;
    }

    const newText = text.substring(0, start) + wrapped + text.substring(end);
    setText(newText);
    toast.success(`Applied ${type} formatting`);
  };

  const parseResult = ssmlEnabled && text ? parseSSML(text) : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code size={24} weight="bold" className="text-primary" />
              SSML Speech Editor
            </CardTitle>
            <CardDescription>
              Add advanced speech control with pauses, emphasis, pitch, and rate variations
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="ssml-toggle" className="text-sm text-muted-foreground">
              SSML Enabled
            </Label>
            <Switch
              id="ssml-toggle"
              checked={ssmlEnabled}
              onCheckedChange={onToggleSSML}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Speech Text {ssmlEnabled && '(SSML Supported)'}</Label>
                {parseResult && (
                  <Badge variant="outline" className="text-xs">
                    {parseResult.segments.length} segments
                  </Badge>
                )}
              </div>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={ssmlEnabled 
                  ? "Enter text with SSML tags, e.g., Hello! <break time='500ms'/> Welcome to the stream!"
                  : "Enter text to speak..."
                }
                className="min-h-[150px] font-mono text-sm"
              />
            </div>

            {ssmlEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Pause</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Duration: {quickPause}ms</Label>
                      <Slider
                        value={[quickPause]}
                        onValueChange={(v) => setQuickPause(v[0])}
                        min={100}
                        max={2000}
                        step={100}
                      />
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleWrapSelection('pause')}
                    >
                      Add Pause After Selection
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Emphasis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Select value={quickEmphasis} onValueChange={(v: any) => setQuickEmphasis(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strong">Strong</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="reduced">Reduced</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleWrapSelection('emphasis')}
                    >
                      Apply Emphasis
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Pitch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Select value={quickPitch} onValueChange={(v: any) => setQuickPitch(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleWrapSelection('pitch')}
                    >
                      Apply Pitch
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Select value={quickRate} onValueChange={(v: any) => setQuickRate(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast">Fast</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="slow">Slow</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleWrapSelection('rate')}
                    >
                      Apply Rate
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleSpeak}
                disabled={isSpeaking || !text.trim()}
                className="flex-1"
              >
                <Play size={18} weight="fill" className="mr-2" />
                Test Speech
              </Button>
              {isSpeaking && (
                <Button
                  onClick={onStop}
                  variant="destructive"
                >
                  <Pause size={18} weight="fill" className="mr-2" />
                  Stop
                </Button>
              )}
            </div>

            {parseResult && parseResult.hasSSML && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info size={16} weight="bold" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Plain Text:</div>
                    <div className="text-sm font-medium p-3 bg-background rounded-md">
                      {parseResult.plainText}
                    </div>
                    <div className="text-sm text-muted-foreground">Segments:</div>
                    <div className="space-y-1">
                      {parseResult.segments.map((segment, i) => (
                        <div key={i} className="text-xs p-2 bg-background rounded border border-border/50 flex items-center justify-between">
                          <span className="flex-1">"{segment.text}"</span>
                          <div className="flex gap-2">
                            {segment.pause && (
                              <Badge variant="secondary" className="text-xs">
                                Pause {segment.pause}ms
                              </Badge>
                            )}
                            {segment.emphasis && (
                              <Badge variant="secondary" className="text-xs">
                                {segment.emphasis}
                              </Badge>
                            )}
                            {segment.pitch && (
                              <Badge variant="secondary" className="text-xs">
                                Pitch {segment.pitch.toFixed(1)}
                              </Badge>
                            )}
                            {segment.rate && (
                              <Badge variant="secondary" className="text-xs">
                                Rate {segment.rate.toFixed(1)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <div className="space-y-3">
              <Label>Load Example</Label>
              <Select value={selectedExample} onValueChange={(v: any) => setSelectedExample(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pause">Pauses & Breaks</SelectItem>
                  <SelectItem value="emphasis">Emphasis</SelectItem>
                  <SelectItem value="pitch">Pitch Variation</SelectItem>
                  <SelectItem value="mixed">Mixed (Advanced)</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => handleLoadExample(selectedExample)}
                className="w-full"
              >
                <Sparkle size={18} weight="fill" className="mr-2" />
                Load Example
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Example Previews</Label>
              {(['pause', 'emphasis', 'pitch', 'mixed'] as const).map((type) => (
                <Card key={type} className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs uppercase tracking-wide text-muted-foreground">
                      {type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <code className="text-xs break-words">
                      {generateSSMLExample(type)}
                    </code>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Info size={16} weight="bold" />
                  SSML Tag Reference
                </h3>
                <div className="space-y-3">
                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">&lt;break /&gt; - Pauses</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div>
                        <code className="bg-background px-2 py-1 rounded">
                          &lt;break time="500ms"/&gt;
                        </code>
                        <p className="text-muted-foreground mt-1">Insert a pause (ms or s)</p>
                      </div>
                      <div>
                        <code className="bg-background px-2 py-1 rounded">
                          &lt;break strength="strong"/&gt;
                        </code>
                        <p className="text-muted-foreground mt-1">
                          Use strength: x-weak, weak, medium, strong, x-strong
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">&lt;emphasis&gt; - Emphasis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div>
                        <code className="bg-background px-2 py-1 rounded">
                          &lt;emphasis level="strong"&gt;text&lt;/emphasis&gt;
                        </code>
                        <p className="text-muted-foreground mt-1">
                          Levels: strong, moderate, reduced, none
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">&lt;prosody&gt; - Voice Control</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div>
                        <code className="bg-background px-2 py-1 rounded">
                          &lt;prosody pitch="high"&gt;text&lt;/prosody&gt;
                        </code>
                        <p className="text-muted-foreground mt-1">
                          Pitch: x-low, low, medium, high, x-high, +10%, -10%
                        </p>
                      </div>
                      <div>
                        <code className="bg-background px-2 py-1 rounded">
                          &lt;prosody rate="fast"&gt;text&lt;/prosody&gt;
                        </code>
                        <p className="text-muted-foreground mt-1">
                          Rate: x-slow, slow, medium, fast, x-fast, 50%, 150%
                        </p>
                      </div>
                      <div>
                        <code className="bg-background px-2 py-1 rounded">
                          &lt;prosody pitch="high" rate="fast"&gt;text&lt;/prosody&gt;
                        </code>
                        <p className="text-muted-foreground mt-1">
                          Combine multiple attributes
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">💡 Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <p>• Use pauses to create natural speech rhythm</p>
                  <p>• Apply emphasis to highlight important words</p>
                  <p>• Vary pitch for excitement or seriousness</p>
                  <p>• Adjust rate for dramatic effect or clarity</p>
                  <p>• Combine tags for expressive speech patterns</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
