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
}: QuranReaderTabProps) {
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(currentSurahNumber || 1);
  const [surahData, setSurahData] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [surahSearchQuery, setSurahSearchQuery] = useState("");
  const [juzFilter, setJuzFilter] = useState<number | "all">("all");
  const [hifzMode, setHifzMode] = useState<"standard" | "hide_translation" | "hide_transliteration" | "blur_arabic">("standard");
  const [wordByWordView, setWordByWordView] = useState(false);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

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

    fetch(`/api/quran/${selectedSurahNum}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.surah) {
          setSurahData(data.surah);
        }
      })
      .catch((err) => console.error("Failed to load surah:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSurahNum]);

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
    <div className="space-y-6 pb-24">
      {/* Surah Header & Toolbar */}
      <div className="rounded-3xl border border-emerald-500/30 bg-[#06241c] p-4 sm:p-6 shadow-xl space-y-4">
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
                onChange={(e) => setSelectedSurahNum(Number(e.target.value))}
                className="px-3 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold text-xs sm:text-sm focus:outline-none cursor-pointer"
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

            {/* Play All Surah Button */}
            {surahData && (
              <button
                onClick={() =>
                  onPlayAyah(
                    selectedSurahNum,
                    1,
                    surahData.nameTransliterated,
                    surahData.versesCount
                  )
                }
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" /> Play Surah
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
          {/* Bismillah Header (Except Surah 9) */}
          {selectedSurahNum !== 9 && selectedSurahNum !== 1 && (
            <div className="py-4 text-center rounded-2xl bg-[#041a14]/60 border border-emerald-900/50">
              <p className="font-arabic text-2xl sm:text-3xl text-emerald-300" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-xs text-slate-400 mt-1">
                In the name of Allah, the Entirely Merciful, the Especially Merciful.
              </p>
            </div>
          )}

          {surahData.ayahs.map((ayah) => {
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
                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 space-y-4 ${
                  isPlayingThis
                    ? "bg-[#063327] border-amber-400 ring-2 ring-amber-400/30 shadow-2xl"
                    : isHighlighted
                    ? "bg-[#062c22] border-emerald-400 shadow-xl"
                    : "bg-[#06241c] border-emerald-900/60 hover:border-emerald-700/80"
                }`}
              >
                {/* Ayah Top Bar (Number + Toolbar) */}
                <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-900/80 border border-emerald-700/50 flex items-center justify-center font-bold text-emerald-300 text-xs">
                      {ayah.ayahNumber}
                    </span>
                    <span className="font-semibold text-slate-300">
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

                {/* Arabic Text Display */}
                <div className="py-2 text-right">
                  <p
                    className={`font-arabic text-emerald-100 leading-loose transition select-text ${
                      hifzMode === "blur_arabic" ? "blur-sm hover:blur-none" : ""
                    }`}
                    style={{ fontSize: `${preferences.arabicFontSize || 28}px` }}
                    dir="rtl"
                  >
                    {ayah.arabicUthmani}{" "}
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
                  <div className="text-xs sm:text-sm font-medium text-emerald-400/90 italic tracking-wide">
                    {ayah.transliteration}
                  </div>
                )}

                {/* English Translation */}
                {preferences.showTranslation && hifzMode !== "hide_translation" && (
                  <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
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
        </div>
      )}
    </div>
  );
}
