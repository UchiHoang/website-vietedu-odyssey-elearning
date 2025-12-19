import React, { useEffect, useMemo, useState } from "react";
import { IntroScreen } from "./IntroScreen";
import { MapSection } from "./MapSection";
import { TreasureMap } from "./TreasureMap";
import { TreasureChest } from "./TreasureChest";
import { ScoreBoard } from "./ScoreBoard";
import type { Question, Answer } from "./QuestionCard";

type GameState = "intro" | "playing" | "won";

const SECTIONS: { id: string; label: string; questions: Question[] }[] = [
  {
    id: "A",
    label: "Bắc Sông Hồng",
    questions: [
      { id: "A1", type: "numeric", prompt: "6 × 7 = ?", correctAnswer: "42", hint: "Hãy nghĩ 6 × 5 + 6 × 2" },
      { id: "A2", type: "numeric", prompt: "8 × 3 = ?", correctAnswer: "24", hint: "8 + 8 + 8" },
      { id: "A3", type: "numeric", prompt: "56 ÷ 8 = ?", correctAnswer: "7", hint: "8 × ? = 56" },
    ],
  },
  {
    id: "B",
    label: "Đông Sông Hồng",
    questions: [
      { id: "B1", type: "choice", prompt: "Hình có 3 cạnh là gì?", choices: ["Tam giác", "Hình vuông", "Hình tròn"], correctAnswer: "Tam giác", hint: "3 cạnh, 3 góc." },
      { id: "B2", type: "numeric", prompt: "9 × 5 = ?", correctAnswer: "45", hint: "9 × 10 ÷ 2" },
      { id: "B3", type: "numeric", prompt: "15 ÷ 3 = ?", correctAnswer: "5", hint: "3 × ? = 15" },
    ],
  },
  {
    id: "C",
    label: "Tây Sông Hồng",
    questions: [
      { id: "C1", type: "choice", prompt: "Hình tròn có bao nhiêu cạnh?", choices: ["0", "1", "2"], correctAnswer: "0", hint: "Cạnh là đoạn thẳng." },
      { id: "C2", type: "numeric", prompt: "7 × 4 = ?", correctAnswer: "28", hint: "7 + 7 + 7 + 7" },
      { id: "C3", type: "numeric", prompt: "24 ÷ 6 = ?", correctAnswer: "4", hint: "6 × ? = 24" },
    ],
  },
  {
    id: "D",
    label: "Nam Sông Hồng",
    questions: [
      { id: "D1", type: "choice", prompt: "Hình có 4 cạnh và 4 góc là?", choices: ["Hình vuông", "Tam giác", "Hình tròn"], correctAnswer: "Hình vuông", hint: "4 cạnh bằng nhau" },
      { id: "D2", type: "numeric", prompt: "3 × 9 = ?", correctAnswer: "27", hint: "3 × 10 − 3" },
      { id: "D3", type: "numeric", prompt: "32 ÷ 4 = ?", correctAnswer: "8", hint: "4 × ? = 32" },
    ],
  },
];

const STORAGE_KEY = "songhong-math-quest";

interface PersistedData {
  gameState: GameState;
  sectionIndex: number;
  sectionProgress: number[];
  unlocked: boolean[];
  answers: Record<string, Answer>;
}

interface SongHongMiniGameProps {
  forceIntroOnMount?: boolean;
}

export const SongHongMiniGame: React.FC<SongHongMiniGameProps> = ({ forceIntroOnMount = true }) => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const sections = useMemo(() => SECTIONS, []);
  const [sectionIndex, setSectionIndex] = useState<number>(0);
  const [sectionProgress, setSectionProgress] = useState<number[]>([0, 0, 0, 0]);
  const [unlocked, setUnlocked] = useState<boolean[]>([false, false, false, false]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as PersistedData;
        // Always land on intro when entering from class page if requested
        setGameState(forceIntroOnMount ? "intro" : (data.gameState ?? "intro"));
        setSectionIndex(data.sectionIndex ?? 0);
        setSectionProgress(data.sectionProgress ?? [0, 0, 0, 0]);
        setUnlocked(data.unlocked ?? [false, false, false, false]);
        setAnswers(data.answers ?? {});
      }
    } catch {}
  }, [forceIntroOnMount]);

  useEffect(() => {
    const payload: PersistedData = {
      gameState,
      sectionIndex,
      sectionProgress,
      unlocked,
      answers,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [gameState, sectionIndex, sectionProgress, unlocked, answers]);

  useEffect(() => {
    if (gameState === "playing" && unlocked.every(Boolean)) {
      const t = setTimeout(() => setGameState("won"), 500);
      return () => clearTimeout(t);
    }
  }, [unlocked, gameState]);

  const handleStart = () => setGameState("playing");

  const handleSectionAnswer = (sectionId: string, q: Question, userAnswer: Answer, isCorrect: boolean) => {
    setAnswers((prev) => ({ ...prev, [q.id]: userAnswer }));
    const idx = sections.findIndex((s) => s.id === sectionId);
    if (idx < 0) return;
    if (isCorrect) {
      setSectionProgress((prev) => {
        const next = [...prev];
        const total = sections[idx].questions.length;
        const newVal = Math.min(total, next[idx] + 1);
        next[idx] = newVal;
        if (newVal >= total) {
          setUnlocked((uPrev) => {
            const u = [...uPrev];
            u[idx] = true;
            return u;
          });
          setSectionIndex((prevIdx) => {
            const order = [0, 1, 2, 3];
            const currentUnlocked = unlocked.slice();
            currentUnlocked[idx] = true;
            const nextIdx = order.find((i) => !currentUnlocked[i]);
            return typeof nextIdx === "number" ? nextIdx : prevIdx;
          });
        }
        return next;
      });
    }
  };

  const handlePlayAgain = () => {
    setSectionIndex(0);
    setSectionProgress([0, 0, 0, 0]);
    setUnlocked([false, false, false, false]);
    setAnswers({});
    setGameState("intro");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl md:text-3xl font-heading font-bold">Cuộc Phiêu Lưu Kho Báu Toán Học</h1>
        <p className="text-muted-foreground">Giải đố để mở bản đồ và tìm ra kho báu!</p>
      </header>

      {gameState === "intro" && <IntroScreen onStart={handleStart} />}

      {gameState !== "intro" && (
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="space-y-4">
            <ScoreBoard
              totalSections={sections.length}
              unlockedSections={unlocked.filter(Boolean).length}
              totalQuestions={sections.length * 3}
              answeredQuestions={sectionProgress.reduce((a, b) => a + b, 0)}
            />

            <div className="flex flex-wrap gap-2">
              {sections.map((s, i) => (
                <button
                  key={s.id}
                  className={`rounded-md border px-3 py-1 text-sm ${i === sectionIndex ? "bg-primary text-white" : "bg-background"}`}
                  onClick={() => setSectionIndex(i)}
                >
                  Vùng {s.label}{unlocked[i] ? " ✔️" : ""}
                </button>
              ))}
            </div>

            <div className="relative">
              <TreasureMap unlocked={unlocked} />
              {gameState === "won" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                  <div className="w-full max-w-md rounded-xl border bg-card/95 backdrop-blur p-6 text-center space-y-3 shadow-lg">
                    <TreasureChest open />
                    <div className="font-semibold">Bạn đã tìm thấy kho báu!</div>
                    <button className="rounded-md bg-primary px-4 py-2 text-white" onClick={handlePlayAgain}>
                      Chơi lại
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {sections.map((sec, i) => (
                <MapSection
                  key={sec.id}
                  sectionId={sec.id}
                  sectionLabel={sec.label}
                  questions={sec.questions}
                  progress={sectionProgress[i] ?? 0}
                  active={gameState === "playing" && i === sectionIndex && !unlocked[i]}
                  onAnswer={handleSectionAnswer}
                />
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
};


