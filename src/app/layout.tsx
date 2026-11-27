import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

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

/**
 * Development-only fix for hydration warnings caused by browser form-filler extensions
 * (they add `fdprocessedid="…"` to every input/button before React hydrates).
 * Strips only these extension-owned attributes, as they appear, before hydration.
 * Never shipped to production (React doesn't report these mismatches there anyway).
 */
const EXTENSION_ATTRS = ["fdprocessedid"];
const EXTENSION_ATTR_CLEANUP = `(()=>{var a=${JSON.stringify(EXTENSION_ATTRS)};function s(el){for(var i=0;i<a.length;i++){if(el.hasAttribute&&el.hasAttribute(a[i]))el.removeAttribute(a[i]);}}
new MutationObserver(function(m){for(var i=0;i<m.length;i++)s(m[i].target);}).observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:a});
document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(a.map(function(x){return"["+x+"]";}).join(",")).forEach(s);});})();`;

/** Minimal HTML shell shared by the public site ((site) group) and the admin panel (/admin). */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. ColorZilla's `cz-shortcut-listen`, Grammarly)
    // add attributes to <html>/<body> before React hydrates. This ignores attribute differences on these
    // two elements only. Mismatches in child components are still reported.
    <html lang="en" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      {process.env.NODE_ENV === "development" && (
        <head>
          {/* Dev only: see EXTENSION_ATTR_CLEANUP below. */}
          <script dangerouslySetInnerHTML={{ __html: EXTENSION_ATTR_CLEANUP }} />
        </head>
      )}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {/* If JavaScript is unavailable, show scroll-reveal content immediately instead of leaving it hidden. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
