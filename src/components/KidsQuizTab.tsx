"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { KIDS_QUIZ_LEVELS, KidsLevel } from "@/data/kidsQuizLevels";
import { playHarmonicChime } from "@/lib/audioEngine";

const STORAGE_KEY = "noor-kids-quiz-v1";

interface QuizSave {
  unlocked: number;
  stars: Record<string, number>;
}

function loadSave(): QuizSave {
  if (typeof window === "undefined") return { unlocked: 1, stars: {} };
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "") as QuizSave;
  } catch {
    return { unlocked: 1, stars: {} };
  }
}

export function KidsQuizTab() {
  const [save, setSave] = useState<QuizSave>({ unlocked: 1, stars: {} });
  const [level, setLevel] = useState<KidsLevel | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setSave(loadSave());
  }, []);

  const persist = (next: QuizSave) => {
    setSave(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const startLevel = (item: KidsLevel) => {
    setLevel(item);
    setQuestionIndex(0);
    setScore(0);
    setPicked(null);
    setFinished(false);
  };

  const question = level?.questions[questionIndex];

  const choose = (index: number) => {
    if (!level || !question || picked !== null) return;
    setPicked(index);
    const correct = index === question.answer;
    if (correct) {
      setScore((current) => current + 1);
      playHarmonicChime(640);
    } else {
      playHarmonicChime(240);
    }
    window.setTimeout(() => {
      if (questionIndex + 1 >= level.questions.length) {
        const finalScore = score + (correct ? 1 : 0);
        const stars = finalScore >= 5 ? 3 : finalScore >= 4 ? 2 : finalScore >= 3 ? 1 : 0;
        const next: QuizSave = {
          unlocked: Math.max(save.unlocked, stars > 0 ? level.number + 1 : save.unlocked),
          stars: { ...save.stars, [level.id]: Math.max(save.stars[level.id] || 0, stars) },
        };
        persist(next);
        setFinished(true);
        if (stars > 0) confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
      } else {
        setQuestionIndex((current) => current + 1);
        setPicked(null);
      }
    }, 900);
  };

  if (!level) {
    return (
      <div className="rounded-3xl bg-[#fff7ed] p-4 text-stone-900 sm:p-6">
        <h1 className="text-3xl font-extrabold">Kids Quran Quiz</h1>
        <p className="mt-1 text-base text-stone-700">Six friendly levels. Big buttons. No rush. Earn stars and unlock the next garden.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {KIDS_QUIZ_LEVELS.map((item) => {
            const locked = item.number > save.unlocked;
            const stars = save.stars[item.id] || 0;
            return (
              <button
                key={item.id}
                disabled={locked}
                onClick={() => startLevel(item)}
                className={`rounded-3xl border border-white bg-gradient-to-br ${item.color} p-5 text-left shadow-sm disabled:opacity-50`}
              >
                <span className="text-4xl">{item.emoji}</span>
                <span className="mt-2 block text-xl font-extrabold">Level {item.number}</span>
                <span className="block text-lg font-bold">{item.title}</span>
                <span className="mt-2 block text-sm">{locked ? "Locked — finish the previous level" : item.intro}</span>
                <span className="mt-3 block text-lg">{locked ? "🔒" : "⭐".repeat(stars) || "☆☆☆"}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (finished) {
    const stars = save.stars[level.id] || 0;
    return (
      <div className="rounded-3xl bg-white p-8 text-center text-stone-900">
        <p className="text-6xl">{stars > 0 ? "🎉" : "💪"}</p>
        <h2 className="mt-3 text-3xl font-extrabold">{stars > 0 ? "MashaAllah!" : "Try once more"}</h2>
        <p className="mt-2 text-lg">You got {score} out of {level.questions.length}.</p>
        <p className="mt-1 text-2xl">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => startLevel(level)} className="rounded-2xl bg-amber-400 px-5 py-3 text-lg font-extrabold">Play again</button>
          <button onClick={() => setLevel(null)} className="rounded-2xl bg-emerald-700 px-5 py-3 text-lg font-extrabold text-white">All levels</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl bg-gradient-to-br ${level.color} p-4 text-stone-900 sm:p-6`}>
      <button onClick={() => setLevel(null)} className="text-sm font-bold text-emerald-900">← All levels</button>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">{level.emoji} {level.title}</h1>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-bold">{questionIndex + 1} / {level.questions.length}</span>
      </div>
      {question && (
        <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xl font-extrabold sm:text-2xl">{question.prompt}</p>
          {question.arabic && (
            <p className="font-arabic mt-4 text-center text-5xl text-emerald-950" dir="rtl">{question.arabic}</p>
          )}
          <div className="mt-6 grid gap-3">
            {question.options.map((option, index) => {
              const show = picked !== null;
              const correct = index === question.answer;
              const wrongPick = show && picked === index && !correct;
              return (
                <button
                  key={option}
                  onClick={() => choose(index)}
                  className={`rounded-2xl border-2 px-4 py-4 text-left text-lg font-bold ${
                    show && correct
                      ? "border-emerald-600 bg-emerald-100"
                      : wrongPick
                      ? "border-rose-400 bg-rose-100"
                      : "border-stone-200 bg-stone-50 hover:border-emerald-500"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <p className="mt-4 text-center text-lg font-bold text-emerald-800">
              {picked === question.answer ? question.praise : "Almost! The green answer is the right one."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
