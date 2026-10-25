"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { DIFFICULTY_INFO, KIDS_QUIZ_LEVELS, KidsLevel, KidsQuestion, QuizDifficulty } from "@/data/kidsQuizLevels";
import { playHarmonicChime } from "@/lib/audioEngine";

const STORAGE_KEY = "noor-kids-quiz-v2";

interface QuizSave {
  stars: Record<string, number>;
}

interface ShuffledRound {
  options: string[];
  answer: number;
}

function loadSave(): QuizSave {
  if (typeof window === "undefined") return { stars: {} };
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "") as QuizSave;
    return parsed?.stars ? parsed : { stars: {} };
  } catch {
    return { stars: {} };
  }
}

function shuffleQuestion(question: KidsQuestion): ShuffledRound {
  const correctText = question.options[question.answer];
  const options = [...question.options];
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [options[index], options[swap]] = [options[swap], options[index]];
  }
  return { options, answer: options.indexOf(correctText) };
}

export function KidsQuizTab() {
  const [save, setSave] = useState<QuizSave>({ stars: {} });
  const [difficulty, setDifficulty] = useState<QuizDifficulty | null>(null);
  const [level, setLevel] = useState<KidsLevel | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState<ShuffledRound | null>(null);

  useEffect(() => {
    setSave(loadSave());
  }, []);

  const question = level?.questions[questionIndex];

  useEffect(() => {
    if (!question) {
      setRound(null);
      return;
    }
    setRound(shuffleQuestion(question));
    setPicked(null);
  }, [level?.id, questionIndex]);

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

  const choose = (index: number) => {
    if (!level || !question || !round || picked !== null) return;
    setPicked(index);
    const correct = index === round.answer;
    if (correct) {
      setScore((current) => current + 1);
      playHarmonicChime(640);
    } else {
      playHarmonicChime(240);
    }
    window.setTimeout(() => {
      if (questionIndex + 1 >= level.questions.length) {
        const finalScore = score + (correct ? 1 : 0);
        const percent = finalScore / level.questions.length;
        const stars = percent >= 0.9 ? 3 : percent >= 0.7 ? 2 : percent >= 0.5 ? 1 : 0;
        persist({ stars: { ...save.stars, [level.id]: Math.max(save.stars[level.id] || 0, stars) } });
        setFinished(true);
        if (stars > 0) confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
      } else {
        setQuestionIndex((current) => current + 1);
      }
    }, 900);
  };

  if (!difficulty) {
    return (
      <div className="rounded-3xl bg-[#fff7ed] p-4 text-stone-900 sm:p-6">
        <h1 className="text-3xl font-extrabold">Kids Quran Quiz</h1>
        <p className="mt-1 text-base text-stone-700">Basic, Medium, and Hard are all open. Choose one, then start its Level 1.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {DIFFICULTY_INFO.map((item) => (
            <button
              key={item.id}
              onClick={() => setDifficulty(item.id)}
              className="rounded-3xl border border-amber-200 bg-white p-6 text-left shadow-sm hover:border-emerald-600"
            >
              <span className="text-5xl">{item.emoji}</span>
              <span className="mt-3 block text-2xl font-extrabold">{item.title}</span>
              <span className="mt-2 block text-sm text-stone-600">{item.blurb}</span>
              <span className="mt-3 inline-block rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold text-white">Level 1 is open</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const levels = KIDS_QUIZ_LEVELS.filter((item) => item.difficulty === difficulty);

  if (!level) {
    return (
      <div className="rounded-3xl bg-[#fff7ed] p-4 text-stone-900 sm:p-6">
        <button onClick={() => setDifficulty(null)} className="text-sm font-bold text-emerald-900">← Basic, Medium, Hard</button>
        <h1 className="mt-2 text-3xl font-extrabold capitalize">{difficulty}</h1>
        <p className="mt-1 text-sm text-stone-600">Level 1 is ready. Pass it to open the next level in this difficulty only.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((item) => {
            const stars = save.stars[item.id] || 0;
            const previous = levels.find((entry) => entry.number === item.number - 1);
            const unlocked = item.number === 1 || (previous ? (save.stars[previous.id] || 0) > 0 : false);
            return (
              <button
                key={item.id}
                disabled={!unlocked}
                onClick={() => startLevel(item)}
                className={`rounded-3xl border border-white bg-gradient-to-br ${item.color} p-5 text-left shadow-sm disabled:opacity-50`}
              >
                <span className="text-4xl">{unlocked ? item.emoji : "🔒"}</span>
                <span className="mt-2 block text-xl font-extrabold">Level {item.number}</span>
                <span className="block text-lg font-bold">{item.title}</span>
                <span className="mt-2 block text-sm">
                  {unlocked ? (item.number === 1 ? "Start here" : item.intro) : "Finish the previous level in this difficulty"}
                </span>
                <span className="mt-3 block text-lg">{unlocked ? (stars ? "⭐".repeat(stars) : "Open") : "Locked"}</span>
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
        <p className="mt-1 text-2xl">{"⭐".repeat(stars)}{"☆".repeat(Math.max(0, 3 - stars))}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => startLevel(level)} className="rounded-2xl bg-amber-400 px-5 py-3 text-lg font-extrabold">Play again</button>
          <button onClick={() => setLevel(null)} className="rounded-2xl bg-emerald-700 px-5 py-3 text-lg font-extrabold text-white">More quizzes</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl bg-gradient-to-br ${level.color} p-4 text-stone-900 sm:p-6`}>
      <button onClick={() => setLevel(null)} className="text-sm font-bold text-emerald-900">← {difficulty} quizzes</button>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">{level.emoji} {level.title}</h1>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-bold">{questionIndex + 1} / {level.questions.length}</span>
      </div>
      {question && round && (
        <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xl font-extrabold sm:text-2xl">{question.prompt}</p>
          {question.arabic && (
            <p className="font-arabic mt-4 text-center text-5xl text-emerald-950" dir="rtl">{question.arabic}</p>
          )}
          <div className="mt-6 grid gap-3">
            {round.options.map((option, index) => {
              const show = picked !== null;
              const correct = index === round.answer;
              const wrongPick = show && picked === index && !correct;
              return (
                <button
                  key={`${questionIndex}-${option}`}
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
              {picked === round.answer ? question.praise : "Almost! The green answer is the right one."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
