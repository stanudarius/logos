import React from "react";
import ReadingTrailsDashboard from "@/src/features/trails/components/ReadingTrailsDashboard";

interface TrailsTabProps {
  isActive: boolean;
  onStartTrail: (trailId: string) => Promise<void>;
}

export const TrailsTab: React.FC<TrailsTabProps> = ({
  isActive,
  onStartTrail,
}) => {
  return (
    <div
      id="trails-dashboard-emulation"
      className={`w-full h-full sm:h-[85vh] sm:max-h-[850px] sm:min-h-[600px] sm:max-w-[420px] sm:rounded-[32px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.15),0_8px_20px_rgba(0,0,0,0.1)] overflow-hidden relative bg-[#FAF8F3] ${isActive ? "block" : "hidden"}`}
    >
      <ReadingTrailsDashboard onStartTrail={onStartTrail} />
    </div>
  );
};
