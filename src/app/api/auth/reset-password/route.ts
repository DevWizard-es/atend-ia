import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token y contraseña requeridos" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.get(
      "SELECT id, reset_token_expires_at FROM users WHERE reset_token = ?",
      [token]
    );

    if (!user) {
      return NextResponse.json({ error: "El enlace no es válido o ya fue utilizado" }, { status: 400 });
    }

    if (user.reset_token_expires_at && new Date(String(user.reset_token_expires_at)) < new Date()) {
      return NextResponse.json({ error: "El enlace ha caducado. Solicita uno nuevo." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      "UPDATE users SET password = ?, reset_token = '', reset_token_expires_at = '' WHERE id = ?",
      [hashedPassword, user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[reset-password] Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
