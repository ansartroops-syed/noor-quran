"use client";

import React, { useState, useEffect } from "react";
import { Search, X, BookOpen, Sparkles, Volume2, ArrowRight, Loader2 } from "lucide-react";
import { SurahMeta } from "@/data/surahMetadata";

interface SearchResults {
  surahs: SurahMeta[];
  ayahs: Array<{
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
    arabic: string;
    translation: string;
    transliteration: string;
  }>;
  vocabulary: Array<{
    id: string;
    arabic: string;
    transliteration: string;
    english: string;
    category: string;
  }>;
  tajweed: Array<{
    id: string;
    name: string;
    arabicName: string;
    definition: string;
    category: string;
  }>;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSurah: (surahNumber: number, ayahNumber?: number) => void;
  onSelectTajweedRule: (ruleId: string) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  onSelectSurah,
  onSelectTajweedRule,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults(null);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 pt-16 sm:pt-24 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-emerald-500/30 bg-[#06241c] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-emerald-800/40 flex items-center gap-3 bg-[#041d16]">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Quran (e.g. Al-Fatiha, Mercy, Fatha, Jannah, 112)..."
            className="w-full bg-transparent text-slate-100 placeholder:text-emerald-300/40 focus:outline-none text-base sm:text-lg"
            autoFocus
          />
          {loading && <Loader2 className="w-5 h-5 text-emerald-400 animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1 text-sm">
          {!query && (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-emerald-500/40" />
              <p className="text-slate-300 font-medium">Quick Search across Noor Quran</p>
              <p className="text-xs text-slate-400">
                Type any Arabic word, English translation keyword, Surah name (e.g. &ldquo;Ikhlas&rdquo;), or Tajweed rule (e.g. &ldquo;Qalqalah&rdquo;).
              </p>
            </div>
          )}

          {results && (
            <>
              {/* Surahs Matches */}
              {results.surahs.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Surahs ({results.surahs.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.surahs.map((surah) => (
                      <button
                        key={surah.number}
                        onClick={() => {
                          onSelectSurah(surah.number);
                          onClose();
                        }}
                        className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-500/60 hover:bg-emerald-900/50 transition text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-emerald-800/60 flex items-center justify-center text-xs font-bold text-emerald-200">
                            {surah.number}
                          </span>
                          <div>
                            <div className="font-semibold text-white group-hover:text-emerald-300">
                              {surah.nameTransliterated}
                            </div>
                            <div className="text-xs text-slate-400">{surah.nameEnglish} • {surah.versesCount} Ayahs</div>
                          </div>
                        </div>
                        <span className="font-arabic text-lg text-emerald-400">{surah.nameArabic}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ayahs Matches */}
              {results.ayahs.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Verses / Ayahs ({results.ayahs.length})
                  </h4>
                  <div className="space-y-2">
                    {results.ayahs.map((ayah, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          onSelectSurah(ayah.surahNumber, ayah.ayahNumber);
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-500/60 hover:bg-emerald-900/50 transition space-y-1.5 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-emerald-400">
                            {ayah.surahName} : Ayah {ayah.ayahNumber}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-emerald-300">
                            Open Verse <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                        <p className="font-arabic text-base sm:text-lg text-right text-emerald-100" dir="rtl">
                          {ayah.arabic}
                        </p>
                        <p className="text-xs text-slate-300 line-clamp-2">{ayah.translation}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocabulary Matches */}
              {results.vocabulary.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" /> Quranic Vocabulary ({results.vocabulary.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.vocabulary.map((vocab) => (
                      <div
                        key={vocab.id}
                        className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs text-emerald-400 font-medium">{vocab.transliteration}</div>
                          <div className="text-sm font-semibold text-white">{vocab.english}</div>
                          <div className="text-[10px] text-slate-400">{vocab.category}</div>
                        </div>
                        <span className="font-arabic text-xl text-emerald-300">{vocab.arabic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tajweed Matches */}
              {results.tajweed.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Tajweed Rules ({results.tajweed.length})
                  </h4>
                  <div className="space-y-2">
                    {results.tajweed.map((rule) => (
                      <button
                        key={rule.id}
                        onClick={() => {
                          onSelectTajweedRule(rule.id);
                          onClose();
                        }}
                        className="w-full text-left p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-500/60 hover:bg-emerald-900/50 transition group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white group-hover:text-emerald-300">
                            {rule.name}
                          </span>
                          <span className="font-arabic text-base text-emerald-400">{rule.arabicName}</span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2">{rule.definition}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.surahs.length === 0 &&
                results.ayahs.length === 0 &&
                results.vocabulary.length === 0 &&
                results.tajweed.length === 0 && (
                  <div className="py-8 text-center text-slate-400">
                    <p>No results found for &ldquo;{query}&rdquo;.</p>
                    <p className="text-xs text-slate-500 mt-1">Try searching for Surah names like &ldquo;Fatiha&rdquo; or English words like &ldquo;Peace&rdquo;.</p>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
