import Header from "@/components/Header";
import { SongHongMiniGame } from "@/components/game/songhong/SongHongMiniGame";
import FitViewport from "@/components/ui/FitViewport";

const SongHongGame = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-6">
        <FitViewport baseWidth={1280} baseHeight={900} topOffset={64 + 24 + 24}>
          <div className="container mx-auto px-4">
            <SongHongMiniGame forceIntroOnMount />
          </div>
        </FitViewport>
      </div>
    </div>
  );
};

export default SongHongGame;


