import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StudentsTab from "@/components/admin/StudentsTab";
import ClassesTab from "@/components/admin/ClassesTab";
import ReportsTab from "@/components/admin/ReportsTab";
import AdminSettingsTab from "@/components/admin/AdminSettingsTab";
import AdminProfileTab from "@/components/admin/AdminProfileTab";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("students");
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth?redirect=/admin");
        return;
      }

      setUserId(session.user.id);

      // Check if user has admin/teacher role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleError || !roleData || (roleData.role !== "admin" && roleData.role !== "teacher")) {
        toast({
          title: "Không có quyền truy cập",
          description: "Bạn cần có quyền giáo viên để truy cập trang này.",
          variant: "destructive"
        });
        navigate("/");
        return;
      }

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData);
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuthAndRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth?redirect=/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "students":
        return <StudentsTab />;
      case "classes":
        return <ClassesTab />;
      case "reports":
        return <ReportsTab />;
      case "settings":
        return <AdminSettingsTab />;
      case "profile":
        return <AdminProfileTab profile={profile} userId={userId} />;
      default:
        return <StudentsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <AdminSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              profile={profile}
              onLogout={handleLogout}
            />
          </div>
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
