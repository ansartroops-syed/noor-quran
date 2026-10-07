"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
  Mic,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  X,
  Gauge,
  Loader2,
} from "lucide-react";
import { getAyahFallbackUrls } from "@/lib/audioEngine";

export interface ActiveAudioState {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  totalAyahs: number;
  isPlaying: boolean;
  reciterSubfolder: string;
}

interface AudioPlayerBarProps {
  audioState: ActiveAudioState | null;
  onPlayPauseToggle: () => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  onOpenVoiceRecorder: (surahNumber: number, ayahNumber: number) => void;
  onOpenSettings: () => void;
  onClosePlayer: () => void;
}

export function AudioPlayerBar({
  audioState,
  onPlayPauseToggle,
  onNextAyah,
  onPrevAyah,
  onOpenVoiceRecorder,
  onOpenSettings,
  onClosePlayer,
}: AudioPlayerBarProps) {
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [repeatMode, setRepeatMode] = useState<"none" | "single" | "continuous">("continuous");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackIndexRef = useRef(0);
  const urlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!audioState) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    const fallbackList = getAyahFallbackUrls(
      audioState.surahNumber,
      audioState.ayahNumber,
      audioState.reciterSubfolder
    );
    urlsRef.current = fallbackList;
    fallbackIndexRef.current = 0;

    setIsLoading(true);

    if (!audioRef.current) {
      audioRef.current = new Audio(fallbackList[0]);
    } else {
      audioRef.current.src = fallbackList[0];
    }

    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.volume = isMuted ? 0 : volume;

    audioRef.current.onwaiting = () => setIsLoading(true);
    audioRef.current.oncanplay = () => setIsLoading(false);
    audioRef.current.onplaying = () => setIsLoading(false);

    audioRef.current.ontimeupdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    };

    // Auto-fallback if CDN URL fails
    audioRef.current.onerror = () => {
      if (fallbackIndexRef.current < urlsRef.current.length - 1) {
        fallbackIndexRef.current += 1;
        console.warn(`Audio primary CDN failed, attempting fallback CDN index ${fallbackIndexRef.current}...`);
        if (audioRef.current) {
          audioRef.current.src = urlsRef.current[fallbackIndexRef.current];
          if (audioState.isPlaying) {
            audioRef.current.play().catch(console.warn);
          }
        }
      } else {
        setIsLoading(false);
      }
    };

    audioRef.current.onended = () => {
      if (repeatMode === "single") {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(console.error);
        }
      } else if (repeatMode === "continuous") {
        if (audioState.ayahNumber < audioState.totalAyahs) {
          onNextAyah();
        }
      }
    };

    if (audioState.isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio autoplay blocked by browser policy:", err);
        setIsLoading(false);
      });
    } else {
      audioRef.current.pause();
      setIsLoading(false);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.ontimeupdate = null;
        audioRef.current.onerror = null;
        audioRef.current.onwaiting = null;
        audioRef.current.oncanplay = null;
      }
    };
  }, [audioState?.surahNumber, audioState?.ayahNumber, audioState?.reciterSubfolder, audioState?.isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  if (!audioState) return null;

  const toggleRepeat = () => {
    if (repeatMode === "continuous") setRepeatMode("single");
    else if (repeatMode === "single") setRepeatMode("none");
    else setRepeatMode("continuous");
  };

  const cycleSpeed = () => {
    if (playbackSpeed === 1.0) setPlaybackSpeed(0.75);
    else if (playbackSpeed === 0.75) setPlaybackSpeed(0.5);
    else if (playbackSpeed === 0.5) setPlaybackSpeed(1.25);
    else setPlaybackSpeed(1.0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatSecs = (sec: number) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#041a14]/95 backdrop-blur-md border-t border-emerald-500/30 shadow-2xl p-2.5 sm:p-3 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
        {/* Ayah Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-xs shrink-0">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : audioState.ayahNumber}
            </span>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1.5">
                {audioState.surahName}
                {audioState.isPlaying && (
                  <span className="flex items-center gap-0.5 h-3">
                    <span className="w-0.5 bg-emerald-400 rounded-full audio-bar-1" />
                    <span className="w-0.5 bg-emerald-400 rounded-full audio-bar-2" />
                    <span className="w-0.5 bg-emerald-400 rounded-full audio-bar-3" />
                  </span>
                )}
              </div>
              <div className="text-[11px] text-emerald-400">
                Ayah {audioState.ayahNumber} of {audioState.totalAyahs}
              </div>
            </div>
          </div>

          <button
            onClick={onClosePlayer}
            className="sm:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audio Controls */}
        <div className="flex flex-col items-center gap-1 w-full sm:w-auto sm:max-w-md flex-1">
          <div className="flex items-center gap-3">
            {/* Repeat Mode */}
            <button
              onClick={toggleRepeat}
              title={`Repeat: ${repeatMode}`}
              className={`p-1.5 rounded-lg transition text-xs flex items-center gap-1 ${
                repeatMode === "single"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : repeatMode === "continuous"
                  ? "text-emerald-400 hover:bg-emerald-900/50"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {repeatMode === "single" ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>

            {/* Prev */}
            <button
              onClick={onPrevAyah}
              disabled={audioState.ayahNumber <= 1}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 transition"
              title="Previous Ayah"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={onPlayPauseToggle}
              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30 transition transform active:scale-95"
              title={audioState.isPlaying ? "Pause Recitation" : "Play Recitation"}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
              ) : audioState.isPlaying ? (
                <Pause className="w-5 h-5 fill-slate-950" />
              ) : (
                <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={onNextAyah}
              disabled={audioState.ayahNumber >= audioState.totalAyahs}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 transition"
              title="Next Ayah"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            {/* Speed Selector */}
            <button
              onClick={cycleSpeed}
              title="Playback Speed (Slow learning mode)"
              className="px-2 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-900 transition flex items-center gap-1"
            >
              <Gauge className="w-3 h-3" />
              {playbackSpeed}x
            </button>

            {/* Volume Control */}
            <div className="relative">
              <button
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white transition"
                title={isMuted ? "Unmute" : `Volume ${Math.round(volume * 100)}%`}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
              </button>

              {showVolumeSlider && (
                <div
                  onMouseLeave={() => setShowVolumeSlider(false)}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2 rounded-xl bg-[#041a14] border border-emerald-700 shadow-xl flex items-center gap-2 z-50 w-28"
                >
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(Number(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-full accent-emerald-400 h-1.5 bg-emerald-950 rounded cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Time Seek Bar */}
          <div className="flex items-center gap-2 w-full text-[10px] text-slate-400">
            <span className="w-8 text-right font-mono">{formatSecs(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-emerald-400 h-1 rounded-lg bg-emerald-950 cursor-pointer"
            />
            <span className="w-8 font-mono">{formatSecs(duration)}</span>
          </div>
        </div>

        {/* Right Tools (Voice Recorder & Settings) */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => onOpenVoiceRecorder(audioState.surahNumber, audioState.ayahNumber)}
            className="px-3 py-1.5 rounded-xl bg-teal-800/60 hover:bg-teal-700 text-teal-200 font-semibold text-xs flex items-center gap-1.5 border border-teal-500/30 transition shadow-sm"
          >
            <Mic className="w-3.5 h-3.5 text-teal-300" /> Practice Voice
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition"
            title="Qari Reciter & Script Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={onClosePlayer}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-emerald-950 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
