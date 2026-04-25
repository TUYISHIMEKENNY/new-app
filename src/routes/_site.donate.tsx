import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/_site/donate")({
  component: Donate,
  head: () => ({
    meta: [
      { title: "Donate — ILAE YOUTH NURSE RWANDA " },
      {
        name: "description",
        content:
          "How donations to Lumen are used: research grants, community programs, and plain-language patient resources.",
      },
    ],
  }),
});

const allocation = [
  { pct: "62%", label: "Research grants", body: "Independent investigators studying treatment-resistant epilepsies and rare syndromes." },
  { pct: "24%", label: "Community programs", body: "Twelve city support circles, schools outreach, and care kits for newly diagnosed families." },
  { pct: "11%", label: "Publishing & education", body: "The Journal, plain-language guides, and translated resources." },
  { pct: "3%", label: "Operations", body: "A small team and modest overhead. Audited annually." },
];

function Donate() {
  return (
    <article>
      <header className="border-b border-border bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <p className="eyebrow text-background/70">Support</p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
            Your gift funds quiet, careful, evidence-led work.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-background/80">
            ILAE YOUTH NURSE RWANDA  accepts no industry funding. We are sustained entirely by
            individual donors and a small number of mission-aligned foundations.
            Every contribution is acknowledged. Every dollar is accounted for.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <p className="eyebrow">Where it goes</p>
            <h2 className="mt-3 font-display text-4xl text-foreground">
              Allocation
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Based on the 2024 audited annual report.
            </p>
          </aside>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-border border-y border-border">
              {allocation.map((a) => (
                <li key={a.label} className="grid grid-cols-12 gap-6 py-8">
                  <p className="col-span-3 font-display text-3xl text-primary md:col-span-2">
                    {a.pct}
                  </p>
                  <div className="col-span-9 md:col-span-10">
                    <h3 className="font-display text-xl text-foreground">{a.label}</h3>
                    <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">{a.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <p className="eyebrow">Make a contribution</p>
          <h2 className="mt-3 font-display text-4xl text-foreground md:text-5xl">
            Choose an amount
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {["$25", "$75", "$200", "$500"].map((amt) => (
              <button
                key={amt}
                className="group flex flex-col items-start gap-3 border border-border bg-card p-6 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_2px_4px_oklch(0.18_0.025_285_/_0.06),_0_20px_50px_oklch(0.18_0.025_285_/_0.10)]"
              >
                <Heart className="h-5 w-5 text-primary" />
                <span className="font-display text-3xl text-foreground">{amt}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  one-time
                </span>
              </button>
            ))}
          </div>
          <p className="mt-8 max-w-xl text-sm text-muted-foreground">
            For wire transfers, planned giving, or partnership inquiries, please write to{" "}
            <a href="mailto:giving@lumen.org" className="text-foreground underline underline-offset-4 hover:text-primary">
              giving@ILAE YOUTH NURSE RWANDA .org
            </a>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
