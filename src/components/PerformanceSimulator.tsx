import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Play, Stop, Info } from "@phosphor-icons/react";
import { useState } from "react";

interface PerformanceSimulatorProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  simulationSpeed: number;
  onSpeedChange: (speed: number) => void;
  skillLevel: number;
  onSkillLevelChange: (level: number) => void;
}

export function PerformanceSimulator({
  isSimulating,
  onToggleSimulation,
  simulationSpeed,
  onSpeedChange,
  skillLevel,
  onSkillLevelChange,
}: PerformanceSimulatorProps) {
  const getSkillLabel = (level: number) => {
    if (level >= 80) return "Professional";
    if (level >= 60) return "Advanced";
    if (level >= 40) return "Intermediate";
    if (level >= 20) return "Beginner";
    return "Novice";
  };

  const getSkillColor = (level: number) => {
    if (level >= 80) return "text-accent";
    if (level >= 60) return "text-primary";
    if (level >= 40) return "text-secondary";
    return "text-muted-foreground";
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play size={24} weight="bold" className="text-primary" />
          Performance Simulator
          {isSimulating && (
            <Badge className="bg-accent/20 text-accent border-accent/30">
              <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
              Simulating
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Generate realistic performance metrics for testing and demonstration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-accent/10 border-accent/30">
          <Info size={20} className="text-accent" />
          <AlertDescription className="text-sm">
            <strong className="text-accent">Test Mode:</strong> This simulator generates realistic gameplay metrics. Use it to test AI coaching and see how the system responds to different skill levels.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Simulated Skill Level</Label>
              <span className={`text-sm font-bold ${getSkillColor(skillLevel)}`}>
                {getSkillLabel(skillLevel)} ({skillLevel})
              </span>
            </div>
            <Slider
              value={[skillLevel]}
              onValueChange={(value) => onSkillLevelChange(value[0])}
              min={0}
              max={100}
              step={5}
              disabled={isSimulating}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Novice</span>
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Advanced</span>
              <span>Pro</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Simulation Speed</Label>
              <span className="text-sm font-bold">
                {simulationSpeed}x
              </span>
            </div>
            <Slider
              value={[simulationSpeed]}
              onValueChange={(value) => onSpeedChange(value[0])}
              min={1}
              max={10}
              step={1}
              disabled={isSimulating}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Controls how frequently metrics are generated (1x = every 2 seconds)
            </p>
          </div>
        </div>

        <Button
          onClick={onToggleSimulation}
          variant={isSimulating ? "destructive" : "default"}
          className="w-full gap-2"
          size="lg"
        >
          {isSimulating ? (
            <>
              <Stop size={20} weight="fill" />
              Stop Simulation
            </>
          ) : (
            <>
              <Play size={20} weight="fill" />
              Start Simulation
            </>
          )}
        </Button>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Expected APM</p>
            <p className="text-lg font-bold">
              {Math.floor(50 + (skillLevel / 100) * 250)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Expected Accuracy</p>
            <p className="text-lg font-bold">
              {Math.floor(30 + (skillLevel / 100) * 65)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Avg Combo</p>
            <p className="text-lg font-bold">
              {Math.floor(3 + (skillLevel / 100) * 47)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
