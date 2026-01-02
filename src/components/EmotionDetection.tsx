import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChatMessage, EmotionAnalysis } from "@/lib/types";
import { Heart, Lightning, WarningCircle, Question, Star } from "@phosphor-icons/react";
import { useMemo } from "react";

interface EmotionDetectionProps {
  messages: ChatMessage[];
}

export function EmotionDetection({ messages }: EmotionDetectionProps) {
  const emotions: EmotionAnalysis = useMemo(() => {
    if (messages.length === 0) {
      return {
        joy: 0,
        excitement: 0,
        frustration: 0,
        confusion: 0,
        appreciation: 0,
      };
    }

    const recentMessages = messages.slice(-30);
    const totalMessages = recentMessages.length;

    const emotionKeywords = {
      joy: ['lol', 'haha', 'happy', 'love', 'amazing', 'awesome', 'great', 'perfect', 'nice', '😂', '😄', '😊', '❤️'],
      excitement: ['wow', 'omg', 'yes', 'epic', 'insane', 'crazy', 'hype', 'let\'s go', 'poggers', 'pog', '🔥', '⚡', '!'],
      frustration: ['no', 'why', 'bad', 'worst', 'terrible', 'annoying', 'broken', 'fix', 'nerf', '😡', '😤', '💢'],
      confusion: ['what', 'how', 'huh', '?', 'confused', 'understand', 'explain', 'idk', '🤔', '❓'],
      appreciation: ['thanks', 'thank you', 'appreciate', 'good job', 'well done', 'respect', 'gg', 'wp', '👏', '🙏', '💯'],
    };

    const scores = {
      joy: 0,
      excitement: 0,
      frustration: 0,
      confusion: 0,
      appreciation: 0,
    };

    recentMessages.forEach(msg => {
      const content = msg.content.toLowerCase();
      
      (Object.keys(emotionKeywords) as Array<keyof typeof emotionKeywords>).forEach(emotion => {
        const keywords = emotionKeywords[emotion];
        const matchCount = keywords.filter(keyword => content.includes(keyword)).length;
        scores[emotion] += matchCount;
      });

      if (msg.sentiment === 'positive') {
        scores.joy += 0.5;
        scores.appreciation += 0.3;
      } else if (msg.sentiment === 'negative') {
        scores.frustration += 0.5;
      }
    });

    const maxScore = Math.max(...Object.values(scores), 1);

    return {
      joy: (scores.joy / maxScore) * 100,
      excitement: (scores.excitement / maxScore) * 100,
      frustration: (scores.frustration / maxScore) * 100,
      confusion: (scores.confusion / maxScore) * 100,
      appreciation: (scores.appreciation / maxScore) * 100,
    };
  }, [messages]);

  const emotionData = [
    { 
      name: 'Joy', 
      value: emotions.joy, 
      icon: <Heart size={18} weight="fill" className="text-pink-500" />,
      color: 'bg-pink-500',
      description: 'Happiness and positive vibes'
    },
    { 
      name: 'Excitement', 
      value: emotions.excitement, 
      icon: <Lightning size={18} weight="fill" className="text-yellow-500" />,
      color: 'bg-yellow-500',
      description: 'High energy and hype'
    },
    { 
      name: 'Frustration', 
      value: emotions.frustration, 
      icon: <WarningCircle size={18} weight="fill" className="text-red-500" />,
      color: 'bg-red-500',
      description: 'Negative or annoyed feelings'
    },
    { 
      name: 'Confusion', 
      value: emotions.confusion, 
      icon: <Question size={18} weight="fill" className="text-blue-500" />,
      color: 'bg-blue-500',
      description: 'Uncertainty or questions'
    },
    { 
      name: 'Appreciation', 
      value: emotions.appreciation, 
      icon: <Star size={18} weight="fill" className="text-purple-500" />,
      color: 'bg-purple-500',
      description: 'Gratitude and recognition'
    },
  ];

  const dominantEmotion = emotionData.reduce((max, current) => 
    current.value > max.value ? current : max
  );

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart size={20} weight="fill" className="text-pink-500" />
          Emotion Detection
        </CardTitle>
        <CardDescription>Analyzing emotional patterns in chat messages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Heart size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm">No messages to analyze yet</p>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Dominant Emotion</span>
                <Badge variant="outline" className="bg-card/50">
                  {Math.round(dominantEmotion.value)}%
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center">
                  {dominantEmotion.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{dominantEmotion.name}</h3>
                  <p className="text-xs text-muted-foreground">{dominantEmotion.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {emotionData.map((emotion) => (
                <div key={emotion.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {emotion.icon}
                      <span className="text-sm font-medium">{emotion.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(emotion.value)}%
                    </span>
                  </div>
                  <Progress 
                    value={emotion.value} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-pink-500/10 to-yellow-500/10">
                <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
                  {Math.round(emotions.joy + emotions.excitement)}
                </div>
                <div className="text-xs text-muted-foreground">Positive Energy</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  {Math.round(emotions.appreciation + emotions.confusion)}
                </div>
                <div className="text-xs text-muted-foreground">Engagement Mix</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
