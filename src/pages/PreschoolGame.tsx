// import { TrangQuynhMiniGame } from "@/components/game/TrangQuynhMiniGame";
import Header from "@/components/Header";
import { PreschoolMiniGame } from "@/components/game/PreschoolMiniGame";

const PreschoolGame = () => {
  return (
    <div className="min-h-screen">
      <Header />
      {/* <TrangQuynhMiniGame grade="0" /> */}
      <PreschoolMiniGame />
    </div>
  );
};

export default PreschoolGame;
