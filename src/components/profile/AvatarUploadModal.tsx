import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface AvatarUploadModalProps {
  open: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSave: (avatar: string) => void;
}

const EMOJI_AVATARS = [
  "👤", "👦", "👧", "👨", "👩", "🧒", "👶", "🧒",
  "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷",
  "🐸", "🐵", "🐔", "🐧", "🦉", "🦄", "🐲", "🐳",
  "🌟", "⭐", "🌈", "🎭", "🎨", "📚", "🎮", "🏆",
  "🎓", "🎪", "🎯", "🚀", "✨", "💎", "🌸", "🌺",
];

const AvatarUploadModal = ({ open, onClose, currentAvatar, onSave }: AvatarUploadModalProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || "👤");
  const [activeTab, setActiveTab] = useState("emoji");

  const handleSave = () => {
    onSave(selectedAvatar);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chọn Avatar</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="emoji">Emoji</TabsTrigger>
            <TabsTrigger value="custom" disabled>Tải lên (Sắp ra mắt)</TabsTrigger>
          </TabsList>

          <TabsContent value="emoji" className="mt-4">
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedAvatar(emoji)}
                  className={cn(
                    "w-10 h-10 text-2xl rounded-lg flex items-center justify-center transition-all hover:bg-muted",
                    selectedAvatar === emoji && "bg-primary/20 ring-2 ring-primary"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <p>Tính năng tải ảnh lên sẽ sớm có mặt!</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview */}
        <div className="flex items-center justify-center gap-4 py-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Xem trước</p>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl border-4 border-background shadow-lg">
              {selectedAvatar}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={handleSave}>Lưu avatar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarUploadModal;
