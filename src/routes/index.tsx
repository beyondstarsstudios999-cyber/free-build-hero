import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BeyondStars Studios — 2026 Price List" },
      {
        name: "description",
        content:
          "Graphic design, photography, videography and wedding packages from BeyondStars Studios. Clear 2026 rates in ZAR, from R150.",
      },
      { property: "og:title", content: "BeyondStars Studios — 2026 Price List" },
      {
        property: "og:description",
        content:
          "Design, print, photography, film and wedding rates — priced plainly for the 2026 season.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600;700&display=swap",
      },
      { rel: "stylesheet", href: "/beyondstars.css" },
    ],
  }),
  component: Index,
});

const LOGO_URL = "/assets/beyondstars-logo.png";
const WHATSAPP_ICON_URL = "/assets/whatsapp-icon.png";

const Wordmark = () => (
  <img src={LOGO_URL} alt="BeyondStars Studios" className="brand-logo" />
);

function HeroLottie() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: { destroy: () => void } | null = null;
    let cancelled = false;
    (async () => {
      const lottie = (await import("lottie-web")).default;
      if (cancelled || !ref.current) return;
      anim = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/assets/hero-animation.json",
        rendererSettings: { progressiveLoad: true, preserveAspectRatio: "xMidYMid meet" },
      });
    })();
    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, []);

  return <div className="lottie-holder" ref={ref} />;
}

const PHONE = "067 233 8490";
const PHONE_TEL = "+27672338490";
const WA_LINK = "https://wa.me/27672338490";
const EMAIL = "hilton@beyondstars.co.za";

const QUOTE_SERVICES: Array<[string, number, string?]> = [
  ["Banner Design", 300],
  ["Album Artwork", 450],
  ["Flyer / Poster Design", 250],
  ["Welcome Board / Business Card", 150],
  ["Large-format Design (100–500mm)", 250],
  ["Large-format Design (500–1000mm)", 450],
  ["Large-format Design (1000–3000mm)", 600],
  ["Studio Session", 1200, "/hr"],
  ["Kids Photoshoot", 750, "/hr"],
  ["Adult Photoshoot", 1200, "/hr"],
  ["Corporate Portraits", 5700, "/hr"],
  ["Website (starting rate)", 1200, "+"],
  ["Music Video", 6000, "+"],
  ["Wedding Invitation Motion", 500],
  ["Wedding Photography Only", 3500, "/hr"],
  ["Wedding Videography Only", 5000, "/hr"],
  ["Wedding Photo + Video (6 hrs)", 9000],
];

const formatR = (n: number) => `R${n.toLocaleString("en-ZA").replace(/,/g, " ")}`;

function QuoteModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (label: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  const total = QUOTE_SERVICES.filter(([l]) => selected.has(l)).reduce((s, [, p]) => s + p, 0);
  const chosen = QUOTE_SERVICES.filter(([l]) => selected.has(l));
  const summary = chosen.map(([l, p, suffix]) => `${l} — ${formatR(p)}${suffix ?? ""}`).join("\n");
  const mailBody = encodeURIComponent(
    `Hi BeyondStars Studios,\n\nI'd like a quotation for:\n\n${summary || "(services)"}\n\nEstimated total: ${formatR(total)}\n\nThanks!`,
  );

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Get a quotation">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h3 className="display">Get a quotation</h3>
        <p className="modal-sub">Tick what you need — your estimate adds up below, then send it straight to us.</p>
        <div className="quote-list">
          {QUOTE_SERVICES.map(([label, price, suffix]) => (
            <label key={label} className={selected.has(label) ? "quote-item selected" : "quote-item"}>
              <span className="qi-label">
                <input type="checkbox" checked={selected.has(label)} onChange={() => toggle(label)} />
                {label}
              </span>
              <span className="qi-price">
                {formatR(price)}
                {suffix ?? ""}
              </span>
            </label>
          ))}
        </div>
        <div className="quote-total">
          <span>Estimated total</span>
          <b className="mono">{formatR(total)}</b>
        </div>
        <p className="quote-note">
          Hourly rates are billed per hour booked — final quote confirmed by email.
        </p>
        <a
          className="btn btn-primary"
          href={`mailto:${EMAIL}?subject=${encodeURIComponent("Quotation request — BeyondStars Studios")}&body=${mailBody}`}
        >
          Email this quote request
        </a>
        <a
          className="btn btn-ghost"
          style={{ marginTop: "10px", color: "var(--ink, #181410)", borderColor: "rgba(0,0,0,.35)" }}
          href={`tel:${PHONE_TEL}`}
        >
          Or call {PHONE}
        </a>
      </div>
    </div>
  );
}

function Index() {
  const [navOpen, setNavOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    const safety = window.setTimeout(() => els.forEach((el) => el.classList.add("in")), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  const closeNav = () => setNavOpen(false);

  return (
    <>
      <header className="site">
        <div className="nav">
          <a href="#top" className="brand">
            <Wordmark />
          </a>
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav className={navOpen ? "links open" : "links"} onClick={closeNav}>
            <a href="#design">Design</a>
            <a href="#photography">Photography</a>
            <a href="#film">Film &amp; Weddings</a>
            <a href="#booking">Booking</a>
            <a
              href="#quote"
              className="nav-cta"
              onClick={(e) => {
                e.preventDefault();
                setQuoteOpen(true);
              }}
            >
              Get a quote
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap hero-inner">
            <div className="hero-text">
              <span className="eyebrow-tag">PRICE LIST — 2026</span>
              <h1 className="hero-title display">
                Design, shot
                <br />
                and framed
                <br />
                <span className="accent">beyond</span>
                <br />
                <span className="accent">the usual.</span>
              </h1>

              <p className="hero-sub">
                BeyondStars Studios is a one-stop creative house — graphic design, photography,
                videography and weddings, priced plainly below so you know exactly what you're
                booking.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => setQuoteOpen(true)}>
                  Get a quotation
                </button>
                <a href="#design" className="btn btn-ghost">
                  See the price list ↓
                </a>
              </div>
              <div className="hero-strip">
                <div>
                  <b>7</b>
                  <span>Design &amp; print rates</span>
                </div>
                <div>
                  <b>5</b>
                  <span>Photography sessions</span>
                </div>
                <div>
                  <b>5</b>
                  <span>Film &amp; wedding packages</span>
                </div>
                <div>
                  <b>R150</b>
                  <span>Starting rate</span>
                </div>
              </div>
            </div>
            <div className="hero-rider" aria-hidden="true">
              <HeroLottie />
            </div>

          </div>
        </section>

        <section id="design">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <span className="kicker">01 — Design &amp; Print</span>
                <h2 className="section-title display">On the page.</h2>
              </div>
              <p className="section-note">
                Banners, artwork and fixes — priced flat, with print-size tiers for anything larger
                than a flyer.
              </p>
            </div>

            <div className="price-list reveal">
              {[
                ["Banner Design", "R300"],
                ["Album Artwork", "R450"],
                ["Flyer / Poster Design", "R250"],
                ["Welcome Board / Business Card", "R150"],
              ].map(([label, value]) => (
                <div className="price-row" key={label}>
                  <span className="ribbon"></span>
                  <span className="price-label">{label}</span>
                  <span className="price-value">{value}</span>
                </div>
              ))}
            </div>

            <div className="ruler-block reveal">
              <div className="ruler-head">
                <h3 className="display">Large-format designs &amp; fixes</h3>
                <p>Priced by print size, from a poster to a full banner run.</p>
              </div>
              <div className="ruler">
                <div className="ruler-fill"></div>
                <div className="ruler-ticks">
                  {["0mm", "500mm", "1000mm", "3000mm"].map((t) => (
                    <span className="tick" key={t}>
                      <span className="tick-mm">{t}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="tier-cards">
                {[
                  ["R250", "100 – 500mm"],
                  ["R450", "500 – 1000mm"],
                  ["R600", "1000 – 3000mm"],
                ].map(([r, mm]) => (
                  <div className="tier-card" key={mm}>
                    <div className="r mono">{r}</div>
                    <div className="mm">{mm}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="photography" className="dark-section">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <span className="kicker">02 — Photography</span>
                <h2 className="section-title display">In the frame.</h2>
              </div>
              <p className="section-note">
                Hourly studio and location rates for every subject — from newborns to boardrooms.
              </p>
            </div>

            <div className="shoot-grid reveal">
              {[
                ["01", "Studio", "Session", "R1 200"],
                ["02", "Kids", "Photoshoot", "R750"],
                ["03", "Adult", "Photoshoot", "R1 200"],
                ["04", "Corporate", "Portraits", "R5 700"],
              ].map(([num, a, b, price]) => (
                <div className="shoot-card" key={num}>
                  <span className="shoot-num mono">{num}</span>
                  <span className="shoot-name">
                    {a}
                    <br />
                    {b}
                  </span>
                  <span className="shoot-price">
                    {price}
                    <sup>/hr</sup>
                  </span>
                </div>
              ))}
            </div>
            <div className="web-strip reveal">
              <div className="l">
                <span className="ribbon"></span>
                <div>
                  <div className="name display">Websites</div>
                  <div className="desc">Custom-built, starting rate</div>
                </div>
              </div>
              <span className="price">R1 200+</span>
            </div>
          </div>
        </section>

        <section id="film">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <span className="kicker">03 — Film &amp; Weddings</span>
                <h2 className="section-title display">In motion.</h2>
              </div>
              <p className="section-note">
                Music videos, invitation motion graphics, and full wedding-day coverage.
              </p>
            </div>

            <div className="split reveal">
              <div className="split-col">
                <h3>Video</h3>
                <div className="price-list">
                  <div className="price-row">
                    <span className="ribbon"></span>
                    <span className="price-label">Music Video</span>
                    <span className="price-value">
                      R6 000<sup>+</sup>
                    </span>
                  </div>
                  <div className="price-row">
                    <span className="ribbon"></span>
                    <span className="price-label">Wedding Invitation Motion</span>
                    <span className="price-value">R500</span>
                  </div>
                </div>
              </div>
              <div className="split-col">
                <h3>Weddings</h3>
                <div className="price-list">
                  <div className="price-row">
                    <span className="ribbon"></span>
                    <span className="price-label">
                      Wedding Photography Only<small>Booked hourly</small>
                    </span>
                    <span className="price-value">
                      R3 500<sup>/hr</sup>
                    </span>
                  </div>
                  <div className="price-row">
                    <span className="ribbon"></span>
                    <span className="price-label">
                      Wedding Videography Only<small>Booked hourly</small>
                    </span>
                    <span className="price-value">
                      R5 000<sup>/hr</sup>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="featured-row reveal">
              <span className="featured-tag">Most booked</span>
              <span className="ribbon"></span>
              <span className="price-label">
                Wedding Photoshoot &amp; Photography
                <small style={{ color: "var(--muted-light)" }}>
                  Photography and videography together, 6 hours on the day
                </small>
              </span>
              <span className="price-value">R9 000</span>
            </div>
          </div>
        </section>

        <section className="booking" id="booking">
          <div className="wrap">
            <div className="section-head reveal" style={{ marginBottom: "36px" }}>
              <div>
                <span className="kicker">04 — Booking</span>
                <h2 className="section-title display" style={{ color: "var(--paper)" }}>
                  Lock it in.
                </h2>
              </div>
              <p className="section-note" style={{ color: "var(--muted-light)" }}>
                A deposit secures your date or design slot — full details below.
              </p>
            </div>

            <div className="booking-grid reveal">
              <div className="ticket">
                <h3>Bank Details</h3>
                <dl>
                  <dt>Account name</dt>
                  <dd>BeyondStars</dd>
                  <dt>Bank</dt>
                  <dd>Capitec Bank</dd>
                  <dt>Account number</dt>
                  <dd>2502 8957 70</dd>
                </dl>
              </div>
              <div className="notice">
                <div>
                  <h3 className="display">Deposit required</h3>
                  <p style={{ marginTop: "12px" }}>
                    Please note: a deposit is mandatory to begin any booking. No high-quality
                    vectors, images, designs or videos are delivered until full payment has been
                    received.
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => setQuoteOpen(true)}>
                  Get a quotation
                </button>
              </div>
            </div>

            <div className="contact-cards reveal">
              <a className="contact-card" href={`tel:${PHONE_TEL}`}>
                <span className="cc-label">Call</span>
                <span className="cc-value">{PHONE}</span>
              </a>
              <a className="contact-card" href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <span className="cc-label">WhatsApp</span>
                <span className="cc-value cc-whatsapp">
                  <img src={WHATSAPP_ICON_URL} alt="WhatsApp" />
                  {PHONE}
                </span>
              </a>
              <a className="contact-card" href={`mailto:${EMAIL}`}>
                <span className="cc-label">Email</span>
                <span className="cc-value">{EMAIL}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap foot-row">
          <a href="#top" className="brand">
            <Wordmark />
          </a>
          <span>
            <a href={`tel:${PHONE_TEL}`} style={{ color: "inherit" }}>
              {PHONE}
            </a>
            {" · "}
            <a href={`mailto:${EMAIL}`} style={{ color: "inherit" }}>
              {EMAIL}
            </a>
          </span>
          <span>© 2026 BeyondStars Studios. Prices in ZAR, valid for the 2026 season.</span>
        </div>
      </footer>

      <a className="whatsapp-float" href={WA_LINK} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <img src={WHATSAPP_ICON_URL} alt="" />
        <span>WhatsApp us</span>
      </a>

      {quoteOpen && <QuoteModal onClose={() => setQuoteOpen(false)} />}
    </>
  );
}
