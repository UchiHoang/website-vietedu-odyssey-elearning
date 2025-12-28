import Header from "@/components/Header";
import { TrangQuynhMiniGame } from "@/components/game/TrangQuynhMiniGame";
import { loadStoryGrade3 } from "@/utils/storyLoaders";

const theme = {
  primary: "#1f6f51",
  secondary: "#1f3f6f",
  bg: "linear-gradient(180deg, #e8f5e9 0%, #e3f2fd 100%)",
};

export default function Grade3Game() {
  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <Header />
      <TrangQuynhMiniGame
        grade="3"
        courseId="grade3-sontinh"
        storyLoader={loadStoryGrade3}
        theme={theme}
      />
    </div>
  );
}

