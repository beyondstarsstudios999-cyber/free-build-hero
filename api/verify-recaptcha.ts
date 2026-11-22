import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";


const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
const STORAGE_KEY = "bs_captcha_ok";
const VALID_MS = 24 * 60 * 60 * 1000; // re-check after 24 hours

type Status = "checking" | "needed" | "ok";

function CaptchaGate({ children }: { children: ReactNode }) {
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

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  const normalizedError = error instanceof Error ? error : new Error(String(error));
  console.error(normalizedError);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(normalizedError, { boundary: "tanstack_root_error_component" });
  }, [normalizedError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BeyondStars Studios" },
      {
        name: "description",
        content:
          "BeyondStars Studios — graphic design, photography, videography and wedding packages with clear 2026 rates in ZAR.",
      },
      { property: "og:title", content: "BeyondStars Studios" },
      {
        property: "og:description",
        content:
          "Design, print, photography, film and wedding rates — priced plainly for the 2026 season.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon-32-2026-oct11.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-2026-oct11.png", type: "image/png", sizes: "64x64" },
      { rel: "icon", href: "/android-icon-2026-oct11.png", type: "image/png", sizes: "192x192" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon-2026-oct11.png", sizes: "180x180" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <CaptchaGate>
        <Outlet />
      </CaptchaGate>
    </QueryClientProvider>
  );
}
