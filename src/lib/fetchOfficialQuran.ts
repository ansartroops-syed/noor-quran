import { SURAH_LIST } from "@/data/surahMetadata";
import { cleanVerseText, resolveQuranScript, stripHtml } from "@/lib/quranScripts";

export interface OfficialAyah {
  number: number;
  arabic: string;
  translation: string;
  transliteration: string;
}

export interface OfficialSurahText {
  number: number;
  nameArabic: string;
  nameTransliterated: string;
  nameEnglish: string;
  versesCount: number;
  revelationType: "Meccan" | "Medinan";
  juzNumber: number;
  script: string;
  bismillah: string | null;
  ayahs: OfficialAyah[];
}

async function readJson(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "NoorQuran/1.0 (educational Quran reader)",
    },
    next: { revalidate: 86400 },
  });
  if (!response.ok) {
    throw new Error(`Quran text request failed (${response.status})`);
  }
  return response.json();
}

export async function fetchOfficialSurah(surahNumber: number, requestedScript?: string | null): Promise<OfficialSurahText> {
  const meta = SURAH_LIST.find((surah) => surah.number === surahNumber);
  if (!meta) {
    throw new Error("Choose a surah from 1 to 114.");
  }

  const script = resolveQuranScript(requestedScript);
  const [arabicJson, translationJson, transliterationJson] = await Promise.all([
    readJson(`https://api.quran.com/api/v4/quran/verses/${script.endpoint}?chapter_number=${surahNumber}`),
    readJson(`https://api.quran.com/api/v4/quran/translations/20?chapter_number=${surahNumber}`),
    readJson(`https://api.quran.com/api/v4/quran/translations/57?chapter_number=${surahNumber}`),
  ]);

  const arabicVerses = Array.isArray(arabicJson.verses) ? arabicJson.verses : [];
  const translations = Array.isArray(translationJson.translations) ? translationJson.translations : [];
  const transliterations = Array.isArray(transliterationJson.translations) ? transliterationJson.translations : [];

  if (arabicVerses.length !== meta.versesCount) {
    throw new Error("The official verse count did not match, so this surah was not shown.");
  }

  const ayahs: OfficialAyah[] = arabicVerses.map((verse: { verse_key?: string; [key: string]: unknown }, index: number) => {
    const expectedKey = `${surahNumber}:${index + 1}`;
    if (verse.verse_key && verse.verse_key !== expectedKey) {
      throw new Error("The official verse order did not match, so this surah was not shown.");
    }

    const arabic = cleanVerseText(String(verse[script.field] || ""), script.id);
    if (!arabic) {
      throw new Error("An official Arabic verse was missing, so this surah was not shown.");
    }

    return {
      number: index + 1,
      arabic,
      translation: stripHtml(String(translations[index]?.text || "")),
      transliteration: stripHtml(String(transliterations[index]?.text || "")),
    };
  });

  return {
    number: meta.number,
    nameArabic: meta.nameArabic,
    nameTransliterated: meta.nameTransliterated,
    nameEnglish: meta.nameEnglish,
    versesCount: meta.versesCount,
    revelationType: meta.revelationType,
    juzNumber: meta.juzNumber,
    script: script.id,
    bismillah: meta.number === 9 ? null : script.bismillah,
    ayahs,
  };
}
