import React from "react";
import { motion } from "motion/react";

export const FadeText = ({
  text,
  className,
  speed = 0.04,
  delay = 0.2,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 5 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.1 }}
      style={{ display: "inline-block", willChange: "transform, opacity" }}
    >
      {text}
    </motion.span>
  );
};
