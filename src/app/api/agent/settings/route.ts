import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = await getDb();
  const ORG_ID = session.orgId;
  
  // Safe migration for columns (if not exist)
  try { await db.exec(`ALTER TABLE organizations ADD COLUMN whatsapp_phone TEXT DEFAULT ''`); } catch (_) {}
  try { await db.exec(`ALTER TABLE organizations ADD COLUMN google_maps_url TEXT DEFAULT ''`); } catch (_) {}
  try { await db.exec(`ALTER TABLE organizations ADD COLUMN google_review_url TEXT DEFAULT ''`); } catch (_) {}
  try { await db.exec(`ALTER TABLE organizations ADD COLUMN agent_tone TEXT DEFAULT 'Pro'`); } catch (_) {}
  try { await db.exec(`ALTER TABLE organizations ADD COLUMN agent_instructions TEXT DEFAULT ''`); } catch (_) {}
  try { await db.exec(`ALTER TABLE organizations ADD COLUMN promo_emoji TEXT DEFAULT '🎁'`); } catch (_) {}
  try { await db.exec(`ALTER TABLE organizations ADD COLUMN promo_title TEXT DEFAULT ''`); } catch (_) {}
  try { await db.exec(`ALTER TABLE organizations ADD COLUMN promo_description TEXT DEFAULT ''`); } catch (_) {}
  try { await db.exec(`ALTER TABLE organizations ADD COLUMN profile_emoji TEXT DEFAULT ''`); } catch (_) {}
  try { await db.exec(`ALTER TABLE organizations ADD COLUMN profile_color TEXT DEFAULT 'from-blue-500 to-indigo-600'`); } catch (_) {}
  
  try {
    const settings = await db.get(
      "SELECT name, slug, whatsapp_phone, google_maps_url, google_review_url, agent_tone, agent_instructions, promo_emoji, promo_title, promo_description, profile_emoji, profile_color FROM organizations WHERE id = ?",
      [ORG_ID]
    );
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const db = await getDb();
  const ORG_ID = session.orgId;
  const body = await request.json();
  
  const { name, slug, whatsapp_phone, google_maps_url, google_review_url, agent_tone, agent_instructions, promo_emoji, promo_title, promo_description, profile_emoji, profile_color } = body;

  try {
    await db.run(
      `UPDATE organizations 
       SET name = COALESCE(?, name),
           slug = COALESCE(?, slug),
           whatsapp_phone = COALESCE(?, whatsapp_phone),
           google_maps_url = COALESCE(?, google_maps_url),
           google_review_url = COALESCE(?, google_review_url),
           agent_tone = COALESCE(?, agent_tone),
           agent_instructions = COALESCE(?, agent_instructions),
           promo_emoji = COALESCE(?, promo_emoji),
           promo_title = COALESCE(?, promo_title),
           promo_description = COALESCE(?, promo_description),
           profile_emoji = COALESCE(?, profile_emoji),
           profile_color = COALESCE(?, profile_color)
       WHERE id = ?`,
      [
        name || null, slug || null, whatsapp_phone || null, google_maps_url || null, google_review_url || null,
        agent_tone || null, agent_instructions || null,
        promo_emoji || null, promo_title || null, promo_description || null,
        profile_emoji || null, profile_color || null,
        ORG_ID
      ]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
