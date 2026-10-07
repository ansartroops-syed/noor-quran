"use client";

import React, { useRef } from "react";
import { X, Award, Printer, Download, Sparkles, CheckCircle2 } from "lucide-react";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  levelNumber: number;
  levelTitle: string;
  badgeName: string;
}

export function CertificateModal({
  isOpen,
  onClose,
  userName,
  levelNumber,
  levelTitle,
  badgeName,
}: CertificateModalProps) {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const certificateId = `NQ-${levelNumber}${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl border border-amber-500/40 bg-[#06241c] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="p-4 bg-[#041a14] border-b border-emerald-800/40 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-white text-base">Graduation Certificate</h3>
              <p className="text-xs text-amber-400">Verified Quranic Learning Milestone</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900/50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <div
            ref={certRef}
            className="relative p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-[#052b22] via-[#041d16] to-[#02130e] border-4 border-amber-400/80 shadow-2xl text-center space-y-6 text-slate-100 overflow-hidden"
          >
            {/* Islamic Gold Corner Accents */}
            <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-amber-400 opacity-80" />
            <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-amber-400 opacity-80" />
            <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-amber-400 opacity-80" />
            <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-amber-400 opacity-80" />

            {/* Bismillah Header */}
            <div className="space-y-1">
              <p className="font-arabic text-2xl sm:text-3xl text-amber-300" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold">
                NOOR QURAN ACADEMY • CERTIFICATE OF ACHIEVEMENT
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-tight">
                CERTIFICATE OF COMPLETION
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 italic">
                This certifies that the esteemed student
              </p>
            </div>

            {/* Student Name */}
            <div className="py-2 border-b-2 border-amber-400/60 inline-block px-8 sm:px-14">
              <h2 className="text-xl sm:text-3xl font-bold text-white tracking-wide">
                {userName || "Seeker of Knowledge"}
              </h2>
            </div>

            {/* Achievement text */}
            <div className="space-y-2 max-w-xl mx-auto">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                has successfully mastered and demonstrated proficiency in the curriculum of
              </p>
              <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/30">
                <span className="font-bold text-amber-300 text-sm sm:text-base">{levelTitle}</span>
                <p className="text-xs text-emerald-300 mt-0.5">Awarded Badge Title: {badgeName}</p>
              </div>
            </div>

            {/* Badges and Signatures */}
            <div className="pt-4 grid grid-cols-3 items-end text-xs text-slate-300 gap-2">
              <div className="text-left space-y-1">
                <div className="font-mono text-[10px] text-slate-400">ID: {certificateId}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Completion
                </div>
              </div>

              {/* Gold Seal */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-bold shadow-xl border-2 border-yellow-200 ring-4 ring-amber-400/20">
                  <div className="text-center">
                    <Sparkles className="w-5 h-5 mx-auto" />
                    <span className="text-[9px] uppercase tracking-tighter font-extrabold block">HONOR</span>
                  </div>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-xs font-semibold text-slate-200">{currentDate}</div>
                <div className="text-[10px] text-slate-400 border-t border-slate-700 pt-1">
                  Noor Quran Academic Board
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#041a14] border-t border-emerald-800/40 flex justify-between items-center print:hidden">
          <span className="text-xs text-slate-400">
            Share with family & keep building your Quran recitation streak!
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition"
          >
            Close & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
