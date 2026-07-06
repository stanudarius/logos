import React from "react";
import { motion } from "motion/react";
import { getInitials } from "@/src/utils/aesthetics";

export const Monogram = ({ philosopher }: { philosopher?: string | null }) => (
  <motion.span
    initial={{ scale: 1.4, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 0.07 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    viewport={{ once: false, amount: 0.2 }}
    style={{ willChange: "transform, opacity" }}
    className="atom-monogram absolute left-[-1.5rem] top-1/2 -translate-y-1/2 font-[var(--font-literary)] text-[14rem] font-semibold text-[#1C1C1E] leading-none pointer-events-none select-none z-0"
  >
    {[...getInitials(philosopher)][0]}
  </motion.span>
);
