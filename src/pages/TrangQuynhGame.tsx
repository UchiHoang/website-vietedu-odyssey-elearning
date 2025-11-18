import { TrangQuynhMiniGame } from "@/components/game/TrangQuynhMiniGame";
import Header from "@/components/Header";

const TrangQuynhGame = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <TrangQuynhMiniGame grade="2"/>
    </div>
  );
};

export default TrangQuynhGame;
