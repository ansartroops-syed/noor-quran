"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Search,
  Play,
  Pause,
  Square,
  Eye,
  EyeOff,
  CheckCircle2,
  RotateCcw,
  Repeat,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  ListChecks,
  Lightbulb,
} from "lucide-react";
import { SURAH_LIST } from "@/data/surahMetadata";
import { SurahDetail, QuranAyah } from "@/data/surahDetailsData";
import { UserPreferences } from "@/components/SettingsModal";
import { getAyahAudioUrl, getAyahFallbackUrls, playHarmonicChime, playSuccessFanfare } from "@/lib/audioEngine";
import { useReadingTheme } from "@/lib/readingThemes";
import { getScriptOption, type QuranScriptId } from "@/lib/quranScripts";
import { bismillahForScript, stripBismillahPrefix, surahHasSeparateBismillah } from "@/lib/bismillah";
import confetti from "canvas-confetti";

type HifzMode = "read" | "hide" | "firstwords" | "firstletters";

const HIFZ_KEY = "noor-hifz-memorized";

function loadMemorized(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(HIFZ_KEY);
    if (raw) return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    // ignore
  }
  return {};
}

function firstWordsHint(arabic: string, n = 2): string {
  const words = arabic.trim().split(/\s+/).filter(Boolean);
  if (words.length <= n) return arabic;
  return words.slice(0, n).join(" ") + "  • • •";
}

function firstLettersHint(arabic: string): string {
  return arabic
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const first = w.replace(/^[^\u0621-\u064A\u066E\u0671]+/, "").charAt(0);
      return (first || "•") + "ـ ـ ـ";
    })
    .join("  ");
}

interface HifzQuranTabProps {
  currentSurahNumber: number;
  preferences: UserPreferences;
  onPlayAyah: (surahNumber: number, ayahNumber: number, surahName: string, totalAyahs: number) => void;
  onSurahChange?: (surahNumber: number) => void;
  onAddXp?: (amount: number) => void;
}

export function HifzQuranTab({
  currentSurahNumber,
  preferences,
  onPlayAyah,
  onSurahChange,
  onAddXp,
}: HifzQuranTabProps) {
  const [selectedSurahNum, setSelectedSurahNum] = useState<number>(currentSurahNumber || 112);
  const [surahData, setSurahData] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<HifzMode>("read");
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [memorized, setMemorized] = useState<Record<string, boolean>>({});
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(5);
  const [repeatCount, setRepeatCount] = useState(5);
  const [loopIndex, setLoopIndex] = useState(0);
  const [loopRunning, setLoopRunning] = useState(false);
  const [loopAyah, setLoopAyah] = useState<number | null>(null);
  const [repeatDone, setRepeatDone] = useState(0);

  const { theme } = useReadingTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopRef = useRef(false);
  const script = (preferences.preferredScript as QuranScriptId) || "standard";

  useEffect(() => {
    setMemorized(loadMemorized());
  }, []);

  useEffect(() => {
    return () => {
      stopRef.current = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/quran/${selectedSurahNum}?script=${script}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!alive) return;
        if (data.success && data.surah && Array.isArray(data.surah.ayahs) && data.surah.ayahs.length > 0) {
          setSurahData(data.surah);
          const total = data.surah.versesCount || data.surah.ayahs.length;
          setRangeFrom(1);
          setRangeTo(Math.min(total, 5));
          setRevealed({});
        }
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [selectedSurahNum, script]);

  const persist = (next: Record<string, boolean>) => {
    setMemorized(next);
    try {
      window.localStorage.setItem(HIFZ_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const goToSurah = (num: number) => {
    const clamped = Math.min(114, Math.max(1, num));
    stopLoop();
    setSelectedSurahNum(clamped);
    onSurahChange?.(clamped);
  };

  const key = (s: number, a: number) => `${s}:${a}`;
  const toggleMemorized = (ayahNumber: number) => {
    const k = key(selectedSurahNum, ayahNumber);
    const next = { ...memorized };
    if (next[k]) {
      delete next[k];
    } else {
      next[k] = true;
      playHarmonicChime(660);
      onAddXp?.(10);
      const totalMem = Object.keys(next).length;
      if (totalMem > 0 && totalMem % 10 === 0) {
        playSuccessFanfare();
        confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
      }
    }
    persist(next);
  };

  const toggleReveal = (ayahNumber: number) => {
    setRevealed((prev) => ({ ...prev, [ayahNumber]: !prev[ayahNumber] }));
  };

  const playSingle = (ayah: QuranAyah) => {
    if (!surahData) return;
    onPlayAyah(selectedSurahNum, ayah.ayahNumber, surahData.nameTransliterated, surahData.versesCount);
  };

  const playUrlWithFallback = (urls: string[]): Promise<void> => {
    return new Promise((resolve) => {
      let i = 0;
      const audio = new Audio(urls[0]);
      audioRef.current = audio;
      audio.volume = 1.0;
      const tryNext = () => {
        i += 1;
        if (i < urls.length && !stopRef.current) {
          audio.src = urls[i];
          audio.play().catch(() => resolve());
        } else {
          resolve();
        }
      };
      audio.onended = () => resolve();
      audio.onerror = () => tryNext();
      audio.play().catch(() => resolve());
    });
  };

  const stopLoop = () => {
    stopRef.current = true;
    setLoopRunning(false);
    setLoopAyah(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const startLoop = async () => {
    if (!surahData || loopRunning) return;
    const from = Math.max(1, Math.min(rangeFrom, rangeTo));
    const to = Math.min(surahData.versesCount, Math.max(rangeFrom, rangeTo));
    const ayahs = surahData.ayahs.filter((a) => a.ayahNumber >= from && a.ayahNumber <= to);
    if (ayahs.length === 0) return;
    stopRef.current = false;
    setLoopRunning(true);
    setLoopIndex(0);
    setRepeatDone(0);
    for (let idx = 0; idx < ayahs.length; idx++) {
      if (stopRef.current) break;
      const ayah = ayahs[idx];
      setLoopIndex(idx);
      for (let r = 0; r < repeatCount; r++) {
        if (stopRef.current) break;
        setLoopAyah(ayah.ayahNumber);
        setRepeatDone(r + 1);
        const urls = getAyahFallbackUrls(selectedSurahNum, ayah.ayahNumber, preferences.preferredReciter);
        // ensure primary first
        const primary = getAyahAudioUrl(selectedSurahNum, ayah.ayahNumber, preferences.preferredReciter);
        const ordered = [primary, ...urls.filter((u) => u !== primary)];
        await playUrlWithFallback(ordered);
        await new Promise((res) => setTimeout(res, 600));
      }
    }
    setLoopRunning(false);
    setLoopAyah(null);
    if (!stopRef.current) {
      playSuccessFanfare();
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      onAddXp?.(25);
    }
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
  const totalVerses = surahData?.versesCount || currentMeta?.versesCount || 0;
  const memorizedInSurah = surahData
    ? surahData.ayahs.filter((a) => memorized[key(selectedSurahNum, a.ayahNumber)]).length
    : 0;
  const totalMemorized = Object.keys(memorized).length;
  const surahPct = totalVerses ? Math.round((memorizedInSurah / totalVerses) * 100) : 0;

  const visibleAyahs = surahData
    ? surahData.ayahs.filter((a) => a.ayahNumber >= Math.min(rangeFrom, rangeTo) && a.ayahNumber <= Math.max(rangeFrom, rangeTo))
    : [];

  const modes: { id: HifzMode; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: "read", label: "1 • Read", desc: "Look & listen", icon: <Eye className="w-3.5 h-3.5" /> },
    { id: "firstwords", label: "2 • First Words", desc: "Hint starters", icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { id: "firstletters", label: "3 • First Letters", desc: "Stronger test", icon: <ListChecks className="w-3.5 h-3.5" /> },
    { id: "hide", label: "4 • Hide All", desc: "Full test", icon: <EyeOff className="w-3.5 h-3.5" /> },
  ];

  const renderAyahText = (ayah: QuranAyah) => {
    const clean = stripBismillahPrefix(ayah.arabicUthmani) || ayah.arabicUthmani;
    if (mode === "read" || revealed[ayah.ayahNumber]) return clean;
    if (mode === "firstwords") return firstWordsHint(clean, 2);
    if (mode === "firstletters") return firstLettersHint(clean);
    return "• • •  Tap “Show” and recite from memory  • • •";
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="rounded-3xl border border-emerald-500/30 bg-[#06241c] p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-violet-500/20 text-violet-300">
            <Brain className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
              Hifz Quran <span className="text-violet-300 font-semibold">• Memorize the Entire Quran</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400">
              4-step method: Read → First Words → First Letters → Hide All. Loop audio, then mark each ayah memorized.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-2xl bg-violet-950/50 border border-violet-800/60 text-center">
            <div className="text-lg sm:text-2xl font-extrabold text-white">{totalMemorized}</div>
            <div className="text-[10px] text-violet-300 font-bold uppercase">Ayahs memorized</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 text-center">
            <div className="text-lg sm:text-2xl font-extrabold text-white">{memorizedInSurah}/{totalVerses}</div>
            <div className="text-[10px] text-emerald-300 font-bold uppercase">This Surah ({surahPct}%)</div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-950/50 border border-amber-800/60 text-center">
            <div className="text-lg sm:text-2xl font-extrabold text-white flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4 text-amber-400" /> {surahPct}%
            </div>
            <div className="text-[10px] text-amber-300 font-bold uppercase">Surah progress</div>
          </div>
        </div>
        <div className="w-full h-2.5 rounded-full bg-emerald-950 border border-emerald-900 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${surahPct}%` }}
          />
        </div>

        {/* Surah picker */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-violet-300 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search 114 Surahs to memorize..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 focus:border-violet-400 focus:outline-none text-white text-xs sm:text-sm"
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
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <span className="text-[11px] text-slate-400 font-bold px-1 whitespace-nowrap">{selectedSurahNum} / 114</span>
              <button
                onClick={() => goToSurah(selectedSurahNum + 1)}
                disabled={selectedSurahNum >= 114}
                className="flex-1 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold text-xs transition flex items-center justify-center gap-1"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Range + repeats */}
          <div className="flex-1 grid grid-cols-3 gap-2 items-end">
            <div>
              <label className="text-[10px] font-bold text-violet-300 uppercase">From ayah</label>
              <input
                type="number"
                min={1}
                max={totalVerses || 286}
                value={rangeFrom}
                onChange={(e) => setRangeFrom(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-white text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-violet-300 uppercase">To ayah</label>
              <input
                type="number"
                min={1}
                max={totalVerses || 286}
                value={rangeTo}
                onChange={(e) => setRangeTo(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-white text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-violet-300 uppercase">Repeats</label>
              <select
                value={repeatCount}
                onChange={(e) => setRepeatCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-white text-sm focus:outline-none cursor-pointer"
              >
                {[1, 3, 5, 7, 10, 20].map((n) => (
                  <option key={n} value={n} className="bg-[#041a14]">
                    ×{n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mode steps */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`p-3 rounded-2xl border text-left transition ${
                mode === m.id
                  ? "bg-violet-700/60 border-violet-400 text-white ring-1 ring-violet-400/50"
                  : "bg-emerald-950/40 border-emerald-900 text-slate-300 hover:border-violet-500"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {m.icon} {m.label}
              </div>
              <div className="text-[10px] opacity-70 mt-0.5">{m.desc}</div>
            </button>
          ))}
        </div>

        {/* Loop controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-2xl bg-violet-950/40 border border-violet-800/60 p-3">
          {!loopRunning ? (
            <button
              onClick={startLoop}
              disabled={!surahData || loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <Repeat className="w-4 h-4" /> Start Hifz Loop ×{repeatCount}
            </button>
          ) : (
            <button
              onClick={stopLoop}
              className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <Square className="w-4 h-4 fill-current" /> Stop Loop
            </button>
          )}
          <button
            onClick={() => {
              setRevealed({});
              setMode("read");
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset view
          </button>
          {loopRunning && (
            <span className="text-xs text-violet-200 font-semibold text-center">
              Ayah {loopIndex + 1}/{visibleAyahs.length || "?"} • Repeat {repeatDone}/{repeatCount}
              {loopAyah ? ` • 🔊 ${selectedSurahNum}:${loopAyah}` : ""}
            </span>
          )}
        </div>
      </div>

      {/* Ayah cards */}
      {loading && <p className="text-center text-sm text-slate-400 py-10">Loading Surah for Hifz…</p>}
      {!loading && surahData && (
        <div className="space-y-3">
          {surahHasSeparateBismillah(selectedSurahNum) && (
            <div className="px-5 py-4 text-center rounded-3xl border border-[var(--rp-card-bd)]" style={{ backgroundColor: theme.vars["--rp-page"] }}>
              <p className="font-arabic text-2xl sm:text-3xl leading-loose" style={{ color: theme.vars["--rp-bis"] }} dir="rtl" lang="ar">
                {bismillahForScript((preferences.preferredScript as QuranScriptId) || "standard")}
              </p>
            </div>
          )}
          {visibleAyahs.map((ayah) => {
            const isMem = Boolean(memorized[key(selectedSurahNum, ayah.ayahNumber)]);
            const isLooping = loopRunning && loopAyah === ayah.ayahNumber;
            const isRevealed = mode === "read" || revealed[ayah.ayahNumber];
            return (
              <div
                key={ayah.ayahNumber}
                className="p-4 sm:p-5 rounded-3xl border shadow-lg transition"
                style={{
                  backgroundColor: isLooping ? theme.vars["--rp-active"] : theme.vars["--rp-card"],
                  borderColor: isLooping ? theme.vars["--rp-badge-bd"] : theme.vars["--rp-card-bd"],
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
                    style={{ color: theme.vars["--rp-accent"], borderColor: theme.vars["--rp-badge-bd"] }}
                  >
                    {selectedSurahNum}:{ayah.ayahNumber}
                    {isLooping ? " • 🔊 repeating…" : ""}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => playSingle(ayah)}
                      title="Listen once"
                      className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-600 text-white transition"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {mode !== "read" && (
                      <button
                        onClick={() => toggleReveal(ayah.ayahNumber)}
                        title={isRevealed ? "Hide again" : "Show answer"}
                        className="px-2.5 py-1.5 rounded-lg bg-violet-800 hover:bg-violet-600 text-white text-[11px] font-bold flex items-center gap-1 transition"
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {isRevealed ? "Hide" : "Show"}
                      </button>
                    )}
                    <button
                      onClick={() => toggleMemorized(ayah.ayahNumber)}
                      title={isMem ? "Mark as not yet memorized" : "Mark as memorized"}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                        isMem
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> {isMem ? "Memorized ✓" : "Got it!"}
                    </button>
                  </div>
                </div>
                <p
                  dir="rtl"
                  lang="ar"
                  className={`${getScriptOption((preferences.preferredScript as QuranScriptId) || "standard").fontClass} text-right leading-loose`}
                  style={{ color: theme.vars["--rp-ink"], fontSize: `${preferences.arabicFontSize || 28}px` }}
                >
                  {renderAyahText(ayah)}
                </p>
                {!isRevealed && (
                  <p className="text-[11px] mt-1" style={{ color: theme.vars["--rp-muted"] }}>
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Recite it aloud from memory, then tap “Show” to check yourself.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
