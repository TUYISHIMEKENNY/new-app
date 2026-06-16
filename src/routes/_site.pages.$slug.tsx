import { createFileRoute } from "@tanstack/react-router";
import { getPageBySlug, listTeamMembers, submitMessage } from "@/lib/admin-store";
import { useState } from "react";
import { Send } from "lucide-react";

export const Route = createFileRoute("/_site/pages/$slug")({
  loader: async ({ params }) => {
    let page = await getPageBySlug(params.slug).catch(() => null);
    let teamMembers = null;

    if (params.slug.toLowerCase().includes("team")) {
      teamMembers = await listTeamMembers();
      // Provide a fallback if the actual "Teams" page hasn't been created yet
      if (!page) {
        page = {
          id: "fallback-teams",
          slug: "teams",
          title: "Teams",
          category: "Page",
          author: "System",
          date: new Date().toISOString(),
          status: "Published",
          excerpt: "Meet our executive council and team.",
          body: "",
          cover: null,
        };
      }
    }

    if (params.slug === "members" && !page) {
      page = {
        id: "fallback-members",
        slug: "members",
        title: "Members",
        category: "Page",
        author: "System",
        date: new Date().toISOString(),
        status: "Published",
        excerpt: "Information about our community members.",
        body: "",
        cover: null,
      };
    }

    if (params.slug === "stories" && !page) {
      page = {
        id: "fallback-stories",
        slug: "stories",
        title: "Stories",
        category: "Page",
        author: "System",
        date: new Date().toISOString(),
        status: "Published",
        excerpt: "Stories of lived experience from our community.",
        body: "",
        cover: null,
      };
    }

    if (params.slug === "programs-services" && !page) {
      page = {
        id: "fallback-programs",
        slug: "programs-services",
        title: "Programs & Services",
        category: "Page",
        author: "System",
        date: new Date().toISOString(),
        status: "Published",
        excerpt: "Discover our core values, work areas, and key services.",
        body: "",
        cover: null,
      };
    }

    if (params.slug === "conferences" && !page) {
      page = {
        id: "fallback-conferences",
        slug: "conferences",
        title: "Conferences",
        category: "Page",
        author: "System",
        date: new Date().toISOString(),
        status: "Published",
        excerpt: "Information on past and upcoming Epilepsy Alliance Africa Conferences.",
        body: "",
        cover: null,
      };
    }

    if (params.slug === "stripes-week" && !page) {
      page = {
        id: "fallback-stripes-week",
        slug: "stripes-week",
        title: "Stripes Week",
        category: "Page",
        author: "System",
        date: new Date().toISOString(),
        status: "Published",
        excerpt: "Annual epilepsy awareness event during the 3rd week of September.",
        body: "",
        cover: null,
      };
    }

    if (params.slug === "info-forms-videos" && !page) {
      page = {
        id: "fallback-info",
        slug: "info-forms-videos",
        title: "Info, Forms & Videos",
        category: "Page",
        author: "System",
        date: new Date().toISOString(),
        status: "Published",
        excerpt: "Resources, reports, guidelines, presentations, and video library.",
        body: "",
        cover: null,
      };
    }

    if (!page || page.status !== "Published") {
      throw new Error("Page not found");
    }

    return { page, teamMembers };
  },
  staleTime: 0,
  component: PageView,
  errorComponent: () => (
    <article className="mx-auto max-w-3xl px-6 py-32 text-center md:px-10 md:py-48">
      <h1 className="font-display text-4xl text-foreground">Page not found</h1>
      <p className="mt-4 text-muted-foreground">
        The page you're looking for doesn't exist or isn't published yet.
      </p>
    </article>
  ),
  head: ({ loaderData }) => {
    // loaderData can be undefined during early render phases or errors
    const page = loaderData?.page;
    return {
      meta: [
        { title: `${page?.title ?? "Page"} — ILAE YOUTH NURSE RWANDA` },
        { name: "description", content: page?.excerpt ?? "" },
      ],
    };
  },
});

function PageView() {
  const { page, teamMembers } = Route.useLoaderData();

  const getPageBody = (p: typeof page) => {
    // If it's the members page and the body is empty or just the default placeholder
    if (p.slug === "members" && (!p.body || p.body.includes("This is placeholder content"))) {
      return `
        <p class="lead text-xl text-muted-foreground mb-8">We are an NGO, groups and individuals fighting to prevent, reduce and eradicate the social, economic, cultural, environmental, physical, medical, psychological, educational and political barriers people with epilepsy and their communities face. We welcome new members.</p>
        
        <h2>Who can become a member or ILAE YES Rwanda member?</h2>
        <ul>
          <li><strong>Organisations, trusts, clubs or groups</strong>, including online groups interested in epilepsy, disability and health.</li>
          <li><strong>Associations</strong> of people with epilepsy or families of people with epilepsy.</li>
          <li><strong>Professional associations.</strong></li>
          <li><strong>Institutions</strong> like government departments, schools, health units, centres, clinics or facilities, research centres or universities.</li>
          <li><strong>Partners</strong> including non-government organisations, international organisations, development organisations, corporates and funders.</li>
          <li><strong>Individual membership</strong> will be considered from advocates, researchers, professionals, families or family members who otherwise have reason not to be part of an association and are able to prove that they have done work to support epilepsy in a significant way.</li>
        </ul>

        <h2>How to become a member</h2>
        
        <h3>1. Organisations, associations or institutions in Rwanda</h3>
        <ul>
          <li>Operating in Rwanda</li>
          <li>Registered in Rwanda</li>
          <li>Fill in a membership form</li>
          <li>Pay annual dues equivalent to <strong>USD 20 a year</strong></li>
        </ul>
        
        <p class="text-center font-bold text-muted-foreground my-4">— OR —</p>

        <h3>2. Partner organisations outside Rwanda</h3>
        <ul>
          <li>A partner member organisation, association or institution not based in Rwanda</li>
          <li>Fill a membership form</li>
          <li>Pay a membership fee equivalent to <strong>USD 40 a year</strong> or commit a donation of at least USD 40 a year</li>
        </ul>

        <p class="text-center font-bold text-muted-foreground my-4">— OR —</p>

        <h3>3. Individuals & Ambassadors</h3>
        <ul>
          <li>An individual member based in or outside Rwanda paying a membership fee of <strong>USD 10 per year</strong></li>
          <li><strong>Ambassador member</strong> based outside Rwanda who do not pay a membership fee. Their role is to promote the work of the ILAE YES Rwanda outside Rwanda.</li>
          <li>Fill a membership form</li>
        </ul>

        <hr class="my-10 border-border" />

        <h2>Membership form</h2>
        <p>Please download and fill in the form below, then email it to <a href="mailto:yesilaerwanda@gmail.com">yesilaerwanda@gmail.com</a>.</p>
        <p>Once your membership is approved, you will pay membership fees annually. Please use the invoice below to pay your fees.</p>
        
        <div class="mt-8 flex gap-4">
          <a href="#" class="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-primary no-underline">Download Membership Form</a>
          <a href="#" class="inline-flex items-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary no-underline">Download Invoice</a>
        </div>
      `;
    }

    // If it's the stories page and the body is empty or just the default placeholder
    if (p.slug === "stories" && (!p.body || p.body.includes("This is placeholder content"))) {
      return "";
    }

    // If it's the programs & services page and the body is empty or just the default placeholder
    if (
      p.slug === "programs-services" &&
      (!p.body || p.body.includes("This is placeholder content"))
    ) {
      return `
        <h2>Our values</h2>
        <p class="lead text-lg text-muted-foreground">Our work is guided by pan-Africanism, which to us means valuing African institutions, programs, researchers and advocates. We believe this approach will help us create a sustainable program that addresses needs of people with epilepsy on the continent.</p>

        <hr class="my-10 border-border" />

        <h2>Our key work areas</h2>
        <div class="flex flex-wrap gap-3 my-6">
          <span class="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground border border-border">Capacity building of members</span>
          <span class="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground border border-border">Awareness</span>
          <span class="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground border border-border">Fundraising</span>
          <span class="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground border border-border">Research</span>
          <span class="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground border border-border">Training through webinars</span>
          <span class="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground border border-border">Social media awareness</span>
          <span class="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground border border-border">Advocacy</span>
        </div>

        <hr class="my-10 border-border" />

        <h2>Our main services</h2>
        <div class="space-y-6 mt-6">
          <div class="border-l-2 border-primary pl-4">
            <h3 class="font-display text-xl m-0 text-foreground">Tele-health</h3>
            <p class="mt-1 text-muted-foreground">Free weekly clinic available to people with epilepsy from any African country.</p>
          </div>
          <div class="border-l-2 border-primary pl-4">
            <h3 class="font-display text-xl m-0 text-foreground">Tele-education and training</h3>
            <p class="mt-1 text-muted-foreground">Webinars for professionals, advocates and people with epilepsy.</p>
          </div>
          <div class="border-l-2 border-primary pl-4">
            <h3 class="font-display text-xl m-0 text-foreground">Research and documentation</h3>
            <p class="mt-1 text-muted-foreground">We promote, support, carry out research and publish on epilepsy related topics.</p>
          </div>
          <div class="border-l-2 border-primary pl-4">
            <h3 class="font-display text-xl m-0 text-foreground">Advocacy and policy</h3>
            <p class="mt-1 text-muted-foreground">We advocate for improved and new policies for epilepsy on the African continent and help members achieve the same in their countries.</p>
          </div>
          <div class="border-l-2 border-primary pl-4">
            <h3 class="font-display text-xl m-0 text-foreground">Capacity building and coordination</h3>
            <p class="mt-1 text-muted-foreground">We support epilepsy association in Africa to maximise their potential.</p>
          </div>
          <div class="border-l-2 border-primary pl-4">
            <h3 class="font-display text-xl m-0 text-foreground">Conference</h3>
            <p class="mt-1 text-muted-foreground">Annual conference in June.</p>
          </div>
          <div class="border-l-2 border-primary pl-4">
            <h3 class="font-display text-xl m-0 text-foreground">Awareness</h3>
            <p class="mt-1 text-muted-foreground">Annual epilepsy awareness week (Stripes Week) 3rd week of September.</p>
          </div>
          <div class="border-l-2 border-primary pl-4">
            <h3 class="font-display text-xl m-0 text-foreground">Voice Indaba</h3>
            <p class="mt-1 text-muted-foreground">Held 2 times a year to recognise the voices of people with epilepsy and providers of care. Organised by people with epilepsy.</p>
          </div>
          <div class="border-l-2 border-primary pl-4">
            <h3 class="font-display text-xl m-0 text-foreground">Annual survey</h3>
            <p class="mt-1 text-muted-foreground">Annual survey on the status of epilepsy in Africa.</p>
          </div>
        </div>
      `;
    }

    // If it's the conferences page and the body is empty or just the default placeholder
    if (p.slug === "conferences" && (!p.body || p.body.includes("This is placeholder content"))) {
      return `
        <div class="text-center mb-12">
          <a href="https://www.ktpress.rw/2026/02/inside-rwandas-rise-as-a-regional-hub-for-brain-health-and-mental-wellness/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-base font-semibold uppercase tracking-wider text-background transition-colors hover:bg-primary shadow-md">
            Click here to evaluate the conference
          </a>
        </div>
        <hr class="my-10 border-border" />

      `;
    }

    // If it's the stripes week page and the body is empty or just the default placeholder
    if (p.slug === "stripes-week" && (!p.body || p.body.includes("This is placeholder content"))) {
      return `
        <div class="mb-12">
          <p class="lead text-2xl text-foreground text-center font-display italic">More voices. More awareness.</p>
        </div>
      `;
    }

    // If it's the info-forms-videos page and the body is empty or just the default placeholder
    if (
      p.slug === "info-forms-videos" &&
      (!p.body || p.body.includes("This is placeholder content"))
    ) {
      return `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <!-- Left Column: Documents & Downloads -->
          <div class="lg:col-span-7 space-y-12">

            <section class="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
              <h2 class="flex items-center gap-3 text-destructive mt-0 mb-4 text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                COVID-19 & First Aid
              </h2>
              <ul class="space-y-3 m-0 list-none p-0">
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-destructive transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Poster-Covid-pdf</a></li>
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-destructive transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Epilepsy-and-corona-virus-in-Africa-statement</a></li>
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-destructive transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Poster_First-aid-for-seizures_EAA</a></li>
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-destructive transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> FIRST-AID-REASSURANCE-SCALE</a></li>
              </ul>
            </section>
            <section>
              <h2 class="flex items-center gap-3 border-b border-border pb-2 text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                Presentations & Miscellaneous
              </h2>
              <ul class="space-y-3 mt-4 list-none p-0">
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> RWANDA-TRAINING-EPILEPSY-SOCIAL-ISSUES-AND-MANAGEMENT</a></li>
              </ul>
            </section>

            <section>
              <h2 class="flex items-center gap-3 border-b border-border pb-2 text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                Stories & Media
              </h2>
                <li class="p-4 rounded-md border border-border bg-secondary/20">
                  <span class="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Story</span>
                  <p class="mb-0 text-foreground font-medium flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary shrink-0 mt-0.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    Story of Chantal Kanyabutembo Rwanda
                  </p>
                </li>
                <li class="p-4 rounded-md border border-border bg-secondary/20">
                  <span class="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Story</span>
                  <p class="mb-0 text-foreground font-medium flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary shrink-0 mt-0.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    Story of Living with Epilepsy Chantal Kanyabutembo – Rwanda
                  </p>
                </li>
              </ul>
            </section>
          </div>          
        </div>
      `;
    }

    return p.body || "";
  };

  return (
    <article className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:px-10 md:py-28">
          <h1 className="font-display text-5xl leading-tight text-foreground md:text-6xl">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {page.excerpt}
            </p>
          )}
        </div>
      </header>

      {/* Optional Cover */}
      {page.cover && (
        <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">
          <img
            src={page.cover}
            alt={page.title}
            className="aspect-[21/9] w-full object-cover rounded-sm shadow-sm"
          />
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
        <div
          className="prose prose-base md:prose-lg prose-neutral max-w-none text-foreground prose-headings:font-display prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-md"
          dangerouslySetInnerHTML={{ __html: getPageBody(page) }}
        />
        {!getPageBody(page) && (
          <p className="text-center text-muted-foreground italic">This page is currently empty.</p>
        )}

        {page.slug === "members" && (
          <div className="mt-20 pt-16 border-t border-border">
            <h2 className="font-display text-3xl mb-2">Application Form for Membership</h2>
            <p className="text-muted-foreground mb-10">
              You can also fill in the short form below to apply directly.
            </p>
            <MembershipForm />
          </div>
        )}
      </div>

      {/* Team Members Grid - Only shown on 'teams' slug */}
      {teamMembers && (
        <section className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
          <div className="mb-16 text-center">
            <h1 className="font-display text-4xl text-foreground uppercase tracking-wider">
              Executive Council for 2026-2027
            </h1>
            <div className="mt-4 mx-auto h-px w-24 bg-primary" />
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex flex-col items-center text-center group">
                <div className="relative mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-border/50 bg-secondary shadow-md transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg">
                  {member.cover ? (
                    <img
                      src={member.cover}
                      alt={member.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <span className="font-display text-4xl">{member.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-display text-2xl text-foreground">{member.title}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-primary">
                  {member.excerpt}
                </p>
                {member.body && (
                  <p className="mt-4 text-sm text-muted-foreground line-clamp-3">{member.body}</p>
                )}
              </div>
            ))}
          </div>
          {teamMembers.length === 0 && (
            <p className="text-center text-muted-foreground">
              No executive council members have been added yet.
            </p>
          )}
        </section>
      )}
    </article>
  );
}

function MembershipForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    contactPerson: "",
    email: "",
    country: "",
    whatsapp: "",
    associationName: "",
    summary: "",
    additionalInfo: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const messageBody = `
Country: ${form.country}
WhatsApp Number: ${form.whatsapp}
Name of Association or Group: ${form.associationName}

Summary of activities:
${form.summary}

Additional information:
${form.additionalInfo}
    `.trim();

    try {
      await submitMessage({
        name: form.contactPerson,
        email: form.email,
        subject: `Membership Application: ${form.associationName || form.contactPerson}`,
        message: messageBody,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your application.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-md border border-border bg-background p-10 text-center">
        <p className="eyebrow text-primary">Application received</p>
        <h3 className="mt-3 font-display text-3xl">Thank you.</h3>
        <p className="mt-3 text-muted-foreground">
          We have received your membership application and will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          label="Contact Person"
          id="contactPerson"
          required
          value={form.contactPerson}
          onChange={(v) => setForm({ ...form, contactPerson: v })}
        />
        <FormField
          label="Email"
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
        <FormField
          label="Country"
          id="country"
          required
          value={form.country}
          onChange={(v) => setForm({ ...form, country: v })}
        />
        <FormField
          label="WhatsApp Number"
          id="whatsapp"
          required
          value={form.whatsapp}
          onChange={(v) => setForm({ ...form, whatsapp: v })}
        />
      </div>

      <FormField
        label="Name of Association or Group"
        id="associationName"
        value={form.associationName}
        onChange={(v) => setForm({ ...form, associationName: v })}
      />

      <div>
        <label htmlFor="summary" className="eyebrow block">
          Summary of activities
        </label>
        <textarea
          id="summary"
          rows={4}
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          className="mt-3 w-full border-0 border-b border-border bg-transparent pb-2 text-base text-foreground outline-none transition-colors focus:border-primary resize-y"
        />
      </div>

      <div>
        <label htmlFor="additionalInfo" className="eyebrow block">
          Additional information
        </label>
        <textarea
          id="additionalInfo"
          rows={3}
          value={form.additionalInfo}
          onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })}
          className="mt-3 w-full border-0 border-b border-border bg-transparent pb-2 text-base text-foreground outline-none transition-colors focus:border-primary resize-y"
        />
      </div>

      {error && (
        <p className="border-l-2 border-destructive bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={busy}
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Submit to ILAEYESRwanda"}
          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  id,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full border-0 border-b border-border bg-transparent pb-2 text-base text-foreground outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}
