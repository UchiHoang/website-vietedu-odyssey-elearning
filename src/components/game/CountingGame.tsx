import { useState, memo, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface CountingGameProps {
  items: {
    image: string;
    count: number;
  }[];
  correctAnswer: number;
  question: string;
  explanation?: string;
  onComplete: (isCorrect: boolean) => void;
}

const CountingGameComponent = ({ items, correctAnswer, question, explanation, onComplete }: CountingGameProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleAnswer = (answer: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    const isCorrect = answer === correctAnswer;
    
    setTimeout(() => {
      onCompleteRef.current(isCorrect);
    }, 2500);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  // Memoize options to prevent recalculation on every render
  const options = useMemo(() => {
    const opts = Array.from({ length: 4 }, (_, i) => {
      const offset = i - 2;
      return Math.max(1, correctAnswer + offset);
    }).filter((v, i, arr) => arr.indexOf(v) === i).sort((a, b) => a - b);

    if (!opts.includes(correctAnswer)) {
      opts[Math.floor(Math.random() * opts.length)] = correctAnswer;
    }
    return opts;
  }, [correctAnswer]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-card rounded-xl p-6 md:p-8 shadow-lg border-2 border-primary/20">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-6">
          {question}
        </h2>

        {/* Items to count */}
        <div className="bg-secondary/30 rounded-xl p-6 mb-6 min-h-[200px] flex items-center justify-center">
          <div className="flex flex-wrap gap-4 justify-center">
            {items.map((item, groupIdx) => (
              <div key={groupIdx} className="flex flex-wrap gap-2">
                {Array.from({ length: item.count }, (_, idx) => (
                  <motion.img
                    key={`${groupIdx}-${idx}`}
                    src={item.image}
                    alt=""
                    className="w-12 h-12 md:w-16 md:h-16 object-contain"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (groupIdx * item.count + idx) * 0.05 }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Answer options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === correctAnswer;
            const showCorrect = showFeedback && isCorrectOption;
            const showIncorrect = showFeedback && isSelected && !isCorrect;

            return (
              <motion.button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`
                  relative p-6 rounded-xl text-2xl font-bold transition-all duration-300
                  border-2 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50
                  ${showCorrect ? "bg-green-500 text-white border-green-600" : ""}
                  ${showIncorrect ? "bg-red-500 text-white border-red-600" : ""}
                  ${!showFeedback ? "bg-secondary hover:bg-secondary/80 border-primary/30" : ""}
                  ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}
                `}
                whileTap={{ scale: showFeedback ? 1 : 0.95 }}
              >
                {option}
                {showCorrect && (
                  <CheckCircle2 className="absolute top-2 right-2 w-6 h-6" />
                )}
                {showIncorrect && (
                  <XCircle className="absolute top-2 right-2 w-6 h-6" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              isCorrect 
                ? "bg-green-100 text-green-800" 
                : "bg-orange-100 text-orange-800"
            }`}
          >
            <p className="font-semibold mb-2">
              {isCorrect ? "🎉 Chính xác!" : "💡 Gần đúng rồi!"}
            </p>
            {explanation && (
              <p className="text-sm">{explanation}</p>
            )}
            {!isCorrect && (
              <p className="text-sm mt-2">
                Đáp án đúng là: <span className="font-bold text-lg">{correctAnswer}</span>
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const CountingGame = memo(CountingGameComponent);