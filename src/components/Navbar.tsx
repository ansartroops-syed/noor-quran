"use client";

import React, { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Layers,
  Bookmark,
  Smartphone,
  Search,
  Settings,
  Flame,
  Award,
  Volume2,
  Check,
} from "lucide-react";
import { testQuranAudio, playHarmonicChime } from "@/lib/audioEngine";

export type AppTab = "learn" | "quran" | "tajweed" | "vocab" | "bookmarks" | "android_hub";

interface NavbarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  streakCount: number;
  xp: number;
  currentLevel: number;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  isPlayingAudio?: boolean;
}

export function Navbar({
  activeTab,
  onTabChange,
  streakCount,
  xp,
  currentLevel,
  onOpenSearch,
  onOpenSettings,
  isPlayingAudio = false,
}: NavbarProps) {
  const [testingAudio, setTestingAudio] = useState(false);

  const tabs = [
    { id: "learn", label: "Learn Quran", icon: GraduationCap, badge: "Levels 1-6" },
    { id: "quran", label: "Full Quran", icon: BookOpen, badge: "114 Surahs" },
    { id: "tajweed", label: "Tajweed Guide", icon: Sparkles },
    { id: "vocab", label: "Vocabulary", icon: Layers, badge: "Top 100" },
    { id: "bookmarks", label: "My Goals & Notes", icon: Bookmark },
    {
      id: "android_hub",
      label: "Android & Play Store",
      icon: Smartphone,
      isSpecial: true,
      badge: "Publish Guide",
    },
  ];

  const handleTestAudioClick = async () => {
    setTestingAudio(true);
    playHarmonicChime(580);
    await testQuranAudio();
    setTestingAudio(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#041610]/95 backdrop-blur-md border-b border-emerald-500/20 shadow-lg">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <button
          onClick={() => onTabChange("learn")}
          className="flex items-center gap-2.5 group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-[2px] shadow-md group-hover:scale-105 transition">
            <div className="w-full h-full bg-[#041a14] rounded-[10px] flex items-center justify-center">
              <span className="font-arabic text-xl font-bold text-amber-300">نُور</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base sm:text-lg tracking-tight group-hover:text-emerald-300 transition">
                Noor Quran
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Learn Quran from Basics to Advanced & Complete Quran
            </p>
          </div>
        </button>

        {/* Center / Right Badges & Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Quick Test Button */}
          <button
            onClick={handleTestAudioClick}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition ${
              isPlayingAudio || testingAudio
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 animate-pulse"
                : "bg-emerald-950/60 text-slate-300 hover:text-white border-emerald-800"
            }`}
            title="Click to test audio playback"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{testingAudio ? "Playing Test..." : isPlayingAudio ? "Audio Playing" : "Test Audio"}</span>
          </button>

          {/* Streak Counter */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/60 border border-amber-600/40 text-amber-400 text-xs font-bold shadow-sm"
            title={`${streakCount} day learning streak!`}
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{streakCount} {streakCount === 1 ? "Day" : "Days"}</span>
          </div>

          {/* XP & Level Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-bold"
            title={`Level ${currentLevel} Reciter • ${xp} XP`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Lvl {currentLevel} •</span>
            <span>{xp} XP</span>
          </div>

          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition"
            title="Search Quran (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-slate-300 hover:text-white border border-emerald-800 transition"
            title="Preferences & Audio Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-emerald-900/30 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          let btnClass =
            "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ";

          if (tab.isSpecial) {
            btnClass += isActive
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 font-bold "
              : "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 ";
          } else {
            btnClass += isActive
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 "
              : "text-slate-300 hover:text-white hover:bg-emerald-950/60 ";
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as AppTab)}
              className={btnClass}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-tighter font-extrabold ${
                    isActive
                      ? tab.isSpecial
                        ? "bg-slate-950/20 text-slate-950"
                        : "bg-white/20 text-white"
                      : "bg-emerald-900 text-emerald-300"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
