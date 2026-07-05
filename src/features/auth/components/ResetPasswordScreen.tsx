import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
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
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#FAF8F3] text-[#1C1C1E] p-4 relative overflow-hidden absolute inset-0 z-50">
      {/* Decorative Orbs */}
      <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#B5A48B]/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[10%] right-[20%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-[#D4CFC5]/20 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />
      
      <div className="w-full max-w-[380px] bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] border border-[#E8E4DC]/80 relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-[#FAF8F3] rounded-2xl flex items-center justify-center mb-5 shadow-inner border border-[#E8E4DC] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E8E4DC]/20 to-transparent" />
            <KeyRound className="w-8 h-8 text-[#1C1C1E] relative z-10" />
          </div>
          <h1 className="text-2xl font-serif italic font-semibold tracking-tight text-[#1C1C1E]">Reset Password</h1>
          <p className="text-neutral-500 text-sm mt-2">Enter your new password below.</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FAF8F3]/50 hover:bg-[#FAF8F3] focus:bg-white border border-[#E8E4DC] rounded-xl px-4 py-3.5 text-sm text-[#1C1C1E] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#B5A48B]/20 focus:border-[#B5A48B]/50 transition-all duration-300"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#FAF8F3]/50 hover:bg-[#FAF8F3] focus:bg-white border border-[#E8E4DC] rounded-xl px-4 py-3.5 text-sm text-[#1C1C1E] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#B5A48B]/20 focus:border-[#B5A48B]/50 transition-all duration-300"
              required
            />
          </div>
          
          {error && <p className="text-red-600 text-xs text-center">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-b from-[#2A2A2E] to-[#1C1C1E] text-white shadow-[0_2px_10px_rgba(28,28,30,0.12)] hover:shadow-[0_4px_14px_rgba(28,28,30,0.2)] hover:-translate-y-[1px] border border-[#1C1C1E] font-semibold rounded-xl px-4 py-3.5 text-sm transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};
