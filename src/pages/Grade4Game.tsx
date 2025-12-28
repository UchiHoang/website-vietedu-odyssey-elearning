import Header from "@/components/Header";
import { TrangQuynhMiniGame } from "@/components/game/TrangQuynhMiniGame";
import { loadStoryGrade4 } from "@/utils/storyLoaders";

const theme = {
  primary: "#c0392b",
  secondary: "#d35400",
  bg: "linear-gradient(180deg, #fff5f0 0%, #ffe9e0 100%)",
  bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80", // Placeholder - Thánh Gióng cưỡi ngựa sắt
};

export default function Grade4Game() {
  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <Header />
      <TrangQuynhMiniGame
        grade="4"
        courseId="grade4-giong"
        storyLoader={loadStoryGrade4}
        theme={theme}
      />
    </div>
  );
}
