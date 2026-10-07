import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text") || searchParams.get("q");
    const lang = searchParams.get("lang") || "ar";

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Missing text query parameter" }, { status: 400 });
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text.trim()
    )}&tl=${encodeURIComponent(lang)}&client=tw-ob`;

    const res = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "*/*",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to generate TTS audio" }, { status: res.status });
    }

    const audioBuffer = await res.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("TTS Proxy Route Error:", error);
    return NextResponse.json({ error: "Internal audio synthesis error" }, { status: 500 });
  }
}
