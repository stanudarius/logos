import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PenLine, X, Trash2, Send } from "lucide-react";
import type { JournalEntry } from "../types";

interface JournalProps {
  cardId: string;
  cardTitle: string;
  entries: JournalEntry[];
  onAddEntry: (cardId: string, text: string) => void;
  onDeleteEntry: (entryId: string) => void;
}

const Journal: React.FC<JournalProps> = ({
  cardId,
  cardTitle,
  entries,
  onAddEntry,
  onDeleteEntry,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draftText, setDraftText] = useState("");

  const cardEntries = entries.filter(e => e.card_id === cardId);

  const handleSubmit = useCallback(() => {
    const trimmed = draftText.trim();
    if (!trimmed) return;
    onAddEntry(cardId, trimmed);
    setDraftText("");
  }, [cardId, draftText, onAddEntry]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " · " +
      d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`p-1 transition-colors ${
          isOpen
            ? "text-[#B5A48B] hover:text-[#8A7A62]"
            : "text-[#D4CFC5] hover:text-[#B5A48B]"
        }`}
        title="Philosophy Journal"
      >
        <PenLine className="w-3.5 h-3.5" />
      </button>

      {/* Journal drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-2 border-t border-dashed border-[#E8E4DC] space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <PenLine className="w-3 h-3 text-[#B5A48B]" />
                  <span className="text-[8px] font-mono font-bold uppercase tracking-[0.15em] text-[#B5A48B]">
                    Commonplace Book
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#D4CFC5] hover:text-[#8A8A8E] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Compose area */}
              <div className="relative">
                <textarea
                  value={draftText}
                  onChange={e => setDraftText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write your reflection..."
                  rows={2}
                  className="w-full text-[11px] font-serif italic text-[#1C1C1E] bg-[#F5F3ED] border border-[#E8E4DC] rounded-xl px-3 py-2 pr-9 resize-none focus:outline-none focus:border-[#B5A48B] placeholder:text-[#C4BFB5] transition-colors leading-relaxed"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!draftText.trim()}
                  className="absolute right-2 bottom-2 p-1 rounded-lg bg-[#1C1C1E] text-[#FAF8F3] hover:bg-[#2C2C2E] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>

              {/* Entries list */}
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-0.5" style={{ scrollbarWidth: "thin" }}>
                {cardEntries.length === 0 ? (
                  <p className="text-[10px] text-[#B5A48B] font-light italic text-center py-3">
                    No reflections yet. Write your first thought above.
                  </p>
                ) : (
                  cardEntries.map(entry => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="group bg-[#F5F3ED]/60 border border-[#E8E4DC]/60 rounded-lg px-3 py-2 space-y-1"
                    >
                      <p className="text-[11px] font-serif text-[#3A3A3E] leading-relaxed">
                        {entry.text}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-mono text-[#B5A48B]">
                          {formatDate(entry.created_at)}
                        </span>
                        <button
                          onClick={() => onDeleteEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 text-[#D4CFC5] hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Journal;
