export type TurnstileVerifyResult = {
  success: boolean;
  errorCodes?: string[];
};

type CloudflareTurnstileResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstileToken(token: string, remoteIp?: string | null): Promise<TurnstileVerifyResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey || !token) {
    return { success: false };
  }

  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);

  if (remoteIp) {
    formData.append("remoteip", remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
    cache: "no-store",
  });
  const result = (await response.json()) as CloudflareTurnstileResponse;

  return {
    success: Boolean(result.success),
    errorCodes: result["error-codes"],
  };
}
