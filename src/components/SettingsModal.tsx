"use client";

import React, { useState } from "react";
import { X, Settings, Volume2, Type, Sliders, Palette, Target, Check, User, Play, Loader2, Sparkles } from "lucide-react";
import { AVAILABLE_RECITERS, testQuranAudio, playHarmonicChime } from "@/lib/audioEngine";

export interface UserPreferences {
  name: string;
  preferredReciter: string;
  preferredScript: string;
  preferredTranslation: string;
  arabicFontSize: number;
  showTransliteration: boolean;
  showTranslation: boolean;
  showTajweedColors: boolean;
  dailyGoalMinutes: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (newPrefs: Partial<UserPreferences>) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}: SettingsModalProps) {
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestAudio = async () => {
    setIsTestingAudio(true);
    setTestSuccess(false);
    playHarmonicChime(580);
    await testQuranAudio(preferences.preferredReciter);
    setIsTestingAudio(false);
    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-emerald-500/40 bg-[#06241c] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#041a14] border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Settings className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-white text-base">App Settings & Audio Options</h3>
              <p className="text-xs text-emerald-400">Reciter, Sound, Typography & Targets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm">
          {/* Audio Health Check Button */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-[#041e16] border border-emerald-500/30 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-400" /> Test Speaker & Audio Engine
              </div>
              <div className="text-[11px] text-slate-400">Plays Bismillah test sample via EveryAyah CDN</div>
            </div>
            <button
              onClick={handleTestAudio}
              disabled={isTestingAudio}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              {isTestingAudio ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Playing...
                </>
              ) : testSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-300" /> Working!
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" /> Test Audio
                </>
              )}
            </button>
          </div>

          {/* Learner Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Learner Name (For Graduation Certificates)
            </label>
            <input
              type="text"
              value={preferences.name}
              onChange={(e) => onUpdatePreferences({ name: e.target.value })}
              placeholder="e.g. Abdullah or Fatima"
              className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 focus:border-emerald-400 focus:outline-none text-white text-sm"
            />
          </div>

          {/* Reciter Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" /> Default Qari Reciter
            </label>
            <div className="space-y-2">
              {AVAILABLE_RECITERS.map((reciter) => {
                const isSelected = preferences.preferredReciter === reciter.subfolder;
                return (
                  <button
                    key={reciter.id}
                    onClick={() => {
                      onUpdatePreferences({ preferredReciter: reciter.subfolder });
                      playHarmonicChime(520);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-900/60 border-emerald-400 text-white ring-1 ring-emerald-400"
                        : "bg-emerald-950/40 border-emerald-900/60 text-slate-300 hover:border-emerald-700"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-2">
                        {reciter.name}
                        {reciter.isSlowForLearning && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Teacher Mode (Slow)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{reciter.subname}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Arabic Typography Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" /> Arabic Font Size: {preferences.arabicFontSize}px
              </label>
            </div>
            <input
              type="range"
              min={20}
              max={44}
              step={2}
              value={preferences.arabicFontSize}
              onChange={(e) => onUpdatePreferences({ arabicFontSize: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-center">
              <span
                className="font-arabic text-emerald-200"
                style={{ fontSize: `${preferences.arabicFontSize}px` }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>
          </div>

          {/* Display Toggles */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Quran View Elements
            </label>

            {/* Tajweed Colors */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-900">
              <div>
                <div className="font-medium text-white text-sm">Tajweed Color Highlights</div>
                <div className="text-xs text-slate-400">Color-code Qalqalah, Ghunnah, Madd & Ikhfa</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.showTajweedColors}
                onChange={(e) => onUpdatePreferences({ showTajweedColors: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {/* Transliteration */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-900">
              <div>
                <div className="font-medium text-white text-sm">English Transliteration</div>
                <div className="text-xs text-slate-400">Display Roman syllable pronunciation guide</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.showTransliteration}
                onChange={(e) => onUpdatePreferences({ showTransliteration: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {/* English Translation */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-900">
              <div>
                <div className="font-medium text-white text-sm">English Translation</div>
                <div className="text-xs text-slate-400">Saheeh International / Clear Quran</div>
              </div>
              <input
                type="checkbox"
                checked={preferences.showTranslation}
                onChange={(e) => onUpdatePreferences({ showTranslation: e.target.checked })}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Daily Goal Target */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Daily Target: {preferences.dailyGoalMinutes} Minutes
            </label>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={preferences.dailyGoalMinutes}
              onChange={(e) => onUpdatePreferences({ dailyGoalMinutes: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#041a14] border-t border-emerald-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
