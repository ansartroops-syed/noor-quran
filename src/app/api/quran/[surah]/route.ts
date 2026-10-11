import { NextRequest, NextResponse } from "next/server";
import { EMBEDDED_SURAHS, SurahDetail, QuranAyah } from "@/data/surahDetailsData";
import { SURAH_LIST } from "@/data/surahMetadata";

export async function GET(req: NextRequest, { params }: { params: Promise<{ surah: string }> }) {
  try {
    const { surah } = await params;
    const surahNum = parseInt(surah, 10);

    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      return NextResponse.json({ success: false, error: "Invalid surah number (must be 1-114)" }, { status: 400 });
    }

    // Check if we have enriched embedded data
    if (EMBEDDED_SURAHS[surahNum]) {
      return NextResponse.json({
        success: true,
        source: "embedded",
        surah: EMBEDDED_SURAHS[surahNum],
      });
    }

    // Find surah metadata
    const meta = SURAH_LIST.find((s) => s.number === surahNum);
    const surahNameArabic = meta?.nameArabic || `سورة ${surahNum}`;
    const surahNameTrans = meta?.nameTransliterated || `Surah ${surahNum}`;
    const surahNameEng = meta?.nameEnglish || `Surah ${surahNum}`;

    // Fetch from AlQuran Cloud multi-edition API
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.sahih,en.transliteration`,
        { next: { revalidate: 86400 } } // 24hr cache
      );

      if (response.ok) {
        const json = await response.json();
        if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 2) {
          const uthmaniEdition = json.data[0];
          const sahihEdition = json.data[1];
          const transEdition = json.data[2] || json.data[1];

          const ayahs: QuranAyah[] = uthmaniEdition.ayahs.map((ayahObj: { numberInSurah: number; text: string }, index: number) => {
            const rawArabic = ayahObj.text;
            const translation = sahihEdition.ayahs[index]?.text || "";
            const transliteration = transEdition.ayahs[index]?.text || "";

            // Split into basic words for word breakdown
            const arWords = rawArabic.trim().split(/\s+/);
            const words = arWords.map((word) => ({
              arabic: word,
              transliteration: word,
              translation: "",
            }));

            return {
              ayahNumber: ayahObj.numberInSurah,
              arabicUthmani: rawArabic,
              transliteration: transliteration || `Ayah ${ayahObj.numberInSurah}`,
              translationSaheeh: translation || `Translation for ayah ${ayahObj.numberInSurah}`,
              words,
            };
          });

          const surahDetail: SurahDetail = {
            number: surahNum,
            nameArabic: uthmaniEdition.name || surahNameArabic,
            nameTransliterated: uthmaniEdition.englishName || surahNameTrans,
            nameEnglish: uthmaniEdition.englishNameTranslation || surahNameEng,
            versesCount: uthmaniEdition.numberOfAyahs || ayahs.length,
            revelationType: uthmaniEdition.revelationType === "Meccan" ? "Meccan" : "Medinan",
            juzNumber: meta?.juzNumber || 1,
            themeSummary: `Surah ${surahNameTrans} (${surahNameEng}) with ${ayahs.length} verses revealed in ${meta?.revelationType || "Makkah"}.`,
            ayahs,
          };

          return NextResponse.json({
            success: true,
            source: "api",
            surah: surahDetail,
          });
        }
      }
    } catch (apiErr) {
      console.warn(`External Quran API fetch failed for surah ${surahNum}, generating offline template:`, apiErr);
    }

    // Fallback template when offline or API unreachable
    const placeholderAyahs: QuranAyah[] = Array.from({ length: meta?.versesCount || 5 }, (_, i) => ({
      ayahNumber: i + 1,
      arabicUthmani: i === 0 && surahNum !== 9 ? "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" : `آيَة ${i + 1} مِنْ سُورَة ${surahNameArabic}`,
      transliteration: `Ayah ${i + 1} of Surah ${surahNameTrans}`,
      translationSaheeh: `Verse ${i + 1}: Recitation and translation of Surah ${surahNameEng}. Connect to the internet to stream high-resolution Arabic typography.`,
      words: [{ arabic: `آيَة ${i + 1}`, transliteration: `Ayah ${i + 1}`, translation: `Verse ${i + 1}` }],
    }));

    return NextResponse.json({
      success: true,
      source: "fallback",
      surah: {
        number: surahNum,
        nameArabic: surahNameArabic,
        nameTransliterated: surahNameTrans,
        nameEnglish: surahNameEng,
        versesCount: meta?.versesCount || placeholderAyahs.length,
        revelationType: meta?.revelationType || "Meccan",
        juzNumber: meta?.juzNumber || 1,
        themeSummary: `Surah ${surahNameTrans} (${surahNameEng}).`,
        ayahs: placeholderAyahs,
      },
    });
  } catch (error) {
    console.error("Error in Quran API route:", error);
    return NextResponse.json({ success: false, error: "Failed to load Surah data" }, { status: 500 });
  }
}
