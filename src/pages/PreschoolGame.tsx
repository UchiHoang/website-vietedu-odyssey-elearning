import { TrangQuynhMiniGame } from "@/components/game/TrangQuynhMiniGame";
import Header from "@/components/Header";

const PreschoolGame = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <TrangQuynhMiniGame grade="0" />
    </div>
  );
};

export default PreschoolGame;
