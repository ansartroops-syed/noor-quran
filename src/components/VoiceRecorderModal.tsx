"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, RotateCcw, X, Volume2, CheckCircle2, Award, Sparkles } from "lucide-react";
import { RecitationVoiceRecorder, getAyahAudioUrl } from "@/lib/audioEngine";

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  reciterSubfolder?: string;
  onRecordCompleted?: () => void;
}

export function VoiceRecorderModal({
  isOpen,
  onClose,
  surahNumber,
  ayahNumber,
  surahName,
  arabicText,
  transliteration,
  translation,
  reciterSubfolder = "Alafasy_128kbps",
  onRecordCompleted,
}: VoiceRecorderModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingUser, setIsPlayingUser] = useState(false);
  const [isPlayingQari, setIsPlayingQari] = useState(false);

  // Self assessment checklist
  const [checks, setChecks] = useState({
    pronunciation: false,
    maddCount: false,
    ghunnahNasal: false,
    qalqalahEcho: false,
  });

  const recorderRef = useRef<RecitationVoiceRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);
  const qariAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recorderRef.current && isRecording) {
        recorderRef.current.stopRecording();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (userAudioRef.current) userAudioRef.current.pause();
      if (qariAudioRef.current) qariAudioRef.current.pause();
      setIsRecording(false);
      setRecordingTime(0);
      setRecordedAudioUrl(null);
      setIsPlayingUser(false);
      setIsPlayingQari(false);
      setChecks({
        pronunciation: false,
        maddCount: false,
        ghunnahNasal: false,
        qalqalahEcho: false,
      });
    } else {
      recorderRef.current = new RecitationVoiceRecorder();
    }
  }, [isOpen, isRecording]);

  const toggleRecording = async () => {
    if (!recorderRef.current) return;

    if (!isRecording) {
      const started = await recorderRef.current.startRecording();
      if (started) {
        setIsRecording(true);
        setRecordingTime(0);
        setRecordedAudioUrl(null);
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      }
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      const url = await recorderRef.current.stopRecording();
      setIsRecording(false);
      setRecordedAudioUrl(url);
      if (onRecordCompleted) onRecordCompleted();
    }
  };

  const playQariAudio = () => {
    if (!qariAudioRef.current) {
      const qariUrl = getAyahAudioUrl(surahNumber, ayahNumber, reciterSubfolder);
      const audio = new Audio(qariUrl);
      qariAudioRef.current = audio;
      audio.onended = () => setIsPlayingQari(false);
      audio.onpause = () => setIsPlayingQari(false);
    }

    if (isPlayingQari) {
      qariAudioRef.current.pause();
      setIsPlayingQari(false);
    } else {
      if (userAudioRef.current) userAudioRef.current.pause();
      setIsPlayingUser(false);
      qariAudioRef.current.currentTime = 0;
      qariAudioRef.current.play();
      setIsPlayingQari(true);
    }
  };

  const playUserAudio = () => {
    if (!recordedAudioUrl) return;

    if (!userAudioRef.current) {
      const audio = new Audio(recordedAudioUrl);
      userAudioRef.current = audio;
      audio.onended = () => setIsPlayingUser(false);
      audio.onpause = () => setIsPlayingUser(false);
    }

    if (isPlayingUser) {
      userAudioRef.current.pause();
      setIsPlayingUser(false);
    } else {
      if (qariAudioRef.current) qariAudioRef.current.pause();
      setIsPlayingQari(false);
      userAudioRef.current.currentTime = 0;
      userAudioRef.current.play();
      setIsPlayingUser(true);
    }
  };

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  if (!isOpen) return null;

  const scoreCount = Object.values(checks).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-emerald-500/40 bg-[#06241c] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#041a14] border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Mic className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-white text-base">Tajweed Voice Practice Studio</h3>
              <p className="text-xs text-emerald-400">
                {surahName} • Ayah {ayahNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ayah Display */}
        <div className="p-5 overflow-y-auto space-y-5">
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-center space-y-3">
            <p className="font-arabic text-2xl sm:text-3xl text-emerald-200 leading-loose" dir="rtl">
              {arabicText}
            </p>
            <p className="text-sm font-medium text-amber-300/90 italic">{transliteration}</p>
            <p className="text-xs text-slate-300">{translation}</p>
          </div>

          {/* Reciter vs Student Audio Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Qari Recitation */}
            <div className="p-3.5 rounded-xl bg-[#041a14] border border-emerald-900/80 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> 1. Listen to Qari
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300">
                  Master Track
                </span>
              </div>
              <button
                onClick={playQariAudio}
                className="w-full py-2.5 px-3 rounded-lg bg-emerald-800/70 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition"
              >
                {isPlayingQari ? (
                  <>
                    <Pause className="w-4 h-4 text-emerald-300 animate-pulse" /> Pause Qari
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" /> Play Sheikh Recitation
                  </>
                )}
              </button>
            </div>

            {/* Student Recording */}
            <div className="p-3.5 rounded-xl bg-[#041a14] border border-emerald-900/80 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-teal-400 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" /> 2. Your Recitation
                </span>
                {recordedAudioUrl && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-900 text-teal-300">
                    Recorded
                  </span>
                )}
              </div>
              {recordedAudioUrl ? (
                <button
                  onClick={playUserAudio}
                  className="w-full py-2.5 px-3 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-medium text-xs flex items-center justify-center gap-2 transition"
                >
                  {isPlayingUser ? (
                    <>
                      <Pause className="w-4 h-4 text-teal-200 animate-pulse" /> Pause Your Voice
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" /> Play Your Recitation
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center py-2 text-xs text-slate-500">
                  Click Record below to start
                </div>
              )}
            </div>
          </div>

          {/* Record Button & Visualizer */}
          <div className="text-center p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 space-y-3">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleRecording}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
                  isRecording
                    ? "bg-rose-600 animate-pulse ring-4 ring-rose-500/40"
                    : "bg-emerald-600 hover:bg-emerald-500 ring-4 ring-emerald-500/20"
                }`}
              >
                {isRecording ? <Square className="w-6 h-6 fill-white" /> : <Mic className="w-7 h-7" />}
              </button>
            </div>

            {isRecording && (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-sm font-bold text-rose-400">Recording... {formatTime(recordingTime)}</span>
                </div>
                <div className="flex items-center justify-center gap-1 h-6">
                  <span className="w-1 bg-rose-400 rounded-full audio-bar-1" />
                  <span className="w-1 bg-rose-400 rounded-full audio-bar-2" />
                  <span className="w-1 bg-rose-400 rounded-full audio-bar-3" />
                  <span className="w-1 bg-rose-400 rounded-full audio-bar-4" />
                  <span className="w-1 bg-rose-400 rounded-full audio-bar-2" />
                </div>
              </div>
            )}

            {!isRecording && recordedAudioUrl && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={toggleRecording}
                  className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-xs text-emerald-300 flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-record
                </button>
              </div>
            )}
          </div>

          {/* Self-Assessment Rubric */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Tajweed Self-Evaluation Checklist ({scoreCount}/4)
              </h4>
              {scoreCount === 4 && (
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Flawless Tajweed!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => toggleCheck("pronunciation")}
                className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition ${
                  checks.pronunciation
                    ? "bg-emerald-900/50 border-emerald-500/80 text-white"
                    : "bg-emerald-950/30 border-emerald-900/50 text-slate-300 hover:border-emerald-700"
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    checks.pronunciation ? "text-emerald-400" : "text-slate-500"
                  }`}
                />
                <div>
                  <div className="font-medium">Accurate Letter Makharij</div>
                  <div className="text-[10px] text-slate-400">Crisp throat, tongue & lip letters</div>
                </div>
              </button>

              <button
                onClick={() => toggleCheck("maddCount")}
                className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition ${
                  checks.maddCount
                    ? "bg-emerald-900/50 border-emerald-500/80 text-white"
                    : "bg-emerald-950/30 border-emerald-900/50 text-slate-300 hover:border-emerald-700"
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    checks.maddCount ? "text-emerald-400" : "text-slate-500"
                  }`}
                />
                <div>
                  <div className="font-medium">Proper Madd Elongation</div>
                  <div className="text-[10px] text-slate-400">Held for 2, 4, or 6 counts</div>
                </div>
              </button>

              <button
                onClick={() => toggleCheck("ghunnahNasal")}
                className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition ${
                  checks.ghunnahNasal
                    ? "bg-emerald-900/50 border-emerald-500/80 text-white"
                    : "bg-emerald-950/30 border-emerald-900/50 text-slate-300 hover:border-emerald-700"
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    checks.ghunnahNasal ? "text-emerald-400" : "text-slate-500"
                  }`}
                />
                <div>
                  <div className="font-medium">2-Count Ghunnah</div>
                  <div className="text-[10px] text-slate-400">Held in nose on نّ / مّ / Ikhfa</div>
                </div>
              </button>

              <button
                onClick={() => toggleCheck("qalqalahEcho")}
                className={`p-2.5 rounded-lg border text-left flex items-start gap-2 transition ${
                  checks.qalqalahEcho
                    ? "bg-emerald-900/50 border-emerald-500/80 text-white"
                    : "bg-emerald-950/30 border-emerald-900/50 text-slate-300 hover:border-emerald-700"
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    checks.qalqalahEcho ? "text-emerald-400" : "text-slate-500"
                  }`}
                />
                <div>
                  <div className="font-medium">Clean Qalqalah Bounce</div>
                  <div className="text-[10px] text-slate-400">Crisp echo on ق ط ب ج د</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#041a14] border-t border-emerald-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition"
          >
            Done & Save Practice
          </button>
        </div>
      </div>
    </div>
  );
}
