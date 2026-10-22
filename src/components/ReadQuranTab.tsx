"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpenCheck,
  Search,
  Play,
  Pause,
  Type,
  Languages,
  LetterText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Volume2,
} from "lucide-react";
import { SURAH_LIST } from "@/data/surahMetadata";
import { SurahDetail } from "@/data/surahDetailsData";
import { UserPreferences } from "@/components/SettingsModal";
import { AVAILABLE_RECITERS } from "@/lib/audioEngine";
import { ScriptSelector } from "@/components/ScriptSelector";
import { ReadingThemeSelector } from "@/components/ReadingThemeSelector";
import { useReadingTheme } from "@/lib/readingThemes";
import {
  readStoredScript,
  storeScript,
  getScriptOption,
  type QuranScriptId,
} from "@/lib/quranScripts";
import {
  BISMILLAH_ARABIC as READ_BISMILLAH_ARABIC,
  BISMILLAH_TRANSLITERATION as READ_BISMILLAH_TRANSLITERATION,
  BISMILLAH_TRANSLATION as READ_BISMILLAH_TRANSLATION,
  bismillahForScript,
  stripBismillahPrefix,
  surahHasSeparateBismillah,
  bismillahNoteForSurah,
} from "@/lib/bismillah";

// Re-exported for any older imports.
export { READ_BISMILLAH_ARABIC, READ_BISMILLAH_TRANSLITERATION, READ_BISMILLAH_TRANSLATION };

function surahHasBismillahHeader(n: number): boolean {
  return surahHasSeparateBismillah(n);
}

interface ReadQuranTabProps {
  currentSurahNumber: number;
  highlightAyahNumber?: number;
  preferences: UserPreferences;
  isPlayingAudio: boolean;
  playingAyahNumber?: number;
  onPlayAyah: (surahNumber: number, ayahNumber: number, surahName: string, totalAyahs: number) => void;
  onSurahChange?: (surahNumber: number) => void;
  onReciterChange?: (subfolder: string) => void;
  onScriptChange?: (script: QuranScriptId) => void;
}

export function ReadQuranTab({
  currentSurahNumber,
  highlightAyahNumber,
  preferences,
  isPlayingAudio,
  playingAyahNumber,
  onPlayAyah,
  onSurahChange,
  onReciterChange,
  onScriptChange,
}: ReadQuranTabProps) {
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(currentSurahNumber || 1);
  const [surahData, setSurahData] = useState<SurahDetail | null>(null);
  const [surahSource, setSurahSource] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [script, setScript] = useState<QuranScriptId>(() => {
    const stored = readStoredScript();
    const pref = preferences.preferredScript as string;
    if (pref === "uthmani" || pref === "indopak" || pref === "standard" || pref === "plain") return pref;
    return stored;
  });
  // Reading-only view options — Arabic is always shown; these toggle extras.
  const [showTranslation, setShowTranslation] = useState<boolean>(preferences.showTranslation ?? true);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(false);
  const [readFontSize, setReadFontSize] = useState<number>(preferences.arabicFontSize || 32);
  // Reading theme — default is light Mushaf Cream (never dark unless chosen).
  const { themeId, theme, setTheme } = useReadingTheme();

  const ayahRefs = useRef<Record<number, HTMLSpanElement | null>>({});
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentSurahNumber && currentSurahNumber !== selectedSurahNum) {
      setSelectedSurahNum(currentSurahNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSurahNumber]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setLoadError(null);
    setSurahData(null);
    fetch(`/api/quran/${selectedSurahNum}?script=${script}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!alive) return;
        if (data.success && data.surah && Array.isArray(data.surah.ayahs) && data.surah.ayahs.length > 0) {
          setSurahData(data.surah);
          setSurahSource(typeof data.source === "string" ? data.source : "");
        } else {
          setLoadError("Could not load this Surah. Please check your connection and try again.");
        }
      })
      .catch(() => {
        if (alive) setLoadError("Could not load this Surah. Please check your connection and try again.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [selectedSurahNum, script]);

  const handleScriptChange = (id: QuranScriptId) => {
    setScript(id);
    storeScript(id);
    onScriptChange?.(id);
  };

  // Keep in sync if global font size changes in Settings
  useEffect(() => {
    setReadFontSize(preferences.arabicFontSize || 32);
  }, [preferences.arabicFontSize]);

  useEffect(() => {
    const target = playingAyahNumber ?? highlightAyahNumber;
    if (target && ayahRefs.current[target]) {
      ayahRefs.current[target]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [playingAyahNumber, highlightAyahNumber]);

  const goToSurah = (num: number) => {
    const clamped = Math.min(114, Math.max(1, num));
    setSelectedSurahNum(clamped);
    onSurahChange?.(clamped);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredSurahs = SURAH_LIST.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      s.nameArabic.includes(searchQuery.trim()) ||
      s.nameTransliterated.toLowerCase().includes(q) ||
      s.nameEnglish.toLowerCase().includes(q) ||
      String(s.number) === searchQuery.trim()
    );
  });

  const currentMeta = SURAH_LIST.find((s) => s.number === selectedSurahNum);
  const hasBismillah = surahHasBismillahHeader(selectedSurahNum);

  return (
    <div className="space-y-6 pb-24" style={theme.vars as React.CSSProperties}>
      <div ref={topRef} />

      {/* Header */}
      <div className="rounded-3xl border border-emerald-500/30 bg-[#06241c] p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
            <BookOpenCheck className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
              Read Quran <span className="text-emerald-400 font-semibold">• Noor Quran by NajAns</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Pure Arabic Mushaf reading in 4 verified scripts. Toggle translation / transliteration anytime.
            </p>
          </div>
        </div>

        {/* Reading theme — TOP so the user can change it before reading */}
        <div className="rounded-2xl bg-emerald-950/40 border border-emerald-900/70 p-3">
          <ReadingThemeSelector value={themeId} onChange={setTheme} />
        </div>

        {/* Surah picker + prev/next */}
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search 114 Surahs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 focus:border-emerald-400 focus:outline-none text-white text-xs sm:text-sm"
                />
              </div>
              <select
                value={selectedSurahNum}
                onChange={(e) => goToSurah(Number(e.target.value))}
                className="px-3 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold text-xs sm:text-sm focus:outline-none cursor-pointer max-w-[200px]"
              >
                {filteredSurahs.map((s) => (
                  <option key={s.number} value={s.number} className="bg-[#041a14] text-white">
                    {s.number}. {s.nameTransliterated}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => goToSurah(selectedSurahNum - 1)}
                disabled={selectedSurahNum <= 1}
                className="flex-1 px-3 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 disabled:opacity-40 text-emerald-200 font-semibold text-xs border border-emerald-800 transition flex items-center justify-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev Surah
              </button>
              <span className="text-[11px] text-slate-400 font-bold px-1 whitespace-nowrap">
                {selectedSurahNum} / 114
              </span>
              <button
                onClick={() => goToSurah(selectedSurahNum + 1)}
                disabled={selectedSurahNum >= 114}
                className="flex-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition flex items-center justify-center gap-1"
              >
                Next Surah <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Reading options */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowTranslation((v) => !v)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                showTranslation
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : "bg-emerald-950/60 text-slate-300 border-emerald-800/60 hover:text-white"
              }`}
              title="Show / hide English translation"
            >
              <Languages className="w-3.5 h-3.5" /> Translation {showTranslation ? "On" : "Off"}
            </button>
            <button
              onClick={() => setShowTransliteration((v) => !v)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                showTransliteration
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : "bg-emerald-950/60 text-slate-300 border-emerald-800/60 hover:text-white"
              }`}
              title="Show / hide Roman transliteration"
            >
              <LetterText className="w-3.5 h-3.5" /> Transliteration {showTransliteration ? "On" : "Off"}
            </button>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-slate-300">
              <Type className="w-3.5 h-3.5 text-emerald-400" />
              <button
                onClick={() => setReadFontSize((f) => Math.max(22, f - 2))}
                className="px-1.5 font-bold hover:text-white"
                title="Decrease Arabic size"
              >
                A−
              </button>
              <span className="font-mono text-emerald-300 w-7 text-center">{readFontSize}</span>
              <button
                onClick={() => setReadFontSize((f) => Math.min(48, f + 2))}
                className="px-1.5 font-bold hover:text-white"
                title="Increase Arabic size"
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* Script picker */}
        <div className="rounded-2xl bg-emerald-950/40 border border-emerald-900/70 p-3">
          <ScriptSelector value={script} onChange={handleScriptChange} />
          {surahSource ? (
            <p className="text-[10px] text-slate-500 mt-2">
              Arabic source: <span className="font-mono text-slate-400">{surahSource}</span> •
              Showing: <span className="font-semibold text-emerald-400">{getScriptOption(script).label}</span>
            </p>
          ) : (
            <p className="text-[10px] text-slate-500 mt-2">
              Showing: <span className="font-semibold text-emerald-400">{getScriptOption(script).label}</span> •
              Source: <span className="font-mono text-slate-400">{getScriptOption(script).sourceName}</span>
            </p>
          )}
          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
            {getScriptOption(script).longDesc}
          </p>
        </div>

        {/* Qari + play */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-emerald-900/60">
          <div className="flex items-center gap-2 flex-1">
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <select
              value={preferences.preferredReciter}
              onChange={(e) => onReciterChange?.(e.target.value)}
              title="Choose Qari reciter"
              className="flex-1 px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {AVAILABLE_RECITERS.map((r) => (
                <option key={r.id} value={r.subfolder} className="bg-[#041a14] text-white">
                  🎙 {r.name}
                </option>
              ))}
            </select>
          </div>
          {surahData && (
            <button
              onClick={() =>
                onPlayAyah(
                  selectedSurahNum,
                  hasBismillah ? 0 : 1,
                  surahData.nameTransliterated,
                  surahData.versesCount
                )
              }
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" /> Play Surah{hasBismillah ? " from Bismillah" : ""}
            </button>
          )}
        </div>
      </div>

      {/* Surah title card */}
      {currentMeta && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#052e22] via-[#04241b] to-[#021812] border border-emerald-500/30 text-center space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-emerald-400">
              Juz {currentMeta.juzNumber} • {currentMeta.versesCount} Ayahs
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
              {currentMeta.revelationType}
            </span>
          </div>
          <h2 className="font-arabic text-4xl sm:text-5xl text-amber-300 font-bold py-1">
            {currentMeta.nameArabic}
          </h2>
          <h3 className="text-xl font-bold text-white">Surah {currentMeta.nameTransliterated}</h3>
          <p className="text-xs text-slate-300 italic">{currentMeta.nameEnglish}</p>
        </div>
      )}

      {loading && (
        <div className="py-20 text-center text-emerald-400 space-y-3">
          <Loader2 className="w-10 h-10 animate-spin mx-auto" />
          <p className="text-sm font-semibold">Loading Surah text...</p>
        </div>
      )}

      {loadError && !loading && (
        <div className="p-8 rounded-3xl bg-rose-950/40 border border-rose-500/40 text-center space-y-3">
          <p className="text-rose-200 text-sm font-semibold">{loadError}</p>
          <button
            onClick={() => goToSurah(selectedSurahNum)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty states — so the page can never look blank without explanation */}
      {!loading && !loadError && !surahData && (
        <div className="p-10 rounded-3xl border text-center space-y-3 bg-[var(--rp-card)] border-[var(--rp-card-bd)]">
          <p className="text-sm font-bold text-[var(--rp-ink)]">No text loaded yet</p>
          <p className="text-xs text-[var(--rp-muted)]">Tap Retry to load Surah {selectedSurahNum}.</p>
          <button
            onClick={() => goToSurah(selectedSurahNum)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !loadError && surahData && surahData.ayahs.length === 0 && (
        <div className="p-10 rounded-3xl border text-center space-y-3 bg-[var(--rp-card)] border-[var(--rp-card-bd)]">
          <p className="text-sm font-bold text-[var(--rp-ink)]">This Surah returned no verses</p>
          <p className="text-xs text-[var(--rp-muted)]">Please try another script or tap Retry.</p>
          <button
            onClick={() => goToSurah(selectedSurahNum)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Mushaf reading page — themed (default: light Mushaf Cream) */}
      {!loading && !loadError && surahData && surahData.ayahs.length > 0 && (
        <div className="rounded-3xl border border-[var(--rp-card-bd)] bg-[var(--rp-page)] shadow-2xl overflow-hidden">
          {/* ── Separate Bismillah header — top of EVERY Surah except 1 & 9 ── */}
          {hasBismillah ? (
            <div className="px-6 pt-7 pb-5 text-center border-b border-[var(--rp-divider)]">
              <div className="flex items-center gap-3 max-w-xl mx-auto">
                <span className="flex-1 h-px bg-[var(--rp-divider)]" />
                <span className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap text-[var(--rp-accent)]">
                  Bismillah ir-Rahman ir-Rahim • Opening of this Surah
                </span>
                <span className="flex-1 h-px bg-[var(--rp-divider)]" />
              </div>
              <p
                className={`${getScriptOption(script).fontClass} text-3xl sm:text-[2.6rem] leading-loose mt-2 text-[var(--rp-bis)]`}
                dir="rtl"
                lang="ar"
              >
                {bismillahForScript(script)}
              </p>
              {showTransliteration && (
                <p className="text-xs sm:text-sm italic mt-1 text-[var(--rp-muted)]">{READ_BISMILLAH_TRANSLITERATION}</p>
              )}
              {showTranslation && (
                <p className="text-xs sm:text-sm mt-1 text-[var(--rp-muted)]">{READ_BISMILLAH_TRANSLATION}</p>
              )}
            </div>
          ) : (
            <div className="px-6 py-3 text-center border-b border-[var(--rp-divider)] bg-[var(--rp-note-bg)]">
              <p className="text-[11px] italic text-[var(--rp-muted)]">{bismillahNoteForSurah(selectedSurahNum)}</p>
            </div>
          )}

          {/* Continuous Arabic flow — Mushaf style (script-authentic font) */}
          <div className="px-5 sm:px-10 py-8">
            <p
              dir="rtl"
              lang="ar"
              className={`${getScriptOption(script).fontClass} text-justify text-[var(--rp-ink)]`}
              style={{ fontSize: `${readFontSize}px`, lineHeight: 2.3 }}
            >
              {surahData.ayahs.map((ayah) => {
                const clean = stripBismillahPrefix(ayah.arabicUthmani) || ayah.arabicUthmani;
                const active = isPlayingAudio && playingAyahNumber === ayah.ayahNumber;
                return (
                  <span
                    key={ayah.ayahNumber}
                    ref={(el) => {
                      ayahRefs.current[ayah.ayahNumber] = el;
                    }}
                    className="rounded px-0.5 transition"
                    style={active ? { backgroundColor: "var(--rp-active)", color: "var(--rp-active-tx)" } : undefined}
                  >
                    {clean}{" "}
                    <span
                      className="inline-flex items-center justify-center min-w-[2.1em] h-[1.7em] px-1 mx-1 rounded-full border text-[0.55em] font-sans font-bold align-middle whitespace-nowrap border-[var(--rp-badge-bd)] text-[var(--rp-badge-tx)]"
                    >
                      {ayah.ayahNumber}
                    </span>{" "}
                  </span>
                );
              })}
            </p>
          </div>

          {/* Optional per-ayah translation / transliteration list */}
          {(showTranslation || showTransliteration) && (
            <div className="border-t border-[var(--rp-divider)] bg-[var(--rp-page2)] px-5 sm:px-10 py-6 space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--rp-accent)]">
                Verse-by-verse {showTranslation && showTransliteration ? "translation & transliteration" : showTranslation ? "translation" : "transliteration"}
              </p>
              {surahData.ayahs.map((ayah) => {
                const active = isPlayingAudio && playingAyahNumber === ayah.ayahNumber;
                return (
                  <div
                    key={ayah.ayahNumber}
                    className="flex gap-3 p-3 rounded-2xl border transition bg-[var(--rp-card)] border-[var(--rp-card-bd)]"
                    style={active ? { borderColor: "var(--rp-badge-bd)", backgroundColor: "var(--rp-active)" } : undefined}
                  >
                    <button
                      onClick={() =>
                        onPlayAyah(
                          selectedSurahNum,
                          ayah.ayahNumber,
                          surahData.nameTransliterated,
                          surahData.versesCount
                        )
                      }
                      className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition bg-emerald-700 text-white hover:bg-emerald-600"
                      title={`Play Ayah ${ayah.ayahNumber}`}
                    >
                      {active ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current translate-x-px" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-[var(--rp-accent)]">
                        {selectedSurahNum}:{ayah.ayahNumber}
                      </div>
                      {showTransliteration && (
                        <div className="text-xs italic text-[var(--rp-muted)]">{ayah.transliteration}</div>
                      )}
                      {showTranslation && (
                        <div className="text-sm leading-relaxed text-[var(--rp-ink)]">{ayah.translationSaheeh}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer nav */}
          <div className="px-5 sm:px-10 py-5 border-t border-[var(--rp-divider)] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--rp-page2)]">
            <p className="text-[11px] text-[var(--rp-muted)]">
              End of Surah {currentMeta?.nameTransliterated} • {surahData.versesCount} verses
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => goToSurah(selectedSurahNum - 1)}
                disabled={selectedSurahNum <= 1}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-xs transition"
              >
                ← Prev Surah
              </button>
              <button
                onClick={() => goToSurah(selectedSurahNum + 1)}
                disabled={selectedSurahNum >= 114}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition"
              >
                Next Surah →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
