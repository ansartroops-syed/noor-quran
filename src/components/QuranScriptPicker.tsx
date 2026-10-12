"use client";

import { QURAN_SCRIPTS } from "@/lib/quranScripts";

interface QuranScriptPickerProps {
  value: string;
  onChange: (scriptId: string) => void;
}

export function QuranScriptPicker({ value, onChange }: QuranScriptPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QURAN_SCRIPTS.map((script) => {
        const selected = value === script.id;
        return (
          <button
            key={script.id}
            type="button"
            onClick={() => onChange(script.id)}
            className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold ${
              selected
                ? "border-amber-400 bg-amber-500 text-slate-950"
                : "border-emerald-800 bg-emerald-950/70 text-emerald-100 hover:border-emerald-500"
            }`}
          >
            <span className="block">{script.label}</span>
            <span className={`block text-[10px] font-normal ${selected ? "text-slate-800" : "text-slate-400"}`}>
              {script.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
