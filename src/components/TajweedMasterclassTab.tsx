"use client";

import React, { useState } from "react";
import { Sparkles, Award, Volume2, Info, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";
import { TAJWEED_RULES, TajweedRule } from "@/data/tajweedRulesData";

interface TajweedMasterclassTabProps {
  onOpenQuiz: (quizKey: string, levelNum: number, levelTitle: string, badgeName: string) => void;
  onOpenQuranAtSurah: (surahNumber: number, ayahNumber?: number) => void;
}

export function TajweedMasterclassTab({
  onOpenQuiz,
  onOpenQuranAtSurah,
}: TajweedMasterclassTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Ghunnah",
    "Qalqalah (Echo)",
    "Noon & Tanween",
    "Madd (Elongations)",
    "Tafkheem & Tarqeeq",
  ];

  const filteredRules =
    selectedCategory === "All"
      ? TAJWEED_RULES
      : TAJWEED_RULES.filter((r) => r.category === selectedCategory || (selectedCategory === "Noon & Tanween" && r.category === "Noon & Tanween"));

  return (
    <div className="space-y-8 pb-20">
      {/* Tajweed Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-950/80 via-[#062920] to-[#041a14] border border-amber-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Sacred Recitation Science
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tajweed Rules Masterclass
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Tajweed means to beautify, refine, and recite the Quran exactly as revealed to Prophet Muhammad ﷺ. Explore our color-coded visual guide, duration counts, articulation mechanics, and live Quranic examples.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onOpenQuiz("quiz_level_3", 3, "Level 3: Tajweed Masterclass", "Tajweed Virtuoso")}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
            >
              <Award className="w-4 h-4" /> Start Tajweed Certification Quiz (+150 XP)
            </button>
          </div>
        </div>
      </div>

      {/* Color Code Legend Card */}
      <div className="p-5 rounded-2xl bg-[#06241c] border border-emerald-500/30 space-y-3">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-4 h-4" /> Official Noor Quran Color Code Legend
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center">
            <div className="w-4 h-4 rounded-full bg-emerald-400 mx-auto mb-1" />
            <div className="font-bold text-emerald-300">Ghunnah</div>
            <div className="text-[10px] text-slate-400">2 Counts Nasal</div>
          </div>

          <div className="p-2.5 rounded-xl bg-sky-950/60 border border-sky-500/40 text-center">
            <div className="w-4 h-4 rounded-full bg-sky-400 mx-auto mb-1" />
            <div className="font-bold text-sky-300">Qalqalah</div>
            <div className="text-[10px] text-slate-400">Echo Bounce</div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-center">
            <div className="w-4 h-4 rounded-full bg-amber-400 mx-auto mb-1" />
            <div className="font-bold text-amber-300">Izhar</div>
            <div className="text-[10px] text-slate-400">Throat Clarity</div>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-center">
            <div className="w-4 h-4 rounded-full bg-purple-400 mx-auto mb-1" />
            <div className="font-bold text-purple-300">Idgham</div>
            <div className="text-[10px] text-slate-400">Merging Blend</div>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-center">
            <div className="w-4 h-4 rounded-full bg-rose-400 mx-auto mb-1" />
            <div className="font-bold text-rose-300">Iqlab</div>
            <div className="text-[10px] text-slate-400">Convert to Meem</div>
          </div>

          <div className="p-2.5 rounded-xl bg-teal-950/60 border border-teal-500/40 text-center">
            <div className="w-4 h-4 rounded-full bg-teal-400 mx-auto mb-1" />
            <div className="font-bold text-teal-300">Ikhfa</div>
            <div className="text-[10px] text-slate-400">Concealment</div>
          </div>

          <div className="p-2.5 rounded-xl bg-pink-950/60 border border-pink-500/40 text-center">
            <div className="w-4 h-4 rounded-full bg-pink-400 mx-auto mb-1" />
            <div className="font-bold text-pink-300">Madd Lazim</div>
            <div className="text-[10px] text-slate-400">4-6 Counts</div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
              selectedCategory === cat
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "bg-emerald-950/50 text-slate-300 hover:text-white border border-emerald-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tajweed Rules List */}
      <div className="space-y-6">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="p-6 rounded-3xl bg-[#06241c] border border-emerald-500/30 space-y-5 shadow-xl"
          >
            {/* Rule Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-900/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-900 text-emerald-300 font-bold">
                    {rule.category}
                  </span>
                  {rule.durationCounts && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      Duration: {rule.durationCounts}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-center gap-2">
                  {rule.name}
                  <span className="font-arabic text-amber-300 text-2xl font-bold">{rule.arabicName}</span>
                </h3>
              </div>

              {/* Target Letters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-400 mr-1">Letters:</span>
                {rule.letters.map((ltr, i) => (
                  <span
                    key={i}
                    className="font-arabic text-lg font-bold px-2 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800"
                  >
                    {ltr}
                  </span>
                ))}
              </div>
            </div>

            {/* Rule Explanation */}
            <div className="space-y-2 text-xs sm:text-sm text-slate-200">
              <p className="leading-relaxed">{rule.definition}</p>
              <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-slate-300 leading-relaxed">
                <span className="font-bold text-emerald-400 block mb-0.5">How to apply in Recitation:</span>
                {rule.ruleExplanation}
              </div>
            </div>

            {/* Live Quranic Examples */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Quranic Practice Examples:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {rule.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-[#041a14] border border-emerald-900/80 space-y-2 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-emerald-400">{ex.surahRef}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-amber-300 border border-emerald-800">
                        {ex.highlightWord}
                      </span>
                    </div>

                    <p className="font-arabic text-2xl text-right text-emerald-100 py-1" dir="rtl">
                      {ex.arabic}
                    </p>

                    <div className="space-y-1 text-xs">
                      <p className="text-slate-300 italic">{ex.transliteration}</p>
                      <p className="text-[11px] text-emerald-400/90">{ex.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistakes Warning */}
            {rule.commonMistakes && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-300">Common Recitation Mistake to Avoid: </span>
                  {rule.commonMistakes}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
