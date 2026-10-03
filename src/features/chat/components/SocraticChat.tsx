import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send } from "lucide-react";
import FocusLock from "react-focus-lock";
import { getInitials } from "@/src/utils/aesthetics";
import { supabase } from "@/src/lib/supabase";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
}

let _msgId = 0;
function nextMsgId(): string {
  return `msg-${++_msgId}-${Date.now()}`;
}

interface SocraticChatProps {
  philosopher: string;
  topic: string;
  essayContext: string;
  onClose: () => void;
}

const SocraticChat: React.FC<SocraticChatProps> = ({
  philosopher,
  topic,
  essayContext,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nextMsgId(),
      role: "model",
      text: `Ah, a curious mind approaches. I am ${philosopher}. Ask me anything about ${topic} — challenge my ideas, and I shall challenge yours.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // We intentionally do NOT auto-focus the input on mount.
  // Auto-focusing an input on iOS immediately pulls up the keyboard and zooms the screen,
  // which is jarring and ruins the slide-up animation.

  const handleSend = useCallback(
    async (overrideInput?: string) => {
      const textToUse = overrideInput || input;
      const trimmed = textToUse.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: nextMsgId(),
        role: "user",
        text: trimmed,
      };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      try {
        abortControllerRef.current = new AbortController();
        const timeoutId = setTimeout(
          () => abortControllerRef.current?.abort(),
          30000,
        );

        const { data, error: invokeError } = await supabase.functions.invoke(
          "chat",
          {
            body: {
              philosopher,
              topic,
              essayContext,
              messages: updatedMessages,
            },
            signal: abortControllerRef.current.signal,
          },
        );

        clearTimeout(timeoutId);

        if (invokeError) throw invokeError;

        if (isMountedRef.current && data) {
          setMessages((prev) => [
            ...prev,
            { id: nextMsgId(), role: "model", text: data.reply },
          ]);
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        if (isMountedRef.current) {
          setMessages((prev) => [
            ...prev,
            {
              id: nextMsgId(),
              role: "model",
              text: "Forgive me — my thoughts were interrupted. Ask again.",
            },
          ]);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          inputRef.current?.focus();
        }
      }
    },
    [input, isLoading, messages, philosopher, topic, essayContext],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const initials = getInitials(philosopher);

  return (
    <div className="flex-1 bg-[#FAF8F3] flex flex-col w-full h-full relative z-[60]">
      <FocusLock
        returnFocus
        autoFocus={false}
        className="flex flex-col h-full w-full"
      >
        <div className="flex justify-center pt-[max(env(safe-area-inset-top),0.75rem)] pb-1">
          <div className="w-10 h-1 rounded-full bg-[#E8E4DC]" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 border-b border-[#E8E4DC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#B5A48B] flex items-center justify-center text-[#FAF8F3] text-[10px] font-serif italic font-bold">
              {initials}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#1C1C1E] tracking-tight leading-none">
                {philosopher}
              </p>
              <p className="text-[8px] font-mono uppercase tracking-[0.15em] text-[#B5A48B] mt-0.5">
                Socratic Dialogue
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close Chat"
            className="w-7 h-7 rounded-full bg-[#F5F3ED] hover:bg-[#E8E4DC] flex items-center justify-center text-[#1C1C1E]/60 hover:text-[#1C1C1E] transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-3"
          style={{ scrollbarWidth: "thin" }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "model" && (
                  <div className="w-6 h-6 rounded-full bg-[#B5A48B]/20 flex items-center justify-center text-[8px] font-serif italic text-[#B5A48B] mr-2 flex-shrink-0 mt-1">
                    {initials.charAt(0)}
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#B5A48B] text-[#FAF8F3] rounded-br-md font-medium"
                      : "bg-[#FFFFFF] text-[#3A3A3E] rounded-bl-md font-serif italic border border-[#E8E4DC]"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {messages.length === 1 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex flex-col gap-2 pt-2 items-end"
            >
              {[
                "What is your strongest argument?",
                "Where do you contradict yourself?",
                "How does this apply today?",
              ].map((starter, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSend(starter);
                  }}
                  className="bg-[#FFFFFF] border border-[#E8E4DC] text-[#1C1C1E]/70 hover:text-[#1C1C1E] hover:bg-[#F5F3ED] px-4 py-2 rounded-full text-[10px] shadow-sm transition-all active:scale-95"
                >
                  {starter}
                </button>
              ))}
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-[#B5A48B]/20 flex items-center justify-center text-[8px] font-serif italic text-[#B5A48B] flex-shrink-0 mt-0.5">
                {initials.charAt(0)}
              </div>
              <div className="bg-[#FFFFFF] shadow-sm border border-[#E8E4DC] px-4 py-3 rounded-2xl rounded-bl-md space-y-2 min-w-[160px]">
                <p className="text-[9px] font-serif italic text-[#B5A48B]/70">
                  {philosopher.split(" ").pop()} is contemplating...
                </p>
                <div className="w-full h-[2px] bg-[#E8E4DC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#B5A48B]/0 via-[#B5A48B]/60 to-[#B5A48B]/0 rounded-full"
                    style={{
                      width: "40%",
                      animation: "shimmer 1.8s ease-in-out infinite",
                    }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#B5A48B]/50"
                      style={{
                        animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="px-4 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] border-t border-[#E8E4DC] bg-[#FAF8F3]">
          <div className="relative flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder=""
              rows={1}
              className="flex-1 text-base text-[#1C1C1E] bg-[#FFFFFF] shadow-inner border border-[#E8E4DC] rounded-[20px] px-4 py-1.5 resize-none focus:outline-none focus:border-[#B5A48B]/50 placeholder:text-[#1C1C1E]/30 transition-colors leading-tight"
              style={{ maxHeight: "80px" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-full bg-[#B5A48B] text-[#FAF8F3] hover:bg-[#C4B39A] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 flex-shrink-0 shadow-sm mb-0.5"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </FocusLock>
    </div>
  );
};

export default SocraticChat;
