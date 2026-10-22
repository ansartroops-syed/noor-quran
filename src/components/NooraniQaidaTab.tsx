"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { NOORANI_LESSONS, NooraniLesson, QaidaCard } from "@/data/nooraniQaidaLessons";
import { playLetterPronunciation } from "@/lib/audioEngine";

export function NooraniQaidaTab() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [playingAll, setPlayingAll] = useState(false);
  const lesson = NOORANI_LESSONS[lessonIndex];

  const playCard = (card: QaidaCard) => {
    playLetterPronunciation(card.transliteration, card.arabic);
  };

  const playLesson = async (current: NooraniLesson) => {
    if (playingAll) return;
    setPlayingAll(true);
    for (const group of current.groups) {
      for (const card of group.items) {
        await playLetterPronunciation(card.transliteration, card.arabic);
        await new Promise((resolve) => setTimeout(resolve, 450));
      }
    }
    setPlayingAll(false);
  };

  return (
    <div className="space-y-4 rounded-3xl bg-[#f7f1e3] p-3 text-stone-900 sm:p-5">
      <div className="rounded-2xl border border-stone-300 bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Complete Noorani Qaida</p>
        <h1 className="mt-1 text-2xl font-extrabold text-stone-950">Noorani Qaida</h1>
        <p className="mt-1 text-sm text-stone-600">
          Eighteen lessons, from single letters to joined words, vowels, sukoon, shaddah, madd, and Surah Al-Fatiha.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setLessonIndex((current) => Math.max(0, current - 1))}
            disabled={lessonIndex === 0}
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold disabled:opacity-40"
          >
            <ChevronLeft className="mr-1 inline h-4 w-4" /> Previous lesson
          </button>
          <select
            value={lessonIndex}
            onChange={(event) => setLessonIndex(Number(event.target.value))}
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-semibold"
          >
            {NOORANI_LESSONS.map((item, index) => (
              <option key={item.id} value={index}>
                {item.number}. {item.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => setLessonIndex((current) => Math.min(NOORANI_LESSONS.length - 1, current + 1))}
            disabled={lessonIndex === NOORANI_LESSONS.length - 1}
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold disabled:opacity-40"
          >
            Next lesson <ChevronRight className="ml-1 inline h-4 w-4" />
          </button>
          <button
            onClick={() => playLesson(lesson)}
            disabled={playingAll}
            className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
          >
            <Volume2 className="mr-1 inline h-4 w-4" />
            {playingAll ? "Playing..." : "Play this lesson"}
          </button>
        </div>
      </div>

      <article className="rounded-3xl border border-stone-200 bg-white p-4 sm:p-6">
        <header className="border-b border-stone-200 pb-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Lesson {lesson.number} of {NOORANI_LESSONS.length}
          </p>
          <h2 className="mt-1 text-2xl font-extrabold">{lesson.title}</h2>
          <p className="font-arabic text-3xl text-emerald-900">{lesson.arabicTitle}</p>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-stone-600">{lesson.instruction}</p>
        </header>

        <div className="mt-5 space-y-6">
          {lesson.groups.map((group) => (
            <section key={group.title}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-800">{group.title}</h3>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
                {group.items.map((card) => (
                  <button
                    key={`${group.title}-${card.arabic}-${card.transliteration}`}
                    onClick={() => playCard(card)}
                    className="rounded-2xl border border-stone-200 bg-[#fffaf0] p-3 text-center hover:border-emerald-600"
                  >
                    <span className="font-arabic block text-3xl leading-relaxed text-stone-950 sm:text-4xl" dir="rtl">
                      {card.arabic}
                    </span>
                    <span className="mt-1 block text-[11px] font-semibold text-stone-600">{card.transliteration}</span>
                    {card.note && <span className="mt-1 block text-[10px] text-emerald-800">{card.note}</span>}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
