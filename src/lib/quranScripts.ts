export const QURAN_SCRIPTS = [
  {
    id: "standard",
    label: "Standard Quran",
    description: "Printed style, like common Quran apps",
    endpoint: "standard",
    field: "text_standard",
    fontClass: "font-scheherazade",
    themeClass: "quran-theme-uthmani",
    bismillah: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
  },
  {
    id: "uthmani",
    label: "Uthmani",
    description: "Madinah Uthmani vowels",
    endpoint: "uthmani",
    field: "text_uthmani",
    fontClass: "font-scheherazade",
    themeClass: "quran-theme-uthmani",
    bismillah: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
  },
  {
    id: "mushaf",
    label: "Mushaf Al-Quran Standard",
    description: "King Fahd Complex Hafs text",
    endpoint: "qpc_hafs",
    field: "text_qpc_hafs",
    fontClass: "font-mushaf",
    themeClass: "quran-theme-mushaf",
    bismillah: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ",
  },
  {
    id: "indopak",
    label: "IndoPak",
    description: "South Asian script",
    endpoint: "indopak",
    field: "text_indopak",
    fontClass: "font-indopak",
    themeClass: "quran-theme-indopak",
    bismillah: "بِسۡمِ اللهِ الرَّحۡمٰنِ الرَّحِيۡمِ",
  },
  {
    id: "plain",
    label: "No diacritics or symbols",
    description: "Plain Arabic, no vowels or pause marks",
    endpoint: "uthmani_simple",
    field: "text_uthmani_simple",
    fontClass: "font-scheherazade",
    themeClass: "quran-theme-plain",
    bismillah: "بسم الله الرحمن الرحيم",
  },
] as const;

export type QuranScriptId = (typeof QURAN_SCRIPTS)[number]["id"];

export function resolveQuranScript(value: string | null | undefined) {
  return QURAN_SCRIPTS.find((script) => script.id === value) ?? QURAN_SCRIPTS[0];
}

export function normalizePrintedQuran(text: string): string {
  return text
    .replace(/\u06e1/g, "\u0652")
    .replace(/[\u200e\u200f\u200b\ufeff]/g, "")
    .replace(/([\u064b-\u0650])\u0651/g, "\u0651$1")
    .replace(/\u00a0/g, " ")
    .trim();
}

export function cleanVerseText(text: string, scriptId: QuranScriptId): string {
  let cleaned = text.replace(/^\uFEFF/, "").replace(/\u00a0/g, " ").trim();
  if (scriptId === "standard") {
    cleaned = normalizePrintedQuran(cleaned);
  }
  if (scriptId === "mushaf") {
    cleaned = cleaned.replace(/[\s\u200b\u200f]*[\u0660-\u0669\u06f0-\u06f9\d]+$/u, "").trim();
  }
  return cleaned;
}

export function stripHtml(text: string): string {
  return text
    .replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
