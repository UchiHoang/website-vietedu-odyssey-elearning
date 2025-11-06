import Header from "@/components/Header";
import { SongHongMiniGame } from "@/components/game/songhong/SongHongMiniGame";

const SongHongGame = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-6">
        <div className="container mx-auto px-4">
          <SongHongMiniGame forceIntroOnMount />
        </div>
      </div>
    </div>
  );
};

export default SongHongGame;


