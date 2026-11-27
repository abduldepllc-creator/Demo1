import { siteConfig } from "@/config/site";
import { PageHero } from "./page-hero";

export type PolicySection = { id: string; title: string; paragraphs?: string[]; list?: string[] };

/** Layout for long-form legal pages: banner, sticky table of contents and readable prose. */
export function PolicyPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: PolicySection[];
}) {
  return (
    <>
      <PageHero title={title} description={intro} crumbs={[{ label: title }]}>
        <p className="mt-6 inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70">
          Last updated: {updated}
        </p>
      </PageHero>

      <section className="container-x pb-20 sm:pb-28">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
          <aside className="hidden lg:block">
            <nav className="sticky top-28 rounded-3xl border border-navy/8 bg-mist p-5" aria-label="On this page">
              <p className="text-xs font-bold tracking-widest text-muted uppercase">On this page</p>
              <ol className="mt-3 space-y-1 text-sm">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex gap-2 rounded-xl px-2 py-1.5 font-semibold text-navy transition-colors hover:bg-white hover:text-brand"
                    >
                      <span className="text-brand">{i + 1}.</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="prose-sb max-w-3xl">
            {sections.map((s, i) => (
              <section key={s.id}>
                <h2 id={s.id}>
                  {i + 1}. {s.title}
                </h2>
                {s.paragraphs?.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.list && (
                  <ul>
                    {s.list.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <div className="mt-12 rounded-3xl bg-mist p-6 text-base">
              <p className="mb-0!">
                Questions about this policy? Email <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>{" "}
                or call <a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a>.
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
