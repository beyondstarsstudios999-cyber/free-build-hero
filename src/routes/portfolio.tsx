import { createFileRoute, Link } from "@tanstack/react-router";
import lobolaCelebration from "../assets/portfolio/lobola-celebration-2025.mp4.asset.json";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Creative by BeyondStars — Video Portfolio" },
      {
        name: "description",
        content:
          "Explore vertical reels, square videos and widescreen films created by BeyondStars Studios.",
      },
      { property: "og:title", content: "Creative by BeyondStars — Video Portfolio" },
      {
        property: "og:description",
        content:
          "A selection of branded films, restaurant promos, photography and event videos by BeyondStars Studios.",
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
  component: Portfolio,
});

const LOGO_URL = "/assets/beyondstars-logo-gold-2026-oct09.svg";

type PortfolioVideo = {
  title: string;
  src: string;
  poster: string;
};

const VERTICAL_VIDEOS: PortfolioVideo[] = [
  {
    title: "Get Your Quotes Ready",
    src: "/assets/portfolio/graduation-quotes-ready.mp4",
    poster: "/assets/portfolio/graduation-quotes-ready.jpg",
  },
  {
    title: "Munchie Munchie — The Puppet",
    src: "/assets/portfolio/munchie-munchie-puppet.mp4",
    poster: "/assets/portfolio/munchie-munchie-puppet.jpg",
  },
  {
    title: "Get Your Tickets — Zani Eatery",
    src: "/assets/portfolio/get-your-tickets-zani-eatery.mp4",
    poster: "/assets/portfolio/get-your-tickets-zani-eatery.jpg",
  },
];

const SQUARE_VIDEOS: PortfolioVideo[] = [
  {
    title: "Deerock Photography",
    src: "/assets/portfolio/deerock-photography-reel.mp4",
    poster: "/assets/portfolio/deerock-photography-reel.jpg",
  },
  {
    title: "Zani Eatery — Timeless Memories",
    src: "/assets/portfolio/zani-eatery-timeless-memories.mp4",
    poster: "/assets/portfolio/zani-eatery-timeless-memories.jpg",
  },
  {
    title: "Zani Eatery — Unofficial Ad",
    src: "/assets/portfolio/zani-eatery-unofficial-ad.mp4",
    poster: "/assets/portfolio/zani-eatery-unofficial-ad.jpg",
  },
  {
    title: "African Restaurant Promo",
    src: "/assets/portfolio/african-restaurant-promo.mp4",
    poster: "/assets/portfolio/african-restaurant-promo.jpg",
  },
  {
    title: "Invitation for Little Dolphins Learning",
    src: "/assets/portfolio/invitation-little-dolphins-learning.mp4",
    poster: "/assets/portfolio/invitation-little-dolphins-learning.jpg",
  },
  {
    title: "Lobola Celebration 2025",
    src: lobolaCelebration.url,
    poster: "/assets/portfolio/lobola-celebration-2025.jpg",
  },
];

const WIDESCREEN_VIDEOS: PortfolioVideo[] = [
  {
    title: "BeyondStars Brand Film",
    src: "/assets/portfolio/beyondstars-brand-film.mp4",
    poster: "/assets/portfolio/beyondstars-brand-film.jpg",
  },
  {
    title: "Zaolaemoboyz",
    src: "/assets/portfolio/zaolaemoboyz.mp4",
    poster: "/assets/portfolio/zaolaemoboyz.jpg",
  },
];

function VideoGrid({
  videos,
  format,
}: {
  videos: PortfolioVideo[];
  format: "vertical" | "square" | "widescreen";
}) {
  return (
    <div className={`portfolio-grid portfolio-grid-${format}`}>
      {videos.map((video) => (
        <article className="portfolio-item" key={video.src}>
          <video
            controls
            playsInline
            preload="none"
            poster={video.poster}
            aria-label={video.title}
          >
            <source src={video.src} type="video/mp4" />
            Your browser does not support video playback.
          </video>
          <h3>{video.title}</h3>
        </article>
      ))}
    </div>
  );
}

function Portfolio() {
  return (
    <>
      <header className="site">
        <div className="nav">
          <Link to="/" className="brand">
            <img src={LOGO_URL} alt="BeyondStars Studios" className="brand-logo" />
          </Link>
          <nav className="gallery-back" aria-label="Portfolio navigation">
            <Link to="/">Home</Link>
            <Link to="/gallery">Gallery</Link>
          </nav>
        </div>
      </header>

      <main className="portfolio-page">
        <section className="portfolio-intro">
          <div className="wrap">
            <span className="kicker">BeyondStars Studios</span>
            <h1 className="display">Creative by BeyondStars</h1>
            <p>Films, reels and visual stories made for brands, people and celebrations.</p>
          </div>
        </section>

        <section className="portfolio-section" aria-labelledby="vertical-title">
          <div className="wrap">
            <div className="portfolio-section-heading">
              <div>
                <span className="kicker">Portrait format</span>
                <h2 id="vertical-title" className="display">Vertical videos</h2>
              </div>
              <span className="portfolio-ratio">9:16</span>
            </div>
            <VideoGrid videos={VERTICAL_VIDEOS} format="vertical" />
          </div>
        </section>

        <section className="portfolio-section portfolio-section-alt" aria-labelledby="square-title">
          <div className="wrap">
            <div className="portfolio-section-heading">
              <div>
                <span className="kicker">Square format</span>
                <h2 id="square-title" className="display">Square stories</h2>
              </div>
              <span className="portfolio-ratio">1:1</span>
            </div>
            <VideoGrid videos={SQUARE_VIDEOS} format="square" />
          </div>
        </section>

        <section className="portfolio-section" aria-labelledby="widescreen-title">
          <div className="wrap">
            <div className="portfolio-section-heading">
              <div>
                <span className="kicker">Widescreen format</span>
                <h2 id="widescreen-title" className="display">16:9 films</h2>
              </div>
              <span className="portfolio-ratio">16:9</span>
            </div>
            <VideoGrid videos={WIDESCREEN_VIDEOS} format="widescreen" />
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap foot-row">
          <Link to="/" className="brand">
            <img src={LOGO_URL} alt="BeyondStars Studios" className="brand-logo" />
          </Link>
          <Link to="/gallery">View the gallery</Link>
          <span>© 2026 BeyondStars Studios.</span>
        </div>
      </footer>
    </>
  );
}