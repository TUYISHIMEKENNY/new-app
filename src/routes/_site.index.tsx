import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { ReadMore } from "@/components/ReadMore";
import { listPosts, getCMSContent } from "@/lib/admin-store";

export const Route = createFileRoute("/_site/")({
  loader: async () => {
    const [allPosts, cms] = await Promise.all([
      listPosts(),
      getCMSContent("home")
    ]);
    const posts = allPosts.filter((p) => p.status === "Published").slice(0, 3);
    return { posts, cms };
  },
  component: Home,
  head: ({ loaderData }) => {
    const seo = loaderData?.cms?.seo;
    return {
      meta: [
        { title: seo?.title ?? "ILAE YOUTH NURSE RWANDA  — Epilepsy Awareness Initiative" },
        {
          name: "description",
          content:
            seo?.description ?? "Lumen is an independent initiative changing the conversation around epilepsy through research, education, and community.",
        },
      ],
    };
  },
});

function calculateReadTime(body?: string | null) {
  if (!body) return "1 min read";
  const words = body.split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

const renderHeading = (heading: string, highlight?: string) => {
  if (!highlight) return heading;
  const index = heading.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) {
    return (
      <>
        {heading}{" "}
        <em className="font-display italic text-primary">{highlight}</em>
      </>
    );
  }
  const before = heading.slice(0, index);
  const matched = heading.slice(index, index + highlight.length);
  const after = heading.slice(index + highlight.length);
  return (
    <>
      {before}
      <em className="font-display italic text-primary">{matched}</em>
      {after}
    </>
  );
};

function Home() {
  const { posts, cms } = Route.useLoaderData();
  return (
    <>
      {/* Hero — editorial split */}
      {cms.hero?.visible !== false && (
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-6 md:px-10 lg:grid-cols-12">
            <div className="flex flex-col justify-between py-16 lg:col-span-6 lg:py-28 lg:pr-12">
              <div>
                <p className="eyebrow">{cms.hero.label}</p>
                <h1 className="mt-8 font-display text-5xl leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
                  {renderHeading(cms.hero.heading, cms.hero.highlightedText)}
                </h1>
                <ReadMore
                  lines={3}
                  className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground"
                >
                  {cms.hero.description}
                </ReadMore>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-4">
                {cms.hero.buttonText && (
                  <Link
                    to={cms.hero.buttonUrl as any}
                    target={cms.hero.buttonOpenNewTab ? "_blank" : undefined}
                    className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary"
                  >
                    {cms.hero.buttonText}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
                {cms.hero.linkText && (
                  <Link
                    to={cms.hero.linkUrl as any}
                    target={cms.hero.linkOpenNewTab ? "_blank" : undefined}
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {cms.hero.linkText}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>

            <div className="relative lg:col-span-6 flex items-center justify-center lg:pl-10">
              <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[85vh] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-border/50 group">
                <img
                  src={cms.hero.image}
                  alt={cms.hero.imageAlt}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                  width={1600}
                />
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                  <span className="drop-shadow-md">{cms.hero.label || "ILAE YES RWANDA"}</span>
                  <span className="drop-shadow-md">Vol. I</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Marquee facts */}
      {cms.marquee && cms.marquee.length > 0 && (
        <section className="border-b border-border bg-foreground text-background">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-background/15 px-6 md:grid-cols-4 md:px-10">
            {cms.marquee.map((f: any) => (
              <div key={f.label} className="flex flex-col gap-2 px-4 py-10 first:pl-0 md:px-8">
                <p className="font-display text-4xl text-background md:text-5xl">{f.stat}</p>
                <p className="text-xs leading-snug text-background/70">{f.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured journal */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div>
            <p className="eyebrow">{cms.journalHeader?.label || "From the Journal"}</p>
            <h2 className="mt-3 font-display text-4xl text-foreground md:text-5xl">
              {cms.journalHeader?.heading || "Reading list"}
            </h2>
          </div>
          <Link
            to="/posts"
            className="hidden text-sm underline underline-offset-4 hover:text-primary md:inline"
          >
            All articles →
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Lead article */}
            <Link
              to="/posts/$slug"
              params={{ slug: posts[0].slug }}
              className="group lg:col-span-7"
            >
              <div className="overflow-hidden">
                <img
                  src={posts[0].cover || undefined}
                  alt={posts[0].title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span className="text-primary">{posts[0].category}</span>
                <span className="hairline w-8" />
                <span>{calculateReadTime(posts[0].body)}</span>
              </div>
              <h3 className="mt-4 font-display text-3xl leading-tight text-foreground md:text-4xl">
                {posts[0].title}
              </h3>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {posts[0].excerpt}
              </p>
            </Link>

            {/* Secondary list */}
            {posts.length > 1 && (
              <div className="lg:col-span-5">
                <ul className="divide-y divide-border border-t border-border">
                  {posts.slice(1).map((p) => (
                    <li key={p.slug}>
                      <Link
                        to="/posts/$slug"
                        params={{ slug: p.slug }}
                        className="group flex flex-col py-8 transition-colors hover:text-primary"
                      >
                        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          <span className="text-primary">{p.category}</span>
                          <span className="hairline w-6" />
                          <span>{p.date}</span>
                        </div>
                        <h4 className="mt-3 font-display text-2xl leading-tight text-foreground transition-colors group-hover:text-primary">
                          {p.title}
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {p.excerpt}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-12 text-muted-foreground">No publications available yet.</p>
        )}
      </section>

      {/* Community Event — Sport highlight */}
      {cms.communityEvent?.visible !== false && (
        <section className="bg-muted/30 py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <p className="eyebrow text-primary">{cms.communityEvent.label}</p>
                <h2 className="mt-4 font-display text-4xl leading-tight text-foreground md:text-5xl">
                  {renderHeading(cms.communityEvent.heading, cms.communityEvent.highlightedText)}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  {cms.communityEvent.description}
                </p>
                {cms.communityEvent.buttonText && (
                  <div className="mt-10">
                    <Link
                      to={cms.communityEvent.buttonUrl as any}
                      target={cms.communityEvent.buttonOpenNewTab ? "_blank" : undefined}
                      className="inline-flex items-center gap-2 font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {cms.communityEvent.buttonText}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={cms.communityEvent.image}
                    alt={cms.communityEvent.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA — research */}
      {cms.cta?.visible !== false && (
        <section className="border-y border-border bg-background">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-6 md:px-10 lg:grid-cols-12">
            <div className="relative lg:col-span-5">
              <img
                src={cms.cta.image}
                alt={cms.cta.imageAlt}
                className="h-full max-h-[520px] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-center gap-6 py-16 lg:col-span-7 lg:py-24 lg:pl-16">
              <p className="eyebrow">{cms.cta.label}</p>
              <h2 className="font-display text-4xl leading-tight text-foreground md:text-5xl">
                {cms.cta.heading}
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                {cms.cta.description}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                {cms.cta.button1Text && (
                  <Link
                    to={cms.cta.button1Url as any}
                    target={cms.cta.button1OpenNewTab ? "_blank" : undefined}
                    className="inline-flex items-center gap-2 rounded-full border border-foreground px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
                  >
                    {cms.cta.button1Text}
                  </Link>
                )}
                {cms.cta.button2Text && (
                  <Link
                    to={cms.cta.button2Url as any}
                    target={cms.cta.button2OpenNewTab ? "_blank" : undefined}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground"
                  >
                    {cms.cta.button2Text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
