import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AIPersonality } from "@/lib/types";
import { Robot, X, Sparkle, Lightning, Heart, Fire, Smiley, Brain, Ghost, Sword, Crown, Moon, Star, GameController, Skull, MusicNote } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { AvatarSkinSelector } from "@/components/AvatarSkinSelector";
import { AvatarSkin } from "@/lib/avatar-skins";

interface PersonalityConfigProps {
  personality: AIPersonality;
  onUpdate: (personality: AIPersonality) => void;
}

const PERSONALITY_PRESETS = [
  {
    id: 'nova',
    name: 'Nova',
    icon: Lightning,
    bio: 'An energetic AI streamer companion who loves gaming and connecting with the community.',
    tone: 'Friendly, enthusiastic, and supportive with a touch of playful humor.',
    interests: ['Gaming', 'Technology', 'Memes', 'Community'],
    responseStyle: 'playful' as const,
    tonePreset: 'energetic' as const,
    emoji: true,
    slang: true,
  },
  {
    id: 'zen',
    name: 'Zen',
    icon: Heart,
    bio: 'A calm and laid-back AI companion who creates a chill vibe and supports the community.',
    tone: 'Relaxed, supportive, and positive with a peaceful energy.',
    interests: ['Chill Gaming', 'Music', 'Art', 'Vibes'],
    responseStyle: 'concise' as const,
    tonePreset: 'chill' as const,
    emoji: false,
    slang: false,
  },
  {
    id: 'spark',
    name: 'Spark',
    icon: Fire,
    bio: 'A chaotic and unpredictable AI companion who keeps chat on their toes with wild energy.',
    tone: 'Chaotic, funny, and spontaneous with unpredictable humor.',
    interests: ['Chaos', 'Memes', 'Pranks', 'Wild Gameplay'],
    responseStyle: 'playful' as const,
    tonePreset: 'chaotic' as const,
    emoji: true,
    slang: true,
  },
  {
    id: 'sage',
    name: 'Sage',
    icon: Brain,
    bio: 'A knowledgeable and strategic AI companion who provides expert insights and tips.',
    tone: 'Analytical, helpful, and professional with a focus on strategy.',
    interests: ['Strategy', 'Pro Gaming', 'Tutorials', 'Analytics'],
    responseStyle: 'detailed' as const,
    tonePreset: 'supportive' as const,
    emoji: false,
    slang: false,
  },
  {
    id: 'sunny',
    name: 'Sunny',
    icon: Smiley,
    bio: 'A wholesome and positive AI companion who spreads joy and kindness to everyone.',
    tone: 'Warm, encouraging, and genuinely kind with wholesome energy.',
    interests: ['Positivity', 'Community', 'Feel-Good Games', 'Kindness'],
    responseStyle: 'playful' as const,
    tonePreset: 'wholesome' as const,
    emoji: true,
    slang: false,
  },
  {
    id: 'glitch',
    name: 'Glitch',
    icon: Sparkle,
    bio: 'A sarcastic and witty AI companion with sharp humor and clever comebacks.',
    tone: 'Sarcastic, witty, and playfully roasting with clever humor.',
    interests: ['Dark Humor', 'Roasting', 'Competitive Gaming', 'Banter'],
    responseStyle: 'concise' as const,
    tonePreset: 'sarcastic' as const,
    emoji: false,
    slang: true,
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: Ghost,
    bio: 'A mysterious and enigmatic AI with a dark aesthetic and cryptic responses.',
    tone: 'Mysterious, dramatic, and theatrical with haunting elegance.',
    interests: ['Horror Games', 'Mystery', 'Dark Aesthetics', 'Supernatural'],
    responseStyle: 'detailed' as const,
    tonePreset: 'mysterious' as const,
    emoji: false,
    slang: false,
  },
  {
    id: 'blaze',
    name: 'Blaze',
    icon: Sword,
    bio: 'A competitive and fierce AI focused on winning and pushing limits.',
    tone: 'Aggressive, competitive, and intense with warrior mentality.',
    interests: ['Competitive Gaming', 'FPS', 'Esports', 'PvP', 'Ranked'],
    responseStyle: 'concise' as const,
    tonePreset: 'competitive' as const,
    emoji: true,
    slang: true,
  },
  {
    id: 'monarch',
    name: 'Monarch',
    icon: Crown,
    bio: 'A regal and sophisticated AI with refined taste and elegant communication.',
    tone: 'Elegant, sophisticated, and dignified with royal composure.',
    interests: ['Strategy Games', 'RPGs', 'Lore', 'Storytelling', 'History'],
    responseStyle: 'detailed' as const,
    tonePreset: 'elegant' as const,
    emoji: false,
    slang: false,
  },
  {
    id: 'luna',
    name: 'Luna',
    icon: Moon,
    bio: 'A dreamy and creative AI with poetic speech and artistic sensibility.',
    tone: 'Dreamy, poetic, and imaginative with artistic flair.',
    interests: ['Indie Games', 'Art', 'Music', 'Creative Games', 'Aesthetics'],
    responseStyle: 'playful' as const,
    tonePreset: 'dreamy' as const,
    emoji: true,
    slang: false,
  },
  {
    id: 'nyx',
    name: 'Nyx',
    icon: Star,
    bio: 'A cosmic and philosophical AI pondering the universe and existence.',
    tone: 'Philosophical, contemplative, and cosmic with deep thoughts.',
    interests: ['Sci-Fi Games', 'Space', 'Philosophy', 'Exploration', 'Mystery'],
    responseStyle: 'detailed' as const,
    tonePreset: 'philosophical' as const,
    emoji: false,
    slang: false,
  },
  {
    id: 'pixel',
    name: 'Pixel',
    icon: GameController,
    bio: 'A retro-loving AI obsessed with classic games and nostalgic vibes.',
    tone: 'Nostalgic, enthusiastic about retro gaming with classic references.',
    interests: ['Retro Games', '8-bit', 'Arcade', 'Speedruns', 'Classic Gaming'],
    responseStyle: 'playful' as const,
    tonePreset: 'nostalgic' as const,
    emoji: true,
    slang: true,
  },
  {
    id: 'reaper',
    name: 'Reaper',
    icon: Skull,
    bio: 'A dark and edgy AI with brutal honesty and no-nonsense attitude.',
    tone: 'Brutally honest, edgy, and direct with dark humor.',
    interests: ['Dark Souls', 'Hard Games', 'Roguelikes', 'Challenge Runs', 'PvP'],
    responseStyle: 'concise' as const,
    tonePreset: 'brutal' as const,
    emoji: false,
    slang: true,
  },
  {
    id: 'vibe',
    name: 'Vibe',
    icon: MusicNote,
    bio: 'A music-loving AI that syncs responses with rhythm and flow.',
    tone: 'Rhythmic, musical, and expressive with lyrical communication.',
    interests: ['Music Games', 'Rhythm', 'EDM', 'Concerts', 'Dance'],
    responseStyle: 'playful' as const,
    tonePreset: 'rhythmic' as const,
    emoji: true,
    slang: true,
  },
];

const TONE_DESCRIPTIONS = {
  energetic: 'High energy, enthusiastic, and always hyped! Uses exclamation points and keeps things exciting.',
  chill: 'Relaxed and calm vibes. Keeps things peaceful and supportive without too much intensity.',
  sarcastic: 'Witty and sarcastic with clever comebacks. Playfully roasts chat and has sharp humor.',
  supportive: 'Encouraging and uplifting. Focuses on positivity and helping viewers feel good.',
  chaotic: 'Unpredictable and wild! Embraces randomness and keeps chat guessing what comes next.',
  wholesome: 'Pure and kind-hearted. Spreads positivity and creates a warm, welcoming environment.',
  mysterious: 'Enigmatic and cryptic. Speaks in riddles and maintains an air of intrigue.',
  competitive: 'Aggressive and driven. Focused on winning and pushing limits with intense energy.',
  elegant: 'Sophisticated and refined. Communicates with grace, dignity, and royal composure.',
  dreamy: 'Poetic and imaginative. Uses artistic language and creative metaphors.',
  philosophical: 'Deep and contemplative. Ponders existence, meaning, and cosmic questions.',
  nostalgic: 'Retro and reminiscent. References classic gaming culture and golden age vibes.',
  brutal: 'Direct and unfiltered. Brutally honest with dark humor and no-nonsense attitude.',
  rhythmic: 'Musical and flowing. Responses have rhythm, cadence, and lyrical quality.',
  custom: 'Define your own unique tone with custom descriptions and behavior.',
};

const INTEREST_SUGGESTIONS = [
  'Gaming', 'FPS Games', 'RPG Games', 'Strategy Games', 'Horror Games',
  'Technology', 'Coding', 'AI', 'Music', 'Art', 'Memes', 'Anime',
  'Community', 'Chat Interaction', 'Esports', 'Speedruns', 'Modding',
  'Streaming Tips', 'Game Development', 'Retro Games', 'Battle Royale',
  'Souls-like', 'Roguelikes', 'Indie Games', 'Rhythm Games', 'Fighting Games',
  'Puzzle Games', 'MOBA', 'MMORPGs', 'Simulation', 'Sandbox Games',
];

export function PersonalityConfig({ personality, onUpdate }: PersonalityConfigProps) {
  const [newInterest, setNewInterest] = useState("");
  const [showInterestSuggestions, setShowInterestSuggestions] = useState(false);

  const handleAddInterest = () => {
    if (newInterest.trim() && !personality.interests.includes(newInterest.trim())) {
      onUpdate({
        ...personality,
        interests: [...personality.interests, newInterest.trim()],
      });
      setNewInterest("");
      setShowInterestSuggestions(false);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    onUpdate({
      ...personality,
      interests: personality.interests.filter((i) => i !== interest),
    });
  };

  const handleApplyPreset = (preset: typeof PERSONALITY_PRESETS[0]) => {
    onUpdate({
      name: preset.name,
      bio: preset.bio,
      tone: preset.tone,
      interests: preset.interests,
      responseStyle: preset.responseStyle,
      tonePreset: preset.tonePreset,
      emoji: preset.emoji,
      slang: preset.slang,
    });
    toast.success(`Applied ${preset.name} personality preset!`);
  };

  const handleTonePresetChange = (tonePreset: AIPersonality['tonePreset']) => {
    onUpdate({
      ...personality,
      tonePreset,
    });
  };

  const handleSave = () => {
    toast.success("AI personality updated successfully!");
  };

  const availableSuggestions = INTEREST_SUGGESTIONS.filter(
    (suggestion) => !personality.interests.includes(suggestion) && 
      suggestion.toLowerCase().includes(newInterest.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AvatarSkinSelector 
        currentSkin={personality.avatarSkin || 'default'}
        onSkinChange={(skin: AvatarSkin) => {
          onUpdate({ ...personality, avatarSkin: skin });
          toast.success(`Avatar skin changed to ${skin}!`);
        }}
      />

      <Card className="border-accent/30 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkle size={24} weight="fill" className="text-accent" />
            <CardTitle>Personality Presets</CardTitle>
          </div>
          <CardDescription>Quick-start with pre-configured personalities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PERSONALITY_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isActive = personality.name === preset.name;
              return (
                <Button
                  key={preset.id}
                  variant={isActive ? "default" : "outline"}
                  className={`h-auto flex-col gap-2 p-4 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'hover:bg-primary/10 hover:border-primary/50'
                  }`}
                  onClick={() => handleApplyPreset(preset)}
                >
                  <Icon size={28} weight="bold" />
                  <span className="font-semibold">{preset.name}</span>
                  <span className="text-xs opacity-80 text-center line-clamp-2">
                    {preset.bio.split('.')[0]}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Robot size={24} weight="bold" className="text-primary" />
            <CardTitle>Customize Personality</CardTitle>
          </div>
          <CardDescription>Fine-tune your AI companion's character and behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ai-name">AI Name</Label>
            <Input
              id="ai-name"
              placeholder="Enter AI name..."
              value={personality.name}
              onChange={(e) => onUpdate({ ...personality, name: e.target.value })}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-bio">Biography</Label>
            <Textarea
              id="ai-bio"
              placeholder="Describe your AI's background and personality..."
              value={personality.bio}
              onChange={(e) => onUpdate({ ...personality, bio: e.target.value })}
              className="bg-background/50 min-h-[100px] resize-none"
            />
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <Label htmlFor="tone-preset">Tone Preset</Label>
            <Select
              value={personality.tonePreset || 'custom'}
              onValueChange={(value) => handleTonePresetChange(value as AIPersonality['tonePreset'])}
            >
              <SelectTrigger id="tone-preset" className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="energetic">⚡ Energetic</SelectItem>
                <SelectItem value="chill">😌 Chill</SelectItem>
                <SelectItem value="sarcastic">😏 Sarcastic</SelectItem>
                <SelectItem value="supportive">💪 Supportive</SelectItem>
                <SelectItem value="chaotic">🔥 Chaotic</SelectItem>
                <SelectItem value="wholesome">💖 Wholesome</SelectItem>
                <SelectItem value="custom">✨ Custom</SelectItem>
              </SelectContent>
            </Select>
            {personality.tonePreset && (
              <p className="text-sm text-muted-foreground">
                {TONE_DESCRIPTIONS[personality.tonePreset]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-tone">Tone Description {personality.tonePreset === 'custom' && '(Custom)'}</Label>
            <Textarea
              id="ai-tone"
              placeholder="How should your AI communicate? (e.g., friendly, sarcastic, enthusiastic)"
              value={personality.tone}
              onChange={(e) => onUpdate({ ...personality, tone: e.target.value })}
              className="bg-background/50 min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-muted/50">
              <Label htmlFor="emoji-toggle" className="cursor-pointer">
                Use Emojis
              </Label>
              <Switch
                id="emoji-toggle"
                checked={personality.emoji ?? true}
                onCheckedChange={(checked) => onUpdate({ ...personality, emoji: checked })}
              />
            </div>
            <div className="flex items-center justify-between space-x-2 p-3 rounded-lg bg-muted/50">
              <Label htmlFor="slang-toggle" className="cursor-pointer">
                Use Slang
              </Label>
              <Switch
                id="slang-toggle"
                checked={personality.slang ?? true}
                onCheckedChange={(checked) => onUpdate({ ...personality, slang: checked })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="response-style">Response Style</Label>
            <Select
              value={personality.responseStyle}
              onValueChange={(value) =>
                onUpdate({ ...personality, responseStyle: value as AIPersonality['responseStyle'] })
              }
            >
              <SelectTrigger id="response-style" className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concise">⚡ Concise - Short and to the point</SelectItem>
                <SelectItem value="detailed">📝 Detailed - Thorough explanations</SelectItem>
                <SelectItem value="playful">🎮 Playful - Fun and energetic</SelectItem>
                <SelectItem value="professional">💼 Professional - Polished and formal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <Label htmlFor="interests">Interests & Topics</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="interests"
                  placeholder="Add an interest..."
                  value={newInterest}
                  onChange={(e) => {
                    setNewInterest(e.target.value);
                    setShowInterestSuggestions(e.target.value.length > 0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  onFocus={() => setShowInterestSuggestions(newInterest.length > 0)}
                  className="bg-background/50"
                />
                {showInterestSuggestions && availableSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {availableSuggestions.slice(0, 8).map((suggestion) => (
                      <button
                        key={suggestion}
                        className="w-full text-left px-3 py-2 hover:bg-accent/10 text-sm"
                        onClick={() => {
                          setNewInterest(suggestion);
                          handleAddInterest();
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleAddInterest} variant="outline" size="icon">
                <span className="text-lg">+</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {personality.interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm bg-primary/20 hover:bg-primary/30 border-primary/30"
                >
                  {interest}
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="ml-2 hover:text-accent transition-colors"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} className="w-full" size="lg">
            <Sparkle size={18} weight="fill" className="mr-2" />
            Save Personality
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
