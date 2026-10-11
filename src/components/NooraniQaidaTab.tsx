"use client";

import React, { useState } from "react";
import { BookOpenText, Volume2, Loader2, Sparkles, Eye } from "lucide-react";
import { QAIDA_LETTERS, QaidaLetter } from "@/data/qaidaLetters";
import { HARAKAT_LESSONS, HarakatLesson } from "@/data/harakatData";
import { playLetterPronunciation } from "@/lib/audioEngine";

const JOINING_WORDS = [
  { word: "بِسْمِ", transliteration: "Bismi", meaning: "In the name" },
  { word: "اللَّهِ", transliteration: "Allahi", meaning: "of Allah" },
  { word: "الرَّحْمَٰنِ", transliteration: "Ar-Rahman", meaning: "the Most Gracious" },
  { word: "الرَّحِيمِ", transliteration: "Ar-Raheem", meaning: "the Most Merciful" },
  { word: "الْحَمْدُ", transliteration: "Al-hamdu", meaning: "All praise" },
  { word: "رَبِّ", transliteration: "Rabbi", meaning: "Lord" },
  { word: "قُلْ", transliteration: "Qul", meaning: "Say" },
  { word: "هُوَ", transliteration: "Huwa", meaning: "He" },
  { word: "أَحَدٌ", transliteration: "Ahad", meaning: "One" },
  { word: "نُور", transliteration: "Noor", meaning: "Light" },
  { word: "كِتَاب", transliteration: "Kitab", meaning: "Book" },
  { word: "قُرْآن", transliteration: "Qur'an", meaning: "Quran" },
];

type QaidaSection = "letters" | "forms" | "harakat" | "joining";

export function NooraniQaidaTab() {
  const [section, setSection] = useState<QaidaSection>("letters");
  const [selectedLetter, setSelectedLetter] = useState<QaidaLetter>(QAIDA_LETTERS[0]);
  const [formMode, setFormMode] = useState<"isolated" | "initial" | "medial" | "final">("isolated");
  const [selectedHarakat, setSelectedHarakat] = useState<HarakatLesson>(HARAKAT_LESSONS[0]);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  const playAllLetters = async () => {
    if (isPlayingAll) return;
    setIsPlayingAll(true);
    for (const letter of QAIDA_LETTERS) {
      setSelectedLetter(letter);
      await playLetterPronunciation(letter.id, letter.letter);
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
    setIsPlayingAll(false);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/80 via-[#063327] to-[#031d16] p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30">
          <BookOpenText className="w-3.5 h-3.5" /> Noorani Qaida
        </div>
        <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold text-white">Noorani Qaida</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Learn to read Arabic from the beginning: the 28 letters, their shapes, vowels, and how letters join into Quran words. Tap any letter or word to hear it.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: "letters", label: "1. Alphabet" },
          { id: "forms", label: "2. Letter Shapes" },
          { id: "harakat", label: "3. Vowels" },
          { id: "joining", label: "4. Joining Words" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSection(item.id as QaidaSection)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold ${
              section === item.id
                ? "bg-emerald-600 text-white"
                : "bg-emerald-950/60 text-slate-300 border border-emerald-900"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {section === "letters" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={playAllLetters}
              disabled={isPlayingAll}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-60"
            >
              {isPlayingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
              {isPlayingAll ? "Reciting..." : "Listen to all 28 letters"}
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {QAIDA_LETTERS.map((letter) => (
              <button
                key={letter.id}
                onClick={() => {
                  setSelectedLetter(letter);
                  playLetterPronunciation(letter.id, letter.letter);
                }}
                className={`p-3 rounded-2xl border text-center ${
                  selectedLetter.id === letter.id
                    ? "bg-emerald-800 border-amber-400 text-amber-200"
                    : "bg-emerald-950/40 border-emerald-900 text-slate-200"
                }`}
              >
                <span className="font-arabic text-3xl block">{letter.isolated}</span>
                <span className="text-[11px]">{letter.name}</span>
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-emerald-800 bg-[#041a14] p-5 space-y-2">
            <h2 className="text-xl font-bold text-white">
              {selectedLetter.name} <span className="font-arabic text-amber-300">{selectedLetter.isolated}</span>
            </h2>
            <p className="text-sm text-emerald-300">{selectedLetter.makhrajGroup}</p>
            <p className="text-sm text-slate-300">{selectedLetter.makhrajDetail}</p>
            <p className="text-sm text-amber-200">{selectedLetter.tips}</p>
          </div>
        </div>
      )}

      {section === "forms" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-emerald-300">
            <Eye className="w-4 h-4" /> Choose a shape, then tap a letter to hear it.
          </div>
          <div className="flex gap-2">
            {(["isolated", "initial", "medial", "final"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFormMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize ${
                  formMode === mode ? "bg-emerald-600 text-white" : "bg-emerald-950 text-slate-300"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {QAIDA_LETTERS.map((letter) => {
              const shape =
                formMode === "initial"
                  ? letter.initial
                  : formMode === "medial"
                  ? letter.medial
                  : formMode === "final"
                  ? letter.final
                  : letter.isolated;
              return (
                <button
                  key={letter.id}
                  onClick={() => playLetterPronunciation(letter.id, letter.letter)}
                  className="p-3 rounded-2xl border border-emerald-900 bg-emerald-950/40 text-center"
                >
                  <span className="font-arabic text-3xl text-amber-300 block">{shape}</span>
                  <span className="text-[11px] text-slate-300">{letter.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {section === "harakat" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {HARAKAT_LESSONS.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedHarakat(lesson)}
                className={`p-3 rounded-xl border text-center ${
                  selectedHarakat.id === lesson.id
                    ? "bg-blue-900/70 border-blue-400 text-white"
                    : "bg-emerald-950/40 border-emerald-900 text-slate-300"
                }`}
              >
                <span className="font-arabic text-2xl text-amber-300 block">{lesson.symbol}</span>
                <span className="text-xs">{lesson.title.split(" ")[0]}</span>
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-blue-500/30 bg-[#041a14] p-5 space-y-4">
            <h2 className="text-xl font-bold text-white">{selectedHarakat.title}</h2>
            <p className="text-sm text-slate-300">{selectedHarakat.description}</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {selectedHarakat.examples.map((example) => (
                <button
                  key={example.arabic}
                  onClick={() => playLetterPronunciation(example.audioText, example.arabic)}
                  className="p-3 rounded-xl border border-emerald-900 bg-emerald-950/50"
                >
                  <span className="font-arabic text-3xl text-blue-300 block">{example.arabic}</span>
                  <span className="text-xs text-white">{example.transliteration}</span>
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {selectedHarakat.practiceWords.map((word) => (
                <button
                  key={word.word}
                  onClick={() => playLetterPronunciation(word.transliteration, word.word)}
                  className="p-3 rounded-xl border border-emerald-900 flex items-center justify-between text-left"
                >
                  <span>
                    <span className="block text-sm font-semibold text-white">{word.transliteration}</span>
                    <span className="text-xs text-slate-400">{word.meaning}</span>
                  </span>
                  <span className="font-arabic text-3xl text-amber-300">{word.word}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === "joining" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Practice reading joined Quran words. Tap a card to hear the word.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {JOINING_WORDS.map((item) => (
              <button
                key={item.word}
                onClick={() => playLetterPronunciation(item.transliteration, item.word)}
                className="p-4 rounded-2xl border border-emerald-800 bg-[#06241c] flex items-center justify-between text-left"
              >
                <span>
                  <span className="block font-semibold text-white">{item.transliteration}</span>
                  <span className="text-xs text-slate-400">{item.meaning}</span>
                </span>
                <span className="font-arabic text-3xl text-emerald-300">{item.word}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
