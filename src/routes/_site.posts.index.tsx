import { createFileRoute, Link } from "@tanstack/react-router";
import { listPosts, getCMSContent } from "@/lib/admin-store";

export const Route = createFileRoute("/_site/posts/")({
  loader: async () => {
    const [allPosts, cms] = await Promise.all([
      listPosts(),
      getCMSContent("posts-index")
    ]);
    const posts = allPosts.filter((p) => p.status === "Published");
    return { posts, cms };
  },
  component: PostsIndex,
  head: ({ loaderData }) => {
    const seo = loaderData?.cms?.seo;
    return {
      meta: [
        { title: seo?.title ?? "Journal — ILAEYESRwanda" },
        {
          name: "description",
          content: seo?.description ?? "Essays, guides, and research from the Lumen Epilepsy Initiative.",
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

function PostsIndex() {
  const { posts, cms } = Route.useLoaderData();

  if (posts.length === 0) {
    return (
      <article>
        {cms.header && (
          <header className="border-b border-border">
            <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
              <p className="eyebrow">{cms.header.label}</p>
              <h1 className="mt-6 font-display text-5xl text-foreground md:text-7xl">
                {cms.header.heading}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {cms.header.description}
              </p>
            </div>
          </header>
        )}
        <section className="mx-auto max-w-7xl px-6 py-20 text-center md:px-10">
          <p className="text-muted-foreground">No published posts available yet.</p>
        </section>
      </article>
    );
  }

  const [lead, ...rest] = posts;
  return (
    <article>
      {cms.header && (
        <header className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
            <p className="eyebrow">{cms.header.label}</p>
            <h1 className="mt-6 font-display text-5xl text-foreground md:text-7xl">
              {cms.header.heading}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {cms.header.description}
            </p>
          </div>
        </header>
      )}

      {/* Lead */}
      <section className="border-b border-border">
        <Link to="/posts/$slug" params={{ slug: lead.slug }} className="group block">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:px-10 lg:grid-cols-12 lg:py-20">
            <div className="overflow-hidden lg:col-span-7">
              <img
                src={lead.cover || undefined}
                alt={lead.title}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-end lg:col-span-5">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span className="text-primary">{lead.category}</span>
                <span className="hairline w-8" />
                <span>{lead.date}</span>
              </div>
              <h2 className="mt-4 font-display text-4xl leading-tight text-foreground md:text-5xl">
                {lead.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{lead.excerpt}</p>
              <p className="mt-6 text-sm text-foreground">
                <span className="text-muted-foreground">By</span> {lead.author} ·{" "}
                {calculateReadTime(lead.body)}
              </p>
            </div>
          </div>
        </Link>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <ul className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <li key={p.slug}>
              <Link to="/posts/$slug" params={{ slug: p.slug }} className="group block">
                <div className="overflow-hidden">
                  <img
                    src={p.cover || undefined}
                    alt={p.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="text-primary">{p.category}</span>
                  <span className="hairline w-6" />
                  <span>{calculateReadTime(p.body)}</span>
                </div>
                <h3 className="mt-3 font-display text-2xl leading-tight text-foreground transition-colors group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
