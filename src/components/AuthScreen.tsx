import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface AuthScreenProps {
}

/** Lambda monogram — bespoke SVG lettermark for Logos */
const LogosMonogram = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
    <path
      d="M8 40 L24 8 L40 40"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />
    <path
      d="M16 28 L34 28"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
};

export const AuthScreen: React.FC<AuthScreenProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isDelete) {
        // Step 1: Authenticate to prove identity
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw new Error("Invalid email or password. Cannot delete account.");
        
        // Step 2: Delete via RPC
        const { error: rpcError } = await supabase.rpc('delete_user');
        if (rpcError) throw new Error("Failed to delete account. Did you run the SQL setup script?");
        
        // Step 3: Clean up session
        await supabase.auth.signOut();
        
        setSuccess("Your account has been permanently deleted.");
        setIsDelete(false);
        setPassword('');
        return;
      }

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      const msg = err.message || "An error occurred during authentication.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setSuccess("Password reset link sent! Check your email.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#0A0A0A] text-white p-8">
      <motion.div
        className="w-full max-w-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Brand Header ── */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-10">
          {/* Monogram */}
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.04)]">
            <LogosMonogram />
          </div>

          {/* Wordmark */}
          <h1 className="text-3xl font-serif italic font-semibold tracking-tight mb-1.5">
            Logos
          </h1>

          {/* Tagline */}
          <p className="text-[11px] text-neutral-500 tracking-[0.18em] uppercase font-light">
            Philosophy, distilled.
          </p>
        </motion.div>

        {/* ── Auth Form ── */}
        <motion.form variants={itemVariants} onSubmit={handleAuth} className="space-y-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/60 transition-all"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/60 transition-all"
            required
          />
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-xs text-center pt-1"
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                key="success"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-emerald-400 text-xs text-center pt-1"
              >
                {success}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold rounded-xl px-4 py-3 text-sm transition-all active:scale-[0.98] disabled:opacity-50 mt-1 ${
              isDelete
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40"
                : "bg-white text-black hover:bg-neutral-100"
            }`}
          >
            {loading ? "Processing…" : isDelete ? "Permanently Delete Account" : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </motion.form>

        {/* ── Secondary Actions ── */}
        <motion.div variants={itemVariants} className="mt-6 flex flex-col items-center gap-3">
          {!isDelete && (
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              type="button"
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in." : "Need an account? Sign up."}
            </button>
          )}

          {!isSignUp && !isDelete && (
            <button
              onClick={handleForgotPassword}
              type="button"
              className="text-xs text-neutral-500 hover:text-white transition-colors"
            >
              Forgot your password?
            </button>
          )}
        </motion.div>

        {/* ── Danger Zone (visually subordinate) ── */}
        <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-white/5 flex justify-center">
          <button
            onClick={() => {
              setIsDelete(!isDelete);
              setIsSignUp(false);
              setError(null);
              setSuccess(null);
            }}
            type="button"
            className={`text-[11px] transition-colors ${isDelete ? "text-neutral-400 hover:text-white" : "text-neutral-700 hover:text-red-500/80"}`}
          >
            {isDelete ? "Cancel — go back to sign in." : "Delete account"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
