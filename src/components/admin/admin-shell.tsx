"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquareText,
  Package,
  Settings,
  ShoppingCart,
  Star,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { logout } from "@/actions/admin/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { group: "", items: [{ href: "/admin", label: "Overview", icon: LayoutDashboard }] },
  {
    group: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/inquiries", label: "Quote Requests", icon: MessageSquareText },
    ],
  },
  {
    group: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/stock", label: "Stock", icon: Warehouse },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
    ],
  },
  { group: "Marketing", items: [{ href: "/admin/newsletter", label: "Newsletter", icon: Mail }] },
  { group: "System", items: [{ href: "/admin/settings", label: "Settings", icon: Settings }] },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Admin">
      {NAV.map((g) => (
        <div key={g.group || "main"}>
          {g.group && <p className="px-3 pb-1.5 text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">{g.group}</p>}
          <ul className="space-y-0.5">
            {g.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                    active(item.href) ? "bg-brand text-white shadow-[0_8px_20px_-8px_rgba(41,157,54,0.8)]" : "text-white/70 hover:bg-white/8 hover:text-white",
                  )}
                >
                  <item.icon className="size-4.5 shrink-0" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5">
      <Image src="/images/logo-mark.png" alt="" width={478} height={555} sizes="36px" className="h-9 w-auto" priority />
      <span className="leading-none">
        <span className="block text-lg font-extrabold text-white">
          Soap<span className="text-brand-400">Base</span>
        </span>
        <span className="mt-1 block text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Admin Panel</span>
      </span>
    </Link>
  );
}

function SidebarFooter() {
  return (
    <div className="space-y-1 border-t border-white/10 p-3">
      <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/8 hover:text-white">
        <ExternalLink className="size-4.5" /> View website
      </Link>
      <form action={logout}>
        <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/8 hover:text-white">
          <LogOut className="size-4.5" /> Log out
        </button>
      </form>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-mist print:bg-white">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-navy lg:flex print:hidden">
        <Brand />
        <NavLinks />
        <SidebarFooter />
      </aside>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
        <div
          className={cn("absolute inset-0 bg-navy-900/60 backdrop-blur-sm transition-opacity", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-navy shadow-2xl transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between pr-3">
            <Brand />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-10 place-items-center rounded-xl text-white/80 hover:bg-white/10">
              <X className="size-5" />
            </button>
          </div>
          <NavLinks onNavigate={() => setOpen(false)} />
          <SidebarFooter />
        </aside>
      </div>

      <div className="lg:pl-64 print:pl-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 print:hidden items-center justify-between gap-3 border-b border-navy/8 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid size-10 place-items-center rounded-xl border border-navy/10 text-navy lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <p className="text-sm font-semibold text-muted">
              <span className="hidden sm:inline">SoapBase Pakistan · </span>Admin
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:bg-mist hover:text-navy sm:flex">
              <ExternalLink className="size-4" /> View site
            </Link>
            <span className="flex items-center gap-2 rounded-xl bg-mist py-1.5 pr-3 pl-1.5">
              <span className="grid size-7 place-items-center rounded-lg bg-navy text-xs font-extrabold text-white">A</span>
              <span className="text-sm font-bold text-navy">Admin</span>
            </span>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
