"use client";

import React from "react";
import { QURAN_SCRIPTS } from "@/lib/quranScripts";

interface QuranScriptPickerProps {
  value: string;
  onChange?: (id: string) => void;
  compact?: boolean;
}

// Local normalizer — intentionally NOT imported from "@/lib/quranScripts"
// so this component builds even if that module is an older cached copy.
function normalizeScriptId(v: unknown): string {
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "standard" || s === "uthmani" || s === "mushaf" || s === "indopak" || s === "plain") {
      return s;
    }
  }
  return "standard";
}

/**
 * QuranScriptPicker — compatibility picker used by the Read route.
 * Self-contained: only depends on QURAN_SCRIPTS (present in every
 * version of the module), never on newer helper exports.
 */
export function QuranScriptPicker({ value, onChange, compact = false }: QuranScriptPickerProps) {
  const current = normalizeScriptId(value);
  return (
    <div className="space-y-2">
      <div className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
        {QURAN_SCRIPTS.map((s) => {
          const active = current === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange?.(s.id)}
              title={s.desc}
              className={`p-2.5 rounded-xl border text-left transition ${
                active
                  ? "bg-emerald-700/70 border-amber-400 ring-1 ring-amber-400/50 text-white"
                  : "bg-emerald-950/50 border-emerald-900 text-slate-300 hover:border-emerald-500"
              }`}
            >
              <div className="text-xs font-bold leading-tight">{s.label}</div>
              <div className="font-arabic text-[11px] text-amber-300/70" dir="rtl">
                {s.arabicLabel}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuranScriptPicker;
