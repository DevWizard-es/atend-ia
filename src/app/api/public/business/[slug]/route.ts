import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const db = await getDb();
  const slug = params.slug;

  const business = await db.get(
    "SELECT * FROM organizations WHERE slug = ?",
    [slug]
  );

  if (!business) {
    return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });
  }

  const products = await db.all(
    "SELECT id, name, description, price, icon FROM products WHERE org_id = ? ORDER BY created_at DESC",
    [business.id]
  );

  return NextResponse.json({
    id: business.id,
    name: business.name,
    slug: business.slug,
    whatsapp_phone: business.whatsapp_phone,
    google_maps_url: business.google_maps_url,
    agent_tone: business.agent_tone || "Pro",
    profile_emoji: business.profile_emoji || "",
    promo_emoji: business.promo_emoji || "🎁",
    promo_title: business.promo_title || "¡10% de descuento en tu próxima visita!",
    promo_description: business.promo_description || "Déjanos tu WhatsApp y te enviamos el cupón al instante.",
    products: products
  });
}
