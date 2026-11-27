export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
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
