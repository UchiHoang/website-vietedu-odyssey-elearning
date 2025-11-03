import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface HudXpBarProps {
  totalXp: number;
  currentQuestion: number;
  totalQuestions: number;
  levelTitle: string;
}

export const HudXpBar = ({ 
  totalXp, 
  currentQuestion, 
  totalQuestions,
  levelTitle 
}: HudXpBarProps) => {
  const progressPercent = (currentQuestion / totalQuestions) * 100;
  const currentLevel = Math.floor(totalXp / 100) + 1;
  const xpInCurrentLevel = totalXp % 100;

  return (
    <div className="w-full bg-card/95 backdrop-blur-sm border-b p-3 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Level and Progress Bar */}
          <div className="flex items-center gap-3 flex-1">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            <span className="font-heading font-semibold text-foreground whitespace-nowrap">
              Cấp độ {currentLevel}
            </span>
            <div className="flex-1 min-w-0">
              <Progress 
                value={xpInCurrentLevel} 
                className="h-2.5 bg-muted"
              />
            </div>
          </div>
          
          {/* XP Counter */}
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {xpInCurrentLevel}/100 XP
          </span>
        </div>
      </div>
    </div>
  );
};
