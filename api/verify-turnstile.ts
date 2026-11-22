
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.body?.token;
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret || !token || typeof token !== "string" || token.length > 2048) {
    return res.status(400).json({ success: false });
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret,
          response: token,
        }),
      }
    );

    const result = await response.json();

    if (!result.success) {
      return res.status(403).json({ success: false });
    }

    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ success: false });
  }
}
