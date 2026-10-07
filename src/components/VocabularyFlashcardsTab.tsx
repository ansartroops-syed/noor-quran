"use client";

import React, { useState } from "react";
import {
  Layers,
  RotateCw,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { QURANIC_WORDS, QuranWord } from "@/data/quranicWordsData";
import { playLetterPronunciation, playHarmonicChime } from "@/lib/audioEngine";

interface VocabularyFlashcardsTabProps {
  onAddXp?: (amount: number) => void;
  onOpenQuiz?: () => void;
}

export function VocabularyFlashcardsTab({ onAddXp, onOpenQuiz }: VocabularyFlashcardsTabProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [masteredWords, setMasteredWords] = useState<Record<string, boolean>>({});

  const categories = [
    "All",
    "Divine Names & Faith",
    "High-Frequency Verbs",
    "Prepositions & Particles",
    "Hereafter & Cosmos",
    "People & Guidance",
  ];

  const filteredWords =
    selectedCategory === "All"
      ? QURANIC_WORDS
      : QURANIC_WORDS.filter((w) => w.category === selectedCategory);

  const currentWord = filteredWords[currentIndex] || filteredWords[0];
  const isCurrentMastered = Boolean(masteredWords[currentWord?.id]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredWords.length - 1);
    }
  };

  const handleMarkMastered = () => {
    setMasteredWords((prev) => ({ ...prev, [currentWord.id]: true }));
    playHarmonicChime(520);
    if (onAddXp) onAddXp(20);
    handleNext();
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentWord) {
      playLetterPronunciation(currentWord.transliteration, currentWord.arabic);
    }
  };

  const masteredCount = Object.keys(masteredWords).length;
  const progressPercent = Math.round((masteredCount / QURANIC_WORDS.length) * 100);

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-purple-950/80 via-[#06241c] to-[#041a14] border border-purple-500/30 p-6 sm:p-8 shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
          <Layers className="w-3.5 h-3.5" /> High-Yield Quranic Vocabulary
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Top 100+ Quranic Vocabulary Flashcards
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          These essential high-frequency words account for roughly 80% of all vocabulary in the Holy Quran! Flip cards, listen to phonetics, review roots, and see live Ayah contexts.
        </p>

        {/* Progress Bar */}
        <div className="pt-2 max-w-md space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Vocabulary Mastery</span>
            <span className="font-bold text-purple-300">{masteredCount} / {QURANIC_WORDS.length} Words ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-purple-950 border border-purple-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
              selectedCategory === cat
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "bg-emerald-950/50 text-slate-300 hover:text-white border border-emerald-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Flashcard Area */}
      {currentWord && (
        <div className="max-w-xl mx-auto space-y-5">
          {/* Flip Container */}
          <div
            onClick={handleFlip}
            className="cursor-pointer min-h-[340px] rounded-3xl bg-gradient-to-br from-[#062e24] via-[#05261d] to-[#031d16] border-2 border-purple-500/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {/* Card Top */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 font-bold border border-purple-800">
                {currentWord.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-amber-300 font-semibold">
                  Occurs ~{currentWord.frequency}x in Quran
                </span>
                <span className="text-slate-500">
                  {currentIndex + 1} / {filteredWords.length}
                </span>
              </div>
            </div>

            {/* Card Center (Front vs Back) */}
            {!isFlipped ? (
              /* FRONT OF CARD */
              <div className="text-center py-8 space-y-4">
                <p className="font-arabic text-5xl sm:text-6xl font-bold text-amber-300 py-2">
                  {currentWord.arabic}
                </p>
                <button
                  onClick={handlePlayAudio}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold border border-emerald-800 transition"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Pronounce
                </button>
                <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-3">
                  <RotateCw className="w-3.5 h-3.5 text-purple-400" /> Tap card to reveal English meaning & Ayah context
                </p>
              </div>
            ) : (
              /* BACK OF CARD */
              <div className="text-center py-4 space-y-3 animate-in fade-in">
                <div className="space-y-1">
                  <span className="font-arabic text-3xl text-amber-300 font-bold">{currentWord.arabic}</span>
                  <p className="text-xs text-emerald-400 font-semibold">{currentWord.transliteration}</p>
                  <h3 className="text-2xl font-bold text-white">{currentWord.english}</h3>
                  {currentWord.root && currentWord.root !== "-" && (
                    <span className="inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-purple-900/50 text-purple-200 border border-purple-700/50">
                      Arabic Root: {currentWord.root}
                    </span>
                  )}
                </div>

                {/* Example Ayah */}
                <div className="p-3.5 rounded-2xl bg-[#041a14] border border-emerald-900 text-left space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Context in {currentWord.exampleSurahRef}:
                  </span>
                  <p className="font-arabic text-lg text-right text-emerald-200" dir="rtl">
                    {currentWord.exampleAyahArabic}
                  </p>
                  <p className="text-slate-300 italic text-[11px]">{currentWord.exampleAyahTranslation}</p>
                </div>
              </div>
            )}

            {/* Card Footer */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-emerald-900/60">
              <span className="text-[11px]">Click anywhere to flip</span>
              {isCurrentMastered ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                </span>
              ) : (
                <span className="text-slate-500">In Progress</span>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              className="p-3 rounded-2xl bg-emerald-950/70 hover:bg-emerald-900 text-slate-300 hover:text-white border border-emerald-900 transition"
              title="Previous Word"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={handleNext}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm border border-emerald-900 transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Practice Later
              </button>

              <button
                onClick={handleMarkMastered}
                className="flex-1 py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/30"
              >
                <CheckCircle2 className="w-4 h-4" /> I Mastered This (+20 XP)
              </button>
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-2xl bg-emerald-950/70 hover:bg-emerald-900 text-slate-300 hover:text-white border border-emerald-900 transition"
              title="Next Word"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
