import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = await getDb();
  try {
    const reviews = await db.all(
      "SELECT * FROM reviews WHERE org_id = ? ORDER BY created_at DESC",
      [session.orgId]
    );
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: "Error de base de datos" }, { status: 500 });
  }
}
