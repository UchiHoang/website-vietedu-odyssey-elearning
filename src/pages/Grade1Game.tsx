import Header from "@/components/Header";
import { TrangQuynhMiniGame } from "@/components/game/TrangQuynhMiniGame";
import { loadStoryGrade1 } from "@/utils/storyLoaders";

const theme = {
  primary: "#d35400",
  secondary: "#f1c40f",
  bg: "linear-gradient(180deg, #fff3e0 0%, #ffe0b2 100%)",
};

export default function Grade1Game() {
  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <Header />
      <TrangQuynhMiniGame
        grade="1"
        courseId="grade1-zodiac"
        storyLoader={loadStoryGrade1}
        theme={theme}
      />
    </div>
  );
}
