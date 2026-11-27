"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Mail, Menu, Phone, Truck, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/constants";
import { siteConfig, whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";
import { SoapBlock } from "@/components/shared/soap-block";
import { WhatsAppIcon } from "@/components/shared/icons";

type NavCategory = { slug: string; name: string; tagline: string; color: string; translucent: boolean };

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/images/logo-mark.png"
        alt=""
        width={478}
        height={555}
        priority
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

export function Header({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Close the mobile menu when the route changes.
  if (open && openedAt !== pathname) setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

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
        <div className={cn("container-x flex items-center justify-between transition-all duration-500", solid ? "h-[70px]" : "h-20")}>
          <Link href="/" aria-label={`${siteConfig.name} home`}>
            <Logo light={!solid} />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) =>
              link.href === "/products" ? (
                <div key={link.href} className="group relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-semibold transition-colors",
                      solid ? "text-navy hover:text-brand" : "text-white/85 hover:text-white",
                      isActive(link.href) && (solid ? "text-brand" : "text-white"),
                    )}
                  >
                    {link.label}
                    <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" />
                  </Link>
                  {/* Mega menu */}
                  <div className="invisible absolute top-full left-1/2 w-[640px] -translate-x-1/2 translate-y-3 pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="grid grid-cols-2 gap-1 rounded-3xl border border-navy/5 bg-white p-3 shadow-lift">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/products?category=${c.slug}`}
                          className="flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-mist"
                        >
                          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-mist">
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
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[15px] font-semibold transition-colors",
                    solid ? "text-navy hover:text-brand" : "text-white/85 hover:text-white",
                    isActive(link.href) && (solid ? "text-brand" : "text-white"),
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand"
                    />
                  )}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/contact" className="btn btn-primary hidden !py-2.5 sm:inline-flex">
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
                variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
              >
                {NAV_LINKS.map((link) => (
                  <motion.div
                    key={link.href}
                    variants={{ hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0 } }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-bold",
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
                  Categories
                </motion.p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {categories.map((c) => (
                    <motion.div key={c.slug} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                      <Link
                        href={`/products?category=${c.slug}`}
                        className="flex h-full flex-col items-center gap-1 rounded-2xl bg-mist p-3 text-center"
                      >
                        <SoapBlock color={c.color} translucent={c.translucent} stamp={false} shadow={false} className="w-12" />
                        <span className="text-xs font-bold text-navy">{c.name.replace(" Soap Base", "")}</span>
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
