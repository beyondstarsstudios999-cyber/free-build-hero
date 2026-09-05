import { createFileRoute, Link } from "@tanstack/react-router";


export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — BeyondStars Studios" },
      {
        name: "description",
        content:
          "A selection of weddings, traditional ceremonies and portraits photographed and filmed by BeyondStars Studios.",
      },
      { property: "og:title", content: "Gallery — BeyondStars Studios" },
      {
        property: "og:description",
        content: "Real weddings and ceremonies captured by BeyondStars Studios.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/assets/gallery/g3.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/assets/gallery/g3.jpg" },
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
  component: Gallery,
});

const LOGO_URL = "/assets/beyondstars-logo.png";
const LOGO_MOBILE_URL = "/assets/beyondstars-logo-gold.png";
const PHONE = "067 233 8490";
const PHONE_TEL = "+27672338490";
const EMAIL = "hilton@beyondstars.co.za";

const SHOTS: Array<{ url: string; alt: string }> = [
  { url: "/assets/gallery/g1.png", alt: "Bride in a lace gown holding yellow roses by the lake" },
  { url: "/assets/gallery/g2.png", alt: "Groom taking the bride's hand, wedding rings on display" },
  { url: "/assets/gallery/g3.jpg", alt: "Bride and groom celebrating with guests at the reception" },
  { url: "/assets/gallery/g4.jpg", alt: "Traditional Zulu bridal procession in full regalia" },
  { url: "/assets/gallery/g5.png", alt: "Couple in traditional attire during their ceremony" },
  { url: "/assets/gallery/g6.jpg", alt: "Elder in traditional dress during the celebration" },
  { url: "/assets/gallery/gallery-vaya.jpg", alt: "Vaya Footwear brand campaign with sneaker spotlight" },
  { url: "/assets/gallery/gallery-manshow.webp", alt: "The 2 Man Show event flyer with DJs and lineup" },
  { url: "/assets/gallery/gallery-kasiefm.jpg", alt: "Kasie FM 97.1 team group photo for 2025" },
  { url: "/assets/gallery/gallery-littledolphins.jpg", alt: "Little Dolphins Learning Centre graduation portraits" },
  { url: "/assets/gallery/gallery-sniffles.jpg", alt: "Adventures of Sniffles kids event with mascot" },
];

function Gallery() {
  return (
    <>
      <header className="site">
        <div className="nav">
          <Link to="/" className="brand">
            <img src={LOGO_URL} alt="BeyondStars Studios" className="brand-logo brand-logo-desktop" />
            <img src={LOGO_MOBILE_URL} alt="BeyondStars Studios" className="brand-logo brand-logo-mobile" />
          </Link>
          <nav className="links open">
            <Link to="/">Back to prices</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="gallery-page">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="kicker">Gallery</span>
                <h1 className="section-title display">Our work.</h1>
              </div>
              <p className="section-note">
                Weddings, traditional ceremonies and portraits — shot and framed by BeyondStars
                Studios.
              </p>
            </div>

            <div className="gallery-grid">
              {SHOTS.map((s) => (
                <figure className="gallery-item" key={s.url}>
                  <img src={s.url} alt={s.alt} loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap foot-row">
          <Link to="/" className="brand">
            <img src={LOGO_URL} alt="BeyondStars Studios" className="brand-logo brand-logo-desktop" />
            <img src={LOGO_MOBILE_URL} alt="BeyondStars Studios" className="brand-logo brand-logo-mobile" />
          </Link>
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
    </>
  );
}
