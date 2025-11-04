import { Button } from "@/components/ui/button";
import { Lock, CheckCircle, Star } from "lucide-react";
import { GameProgress } from "@/hooks/useGameEngine";

// Import level icons
import iconApple from "@/assets/icons/icon_apple.png";
import iconBridge from "@/assets/icons/icon_bridge.png";
import iconBunch from "@/assets/icons/icon_bunch.png";
import iconClock from "@/assets/icons/icon_clock.png";
import iconRuler from "@/assets/icons/icon_ruler.png";
import iconSack from "@/assets/icons/icon_sack.png";
import iconMoney from "@/assets/icons/icon_money.png";
import iconPuzzle from "@/assets/icons/icon_puzzle.png";
import iconBadge from "@/assets/icons/icon_badge.png";

const levelIcons = [
  iconApple,   // Level 1
  iconBridge,  // Level 2
  iconBunch,   // Level 3
  iconClock,   // Level 4
  iconRuler,   // Level 5
  iconSack,    // Level 6
  iconMoney,   // Level 7
  iconPuzzle,  // Level 8
  iconBadge,   // Level 9
];

interface LevelSelectionProps {
  title: string;
  description: string;
  nodes: any[];
  progress: GameProgress;
  onSelectLevel: (nodeIndex: number) => void;
}

export const LevelSelection = ({ title, description, nodes, progress, onSelectLevel }: LevelSelectionProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
          
          {/* Progress Summary */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="bg-card px-6 py-3 rounded-full border border-primary/20">
              <span className="text-sm text-muted-foreground">Hoàn thành: </span>
              <span className="text-lg font-bold text-primary">
                {progress.completedNodes.length}/{nodes.length}
              </span>
            </div>
            <div className="bg-card px-6 py-3 rounded-full border border-primary/20">
              <Star className="w-4 h-4 text-primary inline mr-2" />
              <span className="text-lg font-bold text-primary">{progress.totalXp} XP</span>
            </div>
          </div>
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nodes.map((node, index) => {
            const isCompleted = progress.completedNodes.includes(node.id);
            const isUnlocked = index === 0 || progress.completedNodes.includes(nodes[index - 1]?.id);
            const isCurrent = progress.currentNodeIndex === index;

            return (
              <button
                key={node.id}
                onClick={() => isUnlocked && onSelectLevel(index)}
                disabled={!isUnlocked}
                className={`
                  relative bg-card rounded-xl p-6 border-2 transition-all duration-300
                  ${isUnlocked ? "hover:scale-105 hover:shadow-xl cursor-pointer" : "opacity-50 cursor-not-allowed"}
                  ${isCurrent ? "border-primary ring-4 ring-primary/20" : "border-primary/20"}
                  ${isCompleted ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20" : ""}
                `}
                aria-label={`Màn ${node.order}: ${node.title}`}
              >
                {/* Level Number Badge */}
                <div className="absolute -top-3 -left-3 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {node.order}
                </div>

                {/* Status Icon */}
                <div className="absolute -top-3 -right-3">
                  {isCompleted ? (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  ) : !isUnlocked ? (
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                  ) : null}
                </div>

                {/* Level Icon */}
                <div className="mb-4 flex justify-center">
                  <img 
                    src={levelIcons[index]} 
                    alt={node.title}
                    className={`w-20 h-20 object-contain ${!isUnlocked ? 'opacity-50 grayscale' : ''}`}
                  />
                </div>

                {/* Level Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-heading font-bold text-foreground">
                    {node.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {node.objective}
                  </p>
                  
                  {/* Math Topic Badge */}
                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {node.mathTopic}
                    </span>
                  </div>
                </div>

                {/* Play Button or Lock */}
                <div className="mt-4">
                  {isUnlocked ? (
                    <div className="text-sm font-semibold text-primary">
                      {isCompleted ? "Chơi lại" : "Bắt đầu"} →
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Hoàn thành màn trước
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Hoàn thành từng màn để mở khóa màn tiếp theo
          </p>
        </div>
      </div>
    </div>
  );
};
