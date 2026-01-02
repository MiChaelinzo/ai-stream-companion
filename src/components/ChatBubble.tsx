import { motion } from "framer-motion";
import { ChatMessage } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Robot, User } from "@phosphor-icons/react";

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isAI = message.sender === 'ai';
  
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
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-2">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
}
