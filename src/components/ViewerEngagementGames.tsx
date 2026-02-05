import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  GameController,
  DiceSix,
  Question,
  Trophy,
  Crown,
  Star,
  Fire,
  Play,
  Stop,
  ArrowsClockwise,
  ChartBar,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { ChatMessage } from "@/lib/types";

interface GameSession {
  id: string;
  gameType: "trivia" | "prediction" | "word-game" | "reaction";
  question: string;
  options?: string[];
  correctAnswer?: string;
  startTime: Date;
  endTime?: Date;
  participants: { username: string; answer: string; correct?: boolean }[];
  winner?: string;
  active: boolean;
}

interface ViewerEngagementGamesProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLive: boolean;
}

export function ViewerEngagementGames({
  messages,
  onSendMessage,
  isLive,
}: ViewerEngagementGamesProps) {
  const [currentGame, setCurrentGame] = useState<GameSession | null>(null);
  const [gameHistory, setGameHistory] = useState<GameSession[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && currentGame?.active) {
      endGame();
    }
  }, [countdown]);

  useEffect(() => {
    if (!currentGame || !currentGame.active) return;

    const recentMessages = messages.slice(-10);
    recentMessages.forEach((msg) => {
      if (msg.sender === "user" && msg.username) {
        processGameResponse(msg);
      }
    });
  }, [messages, currentGame]);

  const processGameResponse = (msg: ChatMessage) => {
    if (!currentGame || !currentGame.active) return;

    const alreadyParticipated = currentGame.participants.some(
      (p) => p.username === msg.username
    );
    if (alreadyParticipated) return;

    let answer = msg.content.trim().toLowerCase();

    if (currentGame.gameType === "trivia" && currentGame.options) {
      const optionMatch = currentGame.options.find((opt) =>
        answer.includes(opt.toLowerCase())
      );
      if (optionMatch) {
        answer = optionMatch;
      }
    }

    setCurrentGame((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        participants: [
          ...prev.participants,
          {
            username: msg.username!,
            answer,
          },
        ],
      };
    });
  };

  const startTriviaGame = async () => {
    setIsGenerating(true);
    try {
      const prompt = (window.spark.llmPrompt as any)`Generate a fun, engaging trivia question for a gaming/streaming audience. 

Return as JSON:
{
  "question": "the trivia question",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option A"
}

Make it gaming or pop culture related, not too hard, fun for chat to participate in!`;

      const response = await window.spark.llm(prompt, "gpt-4o", true);
      const trivia = JSON.parse(response);

      const newGame: GameSession = {
        id: Date.now().toString(),
        gameType: "trivia",
        question: trivia.question,
        options: trivia.options,
        correctAnswer: trivia.correctAnswer,
        startTime: new Date(),
        participants: [],
        active: true,
      };

      setCurrentGame(newGame);
      setCountdown(30);

      onSendMessage(
        `🎮 TRIVIA TIME! ${trivia.question}\n\n${trivia.options.join(" | ")}\n\nType your answer in chat! (30 seconds)`
      );
      toast.success("Trivia game started!");
    } catch (error) {
      toast.error("Failed to generate trivia question");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startPredictionGame = async () => {
    setIsGenerating(true);
    try {
      const prompt = (window.spark.llmPrompt as any)`Generate a fun prediction question for a gaming stream. Something viewers can guess about what will happen next in the game or stream.

Return as JSON:
{
  "question": "the prediction question",
  "options": ["Option A", "Option B", "Option C"]
}

Make it exciting and engaging!`;

      const response = await window.spark.llm(prompt, "gpt-4o", true);
      const prediction = JSON.parse(response);

      const newGame: GameSession = {
        id: Date.now().toString(),
        gameType: "prediction",
        question: prediction.question,
        options: prediction.options,
        startTime: new Date(),
        participants: [],
        active: true,
      };

      setCurrentGame(newGame);
      setCountdown(45);

      onSendMessage(
        `🔮 PREDICTION TIME! ${prediction.question}\n\n${prediction.options.join(" | ")}\n\nMake your prediction in chat! (45 seconds)`
      );
      toast.success("Prediction game started!");
    } catch (error) {
      toast.error("Failed to generate prediction");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startWordGame = async () => {
    setIsGenerating(true);
    try {
      const prompt = (window.spark.llmPrompt as any)`Generate a fun word game challenge for chat. Could be unscrambling a word, completing a phrase, or finding words with specific letters.

Return as JSON:
{
  "question": "the word challenge",
  "correctAnswer": "the answer"
}

Make it fun and not too hard!`;

      const response = await window.spark.llm(prompt, "gpt-4o", true);
      const wordGame = JSON.parse(response);

      const newGame: GameSession = {
        id: Date.now().toString(),
        gameType: "word-game",
        question: wordGame.question,
        correctAnswer: wordGame.correctAnswer.toLowerCase(),
        startTime: new Date(),
        participants: [],
        active: true,
      };

      setCurrentGame(newGame);
      setCountdown(30);

      onSendMessage(`🔤 WORD CHALLENGE! ${wordGame.question}\n\nType your answer in chat! (30 seconds)`);
      toast.success("Word game started!");
    } catch (error) {
      toast.error("Failed to generate word game");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startReactionGame = () => {
    const reactions = ["GG", "HYPE", "POGGERS", "F", "W", "CLUTCH"];
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];

    const newGame: GameSession = {
      id: Date.now().toString(),
      gameType: "reaction",
      question: `First to type "${randomReaction}" wins!`,
      correctAnswer: randomReaction.toLowerCase(),
      startTime: new Date(),
      participants: [],
      active: true,
    };

    setCurrentGame(newGame);
    setCountdown(10);

    onSendMessage(`⚡ REACTION GAME! First person to type "${randomReaction}" wins! GO!`);
    toast.success("Reaction game started!");
  };

  const endGame = () => {
    if (!currentGame) return;

    let winner: string | undefined;
    let results = "";

    if (currentGame.gameType === "trivia" || currentGame.gameType === "word-game") {
      const correctParticipants = currentGame.participants.filter(
        (p) => p.answer.toLowerCase() === currentGame.correctAnswer?.toLowerCase()
      );

      if (correctParticipants.length > 0) {
        winner = correctParticipants[0].username;
        results = `🎉 ${winner} got it right! The answer was: ${currentGame.correctAnswer}`;
      } else {
        results = `⏰ Time's up! The correct answer was: ${currentGame.correctAnswer}. Better luck next time!`;
      }
    } else if (currentGame.gameType === "reaction") {
      if (currentGame.participants.length > 0) {
        winner = currentGame.participants[0].username;
        results = `⚡ ${winner} was the fastest! Lightning reflexes! 🏆`;
      } else {
        results = `⏰ No one got it in time! Try to be faster next time!`;
      }
    } else if (currentGame.gameType === "prediction") {
      results = `🔮 Predictions are in! ${currentGame.participants.length} viewers participated. Stay tuned to see who was right!`;
    }

    const completedGame: GameSession = {
      ...currentGame,
      endTime: new Date(),
      active: false,
      winner,
    };

    setGameHistory((prev) => [completedGame, ...prev].slice(0, 20));
    setCurrentGame(null);
    setCountdown(0);

    onSendMessage(results);
    toast.success("Game ended!");
  };

  const cancelGame = () => {
    if (currentGame) {
      const cancelledGame: GameSession = {
        ...currentGame,
        endTime: new Date(),
        active: false,
      };
      setGameHistory((prev) => [cancelledGame, ...prev].slice(0, 20));
      setCurrentGame(null);
      setCountdown(0);
      onSendMessage("Game cancelled!");
      toast.info("Game cancelled");
    }
  };

  const gameStats = {
    totalGames: gameHistory.length,
    totalParticipants: gameHistory.reduce((sum, game) => sum + game.participants.length, 0),
    averageParticipants:
      gameHistory.length > 0
        ? (
            gameHistory.reduce((sum, game) => sum + game.participants.length, 0) /
            gameHistory.length
          ).toFixed(1)
        : 0,
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GameController size={24} weight="bold" className="text-accent" />
              Viewer Engagement Games
            </CardTitle>
            <CardDescription>Interactive mini-games to boost chat engagement</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1">
              <Trophy size={14} />
              {gameStats.totalGames} played
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isLive && (
          <Alert className="bg-muted/50 border-muted">
            <GameController size={20} className="text-muted-foreground" />
            <AlertDescription>
              Start monitoring or simulation to enable viewer games
            </AlertDescription>
          </Alert>
        )}

        {currentGame && currentGame.active ? (
          <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 border-2 border-accent/50">
            <div className="flex items-center justify-between">
              <Badge className="bg-accent/30 text-accent border-accent/50 text-sm px-3 py-1">
                <Play size={16} weight="fill" className="mr-2" />
                Game Active
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-accent">{countdown}s</span>
                <Button variant="ghost" size="sm" onClick={cancelGame}>
                  <Stop size={16} />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-lg">{currentGame.question}</h4>
              {currentGame.options && (
                <div className="flex flex-wrap gap-2">
                  {currentGame.options.map((option, i) => (
                    <Badge key={i} variant="outline">
                      {option}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Time Remaining</span>
                <span className="font-semibold">{countdown}s / 30s</span>
              </div>
              <Progress value={(countdown / 30) * 100} className="h-2" />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Star size={16} className="text-accent" />
              <span>
                <strong>{currentGame.participants.length}</strong> participants so far
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={startTriviaGame}
              disabled={!isLive || isGenerating}
              className="h-auto p-4 flex-col gap-2"
              variant="outline"
            >
              <Question size={24} weight="bold" />
              <span className="font-semibold">Trivia</span>
              <span className="text-xs text-muted-foreground">AI-generated questions</span>
            </Button>

            <Button
              onClick={startPredictionGame}
              disabled={!isLive || isGenerating}
              className="h-auto p-4 flex-col gap-2"
              variant="outline"
            >
              <DiceSix size={24} weight="bold" />
              <span className="font-semibold">Prediction</span>
              <span className="text-xs text-muted-foreground">Guess what happens next</span>
            </Button>

            <Button
              onClick={startWordGame}
              disabled={!isLive || isGenerating}
              className="h-auto p-4 flex-col gap-2"
              variant="outline"
            >
              <ChartBar size={24} weight="bold" />
              <span className="font-semibold">Word Game</span>
              <span className="text-xs text-muted-foreground">Word challenges</span>
            </Button>

            <Button
              onClick={startReactionGame}
              disabled={!isLive}
              className="h-auto p-4 flex-col gap-2"
              variant="outline"
            >
              <Fire size={24} weight="bold" />
              <span className="font-semibold">Reaction</span>
              <span className="text-xs text-muted-foreground">Speed challenge</span>
            </Button>
          </div>
        )}

        {gameStats.totalGames > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">Game Stats</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">{gameStats.totalGames}</div>
                <div className="text-xs text-muted-foreground">Games Played</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-accent">{gameStats.totalParticipants}</div>
                <div className="text-xs text-muted-foreground">Total Participants</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-secondary">{gameStats.averageParticipants}</div>
                <div className="text-xs text-muted-foreground">Avg per Game</div>
              </div>
            </div>
          </div>
        )}

        {gameHistory.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">Recent Games</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {gameHistory.slice(0, 5).map((game) => (
                <div
                  key={game.id}
                  className="p-3 rounded-lg border border-border/50 bg-card/50 text-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-xs">
                      {game.gameType}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(game.startTime).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="font-medium line-clamp-1">{game.question}</div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{game.participants.length} players</span>
                    {game.winner && (
                      <span className="flex items-center gap-1 text-accent">
                        <Crown size={12} weight="fill" />
                        {game.winner}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
