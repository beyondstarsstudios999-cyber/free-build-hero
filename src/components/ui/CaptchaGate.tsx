import { useEffect, useRef, useState, type ReactNode } from "react";

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
const STORAGE_KEY = "bs_captcha_ok";
const VALID_MS = 24 * 60 * 60 * 1000; // re-check after 24 hours

type Status = "checking" | "needed" | "ok";

export function CaptchaGate({ children }: { children: ReactNode }) {
  // Server + first client render are identical ("checking"), so no hydration mismatch.
  const [status, setStatus] = useState<Status>(SITE_KEY ? "checking" : "ok");
  const [error, setError] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  // 1. Has this visitor already passed recently?
  useEffect(() => {
    if (!SITE_KEY) return;
    try {
      const t = Number(localStorage.getItem(STORAGE_KEY));
      if (t && Date.now() - t < VALID_MS) return setStatus("ok");
    } catch {}
    setStatus("needed");
  }, []);

  // 2. Load reCAPTCHA and render the checkbox when needed.
  useEffect(() => {
    if (status !== "needed" || !SITE_KEY) return;
    const w = window as any;

    const render = () => {
      if (!boxRef.current || boxRef.current.childElementCount) return;
      w.grecaptcha.render(boxRef.current, {
        sitekey: SITE_KEY,
        callback: async (token: string) => {
          setError("");
          try {
            const r = await fetch("/api/verify-recaptcha", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            });
            if (!r.ok) throw new Error();
            try {
              localStorage.setItem(STORAGE_KEY, String(Date.now()));
            } catch {}
            setStatus("ok");
          } catch {
            setError("Verification failed. Please try again.");
            w.grecaptcha.reset();
          }
        },
        "expired-callback": () => w.grecaptcha.reset(),
      });
    };

    if (w.grecaptcha?.render) {
      render();
      return;
    }
    w.__recaptchaReady = render;
    if (!document.getElementById("recaptcha-script")) {
      const s = document.createElement("script");
      s.id = "recaptcha-script";
      s.src = "https://www.google.com/recaptcha/api.js?onload=__recaptchaReady&render=explicit";
      s.async = true;
      document.head.appendChild(s);
    }
  }, [status]);

  // Lock scrolling while the gate is up.
  useEffect(() => {
    document.body.style.overflow = status === "ok" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [status]);

  return (
    <>
      {children}
      {status !== "ok" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Verify you are human"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483000,
            background: "#0b0b12",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          {status === "needed" && (
            <div style={{ textAlign: "center", maxWidth: 360 }}>
              <img
                src="/assets/beyondstars-logo-gold-2026-oct09.svg"
                alt="BeyondStars Studios"
                style={{ height: 64, margin: "0 auto 20px" }}
              />
              <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
                Quick check before you enter
              </h1>
              <p style={{ fontSize: 14, opacity: 0.75, marginBottom: 20 }}>
                Please confirm you’re human to continue to BeyondStars Studios.
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div ref={boxRef} />
              </div>
              {error && <p style={{ color: "#ff8a8a", fontSize: 13, marginTop: 12 }}>{error}</p>}
            </div>
          )}
        </div>
      )}
    </>
  );
}
