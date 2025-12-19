//import { TrangQuynhMiniGame } from "@/components/game/TrangQuynhMiniGame";
import { Grade1MiniGame } from "@/components/game/Grade1Minigame";
import Header from "@/components/Header";

const Grade1Game = () => {
  return (
    <div className="min-h-screen">
      <Header />
      {/* <TrangQuynhMiniGame grade="1" /> */}
      <Grade1MiniGame />
    </div>
  );
};

export default Grade1Game;
