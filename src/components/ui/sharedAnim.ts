export const titleAnim = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.5 }
  }
};

export const descAnim = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8, ease: "easeOut" } }
};

export const LABEL_CLS = "text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#B5A48B] mb-3 relative z-10";
export const TITLE_CLS = "atom-title text-[1.5rem] font-semibold italic leading-[125%] tracking-[-0.015em] text-[#1C1C1E] mb-4 relative z-10";
export const TITLE_STYLE = { fontFamily: "var(--font-literary)" } as const;
export const SUBTEXT_CLS = "atom-subtext font-sans text-[0.8125rem] font-light leading-[170%] text-[#6B6B6F] relative z-10";
