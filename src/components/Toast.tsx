import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ToastProps {
  message: string | null;
}

const Toast: React.FC<ToastProps> = React.memo(({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div 
        initial={{ opacity: 0, y: -45, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -25, scale: 0.95 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-[#FDFCF8] px-5 py-3 rounded-2xl shadow-xl text-xs font-medium tracking-wide flex items-center gap-2 border border-neutral-800"
      >
        <CheckCircle2 className="w-4 h-4 text-[#B5A48B] flex-shrink-0" />
        <span>{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
));

Toast.displayName = "Toast";

export default Toast;
