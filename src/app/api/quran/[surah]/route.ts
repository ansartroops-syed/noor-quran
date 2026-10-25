import { NextRequest, NextResponse } from "next/server";
import { fetchOfficialSurah } from "@/lib/fetchOfficialQuran";

export async function GET(req: NextRequest, { params }: { params: Promise<{ surah: string }> }) {
  try {
    const { surah } = await params;
    const surahNumber = Number.parseInt(surah, 10);
    const script = new URL(req.url).searchParams.get("script");
    const official = await fetchOfficialSurah(surahNumber, script);

    return NextResponse.json({
      success: true,
      source: "quran.com",
      surah: {
        number: official.number,
        nameArabic: official.nameArabic,
        nameTransliterated: official.nameTransliterated,
        nameEnglish: official.nameEnglish,
        versesCount: official.versesCount,
        revelationType: official.revelationType,
        juzNumber: official.juzNumber,
        script: official.script,
        bismillah: official.bismillah,
        themeSummary: `Surah ${official.nameTransliterated} (${official.nameEnglish}), ${official.versesCount} verses.`,
        ayahs: official.ayahs.map((ayah) => ({
          ayahNumber: ayah.number,
          arabicUthmani: ayah.arabic,
          transliteration: ayah.transliteration,
          translationSaheeh: ayah.translation,
          words: ayah.arabic.split(/\s+/).filter(Boolean).map((word) => ({
            arabic: word,
            transliteration: "",
            translation: "",
          })),
        })),
      },
    });
  } catch (error) {
    console.error("Official Quran route failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "The official Quran text could not be loaded." },
      { status: 502 }
    );
  }
}
