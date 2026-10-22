// Shared Mushaf script definitions — verified against quran.com v4
// (King Fahd / Tanzil-compatible texts) + AlQuran Cloud fallback.
// Order matters: Standard (Imlaei) is FIRST = the default most readers
// recognise (no wasla, standard sukun). Uthmani/IndoPak keep their
// authentic marks — those are correct Mushaf spellings, not mistakes.

export type QuranScriptId = "standard" | "uthmani" | "indopak" | "plain";

export interface QuranScriptOption {
  id: QuranScriptId;
  label: string;
  arabicLabel: string;
  desc: string;
  longDesc: string;
  // CSS font stack tuned for this script (loaded in globals.css)
  fontFamily: string;
  fontClass: "font-script-standard" | "font-script-uthmani" | "font-script-indopak" | "font-script-plain";
  // quran.com v4 endpoint suffix under /quran/verses/
  quranComEndpoint: "imlaei" | "uthmani" | "indopak" | "uthmani_simple";
  // alquran.cloud fallback edition for this script
  fallbackEdition: string;
  // human-readable source citation
  sourceName: string;
}

export const DEFAULT_QURAN_SCRIPT: QuranScriptId = "standard";

export const QURAN_SCRIPTS: QuranScriptOption[] = [
  {
    id: "standard",
    label: "Mushaf Standard (Imlaei)",
    arabicLabel: "الرسم الإملائي",
    desc: "Clear standard spelling — familiar letters, full harakat. Default.",
    longDesc:
      "Standard Imlaei spelling (quran.com imlaei, verified). Uses plain alif (ا), standard sukun (ْ), full tashkeel. This is the clearest reading text and the default. Example 1:2 — الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ.",
    fontFamily: "'Amiri', 'Noto Naskh Arabic', 'Scheherazade New', serif",
    fontClass: "font-script-standard",
    quranComEndpoint: "imlaei",
    fallbackEdition: "quran-simple",
    sourceName: "quran.com imlaei → AlQuran Cloud quran-simple",
  },
  {
    id: "uthmani",
    label: "Uthmani (Madinah Mushaf)",
    arabicLabel: "الرسم العثماني",
    desc: "Saudi Madinah Mushaf spelling — wasla (ٱ), dagger alef, waqf marks.",
    longDesc:
      "Authentic Madinah Mushaf (quran.com uthmani, King Fahd Complex compatible). The small wasla-alif (ٱ) and superscript marks (ـٰ) are CORRECT Uthmani orthography — e.g. ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ. Needs the Uthmani font to display perfectly.",
    fontFamily: "'Amiri Quran', 'Scheherazade New', 'Amiri', serif",
    fontClass: "font-script-uthmani",
    quranComEndpoint: "uthmani",
    fallbackEdition: "quran-uthmani",
    sourceName: "quran.com uthmani → AlQuran Cloud quran-uthmani",
  },
  {
    id: "indopak",
    label: "IndoPak (South Asian Mushaf)",
    arabicLabel: "رسم هندو باكستاني",
    desc: "Pakistani/Indian 15-line Hafizi print — explicit vowels, rounded jazm.",
    longDesc:
      "South-Asian Hafizi Mushaf (quran.com indopak). Uses explicit initial vowels (اَ اِ), rounded jazm (ۡ instead of ْ), superscript alef on Allah (لِلّٰهِ) and verse-end marks (ۙؕ). E.g. 1:2 — اَلۡحَمۡدُ لِلّٰهِ رَبِّ الۡعٰلَمِیۡنَۙ. The ۡ shape is correct IndoPak jazm, not a mistake.",
    fontFamily: "'Gulzar', 'Noto Nastaliq Urdu', 'Lateef', 'Amiri', serif",
    fontClass: "font-script-indopak",
    quranComEndpoint: "indopak",
    fallbackEdition: "quran-uthmani",
    sourceName: "quran.com indopak",
  },
  {
    id: "plain",
    label: "Plain (No diacritics / symbols)",
    arabicLabel: "بدون تشكيل",
    desc: "Letters only — no tashkeel, no waqf symbols. Beginners.",
    longDesc:
      "Bare letters derived from the verified text (quran.com uthmani_simple). No harakat, no waqf marks. Example 1:2 — الحمد لله رب العلمين. Best for letter-recognition practice.",
    fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
    fontClass: "font-script-plain",
    quranComEndpoint: "uthmani_simple",
    fallbackEdition: "quran-simple-clean",
    sourceName: "quran.com uthmani_simple → AlQuran Cloud quran-simple-clean",
  },
];

export function getScriptOption(id: string): QuranScriptOption {
  return QURAN_SCRIPTS.find((s) => s.id === id) ?? QURAN_SCRIPTS[0];
}

export function isQuranScriptId(v: unknown): v is QuranScriptId {
  return v === "standard" || v === "uthmani" || v === "indopak" || v === "plain";
}

/** Remove invisible formatting / private-use chars from quran.com texts. */
export function cleanScriptText(text: string): string {
  if (!text) return text;
  return (
    text
      // directional formatting + zero-width chars (incl. ZWSP/ZWNJ/ZWJ/word joiner)
      .replace(/[‎‏‪‫‬‭‮⁠⁡⁢⁣⁤﻿￹￺​‌‍⁠]/g, "")
      // private-use area (ayah ornaments embedded in indopak text)
      .replace(/[-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/** True if the token contains at least one Arabic letter (not just a waqf symbol). */
export function isArabicWordToken(token: string): boolean {
  return /[ء-غف-يٱڪگچپڤەۏ]/.test(token);
}

/** Split cleaned Arabic into word tokens, dropping standalone waqf symbols. */
export function splitArabicWords(text: string): string[] {
  return cleanScriptText(text)
    .split(/\s+/)
    .filter((w) => w && isArabicWordToken(w));
}

/**
 * Extra cleaning for the "Plain" script: strip ALL tashkeel, superscript
 * marks, tatweel and waqf/ornament symbols, leaving letters only.
 * Also normalises wasla-alif and hamza variants to plain alif.
 */
export function stripToPlainLetters(text: string): string {
  if (!text) return text;
  let t = cleanScriptText(text);
  t = t
    // harakat + superscript alef/small marks + shadda/sukun etc.
    .replace(/[ً-ٰٟـ]/g, "")
    // maddah over alef etc. leftovers + superscript seen/meem variants
    .replace(/[ٰٖٜٟٗ٘ٙٚٛٝٞ]/g, "")
    // waqf + sajdah + rub + ornamental marks
    .replace(/[ۖۗۘۙۚۛۜ۝۞ۣ۟۠ۡۢۤۥۦؕؔ]/g, "")
    // normalise alef variants to plain alef
    .replace(/[ٱأإآ]/g, "ا")
    .replace(/\s+/g, " ")
    .trim();
  return t;
}

/** localStorage key for the reader script preference. */
export const SCRIPT_STORAGE_KEY = "noor-quran-script";

export function readStoredScript(): QuranScriptId {
  if (typeof window === "undefined") return DEFAULT_QURAN_SCRIPT;
  try {
    const v = window.localStorage.getItem(SCRIPT_STORAGE_KEY);
    if (isQuranScriptId(v)) return v;
  } catch {
    // ignore
  }
  return DEFAULT_QURAN_SCRIPT;
}

export function storeScript(id: QuranScriptId) {
  try {
    window.localStorage.setItem(SCRIPT_STORAGE_KEY, id);
  } catch {
    // ignore
  }
}
