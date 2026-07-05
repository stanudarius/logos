import React from "react";
import { motion } from "motion/react";
import type { FeedCard } from "@/src/features/feed/types";
import { Monogram } from "@/src/components/ui/Monogram";
import { TypewriterText } from "@/src/components/ui/TypewriterText";
import { TITLE_CLS, TITLE_STYLE, SUBTEXT_CLS, titleAnim, descAnim } from "@/src/components/ui/sharedAnim";

export const FragmentLayout = ({ card }: { card: FeedCard }) => (
  <div className="flex-1 flex flex-col justify-center pl-6 pr-16 pb-16 relative overflow-hidden">
    <Monogram philosopher={card.philosopher} />
    {/* Gold rule + label — unique to Fragment */}
    <div className="flex items-center gap-2 mb-3 relative z-10">
      <div className="h-[2px] w-8 bg-[#B5A48B] opacity-50 flex-shrink-0" />
      <TypewriterText text={card.topic} className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#B5A48B]" />
    </div>
    <motion.h1
      variants={titleAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
      className={TITLE_CLS} style={TITLE_STYLE}
    >
      <TypewriterText text={card.explore_title} speed={0.015} delay={0.4} />
    </motion.h1>
    <motion.p
      variants={descAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
      className={SUBTEXT_CLS}
    >
      {card.explore_subtext}
    </motion.p>
    {/* Attribution — structural personality unique to Fragment */}
    <motion.p
      variants={descAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
      className="font-serif text-[0.75rem] font-light italic text-[#B5A48B] relative z-10 mt-3"
    >
      — {card.philosopher}
    </motion.p>
  </div>
);
