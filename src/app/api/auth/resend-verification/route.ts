import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const user = await db.get("SELECT id, email, email_verified FROM users WHERE id = ?", [session.userId]);

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (user.email_verified) {
      return NextResponse.json({ error: "El email ya está verificado" }, { status: 400 });
    }

    // Generate a new token
    const newToken = uuidv4().replace(/-/g, "");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await db.run(
      "UPDATE users SET verification_token = ?, token_expires_at = ? WHERE id = ?",
      [newToken, tokenExpiry, user.id]
    );

    const org = await db.get("SELECT name FROM organizations WHERE id = ?", [session.orgId]);
    const baseUrl = request.headers.get("origin") || "https://atend-ia-ashy.vercel.app";

    await sendVerificationEmail({
      to: String(user.email),
      businessName: String(org?.name || ""),
      token: newToken,
      baseUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Error enviando el email" }, { status: 500 });
  }
}
