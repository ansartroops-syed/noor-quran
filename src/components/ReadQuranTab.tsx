"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Type } from "lucide-react";
import { SURAH_LIST } from "@/data/surahMetadata";
import { ReadingSurah, splitLeadingBismillah } from "@/lib/quranReading";
import { QuranScriptPicker } from "@/components/QuranScriptPicker";
import { resolveQuranScript } from "@/lib/quranScripts";

interface ReadQuranTabProps {
  script?: string;
  onScriptChange?: (scriptId: string) => void;
}

export function ReadQuranTab({ script = "standard", onScriptChange }: ReadQuranTabProps) {
  const [activeScript, setActiveScript] = useState(script && script !== "uthmani" && script !== "mushaf" ? script : "standard");
  const [surahNumber, setSurahNumber] = useState(1);
  const [surah, setSurah] = useState<ReadingSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [fontSize, setFontSize] = useState(34);
  const [reloadKey, setReloadKey] = useState(0);
  const theme = resolveQuranScript(activeScript);

  useEffect(() => {
    if (script) setActiveScript(script);
  }, [script]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    fetch(`/api/quran/read/${surahNumber}?script=${encodeURIComponent(activeScript)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Could not load this surah.");
        }
        return data.surah as ReadingSurah;
      })
      .then((nextSurah) => {
        if (active) setSurah(nextSurah);
      })
      .catch((err: Error) => {
        if (active) {
          setSurah(null);
          setError(err.message || "Could not load this surah.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [surahNumber, reloadKey, activeScript]);

  const changeScript = (scriptId: string) => {
    setActiveScript(scriptId);
    onScriptChange?.(scriptId);
  };

  const verseLayout = showTranslation || showTransliteration;
  const readingAyahs = (surah?.ayahs || []).filter((ayah) => !(surah?.number === 1 && ayah.number === 1));

  return (
    <div className="space-y-4 rounded-3xl bg-[#f7f1e3] p-3 text-stone-900 sm:p-5">
      <div className="rounded-2xl border border-stone-300 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-extrabold text-stone-950">Read Quran</h1>
        <p className="mt-1 text-sm text-stone-600">Light reading page. Choose a theme, then read in Arabic.</p>
        <div className="mt-4">
          <QuranScriptPicker value={activeScript} onChange={changeScript} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSurahNumber((current) => Math.max(1, current - 1))}
            disabled={surahNumber <= 1}
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-800 disabled:opacity-40"
          >
            <ChevronLeft className="mr-1 inline h-4 w-4" /> Previous
          </button>
          <select
            value={surahNumber}
            onChange={(event) => setSurahNumber(Number(event.target.value))}
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-900"
          >
            {SURAH_LIST.map((item) => (
              <option key={item.number} value={item.number}>
                {item.number}. {item.nameTransliterated}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSurahNumber((current) => Math.min(114, current + 1))}
            disabled={surahNumber >= 114}
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-800 disabled:opacity-40"
          >
            Next <ChevronRight className="ml-1 inline h-4 w-4" />
          </button>
          <label className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800">
            <input type="checkbox" checked={showTranslation} onChange={(event) => setShowTranslation(event.target.checked)} />
            Translation
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800">
            <input type="checkbox" checked={showTransliteration} onChange={(event) => setShowTransliteration(event.target.checked)} />
            Transliteration
          </label>
          <label className="flex min-w-40 items-center gap-2 text-xs text-stone-700">
            <Type className="h-4 w-4" />
            <input
              type="range"
              min={24}
              max={52}
              step={2}
              value={fontSize}
              onChange={(event) => setFontSize(Number(event.target.value))}
            />
          </label>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white py-16 text-center text-stone-700">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-700" />
          <p className="mt-3 text-sm">Loading Quran text...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-rose-300 bg-white p-6 text-center text-rose-700">
          <p>{error}</p>
          <button
            onClick={() => setReloadKey((current) => current + 1)}
            className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && surah && (
        <article className={`rounded-3xl px-4 py-6 sm:px-8 ${theme.themeClass}`}>
          <header className="mb-6 border-b border-black/10 pb-4 text-center">
            <h2 className="font-arabic text-4xl font-bold sm:text-5xl">{surah.nameArabic}</h2>
            <p className="mt-1 text-lg font-semibold">Surah {surah.nameTransliterated}</p>
            <p className="text-sm opacity-70">{surah.nameEnglish} · {surah.versesCount} verses</p>
          </header>

          {surah.number !== 9 && (
            <div className="mb-8 border-y border-black/10 px-3 py-5 text-center">
              <p className={`${theme.fontClass} text-4xl leading-loose sm:text-5xl`} dir="rtl">
                {surah.bismillah || theme.bismillah}
              </p>
              <p className="text-sm">Bismillah ir-Rahman ir-Rahim</p>
            </div>
          )}

          {verseLayout ? (
            <div className="space-y-5">
              {readingAyahs.map((ayah) => (
                <section key={ayah.number} className="border-b border-black/10 pb-4">
                  <p className={`${theme.fontClass} text-right leading-[2.2]`} style={{ fontSize }} dir="rtl">
                    {(ayah.number === 1 ? splitLeadingBismillah(ayah.arabic).ayah : ayah.arabic)}{" "}
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-current align-middle text-[11px]">
                      {ayah.number}
                    </span>
                  </p>
                  {showTransliteration && <p className="mt-2 text-sm italic opacity-80">{ayah.transliteration}</p>}
                  {showTranslation && <p className="mt-1 text-base leading-relaxed">{ayah.translation}</p>}
                </section>
              ))}
            </div>
          ) : (
            <p className={`${theme.fontClass} text-right leading-[2.3]`} style={{ fontSize }} dir="rtl">
              {readingAyahs.map((ayah) => (
                <span key={ayah.number}>
                  {(ayah.number === 1 ? splitLeadingBismillah(ayah.arabic).ayah : ayah.arabic)}{" "}
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-current align-middle text-[11px]">
                    {ayah.number}
                  </span>{" "}
                </span>
              ))}
            </p>
          )}
        </article>
      )}
    </div>
  );
}
