import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Pause, RotateCcw } from "lucide-react";


interface ZenModeProps {

  onClose: () => void;
  onSessionComplete: () => void;
}

const DURATION_PRESETS = [
  { label: "5 min", seconds: 5 * 60 },
  { label: "15 min", seconds: 15 * 60 },
  { label: "25 min", seconds: 25 * 60 },
];

const SOUNDSCAPES = [
  { id: "rain", label: "Rain", emoji: "🌧️" },
  { id: "fire", label: "Fire", emoji: "🔥" },
  { id: "lofi", label: "Lo-fi", emoji: "🎵" },
  { id: "silence", label: "Silence", emoji: "🤫" },
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

    if (type === "fire") {
      // Fire: brown noise (integrated white noise) with warmth
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 500;
      source.connect(lowpass);
      lowpass.connect(gain);
      source.start();
      return () => { source.stop(); gain.disconnect(); };
    }

    if (type === "lofi") {
      // Lo-fi: pink noise with warm low-pass
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 350;
      lowpass.Q.value = 0.7;
      source.connect(lowpass);
      lowpass.connect(gain);
      source.start();
      return () => { source.stop(); gain.disconnect(); };
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
      style={{ backgroundColor: "rgba(10, 10, 10, 0.95)" }}
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
          <svg width="260" height="260" viewBox="0 0 260 260" className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
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
                <span className="text-5xl">🧘</span>
                <p className="text-lg font-serif italic text-[#5CB888]">+15 XP</p>
              </motion.div>
            ) : (
              <>
                <span className="text-5xl font-light text-white/90 tabular-nums tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>
                  {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/30 mt-2">
                  {isRunning ? "Contemplating..." : hasStarted ? "Paused" : "Ready"}
                </span>
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
                      ? "bg-white/15 text-white border border-white/20"
                      : "bg-white/5 text-white/40 border border-transparent hover:bg-white/10 hover:text-white/60"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Soundscape selector */}
          {!isComplete && (
            <div className="flex justify-center gap-2">
              {SOUNDSCAPES.map(sound => (
                <button
                  key={sound.id}
                  onClick={() => setSelectedSound(sound.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${
                    selectedSound === sound.id
                      ? "bg-white/10 text-white/80 border border-white/15"
                      : "bg-transparent text-white/30 border border-transparent hover:text-white/50"
                  }`}
                >
                  <span className="text-base">{sound.emoji}</span>
                  <span>{sound.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Play / Pause / Reset controls */}
          <div className="flex justify-center gap-3">
            {isComplete ? (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white/80 rounded-2xl text-xs font-semibold transition-all active:scale-95 border border-white/10"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Session</span>
              </button>
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
