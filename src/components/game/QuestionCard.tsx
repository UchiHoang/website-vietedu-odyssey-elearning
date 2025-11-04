import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

interface QuestionCardProps {
  question: any;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuestionCard = ({ 
  question, 
  questionNumber, 
  totalQuestions,
  onAnswer 
}: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    const isCorrect = index === question.correctAnswer;
    
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowHint(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAnswer(index);
    }
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Question */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-8">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === question.correctAnswer;
            const showCorrect = showFeedback && isCorrectOption;
            const showIncorrect = showFeedback && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={showFeedback}
                className={`
                  w-full p-4 rounded-lg text-lg text-left transition-all
                  ${showCorrect ? "bg-green-500 text-white" : ""}
                  ${showIncorrect ? "bg-red-500 text-white" : ""}
                  ${!showFeedback ? "bg-[#4285F4] bg-opacity-10 hover:bg-opacity-20" : ""}
                  ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}
                `}
                aria-label={`Đáp án ${String.fromCharCode(65 + index)}: ${option}`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#4285F4] text-white flex items-center justify-center mr-3">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                  {showCorrect && <CheckCircle2 className="ml-auto w-6 h-6" />}
                  {showIncorrect && <XCircle className="ml-auto w-6 h-6" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div 
            className={`mt-6 p-4 rounded-lg ${
              isCorrect ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
            }`}
            role="alert"
          >
            <p className="font-semibold mb-2">
              {isCorrect ? "🎉 Chính xác!" : "💡 Gần đúng rồi!"}
            </p>
            <p className="text-sm">{question.explanation}</p>
          </div>
        )}

        {/* Hint Button */}
        {!showFeedback && (
          <div className="text-center mt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? "Ẩn gợi ý" : "Xem gợi ý"}
            </Button>
            {showHint && (
              <p className="mt-3 text-sm text-muted-foreground">
                💡 Đọc kỹ câu hỏi và suy nghĩ từng bước một nhé!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
