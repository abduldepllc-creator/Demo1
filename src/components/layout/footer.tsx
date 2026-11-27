import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";
import { LEGAL_LINKS, SERVICE_LINKS } from "@/constants";
import { getCategories } from "@/db/queries/catalog";
import { Logo } from "./header";
import { NewsletterForm } from "./newsletter-form";
import { PakistanFlag, WhatsAppIcon } from "@/components/shared/icons";

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/products", label: "All Products" },
  { href: "/categories", label: "Categories" },
  { href: "/guides", label: "Soap Making Guides" },
  { href: "/contact", label: "Contact & Quotes" },
];

function FooterList({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold tracking-widest text-white uppercase">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group inline-flex items-center gap-1.5 transition-colors hover:text-brand-400">
              <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              <span className="-ml-4.5 transition-all duration-300 group-hover:ml-0">{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  "use cache";
  cacheLife("days");
  const year = new Date().getFullYear();
  const categories = await getCategories();

  return (
    <footer className="relative isolate overflow-hidden bg-navy-900 text-white/70">
      <div className="pointer-events-none absolute -top-40 -right-40 -z-10 size-112 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 -z-10 size-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="dot-pattern-light absolute inset-0 -z-10 opacity-50" />

      {/* Newsletter */}
      <div className="container-x relative pt-12">
        <div className="flex flex-col items-start gap-6 rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-white sm:text-2xl">Get wholesale offers & new launches</h3>
            <p className="mt-1 text-sm">Monthly price updates and soap-making tips. No spam, unsubscribe anytime.</p>
          </div>
          <div className="w-full lg:max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Contact strip */}
      <div className="container-x relative">
        <div className="grid gap-4 border-b border-white/10 py-10 sm:grid-cols-3">
          <a href={siteConfig.contact.phoneHref} className="group flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/5 text-brand-400 transition-all duration-300 group-hover:bg-brand group-hover:text-white">
              <Phone className="size-5" />
            </span>
            <span>
              <span className="block text-xs font-bold tracking-wider uppercase">Call sales</span>
              <span className="block font-bold text-white">{siteConfig.contact.phone}</span>
            </span>
          </a>
          <a href={`mailto:${siteConfig.contact.email}`} className="group flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/5 text-brand-400 transition-all duration-300 group-hover:bg-brand group-hover:text-white">
              <Mail className="size-5" />
            </span>
            <span>
              <span className="block text-xs font-bold tracking-wider uppercase">Email us</span>
              <span className="block font-bold text-white">{siteConfig.contact.email}</span>
            </span>
          </a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#25D366]/15 text-[#25D366] transition-all duration-300 group-hover:bg-[#25D366] group-hover:text-white">
              <WhatsAppIcon className="size-6" />
            </span>
            <span>
              <span className="block text-xs font-bold tracking-wider uppercase">WhatsApp</span>
              <span className="block font-bold text-white">Chat for bulk prices</span>
            </span>
          </a>
        </div>
      </div>

      <div className="container-x relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:py-16">
        <div className="sm:col-span-2 lg:col-span-4">
          <Link href="/" aria-label="Home">
            <Logo light />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{siteConfig.description}</p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" />
              {siteConfig.contact.address}
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-brand-400" />
              {siteConfig.contact.hours}
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <FooterList
            title="Soap Bases"
            links={categories.map((c) => ({ href: `/categories/${c.slug}`, label: c.name }))}
          />
        </div>
        <div className="lg:col-span-2">
          <FooterList title="Services" links={SERVICE_LINKS.map(({ href, label }) => ({ href, label }))} />
        </div>
        <div className="lg:col-span-3">
          <FooterList title="Company" links={COMPANY_LINKS} />
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-center text-xs lg:flex-row lg:text-left">
          <p>
            © {year} {siteConfig.name} · {siteConfig.domain}. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2" aria-label="Legal">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="flex items-center gap-2">
            <PakistanFlag className="h-3.5 w-auto" />
            Proudly Pakistani
          </p>
        </div>
      </div>
    </footer>
  );
}
