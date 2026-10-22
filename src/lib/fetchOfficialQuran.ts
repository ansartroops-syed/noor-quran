import { SURAH_LIST } from "@/data/surahMetadata";
import { cleanVerseText, resolveQuranScript } from "@/lib/quranScripts";

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

export interface OfficialAyah {
  number: number;
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface OfficialSurah {
  surahNumber: number;
  surahName: string;
  ayahs: OfficialAyah[];
  source: string;
  script: string;
}

function orderVerseKeys(a: { verse_key: string }, b: { verse_key: string }): number {
  return a.verse_key.localeCompare(b.verse_key, undefined, { numeric: true });
}

async function fetchQuranComTexts(
  surahNum: number,
  scriptId: string
): Promise<{ texts: string[]; source: string } | null> {
  const endpoint =
    scriptId === "uthmani"
      ? "uthmani"
      : scriptId === "indopak"
        ? "indopak"
        : scriptId === "plain"
          ? "uthmani_simple"
          : "imlaei";
  const textKey =
    endpoint === "uthmani"
      ? "text_uthmani"
      : endpoint === "indopak"
        ? "text_indopak"
        : endpoint === "imlaei"
          ? "text_imlaei"
          : "text_uthmani_simple";
  try {
    const res = await fetch(
      `https://api.quran.com/api/v4/quran/verses/${endpoint}?chapter_number=${surahNum}`,
      {
        headers: { "User-Agent": "NoorQuranByNajAns/1.0 (Quran reader)" },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const verses = json?.verses;
    if (!Array.isArray(verses) || verses.length === 0) return null;
    verses.sort(orderVerseKeys);
    const texts = verses.map((v: Record<string, unknown>) =>
      cleanVerseText(stripHtml(String(v[textKey] ?? "")))
    );
    if (texts.some((t) => !t)) return null;
    return { texts, source: `quran.com:${endpoint}` };
  } catch (err) {
    console.warn(`fetchOfficialQuran quran.com ${endpoint} failed:`, err);
    return null;
  }
}

async function fetchTranslations(
  surahNum: number
): Promise<{ translations: string[]; transliterations: string[] }> {
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.sahih,en.transliteration`
    );
    if (!res.ok) return { translations: [], transliterations: [] };
    const json = await res.json();
    if (json.code !== 200 || !Array.isArray(json.data) || json.data.length < 2) {
      return { translations: [], transliterations: [] };
    }
    return {
      translations: json.data[1].ayahs.map((a: { text: string }) => stripHtml(a.text)),
      transliterations: (json.data[2] || json.data[1]).ayahs.map((a: { text: string }) =>
        stripHtml(a.text)
      ),
    };
  } catch {
    return { translations: [], transliterations: [] };
  }
}

export async function fetchOfficialSurah(
  surahNum: number,
  scriptParam?: string | null
): Promise<OfficialSurah> {
  const script = resolveQuranScript(scriptParam ?? null);
  const meta = SURAH_LIST.find((s) => s.number === surahNum);
  const surahName = meta?.nameTransliterated || `Surah ${surahNum}`;

  const arabic = await fetchQuranComTexts(surahNum, script);
  const tr = await fetchTranslations(surahNum);

  const count = arabic?.texts.length || meta?.versesCount || 0;
  const ayahs: OfficialAyah[] = [];
  for (let i = 0; i < count; i++) {
    ayahs.push({
      number: i + 1,
      arabic: arabic?.texts[i] ?? "",
      transliteration: tr.transliterations[i] ?? "",
      translation: tr.translations[i] ?? "",
    });
  }

  return {
    surahNumber: surahNum,
    surahName,
    ayahs,
    source: arabic?.source ?? "unavailable",
    script,
  };
}
