"use client";

import React from "react";
import { Palette, Check } from "lucide-react";
import { READING_THEMES, type ReadingThemeId } from "@/lib/readingThemes";

interface ReadingThemeSelectorProps {
  value: ReadingThemeId;
  onChange: (id: ReadingThemeId) => void;
}

/**
 * Reading-theme picker shown at the TOP of Read Quran + Full Quran.
 * Light Mushaf Cream is the default — never dark unless the user picks it.
 */
export function ReadingThemeSelector({ value, onChange }: ReadingThemeSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
        <Palette className="w-3.5 h-3.5" />
        Reading Theme
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {READING_THEMES.map((t) => {
          const active = value === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              title={t.desc}
              className={`p-2 rounded-xl border text-left transition flex items-center gap-2 ${
                active
                  ? "bg-emerald-700/70 border-amber-400 ring-1 ring-amber-400/50 text-white"
                  : "bg-emerald-950/50 border-emerald-900 text-slate-300 hover:border-emerald-500"
              }`}
            >
              <span
                className="w-6 h-6 rounded-full border border-black/30 shrink-0 shadow-inner"
                style={{ backgroundColor: t.dot }}
              />
              <span className="min-w-0">
                <span className="text-[11px] font-bold leading-tight flex items-center gap-1">
                  {t.label}
                  {active && <Check className="w-3 h-3 text-amber-300 shrink-0" />}
                </span>
                <span className="font-arabic text-[11px] opacity-80 block leading-tight" dir="rtl">
                  {t.arabicLabel}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
