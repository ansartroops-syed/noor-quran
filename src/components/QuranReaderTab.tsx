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
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { SURAH_LIST, SurahMeta } from "@/data/surahMetadata";
import { splitLeadingBismillah } from "@/lib/quranReading";
import { QuranScriptPicker } from "@/components/QuranScriptPicker";
import { resolveQuranScript } from "@/lib/quranScripts";
import { SurahDetail, QuranAyah } from "@/data/surahDetailsData";
import { UserPreferences } from "@/components/SettingsModal";

interface QuranReaderTabProps {
  currentSurahNumber: number;
  highlightAyahNumber?: number;
  preferences: UserPreferences;
  isPlayingAudio: boolean;
  playingAyahNumber?: number;
  playingSurahNumber?: number;
  onPlayAyah: (surahNumber: number, ayahNumber: number, surahName: string, totalAyahs: number) => void;
  onSelectSurah: (surahNumber: number) => void;
  onOpenVoiceRecorder: (surahNumber: number, ayahNumber: number, text: string, trans: string, meaning: string) => void;
  onSaveBookmark: (surahNumber: number, ayahNumber: number, surahName: string, arabic: string, translation: string, transliteration: string) => void;
  bookmarkedAyahs?: Record<string, boolean>;
  script: string;
  onScriptChange: (scriptId: string) => void;
}

export function QuranReaderTab({
  currentSurahNumber,
  highlightAyahNumber,
  preferences,
  isPlayingAudio,
  playingAyahNumber,
  playingSurahNumber,
  onPlayAyah,
  onSelectSurah,
  onOpenVoiceRecorder,
  onSaveBookmark,
  bookmarkedAyahs = {},
  script,
  onScriptChange,
}: QuranReaderTabProps) {
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(currentSurahNumber || 1);
  const [surahData, setSurahData] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [surahSearchQuery, setSurahSearchQuery] = useState("");
  const [juzFilter, setJuzFilter] = useState<number | "all">("all");
  const [hifzMode, setHifzMode] = useState<"standard" | "hide_translation" | "hide_transliteration" | "blur_arabic">("standard");
  const [wordByWordView, setWordByWordView] = useState(false);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [loadError, setLoadError] = useState("");
  const [bismillahText, setBismillahText] = useState<string | null>(null);

  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Sync selected surah with external prop
  useEffect(() => {
    if (currentSurahNumber && currentSurahNumber !== selectedSurahNum) {
      setSelectedSurahNum(currentSurahNumber);
    }
  }, [currentSurahNumber]);

  // Fetch Surah details
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    setLoadError("");
    fetch(`/api/quran/${selectedSurahNum}?script=${encodeURIComponent(script)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.surah) {
          setSurahData(data.surah);
          setBismillahText(data.surah.bismillah || null);
        } else {
          setSurahData(null);
          setLoadError(data.error || "The official Quran text could not be loaded.");
        }
      })
      .catch(() => {
        if (isMounted) setLoadError("The official Quran text could not be loaded.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSurahNum, script]);

  // Auto-scroll to active ayah
  useEffect(() => {
    const targetAyah = playingAyahNumber || highlightAyahNumber;
    if (targetAyah && ayahRefs.current[targetAyah]) {
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
    const textToCopy = `${ayah.arabicUthmani}\n${ayah.transliteration}\n"${ayah.translationSaheeh}"\n- Surah ${surahData?.nameTransliterated} (${selectedSurahNum}:${ayah.ayahNumber})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyah(ayah.ayahNumber);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  const currentMeta = SURAH_LIST.find((s) => s.number === selectedSurahNum);

  return (
    <div className="space-y-6 rounded-3xl bg-[#f7f1e3] p-3 text-stone-900 sm:p-5">
      {/* Surah Header & Toolbar */}
      <div className="rounded-3xl border border-stone-300 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        <QuranScriptPicker value={script} onChange={onScriptChange} />
        {/* Controls row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Surah Selector Dropdown */}
          <div className="flex-1 max-w-lg relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Select / search 114 Surahs..."
                  value={surahSearchQuery}
                  onChange={(e) => setSurahSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-stone-300 focus:border-emerald-700 focus:outline-none text-stone-900 text-xs sm:text-sm"
                />
              </div>

              {/* Quick Surah Dropdown Select */}
              <select
                value={selectedSurahNum}
                onChange={(e) => setSelectedSurahNum(Number(e.target.value))}
                className="px-3 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 font-bold text-xs sm:text-sm focus:outline-none cursor-pointer"
              >
                {filteredSurahs.map((s) => (
                  <option key={s.number} value={s.number} className="bg-[#041a14] text-white">
                    {s.number}. {s.nameTransliterated} ({s.nameArabic})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reader Modes Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Word-by-word Toggle */}
            <button
              onClick={() => setWordByWordView(!wordByWordView)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                wordByWordView
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-white text-stone-800 hover:bg-stone-100 border border-stone-300"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Word-by-Word
            </button>

            {/* Hifz Memorization Mode */}
            <select
              value={hifzMode}
              onChange={(e) => setHifzMode(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="standard" className="bg-[#041a14] text-white">👁 Mode: Full View</option>
              <option value="hide_translation" className="bg-[#041a14] text-white">🔒 Hifz: Hide Translation</option>
              <option value="hide_transliteration" className="bg-[#041a14] text-white">🔒 Hifz: Hide Transliteration</option>
              <option value="blur_arabic" className="bg-[#041a14] text-white">🙈 Hifz: Blur Arabic (Memory Recall)</option>
            </select>

            {/* Play All Surah Button */}
            <button
              onClick={() => onSelectSurah(Math.max(1, selectedSurahNum - 1))}
              disabled={selectedSurahNum <= 1}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-800 border border-stone-300 bg-white disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev Surah
            </button>
            {surahData && (
              <button
                onClick={() =>
                  onPlayAyah(
                    selectedSurahNum,
                    currentMeta?.bismillahPre ? 0 : 1,
                    surahData.nameTransliterated,
                    surahData.versesCount
                  )
                }
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" /> Play Surah
              </button>
            )}
            <button
              onClick={() => onSelectSurah(Math.min(114, selectedSurahNum + 1))}
              disabled={selectedSurahNum >= 114}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-800 border border-stone-300 bg-white disabled:opacity-40 flex items-center gap-1"
            >
              Next Surah <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Selected Surah Banner Card */}
        {currentMeta && (
          <div className="p-6 rounded-2xl bg-[#fffaf0] border border-stone-200 text-center space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-emerald-800">
                Juz {currentMeta.juzNumber} • Page {currentMeta.pageNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {currentMeta.revelationType} • {currentMeta.versesCount} Ayahs
              </span>
            </div>

            <h2 className="font-arabic text-4xl sm:text-5xl text-emerald-950 font-bold py-1">
              {currentMeta.nameArabic}
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-wide">
              Surah {currentMeta.nameTransliterated}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 italic">{currentMeta.nameEnglish}</p>
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
      {!loading && loadError && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-6 text-center text-rose-100">
          {loadError}
        </div>
      )}

      {!loading && surahData && (
        <div className={`space-y-4 rounded-3xl p-4 sm:p-6 ${resolveQuranScript(script).themeClass}`}>
          {/* Bismillah Header (Except Surah 9) */}
          {selectedSurahNum !== 9 && (
            <button
              onClick={() =>
                onPlayAyah(
                  selectedSurahNum,
                  selectedSurahNum === 1 ? 1 : 0,
                  surahData.nameTransliterated,
                  surahData.versesCount
                )
              }
              className={`w-full py-6 text-center rounded-2xl border-2 ${
                isPlayingAudio &&
                playingSurahNumber === selectedSurahNum &&
                playingAyahNumber === (selectedSurahNum === 1 ? 1 : 0)
                  ? "bg-amber-100 border-amber-500"
                  : "bg-white border-amber-300"
              }`}
            >
              <p className={`${resolveQuranScript(script).fontClass} text-3xl sm:text-4xl text-stone-950 leading-loose`} dir="rtl">
                {bismillahText || resolveQuranScript(script).bismillah}
              </p>
              <p className="text-sm text-stone-700 mt-1">Bismillah ir-Rahman ir-Rahim</p>
              {selectedSurahNum === 1 && (
                <p className="text-xs text-slate-400 mt-1">Al-Fatiha, verse 1</p>
              )}
            </button>
          )}
          {selectedSurahNum === 9 && (
            <div className="py-3 text-center rounded-2xl bg-white border border-stone-200 text-xs text-stone-600">
              Surah At-Tawbah does not begin with Bismillah.
            </div>
          )}

          {surahData.ayahs.filter((ayah) => !(selectedSurahNum === 1 && ayah.ayahNumber === 1)).map((ayah) => {
            const arabicText =
              selectedSurahNum !== 9 && ayah.ayahNumber === 1
                ? splitLeadingBismillah(ayah.arabicUthmani).ayah
                : ayah.arabicUthmani.replace(/^\uFEFF/, "").trim();
            const isPlayingThis = isPlayingAudio && playingAyahNumber === ayah.ayahNumber;
            const isHighlighted = highlightAyahNumber === ayah.ayahNumber;
            const bookmarkKey = `${selectedSurahNum}:${ayah.ayahNumber}`;
            const isBookmarked = Boolean(bookmarkedAyahs[bookmarkKey]);

            return (
              <div
                key={ayah.ayahNumber}
                ref={(el) => {
                  ayahRefs.current[ayah.ayahNumber] = el;
                }}
                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 space-y-4 text-stone-900 ${
                  isPlayingThis
                    ? "bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-md"
                    : isHighlighted
                    ? "bg-emerald-50 border-emerald-400 shadow-sm"
                    : "bg-white border-stone-200 hover:border-emerald-400"
                }`}
              >
                {/* Ayah Top Bar (Number + Toolbar) */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center font-bold text-emerald-300 text-xs">
                      {ayah.ayahNumber}
                    </span>
                    <span className="font-semibold text-stone-700">
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
                          : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
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
                          ayah.arabicUthmani,
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
                          ayah.arabicUthmani,
                          ayah.translationSaheeh,
                          ayah.transliteration
                        )
                      }
                      className={`p-1.5 rounded-lg transition ${
                        isBookmarked
                          ? "bg-amber-500 text-slate-950 font-bold"
                          : "bg-stone-100 text-stone-600 hover:text-stone-900"
                      }`}
                      title={isBookmarked ? "Ayah Saved" : "Bookmark Ayah"}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-slate-950" : ""}`} />
                    </button>

                    {/* Copy Text */}
                    <button
                      onClick={() => handleCopyAyah(ayah)}
                      className="p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition"
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

                {/* Arabic Text Display */}
                <div className="py-2 text-right">
                  <p
                    className={`${resolveQuranScript(script).fontClass} text-stone-950 leading-loose transition select-text ${
                      hifzMode === "blur_arabic" ? "blur-sm hover:blur-none" : ""
                    }`}
                    style={{ fontSize: `${preferences.arabicFontSize || 28}px` }}
                    dir="rtl"
                  >
                    {arabicText}{" "}
                    <span className="ayah-symbol font-sans">{ayah.ayahNumber}</span>
                  </p>
                </div>

                {/* Word-by-word Breakdown Table/Chips */}
                {wordByWordView && ayah.words && ayah.words.length > 0 && (
                  <div className="pt-2 pb-1 overflow-x-auto no-scrollbar">
                    <div className="flex flex-row-reverse items-stretch gap-2 min-w-max">
                      {ayah.words.map((w, wIdx) => (
                        <div
                          key={wIdx}
                          className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-1 min-w-[80px]"
                        >
                          <div className="font-arabic text-xl font-bold text-amber-300">{w.arabic}</div>
                          <div className="text-[10px] text-emerald-300 font-medium">{w.transliteration}</div>
                          <div className="text-[11px] text-stone-700 font-semibold">{w.translation}</div>
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
                  <div className="text-xs sm:text-sm font-medium text-emerald-800 italic tracking-wide">
                    {ayah.transliteration}
                  </div>
                )}

                {/* English Translation */}
                {preferences.showTranslation && hifzMode !== "hide_translation" && (
                  <div className="text-sm sm:text-base text-stone-800 leading-relaxed font-sans">
                    {ayah.translationSaheeh}
                  </div>
                )}

                {/* Tafseer reflection note if available */}
                {ayah.tafseerNote && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-stone-700 flex items-start gap-2">
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
        </div>
      )}
    </div>
  );
}
