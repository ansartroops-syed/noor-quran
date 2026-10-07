"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar, AppTab } from "@/components/Navbar";
import { LearnQuranTab } from "@/components/LearnQuranTab";
import { QuranReaderTab } from "@/components/QuranReaderTab";
import { TajweedMasterclassTab } from "@/components/TajweedMasterclassTab";
import { VocabularyFlashcardsTab } from "@/components/VocabularyFlashcardsTab";
import { BookmarksTab, BookmarkItem } from "@/components/BookmarksTab";
import { AndroidPublishingHubTab } from "@/components/AndroidPublishingHubTab";
import { AudioPlayerBar, ActiveAudioState } from "@/components/AudioPlayerBar";
import { SearchModal } from "@/components/SearchModal";
import { VoiceRecorderModal } from "@/components/VoiceRecorderModal";
import { QuizModal } from "@/components/QuizModal";
import { CertificateModal } from "@/components/CertificateModal";
import { SettingsModal, UserPreferences } from "@/components/SettingsModal";
import { SURAH_LIST } from "@/data/surahMetadata";
import confetti from "canvas-confetti";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<AppTab>("learn");
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(1);
  const [highlightAyahNumber, setHighlightAyahNumber] = useState<number | undefined>(undefined);

  // User Profile / Settings
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: "Seeker of Knowledge",
    preferredReciter: "Alafasy_128kbps",
    preferredScript: "uthmani",
    preferredTranslation: "saheeh",
    arabicFontSize: 28,
    showTransliteration: true,
    showTranslation: true,
    showTajweedColors: true,
    dailyGoalMinutes: 15,
  });

  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [xp, setXp] = useState<number>(150);
  const [streakCount, setStreakCount] = useState<number>(1);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>(["Welcome Seeker"]);
  const [minutesSpentToday, setMinutesSpentToday] = useState<number>(4);

  // Audio Player State
  const [audioState, setAudioState] = useState<ActiveAudioState | null>(null);

  // Bookmarks State
  const [bookmarksList, setBookmarksList] = useState<BookmarkItem[]>([]);
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [voiceRecorderData, setVoiceRecorderData] = useState<{
    isOpen: boolean;
    surahNumber: number;
    ayahNumber: number;
    surahName: string;
    arabicText: string;
    transliteration: string;
    translation: string;
  }>({
    isOpen: false,
    surahNumber: 1,
    ayahNumber: 1,
    surahName: "Al-Fatihah",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    transliteration: "Bismi-Llaahir-Rahmaanir-Raheem",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
  });

  const [quizModalData, setQuizModalData] = useState<{
    isOpen: boolean;
    quizKey: string;
    levelNumber: number;
    levelTitle: string;
    badgeName: string;
  }>({
    isOpen: false,
    quizKey: "quiz_level_1",
    levelNumber: 1,
    levelTitle: "Level 1: Arabic Alphabet & Makharij",
    badgeName: "Alphabet Scholar",
  });

  const [certificateData, setCertificateData] = useState<{
    isOpen: boolean;
    levelNumber: number;
    levelTitle: string;
    badgeName: string;
  }>({
    isOpen: false,
    levelNumber: 1,
    levelTitle: "Level 1: Arabic Alphabet & Noorani Qaida",
    badgeName: "Alphabet Scholar",
  });

  // Track daily minutes timer
  useEffect(() => {
    const timer = setInterval(() => {
      setMinutesSpentToday((prev) => prev + 1);
    }, 60000); // Every 1 min
    return () => clearInterval(timer);
  }, []);

  // Fetch initial profile & bookmarks on mount
  useEffect(() => {
    // Check URL params for tab navigation (e.g. ?tab=quran)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as AppTab;
      if (tabParam && ["learn", "quran", "tajweed", "vocab", "bookmarks", "android_hub"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }

    // Profile API
    fetch("/api/profile?userId=guest-user")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          const p = data.profile;
          setCurrentLevel(p.currentLevel || 1);
          setXp(p.xp || 150);
          setStreakCount(p.streakCount || 1);
          setCompletedLessons(p.completedLessons || []);
          setEarnedBadges(p.earnedBadges || ["Welcome Seeker"]);
          setMinutesSpentToday(p.minutesSpentToday || 4);
          setPreferences((prev) => ({
            ...prev,
            name: p.name || prev.name,
            preferredReciter: p.preferredReciter || prev.preferredReciter,
            preferredScript: p.preferredScript || prev.preferredScript,
            preferredTranslation: p.preferredTranslation || prev.preferredTranslation,
            arabicFontSize: p.arabicFontSize || prev.arabicFontSize,
            showTransliteration: p.showTransliteration ?? prev.showTransliteration,
            showTranslation: p.showTranslation ?? prev.showTranslation,
            showTajweedColors: p.showTajweedColors ?? prev.showTajweedColors,
            dailyGoalMinutes: p.dailyGoalMinutes || prev.dailyGoalMinutes,
          }));
        }
      })
      .catch((err) => console.warn("Failed to load user profile:", err));

    // Bookmarks API
    fetch("/api/bookmarks?userId=guest-user")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bookmarks)) {
          setBookmarksList(data.bookmarks);
          const map: Record<string, boolean> = {};
          data.bookmarks.forEach((bm: BookmarkItem) => {
            map[`${bm.surahNumber}:${bm.ayahNumber}`] = true;
          });
          setBookmarkedMap(map);
        }
      })
      .catch((err) => console.warn("Failed to load bookmarks:", err));
  }, []);

  // Update preferences
  const handleUpdatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPrefs };
      // Sync to API
      fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest-user",
          ...updated,
        }),
      }).catch(console.error);
      return updated;
    });
  };

  // Play Ayah Recitation
  const handlePlayAyah = (
    surahNumber: number,
    ayahNumber: number,
    surahName: string,
    totalAyahs: number
  ) => {
    if (
      audioState?.surahNumber === surahNumber &&
      audioState?.ayahNumber === ayahNumber &&
      audioState?.isPlaying
    ) {
      setAudioState((prev) => (prev ? { ...prev, isPlaying: false } : null));
    } else {
      setAudioState({
        surahNumber,
        ayahNumber,
        surahName,
        totalAyahs,
        isPlaying: true,
        reciterSubfolder: preferences.preferredReciter,
      });
    }
  };

  const handleNextAyah = () => {
    if (!audioState) return;
    if (audioState.ayahNumber < audioState.totalAyahs) {
      setAudioState({
        ...audioState,
        ayahNumber: audioState.ayahNumber + 1,
        isPlaying: true,
      });
      setHighlightAyahNumber(audioState.ayahNumber + 1);
    }
  };

  const handlePrevAyah = () => {
    if (!audioState) return;
    if (audioState.ayahNumber > 1) {
      setAudioState({
        ...audioState,
        ayahNumber: audioState.ayahNumber - 1,
        isPlaying: true,
      });
      setHighlightAyahNumber(audioState.ayahNumber - 1);
    }
  };

  // Bookmarking
  const handleSaveBookmark = async (
    surahNumber: number,
    ayahNumber: number,
    surahName: string,
    arabic: string,
    translation: string,
    transliteration: string
  ) => {
    const key = `${surahNumber}:${ayahNumber}`;
    if (bookmarkedMap[key]) {
      // Already bookmarked - find and delete
      const existing = bookmarksList.find(
        (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
      );
      if (existing) {
        handleDeleteBookmark(existing.id);
      }
      return;
    }

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest-user",
          surahNumber,
          ayahNumber,
          surahName,
          arabicText: arabic,
          translationText: translation,
          transliterationText: transliteration,
          note: "Personal saved reflection",
        }),
      });

      const data = await res.json();
      if (data.success && data.bookmark) {
        setBookmarksList((prev) => [data.bookmark, ...prev]);
        setBookmarkedMap((prev) => ({ ...prev, [key]: true }));
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      }
    } catch (err) {
      console.error("Failed to save bookmark:", err);
    }
  };

  const handleDeleteBookmark = async (id: number) => {
    try {
      await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" });
      setBookmarksList((prev) => {
        const item = prev.find((b) => b.id === id);
        if (item) {
          const key = `${item.surahNumber}:${item.ayahNumber}`;
          setBookmarkedMap((bm) => {
            const next = { ...bm };
            delete next[key];
            return next;
          });
        }
        return prev.filter((b) => b.id !== id);
      });
    } catch (err) {
      console.error("Failed to delete bookmark:", err);
    }
  };

  // Quiz Passed Callback
  const handleQuizPassed = async (xpEarned: number, levelNum: number, badge: string) => {
    setXp((prev) => prev + xpEarned);
    setCurrentLevel((prev) => Math.max(prev, levelNum + 1));
    setEarnedBadges((prev) => Array.from(new Set([...prev, badge])));

    try {
      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest-user",
          lessonId: `quiz_level_${levelNum}`,
          level: levelNum,
          score: 100,
          totalQuestions: 5,
          passed: true,
          xpEarned,
          lessonBadge: badge,
        }),
      });
    } catch (err) {
      console.error("Failed to submit quiz score:", err);
    }
  };

  // Jump from search or bookmarks to specific Surah & Ayah
  const handleSelectSurahAndAyah = (surahNumber: number, ayahNumber?: number) => {
    setCurrentSurahNumber(surahNumber);
    if (ayahNumber) {
      setHighlightAyahNumber(ayahNumber);
    }
    setActiveTab("quran");
  };

  const handleOpenVoiceRecorderForAyah = (
    surahNumber: number,
    ayahNumber: number,
    text?: string,
    trans?: string,
    meaning?: string
  ) => {
    const meta = SURAH_LIST.find((s) => s.number === surahNumber);
    setVoiceRecorderData({
      isOpen: true,
      surahNumber,
      ayahNumber,
      surahName: meta?.nameTransliterated || `Surah ${surahNumber}`,
      arabicText: text || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      transliteration: trans || "Bismi-Llaahir-Rahmaanir-Raheem",
      translation: meaning || "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    });
  };

  return (
    <div className="min-h-screen bg-[#04130f] text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        streakCount={streakCount}
        xp={xp}
        currentLevel={currentLevel}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-5 sm:pt-7">
        {/* TAB 1: LEARN QURAN (GAMIFIED PATHWAY) */}
        {activeTab === "learn" && (
          <LearnQuranTab
            currentLevel={currentLevel}
            completedLessons={completedLessons}
            earnedBadges={earnedBadges}
            onOpenQuiz={(quizKey, levelNum, levelTitle, badgeName) => {
              setQuizModalData({
                isOpen: true,
                quizKey,
                levelNumber: levelNum,
                levelTitle,
                badgeName,
              });
            }}
            onOpenCertificate={(levelNum, levelTitle, badgeName) => {
              setCertificateData({
                isOpen: true,
                levelNumber: levelNum,
                levelTitle,
                badgeName,
              });
            }}
            onSelectSurahForPractice={(surahNum) => {
              setCurrentSurahNumber(surahNum);
              setActiveTab("quran");
            }}
            onOpenVoiceRecorder={(surahNum, ayahNum) => {
              handleOpenVoiceRecorderForAyah(surahNum, ayahNum);
            }}
          />
        )}

        {/* TAB 2: FULL QURAN READER (114 SURAHS / 30 JUZ) */}
        {activeTab === "quran" && (
          <QuranReaderTab
            currentSurahNumber={currentSurahNumber}
            highlightAyahNumber={highlightAyahNumber}
            preferences={preferences}
            isPlayingAudio={Boolean(audioState?.isPlaying)}
            playingAyahNumber={audioState?.ayahNumber}
            onPlayAyah={handlePlayAyah}
            onOpenVoiceRecorder={handleOpenVoiceRecorderForAyah}
            onSaveBookmark={handleSaveBookmark}
            bookmarkedAyahs={bookmarkedMap}
          />
        )}

        {/* TAB 3: TAJWEED MASTERCLASS */}
        {activeTab === "tajweed" && (
          <TajweedMasterclassTab
            onOpenQuiz={(quizKey, levelNum, levelTitle, badgeName) => {
              setQuizModalData({
                isOpen: true,
                quizKey,
                levelNumber: levelNum,
                levelTitle,
                badgeName,
              });
            }}
            onOpenQuranAtSurah={handleSelectSurahAndAyah}
          />
        )}

        {/* TAB 4: VOCABULARY FLASHCARDS */}
        {activeTab === "vocab" && (
          <VocabularyFlashcardsTab
            onAddXp={(amount) => setXp((prev) => prev + amount)}
            onOpenQuiz={() => {
              setQuizModalData({
                isOpen: true,
                quizKey: "quiz_level_4",
                levelNumber: 4,
                levelTitle: "Level 4: Quranic Vocabulary",
                badgeName: "Vocabulary Master",
              });
            }}
          />
        )}

        {/* TAB 5: MY GOALS, STREAKS & BOOKMARKS */}
        {activeTab === "bookmarks" && (
          <BookmarksTab
            bookmarksList={bookmarksList}
            streakCount={streakCount}
            xp={xp}
            dailyGoalMinutes={preferences.dailyGoalMinutes}
            minutesSpentToday={minutesSpentToday}
            onSelectSurahAndAyah={handleSelectSurahAndAyah}
            onDeleteBookmark={handleDeleteBookmark}
            onPlayAyahAudio={(surahNum, ayahNum, surahName) => {
              const meta = SURAH_LIST.find((s) => s.number === surahNum);
              handlePlayAyah(surahNum, ayahNum, surahName, meta?.versesCount || 7);
            }}
          />
        )}

        {/* TAB 6: ANDROID & GOOGLE PLAY STORE PUBLISHING HUB */}
        {activeTab === "android_hub" && <AndroidPublishingHubTab />}
      </main>

      {/* Persistent Recitation Audio Player Bar */}
      <AudioPlayerBar
        audioState={audioState}
        onPlayPauseToggle={() => {
          if (audioState) {
            setAudioState({ ...audioState, isPlaying: !audioState.isPlaying });
          }
        }}
        onNextAyah={handleNextAyah}
        onPrevAyah={handlePrevAyah}
        onOpenVoiceRecorder={(surahNum, ayahNum) => {
          handleOpenVoiceRecorderForAyah(surahNum, ayahNum);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClosePlayer={() => setAudioState(null)}
      />

      {/* Quick Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSurah={handleSelectSurahAndAyah}
        onSelectTajweedRule={(ruleId) => {
          setActiveTab("tajweed");
        }}
      />

      {/* Tajweed Voice Recorder Practice Modal */}
      <VoiceRecorderModal
        isOpen={voiceRecorderData.isOpen}
        onClose={() => setVoiceRecorderData((prev) => ({ ...prev, isOpen: false }))}
        surahNumber={voiceRecorderData.surahNumber}
        ayahNumber={voiceRecorderData.ayahNumber}
        surahName={voiceRecorderData.surahName}
        arabicText={voiceRecorderData.arabicText}
        transliteration={voiceRecorderData.transliteration}
        translation={voiceRecorderData.translation}
        reciterSubfolder={preferences.preferredReciter}
        onRecordCompleted={() => {
          setXp((prev) => prev + 30);
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
        }}
      />

      {/* Interactive Level Quiz Modal */}
      <QuizModal
        isOpen={quizModalData.isOpen}
        onClose={() => setQuizModalData((prev) => ({ ...prev, isOpen: false }))}
        quizKey={quizModalData.quizKey}
        levelNumber={quizModalData.levelNumber}
        levelTitle={quizModalData.levelTitle}
        badgeName={quizModalData.badgeName}
        onQuizPassed={handleQuizPassed}
        onOpenCertificate={(levelNum, levelTitle, badgeName) => {
          setCertificateData({
            isOpen: true,
            levelNumber: levelNum,
            levelTitle,
            badgeName,
          });
        }}
      />

      {/* Verified Graduation Certificate Modal */}
      <CertificateModal
        isOpen={certificateData.isOpen}
        onClose={() => setCertificateData((prev) => ({ ...prev, isOpen: false }))}
        userName={preferences.name}
        levelNumber={certificateData.levelNumber}
        levelTitle={certificateData.levelTitle}
        badgeName={certificateData.badgeName}
      />

      {/* App Settings & Qari Selector Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
      />
    </div>
  );
}
