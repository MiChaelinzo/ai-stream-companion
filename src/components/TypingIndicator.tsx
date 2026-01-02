import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-pulse-glow">
        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
      </div>
      
      <div className="flex items-center gap-1 px-4 py-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
