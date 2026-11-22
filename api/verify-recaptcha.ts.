export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.body?.token;
  const secret = process.env["RECAPTCHA_SECRET_KEY"];

  if (!secret || !token || typeof token !== "string" || token.length > 4096) {
    return res.status(400).json({ success: false });
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const result = await response.json();
    return res.status(result.success ? 200 : 403).json({ success: !!result.success });
  } catch {
    return res.status(500).json({ success: false });
  }
}
