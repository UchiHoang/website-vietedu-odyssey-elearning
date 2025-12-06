import { Bell, Volume2, Moon, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-xl mb-6">Cài đặt ứng dụng</h3>
        
        <div className="space-y-6">
          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label className="font-medium">Thông báo</Label>
                <p className="text-sm text-muted-foreground">Nhận thông báo nhắc nhở học tập</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Volume2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <Label className="font-medium">Âm thanh</Label>
                <p className="text-sm text-muted-foreground">Bật âm thanh trong game</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Moon className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <Label className="font-medium">Chế độ tối</Label>
                <p className="text-sm text-muted-foreground">Sử dụng giao diện tối</p>
              </div>
            </div>
            <Switch />
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <Label className="font-medium">Ngôn ngữ</Label>
                <p className="text-sm text-muted-foreground">Chọn ngôn ngữ hiển thị</p>
              </div>
            </div>
            <Select defaultValue="vi">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Chọn ngôn ngữ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-xl mb-4">Về ứng dụng</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>Phiên bản: 1.0.0</p>
          <p>© 2024 Toán học vui. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-4">
            <a href="#" className="text-primary hover:underline">Điều khoản sử dụng</a>
            <a href="#" className="text-primary hover:underline">Chính sách bảo mật</a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsTab;
