import { createFileRoute } from "@tanstack/react-router";
import { getCMSContent } from "@/lib/admin-store";

export const Route = createFileRoute("/_site/about")({
  loader: async () => {
    return await getCMSContent("about");
  },
  component: About,
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    return {
      meta: [
        { title: seo?.title ?? "About — ILAE YES Rwanda " },
        {
          name: "description",
          content:
            seo?.description ?? "Our mission, the science of epilepsy, and the principles that guide every part of our work.",
        },
      ],
    };
  },
});

function About() {
  const cms = Route.useLoaderData();
  return (
    <article>
      {cms.header && (
        <header className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-20 md:px-10 md:py-28">
            <p className="eyebrow">{cms.header.label}</p>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground md:text-7xl">
              {cms.header.heading}
            </h1>
          </div>
        </header>
      )}

      {/* Who we are */}
      {cms.whoWeAre && (
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 md:px-10 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <p className="eyebrow">{cms.whoWeAre.label}</p>
            <h2 className="mt-3 font-display text-4xl text-foreground">{cms.whoWeAre.heading}</h2>
          </aside>
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground lg:col-span-8 lg:text-lg">
            {cms.whoWeAre.paragraphs?.map((p: string, idx: number) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* Image break */}
      {cms.imageBreak && (
        <section className="border-y border-border">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <figure className="relative">
              <img
                src={cms.imageBreak.image}
                alt={cms.imageBreak.imageAlt}
                className="aspect-[16/8] w-full object-cover"
                loading="lazy"
              />
              <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {cms.imageBreak.caption}
              </figcaption>
            </figure>
          </div>
        </section>
      )}

      {/* Quick facts */}
      {cms.factsList && (
        <section className="border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
            <p className="eyebrow">{cms.factsList.label}</p>
            <ol className="mt-10 grid grid-cols-1 gap-px overflow-hidden bg-border md:grid-cols-2 lg:grid-cols-5">
              {cms.factsList.facts?.map((f: string, i: number) => (
                <li key={i} className="bg-background p-8">
                  <span className="font-display text-3xl text-primary">0{i + 1}</span>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">{f}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </article>
  );
}
