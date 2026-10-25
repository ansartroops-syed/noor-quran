"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { gradeBandLabel, PRIVATE_DIFFICULTIES, PrivateLevel, PrivateQuestion, QuizDifficulty } from "@/data/private/types";
import { MATHS_QUIZ_LEVELS } from "@/data/private/mathsQuiz";
import { ENGLISH_QUIZ_LEVELS } from "@/data/private/englishQuiz";
import { GK_QUIZ_LEVELS } from "@/data/private/gkQuiz";
import { playHarmonicChime } from "@/lib/audioEngine";

type Subject = "maths" | "english" | "gk";

const DATA: Record<Subject, PrivateLevel[]> = {
  maths: MATHS_QUIZ_LEVELS,
  english: ENGLISH_QUIZ_LEVELS,
  gk: GK_QUIZ_LEVELS,
};

interface ShuffledRound {
  options: string[];
  answer: number;
}

function shuffleQuestion(question: PrivateQuestion): ShuffledRound {
  const correctText = question.options[question.answer];
  const options = [...question.options];
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [options[index], options[swap]] = [options[swap], options[index]];
  }
  return { options, answer: Math.max(0, options.indexOf(correctText)) };
}

export function PrivateQuizBoard({ subject, title }: { subject: Subject; title: string }) {
  const levels = DATA[subject];
  const storageKey = `noor-subject-${subject}-v1`;
  const [stars, setStars] = useState<Record<string, number>>({});
  const [difficulty, setDifficulty] = useState<QuizDifficulty | null>(null);
  const [level, setLevel] = useState<PrivateLevel | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState<ShuffledRound | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "") as { stars?: Record<string, number> };
      if (saved.stars) setStars(saved.stars);
    } catch {
      setStars({});
    }
  }, [storageKey]);

  const question = level?.questions[questionIndex];

  useEffect(() => {
    if (!question) {
      setRound(null);
      return;
    }
    setRound(shuffleQuestion(question));
    setPicked(null);
  }, [level?.id, questionIndex]);

  const startLevel = (item: PrivateLevel) => {
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
        const earned = percent >= 0.9 ? 3 : percent >= 0.7 ? 2 : percent >= 0.5 ? 1 : 0;
        const nextStars = { ...stars, [level.id]: Math.max(stars[level.id] || 0, earned) };
        setStars(nextStars);
        localStorage.setItem(storageKey, JSON.stringify({ stars: nextStars }));
        setFinished(true);
        if (earned > 0) confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } else {
        setQuestionIndex((current) => current + 1);
      }
    }, 900);
  };

  if (!difficulty) {
    return (
      <div className="rounded-3xl bg-[#fffaf0] p-4 text-stone-900 sm:p-6">
        <h1 className="text-3xl font-extrabold">{title}</h1>
        <p className="mt-1 text-sm text-stone-600">
          For children from Kindergarten to Standard 7. Each level has 10 questions and the answers are mixed.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {PRIVATE_DIFFICULTIES.map((item) => (
            <button
              key={item.id}
              onClick={() => setDifficulty(item.id)}
              className="rounded-3xl border border-amber-200 bg-white p-6 text-left shadow-sm hover:border-emerald-600"
            >
              <span className="text-4xl">{item.emoji}</span>
              <span className="mt-2 block text-2xl font-extrabold">{item.title}</span>
              <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-emerald-800">{item.grades}</span>
              <span className="mt-2 block text-sm text-stone-600">{item.blurb}</span>
              <span className="mt-3 inline-block rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold text-white">Level 1 is open</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const visible = levels.filter((item) => item.difficulty === difficulty);

  if (!level) {
    return (
      <div className="rounded-3xl bg-[#fffaf0] p-4 text-stone-900 sm:p-6">
        <button onClick={() => setDifficulty(null)} className="text-sm font-bold text-emerald-800">← Easy, Medium, Hard</button>
        <h1 className="mt-2 text-2xl font-extrabold capitalize">{title}: {difficulty}</h1>
        <p className="mt-1 text-sm text-stone-600">{gradeBandLabel(difficulty)} · 10 questions in every level</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {visible.map((item) => {
            const previous = visible.find((entry) => entry.number === item.number - 1);
            const unlocked = item.number === 1 || (previous ? (stars[previous.id] || 0) > 0 : false);
            const earned = stars[item.id] || 0;
            return (
              <button
                key={item.id}
                disabled={!unlocked}
                onClick={() => startLevel(item)}
                className={`rounded-3xl border border-white bg-gradient-to-br ${item.color} p-5 text-left disabled:opacity-50`}
              >
                <span className="text-4xl">{unlocked ? item.emoji : "🔒"}</span>
                <span className="mt-2 block text-xl font-extrabold">Level {item.number}</span>
                <span className="block font-bold">{item.title}</span>
                <span className="mt-2 block text-sm">{unlocked ? "10 questions" : "Finish the previous level"}</span>
                <span className="mt-2 block">{earned ? "⭐".repeat(earned) : unlocked ? "Open" : "Locked"}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (finished) {
    const earned = stars[level.id] || 0;
    return (
      <div className="rounded-3xl bg-white p-8 text-center text-stone-900">
        <p className="text-5xl">{earned > 0 ? "🎉" : "💪"}</p>
        <h2 className="mt-3 text-3xl font-extrabold">{earned > 0 ? "Great work!" : "Try again"}</h2>
        <p className="mt-2">You got {score} out of {level.questions.length}.</p>
        <p className="mt-1 text-2xl">{"⭐".repeat(earned)}{"☆".repeat(Math.max(0, 3 - earned))}</p>
        <div className="mt-5 flex justify-center gap-3">
          <button onClick={() => startLevel(level)} className="rounded-xl bg-amber-400 px-4 py-2 font-bold">Play again</button>
          <button onClick={() => setLevel(null)} className="rounded-xl bg-emerald-700 px-4 py-2 font-bold text-white">Choose a level</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl bg-gradient-to-br ${level.color} p-4 text-stone-900 sm:p-6`}>
      <button onClick={() => setLevel(null)} className="text-sm font-bold">← Levels</button>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">{level.emoji} {level.title}</h1>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-bold">{questionIndex + 1} / {level.questions.length}</span>
      </div>
      {question && round && (
        <div className="mt-4 rounded-3xl bg-white p-5">
          <p className="text-lg font-extrabold sm:text-xl">{question.prompt}</p>
          <div className="mt-4 grid gap-3">
            {round.options.map((option, index) => {
              const show = picked !== null;
              const correct = index === round.answer;
              const wrongPick = show && picked === index && !correct;
              return (
                <button
                  key={`${questionIndex}-${option}`}
                  onClick={() => choose(index)}
                  className={`rounded-2xl border-2 px-4 py-3 text-left text-base font-bold ${
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
            <p className="mt-4 text-center font-bold text-emerald-800">
              {picked === round.answer ? question.praise : "Not quite. The green answer is correct."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
