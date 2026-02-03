import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AICoachingSuggestion } from "@/lib/types";
import { Brain, Lightbulb, Warning, Info, TrendUp, CheckCircle, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface AICoachingPanelProps {
  suggestions: AICoachingSuggestion[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  isAnalyzing: boolean;
}

export function AICoachingPanel({
  suggestions,
  onDismiss,
  onClearAll,
  isAnalyzing,
}: AICoachingPanelProps) {
  const getSeverityIcon = (severity: AICoachingSuggestion['severity']) => {
    switch (severity) {
      case 'critical':
        return <Warning size={20} weight="fill" className="text-destructive" />;
      case 'warning':
        return <Warning size={20} weight="bold" className="text-accent" />;
      case 'suggestion':
        return <Lightbulb size={20} weight="fill" className="text-primary" />;
      case 'info':
        return <Info size={20} weight="fill" className="text-secondary" />;
    }
  };

  const getSeverityColor = (severity: AICoachingSuggestion['severity']) => {
    switch (severity) {
      case 'critical':
        return "border-destructive/50 bg-destructive/5";
      case 'warning':
        return "border-accent/50 bg-accent/5";
      case 'suggestion':
        return "border-primary/50 bg-primary/5";
      case 'info':
        return "border-secondary/50 bg-secondary/5";
    }
  };

  const getCategoryIcon = (category: AICoachingSuggestion['category']) => {
    return <Brain size={16} weight="fill" />;
  };

  const sortedSuggestions = [...suggestions].sort((a, b) => b.priority - a.priority);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain size={24} weight="bold" className="text-primary" />
              AI Coaching & Suggestions
              {isAnalyzing && (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </CardTitle>
            <CardDescription>
              Real-time AI analysis and performance improvement tips
            </CardDescription>
          </div>
          {suggestions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Brain size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No Coaching Suggestions Yet</p>
            <p className="text-sm mt-2">
              {isAnalyzing 
                ? "AI is analyzing your gameplay..." 
                : "Start tracking to receive personalized coaching"}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {sortedSuggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={`${getSeverityColor(suggestion.severity)} border transition-all hover:shadow-lg`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getSeverityIcon(suggestion.severity)}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                  {suggestion.title}
                                  <Badge variant="outline" className="text-xs">
                                    {suggestion.category}
                                  </Badge>
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {suggestion.message}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                onClick={() => onDismiss(suggestion.id)}
                              >
                                <X size={14} />
                              </Button>
                            </div>

                            {suggestion.targetMetric && suggestion.currentValue !== undefined && (
                              <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Current:</span>
                                  <span className="font-bold">{suggestion.currentValue.toFixed(1)}</span>
                                </div>
                                <TrendUp size={14} className="text-muted-foreground" />
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Target:</span>
                                  <span className="font-bold text-primary">{suggestion.targetValue?.toFixed(1)}</span>
                                </div>
                              </div>
                            )}

                            {suggestion.improvementTips.length > 0 && (
                              <div className="space-y-1.5 mt-3">
                                <p className="text-xs font-medium text-muted-foreground">Improvement Tips:</p>
                                {suggestion.improvementTips.map((tip, index) => (
                                  <div key={index} className="flex items-start gap-2 text-xs">
                                    <CheckCircle size={14} className="mt-0.5 text-primary shrink-0" />
                                    <span className="text-foreground/80">{tip}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
