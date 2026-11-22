import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export const Route = createFileRoute("/api/verify-recaptcha")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const secret = process.env["RECAPTCHA_SECRET_KEY"];
        let token: unknown;
        try {
          token = ((await request.json()) as { token?: unknown })?.token;
        } catch {
          return json({ success: false }, 400);
        }

        if (!secret || typeof token !== "string" || !token || token.length > 4096) {
          return json({ success: false }, 400);
        }

        try {
          const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ secret, response: token }),
          });
          const result = (await res.json()) as { success?: boolean };
          return json({ success: !!result.success }, result.success ? 200 : 403);
        } catch {
          return json({ success: false }, 500);
        }
      },
      GET: async () => json({ error: "Method not allowed" }, 405),
    },
  },
});
