import React, { useState } from "react";
import { READING_TRAILS } from "@/src/data/trailsData";
import { ArrowRight, Waypoints } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MiniConstellation from "@/src/features/graph/components/MiniConstellation";

interface ReadingTrailsDashboardProps {
  onStartTrail: (trailId: string) => void;
}

const CATEGORIES = [
  { id: "philosophy", label: "Philosophy" },
  { id: "arts", label: "Arts" },
  { id: "literature", label: "Literature" },
] as const;

/** Category-specific left-border accent colors */
const CATEGORY_ACCENT: Record<string, string> = {
  philosophy: "#8B8FCF" /* muted indigo */,
  arts: "#C98B8B" /* muted rose   */,
  literature: "#B59A6A" /* muted amber  */,
};

const ReadingTrailsDashboard: React.FC<ReadingTrailsDashboardProps> =
  React.memo(({ onStartTrail }) => {
    const [activeCategory, setActiveCategory] = useState<
      "philosophy" | "arts" | "literature"
    >("philosophy");

    const filteredTrails = React.useMemo(
      () => READING_TRAILS.filter((t) => t.category === activeCategory),
      [activeCategory],
    );

    return (
      <div className="h-full w-full bg-[#FAF8F3] flex flex-col pt-[max(env(safe-area-inset-top),1.5rem)] pb-20 px-4 overflow-y-auto">
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#E8E4DC] flex items-center justify-center mb-3">
            <Waypoints className="w-6 h-6 text-[#1C1C1E]" />
          </div>
          <h2 className="text-xl font-serif italic text-[#1C1C1E] font-semibold mb-1">
            Knowledge Trails
          </h2>
          <p className="text-[11px] text-[#8A8A8E] font-light max-w-[260px]">
            Curated learning sequences drawn from the Constellation.
          </p>
        </div>

        <div className="flex bg-[#E8E4DC]/50 p-1 rounded-xl mb-6 shadow-inner">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 py-1.5 text-[11px] font-bold tracking-wider uppercase rounded-lg transition-all duration-250 ${
                activeCategory === cat.id
                  ? "bg-[#1C1C1E] text-white shadow-sm"
                  : "text-[#8A8A8E] hover:text-[#1C1C1E]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTrails.map((trail, idx) => {
              const accent = CATEGORY_ACCENT[trail.category] ?? "#B5A48B";
              return (
                <motion.div
                  key={trail.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                    delay: idx * 0.04,
                  }}
                  className="group bg-white border border-[#E8E4DC] rounded-2xl p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.07)] transition-shadow duration-300 flex flex-col overflow-hidden"
                  style={{ borderLeft: `3px solid ${accent}` }}
                >
                  <div className="mb-2.5">
                    <h3 className="text-sm font-bold text-[#1C1C1E] tracking-tight">
                      {trail.title}
                    </h3>
                    <p className="text-xs text-[#8A8A8E] leading-relaxed mt-1">
                      {trail.description}
                    </p>
                  </div>

                  <MiniConstellation thinkerIds={trail.thinkerIds} />

                  <div className="flex items-center gap-1 flex-wrap mb-3.5 mt-2 justify-center">
                    {trail.thinkerIds.map((thinker, tIdx) => (
                      <React.Fragment key={thinker}>
                        <div className="text-[#1C1C1E] text-[9px] font-bold uppercase tracking-wider font-mono opacity-80">
                          {thinker}
                        </div>
                        {tIdx < trail.thinkerIds.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-[#B5A48B] mx-0.5" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <button
                    onClick={() => onStartTrail(trail.id)}
                    className="w-full py-2.5 bg-[#1C1C1E] text-[#FAF8F3] text-xs font-bold rounded-xl active:scale-95 transition-all focus:outline-none flex items-center justify-center gap-2 group/btn"
                  >
                    Start Trail
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 duration-200" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  });

export default ReadingTrailsDashboard;
