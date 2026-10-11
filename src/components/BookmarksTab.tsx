"use client";

import React, { useState } from "react";
import {
  Bookmark,
  Sparkles,
  Flame,
  Target,
  Trash2,
  BookOpen,
  Play,
  Volume2,
  Calendar,
  MessageSquare,
  ArrowRight,
  Clock,
} from "lucide-react";

export interface BookmarkItem {
  id: number;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  arabicText: string;
  translationText: string;
  transliterationText?: string | null;
  note?: string | null;
  category?: string | null;
  createdAt?: string;
}

interface BookmarksTabProps {
  bookmarksList: BookmarkItem[];
  streakCount: number;
  xp: number;
  dailyGoalMinutes: number;
  minutesSpentToday: number;
  onSelectSurahAndAyah: (surahNumber: number, ayahNumber: number) => void;
  onDeleteBookmark: (id: number) => void;
  onPlayAyahAudio: (surahNumber: number, ayahNumber: number, surahName: string) => void;
}

export function BookmarksTab({
  bookmarksList,
  streakCount,
  xp,
  dailyGoalMinutes,
  minutesSpentToday,
  onSelectSurahAndAyah,
  onDeleteBookmark,
  onPlayAyahAudio,
}: BookmarksTabProps) {
  const goalProgress = Math.min(100, Math.round((minutesSpentToday / (dailyGoalMinutes || 15)) * 100));

  const dailyAyah = {
    surahNumber: 2,
    ayahNumber: 286,
    surahName: "Al-Baqarah",
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    transliteration: "Laa yukallifu-Llaahu nafsan illaa wus'ahaa",
    translation: "Allah does not burden a soul beyond that it can bear.",
    reflection: "A divine reminder of infinite mercy and reassurance that whatever difficulty you are enduring, Allah knows you possess the resilience to overcome it.",
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Daily Progress & Goal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/60 via-[#062920] to-[#041a14] border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">Daily Streak</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              {streakCount} {streakCount === 1 ? "Day" : "Days"} 🔥
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Keep reciting daily to grow streak!</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
        </div>

        {/* Daily Target Progress */}
        <div className="p-5 rounded-3xl bg-[#06241c] border border-emerald-500/30 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> Daily Target
            </span>
            <span className="text-white font-bold">{minutesSpentToday} / {dailyGoalMinutes} min</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-emerald-950 border border-emerald-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>{goalProgress}% Completed</span>
            <span className="text-emerald-300 font-semibold">{xp} Total XP</span>
          </div>
        </div>

        {/* Saved Count */}
        <div className="p-5 rounded-3xl bg-[#06241c] border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">Saved Bookmarks</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              {bookmarksList.length} Verses 🔖
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Personal Quranic reflections</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Daily Ayah of the Day with Reflection */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#063b2e] via-[#04261e] to-[#021812] border-2 border-amber-500/40 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
            <Sparkles className="w-3.5 h-3.5" /> Ayah of the Day & Reflection
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            Surah {dailyAyah.surahName} ({dailyAyah.surahNumber}:{dailyAyah.ayahNumber})
          </span>
        </div>

        <div className="text-center py-2 space-y-2">
          <p className="font-arabic text-3xl sm:text-4xl font-bold text-amber-200 leading-loose" dir="rtl">
            {dailyAyah.arabic}
          </p>
          <p className="text-xs sm:text-sm text-emerald-300 italic">{dailyAyah.transliteration}</p>
          <p className="text-sm sm:text-base text-slate-200 font-medium max-w-xl mx-auto">
            &ldquo;{dailyAyah.translation}&rdquo;
          </p>
        </div>

        {/* Reflection Box */}
        <div className="p-4 rounded-2xl bg-[#031510] border border-emerald-900 text-xs text-slate-300 space-y-1">
          <span className="font-bold text-amber-300 block">✨ Spiritual Reflection:</span>
          <p className="leading-relaxed">{dailyAyah.reflection}</p>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => onPlayAyahAudio(dailyAyah.surahNumber, dailyAyah.ayahNumber, dailyAyah.surahName)}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Listen Audio
          </button>
          <button
            onClick={() => onSelectSurahAndAyah(dailyAyah.surahNumber, dailyAyah.ayahNumber)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            Open in Quran <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Saved Bookmarks List */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-emerald-400" />
          Your Bookmarked Verses & Notes ({bookmarksList.length})
        </h3>

        {bookmarksList.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#06241c] border border-emerald-900/60 text-center space-y-3">
            <Bookmark className="w-12 h-12 mx-auto text-emerald-500/30" />
            <p className="text-slate-300 font-medium">No bookmarks saved yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              While reading any Surah, click the 🔖 bookmark icon on any Ayah to save it here with your custom reflection notes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarksList.map((bm) => (
              <div
                key={bm.id}
                className="p-5 rounded-3xl bg-[#06241c] border border-emerald-500/30 space-y-3 flex flex-col justify-between shadow-lg hover:border-emerald-500 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-emerald-400">
                      {bm.surahName} • Ayah {bm.ayahNumber}
                    </span>
                    <button
                      onClick={() => onDeleteBookmark(bm.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="font-arabic text-xl sm:text-2xl text-right text-emerald-100" dir="rtl">
                    {bm.arabicText}
                  </p>

                  <p className="text-xs text-slate-300 line-clamp-2">{bm.translationText}</p>

                  {bm.note && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-900 text-xs text-amber-200">
                      <span className="font-semibold block text-[10px] text-amber-400 uppercase">Personal Note:</span>
                      {bm.note}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-emerald-900/60">
                  <button
                    onClick={() => onPlayAyahAudio(bm.surahNumber, bm.ayahNumber, bm.surahName)}
                    className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Play
                  </button>

                  <button
                    onClick={() => onSelectSurahAndAyah(bm.surahNumber, bm.ayahNumber)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 transition"
                  >
                    Jump to Verse <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
