import { createFileRoute } from "@tanstack/react-router";
import sportEvent from "@/assets/sport.jpeg";

export const Route = createFileRoute("/_site/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — ILAE YES Rwanda " },
      {
        name: "description",
        content:
          "Our mission, the science of epilepsy, and the principles that guide every part of our work.",
      },
    ],
  }),
});

function About() {
  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-20 md:px-10 md:py-28">
          <p className="eyebrow">About ILAE YOUTH NURSE RWANDA </p>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground md:text-7xl">
            No person life is limited by epilepsy or neurological diseases
            <em className="font-display italic text-primary"></em>
          </h1>
        </div>
      </header>

      {/* What is epilepsy */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 md:px-10 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <p className="eyebrow">Who we are</p>
          <h2 className="mt-3 font-display text-4xl text-foreground">Who we are </h2>
        </aside>
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground lg:col-span-8 lg:text-lg">
          <p>
            ILAE YES Rwanda, we are dedicated to empowering youth and transforming communities
            through education, leadership, innovation, and social responsibility. A major focus of
            our work is supporting people living with epilepsy by raising awareness, fighting
            stigma, promoting inclusion, and encouraging access to care and support within
            communities.
          </p>
          <p>
            Our commitment is guided by integrity, teamwork, inclusiveness, and excellence. Together
            with our partners and communities, we strive to uplift lives, restore hope, and create
            lasting social transformation.
          </p>
        </div>
      </section>

      {/* Image break */}
      <section className="border-y border-border">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <figure className="relative">
            <img
              src={sportEvent}
              alt="A community sports event for epilepsy awareness."
              className="aspect-[16/8] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Sports Event, ILAE YES Rwanda
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Quick facts */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <p className="eyebrow">Five things worth knowing</p>
          <ol className="mt-10 grid grid-cols-1 gap-px overflow-hidden bg-border md:grid-cols-2 lg:grid-cols-5">
            {[
              "Epilepsy affects 50 million people globally — more than Parkinson's, MS, and ALS combined.",
              "70% of people with epilepsy could become seizure-free with proper treatment.",
              "You cannot swallow your tongue. Never put anything in the mouth of someone seizing.",
              "Most seizures stop on their own within 1–3 minutes. Call emergency services after 5.",
              "Driving laws vary by country, but many people with controlled epilepsy can drive legally.",
            ].map((f, i) => (
              <li key={i} className="bg-background p-8">
                <span className="font-display text-3xl text-primary">0{i + 1}</span>
                <p className="mt-3 text-sm leading-relaxed text-foreground">{f}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </article>
  );
}
