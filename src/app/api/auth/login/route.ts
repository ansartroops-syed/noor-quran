import { NextRequest, NextResponse } from "next/server";
import { loginPrivateUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body.username || "");
    const password = String(body.password || "");
    if (!process.env.ADMIN_PASSWORD && !process.env.OWNER_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Private login is not configured on the server yet." },
        { status: 503 }
      );
    }
    const user = await loginPrivateUser(username, password);
    if (!user) {
      return NextResponse.json({ success: false, error: "Those login details are not allowed." }, { status: 401 });
    }
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Private login failed:", error);
    return NextResponse.json({ success: false, error: "Login could not be completed." }, { status: 500 });
  }
}
