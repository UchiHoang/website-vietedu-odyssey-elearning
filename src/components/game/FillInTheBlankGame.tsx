import { useState, memo, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface BlankQuestion {
  id: string;
  text: string;
  blanks: { position: number; answer: string; placeholder?: string }[];
  explanation?: string;
}

interface FillInTheBlankGameProps {
  question: BlankQuestion;
  onComplete: (isCorrect: boolean) => void;
}

const FillInTheBlankGameComponent = ({ question, onComplete }: FillInTheBlankGameProps) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleSubmit = () => {
    const correct = question.blanks.every(blank => {
      const userAnswer = answers[blank.position]?.trim().toLowerCase();
      const correctAnswer = blank.answer.trim().toLowerCase();
      return userAnswer === correctAnswer;
    });

    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      onCompleteRef.current(correct);
    }, 2500);
  };

  // Memoize sorted blanks
  const sortedBlanks = useMemo(() => 
    [...question.blanks].sort((a, b) => a.position - b.position),
    [question.blanks]
  );

  const renderTextWithBlanks = () => {
    const parts = [];
    let lastIndex = 0;

    sortedBlanks.forEach((blank, blankIndex) => {
      // Add text before blank
      parts.push(
        <span key={`text-${blankIndex}`}>
          {question.text.slice(lastIndex, blank.position)}
        </span>
      );

      // Add input for blank
      const isBlankCorrect = showFeedback && 
        answers[blank.position]?.trim().toLowerCase() === blank.answer.trim().toLowerCase();
      const isBlankIncorrect = showFeedback && !isBlankCorrect;

      parts.push(
        <span key={`blank-${blankIndex}`} className="inline-block mx-1">
          <Input
            type="text"
            value={answers[blank.position] || ""}
            onChange={(e) => setAnswers(prev => ({
              ...prev,
              [blank.position]: e.target.value
            }))}
            disabled={showFeedback}
            placeholder={blank.placeholder || "___"}
            className={`
              w-24 h-10 text-center inline-block
              ${isBlankCorrect ? "border-green-500 bg-green-50" : ""}
              ${isBlankIncorrect ? "border-red-500 bg-red-50" : ""}
            `}
          />
          {showFeedback && (
            <span className="inline-block ml-1 align-middle">
              {isBlankCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </span>
          )}
        </span>
      );

      lastIndex = blank.position;
    });

    // Add remaining text
    parts.push(
      <span key="text-end">
        {question.text.slice(lastIndex)}
      </span>
    );

    return parts;
  };

  const allBlanksFilled = question.blanks.every(blank => 
    answers[blank.position]?.trim().length > 0
  );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-card rounded-xl p-6 md:p-8 shadow-lg border-2 border-primary/20">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-center mb-6">
          Điền vào chỗ trống
        </h2>

        <div className="text-lg leading-relaxed mb-6">
          {renderTextWithBlanks()}
        </div>

        {!showFeedback && allBlanksFilled && (
          <div className="text-center mt-6">
            <Button onClick={handleSubmit} size="lg">
              Kiểm tra đáp án
            </Button>
          </div>
        )}

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg ${
              isCorrect 
                ? "bg-green-100 text-green-800" 
                : "bg-orange-100 text-orange-800"
            }`}
          >
            <p className="font-semibold mb-2">
              {isCorrect ? "🎉 Chính xác!" : "💡 Gần đúng rồi!"}
            </p>
            {question.explanation && (
              <p className="text-sm">{question.explanation}</p>
            )}
            {!isCorrect && (
              <div className="mt-3 text-sm">
                <p className="font-medium">Đáp án đúng:</p>
                {question.blanks.map((blank, idx) => (
                  <p key={idx}>Chỗ trống {idx + 1}: <span className="font-bold">{blank.answer}</span></p>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const FillInTheBlankGame = memo(FillInTheBlankGameComponent);