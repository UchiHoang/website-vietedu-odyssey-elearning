import React from "react";
import { Button } from "@/components/ui/button";

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm text-center">
      <div className="text-2xl font-heading font-bold mb-2">Săn kho báu sông Hồng</div>
      <p className="text-muted-foreground mb-6">Giải các câu đố toán học để mở kho báu </p>
      <Button size="lg" onClick={onStart}>Bắt đầu</Button>
    </div>
  );
};


