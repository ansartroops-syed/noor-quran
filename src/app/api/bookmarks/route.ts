import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "guest-user";

    const userBookmarks = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt));

    return NextResponse.json({ success: true, bookmarks: userBookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json({ success: true, bookmarks: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = "guest-user", surahNumber, ayahNumber, surahName, arabicText, translationText, transliterationText, note, category } = body;

    if (!surahNumber || !ayahNumber || !arabicText) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const inserted = await db
      .insert(bookmarks)
      .values({
        userId,
        surahNumber: Number(surahNumber),
        ayahNumber: Number(ayahNumber),
        surahName: surahName || `Surah ${surahNumber}`,
        arabicText,
        translationText: translationText || "",
        transliterationText: transliterationText || "",
        note: note || "",
        category: category || "General",
      })
      .returning();

    return NextResponse.json({ success: true, bookmark: inserted[0] });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json({ success: false, error: "Failed to create bookmark" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing bookmark ID" }, { status: 400 });
    }

    await db.delete(bookmarks).where(eq(bookmarks.id, Number(id)));
    return NextResponse.json({ success: true, message: "Bookmark removed" });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json({ success: false, error: "Failed to delete bookmark" }, { status: 500 });
  }
}
