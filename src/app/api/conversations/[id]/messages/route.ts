import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = await getDb();
  const conv_id = params.id;

  const messages = await db.all(`
    SELECT * 
    FROM messages 
    WHERE conv_id = ? 
    ORDER BY created_at ASC
  `, [conv_id]);

  return NextResponse.json(messages);
}
