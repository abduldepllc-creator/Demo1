import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { BackToTop } from "@/components/effects/back-to-top";
import { PointerGlow } from "@/components/effects/pointer-glow";
import { getCategories } from "@/db/queries/catalog";

/** Public website chrome: header, footer and global effects. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  const navCategories = categories.map(({ slug, name, tagline, color, translucent }) => ({
    slug,
    name,
    tagline,
    color,
    translucent,
  }));

  return (
    <>
      <ScrollProgress />
      <Header categories={navCategories} />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
      <WhatsAppButton />
      <PointerGlow />
    </>
  );
}
