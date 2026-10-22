"use client";

import React, { useState, useEffect } from "react";
import {
  Rocket,
  Star,
  Lock,
  Play,
  Volume2,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Trophy,
  PartyPopper,
  CheckCircle2,
  XCircle,
  Sparkles,
  Heart,
} from "lucide-react";
import { KIDS_QUIZ_LEVELS, KIDS_DIFFICULTIES, KidsQuizLevel, KidsQuizQuestion, KidsDifficulty } from "@/data/kidsQuizData";
import { KIDS_EXTRA_LEVELS } from "@/data/kidsQuizExtraLevels";
import { playLetterPronunciation, playHarmonicChime, playSuccessFanfare } from "@/lib/audioEngine";
import confetti from "canvas-confetti";

const STARS_KEY = "noor-kids-stars";

// Default levels (Kids Quran Quiz): base + extra, sorted 1–9.
// Custom subjects pass their own `levels` prop instead.

// Fisher–Yates shuffle of answer options so the correct answer is never
// predictably "A". Returns fresh question objects with updated correctIndex.
function shuffleLevelQuestions(level: KidsQuizLevel): KidsQuizQuestion[] {
  return level.questions.map((q) => {
    const order = q.options.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const shuffledOptions = order.map((i) => q.options[i]);
    const newCorrect = order.indexOf(q.correctIndex);
    return { ...q, options: shuffledOptions, correctIndex: newCorrect };
  });
}

function loadStars(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STARS_KEY);
    if (raw) return JSON.parse(raw) as Record<string, number>;
  } catch {
    // ignore
  }
  return {};
}

function speakEnglish(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.9;
    u.pitch = 1.15;
    window.speechSynthesis.speak(u);
  } catch {
    // ignore
  }
}

function starsForScore(score: number, total: number): number {
  if (score >= total) return 3;
  if (score >= total - 1) return 2;
  if (score >= Math.ceil(total * 0.6)) return 1;
  return 0;
}

interface KidsQuizTabProps {
  onAddXp?: (amount: number) => void;
  levels?: KidsQuizLevel[];
  storageKey?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerEmoji?: string;
  grownUpNote?: string;
}

export function KidsQuizTab({
  onAddXp,
  levels,
  storageKey,
  headerTitle,
  headerSubtitle,
  headerEmoji,
  grownUpNote,
}: KidsQuizTabProps) {
  const [stars, setStars] = useState<Record<string, number>>({});
  const [activeLevel, setActiveLevel] = useState<KidsQuizLevel | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<KidsQuizQuestion[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<KidsDifficulty | "All">("All");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hearts] = useState(3);

  const QUIZ_LEVELS = levels ?? [...KIDS_QUIZ_LEVELS, ...KIDS_EXTRA_LEVELS];
  const STAR_KEY = storageKey ?? STARS_KEY;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ALL_LEVELS: KidsQuizLevel[] = [...QUIZ_LEVELS].sort((a, b) => a.levelNumber - b.levelNumber);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STAR_KEY);
      if (raw) setStars(JSON.parse(raw) as Record<string, number>);
      else setStars({});
    } catch {
      setStars({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STAR_KEY]);

  const persist = (next: Record<string, number>) => {
    setStars(next);
    try {
      window.localStorage.setItem(STAR_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  // Independent tracks: each difficulty (Basic / Medium / Hard) unlocks on its own.
  // Level 1 of EACH track is always open initially — user picks a track, then Level 1.
  const getTrackLevels = (difficulty: KidsQuizLevel["difficulty"]) =>
    ALL_LEVELS.filter((l) => l.difficulty === difficulty).sort((a, b) => a.levelNumber - b.levelNumber);

  const getPrevInTrack = (level: KidsQuizLevel) => {
    const track = getTrackLevels(level.difficulty);
    const idx = track.findIndex((l) => l.id === level.id);
    return idx > 0 ? track[idx - 1] : null;
  };

  const getNextInTrack = (level: KidsQuizLevel) => {
    const track = getTrackLevels(level.difficulty);
    const idx = track.findIndex((l) => l.id === level.id);
    return idx >= 0 && idx < track.length - 1 ? track[idx + 1] : null;
  };

  const isUnlocked = (level: KidsQuizLevel) => {
    const prev = getPrevInTrack(level);
    if (!prev) return true; // Level 1 of each track — always open
    return (stars[prev.id] ?? 0) > 0;
  };

  const totalStars = Object.values(stars).reduce((a, b) => a + b, 0);

  const filteredLevels =
    difficultyFilter === "All" ? ALL_LEVELS : ALL_LEVELS.filter((l) => l.difficulty === difficultyFilter);

  const starsForDifficulty = (d: KidsDifficulty) =>
    ALL_LEVELS.filter((l) => l.difficulty === d).reduce((a, l) => a + (stars[l.id] ?? 0), 0);

  const startLevel = (level: KidsQuizLevel) => {
    setActiveLevel(level);
    setShuffledQuestions(shuffleLevelQuestions(level));
    setQIndex(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setFinished(false);
    playHarmonicChime(620);
  };

  const exitLevel = () => {
    setActiveLevel(null);
    setShuffledQuestions([]);
    setQIndex(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setFinished(false);
  };

  const submitAnswer = () => {
    if (selected === null || submitted || !activeLevel) return;
    setSubmitted(true);
    const q = shuffledQuestions[qIndex] ?? activeLevel.questions[qIndex];
    if (selected === q.correctIndex) {
      setScore((s) => s + 1);
      playHarmonicChime(660);
    } else {
      playHarmonicChime(220);
    }
  };

  const nextQuestion = () => {
    if (!activeLevel) return;
    const total = shuffledQuestions.length || activeLevel.questions.length;
    if (qIndex < total - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      // score already includes the current question (updated in submitAnswer)
      const finalScore = score;
      const earned = starsForScore(finalScore, total);
      const prevBest = stars[activeLevel.id] ?? 0;
      if (earned > prevBest) {
        persist({ ...stars, [activeLevel.id]: earned });
      }
      const xpGain = finalScore * 10 + earned * 5;
      onAddXp?.(xpGain);
      setFinished(true);
      if (earned >= 2) {
        playSuccessFanfare();
        confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 } });
      } else if (earned === 1) {
        playHarmonicChime(620);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    }
  };

  // ── Level select screen ──
  if (!activeLevel) {
    return (
      <div className="space-y-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-rose-500/25 via-[#06241c] to-[#041a14] border-2 border-rose-400/40 p-6 sm:p-8 shadow-2xl text-center space-y-3">
          <div className="text-5xl">{headerEmoji ?? "🚀"}</div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {headerTitle ?? "Kids Quran Quiz"} <span className="text-rose-300">• Noor Quran by NajAns</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            {headerSubtitle ?? "9 fun levels across Basic 🌱, Medium 🚀 and Hard 🏆! Answers shuffle every game, so no peeking at “A”! Tap an answer, hear it read aloud, and collect ⭐⭐⭐!"}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-extrabold text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {totalStars} / {ALL_LEVELS.length * 3} stars collected
          </div>
        </div>

        {/* Difficulty filter: Basic / Medium / Hard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {KIDS_DIFFICULTIES.map((d) => {
            const isActive = difficultyFilter === d.id;
            const count =
              d.id === "All"
                ? ALL_LEVELS.length
                : ALL_LEVELS.filter((l) => l.difficulty === d.id).length;
            const starCount =
              d.id === "All" ? totalStars : starsForDifficulty(d.id as Exclude<typeof d.id, "All">);
            return (
              <button
                key={d.id}
                onClick={() => setDifficultyFilter(d.id)}
                className={`p-3 rounded-2xl border-2 text-left transition ${
                  isActive
                    ? "bg-rose-600/30 border-rose-400 text-white ring-1 ring-rose-400/50"
                    : "bg-[#06241c] border-emerald-900 text-slate-300 hover:border-rose-400/60"
                }`}
              >
                <div className="text-xl">{d.emoji}</div>
                <div className="text-sm font-extrabold text-white">{d.label}</div>
                <div className="text-[10px] opacity-70">{d.desc}</div>
                <div className="text-[10px] font-bold text-amber-300 mt-1">
                  {count} levels • ⭐ {starCount}
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLevels.map((level) => {
            const unlocked = isUnlocked(level);
            const best = stars[level.id] ?? 0;
            const trackLevels = getTrackLevels(level.difficulty);
            const trackPos = trackLevels.findIndex((l) => l.id === level.id) + 1;
            const prevInTrack = getPrevInTrack(level);
            return (
              <button
                key={level.id}
                disabled={!unlocked}
                onClick={() => startLevel(level)}
                className={`p-5 rounded-3xl border-2 text-left transition group ${
                  unlocked
                    ? `${level.cardBg} hover:scale-[1.02] shadow-xl`
                    : "bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{unlocked ? level.emoji : "🔒"}</span>
                  <span className="text-2xl">{level.mascot}</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Level {trackPos} of {trackLevels.length}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      level.difficulty === "Basic"
                        ? "bg-lime-500/20 text-lime-300 border-lime-500/40"
                        : level.difficulty === "Medium"
                          ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                          : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    }`}
                  >
                    {level.difficulty === "Basic" ? "🌱 Basic" : level.difficulty === "Medium" ? "🚀 Medium" : "🏆 Hard"}
                  </span>
                </div>
                <div className="text-lg font-extrabold text-white">{level.title}</div>
                <div className="text-xs text-slate-300">{level.subtitle}</div>
                <div className="flex items-center justify-between mt-3">
                  <span className="flex gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-5 h-5 ${s <= best ? "fill-amber-400 text-amber-400" : "text-slate-600"}`}
                      />
                    ))}
                  </span>
                  {unlocked ? (
                    <span className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${level.color} text-white text-xs font-extrabold flex items-center gap-1`}>
                      <Play className="w-3.5 h-3.5 fill-current" /> Play!
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Finish {level.difficulty} L{trackLevels.findIndex((l) => l.id === prevInTrack?.id) + 1} first
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900 text-center text-xs text-slate-300">
          💡 <span className="font-bold text-emerald-300">Grown-ups:</span> {grownUpNote ?? "kids earn stars per level — finish one level to unlock the next. Progress auto-saves on this device."}
        </div>
      </div>
    );
  }

  // ── Quiz play screen (uses shuffled options) ──
  const q = shuffledQuestions[qIndex] ?? activeLevel.questions[qIndex];
  const total = shuffledQuestions.length || activeLevel.questions.length;
  const correct = selected === q.correctIndex;
  // Next = next stage inside the SAME track (Basic→Basic, Medium→Medium, Hard→Hard)
  const activeTrack = getTrackLevels(activeLevel.difficulty);
  const activeTrackPos = activeTrack.findIndex((l) => l.id === activeLevel.id) + 1;
  const nextLevel = getNextInTrack(activeLevel);

  if (finished) {
    const finalScore = score;
    const earned = starsForScore(finalScore, total);
    return (
      <div className="max-w-xl mx-auto py-10 text-center space-y-5">
        <div className="text-6xl">{earned >= 2 ? "🎊" : earned === 1 ? "🌟" : "💪"}</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {earned >= 2 ? `${activeLevel.mascot} Amazing work!` : earned === 1 ? "Good trying!" : "Keep practicing!"}
        </h2>
        <div className="flex justify-center gap-1">
          {[1, 2, 3].map((s) => (
            <Star key={s} className={`w-10 h-10 ${s <= earned ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
          ))}
        </div>
        <p className="text-slate-300 text-sm">
          You got <span className="font-extrabold text-emerald-300">{finalScore}</span> out of{" "}
          <span className="font-extrabold text-emerald-300">{total}</span> right!
        </p>
        {earned === 0 && (
          <p className="text-xs text-slate-400">No stars this time — try again, you can do it! 💛</p>
        )}
        {earned >= 1 && nextLevel && (
          <p className="text-xs text-emerald-300 font-bold">
            🎉 {nextLevel.difficulty} Level {activeTrack.findIndex((l) => l.id === nextLevel.id) + 1}: {nextLevel.title} is now unlocked!
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => startLevel(activeLevel)}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" /> Play Again (reshuffles!)
          </button>
          {earned >= 1 && nextLevel && (
            <button
              onClick={() => startLevel(nextLevel)}
              className={`px-5 py-3 rounded-2xl bg-gradient-to-r ${nextLevel.color} text-white font-extrabold text-sm flex items-center justify-center gap-2 transition`}
            >
              Next Level <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={exitLevel}
            className="px-5 py-3 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 font-bold text-sm transition"
          >
            All Levels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={exitLevel}
          className="p-2.5 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-slate-300 border border-emerald-800 transition"
          title="Back to levels"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="text-xs font-extrabold text-slate-400 uppercase">
            {activeLevel.emoji} {activeLevel.difficulty} L{activeTrackPos}/{activeTrack.length} • {activeLevel.title} {activeLevel.mascot}
          </div>
          <div className="text-sm font-extrabold text-white">
            Question {qIndex + 1} of {total} • ⭐ {score}
          </div>
        </div>
        <span className="flex gap-0.5 px-2.5 py-2 rounded-2xl bg-rose-950/60 border border-rose-800" title="Hearts">
          {[1, 2, 3].map((h) => (
            <Heart key={h} className={`w-4 h-4 ${h <= hearts ? "fill-rose-500 text-rose-500" : "text-slate-600"}`} />
          ))}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full h-3 rounded-full bg-emerald-950 border border-emerald-900 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${activeLevel.color} transition-all duration-300`}
          style={{ width: `${((qIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className={`rounded-3xl border-2 ${activeLevel.cardBg} p-5 sm:p-7 text-center space-y-4 shadow-2xl`}>
        <div className="text-5xl">{q.emoji}</div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">{q.question}</h2>
        {q.arabicPrompt && (
          <div className="py-3 px-4 rounded-2xl bg-black/30 border border-white/10">
            <span className="font-arabic text-4xl sm:text-5xl font-bold text-amber-300">{q.arabicPrompt}</span>
          </div>
        )}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => speakEnglish(q.question)}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Volume2 className="w-3.5 h-3.5" /> Hear question 🔊
          </button>
          {q.arabicPrompt && (
            <button
              onClick={() => playLetterPronunciation(q.question, q.arabicPrompt!)}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Volume2 className="w-3.5 h-3.5" /> Hear Arabic 🔊
            </button>
          )}
        </div>
      </div>

      {/* Options — big kid buttons */}
      <div className="space-y-3">
        {q.options.map((opt, idx) => {
          let cls = "bg-[#06241c] border-emerald-800 text-white hover:border-emerald-400 hover:scale-[1.01]";
          if (selected === idx) cls = "bg-emerald-800 border-emerald-300 text-white ring-2 ring-emerald-400/50";
          if (submitted) {
            if (idx === q.correctIndex) cls = "bg-emerald-600 border-emerald-300 text-white ring-2 ring-emerald-300 scale-[1.01]";
            else if (selected === idx) cls = "bg-rose-900 border-rose-400 text-white";
            else cls = "bg-[#06241c] border-emerald-950 text-slate-500 opacity-70";
          }
          return (
            <button
              key={idx}
              onClick={() => !submitted && setSelected(idx)}
              disabled={submitted}
              className={`w-full p-4 sm:p-5 rounded-3xl border-2 text-left text-base sm:text-lg font-extrabold transition flex items-center justify-between gap-2 ${cls}`}
            >
              <span>
                <span className="inline-flex w-8 h-8 rounded-full bg-white/15 items-center justify-center mr-2 text-sm">
                  {["A", "B", "C"][idx]}
                </span>
                {opt}
              </span>
              {submitted && idx === q.correctIndex && <CheckCircle2 className="w-6 h-6 text-white shrink-0" />}
              {submitted && selected === idx && idx !== q.correctIndex && <XCircle className="w-6 h-6 text-white shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {submitted && (
        <div
          className={`p-4 rounded-3xl border-2 text-sm leading-relaxed ${
            correct ? "bg-emerald-900/60 border-emerald-400 text-emerald-100" : "bg-amber-900/40 border-amber-400/60 text-amber-100"
          }`}
        >
          <div className="font-extrabold text-base mb-1 flex items-center gap-1.5">
            {correct ? (
              <>
                <PartyPopper className="w-5 h-5" /> {q.praise}
              </>
            ) : (
              <>💡 Good try! The answer is “{q.options[q.correctIndex]}”</>
            )}
          </div>
          <div className="flex gap-1.5">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <span className="font-bold">Fun fact: </span>
              {q.funFact}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end">
        {!submitted ? (
          <button
            onClick={submitAnswer}
            disabled={selected === null}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-extrabold text-sm transition"
          >
            Check Answer ✅
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${activeLevel.color} text-white font-extrabold text-sm flex items-center gap-2 transition`}
          >
            {qIndex < total - 1 ? (
              <>
                Next Question <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                See My Stars! <Trophy className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
