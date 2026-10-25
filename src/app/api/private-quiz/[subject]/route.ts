import { NextRequest, NextResponse } from "next/server";
import { MATHS_QUIZ_LEVELS } from "@/data/private/mathsQuiz";
import { ENGLISH_QUIZ_LEVELS } from "@/data/private/englishQuiz";
import { GK_QUIZ_LEVELS } from "@/data/private/gkQuiz";

const QUIZZES = {
  maths: MATHS_QUIZ_LEVELS,
  english: ENGLISH_QUIZ_LEVELS,
  gk: GK_QUIZ_LEVELS,
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  const levels = QUIZZES[subject as keyof typeof QUIZZES];
  if (!levels) {
    return NextResponse.json({ success: false, error: "Quiz not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true, levels });
}
