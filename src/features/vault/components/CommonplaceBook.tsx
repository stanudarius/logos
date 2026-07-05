import React, { useState, useEffect, useRef } from "react";
import { Reorder, motion, AnimatePresence } from "motion/react";
import { Network, FileText, Download, FolderPlus, Folder, Trash2, BookMarked, X } from "lucide-react";
import type { SavedVaultCard } from "@/src/features/vault/types";
import { supabase } from "@/src/lib/supabase";

const AnnotationInput = React.memo(({ id, initialValue, onUpdate }: { id: string, initialValue: string, onUpdate: (id: string, text: string) => void }) => {
  const [text, setText] = useState(initialValue);
  
  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  return (
    <textarea
      className="w-full bg-transparent border-t border-[#E8E4DC] pt-2 text-[11px] font-mono text-[#3A3A3E] placeholder:text-[#B5A48B]/50 resize-none outline-none focus:bg-white/60 focus:ring-1 focus:ring-[#B5A48B]/30 rounded-b min-h-[48px] transition-colors"
      placeholder="Your annotation…"
      rows={2}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onUpdate(id, text)}
      onPointerDown={(e) => e.stopPropagation()} // Prevent drag when typing
    />
  );
});

interface CommonplaceBookProps {
  cards: SavedVaultCard[];
  onUpdateAnnotation: (id: string, text: string) => void;
  onAssignToFolder: (id: string, folderName: string | undefined) => void;
  onDeleteFromVault: (id: string) => void;
}

const CommonplaceBook: React.FC<CommonplaceBookProps> = ({
  cards,
  onUpdateAnnotation,
  onAssignToFolder,
  onDeleteFromVault
}) => {
  const [orderedCards, setOrderedCards] = useState(cards);
  const [isExporting, setIsExporting] = useState(false);

  // Folder states
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [assigningCardId, setAssigningCardId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");

  const folders = Array.from(new Set(cards.map(c => c.user_folder).filter(Boolean))) as string[];
  const displayCards = activeFolder ? orderedCards.filter(c => c.user_folder === activeFolder) : orderedCards;

  // Sync incoming cards while preserving custom order
  useEffect(() => {
    setOrderedCards(prevOrdered => {
      const newCardsMap = new Map(cards.map(c => [c.id, c]));
      const nextOrdered = prevOrdered
        .filter(c => newCardsMap.has(c.id))
        .map(c => newCardsMap.get(c.id)!);
      const existingIds = new Set(nextOrdered.map(c => c.id));
      const newlyAdded = cards.filter(c => !existingIds.has(c.id));
      return [...nextOrdered, ...newlyAdded];
    });
  }, [cards]);

  const handleReorder = React.useCallback((newOrder: SavedVaultCard[]) => {
    if (activeFolder) return;
    setOrderedCards(newOrder);
  }, [activeFolder]);

  const displayCardsWithRot = React.useMemo(() => {
    return displayCards.map(card => ({
      ...card,
      _rot: (card.id.charCodeAt(0) % 7) - 3
    }));
  }, [displayCards]);

  const handleExport = async () => {
    if (orderedCards.length === 0) return;
    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('export', {
        body: { cards: orderedCards }
      });
      
      if (error) throw error;
      
      const blob = new Blob([data.summary], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "My_Commonplace_Book.md";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#EAE7DF] rounded-3xl border border-[#D4CFC5] shadow-inner relative">

      {/* ── Sticky vault header ── */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 flex justify-between items-center border-b border-[#D4CFC5]/60 bg-[#EAE7DF] z-20">
        <div>
          <h3 className="text-sm font-serif italic text-[#1C1C1E] font-semibold leading-tight">
            Commonplace Book
          </h3>
          <p className="text-[9px] font-mono text-[#B5A48B] uppercase tracking-widest">
            {cards.length} {cards.length === 1 ? "idea" : "ideas"} collected
          </p>
        </div>

        {/* Folder filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[55%]">
          {folders.length > 0 && (
            <>
              <button
                onClick={() => setActiveFolder(null)}
                className={`flex-shrink-0 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all ${
                  !activeFolder
                    ? "bg-[#1C1C1E] text-white"
                    : "bg-white/60 text-[#6B6B6F] hover:text-[#1C1C1E] border border-[#D4CFC5]"
                }`}
              >
                All
              </button>
              {folders.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFolder(f === activeFolder ? null : f)}
                  className={`flex-shrink-0 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all ${
                    activeFolder === f
                      ? "bg-[#B5A48B] text-white"
                      : "bg-white/60 text-[#6B6B6F] hover:text-[#1C1C1E] border border-[#D4CFC5]"
                  }`}
                >
                  <Folder className="w-2.5 h-2.5" />
                  {f}
                  {activeFolder === f && (
                    <X className="w-2.5 h-2.5" />
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ── Vault Scroll Area ── */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 relative z-10">
        {displayCards.length === 0 && activeFolder ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-70">
            <div className="w-12 h-12 rounded-full border border-[#D4CFC5] flex items-center justify-center mb-2">
              <Folder className="w-5 h-5 text-[#B5A48B]" />
            </div>
            <p className="text-sm font-serif italic text-[#1C1C1E]">This folder is empty.</p>
            <button
              onClick={() => {
                const firstUnassigned = orderedCards.find(c => !c.user_folder);
                if (firstUnassigned) {
                  setAssigningCardId(firstUnassigned.id);
                } else if (orderedCards.length > 0) {
                  setAssigningCardId(orderedCards[0].id);
                }
              }}
              className="px-4 py-1.5 rounded-full border border-[#D4CFC5] text-[10px] uppercase font-bold tracking-wider text-[#6B6B6F] hover:bg-black/5 transition-all"
            >
              Move cards here
            </button>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={displayCards}
            onReorder={handleReorder}
            className="space-y-4"
          >
          {displayCardsWithRot.map((card) => (
            <Reorder.Item
              key={card.id}
              value={card}
              id={`sticky-${card.id}`}
              dragListener={!activeFolder}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              whileDrag={{ scale: 1.05, zIndex: 50, rotate: 0, cursor: "grabbing" }}
              className={`bg-[#FFFCE8] p-3 rounded shadow-md border border-[#E8E4DC] relative ${activeFolder ? "cursor-default" : "cursor-grab"}`}
              style={{ rotate: `${card._rot}deg`, willChange: "transform" }}
            >
              {/* Pin decoration */}
              <div className="absolute top-1 right-1/2 translate-x-1/2 w-8 h-2 bg-red-400/20 rounded-full" />

              {/* Card controls */}
              <div className="absolute top-2 right-2 flex items-center gap-0.5">
                <button
                  onClick={() => onDeleteFromVault(card.id)}
                  className="p-1.5 text-[#B5A48B] hover:text-red-500 transition-colors rounded-full hover:bg-black/5"
                  title="Remove from Vault"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setAssigningCardId(card.id)}
                  className="p-1.5 text-[#B5A48B] hover:text-[#1C1C1E] transition-colors rounded-full hover:bg-black/5"
                  title="Assign to Folder"
                >
                  {card.user_folder ? <Folder className="w-3.5 h-3.5 fill-current" /> : <FolderPlus className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Card content */}
              <div className="flex items-center gap-2 mb-1 pr-12">
                <span className="text-[8px] font-bold font-mono uppercase tracking-[0.2em] text-[#B5A48B] block">
                  {card.philosopher}
                </span>
                {card.user_folder && (
                  <span className="text-[7px] font-mono bg-[#E8E4DC] text-[#6B6B6F] px-1.5 py-0.5 rounded-sm uppercase tracking-widest">
                    {card.user_folder}
                  </span>
                )}
              </div>
              <h4 className="text-xs font-serif italic text-[#1C1C1E] font-semibold leading-tight mb-1">
                {card.explore_title}
              </h4>
              <p className="text-[10px] text-[#6B6B6F] font-light leading-snug mb-3">
                {card.explore_subtext}
              </p>

              <AnnotationInput
                id={card.id}
                initialValue={card.annotation || ""}
                onUpdate={onUpdateAnnotation}
              />
            </Reorder.Item>
          ))}
          </Reorder.Group>
        )}
      </div>

      {/* ── Export CTA — full-width at bottom ── */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-[#D4CFC5]/60 bg-[#EAE7DF]/95 backdrop-blur-sm z-20">
        <button
          onClick={handleExport}
          disabled={isExporting || orderedCards.length === 0}
          className="w-full py-2.5 bg-[#1C1C1E] text-[#FAF8F3] text-[11px] font-bold rounded-xl active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2 hover:bg-[#2C2C2E]"
        >
          <Download className="w-3.5 h-3.5" />
          {isExporting ? "Synthesizing…" : "Export as Markdown"}
        </button>
      </div>

      {/* ── Assign to Folder Modal ── */}
      <AnimatePresence>
        {assigningCardId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#1C1C1E]/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 8 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="bg-[#FAF8F3] rounded-2xl p-5 shadow-xl w-full max-w-[300px] border border-[#D4CFC5]"
            >
              <h3 className="font-serif italic text-lg text-[#1C1C1E] mb-4">Assign to Folder</h3>

              {folders.length > 0 && (
                <div className="mb-5 space-y-2">
                  <p className="text-[10px] font-mono text-[#B5A48B] uppercase tracking-widest">Existing Folders</p>
                  <div className="flex flex-wrap gap-2">
                    {folders.map(f => (
                      <button
                        key={f}
                        onClick={() => {
                          onAssignToFolder(assigningCardId, f);
                          setAssigningCardId(null);
                        }}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-[#D4CFC5] bg-white hover:border-[#B5A48B] hover:text-[#B5A48B] transition-colors"
                      >
                        <Folder className="w-3 h-3" />
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-[10px] font-mono text-[#B5A48B] uppercase tracking-widest">New Folder</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="E.g., Stoic Toolkit"
                    className="flex-1 bg-white border border-[#D4CFC5] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#B5A48B] focus:ring-1 focus:ring-[#B5A48B]/30"
                  />
                  <button
                    onClick={() => {
                      if (newFolderName.trim()) {
                        onAssignToFolder(assigningCardId, newFolderName.trim());
                        setNewFolderName("");
                        setAssigningCardId(null);
                      }
                    }}
                    className="bg-[#1C1C1E] text-[#FAF8F3] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#2C2C2E]"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-between border-t border-[#D4CFC5] pt-3">
                <button
                  onClick={() => {
                    onAssignToFolder(assigningCardId, undefined);
                    setAssigningCardId(null);
                  }}
                  className="text-xs text-red-500 font-bold hover:underline"
                >
                  Remove from Folder
                </button>
                <button
                  onClick={() => setAssigningCardId(null)}
                  className="text-xs text-[#6B6B6F] hover:text-[#1C1C1E] font-bold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(CommonplaceBook);
