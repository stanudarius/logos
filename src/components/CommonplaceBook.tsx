import React, { useState, useEffect, useRef } from "react";
import { Reorder, motion } from "motion/react";
import { Network, FileText, Download } from "lucide-react";
import type { SavedVaultCard } from "../types";

interface CommonplaceBookProps {
  cards: SavedVaultCard[];
  onUpdateAnnotation: (id: string, text: string) => void;
  onTriggerToast: (msg: string) => void;
}

const CommonplaceBook: React.FC<CommonplaceBookProps> = ({
  cards,
  onUpdateAnnotation,
  onTriggerToast,
}) => {
  const [orderedCards, setOrderedCards] = useState(cards);
  const [isExporting, setIsExporting] = useState(false);
  // Sync incoming cards
  useEffect(() => {
    setOrderedCards(cards);
  }, [cards]);

  const handleExport = async () => {
    if (orderedCards.length === 0) return;
    setIsExporting(true);
    onTriggerToast("Synthesizing Commonplace Book essay...");
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards: orderedCards }),
      });
      const data = await res.json();
      
      // Create a downloadable text file
      const blob = new Blob([data.summary], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "My_Commonplace_Book.md";
      a.click();
      URL.revokeObjectURL(url);
      onTriggerToast("Commonplace Book exported!");
    } catch (err) {
      console.error(err);
      onTriggerToast("Failed to export.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#EAE7DF] rounded-3xl border border-[#D4CFC5] shadow-inner relative">
      {/* Header Actions */}
      <div className="absolute top-2 left-2 right-2 z-20 flex justify-end">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="bg-[#1C1C1E] text-[#FAF8F3] px-2 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase border border-[#1C1C1E] shadow-sm flex items-center gap-1 hover:bg-[#2C2C2E] transition-all disabled:opacity-50"
        >
          <Download className="w-3 h-3" />
          {isExporting ? "Synthesizing..." : "Export"}
        </button>
      </div>



      {/* Corkboard Scroll Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 pt-12 relative z-10"
      >
        <Reorder.Group 
          axis="y" 
          values={orderedCards} 
          onReorder={setOrderedCards}
          className="space-y-4 pb-20"
        >
          {orderedCards.map((card) => {
            // Predictable random rotation based on ID so it stays consistent
            const rot = (card.id.charCodeAt(0) % 7) - 3; // -3 to 3
            
            return (
              <Reorder.Item 
                key={card.id} 
                value={card}
                id={`sticky-${card.id}`}
                className="bg-[#FFFCE8] p-3 rounded shadow-md border border-[#E8E4DC] cursor-grab active:cursor-grabbing relative"
                style={{ rotate: `${rot}deg` }}
              >
                <div className="absolute top-1 right-1/2 translate-x-1/2 w-8 h-2 bg-red-400/20 rounded-full" />
                
                <span className="text-[8px] font-bold font-mono uppercase tracking-[0.2em] text-[#B5A48B] block mb-1">
                  {card.philosopher}
                </span>
                <h4 className="text-xs font-serif italic text-[#1C1C1E] font-semibold leading-tight mb-1">
                  {card.explore_title}
                </h4>
                <p className="text-[10px] text-[#6B6B6F] font-light leading-snug mb-3">
                  {card.explore_subtext}
                </p>

                <textarea
                  className="w-full bg-transparent border-t border-[#E8E4DC] pt-2 text-[10px] font-mono text-[#3A3A3E] placeholder:text-[#B5A48B]/50 resize-none outline-none focus:bg-white/50 transition-colors rounded-b"
                  placeholder="Your annotation..."
                  rows={2}
                  defaultValue={card.annotation || ""}
                  onBlur={(e) => onUpdateAnnotation(card.id, e.target.value)}
                  onPointerDown={(e) => e.stopPropagation()} // Prevent drag when typing
                />
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>
    </div>
  );
};

export default CommonplaceBook;
