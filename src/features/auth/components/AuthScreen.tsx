import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface AuthScreenProps {
}

/** Lambda monogram — bespoke SVG lettermark for Logos */
const LogosMonogram = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
    <path
      d="M8 40 L24 8 L40 40"
      stroke="#1C1C1E"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />
    <path
      d="M16 28 L34 28"
      stroke="#1C1C1E"
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
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw new Error("Invalid email or password. Cannot delete account.");
        
        const { error: rpcError } = await supabase.rpc('delete_user');
        if (rpcError) throw new Error("Failed to delete account. Did you run the SQL setup script?");
        
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
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#FAF8F3] text-[#1C1C1E] p-4 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#B5A48B]/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[10%] right-[20%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-[#D4CFC5]/20 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />
      
      <motion.div
        className="w-full max-w-[380px] bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] border border-[#E8E4DC]/80 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Brand Header ── */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
          {/* Monogram */}
          <div className="w-16 h-16 bg-[#FAF8F3] rounded-2xl flex items-center justify-center mb-5 shadow-inner border border-[#E8E4DC] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E8E4DC]/20 to-transparent" />
            <LogosMonogram />
          </div>

          {/* Wordmark */}
          <h1 className="text-3xl font-serif italic font-semibold tracking-tight mb-1 text-[#1C1C1E]">
            Logos
          </h1>


        </motion.div>

        {/* ── Auth Form ── */}
        <motion.form variants={itemVariants} onSubmit={handleAuth} className="space-y-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#FAF8F3]/50 hover:bg-[#FAF8F3] focus:bg-white border border-[#E8E4DC] rounded-xl px-4 py-3.5 text-sm text-[#1C1C1E] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#B5A48B]/20 focus:border-[#B5A48B]/50 transition-all duration-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#FAF8F3]/50 hover:bg-[#FAF8F3] focus:bg-white border border-[#E8E4DC] rounded-xl px-4 py-3.5 text-sm text-[#1C1C1E] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#B5A48B]/20 focus:border-[#B5A48B]/50 transition-all duration-300"
            required
          />
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-600 text-xs text-center pt-1"
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
                className="text-emerald-600 text-xs text-center pt-1"
              >
                {success}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold rounded-xl px-4 py-3.5 text-sm transition-all active:scale-[0.98] disabled:opacity-50 mt-2 ${
              isDelete
                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                : "bg-gradient-to-b from-[#2A2A2E] to-[#1C1C1E] text-white shadow-[0_2px_10px_rgba(28,28,30,0.12)] hover:shadow-[0_4px_14px_rgba(28,28,30,0.2)] hover:-translate-y-[1px] border border-[#1C1C1E]"
            }`}
          >
            {loading ? "Processing…" : isDelete ? "Permanently Delete Account" : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </motion.form>


        {/* ── Secondary Actions ── */}
        <motion.div variants={itemVariants} className="mt-8 flex flex-col items-center gap-3">
          {!isDelete && (
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              type="button"
              className="text-xs text-neutral-500 hover:text-[#1C1C1E] transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in." : "Need an account? Sign up."}
            </button>
          )}

          {!isSignUp && !isDelete && (
            <button
              onClick={handleForgotPassword}
              type="button"
              className="text-xs text-neutral-500 hover:text-[#1C1C1E] transition-colors"
            >
              Forgot your password?
            </button>
          )}
        </motion.div>

        {/* ── Danger Zone (visually subordinate) ── */}
        <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-[#E8E4DC]/60 flex justify-center">
          <button
            onClick={() => {
              setIsDelete(!isDelete);
              setIsSignUp(false);
              setError(null);
              setSuccess(null);
            }}
            type="button"
            className={`text-[11px] transition-colors ${isDelete ? "text-neutral-500 hover:text-[#1C1C1E]" : "text-neutral-400 hover:text-red-600"}`}
          >
            {isDelete ? "Cancel — go back to sign in." : "Delete account"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
