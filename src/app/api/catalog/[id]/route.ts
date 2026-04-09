import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = await getDb();
  const ORG_ID = "pizzeria-id-demo";
  const id = params.id;

  try {
    await db.run(
      `DELETE FROM products WHERE id = ? AND org_id = ?`,
      [id, ORG_ID]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al borrar producto" }, { status: 500 });
  }
}
