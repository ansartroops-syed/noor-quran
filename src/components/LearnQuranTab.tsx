"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
  Play,
  Volume2,
  ArrowRight,
  BookOpen,
  Mic,
  ChevronRight,
  HelpCircle,
  Eye,
  Loader2,
} from "lucide-react";
import { CURRICULUM_LEVELS, CurriculumLevel } from "@/data/progressiveLevelsData";
import { QAIDA_LETTERS, QaidaLetter } from "@/data/qaidaLetters";
import { HARAKAT_LESSONS, HarakatLesson } from "@/data/harakatData";
import { TAJWEED_RULES, TajweedRule } from "@/data/tajweedRulesData";
import { playLetterPronunciation, playHarmonicChime } from "@/lib/audioEngine";

interface LearnQuranTabProps {
  currentLevel: number;
  completedLessons: string[];
  earnedBadges: string[];
  onOpenQuiz: (quizKey: string, levelNum: number, levelTitle: string, badgeName: string) => void;
  onOpenCertificate: (levelNum: number, levelTitle: string, badgeName: string) => void;
  onSelectSurahForPractice: (surahNumber: number) => void;
  onOpenVoiceRecorder: (surahNumber: number, ayahNumber: number) => void;
}

export function LearnQuranTab({
  currentLevel,
  completedLessons,
  earnedBadges,
  onOpenQuiz,
  onOpenCertificate,
  onSelectSurahForPractice,
  onOpenVoiceRecorder,
}: LearnQuranTabProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<string>("level_1_qaida");
  const [selectedLetter, setSelectedLetter] = useState<QaidaLetter>(QAIDA_LETTERS[0]);
  const [letterPositionMode, setLetterPositionMode] = useState<"isolated" | "initial" | "medial" | "final">("isolated");
  const [selectedHarakat, setSelectedHarakat] = useState<HarakatLesson>(HARAKAT_LESSONS[0]);
  const [selectedTajweed, setSelectedTajweed] = useState<TajweedRule>(TAJWEED_RULES[0]);
  const [isAutoPlayingAlphabet, setIsAutoPlayingAlphabet] = useState(false);

  const activeLevel = CURRICULUM_LEVELS.find((l) => l.id === selectedLevelId) || CURRICULUM_LEVELS[0];

  const handleLetterClick = (letter: QaidaLetter) => {
    setSelectedLetter(letter);
    playLetterPronunciation(letter.id, letter.letter);
  };

  const handleAutoPlayAllLetters = async () => {
    if (isAutoPlayingAlphabet) return;
    setIsAutoPlayingAlphabet(true);

    for (let i = 0; i < QAIDA_LETTERS.length; i++) {
      const ltr = QAIDA_LETTERS[i];
      setSelectedLetter(ltr);
      await playLetterPronunciation(ltr.id, ltr.letter);
      await new Promise((r) => setTimeout(r, 900));
    }

    setIsAutoPlayingAlphabet(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/90 via-[#063327] to-[#031d16] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Structured Quranic Learning Pathway
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Learn Quran from Basics to Mastery
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Follow a proven, gamified curriculum: start with the Noorani Qaida Arabic alphabet and Makharij, master Harakat & Tajweed rules, understand essential Quranic vocabulary, and complete full recitation of all 114 Surahs.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const quizKey = `quiz_level_${activeLevel.levelNumber}`;
                onOpenQuiz(quizKey, activeLevel.levelNumber, activeLevel.title, activeLevel.badgeName);
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
            >
              <Award className="w-4 h-4" /> Take Level {activeLevel.levelNumber} Exam
            </button>
            <button
              onClick={() => onOpenCertificate(activeLevel.levelNumber, activeLevel.title, activeLevel.badgeName)}
              className="px-4 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/40 font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" /> View Level Certificate
            </button>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none">
          <span className="font-arabic text-[180px] text-emerald-300 leading-none">قرآن</span>
        </div>
      </div>

      {/* 6-Level Pathway Horizontal Stepper */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            Curriculum Stages (Levels 1 to 6)
          </h2>
          <span className="text-xs text-emerald-400 font-medium">
            Active: Level {activeLevel.levelNumber} of 6
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {CURRICULUM_LEVELS.map((level) => {
            const isSelected = selectedLevelId === level.id;
            const isUnlocked = currentLevel >= level.levelNumber;
            const isCompleted = currentLevel > level.levelNumber;

            let cardStyle = "bg-[#06241c] border-emerald-900/60 text-slate-300 hover:border-emerald-600";
            if (isSelected) {
              cardStyle = "bg-emerald-900/60 border-emerald-400 text-white ring-2 ring-emerald-500/30";
            }

            return (
              <button
                key={level.id}
                onClick={() => setSelectedLevelId(level.id)}
                className={`p-3.5 rounded-2xl border text-left transition relative flex flex-col justify-between group ${cardStyle}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{level.badgeIcon}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isUnlocked ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      Open
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-emerald-400 uppercase">
                    Level {level.levelNumber}
                  </div>
                  <div className="text-xs font-semibold text-white line-clamp-1 group-hover:text-emerald-300">
                    {level.badgeName}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    +{level.xpReward} XP • {level.totalLessons} Lessons
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Content Workspace */}
      <div className="rounded-3xl border border-emerald-500/30 bg-[#06241c]/90 p-5 sm:p-8 space-y-8 shadow-xl">
        {/* Stage Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeLevel.badgeIcon}</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">{activeLevel.title}</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">{activeLevel.description}</p>
          </div>
          <button
            onClick={() => {
              const quizKey = `quiz_level_${activeLevel.levelNumber}`;
              onOpenQuiz(quizKey, activeLevel.levelNumber, activeLevel.title, activeLevel.badgeName);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Level Quiz Test
          </button>
        </div>

        {/* LEVEL 1: NOORANI QAIDA ARABIC ALPHABET INTERACTIVE EXPLORER */}
        {activeLevel.levelNumber === 1 && (
          <div className="space-y-6">
            {/* Letter Form Position Filter & Auto-Play */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#041a14] p-3.5 rounded-2xl border border-emerald-900">
              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> Position Form:
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-950 p-1 rounded-xl">
                  {(["isolated", "initial", "medial", "final"] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setLetterPositionMode(pos)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                        letterPositionMode === pos
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Play All 28 Letters */}
              <button
                onClick={handleAutoPlayAllLetters}
                disabled={isAutoPlayingAlphabet}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition shrink-0"
              >
                {isAutoPlayingAlphabet ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Reciting Alphabet...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" /> Listen to All 28 Letters
                  </>
                )}
              </button>
            </div>

            {/* Letter Cards Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
              {QAIDA_LETTERS.map((letter) => {
                const isSelected = selectedLetter.id === letter.id;
                const displayChar =
                  letterPositionMode === "initial"
                    ? letter.initial
                    : letterPositionMode === "medial"
                    ? letter.medial
                    : letterPositionMode === "final"
                    ? letter.final
                    : letter.isolated;

                return (
                  <button
                    key={letter.id}
                    onClick={() => handleLetterClick(letter)}
                    className={`p-3 rounded-2xl border transition flex flex-col items-center justify-center gap-1 group relative ${
                      isSelected
                        ? "bg-emerald-800/80 border-amber-400 ring-2 ring-amber-400/40 text-amber-200 shadow-lg"
                        : "bg-emerald-950/50 border-emerald-900/60 hover:border-emerald-500 hover:bg-emerald-900/40 text-slate-200"
                    }`}
                  >
                    <span className="font-arabic text-3xl sm:text-4xl font-bold group-hover:scale-110 transition">
                      {displayChar}
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

            {/* Selected Letter Deep-Dive & Makhraj Anatomy Guide */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-emerald-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-arabic text-4xl font-bold text-white shadow-lg">
                    {selectedLetter.isolated}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      {selectedLetter.name} ({selectedLetter.transliteration})
                    </h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      Makhraj: {selectedLetter.makhrajGroup}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => playLetterPronunciation(selectedLetter.id, selectedLetter.letter)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
                >
                  <Volume2 className="w-4 h-4" /> Listen Audio ({selectedLetter.name})
                </button>
              </div>

              {/* Makhraj Explanation & Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 space-y-1.5">
                  <span className="font-bold text-emerald-300">Point of Articulation (Makhraj):</span>
                  <p className="text-slate-300 leading-relaxed">{selectedLetter.makhrajDetail}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 space-y-1.5">
                  <span className="font-bold text-amber-300">Phonetics & Tajweed Tip:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedLetter.tips}</p>
                </div>
              </div>

              {/* Letter Forms Row */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  The 4 Position Shapes:
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <button
                    onClick={() => playLetterPronunciation(selectedLetter.id, selectedLetter.isolated)}
                    className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900 hover:border-emerald-600 transition"
                  >
                    <span className="font-arabic text-2xl text-amber-300 block">{selectedLetter.isolated}</span>
                    <span className="text-slate-400 text-[10px]">Isolated 🔊</span>
                  </button>
                  <button
                    onClick={() => playLetterPronunciation(selectedLetter.id, selectedLetter.initial)}
                    className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900 hover:border-emerald-600 transition"
                  >
                    <span className="font-arabic text-2xl text-amber-300 block">{selectedLetter.initial}</span>
                    <span className="text-slate-400 text-[10px]">Initial 🔊</span>
                  </button>
                  <button
                    onClick={() => playLetterPronunciation(selectedLetter.id, selectedLetter.medial)}
                    className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900 hover:border-emerald-600 transition"
                  >
                    <span className="font-arabic text-2xl text-amber-300 block">{selectedLetter.medial}</span>
                    <span className="text-slate-400 text-[10px]">Medial 🔊</span>
                  </button>
                  <button
                    onClick={() => playLetterPronunciation(selectedLetter.id, selectedLetter.final)}
                    className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900 hover:border-emerald-600 transition"
                  >
                    <span className="font-arabic text-2xl text-amber-300 block">{selectedLetter.final}</span>
                    <span className="text-slate-400 text-[10px]">Final 🔊</span>
                  </button>
                </div>
              </div>

              {/* Example Words */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Example Words in the Quran (Click to Listen):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {selectedLetter.examples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => playLetterPronunciation(ex.transliteration, ex.word)}
                      className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 hover:border-emerald-500 hover:bg-emerald-900/50 transition flex items-center justify-between text-left group"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-emerald-300 flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-emerald-400" /> {ex.transliteration}
                        </div>
                        <div className="text-[11px] text-slate-400">{ex.meaning} ({ex.position})</div>
                      </div>
                      <span className="font-arabic text-2xl text-emerald-300">{ex.word}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEVEL 2: HARAKAT & VOWELS DRILLS */}
        {activeLevel.levelNumber === 2 && (
          <div className="space-y-6">
            {/* Harakat Subtabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {HARAKAT_LESSONS.map((harakat) => {
                const isSelected = selectedHarakat.id === harakat.id;
                return (
                  <button
                    key={harakat.id}
                    onClick={() => {
                      setSelectedHarakat(harakat);
                      playHarmonicChime(500);
                    }}
                    className={`p-3 rounded-xl border text-center transition ${
                      isSelected
                        ? "bg-blue-900/60 border-blue-400 text-white ring-2 ring-blue-400/30 font-bold"
                        : "bg-emerald-950/40 border-emerald-900 text-slate-300 hover:border-emerald-600"
                    }`}
                  >
                    <span className="font-arabic text-2xl text-amber-300 block">{harakat.symbol}</span>
                    <span className="text-xs truncate block">{harakat.title.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Harakat Lesson View */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-blue-500/30 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedHarakat.title}
                    <span className="font-arabic text-emerald-400 text-2xl">{selectedHarakat.arabicName}</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">{selectedHarakat.description}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-950/70 border border-blue-600/40 text-blue-200 text-xs font-semibold">
                  Rule: {selectedHarakat.soundRule}
                </div>
              </div>

              {/* Syllable sound grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Syllable Sound Drills (Click to Listen):
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {selectedHarakat.examples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => playLetterPronunciation(ex.audioText, ex.arabic)}
                      className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-900 hover:border-blue-400 hover:bg-blue-950/50 transition flex flex-col items-center justify-center gap-1 group"
                    >
                      <span className="font-arabic text-3xl font-bold text-blue-300 group-hover:scale-110 transition">
                        {ex.arabic}
                      </span>
                      <span className="text-xs font-semibold text-white">{ex.transliteration}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <Volume2 className="w-2.5 h-2.5 text-blue-400" /> {ex.englishHint}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Connecting practice words */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Full Word Practice Breakdown (Click to Listen):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedHarakat.practiceWords.map((pw, i) => (
                    <button
                      key={i}
                      onClick={() => playLetterPronunciation(pw.transliteration, pw.word)}
                      className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900 hover:border-blue-500 hover:bg-blue-950/40 transition flex items-center justify-between text-left group"
                    >
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-blue-300 flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-blue-400" /> {pw.transliteration}
                        </div>
                        <div className="text-xs text-slate-400">{pw.meaning}</div>
                        <div className="text-[10px] text-blue-300 mt-0.5">Syllables: {pw.breakdown}</div>
                      </div>
                      <span className="font-arabic text-3xl text-amber-300">{pw.word}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEVEL 3: TAJWEED MASTERCLASS */}
        {activeLevel.levelNumber === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {TAJWEED_RULES.map((rule) => {
                const isSelected = selectedTajweed.id === rule.id;
                return (
                  <button
                    key={rule.id}
                    onClick={() => {
                      setSelectedTajweed(rule);
                      playHarmonicChime(540);
                    }}
                    className={`p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? "bg-amber-950/80 border-amber-400 text-white ring-2 ring-amber-400/30"
                        : "bg-emerald-950/40 border-emerald-900 text-slate-300 hover:border-emerald-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300 font-bold">
                        {rule.category}
                      </span>
                      <span className="font-arabic text-base text-amber-300">{rule.arabicName}</span>
                    </div>
                    <div className="text-xs font-bold text-white mt-1.5">{rule.name}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Tajweed Detail Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#041a14] border border-amber-500/30 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedTajweed.name}
                    <span className="font-arabic text-amber-400 text-2xl">{selectedTajweed.arabicName}</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">{selectedTajweed.definition}</p>
                </div>
                {selectedTajweed.durationCounts && (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold shrink-0">
                    Duration: {selectedTajweed.durationCounts}
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-slate-200 leading-relaxed">
                <span className="font-bold text-emerald-300 block mb-1">Tajweed Rule Guide:</span>
                {selectedTajweed.ruleExplanation}
              </div>

              {/* Live Quranic Examples */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Quranic Examples with Color Highlighting (Click to Listen):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedTajweed.examples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => playLetterPronunciation(ex.transliteration, ex.arabic)}
                      className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-900 hover:border-amber-500 hover:bg-emerald-900/40 transition space-y-2 text-left group"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold text-emerald-300">{ex.surahRef}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 text-amber-300 border border-emerald-800">
                          {ex.highlightWord}
                        </span>
                      </div>
                      <p className="font-arabic text-2xl text-right text-emerald-100 group-hover:text-amber-200" dir="rtl">
                        {ex.arabic}
                      </p>
                      <p className="text-xs text-slate-300 italic">{ex.transliteration}</p>
                      <p className="text-xs text-emerald-400/90">{ex.explanation}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEVEL 4: QURANIC VOCABULARY */}
        {activeLevel.levelNumber === 4 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center mx-auto text-2xl">
              📖
            </div>
            <h4 className="text-xl font-bold text-white">Understand 80% of Quranic Words</h4>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Open the dedicated Vocabulary Flashcard deck to practice top high-frequency Quran words with spaced repetition, root analysis, and audio pronunciation.
            </p>
            <button
              onClick={() => {
                const quizKey = `quiz_level_4`;
                onOpenQuiz(quizKey, 4, "Level 4: Quranic Vocabulary", "Vocabulary Master");
              }}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg transition"
            >
              Start Level 4 Vocabulary Test
            </button>
          </div>
        )}

        {/* LEVEL 5: PROGRESSIVE SHORT SURAHS */}
        {activeLevel.levelNumber === 5 && (
          <div className="space-y-4">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Essential Daily Surahs (Juz Amma Practice):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { number: 1, name: "Al-Fatihah", ar: "الفاتحة", verses: 7, desc: "The Mother of the Book" },
                { number: 112, name: "Al-Ikhlas", ar: "الإخلاص", verses: 4, desc: "Equal to 1/3 of the Quran" },
                { number: 113, name: "Al-Falaq", ar: "الفلق", verses: 5, desc: "Protection against evil" },
                { number: 114, name: "An-Nas", ar: "الناس", verses: 6, desc: "Refuge against whisperings" },
                { number: 108, name: "Al-Kawthar", ar: "الكوثر", verses: 3, desc: "Abundance & gratitude" },
                { number: 103, name: "Al-'Asr", ar: "العصر", verses: 3, desc: "Preservation of time" },
              ].map((s) => (
                <div
                  key={s.number}
                  className="p-4 rounded-2xl bg-[#041a14] border border-emerald-900/80 hover:border-teal-500 transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-teal-900/60 text-teal-300 flex items-center justify-center font-bold text-xs">
                      {s.number}
                    </span>
                    <span className="font-arabic text-2xl text-emerald-300">{s.ar}</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-base">Surah {s.name}</h5>
                    <p className="text-xs text-slate-400">{s.desc} • {s.verses} Ayahs</p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectSurahForPractice(s.number)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Read & Listen
                    </button>
                    <button
                      onClick={() => onOpenVoiceRecorder(s.number, 1)}
                      className="p-2 rounded-xl bg-teal-800/60 hover:bg-teal-700 text-teal-200 border border-teal-500/30 transition"
                      title="Practice Recording Voice"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEVEL 6: COMPLETE QURAN RECITATION */}
        {activeLevel.levelNumber === 6 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center mx-auto text-3xl">
              👑
            </div>
            <h4 className="text-2xl font-bold text-white">Full Quran Reciter & Hifz Master</h4>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              You are ready to navigate the entire 114 Surahs and 30 Juz with verse-by-verse Qari audio sync, translation, transliteration, and repeat looping!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onSelectSurahForPractice(1)}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Open Full Quran Reader (114 Surahs)
              </button>
              <button
                onClick={() => onOpenCertificate(6, "Grand Quranic Learning Master", "Quran Champion")}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg transition flex items-center gap-2"
              >
                <Award className="w-4 h-4" /> Grand Graduation Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
