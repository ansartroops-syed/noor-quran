"use client";

import React from "react";
import { ScrollText, Check, ShieldCheck } from "lucide-react";
import { QURAN_SCRIPTS, type QuranScriptId } from "@/lib/quranScripts";

interface ScriptSelectorProps {
  value: QuranScriptId;
  onChange: (id: QuranScriptId) => void;
  compact?: boolean;
}

const PREVIEW_AYAH: Record<QuranScriptId, string> = {
  standard: "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ",
  uthmani: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
  indopak: "بِسۡمِ اللهِ الرَّحۡمٰنِ الرَّحِیۡمِ",
  plain: "بسم الله الرحمن الرحيم",
};

/**
 * Shared Mushaf script picker — Standard / Uthmani / IndoPak / Plain.
 * Used identically in "Read Quran" and "Full Quran" tabs.
 * Every option shows a live preview in its own authentic font.
 */
export function ScriptSelector({ value, onChange, compact = false }: ScriptSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
        <ScrollText className="w-3.5 h-3.5" />
        Arabic Text Script
      </div>
      <div className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
        {QURAN_SCRIPTS.map((s) => {
          const active = value === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              title={s.longDesc}
              className={`p-2.5 rounded-xl border text-left transition ${
                active
                  ? "bg-emerald-700/70 border-amber-400 ring-1 ring-amber-400/50 text-white"
                  : "bg-emerald-950/50 border-emerald-900 text-slate-300 hover:border-emerald-500"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold leading-tight">{s.label}</span>
                {active && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
              </div>
              <div
                className={`${s.fontClass} text-xl mt-1 text-amber-200`}
                dir="rtl"
                lang="ar"
              >
                {PREVIEW_AYAH[s.id]}
              </div>
              <div className="font-arabic text-[11px] text-amber-300/70" dir="rtl">
                {s.arabicLabel}
              </div>
              {!compact && (
                <div className="text-[10px] text-slate-400 mt-1 leading-snug">{s.desc}</div>
              )}
            </button>
          );
        })}
      </div>
      {!compact && (
        <p className="text-[10px] text-slate-500 flex items-start gap-1.5 leading-relaxed">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-px" />
          <span>
            Verified texts: quran.com v4 (Uthmani / IndoPak / Imlaei / Simple) with AlQuran Cloud
            fallback — same sources as Muslim Pro &amp; the King Fahd Glorious Quran Complex
            prints. Wasla (ٱ) and rounded jazm (ۡ) are correct Mushaf spellings, not mistakes.
          </span>
        </p>
      )}
    </div>
  );
}
