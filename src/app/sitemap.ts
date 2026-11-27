import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getCategories, getProducts } from "@/db/queries/catalog";
import { GUIDES } from "@/content/guides";

const STATIC_PAGES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/products", priority: 0.9 },
  { path: "/categories", priority: 0.9 },
  { path: "/services", priority: 0.8 },
  { path: "/wholesale", priority: 0.8 },
  { path: "/private-label", priority: 0.8 },
  { path: "/quality", priority: 0.7 },
  { path: "/shipping", priority: 0.7 },
  { path: "/guides", priority: 0.7 },
  { path: "/about", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  { path: "/faq", priority: 0.6 },
  { path: "/privacy-policy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const url = (path: string) => `${siteConfig.url}${path}`;

  return [
    ...STATIC_PAGES.map((p) => ({ url: url(p.path), changeFrequency: "weekly" as const, priority: p.priority })),
    ...categories.map((c) => ({ url: url(`/categories/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: url(`/products/${p.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...GUIDES.map((g) => ({
      url: url(`/guides/${g.slug}`),
      lastModified: new Date(`${g.date}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
