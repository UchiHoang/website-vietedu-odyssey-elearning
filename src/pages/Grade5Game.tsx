import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { TrangQuynhMiniGame } from "@/components/game/TrangQuynhMiniGame";
import { loadStoryGrade5 } from "@/utils/storyLoaders";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const theme = {
  primary: "#2c3e50",
  secondary: "#8e44ad",
  bg: "linear-gradient(180deg, #f4f6fb 0%, #e8ecf7 100%)",
};

export default function Grade5Game() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth?redirect=/classroom/grade5");
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth?redirect=/classroom/grade5");
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
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <Header />
      <TrangQuynhMiniGame 
        grade="5"
        courseId="grade5-trangnguyen"
        storyLoader={loadStoryGrade5}
        theme={theme}
      />
    </div>
  );
}