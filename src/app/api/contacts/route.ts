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
    const contacts = await db.all(
      "SELECT * FROM contacts WHERE org_id = ? ORDER BY last_interaction DESC",
      [session.orgId]
    );
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: "Error de base de datos" }, { status: 500 });
  }
}
