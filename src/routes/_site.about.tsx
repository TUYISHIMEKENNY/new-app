import { createFileRoute } from "@tanstack/react-router";
import community from "@/assets/community.jpg";

export const Route = createFileRoute("/_site/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Lumen Epilepsy Initiative" },
      {
        name: "description",
        content:
          "Our mission, the science of epilepsy, and the principles that guide every part of our work.",
      },
    ],
  }),
});

const principles = [
  {
    n: "01",
    title: "Evidence first",
    body: "Every guide and statement we publish is reviewed by our medical advisory board. We cite sources. We update when the science updates.",
  },
  {
    n: "02",
    title: "Independent",
    body: "We accept no funding from pharmaceutical or device manufacturers. Our work answers to patients and the public, not to commercial interests.",
  },
  {
    n: "03",
    title: "Plain language",
    body: "Medical literacy is a human right. We translate complex research into language that respects both the science and the reader.",
  },
  {
    n: "04",
    title: "Community-led",
    body: "Programs are designed alongside people who live with epilepsy. Lived experience is not consulted at the end — it shapes the work from the start.",
  },
];

function About() {
  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-20 md:px-10 md:py-28">
          <p className="eyebrow">About ILAE YOUTH NURSE RWANDA </p>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-foreground md:text-7xl">
            A small team, a long horizon, and a single conviction:
            <em className="font-display italic text-primary"> epilepsy deserves better.</em>
          </h1>
        </div>
      </header>

      {/* What is epilepsy */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 md:px-10 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <p className="eyebrow">The condition</p>
          <h2 className="mt-3 font-display text-4xl text-foreground">What epilepsy is</h2>
        </aside>
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground lg:col-span-8 lg:text-lg">
          <p>
            Epilepsy is a neurological condition characterized by recurrent,
            unprovoked seizures — brief episodes of altered electrical activity
            in the brain. It is among the most common neurological disorders in
            the world, affecting roughly one in twenty-six people at some point
            in their lives.
          </p>
          <p>
            Despite its prevalence, public understanding remains shallow.
            Epilepsy is not a single disease but a family of more than forty
            distinct syndromes. Most people who develop it can, with
            appropriate treatment, live full and seizure-free lives.
          </p>
          <p>
            What stands in the way is rarely the medicine. It is the silence —
            the assumption that a diagnosis is something to hide, the workplace
            that does not know how to respond, the friend who has never been
            told what to do.
          </p>
        </div>
      </section>

      {/* Image break */}
      <section className="border-y border-border">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <figure className="relative">
            <img
              src={community}
              alt="A community support circle in a sunlit room."
              className="aspect-[16/8] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Sunday Support Circle, ILAE YOUTH NURSE RWANDA  Center
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <p className="eyebrow">Our Principles</p>
            <h2 className="mt-3 font-display text-4xl text-foreground">
              How we work
            </h2>
          </aside>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-border border-y border-border">
              {principles.map((p) => (
                <li key={p.n} className="grid grid-cols-12 gap-6 py-8">
                  <span className="col-span-2 font-display text-2xl text-primary md:col-span-1">
                    {p.n}
                  </span>
                  <div className="col-span-10 md:col-span-11">
                    <h3 className="font-display text-2xl text-foreground">{p.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
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
