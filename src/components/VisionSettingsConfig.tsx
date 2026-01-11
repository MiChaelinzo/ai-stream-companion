import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VisionSettings } from "@/lib/types";
import { GearSix, Sparkle, ChatCircle } from "@phosphor-icons/react";
import { toast } from "sonner";

interface VisionSettingsConfigProps {
  settings: VisionSettings;
  onUpdate: (settings: VisionSettings) => void;
}

export function VisionSettingsConfig({ settings, onUpdate }: VisionSettingsConfigProps) {
  const handleToggle = (field: keyof VisionSettings) => {
    onUpdate({ ...settings, [field]: !settings[field] });
    toast.success("Settings updated");
  };

  const handleChange = (field: keyof VisionSettings, value: any) => {
    onUpdate({ ...settings, [field]: value });
  };

  const handleSave = () => {
    toast.success("Vision settings saved!");
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <GearSix size={20} weight="bold" className="text-primary" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Vision Analysis Settings
              <Sparkle size={16} weight="fill" className="text-accent" />
            </CardTitle>
            <CardDescription>
              Configure how Gemini 3 Vision analyzes your gameplay
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label htmlFor="vision-enabled">Enable Vision Analysis</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically analyze gameplay with AI
                </p>
              </div>
              <Switch
                id="vision-enabled"
                checked={settings.enabled}
                onCheckedChange={() => handleToggle('enabled')}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label htmlFor="auto-commentary">Auto Commentary</Label>
                <p className="text-xs text-muted-foreground">
                  Generate stream commentary automatically
                </p>
              </div>
              <Switch
                id="auto-commentary"
                checked={settings.autoCommentary}
                onCheckedChange={() => handleToggle('autoCommentary')}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label htmlFor="detect-highlights">Detect Highlights</Label>
                <p className="text-xs text-muted-foreground">
                  Identify exciting gameplay moments
                </p>
              </div>
              <Switch
                id="detect-highlights"
                checked={settings.detectHighlights}
                onCheckedChange={() => handleToggle('detectHighlights')}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label htmlFor="gameplay-tips">Include Gameplay Tips</Label>
                <p className="text-xs text-muted-foreground">
                  AI suggests tips during gameplay
                </p>
              </div>
              <Switch
                id="gameplay-tips"
                checked={settings.includeGameplayTips ?? true}
                onCheckedChange={() => handleToggle('includeGameplayTips')}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label htmlFor="react-actions">React to Actions</Label>
                <p className="text-xs text-muted-foreground">
                  AI responds to in-game events
                </p>
              </div>
              <Switch
                id="react-actions"
                checked={settings.reactToActions ?? true}
                onCheckedChange={() => handleToggle('reactToActions')}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="analysis-interval">
                Analysis Interval: {settings.analysisInterval}s
              </Label>
              <Slider
                id="analysis-interval"
                min={5}
                max={60}
                step={5}
                value={[settings.analysisInterval]}
                onValueChange={([value]) => handleChange('analysisInterval', value)}
              />
              <p className="text-xs text-muted-foreground">
                How often to analyze gameplay frames
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confidence-threshold">
                Confidence Threshold: {Math.round(settings.confidenceThreshold * 100)}%
              </Label>
              <Slider
                id="confidence-threshold"
                min={0.3}
                max={1}
                step={0.1}
                value={[settings.confidenceThreshold]}
                onValueChange={([value]) => handleChange('confidenceThreshold', value)}
              />
              <p className="text-xs text-muted-foreground">
                Minimum confidence for analysis results
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commentary-style">Commentary Style</Label>
              <Select 
                value={settings.commentaryStyle || 'hype'} 
                onValueChange={(value) => handleChange('commentaryStyle', value)}
              >
                <SelectTrigger id="commentary-style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hype">🔥 Hype - High energy & excitement</SelectItem>
                  <SelectItem value="analytical">📊 Analytical - Strategic insights</SelectItem>
                  <SelectItem value="casual">😎 Casual - Relaxed & friendly</SelectItem>
                  <SelectItem value="educational">📚 Educational - Teach & explain</SelectItem>
                  <SelectItem value="comedic">😂 Comedic - Funny & entertaining</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How the AI should commentate
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commentary-frequency">Commentary Frequency</Label>
              <Select 
                value={settings.commentaryFrequency || 'highlights-only'} 
                onValueChange={(value) => handleChange('commentaryFrequency', value)}
              >
                <SelectTrigger id="commentary-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All analyses - Comment every time</SelectItem>
                  <SelectItem value="highlights-only">Highlights only - Important moments</SelectItem>
                  <SelectItem value="occasional">Occasional - Balanced approach</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                When to generate commentary
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="game-context">Game Context (Optional)</Label>
          <Textarea
            id="game-context"
            placeholder="e.g., 'Playing God of War Ragnarok, action-adventure game with combat and exploration'"
            value={settings.gameContext || ''}
            onChange={(e) => handleChange('gameContext', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Provide context about the game you're playing for more accurate analysis
          </p>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} className="w-full gap-2">
            <Sparkle size={18} weight="fill" />
            Save Vision Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Sparkle size={16} weight="fill" className="text-accent" />
              How It Works
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Vision API captures and analyzes your gameplay screen</li>
              <li>• AI identifies game state, actions, and exciting moments</li>
              <li>• Generates contextual commentary for your stream</li>
              <li>• Detects highlights worth clipping or sharing</li>
              <li>• Works with any game on your screen</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <ChatCircle size={16} weight="fill" className="text-primary" />
              Commentary Styles
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• <strong>Hype:</strong> "WOAH! That was INSANE!"</li>
              <li>• <strong>Analytical:</strong> "Smart positioning there"</li>
              <li>• <strong>Casual:</strong> "Oh nice, that worked out"</li>
              <li>• <strong>Educational:</strong> "Notice how they used..."</li>
              <li>• <strong>Comedic:</strong> "Did NOT see that coming!"</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
