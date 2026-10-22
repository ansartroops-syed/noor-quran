import { NextRequest, NextResponse } from "next/server";
import { fetchOfficialSurah } from "@/lib/fetchOfficialQuran";
import { SURAH_LIST } from "@/data/surahMetadata";
import { stripBismillahPrefix, surahHasSeparateBismillah } from "@/lib/bismillah";

// Local word splitter — avoids importing from quranScripts so this route
// can never break if that module is outdated on the deploy.
function splitArabicWordsLocal(text: string): string[] {
  if (!text) return [];
  const cleaned = String(text)
    .replace(/[‎‏‪‫‬‭‮⁠⁡⁢⁣⁤﻿￹￺​‌‍⁠]/g, "")
    .replace(/[-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned
    .split(/\s+/)
    .filter((w) => w && /[ء-غف-يٱڪگچپڤەۏ]/.test(w));
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ surah: string }> }
) {
  try {
    const { surah } = await params;
    const surahNum = parseInt(surah, 10);
    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      return NextResponse.json(
        { success: false, error: "Invalid surah number (must be 1-114)" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const scriptParam = searchParams.get("script");

    const official = await fetchOfficialSurah(surahNum, scriptParam);
    const meta = SURAH_LIST.find((s) => s.number === surahNum);

    if (!official.ayahs.length) {
      return NextResponse.json(
        { success: false, error: "Could not load Surah text. Please try again." },
        { status: 502 }
      );
    }

    const ayahs = official.ayahs.map((a) => {
      const arabic =
        a.number === 1 && surahHasSeparateBismillah(surahNum)
          ? stripBismillahPrefix(a.arabic) || a.arabic
          : a.arabic;
      return {
        ayahNumber: a.number,
        arabicUthmani: arabic,
        transliteration: a.transliteration || `Ayah ${a.number}`,
        translationSaheeh: a.translation || `Ayah ${a.number}`,
        words: splitArabicWordsLocal(arabic).map((word) => ({
          arabic: word,
          transliteration: word,
          translation: "",
        })),
      };
    });

    return NextResponse.json({
      success: true,
      source: official.source,
      script: official.script,
      surah: {
        number: surahNum,
        nameArabic: meta?.nameArabic || `سورة ${surahNum}`,
        nameTransliterated: official.surahName,
        nameEnglish: meta?.nameEnglish || `Surah ${surahNum}`,
        versesCount: ayahs.length,
        revelationType: meta?.revelationType || "Meccan",
        juzNumber: meta?.juzNumber || 1,
        themeSummary: `Surah ${official.surahName} with ${ayahs.length} verses.`,
        ayahs,
      },
    });
  } catch (error) {
    console.error("Error in Quran read API route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load Surah text" },
      { status: 500 }
    );
  }
}
