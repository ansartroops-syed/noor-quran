"use client";

import React, { useState } from "react";
import { X, Lock, User, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { adminLogin } from "@/lib/adminAuth";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    const result = await adminLogin(username.trim(), password);
    setLoading(false);
    if (result.ok && result.username) {
      setUsername("");
      setPassword("");
      onSuccess(result.username);
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-sm rounded-3xl border border-emerald-500/40 bg-[#06241c] shadow-2xl overflow-hidden">
        <div className="p-5 bg-[#041a14] border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-white text-base">Family Login</h3>
              <p className="text-[11px] text-slate-400">Private quizzes are for family only 🔒</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900/50 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5" /> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter family username"
              autoComplete="username"
              className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 focus:border-emerald-400 focus:outline-none text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Lock className="w-3.5 h-3.5" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 pr-11 rounded-xl bg-emerald-950/60 border border-emerald-800 focus:border-emerald-400 focus:outline-none text-white text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-white transition"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Unlock Private Quizzes
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            Only the family account can see Kids Maths, English &amp; GK quizzes.
            <br />
            Everyone else just sees the public tabs.
          </p>
        </form>
      </div>
    </div>
  );
}
