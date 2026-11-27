export type PriceTier = { label: string; min: number; max: number | null; discount: number };

export function getPriceTiers(moq: number): PriceTier[] {
  return [
    { label: `${moq} – 99 kg`, min: moq, max: 99, discount: 0 },
    { label: "100 – 499 kg", min: 100, max: 499, discount: 0.05 },
    { label: "500 – 999 kg", min: 500, max: 999, discount: 0.08 },
    { label: "1 ton +", min: 1000, max: null, discount: 0.12 },
  ];
}

export function tierFor(qty: number, moq: number) {
  const tiers = getPriceTiers(moq);
  return [...tiers].reverse().find((t) => qty >= t.min) ?? tiers[0];
}

export function priceFor(basePrice: number, qty: number, moq: number) {
  const tier = tierFor(qty, moq);
  const unit = basePrice * (1 - tier.discount);
  return { tier, unit, total: unit * qty };
}
