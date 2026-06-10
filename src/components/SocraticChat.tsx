import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, MessageCircle } from "lucide-react";
import FocusLock from "react-focus-lock";
import { getInitials } from "../utils/aesthetics";

interface ChatMessage {
  role: "user" | "model";
  text: string;
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
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: "user", text: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => abortControllerRef.current?.abort(), 30000); // 30s timeout

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          philosopher,
          topic,
          essayContext,
          messages: updatedMessages,
        }),
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("Failed to reach the philosopher.");

      const data = await res.json();
      if (isMountedRef.current) {
        setMessages(prev => [...prev, { role: "model", text: data.reply }]);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      if (isMountedRef.current) {
        setMessages(prev => [
          ...prev,
          { role: "model", text: "Forgive me — my thoughts were interrupted. Ask again." },
        ]);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    }
  }, [input, isLoading, messages, philosopher, topic, essayContext]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const initials = getInitials(philosopher);

  return (
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="absolute inset-x-0 bottom-0 top-[4%] bg-[#0F0F11] z-[60] flex flex-col rounded-t-[28px] shadow-[0_-8px_40px_rgba(0,0,0,0.4)] border-t border-[#2A2A2E]"
      >
    <FocusLock returnFocus className="flex flex-col h-full w-full">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-[#3A3A3E]" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 border-b border-[#2A2A2E]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#B5A48B] flex items-center justify-center text-[#0F0F11] text-[10px] font-serif italic font-bold">
            {initials}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-white/90 tracking-tight leading-none">
              {philosopher}
            </p>
            <p className="text-[8px] font-mono uppercase tracking-[0.15em] text-[#B5A48B] mt-0.5">
              Socratic Dialogue
            </p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Close Chat"
          className="w-7 h-7 rounded-full bg-[#2A2A2E] hover:bg-[#3A3A3E] flex items-center justify-center text-white/60 hover:text-white transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-3"
        style={{ scrollbarWidth: "thin" }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
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
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[11px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#B5A48B] text-[#0F0F11] rounded-br-md font-medium"
                    : "bg-[#1C1C20] text-white/85 rounded-bl-md font-serif italic border border-[#2A2A2E]"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Thinking indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2"
          >
            <div className="w-6 h-6 rounded-full bg-[#B5A48B]/20 flex items-center justify-center text-[8px] font-serif italic text-[#B5A48B] flex-shrink-0 mt-0.5">
              {initials.charAt(0)}
            </div>
            <div className="bg-[#1C1C20] border border-[#2A2A2E] px-4 py-3 rounded-2xl rounded-bl-md space-y-2 min-w-[160px]">
              <p className="text-[9px] font-serif italic text-[#B5A48B]/70">
                {philosopher.split(" ").pop()} is contemplating...
              </p>
              {/* Shimmer bar */}
              <div className="w-full h-[2px] bg-[#2A2A2E] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B5A48B]/0 via-[#B5A48B]/60 to-[#B5A48B]/0 rounded-full"
                  style={{ width: "40%", animation: "shimmer 1.8s ease-in-out infinite" }}
                />
              </div>
              {/* Animated dots */}
              <div className="flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#B5A48B]/50"
                    style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input area */}
      <div className="px-4 py-3 border-t border-[#2A2A2E] bg-[#0F0F11]">
        <div className="relative flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Challenge ${philosopher}...`}
            rows={1}
            className="flex-1 text-[11px] text-white/90 bg-[#1C1C20] border border-[#2A2A2E] rounded-xl px-3.5 py-2.5 resize-none focus:outline-none focus:border-[#B5A48B]/50 placeholder:text-white/25 transition-colors leading-relaxed"
            style={{ maxHeight: "80px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#B5A48B] text-[#0F0F11] hover:bg-[#C4B39A] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[7px] font-mono text-white/20 text-center mt-2 uppercase tracking-widest">
          AI persona · Not the actual philosopher
        </p>
      </div>
    </FocusLock>
      </motion.div>
  );
};

export default SocraticChat;
