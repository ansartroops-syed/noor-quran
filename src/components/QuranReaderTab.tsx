"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Search,
  Filter,
  Play,
  Pause,
  Repeat,
  Repeat1,
  Mic,
  Bookmark,
  Copy,
  Check,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  ChevronDown,
  Volume2,
  Share2,
  Loader2,
} from "lucide-react";
import { SURAH_LIST, SurahMeta } from "@/data/surahMetadata";
import { SurahDetail, QuranAyah } from "@/data/surahDetailsData";
import { UserPreferences } from "@/components/SettingsModal";
import { AVAILABLE_RECITERS, getReciterDisplayName } from "@/lib/audioEngine";
import {
  BISMILLAH_ARABIC,
  BISMILLAH_TRANSLITERATION,
  BISMILLAH_TRANSLATION,
  bismillahForScript,
  stripBismillahPrefix,
  surahHasSeparateBismillah,
  bismillahNoteForSurah,
} from "@/lib/bismillah";
import { ScriptSelector } from "@/components/ScriptSelector";
import {
  readStoredScript,
  storeScript,
  getScriptOption,
  type QuranScriptId,
} from "@/lib/quranScripts";
import { ReadingThemeSelector } from "@/components/ReadingThemeSelector";
import { useReadingTheme } from "@/lib/readingThemes";

// Kept as re-exports so older imports keep working.
export { BISMILLAH_ARABIC, BISMILLAH_TRANSLITERATION, BISMILLAH_TRANSLATION };

export function surahHasBismillahTrack(surahNumber: number): boolean {
  return surahHasSeparateBismillah(surahNumber);
}

/** Clean Arabic for display — strips a Bismillah prefix from Ayah 1 when present. */
function displayArabicFor(surahNumber: number, ayah: QuranAyah): string {
  if (ayah.ayahNumber === 1 && surahHasSeparateBismillah(surahNumber)) {
    return stripBismillahPrefix(ayah.arabicUthmani);
  }
  return ayah.arabicUthmani;
}

interface QuranReaderTabProps {
  currentSurahNumber: number;
  highlightAyahNumber?: number;
  preferences: UserPreferences;
  isPlayingAudio: boolean;
  playingAyahNumber?: number;
  onPlayAyah: (surahNumber: number, ayahNumber: number, surahName: string, totalAyahs: number) => void;
  onOpenVoiceRecorder: (surahNumber: number, ayahNumber: number, text: string, trans: string, meaning: string) => void;
  onSaveBookmark: (surahNumber: number, ayahNumber: number, surahName: string, arabic: string, translation: string, transliteration: string) => void;
  bookmarkedAyahs?: Record<string, boolean>;
  onReciterChange?: (subfolder: string) => void;
  onSurahChange?: (surahNumber: number) => void;
  onScriptChange?: (script: QuranScriptId) => void;
}

export function QuranReaderTab({
  currentSurahNumber,
  highlightAyahNumber,
  preferences,
  isPlayingAudio,
  playingAyahNumber,
  onPlayAyah,
  onOpenVoiceRecorder,
  onSaveBookmark,
  bookmarkedAyahs = {},
  onReciterChange,
  onSurahChange,
  onScriptChange,
}: QuranReaderTabProps) {
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(currentSurahNumber || 1);
  const [surahData, setSurahData] = useState<SurahDetail | null>(null);
  const [surahSource, setSurahSource] = useState<string>("");
  const [script, setScript] = useState<QuranScriptId>(() => {
    const stored = readStoredScript();
    const pref = preferences.preferredScript as string;
    if (pref === "uthmani" || pref === "indopak" || pref === "standard" || pref === "plain") return pref;
    return stored;
  });
  const [loading, setLoading] = useState(false);
  const [surahSearchQuery, setSurahSearchQuery] = useState("");
  const [juzFilter, setJuzFilter] = useState<number | "all">("all");
  const [hifzMode, setHifzMode] = useState<"standard" | "hide_translation" | "hide_transliteration" | "blur_arabic">("standard");
  const [wordByWordView, setWordByWordView] = useState(false);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const bismillahRef = useRef<HTMLDivElement | null>(null);

  // Sync selected surah with external prop
  useEffect(() => {
    if (currentSurahNumber && currentSurahNumber !== selectedSurahNum) {
      setSelectedSurahNum(currentSurahNumber);
    }
  }, [currentSurahNumber]);

  const goToSurah = (num: number) => {
    const clamped = Math.min(114, Math.max(1, num));
    setSelectedSurahNum(clamped);
    onSurahChange?.(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScriptChange = (id: QuranScriptId) => {
    setScript(id);
    storeScript(id);
    onScriptChange?.(id);
  };

  // Reading theme — shared with Read Quran, default is light Mushaf Cream.
  const { themeId, theme, setTheme } = useReadingTheme();

  // Fetch Surah details (script-aware)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/quran/${selectedSurahNum}?script=${script}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.surah) {
          setSurahData(data.surah);
          setSurahSource(typeof data.source === "string" ? data.source : "");
        }
      })
      .catch((err) => console.error("Failed to load surah:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSurahNum, script]);

  // Auto-scroll to active ayah (0 = Bismillah track)
  useEffect(() => {
    const targetAyah = playingAyahNumber ?? highlightAyahNumber;
    if (targetAyah === 0) {
      bismillahRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (targetAyah && ayahRefs.current[targetAyah]) {
      ayahRefs.current[targetAyah]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [playingAyahNumber, highlightAyahNumber]);

  const filteredSurahs = SURAH_LIST.filter((s) => {
    const matchesSearch =
      s.nameArabic.includes(surahSearchQuery) ||
      s.nameTransliterated.toLowerCase().includes(surahSearchQuery.toLowerCase()) ||
      s.nameEnglish.toLowerCase().includes(surahSearchQuery.toLowerCase()) ||
      String(s.number) === surahSearchQuery;

    const matchesJuz = juzFilter === "all" || s.juzNumber === juzFilter;
    return matchesSearch && matchesJuz;
  });

  const handleCopyAyah = (ayah: QuranAyah) => {
    const cleanArabic = displayArabicFor(selectedSurahNum, ayah);
    const textToCopy = `${cleanArabic}\n${ayah.transliteration}\n"${ayah.translationSaheeh}"\n- Surah ${surahData?.nameTransliterated} (${selectedSurahNum}:${ayah.ayahNumber})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyah(ayah.ayahNumber);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  const currentMeta = SURAH_LIST.find((s) => s.number === selectedSurahNum);

  return (
    <div className="space-y-6 pb-24" style={theme.vars as React.CSSProperties}>
      {/* Surah Header & Toolbar */}
      <div className="rounded-3xl border border-emerald-500/30 bg-[#06241c] p-4 sm:p-6 shadow-xl space-y-4">
        {/* Reading theme — TOP so the user can change it before reading */}
        <div className="rounded-2xl bg-emerald-950/40 border border-emerald-900/70 p-3">
          <ReadingThemeSelector value={themeId} onChange={setTheme} />
        </div>
        {/* Controls row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Surah Selector Dropdown */}
          <div className="flex-1 max-w-lg relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Select / search 114 Surahs..."
                  value={surahSearchQuery}
                  onChange={(e) => setSurahSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 focus:border-emerald-400 focus:outline-none text-white text-xs sm:text-sm"
                />
              </div>

              {/* Quick Surah Dropdown Select */}
              <select
                value={selectedSurahNum}
                onChange={(e) => goToSurah(Number(e.target.value))}
                className="px-3 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold text-xs sm:text-sm focus:outline-none cursor-pointer"
              >
                {filteredSurahs.map((s) => (
                  <option key={s.number} value={s.number} className="bg-[#041a14] text-white">
                    {s.number}. {s.nameTransliterated} ({s.nameArabic})
                  </option>
                ))}
              </select>
            </div>
            {/* Prev / Next Surah stepper */}
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => goToSurah(selectedSurahNum - 1)}
                disabled={selectedSurahNum <= 1}
                className="flex-1 px-3 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 disabled:opacity-40 text-emerald-200 font-semibold text-xs border border-emerald-800 transition"
              >
                ← Prev Surah
              </button>
              <span className="text-[11px] text-slate-400 font-bold px-1">
                {selectedSurahNum} / 114
              </span>
              <button
                onClick={() => goToSurah(selectedSurahNum + 1)}
                disabled={selectedSurahNum >= 114}
                className="flex-1 px-3 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 disabled:opacity-40 text-emerald-200 font-semibold text-xs border border-emerald-800 transition"
              >
                Next Surah →
              </button>
            </div>
          </div>

          {/* Quick Qari switcher */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <select
              value={preferences.preferredReciter}
              onChange={(e) => onReciterChange?.(e.target.value)}
              title="Choose Qari reciter"
              className="max-w-[220px] px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs font-semibold focus:outline-none focus:border-emerald-400 cursor-pointer truncate"
            >
              {AVAILABLE_RECITERS.map((r) => (
                <option key={r.id} value={r.subfolder} className="bg-[#041a14] text-white">
                  🎙 {r.name} ({r.quality})
                </option>
              ))}
            </select>
            <span className="hidden sm:inline text-[11px] text-slate-400">
              {AVAILABLE_RECITERS.length} voices • {getReciterDisplayName(preferences.preferredReciter)}
            </span>
          </div>

          {/* Script picker */}
          <div className="rounded-2xl bg-emerald-950/40 border border-emerald-900/70 p-3">
            <ScriptSelector value={script} onChange={handleScriptChange} compact />
            {surahSource ? (
              <p className="text-[10px] text-slate-500 mt-2">
                Arabic source: <span className="font-mono text-slate-400">{surahSource}</span> •
                Showing: <span className="font-semibold text-emerald-400">{getScriptOption(script).label}</span>
              </p>
            ) : (
              <p className="text-[10px] text-slate-500 mt-2">
                Showing: <span className="font-semibold text-emerald-400">{getScriptOption(script).label}</span>
              </p>
            )}
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              {getScriptOption(script).longDesc}
            </p>
          </div>

          {/* Reader Modes Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Word-by-word Toggle */}
            <button
              onClick={() => setWordByWordView(!wordByWordView)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                wordByWordView
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-950/60 text-slate-300 hover:text-white border border-emerald-800/60"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Word-by-Word
            </button>

            {/* Hifz Memorization Mode */}
            <select
              value={hifzMode}
              onChange={(e) => setHifzMode(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-amber-300 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="standard" className="bg-[#041a14] text-white">👁 Mode: Full View</option>
              <option value="hide_translation" className="bg-[#041a14] text-white">🔒 Hifz: Hide Translation</option>
              <option value="hide_transliteration" className="bg-[#041a14] text-white">🔒 Hifz: Hide Transliteration</option>
              <option value="blur_arabic" className="bg-[#041a14] text-white">🙈 Hifz: Blur Arabic (Memory Recall)</option>
            </select>

            {/* Play All Surah Button — starts with Bismillah except Surah 1 & 9 */}
            {surahData && (
              <button
                onClick={() =>
                  onPlayAyah(
                    selectedSurahNum,
                    surahHasBismillahTrack(selectedSurahNum) ? 0 : 1,
                    surahData.nameTransliterated,
                    surahData.versesCount
                  )
                }
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" /> Play Surah
                {surahHasBismillahTrack(selectedSurahNum) ? " (from Bismillah)" : ""}
              </button>
            )}
          </div>
        </div>

        {/* Selected Surah Banner Card */}
        {currentMeta && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#052e22] via-[#04241b] to-[#021812] border border-emerald-500/30 text-center space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-emerald-400">
                Juz {currentMeta.juzNumber} • Page {currentMeta.pageNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                {currentMeta.revelationType} • {currentMeta.versesCount} Ayahs
              </span>
            </div>

            <h2 className="font-arabic text-4xl sm:text-5xl text-amber-300 font-bold py-1">
              {currentMeta.nameArabic}
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Surah {currentMeta.nameTransliterated}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 italic">{currentMeta.nameEnglish}</p>

            {/* Banner-level Prev / Next Surah navigation */}
            <div className="flex items-center justify-between gap-2 pt-3">
              <button
                onClick={() => goToSurah(selectedSurahNum - 1)}
                disabled={selectedSurahNum <= 1}
                className="px-4 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 disabled:opacity-40 text-emerald-200 font-semibold text-xs border border-emerald-800 transition"
              >
                ← {selectedSurahNum > 1 ? SURAH_LIST[selectedSurahNum - 2].nameTransliterated : "Start"}
              </button>
              <button
                onClick={() => goToSurah(selectedSurahNum + 1)}
                disabled={selectedSurahNum >= 114}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition"
              >
                {selectedSurahNum < 114 ? `${SURAH_LIST[selectedSurahNum].nameTransliterated} →` : "End"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-20 text-center text-emerald-400 space-y-3">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-emerald-400" />
          <p className="text-sm font-semibold">Loading Sacred Verses...</p>
        </div>
      )}

      {/* Surah Ayahs List */}
      {!loading && surahData && (
        <div className="space-y-4">
          {/* ── Separate Bismillah header — top of EVERY Surah except 1 & 9 ──
              Ayah number 0 = Bismillah audio track (001001.mp3) in the player. */}
          {surahHasBismillahTrack(selectedSurahNum) ? (
            <div
              ref={(el) => {
                bismillahRef.current = el;
              }}
              className="px-5 sm:px-8 py-6 text-center rounded-3xl border-2 transition-all duration-300 space-y-3 shadow-xl"
              style={{
                backgroundColor: isPlayingAudio && playingAyahNumber === 0 ? theme.vars["--rp-active"] : theme.vars["--rp-page"],
                borderColor: theme.vars["--rp-card-bd"],
              }}
            >
              <div className="flex items-center gap-3">
                <span className="flex-1 h-px" style={{ backgroundColor: theme.vars["--rp-divider"] }} />
                <span
                  className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"
                  style={{ color: theme.vars["--rp-accent"] }}
                >
                  Bismillah ir-Rahman ir-Rahim • Opening of this Surah
                </span>
                <span className="flex-1 h-px" style={{ backgroundColor: theme.vars["--rp-divider"] }} />
              </div>
              <p
                className={`${getScriptOption(script).fontClass} text-3xl sm:text-4xl leading-loose`}
                style={{ color: theme.vars["--rp-bis"] }}
                dir="rtl"
                lang="ar"
              >
                {bismillahForScript(script)}
              </p>
              <p className="text-xs sm:text-sm italic" style={{ color: theme.vars["--rp-muted"] }}>{BISMILLAH_TRANSLITERATION}</p>
              <p className="text-xs sm:text-sm" style={{ color: theme.vars["--rp-muted"] }}>{BISMILLAH_TRANSLATION}</p>
              <button
                onClick={() =>
                  onPlayAyah(
                    selectedSurahNum,
                    0,
                    surahData.nameTransliterated,
                    surahData.versesCount
                  )
                }
                className={`mx-auto px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                  isPlayingAudio && playingAyahNumber === 0
                    ? "bg-amber-500 text-slate-950"
                    : "bg-emerald-700 hover:bg-emerald-600 text-white"
                }`}
              >
                {isPlayingAudio && playingAyahNumber === 0 ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" /> Playing Bismillah...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Play Bismillah
                  </>
                )}
              </button>
            </div>
          ) : (
            <div
              className="px-4 py-2.5 text-center rounded-2xl border"
              style={{ backgroundColor: theme.vars["--rp-note-bg"], borderColor: theme.vars["--rp-note-bd"] }}
            >
              <p className="text-[11px] italic" style={{ color: theme.vars["--rp-muted"] }}>
                {bismillahNoteForSurah(selectedSurahNum)}
              </p>
            </div>
          )}

          {surahData.ayahs.map((ayah) => {
            const isPlayingThis = isPlayingAudio && playingAyahNumber === ayah.ayahNumber;
            const isHighlighted = highlightAyahNumber === ayah.ayahNumber;
            const bookmarkKey = `${selectedSurahNum}:${ayah.ayahNumber}`;
            const isBookmarked = Boolean(bookmarkedAyahs[bookmarkKey]);
            // Display text with any Bismillah prefix removed (header shows it separately)
            const cleanArabic = displayArabicFor(selectedSurahNum, ayah);
            const displayWords: { arabic: string; transliteration: string; translation: string; tajweedRule?: string }[] =
              cleanArabic !== ayah.arabicUthmani
                ? cleanArabic.split(/\s+/).map((word) => ({
                    arabic: word,
                    transliteration: word,
                    translation: "",
                  }))
                : ayah.words;

            return (
              <div
                key={ayah.ayahNumber}
                ref={(el) => {
                  ayahRefs.current[ayah.ayahNumber] = el;
                }}
                className="p-5 sm:p-6 rounded-3xl border transition-all duration-300 space-y-4 shadow-lg"
                style={{
                  backgroundColor: isPlayingThis || isHighlighted ? theme.vars["--rp-active"] : theme.vars["--rp-card"],
                  borderColor: isPlayingThis || isHighlighted ? theme.vars["--rp-badge-bd"] : theme.vars["--rp-card-bd"],
                }}
              >
                {/* Ayah Top Bar (Number + Toolbar) */}
                <div
                  className="flex items-center justify-between pb-3 border-b text-xs"
                  style={{ borderColor: theme.vars["--rp-divider"], color: theme.vars["--rp-muted"] }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center font-bold text-emerald-300 text-xs">
                      {ayah.ayahNumber}
                    </span>
                    <span className="font-semibold" style={{ color: theme.vars["--rp-ink"] }}>
                      {selectedSurahNum}:{ayah.ayahNumber}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Play Ayah Audio */}
                    <button
                      onClick={() =>
                        onPlayAyah(
                          selectedSurahNum,
                          ayah.ayahNumber,
                          surahData.nameTransliterated,
                          surahData.versesCount
                        )
                      }
                      className={`p-1.5 rounded-lg transition ${
                        isPlayingThis
                          ? "bg-amber-500 text-slate-950 font-bold"
                          : "bg-emerald-950 text-emerald-300 hover:bg-emerald-900"
                      }`}
                      title="Play Ayah recitation"
                    >
                      {isPlayingThis ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    {/* Record Voice Practice */}
                    <button
                      onClick={() =>
                        onOpenVoiceRecorder(
                          selectedSurahNum,
                          ayah.ayahNumber,
                          cleanArabic,
                          ayah.transliteration,
                          ayah.translationSaheeh
                        )
                      }
                      className="p-1.5 rounded-lg bg-teal-950 hover:bg-teal-900 text-teal-300 border border-teal-800 transition"
                      title="Practice Recording Recitation"
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={() =>
                        onSaveBookmark(
                          selectedSurahNum,
                          ayah.ayahNumber,
                          surahData.nameTransliterated,
                          cleanArabic,
                          ayah.translationSaheeh,
                          ayah.transliteration
                        )
                      }
                      className={`p-1.5 rounded-lg transition ${
                        isBookmarked
                          ? "bg-amber-500 text-slate-950 font-bold"
                          : "bg-emerald-950 text-slate-400 hover:text-white hover:bg-emerald-900"
                      }`}
                      title={isBookmarked ? "Ayah Saved" : "Bookmark Ayah"}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-slate-950" : ""}`} />
                    </button>

                    {/* Copy Text */}
                    <button
                      onClick={() => handleCopyAyah(ayah)}
                      className="p-1.5 rounded-lg bg-emerald-950 text-slate-400 hover:text-white hover:bg-emerald-900 transition"
                      title="Copy Arabic & Translation"
                    >
                      {copiedAyah === ayah.ayahNumber ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Arabic Text Display — always themed ink on themed card, script-authentic font */}
                <div className="py-2 text-right">
                  <p
                    className={`${getScriptOption(script).fontClass} leading-loose transition select-text ${
                      hifzMode === "blur_arabic" ? "blur-sm hover:blur-none" : ""
                    }`}
                    style={{ fontSize: `${preferences.arabicFontSize || 28}px`, color: theme.vars["--rp-ink"] }}
                    dir="rtl"
                  >
                    {cleanArabic || ayah.arabicUthmani}{" "}
                    <span className="ayah-symbol font-sans">{ayah.ayahNumber}</span>
                  </p>
                </div>

                {/* Word-by-word Breakdown Table/Chips */}
                {wordByWordView && displayWords && displayWords.length > 0 && (
                  <div className="pt-2 pb-1 overflow-x-auto no-scrollbar">
                    <div className="flex flex-row-reverse items-stretch gap-2 min-w-max">
                      {displayWords.map((w, wIdx) => (
                        <div
                          key={wIdx}
                          className="p-2.5 rounded-xl bg-[#041a14] border border-emerald-900/80 text-center space-y-1 min-w-[80px]"
                        >
                          <div className="font-arabic text-xl font-bold text-amber-300">{w.arabic}</div>
                          <div className="text-[10px] text-emerald-300 font-medium">{w.transliteration}</div>
                          <div className="text-[11px] text-slate-300 font-semibold">{w.translation}</div>
                          {w.tajweedRule && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-900/60 text-emerald-300 font-bold block">
                              {w.tajweedRule}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transliteration */}
                {preferences.showTransliteration && hifzMode !== "hide_transliteration" && (
                  <div
                    className="text-xs sm:text-sm font-medium italic tracking-wide"
                    style={{ color: theme.vars["--rp-muted"] }}
                  >
                    {ayah.transliteration}
                  </div>
                )}

                {/* English Translation */}
                {preferences.showTranslation && hifzMode !== "hide_translation" && (
                  <div
                    className="text-sm sm:text-base leading-relaxed font-sans"
                    style={{ color: theme.vars["--rp-ink"] }}
                  >
                    {ayah.translationSaheeh}
                  </div>
                )}

                {/* Tafseer reflection note if available */}
                {ayah.tafseerNote && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-slate-300 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300">Reflection: </span>
                      {ayah.tafseerNote}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* End-of-Surah navigation — move to next / previous Surah */}
          <div
            className="p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ backgroundColor: theme.vars["--rp-note-bg"], borderColor: theme.vars["--rp-note-bd"] }}
          >
            <div className="text-center sm:text-left">
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.vars["--rp-accent"] }}>
                End of Surah {currentMeta?.nameTransliterated}
              </div>
              <div className="text-[11px]" style={{ color: theme.vars["--rp-muted"] }}>
                Continue recitation into the next Surah — Bismillah plays automatically.
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => goToSurah(selectedSurahNum - 1)}
                disabled={selectedSurahNum <= 1}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 disabled:opacity-40 text-emerald-200 font-semibold text-xs border border-emerald-800 transition"
              >
                ← Prev Surah
              </button>
              <button
                onClick={() => {
                  if (selectedSurahNum < 114 && surahData) {
                    const nextNum = selectedSurahNum + 1;
                    const nextMeta = SURAH_LIST.find((s) => s.number === nextNum);
                    goToSurah(nextNum);
                    onPlayAyah(
                      nextNum,
                      surahHasBismillahTrack(nextNum) ? 0 : 1,
                      nextMeta?.nameTransliterated || `Surah ${nextNum}`,
                      nextMeta?.versesCount || 7
                    );
                  }
                }}
                disabled={selectedSurahNum >= 114}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" /> Next Surah →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
