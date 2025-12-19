// src/pages/Grade5Game.tsx
import { Grade5MiniGame } from "@/components/game/Grade5Minigame"; // Import component mới
import Header from "@/components/Header";

const Grade5Game = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Grade5MiniGame /> 
    </div>
  );
};

export default Grade5Game;