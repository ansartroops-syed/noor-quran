import { NextRequest, NextResponse } from "next/server";
import { SURAH_LIST } from "@/data/surahMetadata";
import { EMBEDDED_SURAHS } from "@/data/surahDetailsData";
import { QURANIC_WORDS } from "@/data/quranicWordsData";
import { TAJWEED_RULES } from "@/data/tajweedRulesData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        results: {
          surahs: [],
          ayahs: [],
          vocabulary: [],
          tajweed: [],
        },
      });
    }

    const lowerQuery = query.toLowerCase();

    // 1. Search Surahs list
    const matchedSurahs = SURAH_LIST.filter(
      (s) =>
        s.nameArabic.includes(query) ||
        s.nameTransliterated.toLowerCase().includes(lowerQuery) ||
        s.nameEnglish.toLowerCase().includes(lowerQuery) ||
        String(s.number) === query
    ).slice(0, 8);

    // 2. Search Embedded Ayahs
    const matchedAyahs: Array<{
      surahNumber: number;
      surahName: string;
      ayahNumber: number;
      arabic: string;
      translation: string;
      transliteration: string;
    }> = [];

    for (const [surahNumStr, surahObj] of Object.entries(EMBEDDED_SURAHS)) {
      const sNum = parseInt(surahNumStr, 10);
      for (const ayah of surahObj.ayahs) {
        if (
          ayah.arabicUthmani.includes(query) ||
          ayah.translationSaheeh.toLowerCase().includes(lowerQuery) ||
          ayah.transliteration.toLowerCase().includes(lowerQuery)
        ) {
          matchedAyahs.push({
            surahNumber: sNum,
            surahName: surahObj.nameTransliterated,
            ayahNumber: ayah.ayahNumber,
            arabic: ayah.arabicUthmani,
            translation: ayah.translationSaheeh,
            transliteration: ayah.transliteration,
          });
          if (matchedAyahs.length >= 10) break;
        }
      }
      if (matchedAyahs.length >= 10) break;
    }

    // 3. Search Vocabulary
    const matchedVocab = QURANIC_WORDS.filter(
      (w) =>
        w.arabic.includes(query) ||
        w.transliteration.toLowerCase().includes(lowerQuery) ||
        w.english.toLowerCase().includes(lowerQuery) ||
        w.root.includes(query)
    ).slice(0, 6);

    // 4. Search Tajweed Rules
    const matchedTajweed = TAJWEED_RULES.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerQuery) ||
        r.arabicName.includes(query) ||
        r.definition.toLowerCase().includes(lowerQuery) ||
        r.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 4);

    return NextResponse.json({
      success: true,
      query,
      results: {
        surahs: matchedSurahs,
        ayahs: matchedAyahs,
        vocabulary: matchedVocab,
        tajweed: matchedTajweed,
      },
    });
  } catch (error) {
    console.error("Error in Quran search route:", error);
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 });
  }
}
