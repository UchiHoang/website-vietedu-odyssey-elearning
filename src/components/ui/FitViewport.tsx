import React from "react";

interface FitViewportProps {
  baseWidth?: number;
  baseHeight?: number;
  topOffset?: number;
  children: React.ReactNode;
}

// Scales its children to fit the viewport while preserving aspect ratio.
const FitViewport: React.FC<FitViewportProps> = ({
  baseWidth = 1280,
  baseHeight = 900,
  topOffset = 64,
  children,
}) => {
  const [scale, setScale] = React.useState(1);

  const recalc = React.useCallback(() => {
    const availableW = window.innerWidth;
    const availableH = Math.max(0, window.innerHeight - topOffset);
    const next = Math.min(availableW / baseWidth, availableH / baseHeight);
    setScale(Number.isFinite(next) && next > 0 ? next : 1);
  }, [baseWidth, baseHeight, topOffset]);

  React.useEffect(() => {
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [recalc]);

  return (
    <div
      style={{ height: `calc(100vh - ${topOffset}px)` }}
      className="overflow-hidden"
    >
      <div
        className="mx-auto"
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FitViewport;

