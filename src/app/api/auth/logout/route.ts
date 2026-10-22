import { NextResponse } from "next/server";
import { logoutPrivateUser } from "@/lib/auth";

export async function POST() {
  await logoutPrivateUser();
  return NextResponse.json({ success: true });
}
