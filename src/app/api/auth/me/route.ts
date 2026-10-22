import { NextResponse } from "next/server";
import { currentPrivateUser } from "@/lib/auth";

export async function GET() {
  const user = await currentPrivateUser();
  return NextResponse.json({ success: true, user });
}
