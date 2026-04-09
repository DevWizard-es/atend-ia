import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId");

  if (!orgId) {
    return NextResponse.json({ error: "orgId requerido" }, { status: 400 });
  }

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
