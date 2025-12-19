import { useState, useEffect, useCallback, useRef, memo } from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

interface GameTimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
  isPaused?: boolean;
  showWarning?: boolean;
}

const GameTimerComponent = ({ 
  initialSeconds, 
  onTimeUp, 
  isPaused = false,
  showWarning = true 
}: GameTimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isWarning, setIsWarning] = useState(false);
  // Use ref to avoid dependency issues
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUpRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (showWarning && seconds <= 10 && seconds > 0) {
      setIsWarning(true);
    } else {
      setIsWarning(false);
    }
  }, [seconds, showWarning]);

  const formatTime = useCallback((totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const progressPercent = (seconds / initialSeconds) * 100;

  return (
    <motion.div 
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full border-2
        ${isWarning 
          ? "bg-red-50 border-red-400 text-red-600" 
          : "bg-card border-orange-300 text-foreground"
        }
        transition-colors duration-300
      `}
      animate={isWarning ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: isWarning ? Infinity : 0, duration: 0.5 }}
    >
      <div className={`
        w-8 h-8 rounded-full border-2 flex items-center justify-center
        ${isWarning ? "border-red-400 bg-red-100" : "border-orange-400 bg-orange-100"}
      `}>
        <Clock className={`w-4 h-4 ${isWarning ? "text-red-500" : "text-orange-500"}`} />
      </div>
      
      <span className={`
        font-mono text-xl font-bold tracking-wider
        ${isWarning ? "text-red-600" : "text-foreground"}
      `}>
        {formatTime(seconds)}
      </span>
    </motion.div>
  );
};

export const GameTimer = memo(GameTimerComponent);
