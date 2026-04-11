import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

    const db = await getDb();

    // Safe migration
    try { await db.exec(`ALTER TABLE users ADD COLUMN reset_token TEXT DEFAULT ''`); } catch (_) {}
    try { await db.exec(`ALTER TABLE users ADD COLUMN reset_token_expires_at TEXT DEFAULT ''`); } catch (_) {}

    const user = await db.get("SELECT id FROM users WHERE email = ?", [email.toLowerCase()]);

    // Always respond OK to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const resetToken = uuidv4().replace(/-/g, "");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    await db.run(
      "UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?",
      [resetToken, expires, user.id]
    );

    const baseUrl = request.headers.get("origin") || "https://atend-ia-ashy.vercel.app";
    try {
      await sendPasswordResetEmail({ to: email.toLowerCase(), token: resetToken, baseUrl });
    } catch (err) {
      console.error("[forgot-password] Email error:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[forgot-password] Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
