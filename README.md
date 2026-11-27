# SoapBase.pk — SoapBase Pakistan

**Premium Raw Soap Base in Bulk.** The website for SoapBase Pakistan, a wholesale supplier of melt & pour soap base (transparent, milky, goat milk, aloe vera, shea butter and activated charcoal), supplying soap makers, cosmetic brands and resellers across Pakistan.

> Positioning: **Wholesale Supplier · Bulk Orders · Raw Soap Materials**

---

## Project status

| Area | Status |
| --- | --- |
| Website (customer side) | ✅ Complete: 14 page types, 46 prerendered pages |
| Product catalogue (DB-driven) | ✅ 6 categories, 12 products (sample data) |
| Quote / enquiry form | ✅ Saves to the database. ⚠️ No email/WhatsApp notification yet |
| Responsive design | ✅ Checked at desktop (1440px) and phone (390px) widths |
| SEO | ✅ Metadata per page, sitemap, robots.txt, FAQ & Article structured data |
| Production build / lint | ✅ `npm run build` and `npm run lint` pass |
| Admin panel | ⏳ Not started (enquiries can be viewed with `npm run db:studio`) |
| Real business details | ⚠️ Phone, WhatsApp, email, address, stats and testimonials are placeholders |
| Legal pages | ⚠️ Template text. Have it reviewed by a legal professional before launch |
| Deployment | ⏳ Not deployed yet (see [Deployment](#deployment)) |

_Last updated: 27 November 2026_

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, Cache Components, Partial Prefetching) |
| UI | React 19, TypeScript, [Tailwind CSS v4](https://tailwindcss.com) |
| Animation | CSS keyframes (most effects) + [Motion](https://motion.dev) for scroll reveals and interactive UI |
| Icons | [lucide-react](https://lucide.dev) |
| Database | SQLite via [libSQL](https://github.com/tursodatabase/libsql) + [Drizzle ORM](https://orm.drizzle.team) |
| Validation | [Zod](https://zod.dev) |
| Font | Plus Jakarta Sans (self-hosted via `next/font`) |

> ⚠️ **Next.js 16 note:** this version differs from older Next.js releases. Before changing framework-level code, read the bundled docs in `node_modules/next/dist/docs/` (see `AGENTS.md`).

---

## Getting started

Requirements: **Node.js 20+** (developed on Node 24) and npm.

```bash
git clone https://github.com/abduldepllc-creator/Demo1.git
cd Demo1
npm install
cp .env.example .env      # Windows PowerShell: Copy-Item .env.example .env
npm run db:migrate        # create the tables in local.db
npm run db:seed           # load the 6 categories and 12 products
npm run dev               # http://localhost:3000
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Create a new migration after changing the schema |
| `npm run db:migrate` | Apply migrations to the database |
| `npm run db:push` | Push the schema directly (quick prototyping, no migration file) |
| `npm run db:seed` | Reset and reload the catalogue (categories + products). Enquiries are kept |
| `npm run db:studio` | Open Drizzle Studio to browse and edit data (including enquiries) |

### Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `file:./local.db` | libSQL/SQLite connection URL. Use a `libsql://…` URL for Turso |
| `DATABASE_AUTH_TOKEN` | _(empty)_ | Auth token for a hosted libSQL/Turso database |

`.env` and `local.db` are git-ignored. `.env.example` is the template.

---

## Pages

| Route | Page | Data source |
| --- | --- | --- |
| `/` | Home: hero, trust badges, categories, featured products, stats, why us, process, services, industries, testimonials, guides, CTA | DB + content files |
| `/products` | Catalogue with category filter (`?category=slug`), search and sort | DB |
| `/products/[slug]` | Product detail: specs, volume pricing, **bulk price calculator**, related products | DB |
| `/categories` | All six categories | DB |
| `/categories/[slug]` | Category landing page: products, benefits, applications, pro tip | DB + `src/content/categories.ts` |
| `/services` | Services hub | Static |
| `/wholesale` | Wholesale program: pricing tiers, benefits, how to join | Static |
| `/private-label` | Private label & custom formulation | Static |
| `/quality` | Quality assurance & batch testing | Static |
| `/shipping` | Shipping & delivery zones, packaging, self-collection | Static |
| `/guides` | Soap making guides (blog) | `src/content/guides.ts` |
| `/guides/[slug]` | Guide article (with Article structured data) | `src/content/guides.ts` |
| `/about` | Company story, stats, values, timeline | Static |
| `/contact` | Contact channels, **quote form** (pre-filled from product pages), FAQ preview | DB (writes enquiries) |
| `/faq` | Full FAQ by topic (with FAQPage structured data) | `src/content/faqs.ts` |
| `/privacy-policy`, `/terms` | Legal pages (template text) | Static |
| `/api/products` | JSON list of products | DB |
| `/api/health` | Health check | — |
| `/sitemap.xml`, `/robots.txt` | SEO files (include every page, product, category and guide) | DB + content |

---

## Project structure

```
src/
├── actions/            # Server actions (inquiry.ts: quote form submission)
├── app/                # Routes (App Router)
│   ├── (marketing)/    # about, contact, services, wholesale, private-label, quality,
│   │                   # shipping, faq, privacy-policy, terms
│   ├── api/            # route handlers (health, products)
│   ├── categories/     # /categories and /categories/[slug]
│   ├── guides/         # /guides and /guides/[slug]
│   ├── products/       # /products and /products/[slug]
│   ├── layout.tsx      # root layout: header, footer, global effects
│   ├── page.tsx        # home page
│   ├── globals.css     # design tokens, keyframes, component classes
│   └── sitemap.ts, robots.ts, icon.png, not-found.tsx, error.tsx, loading.tsx
├── components/
│   ├── contact/        # quote form, FAQ accordion
│   ├── effects/        # scroll progress, back-to-top, pointer glow, aurora
│   ├── guides/         # guide card
│   ├── home/           # hero, category card, marquee, CTA band
│   ├── layout/         # header (mega menu + mobile drawer), footer
│   ├── products/       # product card, catalogue, quantity calculator
│   └── shared/         # soap block SVG, reveal animations, page hero, feature grid,
│                       # steps, policy page, section heading, icons, WhatsApp button
├── config/             # env.ts (validated env vars), site.ts (brand & contact details)
├── constants/          # navigation, stats, cities
├── content/            # editable marketing content: faqs, guides, category extras
├── db/
│   ├── index.ts        # database client
│   ├── schema/         # Drizzle tables: categories, products, inquiries
│   ├── migrations/     # generated SQL migrations
│   ├── queries/        # cached catalogue queries (catalog.ts)
│   └── seed/           # seed data (data.ts) and seed script
├── lib/                # utils (cn, formatPKR, colour shading), pricing tiers, zod schemas
└── types/              # shared TypeScript types
public/images/          # logo-full.png, logo-mark.png
```

---

## Database

Three tables (see `src/db/schema/index.ts`):

- **categories**: slug, name, tagline, description, `color` (drives the soap illustration), `translucent`, sort order
- **products**: slug, SKU, name, category, descriptions, `pricePerKg` (PKR), `moq` (kg), pack sizes, features, ingredients, pH, melt point, shelf life, badge, rating, stock, featured
- **inquiries**: quote requests from the contact form (name, company, phone, email, city, product, quantity, message, status)

**Editing the catalogue:** change `src/db/seed/data.ts`, then run `npm run db:seed`. This resets categories and products, and keeps enquiries.

**Changing the schema:** edit `src/db/schema/index.ts`, then run `npm run db:generate` and `npm run db:migrate`.

**Caching:** catalogue queries use `"use cache"` with `cacheLife("hours")` and the tag `catalog`, so pages are prerendered and served statically. After editing data in production, either redeploy or call `revalidateTag("catalog")` from a server action.

**Pricing tiers** (`src/lib/pricing.ts`): MOQ–99 kg base price · 100–499 kg −5% · 500–999 kg −8% · 1 ton+ −12%.

---

## Design system

| Token | Value | Tailwind class |
| --- | --- | --- |
| Navy Blue | `#0D2C50` | `bg-navy`, `text-navy` |
| Fresh Green | `#299D36` | `bg-brand`, `text-brand` |
| White | `#FFFFFF` | `bg-white` |
| Light Grey | `#F1F4F2` | `bg-mist` |

Shades (`navy-50…900`, `brand-50…700`), shadows (`shadow-soft`, `shadow-lift`, `shadow-glow`) and animations are defined in `src/app/globals.css` under `@theme`.

**Reusable CSS classes** (in `globals.css`):

| Class | Effect |
| --- | --- |
| `btn`, `btn-primary`, `btn-navy`, `btn-outline`, `btn-ghost-light` | Buttons |
| `container-x` | Page container with responsive side padding |
| `eyebrow` | Small uppercase section label |
| `text-gradient` | Animated green gradient text |
| `spotlight` (+ `spotlight-light` on dark cards) | Cursor-following glow on hover |
| `glow-border` | Rotating gradient border (highlighted cards) |
| `aurora` | Soft drifting colour blob (used by `<Aurora />`) |
| `grid-pattern`, `dot-pattern`, `dot-pattern-light` | Background textures |
| `cv-auto` | `content-visibility: auto` for below-the-fold sections |
| `prose-sb` | Long-form text styling (guides, legal pages) |
| `input` | Form fields |

**Product visuals:** there are no product photos yet. `<SoapBlock />` draws an isometric soap bar in SVG, coloured from each category's or product's `color`. Swap in real photos later if you have them.

**Tailwind v4 conventions:** use canonical class names (`bg-linear-to-r`, not `bg-gradient-to-r`; the important modifier as a suffix, `py-2.5!`; spacing scale values such as `size-112` instead of `size-[28rem]`).

---

## Animations & performance

The site is designed to look rich while staying fast:

- **CSS-first effects.** The hero, page banners, aurora blobs, floating elements, bubbles, marquees, rotating rings and gradient borders are pure CSS keyframes. They animate only `transform`/`opacity`, which the GPU handles, and need no JavaScript.
- **Instant hero.** Home and page banners use CSS entrance animations, so the main heading paints immediately (good LCP) without waiting for JavaScript.
- **One pointer listener.** `<PointerGlow />` uses a single delegated, `requestAnimationFrame`-throttled listener for every spotlight card, and is turned off on touch devices.
- **rAF-throttled scroll handlers.** The header, back-to-top ring and progress bar don't re-render on every scroll event.
- **`content-visibility: auto`** (`cv-auto`) skips rendering off-screen sections until they approach the viewport.
- **Static prerendering.** All 46 pages are prerendered at build time, and catalogue data is cached.
- **Optimised images.** `next/image` with `sizes` and priority loading for the logo.
- **Accessibility.** All animations are disabled under `prefers-reduced-motion`. If JavaScript is unavailable, scroll-reveal content is shown immediately (`<noscript>` fallback).

---

## Before going live — checklist

- [ ] Replace placeholder contact details in `src/config/site.ts` (phone, WhatsApp number, email, address, hours, social links)
- [ ] Replace placeholder stats in `src/constants/index.ts` and testimonials in `src/app/page.tsx`
- [ ] Review the "99.6% first-pass QC" figure on `/quality` and the delivery times on `/shipping`
- [ ] Replace sample products and prices in `src/db/seed/data.ts` with real ones
- [ ] Have `/privacy-policy` and `/terms` reviewed by a legal professional
- [ ] Add enquiry notifications (email or WhatsApp) in `src/actions/inquiry.ts`
- [ ] Add spam protection to the quote form (e.g. a honeypot field, rate limiting or Cloudflare Turnstile)
- [ ] Set up a hosted database for production (see below)

---

## Deployment

`local.db` is a file-based SQLite database. It works for local development and on a VPS, but **not** on serverless hosts such as Vercel, where the filesystem is read-only or temporary.

Recommended options:

1. **Vercel + Turso** (hosted libSQL, no code changes): create a Turso database, set `DATABASE_URL=libsql://…` and `DATABASE_AUTH_TOKEN`, then run `npm run db:migrate` and `npm run db:seed` against it.
2. **VPS / Node server**: `npm run build && npm run start`, keeping `local.db` on persistent disk and backing it up.

---

## Changelog

### v1.2.2 — Instant navigation fix for dynamic pages (28 Nov 2026)
- Fixed the Next.js "URL data outside of `<Suspense>`" warning on `/products/[slug]`, `/categories/[slug]` and `/guides/[slug]`. Each page now renders a `<Suspense>` boundary and reads `params` inside a child component (the pattern recommended in `node_modules/next/dist/docs/01-app/02-guides/adopting-partial-prefetching.md`). The shared page shell no longer depends on the URL, so navigation can be instant.
- New `PageSkeleton` component (`src/components/shared/page-skeleton.tsx`): a branded loading placeholder (detail / grid / article variants) shown while URL-specific content streams in.
- Known slugs are still fully prerendered at build time.
- Unknown slugs (e.g. `/products/does-not-exist`) show the 404 page with HTTP status `200` plus `<meta name="robots" content="noindex">`, so search engines don't index them. This is the documented Next.js behaviour when `notFound()` runs inside a streamed `<Suspense>` boundary. A true `404` status would require `export const instant = false` on these routes, which gives up instant navigation.

### v1.2.1 — Hydration warning fix (28 Nov 2026)
- Added `suppressHydrationWarning` to `<html>` and `<body>` in `src/app/layout.tsx`. Browser extensions (e.g. ColorZilla's `cz-shortcut-listen`) add attributes there before React loads, which caused a hydration-mismatch console error in development. It was not caused by the site's code. The setting only applies to those two elements, so real mismatches in components are still reported.

### v1.2 — Visual polish, new pages & performance (27 Nov 2026)
**New pages (10 routes, +22 prerendered pages):**
- `/categories` and `/categories/[slug]` (6 category landing pages with benefits, applications and pro tips)
- `/services` hub, `/wholesale`, `/private-label`, `/quality`, `/shipping`
- `/guides` and `/guides/[slug]` (4 soap making guides, with Article structured data)
- `/faq` (grouped FAQ with FAQPage structured data), `/privacy-policy`, `/terms`

**Design & animation:**
- Animated aurora backgrounds on the hero and every page banner
- Cursor-following spotlight glow on cards (product, category, feature, guide, testimonial)
- Rotating gradient border on highlighted cards (e.g. the "Most popular" wholesale tier)
- Scroll progress bar, and a back-to-top button with a progress ring
- New home sections: Services and Soap Making Guides
- Header: new Services dropdown and Guides link, with a richer mobile menu (services + categories)
- Footer: contact strip, Services column, legal links, animated link arrows
- Shared building blocks: `FeatureGrid`, `Steps`, `PolicyPage`, `GuideCard`, `Aurora`

**Performance & quality:**
- Hero and page banners converted from JavaScript animations to CSS (headline paints instantly)
- `content-visibility: auto` on below-the-fold sections
- rAF-throttled scroll handlers; one delegated pointer listener for the whole site
- `<noscript>` fallback so content is never hidden without JavaScript
- FAQ content moved to `src/content/faqs.ts` and shared by `/contact` and `/faq`
- Category links now point to the new category pages
- Tailwind classes updated to v4 canonical names across the codebase
- Sitemap expanded to every page, category, product and guide

### v1.1 — Housekeeping (27 Nov 2026)
- Tailwind v4 class names (`bg-gradient-to-*` → `bg-linear-to-*`)
- Code pushed to GitHub (`main` branch)

### v1.0 — SoapBase.pk website (27 Nov 2026)
- Brand theme (navy/green), Plus Jakarta Sans, logo assets and favicon
- Database: categories, products and inquiries tables; 6 categories and 12 seeded products
- Pages: Home, Products (filter/search/sort), Product detail (bulk price calculator), About, Contact (quote form → database)
- Animated hero, scroll reveals, count-up stats, marquees, floating WhatsApp button
- Sitemap, robots.txt, per-page metadata, branded 404/error/loading pages

### v0.1 — Project setup (27 Nov 2026)
- Next.js 16 + TypeScript + Tailwind v4 scaffold
- Drizzle ORM + libSQL database layer with migrations and seed scripts
- Folder structure: `actions`, `components`, `config`, `constants`, `db`, `lib`, `types`, …

---

## Roadmap ideas

- Admin dashboard to manage products, prices and enquiries
- Email/WhatsApp notifications for new enquiries
- Real product photography and image galleries
- Urdu language version
- Customer accounts with order history and re-ordering
