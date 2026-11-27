export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
] as const;

/** Pages shown in the "Services" dropdown and footer. */
export const SERVICE_LINKS = [
  { href: "/wholesale", label: "Wholesale Program", text: "Tiered bulk pricing, credit terms and account managers" },
  { href: "/private-label", label: "Private Label", text: "Custom formulations and soaps under your own brand" },
  { href: "/quality", label: "Quality Assurance", text: "How every batch is tested before it ships" },
  { href: "/shipping", label: "Shipping & Delivery", text: "Nationwide dispatch, packaging and timelines" },
] as const;

export const LEGAL_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
] as const;

export const STATS = [
  { value: 850, suffix: "+", label: "Business clients" },
  { value: 320, suffix: "+", label: "Tons supplied yearly" },
  { value: 60, suffix: "+", label: "Cities delivered" },
  { value: 12, suffix: "", label: "Years of expertise" },
] as const;

export const CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
] as const;
