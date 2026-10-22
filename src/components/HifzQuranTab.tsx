"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Eye, EyeOff, RotateCcw, Volume2 } from "lucide-react";
import { SURAH_LIST } from "@/data/surahMetadata";
import { ReadingSurah } from "@/lib/quranReading";
import { getAyahAudioUrl } from "@/lib/audioEngine";

const STORAGE_KEY = "noor-hifz-memorized-v1";

function loadMemorized(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function HifzQuranTab() {
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahIndex, setAyahIndex] = useState(0);
  const [surah, setSurah] = useState<ReadingSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hideArabic, setHideArabic] = useState(false);
  const [hideMeaning, setHideMeaning] = useState(true);
  const [repeats, setRepeats] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [memorized, setMemorized] = useState<Record<string, boolean>>({});
  const [onlyNew, setOnlyNew] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const repeatsLeft = useRef(0);

  useEffect(() => {
    setMemorized(loadMemorized());
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setAyahIndex(0);
    fetch(`/api/quran/read/${surahNumber}?script=standard`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || "Could not load this surah.");
        return data.surah as ReadingSurah;
      })
      .then((next) => {
        if (active) setSurah(next);
      })
      .catch((err: Error) => {
        if (active) {
          setSurah(null);
          setError(err.message);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [surahNumber]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const ayah = surah?.ayahs[ayahIndex];
  const key = ayah ? `${surahNumber}:${ayah.number}` : "";
  const surahMemorized = surah ? surah.ayahs.filter((item) => memorized[`${surahNumber}:${item.number}`]).length : 0;
  const totalMemorized = Object.values(memorized).filter(Boolean).length;

  const save = (next: Record<string, boolean>) => {
    setMemorized(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const goTo = (index: number) => {
    if (!surah) return;
    const safe = Math.max(0, Math.min(surah.ayahs.length - 1, index));
    setAyahIndex(safe);
    setHideArabic(false);
  };

  const nextUnmemorized = () => {
    if (!surah) return;
    const start = ayahIndex + 1;
    const found = surah.ayahs.findIndex((item, index) => index >= start && !memorized[`${surahNumber}:${item.number}`]);
    if (found >= 0) goTo(found);
    else if (surahNumber < 114) setSurahNumber((current) => current + 1);
  };

  const playCurrent = () => {
    if (!ayah) return;
    audioRef.current?.pause();
    const audio = new Audio(getAyahAudioUrl(surahNumber, ayah.number, "Husary_128kbps"));
    audioRef.current = audio;
    repeatsLeft.current = repeats;
    setPlaying(true);
    audio.onended = () => {
      repeatsLeft.current -= 1;
      if (repeatsLeft.current > 0) {
        audio.currentTime = 0;
        audio.play().catch(() => setPlaying(false));
      } else {
        setPlaying(false);
        setHideArabic(true);
      }
    };
    audio.play().catch(() => setPlaying(false));
  };

  return (
    <div className="space-y-4 rounded-3xl bg-[#f7f1e3] p-3 text-stone-900 sm:p-5">
      <div className="rounded-2xl border border-stone-300 bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Memorize the whole Quran</p>
        <h1 className="text-2xl font-extrabold">Hifz Quran</h1>
        <p className="mt-1 text-sm text-stone-600">
          Listen, hide the words, then recall them. Your ticks stay saved on this device.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl bg-emerald-50 p-3">
            <p className="text-xs text-emerald-800">Memorized ayahs</p>
            <p className="text-2xl font-extrabold">{totalMemorized}</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-xs text-amber-800">This surah</p>
            <p className="text-2xl font-extrabold">{surahMemorized}/{surah?.versesCount || 0}</p>
          </div>
          <div className="rounded-xl bg-sky-50 p-3">
            <p className="text-xs text-sky-800">Goal</p>
            <p className="text-2xl font-extrabold">6236</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select
            value={surahNumber}
            onChange={(event) => setSurahNumber(Number(event.target.value))}
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-semibold"
          >
            {SURAH_LIST.map((item) => (
              <option key={item.number} value={item.number}>
                {item.number}. {item.nameTransliterated} ({item.versesCount})
              </option>
            ))}
          </select>
          <select
            value={repeats}
            onChange={(event) => setRepeats(Number(event.target.value))}
            className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            {[1, 3, 5, 7, 10].map((count) => (
              <option key={count} value={count}>{count} repeats</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyNew} onChange={(event) => setOnlyNew(event.target.checked)} />
            Skip memorized
          </label>
        </div>
      </div>

      {loading && <div className="rounded-2xl bg-white p-10 text-center">Loading surah for hifz...</div>}
      {!loading && error && <div className="rounded-2xl bg-white p-6 text-center text-rose-700">{error}</div>}

      {!loading && surah && ayah && (
        <article className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-8">
          <div className="mb-4 flex items-center justify-between text-sm text-stone-600">
            <span>{surah.nameTransliterated}</span>
            <span>Ayah {ayah.number} of {surah.versesCount}</span>
          </div>
          <div className="min-h-40 rounded-2xl bg-[#fffaf0] p-5 text-center">
            {surah.number !== 9 && ayah.number === 1 && (
              <p className="font-arabic mb-4 text-3xl text-emerald-900" dir="rtl">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
            )}
            <p className={`font-arabic text-4xl leading-loose text-stone-950 sm:text-5xl ${hideArabic ? "blur-md select-none" : ""}`} dir="rtl">
              {ayah.arabic}
            </p>
            {!hideMeaning && (
              <p className="mt-4 text-base text-stone-700">{ayah.translation}</p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button onClick={() => goTo(ayahIndex - 1)} className="rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold">
              <ChevronLeft className="inline h-4 w-4" /> Back
            </button>
            <button onClick={playCurrent} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white">
              <Volume2 className="mr-1 inline h-4 w-4" /> {playing ? "Playing..." : `Listen x${repeats}`}
            </button>
            <button onClick={() => setHideArabic((current) => !current)} className="rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold">
              {hideArabic ? <Eye className="inline h-4 w-4" /> : <EyeOff className="inline h-4 w-4" />} {hideArabic ? "Show" : "Hide"}
            </button>
            <button onClick={() => setHideMeaning((current) => !current)} className="rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold">
              {hideMeaning ? "Show meaning" : "Hide meaning"}
            </button>
            <button
              onClick={() => save({ ...memorized, [key]: !memorized[key] })}
              className={`rounded-xl px-3 py-2 text-sm font-bold ${memorized[key] ? "bg-amber-400 text-stone-950" : "bg-stone-900 text-white"}`}
            >
              <Check className="mr-1 inline h-4 w-4" /> {memorized[key] ? "Memorized" : "Mark memorized"}
            </button>
            <button
              onClick={() => (onlyNew ? nextUnmemorized() : goTo(ayahIndex + 1))}
              className="rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold"
            >
              Next <ChevronRight className="inline h-4 w-4" />
            </button>
            <button onClick={() => save({ ...memorized, [key]: false })} className="rounded-xl px-3 py-2 text-sm text-stone-500">
              <RotateCcw className="mr-1 inline h-4 w-4" /> Review again
            </button>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-200">
            <div className="h-full bg-emerald-600" style={{ width: `${surah.versesCount ? (surahMemorized / surah.versesCount) * 100 : 0}%` }} />
          </div>
        </article>
      )}
    </div>
  );
}
