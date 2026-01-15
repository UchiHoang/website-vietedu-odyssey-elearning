import { memo } from "react";
import { Progress } from "@/components/ui/progress";
import { Star, CheckCircle2, XCircle, Trophy, ArrowLeft } from "lucide-react";
import { GameTimer } from "./GameTimer";
import { Button } from "@/components/ui/button";

interface GameHudProps {
  levelTitle: string;
  totalXp: number;
  maxXp?: number;
  correctCount: number;
  incorrectCount: number;
  timerSeconds?: number;
  onTimeUp?: () => void;
  onBack?: () => void;
  isPaused?: boolean;
}

const GameHudComponent = ({
  levelTitle,
  totalXp,
  maxXp = 100,
  correctCount,
  incorrectCount,
  timerSeconds,
  onTimeUp,
  onBack,
  isPaused = false,
}: GameHudProps) => {
  const progressPercent = Math.min((totalXp / maxXp) * 100, 100);

  return (
    <div className="w-full bg-card/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto p-3">
        {/* Top Row: Title, Timer, Score */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left: Back button + Title */}
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <span className="font-heading font-semibold text-foreground text-sm md:text-base">
              {levelTitle}
            </span>
          </div>

          {/* Center: Timer */}
          {timerSeconds && timerSeconds > 0 && (
            <div className="order-3 md:order-2 w-full md:w-auto flex justify-center">
              <GameTimer 
                initialSeconds={timerSeconds} 
                onTimeUp={onTimeUp}
                isPaused={isPaused}
              />
            </div>
          )}

          {/* Right: Score Panel */}
          <div className="flex items-center gap-4 order-2 md:order-3">
            {/* XP Progress */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-32">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs text-muted-foreground">0</span>
                  <div className="flex-1 relative h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                    {/* Scale marks */}
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((mark) => (
                      <div
                        key={mark}
                        className="absolute top-0 bottom-0 w-px bg-white/50"
                        style={{ left: `${mark}%` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">100</span>
                  <Trophy className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
              <span className="font-bold text-primary">{totalXp}/{maxXp}</span>
            </div>

            {/* Correct/Incorrect Counters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-bold text-green-600">{correctCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="font-bold text-red-600">{incorrectCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile XP bar */}
        <div className="md:hidden mt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{totalXp}/{maxXp}</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <Trophy className="w-4 h-4 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const GameHud = memo(GameHudComponent);
