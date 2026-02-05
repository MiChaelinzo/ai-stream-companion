import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target, Trophy, Users, Heart, Star, Fire, Plus, CheckCircle, Trash } from "@phosphor-icons/react";
import { toast } from "sonner";

interface StreamGoal {
  id: string;
  title: string;
  description: string;
  type: "followers" | "subscribers" | "viewers" | "donations" | "custom";
  currentValue: number;
  targetValue: number;
  icon: "trophy" | "users" | "heart" | "star" | "fire";
  color: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

interface StreamGoalsProps {
  goals: StreamGoal[];
  onCreateGoal: (goal: Omit<StreamGoal, "id" | "createdAt" | "completed" | "completedAt">) => void;
  onUpdateProgress: (goalId: string, newValue: number) => void;
  onDeleteGoal: (goalId: string) => void;
  onCompleteGoal: (goalId: string) => void;
}

export function StreamGoals({
  goals,
  onCreateGoal,
  onUpdateProgress,
  onDeleteGoal,
  onCompleteGoal,
}: StreamGoalsProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    type: "followers" as StreamGoal["type"],
    currentValue: 0,
    targetValue: 100,
    icon: "trophy" as StreamGoal["icon"],
    color: "primary",
  });

  const iconMap = {
    trophy: Trophy,
    users: Users,
    heart: Heart,
    star: Star,
    fire: Fire,
  };

  const goalTypeOptions = [
    { value: "followers", label: "Followers", icon: "users" as const },
    { value: "subscribers", label: "Subscribers", icon: "heart" as const },
    { value: "viewers", label: "Concurrent Viewers", icon: "users" as const },
    { value: "donations", label: "Donations", icon: "star" as const },
    { value: "custom", label: "Custom Goal", icon: "trophy" as const },
  ];

  const handleCreateGoal = () => {
    if (!newGoal.title || newGoal.targetValue <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    onCreateGoal(newGoal);
    setShowCreateDialog(false);
    setNewGoal({
      title: "",
      description: "",
      type: "followers",
      currentValue: 0,
      targetValue: 100,
      icon: "trophy",
      color: "primary",
    });
    toast.success("Goal created!");
  };

  const handleProgressUpdate = (goalId: string, increment: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const newValue = Math.min(goal.currentValue + increment, goal.targetValue);
    onUpdateProgress(goalId, newValue);

    if (newValue >= goal.targetValue && !goal.completed) {
      onCompleteGoal(goalId);
      toast.success(`🎉 Goal completed: ${goal.title}!`, {
        description: "Congratulations on reaching your milestone!",
      });
    }
  };

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target size={24} weight="bold" className="text-primary" />
              Stream Goals & Milestones
            </CardTitle>
            <CardDescription>Track your streaming progress and achievements</CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={20} weight="bold" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>Set a new milestone to work towards</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input
                    id="goal-title"
                    placeholder="e.g., Reach 1000 followers"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-description">Description (optional)</Label>
                  <Input
                    id="goal-description"
                    placeholder="Add details about this goal"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-type">Goal Type</Label>
                  <Select
                    value={newGoal.type}
                    onValueChange={(value) =>
                      setNewGoal({
                        ...newGoal,
                        type: value as StreamGoal["type"],
                        icon: goalTypeOptions.find((o) => o.value === value)?.icon || "trophy",
                      })
                    }
                  >
                    <SelectTrigger id="goal-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {goalTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-value">Current Value</Label>
                    <Input
                      id="current-value"
                      type="number"
                      min="0"
                      value={newGoal.currentValue}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, currentValue: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target-value">Target Value</Label>
                    <Input
                      id="target-value"
                      type="number"
                      min="1"
                      value={newGoal.targetValue}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, targetValue: parseInt(e.target.value) || 100 })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGoal}>Create Goal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {activeGoals.length === 0 && completedGoals.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Target size={48} className="mx-auto mb-4 opacity-50" />
            <p>No goals yet. Create your first milestone!</p>
          </div>
        )}

        {activeGoals.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Active Goals</h3>
            {activeGoals.map((goal) => {
              const Icon = iconMap[goal.icon];
              const progress = (goal.currentValue / goal.targetValue) * 100;

              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-lg border border-border/50 bg-gradient-to-br from-card to-card/50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full bg-${goal.color}/20`}>
                        <Icon size={24} weight="bold" className={`text-${goal.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold">{goal.title}</h4>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        )}
                        <Badge variant="outline" className="mt-2 text-xs">
                          {goal.type}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onDeleteGoal(goal.id);
                        toast.success("Goal deleted");
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        {goal.currentValue} / {goal.targetValue}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-xs text-right text-muted-foreground">{progress.toFixed(0)}%</div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleProgressUpdate(goal.id, 1)}
                    >
                      +1
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleProgressUpdate(goal.id, 5)}
                    >
                      +5
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleProgressUpdate(goal.id, 10)}
                    >
                      +10
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {completedGoals.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Completed Goals</h3>
            {completedGoals.map((goal) => {
              const Icon = iconMap[goal.icon];

              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-lg border border-accent/50 bg-accent/10 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-accent/20">
                        <CheckCircle size={24} weight="fill" className="text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {goal.title}
                          <Badge className="bg-accent/20 text-accent border-accent/30">
                            Completed
                          </Badge>
                        </h4>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        )}
                        {goal.completedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Completed {new Date(goal.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onDeleteGoal(goal.id);
                        toast.success("Goal deleted");
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
