import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TrangQuynhMiniGame } from "@/components/game/TrangQuynhMiniGame";
import { loadStoryGrade0 } from "@/utils/storyLoaders";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const theme = {
  primary: "#ff6b6b",
  secondary: "#ffd93d",
  bg: "linear-gradient(180deg, #fff8e1 0%, #ffe5b4 100%)",
};

export default function PreschoolGame() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth?redirect=/classroom/preschool");
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth?redirect=/classroom/preschool");
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
          grade="0"
          courseId="preschool-cucuoi"
          storyLoader={loadStoryGrade0}
          theme={theme}
        />
      </div>
      <Footer className="mt-auto" />
    </div>
  );
}
