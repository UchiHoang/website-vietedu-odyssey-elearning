import React from "react";
import { Button } from "@/components/ui/button";

export type Answer = string;

export type Question =
  | { id: string; type: "numeric"; prompt: string; hint?: string; correctAnswer: string }
  | { id: string; type: "choice"; prompt: string; choices: string[]; hint?: string; correctAnswer: string };

interface QuestionCardProps {
  sectionLabel: string;
  question: Question;
  onAnswer: (answer: Answer) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ sectionLabel, question, onAnswer }) => {
  const [value, setValue] = React.useState("");

  const submit = (val: string) => {
    onAnswer(val.trim());
    setValue("");
  };

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-2 text-xs text-muted-foreground">Khu vực {sectionLabel}</div>
      <div className="text-lg font-semibold mb-3">{question.prompt}</div>

      {question.type === "choice" ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {question.choices.map((c) => (
            <Button key={c} variant="outline" onClick={() => submit(c)} className="justify-start">
              {c}
            </Button>
          ))}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
          className="flex gap-2"
        >
          <input
            className="flex-1 rounded-md border px-3 py-2 text-base outline-none focus:ring-2 focus:ring-primary"
            placeholder="Nhập đáp án"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button type="submit">Trả lời</Button>
        </form>
      )}

      {/* Hint removed as requested */}
    </div>
  );
};


