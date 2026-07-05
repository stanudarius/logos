import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Pause, RotateCcw } from "lucide-react";


interface ZenModeProps {
  onClose: () => void;
  onSessionComplete: () => void;
}

const DURATION_PRESETS = [
  { label: "5 min",  seconds: 5  * 60 },
  { label: "15 min", seconds: 15 * 60 },
  { label: "25 min", seconds: 25 * 60 },
];

/** SVG icons to replace emoji in soundscape selector */
const RainIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3 9 Q8 3 13 9" />
    <line x1="5"  y1="12" x2="4"  y2="14" />
    <line x1="8"  y1="12" x2="7"  y2="14" />
    <line x1="11" y1="12" x2="10" y2="14" />
  </svg>
);

const SilenceIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

const ForestIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M8 2 L3 8 L6 8 L2 14 L14 14 L10 8 L13 8 Z" />
  </svg>
);

const FireIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M8 14 C11.3 14 14 11.3 14 8 C14 4.7 11.3 2 8 2 C4.7 2 2 4.7 2 8 C2 11.3 4.7 14 8 14 Z" />
    <path d="M8 14 C9.65 14 11 12.65 11 11 C11 9.35 9.65 8 8 8 C6.35 8 5 9.35 5 11 C5 12.65 6.35 14 8 14 Z" />
    <path d="M8 14 L8 8" />
  </svg>
);

const SOUNDSCAPES = [
  { id: "rain",    label: "Rain",    Icon: RainIcon    },
  { id: "forest",  label: "Forest",  Icon: ForestIcon  },
  { id: "fire",    label: "Fire",    Icon: FireIcon    },
  { id: "silence", label: "Silence", Icon: SilenceIcon },
];

/**
 * Creates a procedural ambient soundscape using the Web Audio API.
 * Returns a cleanup function that stops and disconnects all nodes.
 */
let sharedAudioContext: AudioContext | null = null;
function getAudioContext() {
  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    sharedAudioContext = new AudioContext();
  }
  return sharedAudioContext;
}

function createSoundscape(type: string, volume: number): (() => void) | null {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(ctx.destination);

    if (type === "rain") {
      // Rain: band-pass filtered white noise
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 800;
      bandpass.Q.value = 0.5;
      source.connect(bandpass);
      bandpass.connect(gain);
      source.start();
      return () => { source.stop(); gain.disconnect(); };
    }

    if (type === "forest") {
      // Forest: lower band-pass + occasional chirp
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 400; // Lower pitch
      bandpass.Q.value = 0.8;
      source.connect(bandpass);
      bandpass.connect(gain);
      source.start();
      
      // Basic chirp oscillator
      let chirpInterval: ReturnType<typeof setInterval>;
      const playChirp = () => {
        const osc = ctx.createOscillator();
        const chirpGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(3000 + Math.random() * 1000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
        
        chirpGain.gain.setValueAtTime(0, ctx.currentTime);
        chirpGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
        chirpGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        
        osc.connect(chirpGain);
        chirpGain.connect(gain);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        
        chirpInterval = setTimeout(playChirp, 2000 + Math.random() * 8000);
      };
      playChirp();
      
      return () => { source.stop(); gain.disconnect(); clearTimeout(chirpInterval); };
    }

    if (type === "fire") {
      // Fire: low rumble + amplitude LFO
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "lowpass";
      bandpass.frequency.value = 150;
      source.connect(bandpass);
      
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 1.5; // Flutter speed
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.5; // LFO depth
      lfo.connect(lfoGain.gain);
      
      const flutterGain = ctx.createGain();
      flutterGain.gain.value = 0.5;
      bandpass.connect(flutterGain);
      lfoGain.connect(flutterGain);
      flutterGain.connect(gain);
      
      source.start();
      lfo.start();
      return () => { source.stop(); lfo.stop(); gain.disconnect(); };
    }

    return null;
  } catch {
    return null;
  }
}

const ZenMode: React.FC<ZenModeProps> = ({ onClose, onSessionComplete }) => {
  const [selectedDuration, setSelectedDuration] = useState(DURATION_PRESETS[2].seconds);
  const [timeRemaining, setTimeRemaining] = useState(DURATION_PRESETS[2].seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedSound, setSelectedSound] = useState("rain");
  const cleanupAudioRef = useRef<(() => void) | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer countdown logic
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            onSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeRemaining, onSessionComplete]);

  // Audio management — procedural Web Audio API
  useEffect(() => {
    if (cleanupAudioRef.current) {
      cleanupAudioRef.current();
      cleanupAudioRef.current = null;
    }

    if (isRunning && selectedSound !== "silence") {
      cleanupAudioRef.current = createSoundscape(selectedSound, 0.3);
    }

    return () => {
      if (cleanupAudioRef.current) {
        cleanupAudioRef.current();
        cleanupAudioRef.current = null;
      }
    };
  }, [isRunning, selectedSound]);

  const handleStart = useCallback(() => {
    if (getAudioContext().state === "suspended") {
      getAudioContext().resume();
    }
    setIsRunning(true);
    setHasStarted(true);
    setIsComplete(false);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setHasStarted(false);
    setIsComplete(false);
    setTimeRemaining(selectedDuration);
  }, [selectedDuration]);

  const handleDurationChange = useCallback((seconds: number) => {
    if (hasStarted) return;
    setSelectedDuration(seconds);
    setTimeRemaining(seconds);
  }, [hasStarted]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = 1 - timeRemaining / selectedDuration;

  // SVG circle properties
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "rgba(10, 10, 10, 0.97)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-[400px] h-full max-h-[700px] flex flex-col items-center justify-between py-12 px-8"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <motion.h2
            className="text-2xl font-serif italic text-white/90 tracking-tight"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {isComplete ? "Session Complete" : "Zen Mode"}
          </motion.h2>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
            {isComplete ? "You earned mastery points" : "Focused contemplation"}
          </p>
        </div>

        {/* Central Timer Ring */}
        <div className="relative flex items-center justify-center">
          {/* Ambient radial glow — pulses while running */}
          {isRunning && !isComplete && (
            <div
              className="absolute rounded-full animate-zen-glow pointer-events-none"
              style={{
                width: 300,
                height: 300,
                background: "radial-gradient(circle, rgba(181,164,139,0.18) 0%, transparent 70%)",
              }}
            />
          )}

          <svg width="260" height="260" viewBox="0 0 260 260" className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="4"
            />
            {/* Progress ring */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              fill="none"
              stroke={isComplete ? "#5CB888" : "#B5A48B"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>

          {/* Timer display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isComplete ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 200 }}
                className="text-center space-y-2"
              >
                <div className="w-14 h-14 rounded-full bg-[#5CB888]/20 flex items-center justify-center mx-auto mb-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#5CB888" strokeWidth="2" strokeLinecap="round" className="w-7 h-7" style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "drawCheck 0.5s ease-out 0.2s forwards" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <style>{`@keyframes drawCheck { to { stroke-dashoffset: 0; } }`}</style>
                </div>
                <p className="text-lg font-serif italic text-[#5CB888]">Session complete.</p>
                <p className="text-[11px] text-white/50">The silence remains.</p>
              </motion.div>
            ) : (
              <>
                <span className="text-5xl font-light text-white/90 tabular-nums tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>
                  {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/30 mt-2">
                  {isRunning ? "Contemplating…" : hasStarted ? "Paused" : "Ready"}
                </span>
                {/* Breath guide dot — only while running */}
                {isRunning && (
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-[#B5A48B]/60 mt-4 animate-breathe"
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Controls section */}
        <div className="w-full space-y-6">
          {/* Duration presets — only when not started */}
          {!hasStarted && !isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-2"
            >
              {DURATION_PRESETS.map(preset => (
                <button
                  key={preset.seconds}
                  onClick={() => handleDurationChange(preset.seconds)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                    selectedDuration === preset.seconds
                      ? "bg-white/90 text-[#0A0A0A]"
                      : "bg-white/8 text-white/40 border border-white/10 hover:bg-white/12 hover:text-white/60"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Soundscape selector */}
          {!isComplete && (
            <div className="flex justify-center gap-3">
              {SOUNDSCAPES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedSound(id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                    selectedSound === id
                      ? "bg-white/12 text-white/80 border border-white/15"
                      : "bg-transparent text-white/30 border border-transparent hover:text-white/50"
                  }`}
                >
                  <Icon />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Play / Pause / Reset controls */}
          <div className="flex justify-center gap-3">
            {isComplete ? (
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white/80 rounded-2xl text-xs font-semibold transition-all active:scale-95 border border-white/10"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>New Session</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#B5A48B] hover:bg-[#C4B39A] text-[#0F0F11] rounded-2xl text-xs font-semibold transition-all active:scale-95"
                >
                  <span>Return</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={isRunning ? handlePause : handleStart}
                  className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/15 text-white rounded-2xl text-sm font-semibold transition-all active:scale-95 border border-white/10"
                >
                  {isRunning ? (
                    <><Pause className="w-4 h-4" /><span>Pause</span></>
                  ) : (
                    <><Play className="w-4 h-4" /><span>{hasStarted ? "Resume" : "Begin"}</span></>
                  )}
                </button>
                {hasStarted && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white/50 rounded-2xl text-xs font-semibold transition-all active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ZenMode;
