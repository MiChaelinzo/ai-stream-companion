import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PerformanceSession } from "@/lib/types";
import { Play, GameController } from "@phosphor-icons/react";
import { useState } from "react";

interface PerformanceSessionManagerProps {
  onStartSession: (game: string, gameType: PerformanceSession['gameType']) => void;
  isTracking: boolean;
}

export function PerformanceSessionManager({
  onStartSession,
  isTracking,
}: PerformanceSessionManagerProps) {
  const [game, setGame] = useState("");
  const [gameType, setGameType] = useState<PerformanceSession['gameType']>("fps");

  const handleStart = () => {
    if (game.trim()) {
      onStartSession(game, gameType);
      setGame("");
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GameController size={24} weight="bold" className="text-primary" />
          Session Configuration
        </CardTitle>
        <CardDescription>
          Configure your gameplay session for accurate performance tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="game-name">Game Name</Label>
          <Input
            id="game-name"
            placeholder="e.g., Valorant, League of Legends, Street Fighter 6"
            value={game}
            onChange={(e) => setGame(e.target.value)}
            disabled={isTracking}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="game-type">Game Type</Label>
          <Select
            value={gameType}
            onValueChange={(value) => setGameType(value as PerformanceSession['gameType'])}
            disabled={isTracking}
          >
            <SelectTrigger id="game-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fps">FPS (First-Person Shooter)</SelectItem>
              <SelectItem value="moba">MOBA (Multiplayer Online Battle Arena)</SelectItem>
              <SelectItem value="fighting">Fighting</SelectItem>
              <SelectItem value="racing">Racing</SelectItem>
              <SelectItem value="rhythm">Rhythm</SelectItem>
              <SelectItem value="strategy">Strategy/RTS</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleStart}
          disabled={!game.trim() || isTracking}
          className="w-full gap-2"
        >
          <Play size={18} weight="fill" />
          Start Performance Session
        </Button>

        {isTracking && (
          <p className="text-xs text-muted-foreground text-center">
            Session active. Stop tracking to start a new session.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
