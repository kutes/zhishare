export async function verifyTurnstileTokenOnClient(token: string) {
  if (!token) {
    return false;
  }

  try {
    const response = await fetch("/api/turnstile/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as { success?: boolean };
    return Boolean(result.success);
  } catch (error) {
    console.error("[Turnstile] client verify error", error);
    return false;
  }
}
