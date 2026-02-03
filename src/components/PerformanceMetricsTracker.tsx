import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PerformanceMetric, PerformanceSession } from "@/lib/types";
import { Play, Stop, TrendUp, Target, Fire, Timer, ChartLine } from "@phosphor-icons/react";
import { toast } from "sonner";

interface PerformanceMetricsTrackerProps {
  isTracking: boolean;
  onToggleTracking: () => void;
  currentSession: PerformanceSession | null;
  latestMetric?: PerformanceMetric;
}

export function PerformanceMetricsTracker({
  isTracking,
  onToggleTracking,
  currentSession,
  latestMetric,
}: PerformanceMetricsTrackerProps) {
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    if (isTracking && currentSession) {
      const interval = setInterval(() => {
        const duration = Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000);
        setSessionDuration(duration);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTracking, currentSession]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAPMColor = (apm: number) => {
    if (apm >= 200) return "text-accent";
    if (apm >= 100) return "text-primary";
    if (apm >= 50) return "text-secondary";
    return "text-muted-foreground";
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-accent";
    if (accuracy >= 60) return "text-primary";
    if (accuracy >= 40) return "text-secondary";
    return "text-destructive";
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ChartLine size={24} weight="bold" className="text-primary" />
              Performance Metrics Tracker
            </CardTitle>
            <CardDescription>
              Real-time APM, accuracy, and combo tracking with AI analysis
            </CardDescription>
          </div>
          <Button
            onClick={onToggleTracking}
            variant={isTracking ? "destructive" : "default"}
            className="gap-2"
          >
            {isTracking ? (
              <>
                <Stop size={18} weight="fill" />
                Stop Tracking
              </>
            ) : (
              <>
                <Play size={18} weight="fill" />
                Start Tracking
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isTracking && !currentSession && (
          <div className="text-center py-12 text-muted-foreground">
            <ChartLine size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No Active Tracking Session</p>
            <p className="text-sm mt-2">Click "Start Tracking" to begin monitoring your gameplay performance</p>
          </div>
        )}

        {currentSession && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div>
                <p className="text-sm text-muted-foreground">Current Session</p>
                <p className="text-xl font-bold">{currentSession.game || "Unknown Game"}</p>
                <Badge variant="outline" className="mt-1">{currentSession.gameType}</Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Timer size={16} />
                  Session Time
                </p>
                <p className="text-2xl font-bold font-mono">{formatDuration(sessionDuration)}</p>
              </div>
            </div>

            {latestMetric && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-muted-foreground">APM</p>
                      <TrendUp size={18} className={getAPMColor(latestMetric.apm)} />
                    </div>
                    <p className={`text-4xl font-bold ${getAPMColor(latestMetric.apm)}`}>
                      {latestMetric.apm.toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Actions Per Minute</p>
                    <Progress 
                      value={Math.min((latestMetric.apm / 300) * 100, 100)} 
                      className="mt-2 h-1.5"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                      <Target size={18} className={getAccuracyColor(latestMetric.accuracy)} />
                    </div>
                    <p className={`text-4xl font-bold ${getAccuracyColor(latestMetric.accuracy)}`}>
                      {latestMetric.accuracy.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Hit Rate</p>
                    <Progress 
                      value={latestMetric.accuracy} 
                      className="mt-2 h-1.5"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-muted-foreground">Combo</p>
                      <Fire size={18} className="text-accent" />
                    </div>
                    <p className="text-4xl font-bold text-accent">
                      {latestMetric.combo}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Max: {currentSession.maxCombo}
                    </p>
                    <Progress 
                      value={Math.min((latestMetric.combo / Math.max(currentSession.maxCombo, 1)) * 100, 100)} 
                      className="mt-2 h-1.5"
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Avg APM</p>
                <p className="text-2xl font-bold">{currentSession.averageAPM.toFixed(0)}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Avg Accuracy</p>
                <p className="text-2xl font-bold">{currentSession.averageAccuracy.toFixed(1)}%</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Total Actions</p>
                <p className="text-2xl font-bold">{currentSession.totalActions}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Max Combo</p>
                <p className="text-2xl font-bold">{currentSession.maxCombo}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
