import { useState, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Question } from "@/utils/storyLoader";
import { MatchingPairsGame } from "./MatchingPairsGame";
import { DragDropGame } from "./DragDropGame";
import { FillInTheBlankGame } from "./FillInTheBlankGame";
import { CountingGame } from "./CountingGame";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
}

const QuestionCardComponent = ({
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

  // Render different game types
  if (question.type === "matching-pairs" && question.pairs) {
    return (
      <MatchingPairsGame
        pairs={question.pairs}
        title={question.question}
        onComplete={onAnswer}
      />
    );
  }

  if (question.type === "drag-drop" && question.dragItems && question.dropSlots) {
    return (
      <DragDropGame
        items={question.dragItems}
        slots={question.dropSlots}
        title={question.question}
        onComplete={onAnswer}
      />
    );
  }

  if (question.type === "fill-blank" && question.blanks) {
    return (
      <FillInTheBlankGame
        question={{
          id: question.id,
          text: question.question,
          blanks: question.blanks,
          explanation: question.explanation
        }}
        onComplete={onAnswer}
      />
    );
  }

  if (question.type === "counting" && question.countingItems && question.countingAnswer !== undefined) {
    return (
      <CountingGame
        items={question.countingItems}
        correctAnswer={question.countingAnswer}
        question={question.question}
        explanation={question.explanation}
        onComplete={onAnswer}
      />
    );
  }

  // Default: multiple-choice
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Progress */}
      <div className="text-center">
        <span className="text-sm font-medium text-muted-foreground">
          Câu hỏi {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Question */}
      <div className="bg-card rounded-xl p-6 md:p-8 shadow-lg border-2 border-primary/20">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-8">
          {question.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  relative p-6 rounded-xl text-lg font-semibold transition-all duration-300
                  border-2 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50
                  ${showCorrect ? "bg-green-500 text-white border-green-600" : ""}
                  ${showIncorrect ? "bg-red-500 text-white border-red-600" : ""}
                  ${!showFeedback ? "bg-secondary hover:bg-secondary/80 border-primary/30" : ""}
                  ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}
                `}
                aria-label={`Đáp án ${String.fromCharCode(65 + index)}: ${option}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex-1 text-left">{option}</span>
                  {showCorrect && <CheckCircle2 className="w-6 h-6 flex-shrink-0" />}
                  {showIncorrect && <XCircle className="w-6 h-6 flex-shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div 
            className={`mt-6 p-4 rounded-lg animate-fade-in ${
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
      </div>

      {/* Hint Button */}
      {!showFeedback && (
        <div className="text-center">
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
            <p className="mt-3 text-sm text-muted-foreground animate-fade-in">
              💡 Đọc kỹ câu hỏi và suy nghĩ từng bước một nhé!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export const QuestionCard = memo(QuestionCardComponent);
