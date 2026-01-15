import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Moon, Globe, Shield } from "lucide-react";

const AdminSettingsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Cài đặt</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Thông báo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Thông báo email</Label>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo qua email về hoạt động học sinh
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Báo cáo hàng tuần</Label>
              <p className="text-sm text-muted-foreground">
                Nhận báo cáo tổng kết mỗi tuần
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cảnh báo học sinh</Label>
              <p className="text-sm text-muted-foreground">
                Thông báo khi học sinh gặp khó khăn
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Giao diện
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Chế độ tối</Label>
              <p className="text-sm text-muted-foreground">
                Bật giao diện tối cho mắt
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Ngôn ngữ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ngôn ngữ hiển thị</Label>
              <p className="text-sm text-muted-foreground">
                Tiếng Việt
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Bảo mật
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Xác thực 2 bước</Label>
              <p className="text-sm text-muted-foreground">
                Bảo vệ tài khoản với xác thực 2 bước
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsTab;
