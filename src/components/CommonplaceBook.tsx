import React, { useState, useEffect, useRef } from "react";
import { Reorder, motion } from "motion/react";
import { Network, FileText, Download, FolderPlus, Folder, Trash2 } from "lucide-react";
import type { SavedVaultCard } from "../types";

const AnnotationInput = React.memo(({ id, initialValue, onUpdate }: { id: string, initialValue: string, onUpdate: (id: string, text: string) => void }) => {
  const [text, setText] = useState(initialValue);
  
  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  return (
    <textarea
      className="w-full bg-transparent border-t border-[#E8E4DC] pt-2 text-[10px] font-mono text-[#3A3A3E] placeholder:text-[#B5A48B]/50 resize-none outline-none focus:bg-white/50 transition-colors rounded-b"
      placeholder="Your annotation..."
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
  onDeleteFromVault,

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
      // 1. Keep cards that still exist, update them with new data (e.g. annotations)
      const newCardsMap = new Map(cards.map(c => [c.id, c]));
      const nextOrdered = prevOrdered
        .filter(c => newCardsMap.has(c.id))
        .map(c => newCardsMap.get(c.id)!);

      // 2. Append newly saved cards to the end
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#EAE7DF] rounded-3xl border border-[#D4CFC5] shadow-inner relative">
      {/* Header Actions */}
      <div className="absolute top-2 left-2 right-2 z-20 flex justify-between items-center pointer-events-none">

        {/* Folder Selector */}
        <select
          className="pointer-events-auto bg-[#FAF8F3] text-[#1C1C1E] text-[10px] font-bold tracking-wider uppercase border border-[#D4CFC5] rounded-lg px-2 py-1.5 outline-none shadow-sm cursor-pointer hover:border-[#B5A48B] transition-colors"
          value={activeFolder || ""}
          onChange={(e) => setActiveFolder(e.target.value || null)}
        >
          <option value="">All Cards</option>
          {folders.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="pointer-events-auto bg-[#1C1C1E] text-[#FAF8F3] px-2 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase border border-[#1C1C1E] shadow-sm flex items-center gap-1 hover:bg-[#2C2C2E] transition-all disabled:opacity-50"
        >
          <Download className="w-3 h-3" />
          {isExporting ? "Synthesizing..." : "Export"}
        </button>
      </div>

      {/* Vault Scroll Area */}
      <div
        className="flex-1 overflow-y-auto p-4 pt-12 relative z-10"
      >
        <Reorder.Group
          axis="y"
          values={displayCards}
          onReorder={handleReorder}
          className="space-y-4 pb-20"
        >
          {displayCardsWithRot.map((card) => {
            return (
              <Reorder.Item
                key={card.id}
                value={card}
                id={`sticky-${card.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                whileDrag={{ scale: 1.05, zIndex: 50, rotate: 0, cursor: "grabbing" }}
                className="bg-[#FFFCE8] p-3 rounded shadow-md border border-[#E8E4DC] cursor-grab relative"
                style={{ rotate: `${card._rot}deg`, willChange: "transform" }}
              >
                <div className="absolute top-1 right-1/2 translate-x-1/2 w-8 h-2 bg-red-400/20 rounded-full" />

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
            );
          })}
        </Reorder.Group>
      </div>

      {/* Assign to Folder Modal */}
      {assigningCardId && (
        <div className="absolute inset-0 z-50 bg-[#1C1C1E]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] rounded-2xl p-5 shadow-xl w-full max-w-[300px] border border-[#D4CFC5]">
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
                      className="text-xs px-3 py-1.5 rounded-lg border border-[#D4CFC5] bg-white hover:border-[#B5A48B] hover:text-[#B5A48B] transition-colors"
                    >
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
                  className="flex-1 bg-white border border-[#D4CFC5] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#B5A48B]"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CommonplaceBook);
