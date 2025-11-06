import React from "react";

interface ScoreBoardProps {
  totalSections: number;
  unlockedSections: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ totalSections, unlockedSections, totalQuestions, answeredQuestions }) => {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="text-sm font-semibold">Tiến độ</div>
      <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-primary/10 p-3 text-primary">
          <div className="text-2xl font-bold">{unlockedSections}/{totalSections}</div>
          <div>Khu vực đã mở</div>
        </div>
        <div className="rounded-md bg-primary/10 p-3 text-primary">
          <div className="text-2xl font-bold">{answeredQuestions}/{totalQuestions}</div>
          <div>Câu đã trả lời</div>
        </div>
      </div>
    </div>
  );
};


