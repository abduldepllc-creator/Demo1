"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BadgePercent,
  ChevronDown,
  FlaskConical,
  Mail,
  Menu,
  Phone,
  Tag,
  Truck,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_LINKS, SERVICE_LINKS } from "@/constants";
import { siteConfig, whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";
import { SoapBlock } from "@/components/shared/soap-block";
import { WhatsAppIcon } from "@/components/shared/icons";

type NavCategory = { slug: string; name: string; tagline: string; color: string; translucent: boolean };

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "/wholesale": BadgePercent,
  "/private-label": Tag,
  "/quality": FlaskConical,
  "/shipping": Truck,
};

const SERVICE_PATHS = SERVICE_LINKS.map((s) => s.href as string);

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/images/logo-mark.png"
        alt=""
        width={478}
        height={555}
        priority
        sizes="48px"
        className="h-11 w-auto drop-shadow-sm sm:h-12"
      />
      <span className="flex flex-col leading-none">
        <span className={cn("text-xl font-extrabold tracking-tight sm:text-[1.4rem]", light ? "text-white" : "text-navy")}>
          Soap<span className="text-brand">Base</span>
          <span className={light ? "text-white/80" : "text-navy"}>.pk</span>
        </span>
        <span
          className={cn(
            "mt-1 text-[9.5px] font-bold tracking-[0.18em] uppercase sm:text-[10px]",
            light ? "text-white/60" : "text-muted",
          )}
        >
          Premium Soap Base in Bulk
        </span>
      </span>
    </span>
  );
}

function Dropdown({ children, width }: { children: React.ReactNode; width: string }) {
  return (
    <div
      className={cn(
        "invisible absolute top-full left-1/2 -translate-x-1/2 translate-y-3 pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
        width,
      )}
    >
      <div className="rounded-3xl border border-navy/5 bg-white p-3 shadow-lift">{children}</div>
    </div>
  );
}

export function Header({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Close the mobile menu when the route changes.
  if (open && openedAt !== pathname) setOpen(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled;
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/products") return pathname.startsWith("/products") || pathname.startsWith("/categories");
    if (href === "/services") return pathname === "/services" || SERVICE_PATHS.includes(pathname);
    return pathname.startsWith(href);
  };

  const linkClass = (href: string) =>
    cn(
      "relative flex items-center gap-1 rounded-full px-3 py-2 text-[15px] font-semibold transition-colors xl:px-4",
      solid ? "text-navy hover:text-brand" : "text-white/85 hover:text-white",
      isActive(href) && (solid ? "text-brand" : "text-white"),
    );

  const underline = (href: string) =>
    isActive(href) && (
      <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand xl:inset-x-4" />
    );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Top bar */}
      <div
        className={cn(
          "hidden overflow-hidden bg-navy-900/90 text-white/75 backdrop-blur transition-all duration-500 md:block",
          solid ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
        )}
      >
        <div className="container-x flex h-10 items-center justify-between text-xs font-medium">
          <p className="flex items-center gap-2">
            <Truck className="size-3.5 text-brand-400" />
            Nationwide bulk delivery across Pakistan
          </p>
          <div className="flex items-center gap-6">
            <a href={siteConfig.contact.phoneHref} className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Phone className="size-3.5 text-brand-400" />
              {siteConfig.contact.phone}
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Mail className="size-3.5 text-brand-400" />
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          "transition-all duration-500",
          solid
            ? "border-b border-navy/5 bg-white/90 shadow-[0_8px_30px_-12px_rgba(13,44,80,0.25)] backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div className={cn("container-x flex items-center justify-between transition-all duration-500", solid ? "h-17.5" : "h-20")}>
          <Link href="/" aria-label={`${siteConfig.name} home`}>
            <Logo light={!solid} />
          </Link>

          <nav className="hidden items-center lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => {
              if (link.href === "/products") {
                return (
                  <div key={link.href} className="group relative">
                    <Link href={link.href} className={linkClass(link.href)}>
                      {link.label}
                      <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" />
                      {underline(link.href)}
                    </Link>
                    <Dropdown width="w-160">
                      <div className="grid grid-cols-2 gap-1">
                        {categories.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/categories/${c.slug}`}
                            className="group/item flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-mist"
                          >
                            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-mist transition-transform duration-300 group-hover/item:scale-110">
                              <SoapBlock color={c.color} translucent={c.translucent} stamp={false} shadow={false} className="w-9" />
                            </span>
                            <span>
                              <span className="block text-sm font-bold text-navy">{c.name}</span>
                              <span className="block text-xs text-muted">{c.tagline}</span>
                            </span>
                          </Link>
                        ))}
                        <Link
                          href="/products"
                          className="col-span-2 mt-1 flex items-center justify-between rounded-2xl bg-navy px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-navy-700"
                        >
                          Browse the full catalogue
                          <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    </Dropdown>
                  </div>
                );
              }
              if (link.href === "/services") {
                return (
                  <div key={link.href} className="group relative">
                    <Link href={link.href} className={linkClass(link.href)}>
                      {link.label}
                      <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" />
                      {underline(link.href)}
                    </Link>
                    <Dropdown width="w-96">
                      <div className="grid gap-1">
                        {SERVICE_LINKS.map((s) => {
                          const Icon = SERVICE_ICONS[s.href];
                          return (
                            <Link
                              key={s.href}
                              href={s.href}
                              className="group/item flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-mist"
                            >
                              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand transition-colors group-hover/item:bg-brand group-hover/item:text-white">
                                <Icon className="size-5" />
                              </span>
                              <span>
                                <span className="block text-sm font-bold text-navy">{s.label}</span>
                                <span className="block text-xs text-muted">{s.text}</span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </Dropdown>
                  </div>
                );
              }
              return (
                <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                  {link.label}
                  {underline(link.href)}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/contact" className="btn btn-primary hidden py-2.5! sm:inline-flex lg:hidden xl:inline-flex">
              Get Bulk Quote
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpenedAt(pathname);
                setOpen(true);
              }}
              aria-label="Open menu"
              className={cn(
                "grid size-11 place-items-center rounded-full transition-colors lg:hidden",
                solid ? "bg-mist text-navy" : "bg-white/10 text-white",
              )}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-white lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between border-b border-navy/5 p-4">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid size-11 place-items-center rounded-full bg-mist text-navy"
                >
                  <X className="size-5" />
                </button>
              </div>

              <motion.nav
                className="flex flex-col gap-1 p-4"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }}
              >
                {NAV_LINKS.map((link) => (
                  <motion.div key={link.href} variants={{ hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0 } }}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-bold",
                        isActive(link.href) ? "bg-brand-50 text-brand-700" : "text-navy hover:bg-mist",
                      )}
                    >
                      {link.label}
                      <ArrowRight className="size-4 opacity-50" />
                    </Link>
                  </motion.div>
                ))}

                <motion.p
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                  className="mt-4 px-4 text-xs font-bold tracking-widest text-muted uppercase"
                >
                  Services
                </motion.p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {SERVICE_LINKS.map((s) => {
                    const Icon = SERVICE_ICONS[s.href];
                    return (
                      <motion.div key={s.href} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                        <Link href={s.href} className="flex h-full items-center gap-2 rounded-2xl bg-mist p-3 text-xs font-bold text-navy">
                          <Icon className="size-4 shrink-0 text-brand" />
                          {s.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.p
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                  className="mt-4 px-4 text-xs font-bold tracking-widest text-muted uppercase"
                >
                  Categories
                </motion.p>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {categories.map((c) => (
                    <motion.div key={c.slug} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                      <Link
                        href={`/categories/${c.slug}`}
                        className="flex h-full flex-col items-center gap-1 rounded-2xl bg-mist p-2.5 text-center"
                      >
                        <SoapBlock color={c.color} translucent={c.translucent} stamp={false} shadow={false} className="w-10" />
                        <span className="text-[11px] leading-tight font-bold text-navy">{c.name.replace(" Soap Base", "")}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.nav>

              <div className="mt-auto space-y-3 border-t border-navy/5 p-4">
                <Link href="/contact" className="btn btn-primary w-full">
                  Get Bulk Quote
                </Link>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">
                  <WhatsAppIcon className="size-5 text-[#25D366]" />
                  WhatsApp Us
                </a>
                <a href={siteConfig.contact.phoneHref} className="flex items-center justify-center gap-2 pt-1 text-sm font-semibold text-muted">
                  <Phone className="size-4" /> {siteConfig.contact.phone}
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
