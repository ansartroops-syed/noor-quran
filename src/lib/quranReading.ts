export interface ReadingAyah {
  number: number;
  arabic: string;
  translation: string;
  transliteration: string;
}

export interface ReadingSurah {
  number: number;
  nameArabic: string;
  nameTransliterated: string;
  nameEnglish: string;
  versesCount: number;
  revelationType: "Meccan" | "Medinan";
  bismillah: string | null;
  ayahs: ReadingAyah[];
}

const BISMILLAH_UTHMANI = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

export function splitLeadingBismillah(text: string): { bismillah: string | null; ayah: string } {
  const cleaned = text.replace(/^\uFEFF/, "").trim();
  const match = cleaned.match(/^(بِسْمِ\s+\S+\s+\S+\s+\S+)\s+([\s\S]+)$/);
  if (!match) {
    return { bismillah: null, ayah: cleaned };
  }

  const opening = match[1];
  if (!opening.includes("بِسْمِ") || !opening.includes("حِيم")) {
    return { bismillah: null, ayah: cleaned };
  }

  return { bismillah: opening, ayah: match[2].trim() };
}

export function standardBismillah(): string {
  return BISMILLAH_UTHMANI;
}
