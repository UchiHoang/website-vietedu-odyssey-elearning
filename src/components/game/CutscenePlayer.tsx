import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, SkipForward } from "lucide-react";

interface CutsceneFrame {
  id: string;
  bg?: string;
  sprite?: string;
  speaker: string;
  text: string;
}

interface CutscenePlayerProps {
  frames: CutsceneFrame[];
  onComplete: () => void;
  onSkip: () => void;
}

export const CutscenePlayer = ({ frames, onComplete, onSkip }: CutscenePlayerProps) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  
  // Safety check for empty frames
  if (!frames || frames.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-card rounded-lg">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Không có cutscene</p>
          <Button onClick={onComplete}>Bắt đầu</Button>
        </div>
      </div>
    );
  }
  
  const currentFrame = frames[currentFrameIndex];
  const isLastFrame = currentFrameIndex === frames.length - 1;
  
  // Safety check for undefined frame
  if (!currentFrame) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-card rounded-lg">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Lỗi tải cutscene</p>
          <Button onClick={onComplete}>Bỏ qua</Button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (isLastFrame) {
      onComplete();
    } else {
      setCurrentFrameIndex(prev => prev + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "Escape") {
      onSkip();
    }
  };

  return (
    <div 
      className="w-full bg-card rounded-2xl shadow-xl overflow-hidden animate-fade-in"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Cutscene"
    >
      <div className="grid md:grid-cols-[400px_1fr] gap-0">
        {/* Character Image - Left Side */}
        <div className="bg-primary/10 p-8 flex flex-col items-center justify-center gap-4 min-h-[500px] md:min-h-[600px]">
          {currentFrame.sprite && (
            <img 
              src={`/${currentFrame.sprite}`}
              alt={currentFrame.speaker}
              className="w-full max-w-[300px] h-auto object-contain animate-fade-in"
            />
          )}
        </div>

        {/* Content - Right Side */}
        <div className="p-6 md:p-8 flex flex-col justify-between min-h-[500px] md:min-h-[600px]">
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <h3 className="text-lg md:text-xl font-heading font-bold text-primary">
                  {currentFrame.speaker}
                </h3>
              </div>
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                {currentFrame.text}
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 pt-4">
              {frames.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all ${
                    index === currentFrameIndex
                      ? "bg-primary w-8"
                      : index < currentFrameIndex
                      ? "bg-primary/50 w-4"
                      : "bg-muted w-4"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              {currentFrameIndex + 1} / {frames.length}
            </span>
            
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="gap-2"
              >
                <SkipForward className="w-4 h-4" />
                Bỏ qua
              </Button>
              
              <Button
                onClick={handleNext}
                size="lg"
                className="gap-2"
                aria-label={isLastFrame ? "Bắt đầu câu hỏi" : "Tiếp theo"}
              >
                {isLastFrame ? "Bắt đầu" : "Tiếp theo"}
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
