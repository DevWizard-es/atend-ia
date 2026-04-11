import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const orgId = session.orgId;

  const db = await getDb();
  
  const conversations = await db.all(`
    SELECT c.*, ct.name as contact_name, ct.phone as contact_phone
    FROM conversations c
    JOIN contacts ct ON c.contact_id = ct.id
    WHERE c.org_id = ?
    ORDER BY c.updated_at DESC
  `, [orgId]);

  return NextResponse.json(conversations);
}
