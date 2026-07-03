import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen } from 'lucide-react';

interface AuthScreenProps {
}

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
      // Need to provide a redirectUrl if we have a specific path to handle resets
      // Assuming default behavior for now
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
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/10 shadow-2xl">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-serif italic font-semibold tracking-tight">Logos</h1>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          {success && <p className="text-emerald-400 text-xs text-center">{success}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold rounded-xl px-4 py-3 text-sm transition-colors active:scale-[0.98] disabled:opacity-50 ${
              isDelete 
                ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50" 
                : "bg-white text-black hover:bg-neutral-200"
            }`}
          >
            {loading ? "Processing..." : isDelete ? "Permanently Delete Account" : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4">
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

          <button
            onClick={() => {
              setIsDelete(!isDelete);
              setIsSignUp(false);
              setError(null);
              setSuccess(null);
            }}
            type="button"
            className={`text-xs transition-colors ${isDelete ? "text-neutral-400 hover:text-white" : "text-red-500/60 hover:text-red-500"}`}
          >
            {isDelete ? "Cancel deletion, go back to sign in." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};
