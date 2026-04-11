import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/email";

// TEMPORARY DEBUG ENDPOINT — only use in development/testing
// Access: GET /api/debug/test-email?to=youremail@example.com
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get("to");

  if (!to) {
    return NextResponse.json({ error: "?to=email is required" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;

  try {
    const result = await sendVerificationEmail({
      to,
      businessName: "Test Business",
      token: "test-token-12345",
      baseUrl: "https://atend-ia-ashy.vercel.app",
    });

    return NextResponse.json({
      success: true,
      apiKeyPresent: !!apiKey,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + "..." : null,
      result,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      apiKeyPresent: !!apiKey,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + "..." : null,
      error: err?.message || String(err),
      details: err,
    });
  }
}
