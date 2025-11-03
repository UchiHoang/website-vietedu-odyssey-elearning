import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface PrologueSlide {
  id: string;
  bg?: string;
  sprite: string;
  speaker: string;
  text: string;
}

interface StoryIntroProps {
  prologue: PrologueSlide[];
  onComplete: () => void;
}

export const StoryIntro = ({ prologue, onComplete }: StoryIntroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < prologue.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  useEffect(() => {
    // Ensure the intro is visible at the top of the page when shown
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center py-6">
      <div className="max-w-6xl w-full animate-fade-in mx-auto">
        {/* Card constrained to viewport height so it fills the frame and leaves less empty space below */}
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden max-h-[calc(100vh-6rem)]">
          <div className="grid md:grid-cols-[400px_1fr] gap-0 h-full">
            {/* Character Image - Left Side */}
            <div className="bg-primary/10 p-6 flex flex-col items-center justify-center gap-4 min-h-0 h-full">
              <img 
                src={`/${prologue[currentSlide].sprite}`}
                alt={prologue[currentSlide].speaker}
                className="w-full max-w-[300px] h-auto object-contain"
              />
            </div>

            {/* Content - Right Side */}
            <div className="p-6 flex flex-col justify-between min-h-0 h-full">
              <div className="space-y-6 flex-1 flex flex-col justify-center overflow-auto">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <p className="text-sm font-semibold text-primary">{prologue[currentSlide].speaker}</p>
                  </div>
                  <p className="text-xl text-foreground leading-relaxed">
                    {prologue[currentSlide].text}
                  </p>
                </div>

                {/* Progress Dots */}
                <div className="flex justify-start gap-2 py-4">
                  {prologue.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? "bg-primary w-8"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  className="flex-1"
                >
                  Bỏ qua
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 gap-2"
                >
                  {currentSlide < prologue.length - 1 ? (
                    <>
                      Tiếp theo
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    "Bắt đầu"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
