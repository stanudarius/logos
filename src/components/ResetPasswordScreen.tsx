import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { KeyRound } from 'lucide-react';

interface ResetPasswordScreenProps {
  onPasswordReset: () => void;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ onPasswordReset }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      onPasswordReset();
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#0A0A0A] text-white p-8 absolute inset-0 z-50">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/10 shadow-2xl">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-serif italic font-semibold tracking-tight">Reset Password</h1>
          <p className="text-neutral-400 text-sm mt-2">Enter your new password below.</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold rounded-xl px-4 py-3 text-sm hover:bg-neutral-200 transition-colors active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};
