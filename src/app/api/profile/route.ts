import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "guest-user";

    const rows = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);

    if (rows.length > 0) {
      return NextResponse.json({ success: true, profile: rows[0] });
    }

    // Create initial profile
    const inserted = await db
      .insert(userProfiles)
      .values({
        userId,
        name: "Seeker of Knowledge",
        currentLevel: 1,
        xp: 50,
        streakCount: 1,
        lastActiveDate: new Date().toISOString().split("T")[0],
        completedLessons: [],
        earnedBadges: ["Welcome Badge"],
        dailyGoalMinutes: 15,
        minutesSpentToday: 3,
      })
      .returning();

    return NextResponse.json({ success: true, profile: inserted[0] });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // Return fallback guest profile
    return NextResponse.json({
      success: true,
      profile: {
        userId: "guest-user",
        name: "Seeker of Knowledge",
        currentLevel: 1,
        xp: 100,
        streakCount: 1,
        lastActiveDate: new Date().toISOString().split("T")[0],
        completedLessons: [],
        earnedBadges: ["Welcome Badge"],
        dailyGoalMinutes: 15,
        minutesSpentToday: 5,
        preferredReciter: "Alafasy_128kbps",
        preferredScript: "uthmani",
        preferredTranslation: "saheeh",
        arabicFontSize: 28,
        showTransliteration: true,
        showTranslation: true,
        showTajweedColors: true,
      },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || "guest-user";

    const existing = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    const todayStr = new Date().toISOString().split("T")[0];

    if (existing.length > 0) {
      const prev = existing[0];
      let newStreak = prev.streakCount;
      if (prev.lastActiveDate !== todayStr) {
        const lastDate = new Date(prev.lastActiveDate);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      }

      const updated = await db
        .update(userProfiles)
        .set({
          name: body.name ?? prev.name,
          currentLevel: body.currentLevel ?? prev.currentLevel,
          xp: body.xp !== undefined ? body.xp : prev.xp,
          streakCount: body.streakCount ?? newStreak,
          lastActiveDate: todayStr,
          completedLessons: body.completedLessons ?? prev.completedLessons,
          earnedBadges: body.earnedBadges ?? prev.earnedBadges,
          dailyGoalMinutes: body.dailyGoalMinutes ?? prev.dailyGoalMinutes,
          minutesSpentToday: body.minutesSpentToday ?? prev.minutesSpentToday,
          preferredReciter: body.preferredReciter ?? prev.preferredReciter,
          preferredScript: body.preferredScript ?? prev.preferredScript,
          preferredTranslation: body.preferredTranslation ?? prev.preferredTranslation,
          arabicFontSize: body.arabicFontSize ?? prev.arabicFontSize,
          showTransliteration: body.showTransliteration ?? prev.showTransliteration,
          showTranslation: body.showTranslation ?? prev.showTranslation,
          showTajweedColors: body.showTajweedColors ?? prev.showTajweedColors,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId))
        .returning();

      return NextResponse.json({ success: true, profile: updated[0] });
    } else {
      const inserted = await db
        .insert(userProfiles)
        .values({
          userId,
          name: body.name || "Seeker of Knowledge",
          currentLevel: body.currentLevel || 1,
          xp: body.xp || 50,
          streakCount: 1,
          lastActiveDate: todayStr,
          completedLessons: body.completedLessons || [],
          earnedBadges: body.earnedBadges || ["Welcome Badge"],
          dailyGoalMinutes: body.dailyGoalMinutes || 15,
          minutesSpentToday: body.minutesSpentToday || 0,
          preferredReciter: body.preferredReciter || "Alafasy_128kbps",
          preferredScript: body.preferredScript || "uthmani",
          preferredTranslation: body.preferredTranslation || "saheeh",
          arabicFontSize: body.arabicFontSize || 28,
          showTransliteration: body.showTransliteration ?? true,
          showTranslation: body.showTranslation ?? true,
          showTajweedColors: body.showTajweedColors ?? true,
        })
        .returning();

      return NextResponse.json({ success: true, profile: inserted[0] });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
