import { TrangQuynhMiniGame } from "@/components/game/TrangQuynhMiniGame";
import Header from "@/components/Header";

const Grade1Game = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <TrangQuynhMiniGame grade="1" />
    </div>
  );
};

export default Grade1Game;
