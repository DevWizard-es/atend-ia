import { seedDemoData } from "@/lib/seed";
import { NextResponse } from "next/server";

export async function GET() {
  await seedDemoData();
  return NextResponse.json({ success: true, message: "Database reseeded as Master Demo successfully." });
}
