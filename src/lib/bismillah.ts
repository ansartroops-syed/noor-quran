// Shared Bismillah helpers — single source of truth for both reader tabs + API.
// Verified 1:1 strings (fetched from quran.com v4, Oct 2026):
//  • uthmani : بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ   (Madinah Mushaf, wasla + dagger-alef)
//  • indopak : بِسۡمِ اللهِ الرَّحۡمٰنِ الرَّحِیۡمِ      (Hafizi print, rounded jazm ۡ)
//  • standard: بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ  (Imlaei — plain alif, standard sukun)
//  • plain   : بسم الله الرحمن الرحيم                  (letters only)
// Standard Mushaf rule:
//  • Surah 1 (Al-Fatiha): Bismillah IS Ayah 1 — no separate header.
//  • Surah 9 (At-Tawbah): no Bismillah at all.
//  • All other Surahs (2–8, 10–114): Bismillah shown once as a separate
//    header at the very top, and stripped from Ayah 1 text if the API
//    prefixed it (AlQuran Cloud Uthmani does this).

export const BISMILLAH_ARABIC = "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ";
export const BISMILLAH_TRANSLITERATION = "Bismi-Llaahir-Rahmaanir-Raheem";
export const BISMILLAH_TRANSLATION =
  "In the name of Allah, the Entirely Merciful, the Especially Merciful.";

/**
 * Script-accurate Bismillah opening line (verified quran.com 1:1).
 * Pass the active QuranScriptId so the header always matches the verses.
 */
export function bismillahForScript(script: string): string {
  if (script === "indopak") return "بِسۡمِ اللهِ الرَّحۡمٰنِ الرَّحِیۡمِ";
  if (script === "plain") return "بسم الله الرحمن الرحيم";
  if (script === "uthmani" || script === "mushaf") return "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";
  return BISMILLAH_ARABIC; // standard / default
}

export function surahHasSeparateBismillah(surahNumber: number): boolean {
  return surahNumber !== 1 && surahNumber !== 9;
}

function normalizeArabicWord(w: string): string {
  return w
    .replace(/[ً-ٰٟـۡ-ۭﭐ-﷿ﹰ-﻿]+/g, "")
    .replace(/[ٱأإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();
}

/**
 * Remove a Bismillah prefix from Ayah 1 text if present.
 * Robust against Uthmani spelling variants (ٱ vs ا, diacritics, tatweel).
 * Only strips when the first 4 words normalize to
 * bsm / allh / alrhmn / alrhym. Otherwise returns text unchanged.
 */
export function stripBismillahPrefix(text: string): string {
  if (!text) return text;
  const t = text.trim();
  const words = t.split(/\s+/);
  if (words.length < 4) return t;

  const n = words.slice(0, 4).map(normalizeArabicWord);
  const isBasmala =
    n[0].includes("بسم") &&
    n[1].includes("الله") &&
    n[2].includes("الرحمن") &&
    n[3].includes("الرحيم");

  if (isBasmala) {
    return words.slice(4).join(" ").trim();
  }
  return t;
}

/** Human note explaining Bismillah placement for a Surah. */
export function bismillahNoteForSurah(surahNumber: number): string | null {
  if (surahNumber === 1)
    return "Bismillah is Ayah 1 of Surah Al-Fatiha itself — recited as part of the Surah.";
  if (surahNumber === 9)
    return "Surah At-Tawbah is the only Surah that does not begin with Bismillah.";
  return null;
}
