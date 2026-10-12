import { NextRequest, NextResponse } from "next/server";
import { fetchOfficialSurah } from "@/lib/fetchOfficialQuran";

export async function GET(req: NextRequest, { params }: { params: Promise<{ surah: string }> }) {
  try {
    const { surah } = await params;
    const surahNumber = Number.parseInt(surah, 10);
    const script = new URL(req.url).searchParams.get("script");
    const official = await fetchOfficialSurah(surahNumber, script);

    return NextResponse.json({ success: true, surah: official });
  } catch (error) {
    console.error("Read Quran route failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "The official Quran text could not be loaded." },
      { status: 502 }
    );
  }
}
