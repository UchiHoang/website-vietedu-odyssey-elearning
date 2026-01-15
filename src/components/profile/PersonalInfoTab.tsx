import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

interface ProfileData {
  display_name: string;
  email?: string;
  phone?: string;
  grade?: string;
  class_name?: string;
  school?: string;
  ward?: string;
  district?: string;
  province?: string;
  birth_date?: string;
  address?: string;
}

interface PersonalInfoTabProps {
  profile: ProfileData | null;
  isAdmin: boolean;
  onUpdate: (data: Partial<ProfileData>) => Promise<void>;
}

const PersonalInfoTab = ({ profile, isAdmin, onUpdate }: PersonalInfoTabProps) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    display_name: profile?.display_name || "",
    phone: profile?.phone || "",
    grade: profile?.grade || "",
    class_name: profile?.class_name || "",
    school: profile?.school || "",
    ward: profile?.ward || "",
    district: profile?.district || "",
    province: profile?.province || "",
    birth_date: profile?.birth_date || "",
    address: profile?.address || "",
  });

  const handleSave = async () => {
    await onUpdate(formData);
    setEditing(false);
  };

  const InfoField = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="space-y-1">
      <Label className="text-sm text-muted-foreground">{label}:</Label>
      <p className="font-medium text-foreground">{value || "Chưa cập nhật"}</p>
    </div>
  );

  const EditField = ({ 
    label, 
    name, 
    value, 
    placeholder,
    type = "text"
  }: { 
    label: string; 
    name: keyof ProfileData; 
    value: string | undefined;
    placeholder?: string;
    type?: string;
  }) => (
    <div className="space-y-1">
      <Label className="text-sm text-muted-foreground">{label}:</Label>
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        placeholder={placeholder}
        className="bg-background"
      />
    </div>
  );

  return (
    <div className="bg-card rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Thông tin cá nhân</h2>
        <Button
          variant="outline"
          onClick={() => editing ? handleSave() : setEditing(true)}
          className="flex items-center gap-2"
        >
          {editing ? (
            "Lưu"
          ) : (
            <>
              Cập nhật <Pencil className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {editing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditField label="Họ tên" name="display_name" value={formData.display_name} placeholder="Nhập họ tên" />
          <EditField label="Ngày sinh" name="birth_date" value={formData.birth_date} type="date" />
          <EditField label="Điện Thoại" name="phone" value={formData.phone} placeholder="Nhập số điện thoại" />
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Email:</Label>
            <Input value={profile?.email || ""} disabled className="bg-muted" />
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Loại tài khoản:</Label>
            <Input value={isAdmin ? "Giáo viên" : "Học sinh"} disabled className="bg-muted" />
          </div>
          <EditField label="Địa chỉ" name="address" value={formData.address} placeholder="Nhập địa chỉ" />
          <EditField label="Khối" name="grade" value={formData.grade} placeholder="1, 2, 3..." />
          <EditField label="Xã/Phường" name="ward" value={formData.ward} placeholder="Nhập xã/phường" />
          <EditField label="Lớp" name="class_name" value={formData.class_name} placeholder="VD: 2A1" />
          <EditField label="Quận" name="district" value={formData.district} placeholder="Nhập quận/huyện" />
          <EditField label="Trường học" name="school" value={formData.school} placeholder="Tên trường học" />
          <EditField label="Tỉnh" name="province" value={formData.province} placeholder="Nhập tỉnh/thành phố" />
          
          <div className="md:col-span-2 flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setEditing(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu thay đổi</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="Họ tên" value={profile?.display_name} />
          <InfoField label="Ngày sinh" value={profile?.birth_date} />
          <InfoField label="Điện Thoại" value={profile?.phone} />
          <InfoField label="Email" value={profile?.email} />
          <InfoField label="Loại tài khoản" value={isAdmin ? "Giáo viên" : "Học sinh"} />
          <InfoField label="Địa chỉ" value={profile?.address} />
          <InfoField label="Khối" value={profile?.grade} />
          <InfoField label="Xã/Phường" value={profile?.ward} />
          <InfoField label="Lớp" value={profile?.class_name} />
          <InfoField label="Quận" value={profile?.district} />
          <InfoField label="Trường học" value={profile?.school} />
          <InfoField label="Tỉnh" value={profile?.province} />
        </div>
      )}
    </div>
  );
};

export default PersonalInfoTab;
