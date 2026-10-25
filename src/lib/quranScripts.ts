// Canonical Quran script definitions.
// This file deliberately exports every helper name used across the app so
// older/duplicated imports (resolveQuranScript, getScriptOption, cleanVerseText,
// cleanScriptText, stripToPlainLetters) all resolve.

export type QuranScriptId = "standard" | "uthmani" | "mushaf" | "indopak" | "plain";

export interface QuranScriptOption {
  id: QuranScriptId;
  label: string;
  arabicLabel: string;
  description: string;
  desc: string;
  longDesc: string;
  arabic: string;
  fontClass: string;
  themeClass: string;
  endpoint: "standard" | "uthmani" | "qpc_hafs" | "indopak" | "uthmani_simple";
  field: string;
  quranComEndpoint: "imlaei" | "uthmani" | "indopak" | "uthmani_simple";
  fallbackEdition: string;
  sourceName: string;
  bismillah: string;
}

const STANDARD_BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
const UTHMANI_BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
const INDOPAK_BISMILLAH = "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ";
const PLAIN_BISMILLAH = "بسم الله الرحمن الرحيم";

export const DEFAULT_QURAN_SCRIPT: QuranScriptId = "standard";
export const SCRIPT_STORAGE_KEY = "noor-quran-script";

export const QURAN_SCRIPTS: QuranScriptOption[] = [
  {
    id: "standard",
    label: "Standard Quran",
    arabicLabel: "الرسم الإملائي",
    description: "Printed style, like common Quran apps",
    desc: "Clear standard spelling with full vowels. Default.",
    longDesc: "Standard spelling used by most Quran apps. Example: اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ",
    arabic: "اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ",
    fontClass: "font-scheherazade",
    themeClass: "quran-theme-uthmani",
    endpoint: "standard",
    field: "text_standard",
    quranComEndpoint: "imlaei",
    fallbackEdition: "quran-simple",
    sourceName: "quran.com imlaei",
    bismillah: STANDARD_BISMILLAH,
  },
  {
    id: "uthmani",
    label: "Uthmani",
    arabicLabel: "الرسم العثماني",
    description: "Madinah Mushaf spelling",
    desc: "Madinah Mushaf with wasla and dagger alef.",
    longDesc: "Authentic Madinah Uthmani text. Example: ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
    arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
    fontClass: "font-scheherazade",
    themeClass: "quran-theme-uthmani",
    endpoint: "uthmani",
    field: "text_uthmani",
    quranComEndpoint: "uthmani",
    fallbackEdition: "quran-uthmani",
    sourceName: "quran.com uthmani",
    bismillah: UTHMANI_BISMILLAH,
  },
  {
    id: "mushaf",
    label: "Mushaf Al-Quran Standard",
    arabicLabel: "مصحف المدينة",
    description: "King Fahd Complex Hafs text",
    desc: "King Fahd Complex Hafs text.",
    longDesc: "King Fahd Complex Hafs text with ayah numbers removed from the verse.",
    arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
    fontClass: "font-mushaf",
    themeClass: "quran-theme-mushaf",
    endpoint: "qpc_hafs",
    field: "text_qpc_hafs",
    quranComEndpoint: "uthmani",
    fallbackEdition: "quran-uthmani",
    sourceName: "quran.com qpc_hafs",
    bismillah: UTHMANI_BISMILLAH,
  },
  {
    id: "indopak",
    label: "IndoPak",
    arabicLabel: "رسم هندو باكستاني",
    description: "South Asian Mushaf script",
    desc: "South Asian Hafizi print.",
    longDesc: "IndoPak script with rounded jazm and superscript alef. Example: اَلۡحَمۡدُ لِلّٰهِ رَبِّ الۡعٰلَمِیۡنَۙ",
    arabic: "اَلۡحَمۡدُ لِلّٰهِ رَبِّ الۡعٰلَمِیۡنَۙ",
    fontClass: "font-indopak",
    themeClass: "quran-theme-indopak",
    endpoint: "indopak",
    field: "text_indopak",
    quranComEndpoint: "indopak",
    fallbackEdition: "quran-uthmani",
    sourceName: "quran.com indopak",
    bismillah: INDOPAK_BISMILLAH,
  },
  {
    id: "plain",
    label: "No diacritics or symbols",
    arabicLabel: "بدون تشكيل",
    description: "Plain Arabic letters only",
    desc: "Letters only, no vowels or pause marks.",
    longDesc: "Bare Arabic letters for letter-recognition practice.",
    arabic: "الحمد لله رب العالمين",
    fontClass: "font-scheherazade",
    themeClass: "quran-theme-plain",
    endpoint: "uthmani_simple",
    field: "text_uthmani_simple",
    quranComEndpoint: "uthmani_simple",
    fallbackEdition: "quran-simple-clean",
    sourceName: "quran.com uthmani_simple",
    bismillah: PLAIN_BISMILLAH,
  },
];

export function resolveQuranScript(value: string | null | undefined): QuranScriptOption {
  const key = value === "mushaf" ? "mushaf" : value;
  return QURAN_SCRIPTS.find((script) => script.id === key) ?? QURAN_SCRIPTS[0];
}

export function getScriptOption(id: string | null | undefined): QuranScriptOption {
  return resolveQuranScript(id);
}

export function isQuranScriptId(value: unknown): value is QuranScriptId {
  return QURAN_SCRIPTS.some((script) => script.id === value);
}

export function cleanScriptText(text: string): string {
  return (text || "")
    .replace(/[\u200e\u200f\u200b\ufeff]/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanVerseText(text: string, scriptId?: QuranScriptId | string): string {
  let cleaned = cleanScriptText(text);
  if (scriptId === "plain") cleaned = stripToPlainLetters(cleaned);
  if (scriptId === "mushaf") cleaned = cleaned.replace(/[\s\u200f]*[\u0660-\u0669\u06f0-\u06f9\d]+$/u, "").trim();
  return cleaned;
}

export function normalizePrintedQuran(text: string): string {
  return cleanScriptText(text)
    .replace(/\u06e1/g, "\u0652")
    .replace(/([\u064b-\u0650])\u0651/g, "\u0651$1");
}

export function isArabicWordToken(token: string): boolean {
  return /[\u0621-\u064a\u0671\u06a9\u06af\u06d2]/.test(token);
}

export function splitArabicWords(text: string): string[] {
  return cleanScriptText(text)
    .split(/\s+/)
    .filter((word) => word && isArabicWordToken(word));
}

export function stripToPlainLetters(text: string): string {
  return cleanScriptText(text)
    .replace(/[\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g, "")
    .replace(/[\u066e-\u06d3]/g, (match) => match)
    .replace(/[\u0671\u0623\u0625\u0622]/g, "\u0627")
    .trim();
}

export function readStoredScript(): QuranScriptId {
  if (typeof window === "undefined") return DEFAULT_QURAN_SCRIPT;
  try {
    const stored = window.localStorage.getItem(SCRIPT_STORAGE_KEY);
    if (isQuranScriptId(stored)) return stored;
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
