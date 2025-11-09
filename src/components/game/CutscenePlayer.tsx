import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SkipForward, Volume2, VolumeX } from "lucide-react";
import { CutsceneFrame } from "@/types/game";

interface CutscenePlayerProps {
  frames: CutsceneFrame[];
  onComplete: () => void;
  onSkip: () => void;
}

export const CutscenePlayer = ({
  frames,
  onComplete,
  onSkip,
}: CutscenePlayerProps) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  const currentFrame = frames[currentFrameIndex];

  useEffect(() => {
    if (!currentFrame) return;

    // Simulate typing effect
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, currentFrame.text.length * 50); // Adjust typing speed as needed

    return () => clearTimeout(timer);
  }, [currentFrameIndex, currentFrame]);

  const handleNext = () => {
    if (currentFrameIndex < frames.length - 1) {
      setCurrentFrameIndex(currentFrameIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (!currentFrame) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-background rounded-xl shadow-2xl overflow-hidden border border-primary/20">
      {/* Background */}
      <div
        className="w-full h-64 bg-cover bg-center relative"
        style={{
          backgroundImage: currentFrame.bg ? `url(${currentFrame.bg})` : "none",
        }}
      >
        {/* Character Sprite */}
        {currentFrame.sprite && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <img
              src={currentFrame.sprite}
              alt={currentFrame.speaker}
              className="h-48 object-contain"
            />
          </div>
        )}
      </div>

      {/* Dialog Box */}
      <div className="p-6 space-y-4">
        {/* Speaker Name */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-heading font-bold text-primary">
            {currentFrame.speaker}
          </h3>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="p-2"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="p-2"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dialog Text */}
        <div className="min-h-20 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-lg leading-relaxed">
            {isTyping
              ? currentFrame.text.substring(
                  0,
                  Math.floor(currentFrame.text.length * 0.7)
                )
              : currentFrame.text}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
        </div>

        {/* Progress and Next Button */}
        <div className="flex items-center justify-between pt-4">
          {/* Progress Dots */}
          <div className="flex gap-2">
            {frames.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentFrameIndex
                    ? "bg-primary scale-125"
                    : index < currentFrameIndex
                    ? "bg-primary/50"
                    : "bg-primary/20"
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <Button onClick={handleNext} disabled={isTyping} className="gap-2">
            {currentFrameIndex < frames.length - 1 ? "Tiếp theo" : "Bắt đầu"}
            <span className="text-lg">→</span>
          </Button>
        </div>
      </div>

      {/* Skip Tutorial */}
      <div className="px-6 pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          Bỏ qua cảnh phim
        </Button>
      </div>
    </div>
  );
};
