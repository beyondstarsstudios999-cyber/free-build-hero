import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { AnimationItem } from "lottie-web";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BeyondStars Studios — Affordable Prices" },
      {
        name: "description",
        content:
          "Graphic design, photography, videography and wedding packages from BeyondStars Studios. Clear 2026 rates in ZAR, from R150.",
      },
      { property: "og:title", content: "BeyondStars Studios — Affordable Prices" },
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
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Dancing+Script:wght@700&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600;700&display=swap",
      },
      { rel: "stylesheet", href: "/beyondstars.css" },
    ],
  }),
  component: Index,
});

const LOGO_URL = "/assets/beyondstars-logo-gold-2026-oct09.svg";
const WHATSAPP_ICON_URL = "/assets/whatsapp-icon.png";

const LOGO_MOBILE_URL = LOGO_URL;

const Wordmark = () => (
  <>
    <img src={LOGO_URL} alt="BeyondStars Studios" className="brand-logo brand-logo-desktop" />
    <img src={LOGO_MOBILE_URL} alt="BeyondStars Studios" className="brand-logo brand-logo-mobile" />
  </>
);

const HERO_SLIDES = [
  { src: "/assets/slides/campaign-wedding-2026-oct08.webp", thumb: "/assets/slides/campaign-wedding-2026-oct08-thumb.webp", alt: "Affordable wedding photography and videography packages" },
  { src: "/assets/slides/campaign-umemulo-2026-oct08.webp", thumb: "/assets/slides/campaign-umemulo-2026-oct08-thumb.webp", alt: "Affordable Umemulo photography and videography packages" },
  { src: "/assets/slides/campaign-graduation-2026-oct08.webp", thumb: "/assets/slides/campaign-graduation-2026-oct08-thumb.webp", alt: "Affordable cap and gown graduation photography packages" },
  { src: "/assets/slides/campaign-kiddies-2026.webp", thumb: "/assets/slides/campaign-kiddies-2026-thumb.webp", alt: "Affordable kiddies photography packages" },
  { src: "/assets/slides/campaign-matric-2026-oct08.webp", thumb: "/assets/slides/campaign-matric-2026-oct08-thumb.webp", alt: "Affordable matric dance photography and videography packages" },
];

const SLIDE_SOUND_URL = "/assets/sfx/camera-shutter-2026-oct09.mp3";

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [transitionPlugins] = useState(() => [Fade()]);
  const heroRef = useRef<HTMLElement | null>(null);
  const heroInViewRef = useRef(true);
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const [carouselRef, carousel] = useEmblaCarousel({
    loop: true,
    align: "start",
    duration: reducedMotion ? 0 : 35,
  }, transitionPlugins);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setHidden(document.hidden);
    updateMotion();
    updateVisibility();
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      (entries) => {
        heroInViewRef.current = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.25 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Browsers block audio until the first user gesture; create the sound up
  // front and unlock it on the first pointer/key interaction anywhere.
  useEffect(() => {
    const sound = new Audio(SLIDE_SOUND_URL);
    sound.preload = "auto";
    soundRef.current = sound;
    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      sound.muted = true;
      void sound
        .play()
        .then(() => {
          sound.pause();
          sound.currentTime = 0;
          sound.muted = false;
        })
        .catch(() => {
          unlocked = false;
          sound.muted = false;
        });
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      sound.pause();
      soundRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!carousel) return;
    const playSlideSound = () => {
      if (!heroInViewRef.current || document.hidden) return;
      const sound = soundRef.current;
      if (!sound || sound.muted) return;
      sound.currentTime = 0;
      void sound.play().catch(() => {
        // Still gesture-blocked; skip silently.
      });
    };
    const onSelect = () => {
      setActive(carousel.selectedScrollSnap());
      playSlideSound();
    };
    const onPointerDown = () => setDragging(true);
    const onPointerUp = () => setDragging(false);
    setActive(carousel.selectedScrollSnap());
    carousel.on("select", onSelect).on("reInit", onSelect);
    carousel.on("pointerDown", onPointerDown).on("pointerUp", onPointerUp);
    return () => {
      carousel.off("select", onSelect).off("reInit", onSelect);
      carousel.off("pointerDown", onPointerDown).off("pointerUp", onPointerUp);
    };
  }, [carousel]);

  useEffect(() => {
    if (!carousel || hovered || focused || dragging || hidden || reducedMotion) return;
    const timer = window.setTimeout(() => carousel.scrollNext(), 6000);
    return () => window.clearTimeout(timer);
  }, [carousel, active, hovered, focused, dragging, hidden, reducedMotion]);

  return (
    <section
      ref={heroRef}
      className={hovered || focused || dragging || hidden ? "media-hero is-paused" : "media-hero"}
      role="region"
      aria-roledescription="carousel"
      aria-label="BeyondStars photography services"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          if (event.key === "ArrowLeft") carousel?.scrollPrev();
          else carousel?.scrollNext();
        }
      }}
    >
      <div className="media-hero-stage">
        <div className="media-hero-viewport" ref={carouselRef}>
          <div className="media-hero-track" aria-live={focused ? "polite" : "off"}>
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.src}
                className={index === active ? "media-hero-slide is-active" : "media-hero-slide"}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${HERO_SLIDES.length}`}
                aria-hidden={index !== active}
              >
                <img src={slide.src} alt={slide.alt} loading="eager" decoding="async" draggable={false} />
              </div>
            ))}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="carousel-arrow carousel-arrow-prev p-0" onClick={() => carousel?.scrollPrev()} aria-label="Previous slide">
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon" className="carousel-arrow carousel-arrow-next p-0" onClick={() => carousel?.scrollNext()} aria-label="Next slide">
          <ChevronRight aria-hidden="true" />
        </Button>
        <div className="carousel-thumbnails" aria-label="Choose a slide">
          {HERO_SLIDES.map((slide, index) => (
            <Button
              variant="ghost"
              key={slide.src}
              className={index === active ? "carousel-thumbnail is-active h-auto" : "carousel-thumbnail h-auto"}
              onClick={() => carousel?.scrollTo(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
            >
              <img src={slide.thumb} alt="" loading="lazy" />
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: AnimationItem | null = null;
    let cancelled = false;

    void import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !containerRef.current) return;
      const loadedAnimation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/assets/hero-animation.json",
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      animation = loadedAnimation;
    });

    return () => {
      cancelled = true;
      animation?.destroy();
    };
  }, []);

  return <div ref={containerRef} className="intro-animation" aria-hidden="true" />;
}

function StudioIntro({ onQuote }: { onQuote: () => void }) {
  return (
    <section className="studio-intro" aria-label="BeyondStars Studios overview">
      <div className="studio-intro-inner">
        <p className="studio-intro-copy">
          BeyondStars Studios is a one-stop creative house —<br />
          graphic design, photography, videography and weddings.<br />
          Priced plainly below so you know exactly what you&apos;re booking.
        </p>
        <div className="studio-intro-actions">
          <button className="intro-button intro-button-gold" onClick={onQuote}>Get a quotation</button>
          <a className="intro-button intro-button-navy" href="#design">See the price list</a>
        </div>
        <div className="intro-rate-strip" aria-label="Service overview">
          <div><b>7</b><span>Design &amp; print<br />rates</span></div>
          <div><b>5</b><span>Photography<br />sessions</span></div>
          <div><b>5</b><span>Film &amp; wedding<br />packages</span></div>
          <div><b>R150</b><span>Starting rate</span></div>
        </div>
        <IntroAnimation />
      </div>
    </section>
  );
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
  ["Graduation Photoshoot", 750, "/hr"],
  ["Adult Photoshoot", 1200, "/hr"],
  ["Corporate Portraits", 5700, "/hr"],
  ["Website (starting rate)", 1200, "+"],
  ["Music Video", 6000, "+"],
  ["Wedding Invitation Motion", 500],
  ["Wedding Photography Only", 3500, "/hr"],
  ["Wedding Videography Only", 5000, "/hr"],
  ["Wedding Photo + Video (6 hrs)", 9000],
  ["White Wedding Package 1 — 2 cameras, 6 hrs, 1 light", 15000],
  ["White Wedding Package 2 — 3 cameras, drone, 2 lights", 22000],
];

const formatR = (n: number) => `R${n.toLocaleString("en-ZA").replace(/,/g, " ")}`;

const WEDDING_PACKAGE_1 = "White Wedding Package 1 — 2 cameras, 6 hrs, 1 light";
const WEDDING_PACKAGE_2 = "White Wedding Package 2 — 3 cameras, drone, 2 lights";

function QuoteModal({ onClose, preselect }: { onClose: () => void; preselect?: string[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(preselect ?? []));
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

function WeddingSpecialPromotion() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("beyondstars-wedding-special-shown") === "yes") return;
    } catch {
      // The offer remains available if browser storage is disabled.
    }
    const timer = window.setTimeout(() => {
      setVisible(true);
      try {
        window.sessionStorage.setItem("beyondstars-wedding-special-shown", "yes");
      } catch {
        // Storage is optional; the teaser still works for this visit.
      }
    }, 1800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!detailsOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailsOpen(false);
      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        const focusable = dialog?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable?.[0];
        const last = focusable?.[focusable.length - 1];
        if (!first || !last) {
          event.preventDefault();
        } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [detailsOpen]);

  const whatsappHref = `https://wa.me/27672338490?text=${encodeURIComponent("Hi BeyondStars Studios, I would like to book the R6,500 Gauteng wedding special.")}`;

  return (
    <>
      {visible && !dismissed && (
        <aside className="wedding-special-teaser" aria-label="Wedding special offer">
          <Button
            type="button"
            variant="ghost"
            className="wedding-special-dismiss"
            aria-label="Dismiss wedding special"
            onClick={() => setDismissed(true)}
          >
            <X aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="wedding-special-trigger"
            onClick={() => setDetailsOpen(true)}
            aria-haspopup="dialog"
            aria-label="Open the R6,500 Gauteng wedding special"
          >
            <img src="/assets/wedding-special-teaser-2027.webp" alt="" />
            <span className="wedding-special-teaser-copy">
              <strong>Wedding special</strong>
              <span>R6 500 · Gauteng</span>
              <span className="wedding-special-open">See the offer <span aria-hidden="true">↗</span></span>
            </span>
          </Button>
        </aside>
      )}

      {detailsOpen && (
        <div
          className="wedding-special-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDetailsOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            className="wedding-special-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wedding-special-title"
            tabIndex={-1}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="wedding-special-close"
              onClick={() => setDetailsOpen(false)}
              aria-label="Close wedding special details"
            >
              <X aria-hidden="true" />
            </Button>
            <div className="wedding-special-topline">
              <span>BeyondStars Studios</span>
              <span>Limited wedding offer</span>
            </div>
            <div className="wedding-special-heading">
              <p className="wedding-special-eyebrow">Photography &amp; videography · Gauteng only</p>
              <h2 id="wedding-special-title">Your day, beautifully remembered.</h2>
              <div className="wedding-special-price">
                <span className="wedding-special-was">Was R10 000</span>
                <strong>R6 500</strong>
                <span className="wedding-special-saving">Save R3 500</span>
              </div>
            </div>
            <div className="wedding-special-content">
              <section className="wedding-special-includes" aria-labelledby="special-includes-title">
                <div className="wedding-special-section-title">
                  <span>01</span>
                  <h3 id="special-includes-title">Included in your special</h3>
                </div>
                <ul>
                  <li><b>Couple interviews</b><span>1–2 minutes per person</span></li>
                  <li><b>Cinematic wedding film</b><span>20-minute edit</span></li>
                  <li><b>Drone shots</b><span>Weather, venue permission and safe flying conditions permitting</span></li>
                  <li><b>Wedding photographs</b><span>150 high-resolution, professionally colour-graded photos</span></li>
                  <li><b>Custom-designed cover</b><span>AI print-ready design</span></li>
                  <li><b>Social highlight reel</b><span>1-minute edited reel</span></li>
                </ul>
              </section>
              <section className="wedding-special-payment" aria-labelledby="special-payment-title">
                <div className="wedding-special-section-title">
                  <span>02</span>
                  <h3 id="special-payment-title">Payment schedule</h3>
                </div>
                <div className="wedding-special-payment-steps">
                  <div><span>Booking deposit · secures your date</span><strong>R1 500</strong></div>
                  <div><span>On the event day · before the shoot</span><strong>R3 000</strong></div>
                  <div><span>When the project is ready</span><strong>R2 000</strong></div>
                </div>
              </section>
              <div className="wedding-special-notes">
                <p><b>Coverage</b><span>Maximum of 6 hours</span></p>
                <p><b>Travel &amp; stay</b><span>Transport, hospitality and accommodation are excluded if required.</span></p>
              </div>
            </div>
            <div className="wedding-special-footer">
              <p><span>Offer ends</span><strong>6 January 2027</strong></p>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="wedding-special-cta">
                Reserve your date <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Index() {
  const [navOpen, setNavOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quotePreselect, setQuotePreselect] = useState<string[]>([]);
  const openQuote = (preselect: string[] = []) => {
    setQuotePreselect(preselect);
    setQuoteOpen(true);
  };

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
            <Link to="/gallery">Gallery</Link>
            <Link to="/portfolio">Portfolio</Link>
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
        <HeroCarousel />

        <StudioIntro onQuote={() => openQuote()} />

        <section className="clients-divider" aria-label="Our clients">
          <div className="wrap">
            <img src="/assets/our-clients.png" alt="Logos of BeyondStars Studios clients" />
          </div>
        </section>

        <section id="wedding" className="wedding">
          <div className="wrap">
            <div className="wedding-hero reveal">
              <img
                className="wedding-bg"
                src="/assets/white-wedding.png"
                alt="Bride and groom cutting their white wedding cake"
              />
              <div className="wedding-overlay"></div>
              <div className="wedding-copy">
                <h2 className="wedding-title">Weddings</h2>

                <p className="wedding-sub">
                  Your big day, captured beautifully. Full photography and videography coverage by
                  a two-man camera crew — so not a single moment goes unframed.
                </p>
                <a href="#wedding-packages" className="btn btn-gold">
                  Book now
                </a>
              </div>
            </div>

            <div className="wedding-packages reveal" id="wedding-packages">
              <span className="kicker">White Wedding — Photography &amp; Videography</span>
              <div className="wp-grid">
                <div className="wp-card">
                  <span className="wp-tag">Package 1</span>
                  <div className="wp-price display">R15 000</div>
                  <ul className="wp-list">
                    <li>2 cameras</li>
                    <li>6 hours of coverage</li>
                    <li>1 lighting setup</li>
                    <li>Photo &amp; video highlights</li>
                  </ul>
                  <button className="btn btn-primary" onClick={() => openQuote([WEDDING_PACKAGE_1])}>
                    Book this package
                  </button>
                </div>
                <div className="wp-card featured">
                  <span className="wp-tag">Package 2 — Most booked</span>
                  <div className="wp-price display">R22 000</div>
                  <ul className="wp-list">
                    <li>3 cameras</li>
                    <li>Drone coverage included</li>
                    <li>2 lighting setups</li>
                    <li>Full-day photo &amp; video</li>
                  </ul>
                  <button className="btn btn-primary" onClick={() => openQuote([WEDDING_PACKAGE_2])}>
                    Book this package
                  </button>
                </div>
              </div>
              <p className="wp-note">
                Please note: transport to and from your venue is not included in the package price
                and is quoted separately based on your venue's location.
              </p>
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

        <section className="graduation" id="graduation">
          <div className="grad-grid reveal">
            <div className="grad-copy">
              <h2 className="grad-heading">
                <span className="grad-cap" aria-hidden="true">🎓</span>
                <span className="grad-word">Graduation</span>
                <span className="grad-sub">Photography</span>
              </h2>
              <p>
                You worked years for this day — let's make sure it looks like it. From the
                tassel turn to the family hugs afterwards, we capture the pride, the joy and
                every cap tossed into the sky.
              </p>
              <p>
                Individual portraits, family group shots and full ceremony coverage, delivered
                in crisp high resolution — ready for frames, albums and every auntie's
                WhatsApp status.
              </p>
              <button className="grad-book-btn" onClick={() => openQuote(["Graduation Photoshoot"])}>
                Book now
              </button>
            </div>
            <div className="grad-photo">
              <img
                src="/assets/graduation.png"
                alt="Graduates celebrating in their caps and gowns"
              />
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
                  <dd>**** **** **</dd>
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
                <button className="btn btn-primary" onClick={() => openQuote()}>
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

      <WeddingSpecialPromotion />
      {quoteOpen && <QuoteModal onClose={() => setQuoteOpen(false)} preselect={quotePreselect} />}
    </>
  );
}
