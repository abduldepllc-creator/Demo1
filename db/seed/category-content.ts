/** Seed content for each category landing page (stored in the categories table), keyed by slug. */
export type CategoryContent = {
  headline: string;
  benefits: { title: string; text: string }[];
  applications: string[];
  proTip: string;
};

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  transparent: {
    headline: "Glass-like clarity that lets your designs shine",
    benefits: [
      { title: "Brilliant clarity", text: "Shows off embeds, botanicals, glitter and layered colours." },
      { title: "Low-sweat formula", text: "Made to resist glycerin dew in humid weather." },
      { title: "Fast, clean melt", text: "Melts smoothly at 60â€“65 Â°C with minimal bubbles." },
    ],
    applications: ["Gift & festive soaps", "Embedded designs", "Hotel amenities", "Kids' novelty soaps", "Corporate giveaways"],
    proTip: "Spritz rubbing alcohol on the surface right after pouring to remove bubbles and keep a glass-clear finish.",
  },
  milky: {
    headline: "Smooth, opaque white for true pastel colours",
    benefits: [
      { title: "Bright white base", text: "Gives clean, true-to-tone pastel colours." },
      { title: "Hard, long-lasting bar", text: "Holds detailed moulds and lasts longer in use." },
      { title: "Creamy lather", text: "A rich, mild lather that everyday customers love." },
    ],
    applications: ["Everyday bath bars", "Layered & swirled soaps", "Baby-care ranges", "Hotel soaps", "Detailed mould designs"],
    proTip: "Pour milky layers at a slightly lower temperature than clear layers so the two stay crisp and separate.",
  },
  "goat-milk": {
    headline: "Real goat milk for gentle, nourishing skincare",
    benefits: [
      { title: "Real goat milk", text: "Naturally rich in vitamins, proteins and fats." },
      { title: "Deeply moisturising", text: "Gentle enough for sensitive and dry skin." },
      { title: "Premium positioning", text: "A high-value base for luxury and natural brands." },
    ],
    applications: ["Sensitive-skin ranges", "Baby-care soaps", "Premium natural brands", "Winter-care collections", "Spa & salon retail"],
    proTip: "Keep goat milk base under 65 Â°C when melting. Overheating can scorch the milk and darken its colour.",
  },
  "aloe-vera": {
    headline: "Soothing botanical goodness in a fresh green bar",
    benefits: [
      { title: "Real aloe extract", text: "Soothes, cools and refreshes skin." },
      { title: "Translucent green", text: "A natural herbal look with no added colour needed." },
      { title: "Light & hydrating", text: "Great for face bars and summer ranges." },
    ],
    applications: ["Herbal ranges", "Summer collections", "After-sun soaps", "Facial bars", "Natural & organic brands"],
    proTip: "Pair aloe bases with cucumber, mint or green tea fragrances for a refreshing spa-style range.",
  },
  "shea-butter": {
    headline: "Luxurious, conditioning bars with a lotion-like lather",
    benefits: [
      { title: "High shea content", text: "Deeply conditions and softens skin." },
      { title: "Dense, creamy lather", text: "A rich, lotion-like feel in the hand." },
      { title: "Spa-grade feel", text: "Ideal for luxury and premium gift ranges." },
    ],
    applications: ["Luxury & spa ranges", "Dry-skin care", "Winter collections", "Premium gift boxes", "Men's grooming"],
    proTip: "Butter-rich bases set more slowly. Allow extra cooling time before you unmould them for a flawless surface.",
  },
  charcoal: {
    headline: "Bold black bars that deep-clean and detox",
    benefits: [
      { title: "Activated charcoal", text: "Draws out excess oil, dirt and impurities." },
      { title: "Striking black colour", text: "Stands out on shelves and in photos." },
      { title: "Oil control", text: "Ideal for oily, acne-prone and active skin." },
    ],
    applications: ["Men's grooming", "Anti-acne ranges", "Detox & face bars", "Sports & active lines", "Trend-led product drops"],
    proTip: "Layer charcoal with a white base for a dramatic black-and-white bar that customers love.",
  },
};
