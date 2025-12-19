import React from "react";

interface TreasureMapProps {
  unlocked: boolean[]; // 4 ô theo thứ tự A,B,C,D
}

export const TreasureMap: React.FC<TreasureMapProps> = ({ unlocked }) => {
  const cells = ["Bắc", "Đông", "Tây", "Nam"];
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 font-semibold">Bản đồ Sông Hồng</div>
      <div className="grid grid-cols-2 gap-2">
        {cells.map((label, idx) => (
          <div
            key={label}
            className={`aspect-[4/3] rounded-lg border flex items-center justify-center text-sm ${
              unlocked[idx] ? "bg-green-100 text-green-700 border-green-300" : "bg-muted"
            }`}
          >
            {label} {unlocked[idx] ? "✔️" : "🔒"}
          </div>
        ))}
      </div>
    </div>
  );
};
// import React from "react";

// interface TreasureMapProps {
//   unlocked: boolean[]; // 4 ô theo thứ tự A,B,C,D
// }

// export const TreasureMap: React.FC<TreasureMapProps> = ({ unlocked }) => {
//   const cells = ["Bắc", "Đông", "Tây", "Nam"];
//   return (
//     <div className="rounded-xl border bg-card p-4 shadow-sm">
//       <div className="mb-3 font-semibold">Bản đồ Sông Hồng</div>
//       <div className="relative">
//         {/* Divider lines between Bắc – Đông – Tây – Nam */}
//         <div className="pointer-events-none absolute inset-0">
//           <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
//           <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
//         </div>
//         <div className="grid grid-cols-2 gap-2">
//           {cells.map((label, idx) => (
//             <div
//               key={label}
//               className={`aspect-[4/3] rounded-lg border flex items-center justify-center text-sm ${
//                 unlocked[idx] ? "bg-green-100 text-green-700 border-green-300" : "bg-muted"
//               }`}
//             >
//               {label} {unlocked[idx] ? "✔️" : "🔒"}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };


