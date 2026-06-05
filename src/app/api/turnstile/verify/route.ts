import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { token?: unknown };
    const token = typeof body.token === "string" ? body.token : "";
    const remoteIp = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0];
    const result = await verifyTurnstileToken(token, remoteIp);

    if (!result.success) {
      console.error("[Turnstile] verify failed", result.errorCodes);
    }

    return NextResponse.json({ success: result.success });
  } catch (error) {
    console.error("[Turnstile] verify route error", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
