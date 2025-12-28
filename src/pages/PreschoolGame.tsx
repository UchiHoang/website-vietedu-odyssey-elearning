import Header from "@/components/Header";
import { TrangQuynhMiniGame } from "@/components/game/TrangQuynhMiniGame";
import { loadStoryGrade0 } from "@/utils/storyLoaders";

const theme = {
  primary: "#ff6b6b",
  secondary: "#ffd93d",
  bg: "linear-gradient(180deg, #fff8e1 0%, #ffe5b4 100%)",
};

export default function PreschoolGame() {
  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <Header />
      <TrangQuynhMiniGame
        grade="0"
        courseId="preschool-cucuoi"
        storyLoader={loadStoryGrade0}
        theme={theme}
      />
    </div>
  );
}
