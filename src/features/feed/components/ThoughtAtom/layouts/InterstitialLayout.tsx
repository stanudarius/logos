import React from "react";
import { motion } from "motion/react";
import type { FeedCard } from "@/src/features/feed/types";
import { descAnim } from "@/src/components/ui/sharedAnim";

export const InterstitialLayout = ({ card }: { card: FeedCard }) => {
  const words = card.explore_title.split(" ");
  const hugeWord = words[words.length - 1];
  const restTitle = words.slice(0, -1).join(" ") || card.topic;
  return (
    <div className="flex-1 w-full h-full bg-[#F5F0E8] relative overflow-hidden">
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-8 -right-12 text-[14rem] sm:text-[16rem] font-serif italic tracking-tighter leading-[0.75] text-[#E6DFD3] select-none pointer-events-none z-0"
        style={{ willChange: "transform, opacity" }}
      >
        {hugeWord}
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
        className="absolute top-[45%] left-0 w-[65%] h-[2px] bg-[#C1694F] origin-left z-10"
      />
      <div className="absolute top-[45%] left-6 -translate-y-full pb-3 z-10">
        <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-[#2C2825]">
          {restTitle}
        </span>
      </div>
      <motion.div
        variants={descAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        className="absolute top-[45%] right-6 pt-6 w-[55%] z-10"
      >
        <p className="text-[13px] font-serif text-[#2C2825] leading-[1.65] text-right">
          {card.explore_subtext}
        </p>
      </motion.div>
    </div>
  );
};
