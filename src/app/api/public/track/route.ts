import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const db = await getDb();
  const { org_id, type, platform, metadata } = await request.json();

  if (!org_id || !type) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  // Realmente en la v2 simplificada guardamos el clic para el dashboard
  // Podríamos tener una tabla 'analytics_events' o 'leads'
  // Vamos a guardarlo como un lead inicial si es contacto de WA
  if (type === 'whatsapp_click') {
     await db.run(
       'INSERT INTO contacts (id, org_id, phone, last_interaction) VALUES (?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(phone) DO UPDATE SET last_interaction=CURRENT_TIMESTAMP',
       [uuidv4(), org_id, 'Lead anónimo']
     );
  }

  return NextResponse.json({ success: true });
}
