"use client";

import { QURAN_SCRIPTS, QuranScriptId, resolveQuranScript } from "@/lib/quranScripts";

const PREVIEW_AYAH: Record<QuranScriptId, string> = {
  standard: "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ",
  uthmani: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
  mushaf: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
  indopak: "اَلۡحَمۡدُ لِلّٰهِ رَبِّ الۡعٰلَمِیۡنَۙ",
  plain: "الحمد لله رب العالمين",
};

interface ScriptSelectorProps {
  value?: string;
  onChange?: (id: string) => void;
  script?: string;
  onScriptChange?: (id: string) => void;
  [key: string]: unknown;
}

export function ScriptSelector({ value, onChange, script, onScriptChange }: ScriptSelectorProps) {
  const active = value || script || "standard";
  const notify = onChange || onScriptChange;

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {QURAN_SCRIPTS.map((item) => {
        const selected = resolveQuranScript(active).id === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => notify?.(item.id)}
            className={`rounded-xl border p-3 text-left ${
              selected ? "border-emerald-600 ring-2 ring-emerald-600" : "border-stone-300"
            } ${item.themeClass}`}
          >
            <span className="block text-sm font-bold">{item.label}</span>
            <span className={`${item.fontClass} mt-1 block text-right text-lg`} dir="rtl">
              {PREVIEW_AYAH[item.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default ScriptSelector;
