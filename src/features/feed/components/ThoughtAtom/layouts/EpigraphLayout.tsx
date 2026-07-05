import React from "react";
import { motion } from "motion/react";
import type { FeedCard } from "@/src/features/feed/types";
import { TypewriterText } from "@/src/components/ui/TypewriterText";
import { LABEL_CLS, TITLE_CLS, TITLE_STYLE, SUBTEXT_CLS, titleAnim, descAnim } from "@/src/components/ui/sharedAnim";

export const EpigraphLayout = ({ card }: { card: FeedCard }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center pl-7 pr-16 pb-16 relative overflow-hidden">
    <TypewriterText text={card.topic} className={`${LABEL_CLS} block`} />
    <div className="atom-rule w-8 h-px bg-[#D4CFC5] mb-5 relative z-10" />
    <motion.h1
      variants={titleAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
      className={TITLE_CLS} style={TITLE_STYLE}
    >
      <TypewriterText text={card.explore_title} speed={0.015} delay={0.4} />
    </motion.h1>
    <div className="atom-rule-bottom w-8 h-px bg-[#D4CFC5] mb-4 relative z-10" />
    <motion.p
      variants={descAnim} initial="hidden" whileInView="visible" viewport={{ once: false }}
      className={`${SUBTEXT_CLS} max-w-[90%]`}
    >
      {card.explore_subtext}
    </motion.p>
  </div>
);
