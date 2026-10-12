import { NextRequest, NextResponse } from "next/server";
import { SURAH_LIST } from "@/data/surahMetadata";
import { ReadingAyah, ReadingSurah, splitLeadingBismillah, standardBismillah } from "@/lib/quranReading";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ surah: string }> }) {
  try {
    const { surah } = await params;
    const surahNumber = Number.parseInt(surah, 10);
    const meta = SURAH_LIST.find((item) => item.number === surahNumber);

    if (!meta) {
      return NextResponse.json({ success: false, error: "Choose a surah from 1 to 114." }, { status: 400 });
    }

    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih,en.transliteration`,
      { next: { revalidate: 86400 } }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "The official Quran text could not be loaded. Please try again." },
        { status: 502 }
      );
    }

    const json = await response.json();
    if (json.code !== 200 || !Array.isArray(json.data) || json.data.length < 2) {
      return NextResponse.json(
        { success: false, error: "The official Quran text was incomplete. Please try again." },
        { status: 502 }
      );
    }

    const arabicEdition = json.data[0];
    const translationEdition = json.data[1];
    const transliterationEdition = json.data[2];
    const sourceAyahs = Array.isArray(arabicEdition.ayahs) ? arabicEdition.ayahs : [];

    if (sourceAyahs.length !== meta.versesCount) {
      return NextResponse.json(
        { success: false, error: "The loaded surah did not match the official verse count." },
        { status: 502 }
      );
    }

    let bismillah: string | null = null;
    const ayahs: ReadingAyah[] = sourceAyahs.map(
      (ayah: { numberInSurah: number; text: string }, index: number) => {
        let arabic = String(ayah.text || "").replace(/^\uFEFF/, "").trim();

        if (meta.bismillahPre && ayah.numberInSurah === 1) {
          const split = splitLeadingBismillah(arabic);
          if (split.bismillah) {
            bismillah = standardBismillah();
            arabic = split.ayah;
          }
        }

        return {
          number: ayah.numberInSurah,
          arabic,
          translation: String(translationEdition.ayahs?.[index]?.text || "").trim(),
          transliteration: String(transliterationEdition?.ayahs?.[index]?.text || "").trim(),
        };
      }
    );

    if (ayahs.some((ayah) => !ayah.arabic)) {
      return NextResponse.json(
        { success: false, error: "An Arabic verse was missing, so this surah was not shown." },
        { status: 502 }
      );
    }

    const result: ReadingSurah = {
      number: meta.number,
      nameArabic: meta.nameArabic,
      nameTransliterated: meta.nameTransliterated,
      nameEnglish: meta.nameEnglish,
      versesCount: meta.versesCount,
      revelationType: meta.revelationType,
      bismillah,
      ayahs,
    };

    return NextResponse.json({ success: true, surah: result });
  } catch (error) {
    console.error("Read Quran route failed:", error);
    return NextResponse.json(
      { success: false, error: "The official Quran text could not be loaded. Please try again." },
      { status: 500 }
    );
  }
}
