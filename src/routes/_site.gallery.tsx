import { createFileRoute } from "@tanstack/react-router";
import { listPhotos, getCMSContent } from "@/lib/admin-store";

export const Route = createFileRoute("/_site/gallery")({
  loader: async () => {
    const [photos, cms] = await Promise.all([
      listPhotos(),
      getCMSContent("gallery")
    ]);
    return { photos, cms };
  },
  component: Gallery,
  head: ({ loaderData }) => {
    const seo = loaderData?.cms?.seo;
    return {
      meta: [
        { title: seo?.title ?? "Gallery — ILAE YOUTH NURSE RWANDA " },
        {
          name: "description",
          content: seo?.description ?? "Photographs from Lumen events, programs, and community gatherings.",
        },
      ],
    };
  },
});

function spanClass(span: string) {
  if (span === "tall") return "md:row-span-2";
  if (span === "wide") return "md:col-span-2";
  return "";
}

function aspectClass(span: string) {
  if (span === "tall") return "aspect-[3/4]";
  if (span === "wide") return "aspect-[16/9]";
  return "aspect-[4/3]";
}

// Retain visual masonry layout variation
function getSpan(i: number) {
  if (i === 1 || i === 8 || i === 14) return "tall";
  if (i === 2 || i === 7 || i === 11 || i === 15) return "wide";
  return "default";
}

function Gallery() {
  const { photos, cms } = Route.useLoaderData();
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

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 md:auto-rows-[280px] md:grid-cols-3">
          {photos.length === 0 && (
            <p className="text-muted-foreground md:col-span-3 text-center py-12">
              No photos uploaded yet.
            </p>
          )}
          {photos.map((e, i) => {
            const span = getSpan(i);
            return (
              <figure
                key={e.id}
                className={`group relative overflow-hidden bg-muted ${spanClass(span)}`}
              >
                <img
                  src={e.src}
                  alt="Gallery photograph"
                  className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${aspectClass(span)}`}
                  loading="lazy"
                />
              </figure>
            );
          })}
        </div>
      </section>
    </article>
  );
}
