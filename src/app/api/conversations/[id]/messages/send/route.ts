import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    const db = await getDb();
    const { content, direction, sender_name } = await request.json();
  
    if (!content) {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }
  
    const msg_id = uuidv4();
    await db.run(`
      INSERT INTO messages (id, conv_id, content, direction, sender_name)
      VALUES (?, ?, ?, ?, ?)
    `, [msg_id, params.id, content, direction || 'outbound', sender_name || 'Admin']);
  
    // Update conversation timestamp
    await db.run('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP, last_message = ? WHERE id = ?', [content, params.id]);
  
    return NextResponse.json({ success: true, id: msg_id });
  }
