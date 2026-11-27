import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { BackToTop } from "@/components/effects/back-to-top";
import { PointerGlow } from "@/components/effects/pointer-glow";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/db/queries/catalog";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "soap base Pakistan",
    "melt and pour soap base",
    "glycerin soap base wholesale",
    "transparent soap base",
    "bulk soap base Lahore",
    "raw soap materials",
  ],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: ["/images/logo-full.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0d2c50",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const categories = await getCategories();
  const navCategories = categories.map(({ slug, name, tagline, color, translucent }) => ({
    slug,
    name,
    tagline,
    color,
    translucent,
  }));

  return (
    // suppressHydrationWarning: browser extensions (e.g. ColorZilla's `cz-shortcut-listen`, Grammarly)
    // add attributes to <html>/<body> before React hydrates. This ignores attribute differences on these
    // two elements only. Mismatches in child components are still reported.
    <html lang="en" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {/* If JavaScript is unavailable, show scroll-reveal content immediately instead of leaving it hidden. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <ScrollProgress />
        <Header categories={navCategories} />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
        <WhatsAppButton />
        <PointerGlow />
      </body>
    </html>
  );
}
