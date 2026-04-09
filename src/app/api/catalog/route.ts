import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// GET — Load catalog products
export async function GET() {
  const db = await getDb();
  const ORG_ID = "pizzeria-id-demo";

  try {
    const products = await db.all(
      `SELECT * FROM products WHERE org_id = ? ORDER BY created_at DESC`,
      [ORG_ID]
    );
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar productos" }, { status: 500 });
  }
}

// POST — Create new product
export async function POST(request: Request) {
  const db = await getDb();
  const ORG_ID = "pizzeria-id-demo";
  
  try {
    const body = await request.json();
    const { name, description, price, icon } = body;

    if (!name || isNaN(parseFloat(price))) {
      return NextResponse.json({ error: "Nombre y precio (numérico) son requeridos" }, { status: 400 });
    }

    const newId = uuidv4();
    await db.run(
      `INSERT INTO products (id, org_id, name, description, price, icon) VALUES (?, ?, ?, ?, ?, ?)`,
      [newId, ORG_ID, name, description || '', parseFloat(price), icon || '🍕']
    );

    return NextResponse.json({ success: true, id: newId });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
