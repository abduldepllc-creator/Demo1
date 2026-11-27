# SoapBase.pk — SoapBase Pakistan

**Premium Raw Soap Base in Bulk.** The website and admin panel for SoapBase Pakistan, a wholesale supplier of melt & pour soap base (transparent, milky, goat milk, aloe vera, shea butter and activated charcoal), supplying soap makers, cosmetic brands and resellers across Pakistan.

> Positioning: **Wholesale Supplier · Bulk Orders · Raw Soap Materials**

---

## Quick start (fresh clone → running site)

You need **Node.js 20+** and a free **[Supabase](https://supabase.com)** project.

```bash
git clone https://github.com/abduldepllc-creator/Demo1.git
cd Demo1
npm install
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
# → open .env and paste your Supabase credentials (see below)
npm run setup                 # creates tables, loads sample data, creates the image bucket
npm run dev                   # http://localhost:3000  ·  admin: http://localhost:3000/admin
```

**Where to find the Supabase values** (Supabase dashboard → your project):

| `.env` variable | Where to find it |
| --- | --- |
| `DATABASE_URL` | **Connect** button (or Project Settings → Database) → *Connection string* → **Transaction pooler** (port `6543`). Replace `[YOUR-PASSWORD]` with your database password. |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → **API** → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → **API** → `service_role` key (**secret**, server-only) |

**Admin login** (temporary, set in `.env`): username **`admin`**, password **`admin`**. Change `ADMIN_PASSWORD` before going live.

`npm run setup` is safe to run again at any time: it applies new migrations, seeds only when the database is empty, and repairs the storage bucket.

---

## Project status

| Area | Status |
| --- | --- |
| Website (customer side) | ✅ Complete: 14 page types, all catalogue data from the database |
| Admin panel (`/admin`) | ✅ Complete: 10 sections with full create/edit/delete (see [Admin panel](#admin-panel)) |
| Database | ✅ Supabase Postgres via Drizzle ORM. 9 tables, Row Level Security on all tables |
| Image uploads | ✅ Supabase Storage (product galleries & category images). Needs Supabase keys in `.env` |
| One-command setup | ✅ `npm run setup` (migrate + seed + storage bucket) |
| Responsive | ✅ Public site and every admin page checked at 1440px, 768px and 390px (no horizontal overflow) |
| Build / lint / types | ✅ `npm run build`, `npm run lint`, `tsc` all pass |
| End-to-end tested | ✅ Login, product CRUD, validation, order → stock deduction, review approval → rating, public review / newsletter / quote forms (against Postgres 17) |
| Image upload tested live | ⚠️ Code complete, but not yet run against a real Supabase project. Test once your keys are in `.env` |
| Admin password | ⚠️ Temporary `admin` / `admin`. Change before launch |
| Notifications | ⏳ New quote requests / orders don't send email or WhatsApp alerts yet |
| Real business details | ⚠️ Phone, WhatsApp, email, address, stats and testimonials are placeholders |
| Legal pages | ⚠️ Template text. Have it reviewed by a legal professional |
| Deployment | ⏳ Not deployed yet (see [Deployment](#deployment)) |

_Last updated: 28 November 2026_

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, Cache Components, Partial Prefetching, Proxy) |
| UI | React 19, TypeScript, [Tailwind CSS v4](https://tailwindcss.com) |
| Database | [Supabase](https://supabase.com) Postgres + [Drizzle ORM](https://orm.drizzle.team) (`postgres` driver) |
| File storage | Supabase Storage (`@supabase/supabase-js`) |
| Animation | CSS keyframes (most effects) + [Motion](https://motion.dev) for scroll reveals and interactive UI |
| Icons | [lucide-react](https://lucide.dev) |
| Validation | [Zod](https://zod.dev) |
| Font | Plus Jakarta Sans (self-hosted via `next/font`) |

> ⚠️ **Next.js 16 note:** this version differs from older Next.js releases (for example, `middleware.ts` is now `proxy.ts`). Before changing framework-level code, read the bundled docs in `node_modules/next/dist/docs/` (see `AGENTS.md`).

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run setup` | **First run / after pulling changes.** Checks `.env`, generates `ADMIN_SESSION_SECRET` if empty, applies migrations, seeds if empty, creates the storage bucket |
| `npm run dev` | Development server |
| `npm run build` / `npm run start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm run db:generate` | Create a new SQL migration in `db/migrations/` after changing `src/db/schema` |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:seed` | Load sample data (only if the database is empty) |
| `npm run db:reset` | ⚠️ **Wipe ALL data** and reload the sample data |
| `npm run db:studio` | Browse/edit the database in Drizzle Studio |
| `npm run storage:setup` | Create or repair the public image bucket |

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Supabase Postgres connection string (transaction pooler, port 6543) |
| `NEXT_PUBLIC_SUPABASE_URL` | for uploads | Supabase project URL (also allows `next/image` to load stored images) |
| `SUPABASE_SERVICE_ROLE_KEY` | for uploads | Server-only key used to upload/delete images. **Never expose it in client code** |
| `SUPABASE_STORAGE_BUCKET` | – | Image bucket name (default `soapbase-images`) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | ✅ | Admin login (temporary default `admin` / `admin`) |
| `ADMIN_SESSION_SECRET` | ✅ in production | Signs admin session cookies. Generated by `npm run setup` |

`.env` is git-ignored. `.env.example` is the template. On a host such as Vercel, add the same variables in its dashboard.

---

## Admin panel

Open **`/admin`** (you will be redirected to `/admin/login`). Every section works on phones, tablets and desktops: a collapsible sidebar, card layouts for lists on small screens, and tables on larger ones.

| Section | What you can do |
| --- | --- |
| **Overview** | Revenue this month (vs last month), open orders, unpaid balance, low-stock count, 6-month revenue chart (with table view), recent orders, top products, stock alerts, new quote requests |
| **Orders** | List with status filters & search · create (pick an existing customer or enter a new one, optionally save as customer) · edit items with live totals (tier price auto-filled, editable for negotiated deals) · status & payment updates · printable invoice · delete |
| **Customers** | List sorted by total spend, with search · create / edit / delete · order history & lifetime value |
| **Quote Requests** | Enquiries from the website form · status workflow (new → contacted → quoted → converted → closed) · **Convert to order** (pre-fills a new order) · save as customer · reply on WhatsApp · delete |
| **Products** | List with filters (published / hidden / featured / low stock), category filter & search · create / edit / delete · **multi-image upload** (drag & drop, reorder, cover image) · every field shown on the website (prices, MOQ, pack sizes, features, specs, INCI, badge, colour) · publish/hide · featured |
| **Categories** | Create / edit / delete (blocked while products use it) · colour picker with live soap preview · optional image · landing-page content (headline, benefits, applications, pro tip) · publish/hide |
| **Stock** | Stock levels with low / out-of-stock alerts · receive, remove or set a counted level · per-product alert level · full movement history (with links to orders) |
| **Reviews** | Moderate customer reviews (pending → approve / reject) · add reviews received by phone/email · edit / delete. Product rating and review count update automatically |
| **Newsletter** | Subscribers from the website footer · add manually · unsubscribe / resubscribe · delete · **export CSV** |
| **Settings** | Live database & storage health checks, admin account info, temporary-password warning, refresh website cache, maintenance commands |

**How data flows to the website:** products, categories, reviews and stock are read by the public site through cached queries tagged `catalog`. Every admin change calls `updateTag("catalog")`, so the website shows it on the next page load. Hidden products and categories disappear from the site immediately.

**Stock rules:** an order deducts stock once, when it reaches *confirmed*, *processing*, *shipped* or *delivered*. Moving it back to *pending*, cancelling it or deleting it returns the stock. Every change is logged in `stock_movements` with the resulting balance. Stock can go negative when confirmed orders exceed what is on hand (shown as backordered). The website shows **In stock** when stock is above 0, otherwise **Made to order**.

**Security:**
- `src/proxy.ts` redirects every `/admin` request without a valid session to the login page.
- Every admin server action and the CSV export check the session again on the server.
- Sessions are HMAC-signed, HTTP-only, `SameSite=Lax` cookies (7 days).
- The login uses constant-time comparison and a lockout after 5 failed attempts per IP for 15 minutes.
- All input is validated with Zod.
- CSV export neutralises spreadsheet formula injection.
- Admin pages send `noindex`.
- Row Level Security is enabled on every table, so Supabase's public REST API can't read the data with the anon key. The app connects as the database owner and is unaffected.

---

## Customer-side features backed by the database

- Product cards and detail pages show **uploaded photos** (gallery with thumbnails). Products without photos keep the drawn soap illustration.
- **Reviews** on product pages: rating summary, star distribution and approved reviews, plus a **"Write a review"** form. Submissions are held for approval, with a honeypot against spam bots.
- **Newsletter signup** in the footer (saved to `newsletter_subscribers`).
- **Quote form** on `/contact` saves to `inquiries` (appears under *Quote Requests*).
- Stock badges, ratings, prices, category landing-page content and published/hidden state all come from the database.

---

## Project structure

```
db/                         # ← database scripts (separate from app code)
├── migrations/             # SQL migrations generated by drizzle-kit (commit these)
├── seed/
│   ├── catalog.ts          # categories, products, opening stock
│   ├── category-content.ts # category landing-page content
│   ├── samples.ts          # sample reviews, customers, orders, enquiries, subscribers
│   └── index.ts            # seed script (db:seed / db:reset)
├── scripts/
│   ├── setup.ts            # npm run setup
│   ├── migrate.ts          # npm run db:migrate
│   └── storage.ts          # npm run storage:setup
└── client.ts               # DB client for scripts
src/
├── proxy.ts                # protects /admin (Next.js 16 "proxy", formerly middleware)
├── actions/
│   ├── admin/              # admin server actions: products, categories, orders, stock,
│   │                       # customers, inquiries, reviews, newsletter, uploads, auth, settings
│   ├── inquiry.ts          # public quote form
│   └── public.ts           # public review & newsletter forms
├── app/
│   ├── (site)/             # public website (header/footer layout): home, products, categories,
│   │                       # guides, (marketing)/about, contact, services, wholesale, …
│   ├── admin/
│   │   ├── login/          # /admin/login
│   │   └── (panel)/        # admin sidebar layout + all admin sections
│   ├── api/                # route handlers (health, products)
│   ├── layout.tsx          # root HTML shell (fonts, metadata)
│   └── globals.css, sitemap.ts, robots.ts, icon.png, not-found.tsx, error.tsx, loading.tsx
├── components/
│   ├── admin/              # admin shell, UI kit, forms, image uploader, editors, chart
│   ├── products/           # product card, catalogue, gallery, reviews, calculator
│   └── home/ layout/ contact/ guides/ effects/ shared/
├── config/                 # env.ts (validated env vars), site.ts (brand & contact details)
├── content/                # guides, FAQs (static marketing content)
├── db/
│   ├── index.ts            # app DB client (server-only)
│   ├── schema/             # Drizzle schema: all 9 tables
│   └── queries/catalog.ts  # cached public catalogue queries
├── lib/                    # auth, admin-session, admin-utils, stock, storage, pricing, utils
└── types/
```

---

## Database

Nine tables (`src/db/schema/index.ts`), all with RLS enabled:

| Table | Purpose |
| --- | --- |
| `categories` | Name, slug, tagline, description, colour, translucent, image, landing-page content (headline, benefits, applications, pro tip), sort order, published |
| `products` | Name, slug, SKU, category, descriptions, price/kg, MOQ, pack sizes, features, INCI, pH, melt point, shelf life, colour, **images**, badge, rating & review count (auto), **stock kg**, low-stock alert, featured, published |
| `reviews` | Product reviews with moderation status |
| `customers` | Wholesale buyers (contact details, notes) |
| `orders` / `order_items` | Orders with customer snapshot, status, payment status, totals, and line items with product snapshot |
| `stock_movements` | Every stock change (in / out / adjustment), with balance, reason and linked order |
| `inquiries` | Quote requests from `/contact` with status workflow |
| `newsletter_subscribers` | Email list with status and source |

**Changing the schema:** edit `src/db/schema/index.ts` → `npm run db:generate` (writes a new SQL file to `db/migrations/`) → `npm run db:migrate`. Commit the migration files.

**Pricing tiers** (`src/lib/pricing.ts`, used by the public calculator and as default order prices): MOQ–99 kg base · 100–499 kg −5% · 500–999 kg −8% · 1 ton+ −12%.

---

## Design system

| Token | Value | Tailwind class |
| --- | --- | --- |
| Navy Blue | `#0D2C50` | `bg-navy`, `text-navy` |
| Fresh Green | `#299D36` | `bg-brand`, `text-brand` |
| White | `#FFFFFF` | `bg-white` |
| Light Grey | `#F1F4F2` | `bg-mist` |

Shades (`navy-50…900`, `brand-50…700`), shadows (`shadow-soft`, `shadow-lift`, `shadow-glow`) and animations are defined in `src/app/globals.css` under `@theme`.

**Reusable CSS classes** (in `globals.css`): `btn`, `btn-primary`, `btn-navy`, `btn-outline`, `btn-ghost-light`, `container-x`, `eyebrow`, `text-gradient`, `spotlight` (+ `spotlight-light`), `glow-border`, `aurora`, `grid-pattern`, `dot-pattern`, `cv-auto`, `prose-sb`, `input`.

**Admin UI kit** (`src/components/admin/`): `PageHeader`, `Card`, `StatCard`, `Badge`, `Table`/`Th`/`Td`, `FilterTabs`, `SearchBar`, `Pagination`, `EmptyState` (`ui.tsx`), form controls (`form.tsx`), `btn()` button styles (`styles.ts`), `ConfirmAction`, `ImageUploader`, `ListEditor`, `BenefitEditor`, `OrderItemsEditor`, `RevenueChart`, `Toast`.

**Tailwind v4 conventions:** use canonical class names (`bg-linear-to-r`, not `bg-gradient-to-r`; important modifier as a suffix, `py-2.5!`; scale values such as `size-112` instead of `size-[28rem]`).

---

## Animations & performance

- **CSS-first effects.** Hero, page banners, aurora blobs, floating elements, bubbles, marquees and gradient borders are pure CSS keyframes that animate only `transform`/`opacity`.
- **Instant hero.** Banners use CSS entrance animations, so headings paint without waiting for JavaScript.
- **One pointer listener** for every spotlight card (off on touch devices), and **rAF-throttled scroll handlers**.
- **`content-visibility: auto`** on below-the-fold sections.
- **Prerendering + caching.** Public pages are prerendered and catalogue queries are cached (`"use cache"`). Admin pages always render fresh data (`instant = false`, streamed inside Suspense).
- **Optimised images** via `next/image` (local logo and Supabase Storage images).
- **Accessibility.** `prefers-reduced-motion` respected; `<noscript>` fallback for scroll reveals; chart has keyboard-focusable bars and a table view.

---

## Before going live — checklist

- [ ] Set a strong `ADMIN_PASSWORD` (and ideally a different `ADMIN_USERNAME`) in your host's environment variables
- [ ] Make sure `ADMIN_SESSION_SECRET` is set in production (copy it from `.env` or generate a new random 64-character value)
- [ ] Add Supabase keys and test an image upload in Admin → Products
- [ ] Replace placeholder contact details in `src/config/site.ts`, stats in `src/constants/index.ts` and testimonials in `src/app/(site)/page.tsx`
- [ ] Review the "99.6% first-pass QC" figure on `/quality` and the delivery times on `/shipping`
- [ ] Replace the sample products and prices with real ones (in the admin panel, or in `db/seed/catalog.ts` before the first setup)
- [ ] Delete the sample customers, orders, reviews and subscribers (or start with `npm run db:reset` then remove samples)
- [ ] Have `/privacy-policy` and `/terms` reviewed by a legal professional
- [ ] Add notifications (email/WhatsApp) for new quote requests and reviews
- [ ] Consider Cloudflare Turnstile on public forms if spam appears (honeypots are already in place)

---

## Deployment

The app is ready for **Vercel + Supabase** (or any Node.js host):

1. Push to GitHub and import the repo in Vercel.
2. Add all variables from `.env` in Vercel → Project → Settings → Environment Variables. Use a **strong** `ADMIN_PASSWORD` and a real `ADMIN_SESSION_SECRET`.
3. Run `npm run setup` once from your computer against the production `DATABASE_URL` (or `npm run db:migrate` for later schema changes).
4. Deploy. Image uploads work out of the box because images live in Supabase Storage, not on the server's disk.

> The in-memory login throttle resets when a server instance restarts. That is fine for a single admin, but put the site behind your host's rate limiting or a WAF for stronger protection.

---

## Changelog

### v2.0.1 — Dev console fixes (28 Nov 2026)
- **Hydration warnings from browser form-fillers fixed.** Extensions such as password managers add `fdprocessedid="…"` to every input and button before React loads, which logged "A tree hydrated but some attributes … didn't match". `src/app/layout.tsx` now includes a **development-only** inline script that removes just that attribute (via a `MutationObserver`) before hydration. It is never sent to production, where React doesn't report these mismatches anyway. To cover another extension, add its attribute to `EXTENSION_ATTRS`.
- **"Uncached data … outside of `<Suspense>`" on `/admin` fixed.** Every admin page now declares `export const instant = false`, like the admin layout. Admin pages read the session cookie and live data on each request, so they intentionally opt out of instant-navigation validation (as documented for authenticated routes in `node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md`).

### v2.0 — Admin panel, Supabase & one-command setup (28 Nov 2026)
**Database & setup**
- Moved from local SQLite (libSQL) to **Supabase Postgres** (`postgres` driver + Drizzle ORM). The schema grew from 3 to **9 tables**: reviews, customers, orders, order items, stock movements and newsletter subscribers were added. Products gained images, stock, review stats and a published flag. Categories gained an image, landing-page content and a published flag.
- **Row Level Security enabled on every table**, so Supabase's public API can't read business data.
- Migrations, seed data and setup scripts moved to a separate root **`db/`** folder (`db/migrations`, `db/seed`, `db/scripts`).
- **`npm run setup`**: one command after cloning. It checks `.env`, generates the session secret, migrates, seeds only if empty, and creates the storage bucket. Safe to re-run.
- New scripts: `db:reset`, `storage:setup`. The migrate script runs programmatically, without needing drizzle-kit.
- Sample data: 15 reviews, 6 customers, 11 orders across 6 months, 4 quote requests, 8 subscribers and opening stock for every product.

**Admin panel (`/admin`)**
- Login with signed HTTP-only session cookies, `proxy.ts` route protection, server-side checks in every action, constant-time password check and brute-force lockout.
- Ten sections: Overview, Orders, Customers, Quote Requests, Products, Categories, Stock, Reviews, Newsletter, Settings. All CRUD operations are listed in [Admin panel](#admin-panel).
- Image uploads to Supabase Storage (multi-image, drag & drop, reorder, cover image; images are deleted from storage when removed or when a product is deleted).
- Automatic stock deduction and restoration based on order status, with a full movement log.
- Automatic product rating and review count from approved reviews.
- Printable invoices, CSV export, toasts and confirmation prompts.
- Fully responsive: sidebar becomes a slide-in drawer; tables become card lists on phones.

**Customer side**
- Product photo gallery and image cards (falling back to the drawn soap bar).
- Product reviews section with rating summary and a moderated "Write a review" form.
- Footer newsletter signup.
- Stock-based In stock / Made to order badges; ratings only shown when a product has reviews.
- Category landing-page content now comes from the database (editable in admin).
- Public routes moved into a `(site)` route group (URLs unchanged) so the admin has its own layout.

### v1.2.2 — Instant navigation fix for dynamic pages (28 Nov 2026)
- Fixed the Next.js "URL data outside of `<Suspense>`" warning on `/products/[slug]`, `/categories/[slug]` and `/guides/[slug]` by reading `params` inside a `<Suspense>` boundary (pattern from the bundled Next.js docs).
- New `PageSkeleton` loading placeholder.
- Unknown slugs show the 404 page with status `200` plus `noindex` (documented Next.js behaviour for `notFound()` inside a streamed boundary).

### v1.2.1 — Hydration warning fix (28 Nov 2026)
- `suppressHydrationWarning` on `<html>`/`<body>` for attributes injected by browser extensions (e.g. ColorZilla).

### v1.2 — Visual polish, new pages & performance (27 Nov 2026)
- New pages: `/categories` (+ 6 landing pages), `/services`, `/wholesale`, `/private-label`, `/quality`, `/shipping`, `/guides` (+ 4 articles), `/faq`, `/privacy-policy`, `/terms`.
- Aurora backgrounds, cursor spotlight, rotating gradient borders, scroll progress bar, back-to-top ring, new home sections, richer header/footer.
- CSS-only hero animations, `content-visibility`, throttled handlers, `<noscript>` fallback, Tailwind v4 canonical classes, expanded sitemap.

### v1.1 — Housekeeping (27 Nov 2026)
- Tailwind v4 class names; code pushed to GitHub.

### v1.0 — SoapBase.pk website (27 Nov 2026)
- Brand theme, logo assets, DB-driven catalogue (6 categories, 12 products), Home / Products / Product detail (bulk calculator) / About / Contact (quote form), animations, SEO files.

### v0.1 — Project setup (27 Nov 2026)
- Next.js 16 + TypeScript + Tailwind v4 scaffold with Drizzle ORM, migrations and seed scripts.

---

## Roadmap ideas

- Email/WhatsApp notifications for new quote requests, orders and reviews
- Multiple admin users with roles (e.g. via Supabase Auth)
- Customer accounts with order history and re-ordering
- Online payments (e.g. bank transfer confirmation upload, JazzCash/Easypaisa)
- Send newsletters directly from the admin panel
- Urdu language version
