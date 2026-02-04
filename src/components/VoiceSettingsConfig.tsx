import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { VoiceSettings, VoiceGender, VoicePitch, VoiceSpeed } from "@/hooks/use-speech-synthesis";
import { SpeakerHigh, SpeakerSimpleX, Play, Sparkle } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface VoiceSettingsConfigProps {
  settings: VoiceSettings;
  onUpdate: (settings: VoiceSettings) => void;
  availableVoices: SpeechSynthesisVoice[];
  onTestVoice: () => void;
  isSupported: boolean;
}

const VOICE_PRESETS = [
  {
    id: 'energetic',
    name: 'Energetic',
    description: 'High-pitched and fast-paced',
    gender: 'female' as VoiceGender,
    pitch: 'high' as VoicePitch,
    speed: 'fast' as VoiceSpeed,
    volume: 0.9,
  },
  {
    id: 'calm',
    name: 'Calm',
    description: 'Low-pitched and slow-paced',
    gender: 'female' as VoiceGender,
    pitch: 'low' as VoicePitch,
    speed: 'slow' as VoiceSpeed,
    volume: 0.7,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clear and measured',
    gender: 'male' as VoiceGender,
    pitch: 'normal' as VoicePitch,
    speed: 'normal' as VoiceSpeed,
    volume: 0.8,
  },
  {
    id: 'enthusiastic',
    name: 'Enthusiastic',
    description: 'Very high energy',
    gender: 'female' as VoiceGender,
    pitch: 'very-high' as VoicePitch,
    speed: 'fast' as VoiceSpeed,
    volume: 0.95,
  },
  {
    id: 'deep',
    name: 'Deep Voice',
    description: 'Low and commanding',
    gender: 'male' as VoiceGender,
    pitch: 'very-low' as VoicePitch,
    speed: 'slow' as VoiceSpeed,
    volume: 0.85,
  },
  {
    id: 'chipper',
    name: 'Chipper',
    description: 'Bright and cheerful',
    gender: 'female' as VoiceGender,
    pitch: 'high' as VoicePitch,
    speed: 'very-fast' as VoiceSpeed,
    volume: 0.8,
  },
  {
    id: 'announcer',
    name: 'Announcer',
    description: 'Bold and clear',
    gender: 'male' as VoiceGender,
    pitch: 'low' as VoicePitch,
    speed: 'normal' as VoiceSpeed,
    volume: 0.9,
  },
  {
    id: 'soothing',
    name: 'Soothing',
    description: 'Soft and gentle',
    gender: 'female' as VoiceGender,
    pitch: 'low' as VoicePitch,
    speed: 'very-slow' as VoiceSpeed,
    volume: 0.6,
  },
  {
    id: 'hype',
    name: 'Hype',
    description: 'Maximum excitement',
    gender: 'female' as VoiceGender,
    pitch: 'very-high' as VoicePitch,
    speed: 'very-fast' as VoiceSpeed,
    volume: 1.0,
  },
];

export function VoiceSettingsConfig({ 
  settings, 
  onUpdate, 
  availableVoices,
  onTestVoice,
  isSupported 
}: VoiceSettingsConfigProps) {
  
  const handleToggle = (enabled: boolean) => {
    onUpdate({ ...settings, enabled });
  };

  const handleGenderChange = (gender: string) => {
    onUpdate({ ...settings, gender: gender as VoiceGender });
  };

  const handlePitchChange = (pitch: string) => {
    onUpdate({ ...settings, pitch: pitch as VoicePitch });
  };

  const handleSpeedChange = (speed: string) => {
    onUpdate({ ...settings, speed: speed as VoiceSpeed });
  };

  const handleVolumeChange = (value: number[]) => {
    onUpdate({ ...settings, volume: value[0] });
  };

  const handleVoiceChange = (voiceName: string) => {
    onUpdate({ ...settings, voiceName });
  };

  const handleSSMLToggle = (enableSSML: boolean) => {
    onUpdate({ ...settings, enableSSML });
  };

  const handleApplyPreset = (preset: typeof VOICE_PRESETS[0]) => {
    onUpdate({
      ...settings,
      gender: preset.gender,
      pitch: preset.pitch,
      speed: preset.speed,
      volume: preset.volume,
    });
    toast.success(`Applied ${preset.name} voice preset!`);
  };

  if (!isSupported) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SpeakerSimpleX size={24} weight="bold" className="text-destructive" />
            Voice Synthesis Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support the Web Speech API. Please use a modern browser like Chrome, Edge, or Safari.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const femaleVoices = availableVoices.filter(v => 
    v.name.toLowerCase().includes('female') || 
    v.name.toLowerCase().includes('woman') ||
    v.name.toLowerCase().includes('samantha') ||
    v.name.toLowerCase().includes('zira')
  );

  const maleVoices = availableVoices.filter(v => 
    v.name.toLowerCase().includes('male') || 
    v.name.toLowerCase().includes('man') ||
    v.name.toLowerCase().includes('david')
  );

  const relevantVoices = settings.gender === 'female' 
    ? femaleVoices 
    : settings.gender === 'male' 
    ? maleVoices 
    : availableVoices.filter(v => v.lang.startsWith('en'));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <SpeakerHigh size={24} weight="bold" className="text-primary" />
            </div>
            <div>
              <CardTitle>Voice Synthesis (Text-to-Speech)</CardTitle>
              <CardDescription>Configure Nova's voice and speech settings</CardDescription>
            </div>
          </div>
          <Badge variant={settings.enabled ? "default" : "secondary"} className="px-3 py-1">
            {settings.enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="voice-enabled" className="text-base font-medium">
              Enable Voice Synthesis
            </Label>
            <p className="text-sm text-muted-foreground">
              Make Nova speak responses out loud
            </p>
          </div>
          <Switch
            id="voice-enabled"
            checked={settings.enabled}
            onCheckedChange={handleToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="ssml-enabled" className="text-base font-medium">
              Enable SSML Support
            </Label>
            <p className="text-sm text-muted-foreground">
              Advanced speech control with pauses, emphasis, and pitch
            </p>
          </div>
          <Switch
            id="ssml-enabled"
            checked={settings.enableSSML ?? true}
            onCheckedChange={handleSSMLToggle}
          />
        </div>

        {settings.enabled && (
          <>
            <Card className="border-accent/30 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkle size={20} weight="fill" className="text-accent" />
                  <CardTitle className="text-lg">Voice Presets</CardTitle>
                </div>
                <CardDescription>Quick voice configurations for different styles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {VOICE_PRESETS.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      size="sm"
                      className="h-auto flex-col gap-1 p-3 hover:bg-primary/10 hover:border-primary/50"
                      onClick={() => handleApplyPreset(preset)}
                    >
                      <span className="font-semibold text-sm">{preset.name}</span>
                      <span className="text-xs opacity-70 text-center">
                        {preset.description}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Label htmlFor="voice-gender">Voice Gender</Label>
              <Select value={settings.gender} onValueChange={handleGenderChange}>
                <SelectTrigger id="voice-gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {relevantVoices.length > 0 && (
              <div className="space-y-3">
                <Label htmlFor="voice-name">Specific Voice</Label>
                <Select value={settings.voiceName || ''} onValueChange={handleVoiceChange}>
                  <SelectTrigger id="voice-name">
                    <SelectValue placeholder="Auto-select (Recommended)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Auto-select (Recommended)</SelectItem>
                    {relevantVoices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {relevantVoices.length} compatible voice{relevantVoices.length !== 1 ? 's' : ''} available
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="voice-pitch">Pitch</Label>
              <Select value={settings.pitch} onValueChange={handlePitchChange}>
                <SelectTrigger id="voice-pitch">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very-low">Very Low (0.6x)</SelectItem>
                  <SelectItem value="low">Low (0.8x)</SelectItem>
                  <SelectItem value="normal">Normal (1.0x)</SelectItem>
                  <SelectItem value="high">High (1.3x)</SelectItem>
                  <SelectItem value="very-high">Very High (1.6x)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="voice-speed">Speed</Label>
              <Select value={settings.speed} onValueChange={handleSpeedChange}>
                <SelectTrigger id="voice-speed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very-slow">Very Slow (0.6x)</SelectItem>
                  <SelectItem value="slow">Slow (0.8x)</SelectItem>
                  <SelectItem value="normal">Normal (1.0x)</SelectItem>
                  <SelectItem value="fast">Fast (1.3x)</SelectItem>
                  <SelectItem value="very-fast">Very Fast (1.6x)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-volume">Volume</Label>
                <span className="text-sm text-muted-foreground">
                  {Math.round(settings.volume * 100)}%
                </span>
              </div>
              <Slider
                id="voice-volume"
                min={0}
                max={1}
                step={0.1}
                value={[settings.volume]}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>

            <Button 
              onClick={onTestVoice}
              className="w-full gap-2"
              variant="outline"
            >
              <Play size={18} weight="fill" />
              Test Voice
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
