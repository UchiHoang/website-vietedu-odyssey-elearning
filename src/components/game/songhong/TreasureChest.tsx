import React from "react";

interface TreasureChestProps {
  open?: boolean;
}

export const TreasureChest: React.FC<TreasureChestProps> = ({ open }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`h-24 w-40 rounded-lg border ${open ? "bg-yellow-200" : "bg-amber-800"}`} />
      <div className="text-sm text-muted-foreground">{open ? "Kho báu đã mở!" : "Kho báu đang chờ bạn"}</div>
    </div>
  );
};


