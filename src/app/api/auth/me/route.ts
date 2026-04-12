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
    // Safe migration
    try { await db.exec(`ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0`); } catch (_) {}
    
    const user = await db.get("SELECT email_verified FROM users WHERE id = ?", [session.userId]);
    const org = await db.get(
      "SELECT name, slug, profile_emoji, profile_color FROM organizations WHERE id = ?",
      [session.orgId]
    );
    return NextResponse.json({
      authenticated: true,
      email: session.email,
      emailVerified: user?.email_verified === 1,
      businessName: org?.name || "",
      slug: org?.slug || "",
      profileEmoji: org?.profile_emoji || "",
      profileColor: org?.profile_color || "from-emerald-500 to-teal-600",
    });
  } catch {
    return NextResponse.json({ authenticated: true, email: session.email, emailVerified: false });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("guarapoia_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
