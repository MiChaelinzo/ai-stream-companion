import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SkillProgress } from "@/lib/types";
import { Trophy, TrendUp, TrendDown, Circle, CheckCircle, Clock, Target } from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";
import { safeParseDate } from "@/lib/utils";

interface SkillProgressDashboardProps {
  skillData: SkillProgress[];
}

export function SkillProgressDashboard({ skillData }: SkillProgressDashboardProps) {
  const getTrendIcon = (trend: SkillProgress['trend']) => {
    switch (trend) {
      case 'improving':
        return <TrendUp size={16} className="text-accent" />;
      case 'declining':
        return <TrendDown size={16} className="text-destructive" />;
      case 'stable':
        return <Circle size={16} className="text-secondary" />;
    }
  };

  const getSkillRatingColor = (rating: number) => {
    if (rating >= 80) return "text-accent";
    if (rating >= 60) return "text-primary";
    if (rating >= 40) return "text-secondary";
    return "text-muted-foreground";
  };

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy size={24} weight="bold" className="text-primary" />
          Skill Progress & Achievements
        </CardTitle>
        <CardDescription>
          Track your performance improvement across different games
        </CardDescription>
      </CardHeader>
      <CardContent>
        {skillData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No Skill Data Yet</p>
            <p className="text-sm mt-2">Complete gameplay sessions to build your skill profile</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {skillData.map((skill, index) => (
                <Card key={index} className="bg-gradient-to-br from-card to-card/50 border-border/50">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold">{skill.game}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{skill.gameType}</Badge>
                          {getTrendIcon(skill.trend)}
                          <span className="text-xs text-muted-foreground capitalize">{skill.trend}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Skill Rating</p>
                        <p className={`text-3xl font-bold ${getSkillRatingColor(skill.skillRating)}`}>
                          {skill.skillRating.toFixed(0)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Sessions Played</p>
                        <p className="text-xl font-bold">{skill.sessionsPlayed}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total Play Time</p>
                        <p className="text-xl font-bold">{formatPlayTime(skill.totalPlayTime)}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-muted-foreground">Average APM</p>
                          <p className="text-sm font-bold">{skill.averageAPM.toFixed(0)}</p>
                        </div>
                        <Progress value={Math.min((skill.averageAPM / 300) * 100, 100)} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-muted-foreground">Average Accuracy</p>
                          <p className="text-sm font-bold">{skill.averageAccuracy.toFixed(1)}%</p>
                        </div>
                        <Progress value={skill.averageAccuracy} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-muted-foreground">Max Combo</p>
                          <p className="text-sm font-bold">{skill.maxCombo}</p>
                        </div>
                        <Progress value={Math.min((skill.maxCombo / 100) * 100, 100)} className="h-2" />
                      </div>
                    </div>

                    {skill.milestones.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                          <Target size={14} />
                          Milestones
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {skill.milestones.map((milestone, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${
                                milestone.achieved
                                  ? "bg-accent/10 border-accent/30 text-accent"
                                  : "bg-muted/30 border-border/50 text-muted-foreground"
                              }`}
                            >
                              {milestone.achieved ? (
                                <CheckCircle size={14} weight="fill" />
                              ) : (
                                <Circle size={14} />
                              )}
                              <span className="font-medium truncate">{milestone.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
                      <Clock size={14} />
                      Last played {formatDistanceToNow(safeParseDate(skill.lastPlayed), { addSuffix: true })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
