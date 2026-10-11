import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quizHistory, userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId = "guest-user",
      lessonId,
      level,
      score,
      totalQuestions,
      passed,
      xpEarned,
      lessonBadge,
    } = body;

    // Record quiz attempt
    const record = await db
      .insert(quizHistory)
      .values({
        userId,
        lessonId: lessonId || "general_quiz",
        level: Number(level) || 1,
        score: Number(score) || 0,
        totalQuestions: Number(totalQuestions) || 1,
        passed: Boolean(passed),
        xpEarned: Number(xpEarned) || 50,
      })
      .returning();

    // Update user profile XP and completed lessons
    const userList = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);

    if (userList.length > 0) {
      const user = userList[0];
      const completedList = new Set(user.completedLessons || []);
      if (lessonId) completedList.add(lessonId);

      const badgesList = new Set(user.earnedBadges || []);
      if (lessonBadge) badgesList.add(lessonBadge);

      const newXP = (user.xp || 0) + (xpEarned || 50);
      let calculatedLevel = user.currentLevel;

      // Automatically advance level based on XP / passed quizzes
      if (newXP >= 2500) calculatedLevel = Math.max(calculatedLevel, 6);
      else if (newXP >= 1800) calculatedLevel = Math.max(calculatedLevel, 5);
      else if (newXP >= 1200) calculatedLevel = Math.max(calculatedLevel, 4);
      else if (newXP >= 700) calculatedLevel = Math.max(calculatedLevel, 3);
      else if (newXP >= 300) calculatedLevel = Math.max(calculatedLevel, 2);

      await db
        .update(userProfiles)
        .set({
          xp: newXP,
          currentLevel: calculatedLevel,
          completedLessons: Array.from(completedList),
          earnedBadges: Array.from(badgesList),
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId));
    }

    return NextResponse.json({ success: true, result: record[0] });
  } catch (error) {
    console.error("Error submitting quiz result:", error);
    return NextResponse.json({ success: false, error: "Failed to record quiz" }, { status: 500 });
  }
}
