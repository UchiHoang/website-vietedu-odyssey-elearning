import Header from "@/components/Header";
import { TrangQuynhMiniGame } from "@/components/game/TrangQuynhMiniGame";
import { loadStoryGrade0 } from "@/utils/storyLoaders";

const theme = {
  primary: "#1c3d5a",
  secondary: "#f7d046",
  bg: "linear-gradient(180deg, #0b1f35 0%, #112b45 100%)",
};

export default function Grade0Game() {
  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <Header />
      <TrangQuynhMiniGame
        grade="0"
        courseId="grade0-cuoi"
        storyLoader={loadStoryGrade0}
        theme={theme}
      />
    </div>
  );
}

