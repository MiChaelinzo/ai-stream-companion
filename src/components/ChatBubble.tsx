import { motion } from "framer-motion";
import { ChatMessage } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Robot, User, ThumbsUp, ThumbsDown, Smiley, SmileyMeh, SmileyXEyes } from "@phosphor-icons/react";
import { safeParseDate } from "@/lib/utils";

interface ChatBubbleProps {
  message: ChatMessage;
  onVote?: (messageId: string, vote: 'up' | 'down') => void;
  showVoting?: boolean;
}

export function ChatBubble({ message, onVote, showVoting = true }: ChatBubbleProps) {
  const isAI = message.sender === 'ai';
  
  const getSentimentIcon = () => {
    if (!message.sentiment) return null;
    
    switch (message.sentiment) {
      case 'positive':
        return <Smiley size={14} weight="fill" className="text-green-500" />;
      case 'negative':
        return <SmileyXEyes size={14} weight="fill" className="text-red-500" />;
      default:
        return <SmileyMeh size={14} weight="fill" className="text-yellow-500" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <Avatar className={`w-10 h-10 ${isAI ? 'bg-primary' : 'bg-secondary'} flex items-center justify-center`}>
        {isAI ? <Robot size={20} weight="bold" className="text-primary-foreground" /> : <User size={20} weight="bold" className="text-secondary-foreground" />}
      </Avatar>
      
      <div className={`flex-1 max-w-[80%] ${isAI ? '' : 'flex flex-col items-end'}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isAI
              ? 'bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30'
              : 'bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          {isAI && showVoting && onVote && (
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/30">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 gap-1 hover:bg-green-500/20 hover:text-green-500"
                onClick={() => onVote(message.id, 'up')}
              >
                <ThumbsUp size={14} weight={message.votes && message.votes.up > 0 ? 'fill' : 'regular'} />
                {message.votes && message.votes.up > 0 && <span className="text-xs">{message.votes.up}</span>}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 gap-1 hover:bg-red-500/20 hover:text-red-500"
                onClick={() => onVote(message.id, 'down')}
              >
                <ThumbsDown size={14} weight={message.votes && message.votes.down > 0 ? 'fill' : 'regular'} />
                {message.votes && message.votes.down > 0 && <span className="text-xs">{message.votes.down}</span>}
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 px-2">
          {getSentimentIcon()}
          <span className="text-xs text-muted-foreground">
            {safeParseDate(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
