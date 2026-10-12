"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Loader2, Type } from "lucide-react";
import { SURAH_LIST } from "@/data/surahMetadata";
import { ReadingSurah, splitLeadingBismillah, standardBismillah } from "@/lib/quranReading";

export function ReadQuranTab() {
  const [surahNumber, setSurahNumber] = useState(1);
  const [surah, setSurah] = useState<ReadingSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [fontSize, setFontSize] = useState(34);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    fetch(`/api/quran/read/${surahNumber}`)
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
  }, [surahNumber, reloadKey]);

  const verseLayout = showTranslation || showTransliteration;

  return (
    <div className="space-y-5 pb-24">
      <div className="rounded-3xl border border-emerald-500/30 bg-[#06241c] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Official Uthmani text</p>
            <h1 className="mt-1 text-2xl font-extrabold text-white">Read Quran</h1>
            <p className="mt-1 text-sm text-slate-400">Arabic reading with optional English translation and transliteration.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSurahNumber((current) => Math.max(1, current - 1))}
              disabled={surahNumber <= 1}
              className="rounded-xl border border-emerald-800 px-3 py-2 text-xs font-semibold text-emerald-200 disabled:opacity-40"
            >
              <ChevronLeft className="mr-1 inline h-4 w-4" /> Previous
            </button>
            <select
              value={surahNumber}
              onChange={(event) => setSurahNumber(Number(event.target.value))}
              className="rounded-xl border border-emerald-800 bg-emerald-950 px-3 py-2 text-sm font-semibold text-white"
            >
              {SURAH_LIST.map((item) => (
                <option key={item.number} value={item.number}>
                  {item.number}. {item.nameTransliterated} — {item.nameArabic}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSurahNumber((current) => Math.min(114, current + 1))}
              disabled={surahNumber >= 114}
              className="rounded-xl border border-emerald-800 px-3 py-2 text-xs font-semibold text-emerald-200 disabled:opacity-40"
            >
              Next <ChevronRight className="ml-1 inline h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2 rounded-xl border border-emerald-800 px-3 py-2 text-slate-200">
            <input
              type="checkbox"
              checked={showTranslation}
              onChange={(event) => setShowTranslation(event.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
            Translation
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-emerald-800 px-3 py-2 text-slate-200">
            <input
              type="checkbox"
              checked={showTransliteration}
              onChange={(event) => setShowTransliteration(event.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
            Transliteration
          </label>
          <label className="flex min-w-48 flex-1 items-center gap-2 text-xs text-slate-300">
            <Type className="h-4 w-4 text-emerald-400" />
            <input
              type="range"
              min={24}
              max={52}
              step={2}
              value={fontSize}
              onChange={(event) => setFontSize(Number(event.target.value))}
              className="w-full accent-emerald-500"
            />
          </label>
        </div>
      </div>

      {loading && (
        <div className="py-20 text-center text-emerald-300">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-3 text-sm">Loading official Quran text...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-6 text-center">
          <p className="text-rose-200">{error}</p>
          <button
            onClick={() => setReloadKey((current) => current + 1)}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && surah && (
        <article className="rounded-3xl border border-amber-200/30 bg-[#f7f1e3] px-4 py-6 text-[#1c1917] shadow-2xl sm:px-8 sm:py-8">
          <header className="mb-6 border-b border-amber-900/15 pb-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              {surah.revelationType} · {surah.versesCount} verses
            </p>
            <h2 className="font-arabic mt-2 text-4xl font-bold text-emerald-950 sm:text-5xl">{surah.nameArabic}</h2>
            <p className="mt-1 text-lg font-semibold">Surah {surah.nameTransliterated}</p>
            <p className="text-sm text-stone-600">{surah.nameEnglish}</p>
          </header>

          {surah.number !== 9 && (
            <div className="mb-8 border-y-2 border-amber-700/30 bg-amber-50/80 px-4 py-6 text-center">
              <p className="font-scheherazade text-4xl leading-loose text-emerald-950 sm:text-5xl" dir="rtl">
                {standardBismillah()}
              </p>
              <p className="mt-1 text-sm font-medium text-emerald-800">Bismillah ir-Rahman ir-Rahim</p>
              {surah.number === 1 && <p className="mt-1 text-xs text-stone-500">Verse 1</p>}
            </div>
          )}

          {surah.number === 9 && (
            <p className="mb-6 text-center text-sm text-stone-600">
              Surah At-Tawbah does not begin with Bismillah.
            </p>
          )}

          {verseLayout ? (
            <div className="space-y-6">
              {surah.ayahs
                .filter((ayah) => !(surah.number === 1 && ayah.number === 1))
                .map((ayah) => (
                <section key={ayah.number} className="border-b border-amber-900/10 pb-5">
                  <p
                    className="font-scheherazade text-right leading-[2.2] text-emerald-950"
                    style={{ fontSize: `${fontSize}px` }}
                    dir="rtl"
                  >
                    {(ayah.number === 1 ? splitLeadingBismillah(ayah.arabic).ayah : ayah.arabic)}{" "}
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-700 align-middle text-xs font-bold text-amber-800">
                      {ayah.number}
                    </span>
                  </p>
                  {showTransliteration && ayah.transliteration && (
                    <p className="mt-2 text-sm italic text-emerald-800">{ayah.transliteration}</p>
                  )}
                  {showTranslation && ayah.translation && (
                    <p className="mt-1 text-base leading-relaxed text-stone-800">{ayah.translation}</p>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <p
              className="font-scheherazade text-right leading-[2.35] text-emerald-950"
              style={{ fontSize: `${fontSize}px` }}
              dir="rtl"
            >
              {surah.ayahs
                .filter((ayah) => !(surah.number === 1 && ayah.number === 1))
                .map((ayah) => (
                <span key={ayah.number}>
                  {(ayah.number === 1 ? splitLeadingBismillah(ayah.arabic).ayah : ayah.arabic)}{" "}
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-700 align-middle text-[11px] font-bold text-amber-800">
                    {ayah.number}
                  </span>{" "}
                </span>
              ))}
            </p>
          )}

          <footer className="mt-8 flex items-center justify-between text-sm">
            <button
              onClick={() => setSurahNumber((current) => Math.max(1, current - 1))}
              disabled={surah.number <= 1}
              className="rounded-xl px-3 py-2 font-semibold text-emerald-900 disabled:opacity-40"
            >
              Previous surah
            </button>
            <span className="inline-flex items-center gap-1 text-stone-500">
              <BookOpen className="h-4 w-4" /> {surah.number} / 114
            </span>
            <button
              onClick={() => setSurahNumber((current) => Math.min(114, current + 1))}
              disabled={surah.number >= 114}
              className="rounded-xl px-3 py-2 font-semibold text-emerald-900 disabled:opacity-40"
            >
              Next surah
            </button>
          </footer>
        </article>
      )}
    </div>
  );
}
