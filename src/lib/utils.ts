export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPKR(amount: number) {
  return `Rs ${Math.round(amount).toLocaleString("en-PK")}`;
}

/** Mix a hex colour towards white (amount > 0) or black (amount < 0). */
export function shade(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const target = amount > 0 ? 255 : 0;
  const t = Math.abs(amount);
  const ch = (shift: number) => {
    const c = (n >> shift) & 255;
    return Math.round(c + (target - c) * t);
  };
  return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, "0")).join("")}`;
}

export function isDark(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 110;
}
