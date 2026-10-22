import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("guest-user"),
  name: text("name").notNull().default("Seeker of Knowledge"),
  currentLevel: integer("current_level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  streakCount: integer("streak_count").notNull().default(1),
  lastActiveDate: text("last_active_date").notNull().default(new Date().toISOString().split("T")[0]),
  completedLessons: jsonb("completed_lessons").$type<string[]>().default([]),
  earnedBadges: jsonb("earned_badges").$type<string[]>().default([]),
  dailyGoalMinutes: integer("daily_goal_minutes").default(15),
  minutesSpentToday: integer("minutes_spent_today").default(0),
  preferredReciter: text("preferred_reciter").default("Alafasy_128kbps"),
  preferredScript: text("preferred_script").default("uthmani"),
  preferredTranslation: text("preferred_translation").default("saheeh"),
  arabicFontSize: integer("arabic_font_size").default(28),
  showTransliteration: boolean("show_transliteration").default(true),
  showTranslation: boolean("show_translation").default(true),
  showTajweedColors: boolean("show_tajweed_colors").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("guest-user"),
  surahNumber: integer("surah_number").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  surahName: text("surah_name").notNull(),
  arabicText: text("arabic_text").notNull(),
  translationText: text("translation_text").notNull(),
  transliterationText: text("transliteration_text"),
  note: text("note").default(""),
  category: text("category").default("General"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizHistory = pgTable("quiz_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("guest-user"),
  lessonId: text("lesson_id").notNull(),
  level: integer("level").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  passed: boolean("passed").notNull(),
  xpEarned: integer("xp_earned").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const dailyReflections = pgTable("daily_reflections", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("guest-user"),
  surahNumber: integer("surah_number").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  reflectionNote: text("reflection_note").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
