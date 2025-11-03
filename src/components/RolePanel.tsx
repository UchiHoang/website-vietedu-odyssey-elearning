import { Button } from "@/components/ui/button";
import { Users, BookOpen, BarChart, Settings, Play, UserCircle, Flag } from "lucide-react";
import type { UserRole } from "@/data/mockData";

interface RolePanelProps {
  role: UserRole;
}

const RolePanel = ({ role }: RolePanelProps) => {
  if (role === "admin" || role === "teacher") {
    return (
      <section className="py-12 bg-gradient-to-r from-accent/10 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-heading font-bold mb-6 text-center">
              {role === "admin" ? "Bảng điều khiển quản trị" : "Bảng điều khiển giáo viên"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex-col gap-2 py-6 hover-lift">
                <Users className="h-8 w-8 text-primary" />
                <span className="font-semibold">Quản lý học sinh</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-6 hover-lift">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="font-semibold">Quản lý lớp</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-6 hover-lift">
                <BarChart className="h-8 w-8 text-primary" />
                <span className="font-semibold">Xem báo cáo</span>
              </Button>
              {role === "admin" && (
                <Button variant="outline" className="h-auto flex-col gap-2 py-6 hover-lift">
                  <Settings className="h-8 w-8 text-primary" />
                  <span className="font-semibold">Quản lý nội dung</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-r from-secondary/20 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-heading font-bold mb-6 text-center">
            Hành động nhanh
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-auto flex-col gap-2 py-6 hover-lift">
              <Play className="h-8 w-8" />
              <span className="font-semibold">Chơi tiếp</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-6 hover-lift">
              <UserCircle className="h-8 w-8 text-primary" />
              <span className="font-semibold">Hồ sơ</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-6 hover-lift">
              <Users className="h-8 w-8 text-primary" />
              <span className="font-semibold">Bạn bè</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-6 hover-lift">
              <Flag className="h-8 w-8 text-primary" />
              <span className="font-semibold">Nhiệm vụ</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RolePanel;
