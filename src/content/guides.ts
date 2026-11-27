export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "tip"; text: string };

export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  date: string; // ISO date
  color: string;
  translucent: boolean;
  body: GuideBlock[];
};

export const GUIDES: Guide[] = [
  {
    slug: "melt-and-pour-soap-making-beginners-guide",
    title: "Melt & Pour Soap Making: The Complete Beginner's Guide",
    excerpt:
      "Everything you need to make your first batch of professional-looking soap with melt & pour base, from equipment to unmoulding.",
    category: "Getting Started",
    readMinutes: 7,
    date: "2026-10-02",
    color: "#cfeef5",
    translucent: true,
    body: [
      { type: "p", text: "Melt & pour soap base is pre-made soap you can melt, customise and pour into moulds. It needs no lye handling and no curing time, so it is the fastest and safest way to start a soap business or craft hobby." },
      { type: "h2", text: "What you will need" },
      { type: "ul", items: ["Soap base (transparent or milky to start)", "A heat-safe jug or double boiler", "Soap-safe fragrance oil and colourants", "Silicone moulds", "A spray bottle of rubbing alcohol (isopropyl)", "A digital thermometer and kitchen scale"] },
      { type: "h2", text: "Step-by-step" },
      { type: "ol", items: ["Cut the soap base into small, even cubes so it melts evenly.", "Melt gently in a double boiler or in short microwave bursts, stirring in between. Keep it below 70 °C.", "Take it off the heat, then stir in colour and 2–3% fragrance oil by weight.", "Pour slowly into your moulds and spritz the surface with alcohol to remove bubbles.", "Leave to set for 1–3 hours, then unmould and wrap in cling film straight away."] },
      { type: "tip", text: "Overheating is the number one beginner mistake. It causes cloudiness, a rubbery texture and burnt fragrance." },
      { type: "h2", text: "Choosing your first base" },
      { type: "p", text: "Transparent base is perfect for embeds and bright colours. Milky (opaque) base gives soft pastels and a creamy look. Many makers start with one of each so they can layer the two." },
    ],
  },
  {
    slug: "how-to-prevent-glycerin-dew-sweating",
    title: "How to Stop Your Soaps from Sweating in Humid Weather",
    excerpt:
      "Glycerin dew is a common problem in Pakistan's humid cities. Here is why it happens and how to prevent it.",
    category: "Troubleshooting",
    readMinutes: 5,
    date: "2026-09-14",
    color: "#d8f1ee",
    translucent: true,
    body: [
      { type: "p", text: "Glycerin is a humectant: it pulls moisture from the air. That makes it great for skin, but it also means finished soaps can form small droplets on the surface, especially in Karachi and Lahore during the monsoon." },
      { type: "h2", text: "Why soaps sweat" },
      { type: "ul", items: ["High humidity (above about 60%)", "Leaving soaps unwrapped after unmoulding", "Big temperature swings between day and night", "Bases with a very high glycerin content"] },
      { type: "h2", text: "How to prevent it" },
      { type: "ol", items: ["Choose a low-sweat base such as our Crystal Clear Glycerin Soap Base.", "Wrap soaps tightly in cling film or shrink wrap as soon as they set.", "Store finished stock in a dry, air-conditioned area.", "Use silica gel sachets inside storage boxes."] },
      { type: "tip", text: "If soaps have already sweated, dry them with a fan for an hour and re-wrap them. The droplets do not affect quality." },
    ],
  },
  {
    slug: "choosing-the-right-soap-base-for-your-brand",
    title: "Choosing the Right Soap Base for Your Brand",
    excerpt:
      "Transparent, goat milk, shea or charcoal? A practical guide to matching soap bases to your products and customers.",
    category: "Business",
    readMinutes: 6,
    date: "2026-08-21",
    color: "#f1e3c8",
    translucent: false,
    body: [
      { type: "p", text: "Your soap base shapes how your product looks, how it feels in use and the price it can command. Here is how our six bases match different brand positions." },
      { type: "h2", text: "Match the base to your customer" },
      { type: "ul", items: ["Gift & novelty brands: Transparent base, for embeds and bright colours.", "Everyday & hotel ranges: Milky base, which is cost-effective, hard and long-lasting.", "Sensitive-skin & baby care: Goat Milk base, which is gentle and moisturising.", "Herbal & natural lines: Aloe Vera base, which is soothing and naturally green.", "Luxury & spa: Shea Butter base, for a creamy, conditioning lather.", "Men's & anti-acne: Charcoal base, which deep-cleans and looks striking."] },
      { type: "h2", text: "Think about margins" },
      { type: "p", text: "Premium bases such as goat milk and shea butter cost more per kg, but they support much higher retail prices. Many successful brands run an affordable everyday line alongside a premium hero range." },
      { type: "tip", text: "Order 1 kg samples of two or three bases, test them with real customers, then scale up the winner in bulk." },
    ],
  },
  {
    slug: "starting-a-soap-business-in-pakistan",
    title: "Starting a Soap Business in Pakistan: A Practical Checklist",
    excerpt:
      "From sourcing raw materials to pricing and selling online, a practical checklist for launching a soap brand in Pakistan.",
    category: "Business",
    readMinutes: 8,
    date: "2026-07-30",
    color: "#bfe6a8",
    translucent: true,
    body: [
      { type: "p", text: "Pakistan's handmade and natural soap market is growing fast, driven by Instagram shops, gift boxes and demand for natural skincare. Melt & pour base lets you launch with little equipment and low risk." },
      { type: "h2", text: "Launch checklist" },
      { type: "ol", items: ["Define your niche: gifts, natural skincare, kids or men's grooming.", "Pick 2–3 hero products and order samples to test.", "Source reliable bulk raw materials with consistent quality.", "Design packaging and labels that list ingredients clearly.", "Work out your cost per bar, including base, fragrance, mould wear, packaging and delivery.", "Start selling on Instagram, WhatsApp and local markets, then expand to marketplaces."] },
      { type: "h2", text: "Pricing your soaps" },
      { type: "p", text: "A simple rule is to multiply your total cost per bar by 2.5–3 to get a retail price, then check it against competitors. Buying soap base in bulk lowers your cost per bar and improves your margins." },
      { type: "tip", text: "Volume discounts start at 100 kg with SoapBase. Plan your production in batches to reach the next pricing tier." },
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}
