"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export function LoginModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (user: { username: string; role: string }) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || "Login failed.");
        return;
      }
      onSuccess(data.user);
      onClose();
    } catch {
      setError("Login could not be completed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 text-stone-900">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Private sign in</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-stone-500"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-1 text-sm text-stone-600">Only the owner and admin accounts can open the extra quizzes.</p>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          className="mt-4 w-full rounded-xl border border-stone-300 px-3 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2"
        />
        {error && <p className="mt-2 text-sm text-rose-700">{error}</p>}
        <button
          onClick={submit}
          disabled={busy}
          className="mt-4 w-full rounded-xl bg-emerald-700 py-2 font-bold text-white disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </div>
  );
}
