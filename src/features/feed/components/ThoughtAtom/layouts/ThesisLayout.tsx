import React from "react";
import { motion } from "motion/react";
import type { FeedCard } from "@/src/features/feed/types";
import { Monogram } from "@/src/components/ui/Monogram";
import { FadeText } from "@/src/components/ui/FadeText";
import {
  LABEL_CLS,
  TITLE_CLS,
  TITLE_STYLE,
  SUBTEXT_CLS,
  titleAnim,
  descAnim,
} from "@/src/components/ui/sharedAnim";

export const ThesisLayout = ({ card }: { card: FeedCard }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center pl-6 pr-16 pb-16 relative overflow-hidden">
    <Monogram philosopher={card.philosopher} />
    <FadeText text={card.topic} className={LABEL_CLS} />
    <motion.h1
      variants={titleAnim}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      className={TITLE_CLS}
      style={TITLE_STYLE}
    >
      <FadeText text={card.explore_title} speed={0.015} delay={0.4} />
    </motion.h1>
    <motion.p
      variants={descAnim}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      className={`${SUBTEXT_CLS} max-w-[85%]`}
    >
      {card.explore_subtext}
    </motion.p>
  </div>
);
