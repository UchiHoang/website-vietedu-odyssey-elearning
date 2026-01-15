import { useState, useEffect, memo, useRef, useCallback } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface MatchPair {
  id: string;
  left: string;
  right: string;
  leftImage?: string;
  rightImage?: string;
}

interface MatchingPairsGameProps {
  pairs: MatchPair[];
  onComplete: (isCorrect: boolean) => void;
  title?: string;
}

const MatchingPairsGameComponent = ({ pairs, onComplete, title }: MatchingPairsGameProps) => {
  const [leftSelected, setLeftSelected] = useState<string | null>(null);
  const [rightSelected, setRightSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [incorrect, setIncorrect] = useState<Set<string>>(new Set());
  const [shuffledRight, setShuffledRight] = useState<MatchPair[]>([]);
  
  // Use ref to avoid dependency issues
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const matchedRef = useRef(matched);
  matchedRef.current = matched;

  useEffect(() => {
    // Shuffle right side items only once on mount
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    setShuffledRight(shuffled);
  }, [pairs]);

  const checkMatch = useCallback((left: string, right: string) => {
    const leftPair = pairs.find(p => p.id === left);
    const isMatch = leftPair?.id === right;

    if (isMatch) {
      setMatched(prev => {
        const newMatched = new Set([...prev, left]);
        // Check if all matched after this
        if (newMatched.size === pairs.length) {
          setTimeout(() => onCompleteRef.current(true), 500);
        }
        return newMatched;
      });
      setTimeout(() => {
        setLeftSelected(null);
        setRightSelected(null);
      }, 800);
    } else {
      setIncorrect(new Set([left, right]));
      setTimeout(() => {
        setLeftSelected(null);
        setRightSelected(null);
        setIncorrect(new Set());
      }, 1000);
    }
  }, [pairs]);

  useEffect(() => {
    if (leftSelected && rightSelected) {
      checkMatch(leftSelected, rightSelected);
    }
  }, [leftSelected, rightSelected, checkMatch]);

  const handleLeftClick = (id: string) => {
    if (matched.has(id)) return;
    setLeftSelected(id);
  };

  const handleRightClick = (id: string) => {
    if (matched.has(id)) return;
    setRightSelected(id);
  };

  const getCardStyle = (id: string, isLeft: boolean) => {
    const isMatched = matched.has(id);
    const isSelected = isLeft ? leftSelected === id : rightSelected === id;
    const isIncorrect = incorrect.has(id);

    if (isMatched) return "bg-green-500 text-white border-green-600 cursor-not-allowed";
    if (isIncorrect) return "bg-red-500 text-white border-red-600 animate-shake";
    if (isSelected) return "bg-primary text-primary-foreground border-primary ring-4 ring-primary/50";
    return "bg-card border-border hover:border-primary/50 hover:scale-105 cursor-pointer";
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in">
      {title && (
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-center">
          {title}
        </h2>
      )}
      
      <div className="text-center text-sm text-muted-foreground mb-4">
        Nhấn vào một ô bên trái, sau đó nhấn vào ô tương ứng bên phải để nối cặp
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-3">
          {pairs.map((pair) => (
            <motion.button
              key={pair.id}
              onClick={() => handleLeftClick(pair.id)}
              disabled={matched.has(pair.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${getCardStyle(pair.id, true)}`}
              whileTap={{ scale: matched.has(pair.id) ? 1 : 0.95 }}
            >
              <div className="flex items-center gap-3">
                {pair.leftImage && (
                  <img src={pair.leftImage} alt="" className="w-12 h-12 object-contain" />
                )}
                <span className="text-lg font-semibold flex-1 text-left">{pair.left}</span>
                {matched.has(pair.id) && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                {incorrect.has(pair.id) && <XCircle className="w-5 h-5 flex-shrink-0" />}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {shuffledRight.map((pair) => (
            <motion.button
              key={pair.id}
              onClick={() => handleRightClick(pair.id)}
              disabled={matched.has(pair.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${getCardStyle(pair.id, false)}`}
              whileTap={{ scale: matched.has(pair.id) ? 1 : 0.95 }}
            >
              <div className="flex items-center gap-3">
                {pair.rightImage && (
                  <img src={pair.rightImage} alt="" className="w-12 h-12 object-contain" />
                )}
                <span className="text-lg font-semibold flex-1 text-left">{pair.right}</span>
                {matched.has(pair.id) && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                {incorrect.has(pair.id) && <XCircle className="w-5 h-5 flex-shrink-0" />}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="text-center text-sm font-medium">
        Đã nối: {matched.size} / {pairs.length}
      </div>
    </div>
  );
};

export const MatchingPairsGame = memo(MatchingPairsGameComponent);