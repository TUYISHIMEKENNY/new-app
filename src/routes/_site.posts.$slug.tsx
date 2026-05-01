import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { listPosts } from "@/lib/admin-store";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_site/posts/$slug")({
  component: PostPage,
  loader: async ({ params }) => {
    const allPosts = await listPosts();
    const post = allPosts.find((p) => p.slug === params.slug && p.status === "Published");
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Lumen` },
          { name: "description", content: loaderData.excerpt },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.excerpt },
          { property: "og:image", content: loaderData.cover || undefined },
          { name: "twitter:image", content: loaderData.cover || undefined },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="eyebrow">Not found</p>
      <h1 className="mt-4 font-display text-4xl">Article not found</h1>
      <Link to="/posts" className="mt-6 inline-block text-sm underline">
        Back to journal
      </Link>
    </div>
  ),
});

function calculateReadTime(body?: string | null) {
  if (!body) return "1 min read";
  const words = body.split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

function PostPage() {
  const post = Route.useLoaderData();
  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 pb-16 pt-12 md:px-10 md:pb-20 md:pt-16">
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-3 w-3" /> The Journal
          </Link>
          <p className="eyebrow mt-10">{post.category}</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-foreground md:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
            {post.excerpt}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="text-foreground">{post.author}</span>
            <span className="hairline w-6" />
            <span>{post.date}</span>
            <span className="hairline w-6" />
            <span>{calculateReadTime(post.body)}</span>
          </div>
        </div>
      </header>

      <figure className="border-b border-border">
        <img
          src={post.cover || undefined}
          alt={post.title}
          className="aspect-[16/9] w-full object-cover"
        />
      </figure>

      <div className="mx-auto max-w-2xl px-6 py-16 md:px-10 md:py-24">
        <div className="space-y-6">
          {(post.body?.split("\n").filter((p) => p.trim() !== "") || []).map(
            (para: string, i: number) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "font-display text-2xl leading-snug text-foreground md:text-3xl"
                    : "text-lg leading-relaxed text-foreground/90"
                }
              >
                {para}
              </p>
            ),
          )}
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> More from the Journal
          </Link>
        </div>
      </div>
    </article>
  );
}
