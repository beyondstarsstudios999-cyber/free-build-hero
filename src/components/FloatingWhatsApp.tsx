const WA_NUMBER = "27672338490";
const WA_MESSAGE =
  "Hi BeyondStars Studios, I'd like to find out more about your services and get a quotation.";
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;

export function FloatingWhatsApp() {
  return (
    <a
      className="whatsapp-float"
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with BeyondStars Studios on WhatsApp"
    >
      <img src="/assets/whatsapp-icon.png" alt="" />
      <span>Chat on WhatsApp</span>
    </a>
  );
}
