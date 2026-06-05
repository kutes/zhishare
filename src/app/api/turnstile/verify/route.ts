import { NextRequest, NextResponse } from "next/server";

type CloudflareTurnstileResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { token?: unknown };
    const token = typeof body.token === "string" ? body.token : "";
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!token || !secretKey) {
      return NextResponse.json({ success: false });
    }

    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      cache: "no-store",
    });
    const result = (await response.json()) as CloudflareTurnstileResponse;

    if (!result.success) {
      console.error("[Turnstile] verify failed", result["error-codes"]);
    }

    return NextResponse.json({ success: result.success === true });
  } catch (error) {
    console.error("[Turnstile] verify route error", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
