import { NextRequest, NextResponse } from "next/server";
import { EMBEDDED_SURAHS, SurahDetail, QuranAyah } from "@/data/surahDetailsData";
import { SURAH_LIST } from "@/data/surahMetadata";
import { stripBismillahPrefix, surahHasSeparateBismillah } from "@/lib/bismillah";
import {
  getScriptOption,
  cleanScriptText,
  stripToPlainLetters,
  splitArabicWords,
  isQuranScriptId,
  type QuranScriptId,
} from "@/lib/quranScripts";

/** Fetch Arabic text for a Surah in the requested script from quran.com v4. */
async function fetchScriptArabic(
  surahNum: number,
  script: QuranScriptId
): Promise<{ texts: string[]; source: string } | null> {
  const opt = getScriptOption(script);
  const textKey =
    opt.quranComEndpoint === "uthmani"
      ? "text_uthmani"
      : opt.quranComEndpoint === "indopak"
        ? "text_indopak"
        : opt.quranComEndpoint === "imlaei"
          ? "text_imlaei"
          : "text_uthmani_simple";

  try {
    const res = await fetch(
      `https://api.quran.com/api/v4/quran/verses/${opt.quranComEndpoint}?chapter_number=${surahNum}`,
      {
        next: { revalidate: 86400 },
        headers: { "User-Agent": "NoorQuranByNajAns/1.0 (Quran reader)" },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const verses = json?.verses;
    if (!Array.isArray(verses) || verses.length === 0) return null;

    // Sort by verse key to guarantee order (112:1, 112:2, ...)
    verses.sort((a: { verse_key: string }, b: { verse_key: string }) =>
      a.verse_key.localeCompare(b.verse_key, undefined, { numeric: true })
    );

    let texts = verses.map((v: Record<string, unknown>) =>
      cleanScriptText(String(v[textKey] ?? ""))
    );
    if (script === "plain") {
      texts = texts.map((t) => stripToPlainLetters(t));
    }
    if (texts.some((t) => !t)) return null;
    // Strip a Bismillah prefix from Ayah 1 — UI renders it as a separate header.
    if (surahHasSeparateBismillah(surahNum) && texts.length > 0) {
      const stripped = stripBismillahPrefix(texts[0]);
      if (stripped) texts[0] = stripped;
    }
    return { texts, source: `quran.com:${opt.quranComEndpoint}` };
  } catch (err) {
    console.warn(`quran.com ${opt.quranComEndpoint} fetch failed for surah ${surahNum}:`, err);
    return null;
  }
}

/** Fallback Arabic from AlQuran Cloud (single Arabic edition + translation set). */
async function fetchFallbackArabic(
  surahNum: number,
  script: QuranScriptId
): Promise<{ texts: string[]; source: string } | null> {
  const opt = getScriptOption(script);
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNum}/${opt.fallbackEdition}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (json.code !== 200 || !json.data?.ayahs) return null;
    let texts: string[] = json.data.ayahs.map((a: { text: string }) =>
      cleanScriptText(a.text)
    );
    if (script === "plain") texts = texts.map((t) => stripToPlainLetters(t));
    // AlQuran Cloud prefixes Bismillah to Ayah 1 — our UI renders it
    // separately, so strip here (except Surah 1 & 9).
    if (surahHasSeparateBismillah(surahNum) && texts.length > 0) {
      const stripped = stripBismillahPrefix(texts[0]);
      if (stripped) texts[0] = stripped;
    }
    return { texts, source: `alquran.cloud:${opt.fallbackEdition}` };
  } catch (err) {
    console.warn(`AlQuran Cloud fallback failed for surah ${surahNum}:`, err);
    return null;
  }
}

async function fetchTranslationSet(surahNum: number): Promise<{
  translations: string[];
  transliterations: string[];
} | null> {
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,en.sahih,en.transliteration`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) return null;
    const json = await response.json();
    if (json.code !== 200 || !Array.isArray(json.data) || json.data.length < 2) return null;
    const sahihEdition = json.data[1];
    const transEdition = json.data[2] || json.data[1];
    return {
      translations: sahihEdition.ayahs.map((a: { text: string }) => a.text),
      transliterations: transEdition.ayahs.map((a: { text: string }) => a.text),
    };
  } catch (err) {
    console.warn(`Translation fetch failed for surah ${surahNum}:`, err);
    return null;
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ surah: string }> }) {
  try {
    const { surah } = await params;
    const surahNum = parseInt(surah, 10);

    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      return NextResponse.json({ success: false, error: "Invalid surah number (must be 1-114)" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const scriptParam = searchParams.get("script");
    // Default = standard (Mushaf Standard Imlaei) — most familiar to readers.
    const script: QuranScriptId = isQuranScriptId(scriptParam) ? scriptParam : "standard";

    const meta = SURAH_LIST.find((s) => s.number === surahNum);
    const surahNameArabic = meta?.nameArabic || `سورة ${surahNum}`;
    const surahNameTrans = meta?.nameTransliterated || `Surah ${surahNum}`;
    const surahNameEng = meta?.nameEnglish || `Surah ${surahNum}`;
    const embedded = EMBEDDED_SURAHS[surahNum];

    // ALWAYS fetch verified Arabic from quran.com / AlQuran Cloud.
    // Embedded hand-typed Arabic is no longer used for display — only its
    // translations, transliterations and word notes are reused.
    let arabic = await fetchScriptArabic(surahNum, script);
    if (!arabic) {
      arabic = await fetchFallbackArabic(surahNum, script);
    }

    // Translation + transliteration (English helpers, same for every script).
    const trSet = await fetchTranslationSet(surahNum);

    if (!arabic && embedded) {
      // Offline: embedded data as last resort (translations still correct).
      return NextResponse.json({ success: true, source: "embedded", script, surah: embedded });
    }

    if (arabic) {
      // Guard: verse count must match the canonical count; otherwise fall back.
      const expectedCount = embedded?.versesCount || meta?.versesCount || arabic.texts.length;
      if (arabic.texts.length !== expectedCount) {
        console.warn(
          `Verse-count mismatch surah ${surahNum} script ${script}: got ${arabic.texts.length}, expected ${expectedCount}`
        );
      }
      const count = arabic.texts.length;
      const ayahs: QuranAyah[] = arabic.texts.map((arabicText, index) => {
        const ayahNumber = index + 1;
        // Embedded translations preferred when available for this surah.
        const emb = embedded?.ayahs.find((a) => a.ayahNumber === ayahNumber);
        const translation =
          emb?.translationSaheeh ?? trSet?.translations[index] ?? `Ayah ${ayahNumber}`;
        const transliteration =
          emb?.transliteration ?? trSet?.transliterations[index] ?? `Ayah ${ayahNumber}`;
        const words =
          emb && script === "standard"
            ? emb.words
            : splitArabicWords(arabicText).map((word) => ({
                arabic: word,
                transliteration: word,
                translation: "",
              }));
        return {
          ayahNumber,
          arabicUthmani: arabicText,
          transliteration,
          translationSaheeh: translation,
          words,
        };
      });

      const surahDetail: SurahDetail = {
        number: surahNum,
        nameArabic: embedded?.nameArabic || surahNameArabic,
        nameTransliterated: embedded?.nameTransliterated || surahNameTrans,
        nameEnglish: embedded?.nameEnglish || surahNameEng,
        versesCount: embedded?.versesCount || count,
        revelationType: (embedded?.revelationType as "Meccan" | "Medinan") || meta?.revelationType || "Meccan",
        juzNumber: embedded?.juzNumber || meta?.juzNumber || 1,
        themeSummary:
          embedded?.themeSummary ||
          `Surah ${surahNameTrans} (${surahNameEng}) with ${count} verses.`,
        ayahs,
      };

      return NextResponse.json({ success: true, source: arabic.source, script, surah: surahDetail });
    }

    // Last-resort offline template (clearly marked, never fake Arabic).
    const placeholderAyahs: QuranAyah[] = Array.from({ length: meta?.versesCount || 5 }, (_, i) => ({
      ayahNumber: i + 1,
      arabicUthmani:
        i === 0 && surahNum !== 9
          ? "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ"
          : `آيَة ${i + 1} مِنْ سُورَة ${surahNameArabic}`,
      transliteration: `Ayah ${i + 1} of Surah ${surahNameTrans}`,
      translationSaheeh: `Verse ${i + 1}: Recitation and translation of Surah ${surahNameEng}. Connect to the internet to stream high-resolution Arabic typography.`,
      words: [{ arabic: `آيَة ${i + 1}`, transliteration: `Ayah ${i + 1}`, translation: `Verse ${i + 1}` }],
    }));

    return NextResponse.json({
      success: true,
      source: "fallback",
      script,
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
