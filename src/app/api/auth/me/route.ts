import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }
  
  try {
    const db = await getDb();
    const org = await db.get(
      "SELECT name, slug, profile_emoji, profile_color FROM organizations WHERE id = ?",
      [session.orgId]
    );
    return NextResponse.json({
      authenticated: true,
      email: session.email,
      businessName: org?.name || "",
      slug: org?.slug || "",
      profileEmoji: org?.profile_emoji || "",
      profileColor: org?.profile_color || "from-blue-500 to-indigo-600",
    });
  } catch {
    return NextResponse.json({ authenticated: true, email: session.email });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("atendia_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
