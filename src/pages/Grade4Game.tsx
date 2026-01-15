import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrangQuynhMiniGame } from "@/components/game/TrangQuynhMiniGame";
import { loadStoryGrade4 } from "@/utils/storyLoaders";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const theme = {
  primary: "#c0392b",
  secondary: "#d35400",
  bg: "linear-gradient(180deg, #fff5f0 0%, #ffe9e0 100%)",
  bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=80", // Placeholder - Thánh Gióng cưỡi ngựa sắt
};

export default function Grade4Game() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth?redirect=/classroom/grade4");
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth?redirect=/classroom/grade4");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.bg }}>
      <Header />
      <div className="flex-1 min-h-0">
        <TrangQuynhMiniGame
          grade="4"
          courseId="grade4-giong"
          storyLoader={loadStoryGrade4}
          theme={theme}
        />
      </div>
      <Footer className="mt-auto" />
    </div>
  );
}
