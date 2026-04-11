import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/email";

// DEBUG — GET /api/debug/test-email?to=email@example.com
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get("to");

  if (!to) {
    return NextResponse.json({ error: "?to=email is required" }, { status: 400 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  try {
    const result = await sendVerificationEmail({
      to,
      businessName: "Test Business",
      token: "test-token-12345",
      baseUrl: "https://atend-ia-ashy.vercel.app",
    });

    return NextResponse.json({
      success: true,
      gmailUserPresent: !!gmailUser,
      gmailPassPresent: !!gmailPass,
      gmailUser: gmailUser ? gmailUser.substring(0, 5) + "***" : null,
      messageId: (result as any)?.messageId,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      gmailUserPresent: !!gmailUser,
      gmailPassPresent: !!gmailPass,
      gmailUser: gmailUser ? gmailUser.substring(0, 5) + "***" : null,
      error: err?.message || String(err),
    });
  }
}
