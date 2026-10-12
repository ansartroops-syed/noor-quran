"use client";

import { QURAN_SCRIPTS, resolveQuranScript } from "@/lib/quranScripts";

interface QuranScriptPickerProps {
  value: string;
  onChange: (scriptId: string) => void;
}

export function QuranScriptPicker({ value, onChange }: QuranScriptPickerProps) {
  const selected = resolveQuranScript(value);

  return (
    <section className="rounded-2xl border border-stone-300 bg-white p-4 text-stone-900 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Reading theme</p>
          <h2 className="text-lg font-extrabold text-stone-950">Choose a light Quran theme</h2>
        </div>
        <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold text-white">
          {selected.label}
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {QURAN_SCRIPTS.map((script) => {
          const active = selected.id === script.id;
          return (
            <button
              key={script.id}
              type="button"
              onClick={() => onChange(script.id)}
              className={`rounded-xl border p-3 text-left text-stone-900 ${
                active ? "border-emerald-700 ring-2 ring-emerald-700" : "border-stone-300"
              } ${script.themeClass}`}
            >
              <span className="block text-sm font-bold">{script.label}</span>
              <span className="mt-1 block text-[11px] text-stone-600">{script.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
