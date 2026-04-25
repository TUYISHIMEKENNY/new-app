import { createFileRoute } from "@tanstack/react-router";
import { listPhotos } from "@/lib/admin-store";

export const Route = createFileRoute("/_site/gallery")({
  loader: async () => {
    return await listPhotos();
  },
  component: Gallery,
  head: () => ({
    meta: [
      { title: "Gallery — ILAE YOUTH NURSE RWANDA " },
      {
        name: "description",
        content: "Photographs from Lumen events, programs, and community gatherings.",
      },
    ],
  }),
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

function getSpan(i: number) {
  if (i === 1 || i === 8 || i === 14) return "tall";
  if (i === 2 || i === 7 || i === 11 || i === 15) return "wide";
  return "default";
}

function Gallery() {
  const events = Route.useLoaderData();
  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
          <p className="eyebrow">Gallery</p>
          <h1 className="mt-6 font-display text-5xl text-foreground md:text-7xl">
            Programs, walks, gatherings.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            A visual record of the work — captured by photographers in the field, at clinics, and inside community rooms.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 md:auto-rows-[280px] md:grid-cols-3">
          {events.length === 0 && (
            <p className="text-muted-foreground md:col-span-3 text-center py-12">No photos uploaded yet.</p>
          )}
          {events.map((e, i) => {
            const span = getSpan(i);
            return (
              <figure
                key={e.id}
                className={`group relative overflow-hidden bg-muted ${spanClass(span)}`}
              >
                <img
                  src={e.src}
                  alt={e.title}
                  className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${aspectClass(span)}`}
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 to-transparent p-5 text-background">
                  <p className="font-display text-lg leading-tight">{e.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-background/80">
                    {e.caption}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>
    </article>
  );
}
