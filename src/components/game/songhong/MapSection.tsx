import React from "react";
import { Question, Answer, QuestionCard } from "./QuestionCard";

interface MapSectionProps {
  sectionId: string; // A..D
  sectionLabel: string; // Bắc/Đông/Tây/Nam
  questions: Question[];
  progress: number;
  active: boolean;
  onAnswer: (sectionId: string, q: Question, userAnswer: Answer, isCorrect: boolean) => void;
}

export const MapSection: React.FC<MapSectionProps> = ({ sectionId, sectionLabel, questions, progress, active, onAnswer }) => {
  const current = questions[progress];
  const done = progress >= questions.length;

  const [result, setResult] = React.useState<"idle" | "correct" | "incorrect">("idle");

  const handleAnswer = (ans: Answer) => {
    if (!current) return;
    const isCorrect = ans === current.correctAnswer;
    setResult(isCorrect ? "correct" : "incorrect");
    // Clear visual feedback shortly after
    window.setTimeout(() => setResult("idle"), 700);
    onAnswer(sectionId, current, ans, isCorrect);
  };

  const confetti = result === "correct";
  const wrong = result === "incorrect";

  return (
    <div className={`relative rounded-xl border p-4 transition-transform ${active ? "ring-2 ring-primary" : "opacity-70"} ${confetti ? "bg-green-50" : ""} ${wrong ? "bg-red-50" : ""}`}>
      {/* Local styles for effects */}
      <style>
        {`
        @keyframes songhong-shake { 10%, 90% { transform: translateX(-2px); } 20%, 80% { transform: translateX(4px);} 30%, 50%, 70% { transform: translateX(-6px);} 40%, 60% { transform: translateX(6px);} }
        @keyframes songhong-pop { 0% { transform: scale(0.9); opacity: 0.4;} 60% { transform: scale(1.02); opacity: 1;} 100% { transform: scale(1);} }
        @keyframes songhong-confetti { 0% { transform: translateY(0) rotate(0); opacity: 1;} 100% { transform: translateY(-24px) rotate(180deg); opacity: 0;} }
        `}
      </style>

      <div className="mb-2 flex items-center justify-between">
        <div className="font-semibold">Khu vực {sectionLabel}</div>
        <div className="text-xs text-muted-foreground">{Math.min(progress, questions.length)}/{questions.length}</div>
      </div>

      {done ? (
        <div className="text-green-600">Đã mở khoá khu vực này!</div>
      ) : (
        <div className={`${confetti ? "" : ""} ${wrong ? "" : ""}`} style={{ animation: confetti ? "songhong-pop 300ms ease" : wrong ? "songhong-shake 400ms ease" : undefined }}>
          {current && <QuestionCard sectionLabel={sectionLabel} question={current} onAnswer={handleAnswer} />}
        </div>
      )}

      {confetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="absolute block h-2 w-2 rounded-sm"
              style={{
                left: `${8 + Math.random() * 84}%`,
                bottom: `${8 + Math.random() * 40}%`,
                background: ["#22c55e", "#10b981", "#34d399", "#a3e635", "#06b6d4"][i % 5],
                animation: `songhong-confetti 500ms ease-out forwards`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};


