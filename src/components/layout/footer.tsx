import Link from "next/link";
import { cacheLife } from "next/cache";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";
import { NAV_LINKS } from "@/constants";
import { getCategories } from "@/db/queries/catalog";
import { Logo } from "./header";
import { PakistanFlag, WhatsAppIcon } from "@/components/shared/icons";

export async function Footer() {
  "use cache";
  cacheLife("days");
  const year = new Date().getFullYear();
  const categories = await getCategories();

  return (
    <footer className="relative overflow-hidden bg-navy-900 text-white/70">
      <div className="pointer-events-none absolute -top-40 -right-40 size-[28rem] rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[24rem] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="container-x relative grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Link href="/" aria-label="Home">
            <Logo light />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{siteConfig.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {siteConfig.positioning.map((p) => (
              <span key={p} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-sm font-bold tracking-widest text-white uppercase">Soap Bases</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/products?category=${c.slug}`} className="transition-colors hover:text-brand-400">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold tracking-widest text-white uppercase">Company</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-brand-400">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="transition-colors hover:text-brand-400">
                Request a Quote
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-sm font-bold tracking-widest text-white uppercase">Get in touch</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" />
              {siteConfig.contact.address}
            </li>
            <li>
              <a href={siteConfig.contact.phoneHref} className="flex gap-3 transition-colors hover:text-white">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-400" />
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="flex gap-3 transition-colors hover:text-white">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand-400" />
                {siteConfig.contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-brand-400" />
              {siteConfig.contact.hours}
            </li>
          </ul>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-6 bg-[#25D366] !py-2.5 text-white hover:-translate-y-0.5 hover:bg-[#1fb857]"
          >
            <WhatsAppIcon className="size-5" />
            WhatsApp Sales
          </a>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-center text-xs sm:flex-row sm:text-left">
          <p>
            © {year} {siteConfig.name} · {siteConfig.domain}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <PakistanFlag className="h-3.5 w-auto" />
            Proudly Pakistani · Made for local makers & brands
          </p>
        </div>
      </div>
    </footer>
  );
}
