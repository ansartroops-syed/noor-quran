"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpenText,
  Volume2,
  Play,
  Loader2,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronRight,
  Eye,
  Square,
  CircleCheck,
} from "lucide-react";
import { QAIDA_LETTERS, QaidaLetter } from "@/data/qaidaLetters";
import { COMPLETE_QAIDA_LESSONS } from "@/data/nooraniQaidaComplete";
import { playLetterPronunciation, playHarmonicChime } from "@/lib/audioEngine";

interface NooraniQaidaTabProps {
  onOpenQuiz?: (quizKey: string, levelNum: number, levelTitle: string, badgeName: string) => void;
  onPracticeInQuran?: (surahNumber: number) => void;
}

const PROGRESS_KEY = "noor-qaida-complete-progress";

function loadProgress(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    // ignore
  }
  return {};
}

export function NooraniQaidaTab({ onOpenQuiz, onPracticeInQuran }: NooraniQaidaTabProps) {
  const [activeLessonId, setActiveLessonId] = useState<string>("l01-mufradat");
  const [selectedLetter, setSelectedLetter] = useState<QaidaLetter>(QAIDA_LETTERS[0]);
  const [positionMode, setPositionMode] = useState<"isolated" | "initial" | "medial" | "final">("isolated");
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isLessonPlaying, setIsLessonPlaying] = useState(false);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const stopRef = useRef(false);

  useEffect(() => {
    setCompleted(loadProgress());
  }, []);

  const persist = (next: Record<string, boolean>) => {
    setCompleted(next);
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const activeLesson =
    COMPLETE_QAIDA_LESSONS.find((l) => l.id === activeLessonId) || COMPLETE_QAIDA_LESSONS[0];

  const completedCount = COMPLETE_QAIDA_LESSONS.filter((l) => completed[l.id]).length;
  const progressPct = Math.round((completedCount / COMPLETE_QAIDA_LESSONS.length) * 100);

  const handleLetterClick = (letter: QaidaLetter) => {
    setSelectedLetter(letter);
    playLetterPronunciation(letter.id, letter.letter);
  };

  const handleAutoPlayAll = async () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    for (const ltr of QAIDA_LETTERS) {
      setSelectedLetter(ltr);
      await playLetterPronunciation(ltr.id, ltr.letter);
      await new Promise((r) => setTimeout(r, 850));
    }
    setIsAutoPlaying(false);
  };

  const handlePlayLesson = async () => {
    if (isLessonPlaying) {
      stopRef.current = true;
      return;
    }
    setIsLessonPlaying(true);
    stopRef.current = false;
    for (const d of activeLesson.drills) {
      if (stopRef.current) break;
      await playLetterPronunciation(d.transliteration, d.arabic);
      if (stopRef.current) break;
      await new Promise((r) => setTimeout(r, 700));
    }
    setIsLessonPlaying(false);
    stopRef.current = false;
  };

  const markComplete = (id: string) => {
    const next = { ...completed, [id]: true };
    persist(next);
    playHarmonicChime(620);
  };

  const displayCharFor = (letter: QaidaLetter) => {
    if (positionMode === "initial") return letter.initial;
    if (positionMode === "medial") return letter.medial;
    if (positionMode === "final") return letter.final;
    return letter.isolated;
  };

  const goLesson = (id: string) => {
    setActiveLessonId(id);
    stopRef.current = true;
    setIsLessonPlaying(false);
    playHarmonicChime(500);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-900/90 via-[#063327] to-[#031d16] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <BookOpenText className="w-3.5 h-3.5" /> Noor Quran by NajAns • Complete Foundation Course
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Complete Noorani Qaidah — All 17 Lessons
          </h1>
          <p className="font-arabic text-2xl text-amber-300" dir="rtl">
            نُورَانِي قَاعِدَة مُکَمَّل
          </p>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            The full printed Qaidah, made interactive: single letters, compounds,
            Muqatta'at, Harakat, Tanween, standing vowels, Madd &amp; Leen, Sukoon,
            Tashdeed (all 5 stages) and Noon Sakinah + Waqf graduation — every item
            with tap-to-hear audio.
          </p>
          {/* Progress */}
          <div className="pt-1 max-w-md space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CircleCheck className="w-3.5 h-3.5 text-emerald-400" />
                Your Qaidah progress
              </span>
              <span className="font-bold text-emerald-300">
                {completedCount} / {COMPLETE_QAIDA_LESSONS.length} lessons ({progressPct}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-emerald-950 border border-emerald-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleAutoPlayAll}
              disabled={isAutoPlaying}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-lg"
            >
              {isAutoPlaying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Reciting A–Y...
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" /> Listen to Full Alphabet
                </>
              )}
            </button>
            {onOpenQuiz && (
              <button
                onClick={() => onOpenQuiz("quiz_level_1", 1, "Noorani Qaidah — Complete 17 Lessons", "Alphabet Scholar")}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition"
              >
                <Award className="w-4 h-4" /> Take Qaidah Quiz
              </button>
            )}
          </div>
        </div>
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none">
          <span className="font-arabic text-[180px] text-emerald-300 leading-none">قاعدة</span>
        </div>
      </div>

      {/* 17-lesson selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <BookOpenText className="w-5 h-5 text-emerald-400" />
            All 17 Qaidah Lessons
          </h2>
          <span className="text-xs text-emerald-400 font-semibold">
            Lesson {activeLesson.number} of 17
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {COMPLETE_QAIDA_LESSONS.map((lesson) => {
            const isActive = activeLessonId === lesson.id;
            const done = Boolean(completed[lesson.id]);
            return (
              <button
                key={lesson.id}
                onClick={() => goLesson(lesson.id)}
                className={`p-3 rounded-2xl border text-left transition relative ${
                  isActive
                    ? "bg-emerald-900/70 border-emerald-400 ring-2 ring-emerald-500/30 text-white"
                    : "bg-[#06241c] border-emerald-900/60 text-slate-300 hover:border-emerald-600"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {lesson.number}
                  </span>
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="font-arabic text-base text-amber-300/80">{lesson.arabicTitle.split(" ")[0]}</span>
                  )}
                </div>
                <div className="text-[11px] font-bold text-white leading-snug line-clamp-2">
                  {lesson.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active lesson body */}
      <div className="rounded-3xl border border-emerald-500/30 bg-[#06241c]/90 p-5 sm:p-8 space-y-6 shadow-xl">
        {/* Lesson header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-emerald-800/40">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Lesson {activeLesson.number} / 17
              </span>
              <span className="font-arabic text-lg text-amber-300">{activeLesson.arabicTitle}</span>
              {completed[activeLesson.id] && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{activeLesson.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeLesson.desc}</p>
          </div>
          <div className="flex sm:flex-col gap-2 shrink-0">
            {activeLesson.drills.length > 0 && (
              <button
                onClick={handlePlayLesson}
                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
                  isLessonPlaying
                    ? "bg-rose-600 hover:bg-rose-500 text-white"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {isLessonPlaying ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" /> Stop Audio
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Play All ({activeLesson.drills.length})
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => markComplete(activeLesson.id)}
              className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              {completed[activeLesson.id] ? "Completed ✓" : "Mark Complete"}
            </button>
          </div>
        </div>

        {/* Rule + How to */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 space-y-1.5">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Golden Rule</span>
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">{activeLesson.rule}</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#041a14] border border-emerald-900 space-y-2">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">How to practise</span>
            <ol className="space-y-1.5">
              {activeLesson.howTo.map((step, i) => (
                <li key={i} className="text-xs sm:text-sm text-slate-300 leading-relaxed flex gap-2">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-800 text-emerald-200 text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Lesson 1: full alphabet explorer */}
        {activeLesson.id === "l01-mufradat" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#041a14] p-3.5 rounded-2xl border border-emerald-900">
              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> Shape:
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-950 p-1 rounded-xl">
                  {(["isolated", "initial", "medial", "final"] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setPositionMode(pos)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                        positionMode === pos
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Tap any of the 29 letters for its real vocal name + Makhraj detail.
              </p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
              {QAIDA_LETTERS.map((letter) => {
                const isSelected = selectedLetter.id === letter.id;
                const ch =
                  positionMode === "initial"
                    ? letter.initial
                    : positionMode === "medial"
                      ? letter.medial
                      : positionMode === "final"
                        ? letter.final
                        : letter.isolated;
                return (
                  <button
                    key={letter.id}
                    onClick={() => handleLetterClick(letter)}
                    className={`p-3 rounded-2xl border transition flex flex-col items-center justify-center gap-1 group ${
                      isSelected
                        ? "bg-emerald-800/80 border-amber-400 ring-2 ring-amber-400/40 text-amber-200 shadow-lg"
                        : "bg-emerald-950/50 border-emerald-900/60 hover:border-emerald-500 hover:bg-emerald-900/40 text-slate-200"
                    }`}
                  >
                    <span className="font-arabic text-3xl sm:text-4xl font-bold group-hover:scale-110 transition">
                      {ch}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300 group-hover:text-emerald-300">
                      {letter.name}
                    </span>
                    <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                      <Volume2 className="w-2.5 h-2.5 text-emerald-400 opacity-60" /> {letter.transliteration}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-5 rounded-2xl bg-[#041a14] border border-emerald-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-arabic text-4xl font-bold text-white shadow-lg">
                    {selectedLetter.isolated}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {selectedLetter.name} ({selectedLetter.transliteration})
                    </h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      Makhraj: {selectedLetter.makhrajGroup}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => playLetterPronunciation(selectedLetter.id, selectedLetter.letter)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Volume2 className="w-4 h-4" /> Listen ({selectedLetter.name})
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <span className="font-bold text-emerald-300">How to pronounce: </span>
                {selectedLetter.makhrajDetail} {selectedLetter.tips}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                {(
                  [
                    ["Isolated", selectedLetter.isolated],
                    ["Initial", selectedLetter.initial],
                    ["Medial", selectedLetter.medial],
                    ["Final", selectedLetter.final],
                  ] as const
                ).map(([label, ch]) => (
                  <button
                    key={label}
                    onClick={() => playLetterPronunciation(selectedLetter.id, ch)}
                    className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900 hover:border-emerald-600 transition"
                  >
                    <span className="font-arabic text-2xl text-amber-300 block">{ch}</span>
                    <span className="text-slate-400 text-[10px]">{label} 🔊</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {selectedLetter.examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => playLetterPronunciation(ex.transliteration, ex.word)}
                    className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 hover:border-emerald-500 transition flex items-center justify-between text-left group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-emerald-300">
                        {ex.transliteration}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {ex.meaning} ({ex.position})
                      </div>
                    </div>
                    <span className="font-arabic text-2xl text-emerald-300">{ex.word}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lessons 2–17: drill grid */}
        {activeLesson.id !== "l01-mufradat" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Tap any card to hear it ({activeLesson.drills.length} items)
              </span>
              <span className="text-[11px] text-slate-500">Audio: real reciter TTS • works offline after first play</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {activeLesson.drills.map((d, i) => (
                <button
                  key={i}
                  onClick={() => playLetterPronunciation(d.transliteration, d.arabic)}
                  className="p-3.5 rounded-2xl bg-[#041a14] border border-emerald-900/70 hover:border-amber-400 hover:bg-emerald-950/60 transition text-center space-y-1.5 group"
                >
                  <div className="font-arabic text-2xl sm:text-3xl font-bold text-emerald-100 group-hover:text-amber-200 leading-relaxed" dir="rtl">
                    {d.arabic}
                  </div>
                  <div className="text-[11px] font-bold text-amber-300/90">{d.transliteration}</div>
                  {d.hint && <div className="text-[10px] text-slate-500 leading-snug">{d.hint}</div>}
                </button>
              ))}
            </div>

            {/* Common mistake */}
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex gap-2.5">
              <span className="text-lg">⚠️</span>
              <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
                <span className="font-bold text-rose-300">Common mistake: </span>
                {activeLesson.mistakes}
              </p>
            </div>

            {/* Prev / Next + Complete */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
              <div className="flex gap-2">
                {activeLesson.number > 1 && (
                  <button
                    onClick={() => {
                      const prev = COMPLETE_QAIDA_LESSONS.find((l) => l.number === activeLesson.number - 1);
                      if (prev) goLesson(prev.id);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 font-semibold text-xs transition"
                  >
                    ← Lesson {activeLesson.number - 1}
                  </button>
                )}
                {activeLesson.number < COMPLETE_QAIDA_LESSONS.length && (
                  <button
                    onClick={() => {
                      markComplete(activeLesson.id);
                      const next = COMPLETE_QAIDA_LESSONS.find((l) => l.number === activeLesson.number + 1);
                      if (next) goLesson(next.id);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    Complete & Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {activeLesson.number === COMPLETE_QAIDA_LESSONS.length && (
                <div className="flex gap-2">
                  <button
                    onClick={() => markComplete(activeLesson.id)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                  >
                    🎓 Finish Qaidah
                  </button>
                  {onPracticeInQuran && (
                    <button
                      onClick={() => onPracticeInQuran(1)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 transition"
                    >
                      Open Al-Fatiha <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-emerald-900/60">
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {completedCount === COMPLETE_QAIDA_LESSONS.length
              ? "MashaAllah! Qaidah complete — continue to Read Quran."
              : "Complete lessons in order — each unlocks the next skill."}
          </p>
          <div className="flex items-center gap-2">
            {onPracticeInQuran && (
              <button
                onClick={() => onPracticeInQuran(112)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 transition"
              >
                Practice Al-Ikhlas <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleAutoPlayAll}
              className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <Play className="w-3.5 h-3.5" /> Revise Alphabet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
