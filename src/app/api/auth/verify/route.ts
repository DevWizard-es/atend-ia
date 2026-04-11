import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verify-email?error=invalid", request.url));
  }

  try {
    const db = await getDb();

    const user = await db.get(
      "SELECT id, token_expires_at FROM users WHERE verification_token = ?",
      [token]
    );

    if (!user) {
      return NextResponse.redirect(new URL("/verify-email?error=invalid", request.url));
    }

    // Check expiration
    if (user.token_expires_at && new Date(String(user.token_expires_at)) < new Date()) {
      return NextResponse.redirect(new URL("/verify-email?error=expired", request.url));
    }

    // Mark as verified
    await db.run(
      "UPDATE users SET email_verified = 1, verification_token = '', token_expires_at = '' WHERE id = ?",
      [user.id]
    );

    return NextResponse.redirect(new URL("/dashboard?verified=1", request.url));
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.redirect(new URL("/verify-email?error=server", request.url));
  }
}
