"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, XCircle, Award, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { QUIZ_DATABASE, QuizQuestion } from "@/data/quizDatabase";
import { playHarmonicChime } from "@/lib/audioEngine";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizKey: string;
  levelNumber: number;
  levelTitle: string;
  badgeName: string;
  onQuizPassed: (xpEarned: number, level: number, badge: string) => void;
  onOpenCertificate: (levelNumber: number, levelTitle: string, badgeName: string) => void;
}

export function QuizModal({
  isOpen,
  onClose,
  quizKey,
  levelNumber,
  levelTitle,
  badgeName,
  onQuizPassed,
  onOpenCertificate,
}: QuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const qList = QUIZ_DATABASE[quizKey] || QUIZ_DATABASE["quiz_level_1"] || [];
      setQuestions(qList);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setScore(0);
      setIsCompleted(false);
    }
  }, [isOpen, quizKey]);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const isCorrect = selectedOption === currentQ.correctIndex;
  const passingScore = Math.ceil(totalQ * 0.7);
  const passed = score >= passingScore;

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      playHarmonicChime(580);
    } else {
      playHarmonicChime(220);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQ - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz finished
      setIsCompleted(true);
      const finalScore = isCorrect ? score + 1 : score;
      const didPass = finalScore >= passingScore;

      if (didPass) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
        onQuizPassed(150, levelNumber, badgeName);
      }
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-emerald-500/40 bg-[#06241c] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#041a14] border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-white text-base">Level {levelNumber} Assessment</h3>
              <p className="text-xs text-emerald-400">{levelTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[75vh]">
          {!isCompleted ? (
            <div className="space-y-5">
              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Question {currentIndex + 1} of {totalQ}</span>
                  <span>Score: {score}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-emerald-950 overflow-hidden border border-emerald-900">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="space-y-2">
                <h4 className="text-base sm:text-lg font-semibold text-slate-100">
                  {currentQ.question}
                </h4>
                {currentQ.arabicPrompt && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-center">
                    <span className="font-arabic text-3xl sm:text-4xl text-amber-300 font-bold">
                      {currentQ.arabicPrompt}
                    </span>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = "bg-emerald-950/40 border-emerald-900 hover:border-emerald-600 text-slate-200";

                  if (selectedOption === idx) {
                    btnStyle = "bg-emerald-800/80 border-emerald-400 text-white ring-2 ring-emerald-500/30";
                  }

                  if (isAnswerSubmitted) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = "bg-emerald-900/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400";
                    } else if (selectedOption === idx) {
                      btnStyle = "bg-rose-950/90 border-rose-500 text-rose-200";
                    } else {
                      btnStyle = "bg-emerald-950/20 border-emerald-950 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-3.5 rounded-xl border text-left text-sm font-medium transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && idx === currentQ.correctIndex && (
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when submitted */}
              {isAnswerSubmitted && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-in fade-in ${
                    isCorrect
                      ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-200"
                      : "bg-rose-950/60 border-rose-500/50 text-rose-200"
                  }`}
                >
                  <div className="font-bold mb-1 flex items-center gap-1">
                    {isCorrect ? "✨ Correct!" : "❌ Not quite:"}
                  </div>
                  {currentQ.explanation}
                </div>
              )}
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6 space-y-5">
              <div
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border-4 ${
                  passed
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-8 ring-emerald-500/10"
                    : "bg-amber-500/20 border-amber-400 text-amber-300 ring-8 ring-amber-500/10"
                }`}
              >
                {passed ? <Sparkles className="w-10 h-10 animate-bounce" /> : <Award className="w-10 h-10" />}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  {passed ? "Congratulations! You Passed!" : "Good Effort! Keep Practicing"}
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  You scored <span className="font-bold text-emerald-400">{score}</span> out of{" "}
                  <span className="font-bold text-emerald-400">{totalQ}</span> ({Math.round((score / totalQ) * 100)}%)
                </p>
                {passed && (
                  <p className="text-xs text-amber-300 mt-2 font-medium">
                    🏆 Unlocked Badge: <span className="underline">{badgeName}</span> (+150 XP)
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {passed ? (
                  <>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCertificate(levelNumber, levelTitle, badgeName);
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20"
                    >
                      <Award className="w-4 h-4" /> View Graduation Certificate
                    </button>
                    <button
                      onClick={onClose}
                      className="py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm transition"
                    >
                      Continue Learning
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleRetry}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
                  >
                    <RotateCcw className="w-4 h-4" /> Try Again
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer for Question navigation */}
        {!isCompleted && (
          <div className="p-4 bg-[#041a14] border-t border-emerald-800/40 flex justify-between items-center">
            <span className="text-xs text-slate-400">
              Passing: {passingScore}/{totalQ} required
            </span>
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm transition"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-1.5 transition"
              >
                {currentIndex < totalQ - 1 ? "Next Question" : "See Final Score"} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
