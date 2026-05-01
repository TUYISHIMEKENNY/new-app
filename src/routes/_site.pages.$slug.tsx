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
      return `
        <div class="mb-10 flex gap-4 border-b border-border pb-4 font-semibold text-sm uppercase tracking-wider text-muted-foreground overflow-x-auto">
          <a href="#why-stories" class="hover:text-primary no-underline transition-colors whitespace-nowrap">Why stories</a>
          <a href="#format" class="hover:text-primary no-underline transition-colors whitespace-nowrap">Format of stories</a>
          <a href="#submission" class="hover:text-primary no-underline transition-colors whitespace-nowrap">Submission</a>
          <a href="#" class="hover:text-primary no-underline transition-colors whitespace-nowrap">2024 stories</a>
        </div>

        <p class="lead text-xl text-muted-foreground">This page contains stories of living with or caring for a person with epilepsy and is updated continuously.</p>
        
        <p><strong>Bigger and better.</strong> Stories depict a journey and these journeys of lived experience have a positive effect on others, be it persons with epilepsy, carers and the world at large.</p>

        <h2 id="why-stories">Why stories</h2>
        <p>A story stimulates the brain, and can change the way we act in our lives. Stories motivate, they make us more empathic and influence social behavior. Epilepsy is a condition that is misunderstood and we believe it is through these stories we will be able to better the lives of persons with epilepsy and eventually defeat epilepsy, the challenges and social issues that come along with it.</p>
        <p>It is through our stories we are able to show how far we are able to go with epilepsy, be it with education, employment, marriage etc.</p>

        <blockquote class="border-l-4 border-primary pl-6 my-8 italic text-lg text-foreground/80">
          "Debunk the myths surrounding epilepsy today. Motivate someone with epilepsy, a career, remind them that life is full of possibilities, most of all that we have epilepsy but epilepsy does not have us!"
        </blockquote>

        <h2 id="format">Format of stories</h2>
        <p>Those submitting stories can use any of the following formats:</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <div class="border border-border rounded-md p-4 bg-secondary/30">Video recording</div>
          <div class="border border-border rounded-md p-4 bg-secondary/30">Audio recording (Voice note)</div>
          <div class="border border-border rounded-md p-4 bg-secondary/30">Handwritten story</div>
          <div class="border border-border rounded-md p-4 bg-secondary/30">Art</div>
        </div>

        <hr class="my-10 border-border" />

        <h2 id="submission">Submission</h2>
        <div class="flex flex-col gap-3">
          <p class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <a href="tel:+250 787 251 399" class="no-underline text-foreground hover:text-primary transition-colors">+250 787 251 399</a>
          </p>
          <p class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <a href="mailto:yesilaerwanda@gmail.com" class="no-underline text-foreground hover:text-primary transition-colors">yesilaerwanda@gmail.com</a>
          </p>
        </div>
        
        <p class="mt-8">More details available on our website here: <a href="#">link</a></p>
      `;
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
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSdxM5G_4-N8q1OQO-i1zF5lG-R-99y7QO-2C-T_8-Q-3Q-9-2Q/viewform?usp=pp_url&entry.2057602315=Yes" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-base font-semibold uppercase tracking-wider text-background transition-colors hover:bg-primary shadow-md">
            Click here to evaluate the conference
          </a>
        </div>

        <p class="lead text-lg">Dear all,</p>
        <p>We had a great conference, thanks to all those who planned, chaired, presented and attended. All in all 105 people registered, while others attended in groups. Combined, days 1 and 2 had 6 hours of learning and sharing. We had a total of 25 presenters and 10 chairpersons.</p>

        <div class="bg-secondary/30 border border-border p-6 rounded-md my-8">
          <h3 class="font-display text-xl mb-4 mt-0">Conference Reports</h3>
          <ul class="space-y-3 m-0 list-none p-0">
            <li class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <a href="" target="_blank" rel="noopener noreferrer" class="font-medium hover:underline">Day 1 Report</a>
            </li>
            <li class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <a href="" target="_blank" rel="noopener noreferrer" class="font-medium hover:underline">Day 2 Report</a>
            </li>
          </ul>
        </div>

        <p class="font-semibold text-primary">Conference videos: selected presentations will be uploaded to our YouTube channel.</p>

        <hr class="my-10 border-border" />

        <h2>Feedback</h2>
        <p>We kindly ask you to provide us feedback USING THIS SHORT ANONYMOUS FORM: <a href="" target="_blank" rel="noopener noreferrer"></a></p>

        <h2>Invitation to ILAE Rwanda 2026 Congress</h2>
        <p>We warmly invite you to the 6th ILAE Rwanda Congress (ILAE), which will take place on <strong>16–17 September 2026</strong>. Building on the successes of previous congresses, the next conference will be larger and will continue to unite voices for epilepsy advocacy, innovation, and impact across Rwanda and globally.</p>

        <h2>5th Conference, 2025</h2>
        <p><strong>17 September (2 hours) and 18 September (4 hours)</strong><br />
        17 September will be 2 hours and 18 September will be 4 hours.</p>
        <p class="italic text-muted-foreground">Please use the same ZOOM link or ID that was emailed to you after registration to attend on both days.</p>
        <p>Join us for the next conference that will be during Stripes Epilepsy Week.</p>

        <div class="bg-primary/5 border-l-4 border-primary p-6 my-8">
          <h3 class="font-display text-xl mt-0 text-primary">Conference theme</h3>
          <p class="m-0 font-medium">From Voices to Action – Recognising the Works of Grassroots Organisations | Working towards reaching African targets of the Intersectoral global action plan on epilepsy and other neurological disorders.</p>
        </div>

        <h2>Aim of the conference</h2>
        <p>The ILAE Rwanda is a young Rwanda-wide organisation that was formed in December 2019. Each year, we host a conference to bring together people working to defeat epilepsy in Rwanda and interested parties from across the world. This year’s conference will be held during the Zebra Stripes Week which is Africa’s homegrown awareness event. Through the 5th online conference, we hope to bring people together to learn about the work that is being done by advocates and professionals, hear from experts and policymakers and more importantly hear stories of resilience and how people with epilepsy and their families are being impacted.</p>

        <hr class="my-10 border-border" />

        <h2>Program</h2>
        
        <div class="overflow-x-auto my-8">
          <table class="w-full text-left text-sm border-collapse border border-border">
            <thead class="bg-secondary text-foreground uppercase tracking-wider text-xs">
              <tr>
                <th class="p-3 border border-border font-semibold">Day</th>
                <th class="p-3 border border-border font-semibold">Session</th>
                <th class="p-3 border border-border font-semibold">Presenters</th>
                <th class="p-3 border border-border font-semibold">Title / Topic</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr class="hover:bg-muted/50 transition-colors">
                <td class="p-3 border border-border whitespace-nowrap align-top"><strong>Day 1</strong></td>
                <td class="p-3 border border-border align-top">Opening 8-9am<br/><span class="text-xs text-muted-foreground mt-1 block">Chair: Dr Rugare Mugumbate, Zimbabwe</span></td>
                <td class="p-3 border border-border align-top">
                  <ul class="list-disc pl-4 m-0 space-y-1">
                    <li>Prof. Najib Kissani, Morocco</li>
                    <li>Mr. Banard Mbuya Onyango, Kenya</li>
                    <li>Mr. Youssouf Noormamode, Mauritius</li>
                    <li>Prof. Alla Guekht, Russia</li>
                  </ul>
                </td>
                <td class="p-3 border border-border align-top">
                  <ul class="list-disc pl-4 m-0 space-y-1">
                    <li>Opening Remarks</li>
                    <li>Intersectoral Global Action Plan (IGAP) on Epilepsy and other Neurological Disorders</li>
                  </ul>
                </td>
              </tr>
              <tr class="hover:bg-muted/50 transition-colors">
                <td class="p-3 border border-border whitespace-nowrap align-top"></td>
                <td class="p-3 border border-border align-top">Session 1: Community Voices 9-10am<br/><span class="text-xs text-muted-foreground mt-1 block">Chair: Prof Najib Kissani, Morocco</span></td>
                <td class="p-3 border border-border align-top">
                  <ul class="list-disc pl-4 m-0 space-y-2">
                    <li>Mr. Habimana Jean Leon, Rwanda</li>
                    <li>Prof. Athanase Millogo, Burkina Faso</li>
                    <li>Prof. Arif Herekar, Pakistan</li>
                    <li>Ms. Vallent Adhiambo, Kenya</li>
                  </ul>
                </td>
                <td class="p-3 border border-border align-top">
                  <ul class="list-disc pl-4 m-0 space-y-2">
                    <li>The Role of Epilepsy Advocacy in Transforming Lives of People with Epilepsy in Rural Communities</li>
                    <li>Professional’s Role in Africa</li>
                    <li><strong>Keynote:</strong> Chairman and Head of Neurosciences, Baqai Medical University, Pakistan</li>
                    <li>Advocacy Work of Grassroots Associations: the Case of GENO, Kenya</li>
                  </ul>
                </td>
              </tr>
              <tr class="hover:bg-muted/50 transition-colors">
                <td class="p-3 border border-border whitespace-nowrap align-top"><strong>Day 2</strong></td>
                <td class="p-3 border border-border align-top">Session 2: Regional Interventions 8am-9am<br/><span class="text-xs text-muted-foreground mt-1 block">Chair: Ms Sarah Nekesa, Uganda and Mr Taurai Kadzviti, Zimbabwe</span></td>
                <td class="p-3 border border-border align-top">
                  <ul class="list-disc pl-4 m-0 space-y-2">
                    <li>Dr Osman Miyanji, KAWE, Kenya</li>
                    <li>Dr. Bertha Chioma Ekeh, Nigeria/Gambia</li>
                    <li>Dr. Daniel Gams Massi, Cameroon</li>
                    <li>Mr. Symon Munde, Malawi</li>
                    <li>Dr. Michel Arnaud Saphou-Damon, Gabon</li>
                  </ul>
                </td>
                <td class="p-3 border border-border align-top">
                  <ul class="list-disc pl-4 m-0 space-y-2">
                    <li>Opening Remarks</li>
                    <li>Role of Community Health Workers in Epilepsy Care</li>
                    <li>Factors Associated with the Stigmatisation of People with Epilepsy</li>
                    <li>The African Disability Protocol during the Conference</li>
                    <li>Medication Availability for People with Epilepsy in West Africa and Impact on Seizure Management</li>
                  </ul>
                </td>
              </tr>
              <tr class="hover:bg-muted/50 transition-colors">
                <td class="p-3 border border-border whitespace-nowrap align-top"></td>
                <td class="p-3 border border-border align-top">Session 3: Regional Interventions 9am-10am<br/><span class="text-xs text-muted-foreground mt-1 block">Chair: Ms Chantal Kanyabutembo, Rwanda</span></td>
                <td class="p-3 border border-border align-top">
                  <ul class="list-disc pl-4 m-0 space-y-2">
                    <li>Prof. Chahnez Charfi Triki, Tunisia</li>
                    <li>Prof. G. Q. Kandawasvika, Zimbabwe</li>
                    <li>Ms. Nyaradzai Gomwe, Zimbabwe</li>
                    <li>Prof. Angelina Kakooza, Uganda</li>
                  </ul>
                </td>
                <td class="p-3 border border-border align-top">
                  <ul class="list-disc pl-4 m-0 space-y-2">
                    <li>Training Epilepsy Trainers Among Primary School Teachers</li>
                    <li>Paediatric Epilepsy Care in Zimbabwe: Overcoming Barriers, Enhancing Access</li>
                    <li>Epilepsy and Cognition: Understanding the Neuropsychological Implications</li>
                    <li>Prevention of Common Neurological Conditions across the Life Span</li>
                  </ul>
                </td>
              </tr>
              <tr class="hover:bg-muted/50 transition-colors">
                <td class="p-3 border border-border whitespace-nowrap align-top"></td>
                <td class="p-3 border border-border align-top">Session 4: Global Perspectives 10am-11am<br/><span class="text-xs text-muted-foreground mt-1 block">Chair: Ms Epillose Musimbi, Kenya and Ms Enat Yewnetu, Ethiopia</span></td>
                <td class="p-3 border border-border align-top">
                  <ul class="list-disc pl-4 m-0 space-y-2">
                    <li>Dr. Mrs. Chanda Kulkarni, India</li>
                    <li>Prof. Maria Emilia Cosenza Andraus, Brazil</li>
                    <li>Prof. Jo Wilmshurst, South Africa</li>
                    <li>Prof. Arjune Sen, United Kingdom</li>
                  </ul>
                </td>
                <td class="p-3 border border-border align-top">
                  <ul class="list-disc pl-4 m-0 space-y-2">
                    <li>Epilepsy as a Prototype Model to Educate Healthcare Professionals at the “Grass Root Level”</li>
                    <li>Continuing Medical Education in Epilepsy and EEG – improving diagnosis in resource-limited settings</li>
                    <li>Transition of Care in LMICs</li>
                    <li>Introducing The Centre for Global Epilepsy</li>
                  </ul>
                </td>
              </tr>
              <tr class="hover:bg-muted/50 transition-colors">
                <td class="p-3 border border-border whitespace-nowrap align-top"></td>
                <td class="p-3 border border-border align-top">Session 5: Reflections & Closing 11am-1200am<br/><span class="text-xs text-muted-foreground mt-1 block">Chair: Mr Bankole M.Olusola</span></td>
                <td class="p-3 border border-border align-top">
                  <ul class="list-disc pl-4 m-0 space-y-2">
                    <li>Ms. Afnane Massou, Morocco</li>
                    <li>Ms. Betty Barbara Nsachilwa, Zambia</li>
                    <li>EAA Vice-Presidents*</li>
                    <li>Dr. Najib Kissani, Morocco</li>
                  </ul>
                  <div class="mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                    *Samuel Chigamba (Southern Africa), Adam Jannah (West Africa), Michel Arnaud Saphou-Damon (Central Africa), Dr Mahdaoui Mohamed (North Africa)
                  </div>
                </td>
                <td class="p-3 border border-border align-top">
                  <ul class="list-disc pl-4 m-0 space-y-2">
                    <li>Reflections & Closing Remarks</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    // If it's the stripes week page and the body is empty or just the default placeholder
    if (p.slug === "stripes-week" && (!p.body || p.body.includes("This is placeholder content"))) {
      return `
        <div class="mb-12">
          <p class="lead text-2xl text-foreground text-center font-display italic">More voices. More awareness.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div class="bg-primary/5 border border-primary/20 rounded-xl p-8">
            <h3 class="font-display text-2xl mt-0 text-primary">Stripes Week 2025</h3>
            <p class="text-lg font-semibold mb-4">15-19 September 2025</p>
            <p class="mb-6">Join us to spread awareness in the 3rd week of September.</p>
            <h4 class="text-sm uppercase tracking-wider text-muted-foreground mt-0">Theme</h4>
            <p class="font-medium">From Voices to Action – Recognising the Works of Grassroots Organisations</p>
            <hr class="my-6 border-primary/10" />
            <h4 class="text-sm uppercase tracking-wider text-muted-foreground mt-0">Organizing team</h4>
            <ul class="list-none p-0 m-0 space-y-1 text-sm">
              <li>Barnard Mbuya, Kenya</li>
              <li>Dr Chahnez, Tunisia</li>
              <li>Valent Odhiambo, Kenya</li>
              <li>Taurai Kadzviti (President 2019-2023), Zimbabwe</li>
              <li>Dr Khaoula Balili, Morocco</li>
              <li>Samuel Chigamba, Malawi</li>
            </ul>
          </div>

          <div class="bg-secondary/30 border border-border rounded-xl p-8">
            <h3 class="font-display text-2xl mt-0">Stripes Week 2024</h3>
            <p class="text-lg font-semibold mb-4 text-muted-foreground">23-27 September 2024</p>
            <p class="mb-6 invisible hidden md:block">Placeholder for alignment</p>
            <h4 class="text-sm uppercase tracking-wider text-muted-foreground mt-0">Theme</h4>
            <p class="font-medium">Empowering Caregivers: A Journey of Giving, Receiving and Valuing Care</p>
            <hr class="my-6 border-border" />
            <h4 class="text-sm uppercase tracking-wider text-muted-foreground mt-0">Organizing team <span class="lowercase text-xs font-normal">(AAT)</span></h4>
            <ul class="list-none p-0 m-0 space-y-1 text-sm text-muted-foreground">
              <li>Barnard Mbuya, Kenya</li>
              <li>Dr Chahnez, Tunisia</li>
              <li>Valent Odhiambo, Kenya</li>
              <li>Taurai Kadzviti (President 2019-2023), Zimbabwe</li>
              <li>Dr Khaoula Balili, Morocco</li>
              <li>Samuel Chigamba, Malawi</li>
            </ul>
          </div>
        </div>

        <div class="space-y-10">
          <div>
            <h2 class="flex items-center gap-3">
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">?</span>
              What is Stripes Week?
            </h2>
            <p>Stripes Week is an annual event promoted by the Epilepsy Alliance Africa (EAA). It is celebrated globally during the 3rd week of September each year. During Stripes Week, we mobilise people for epilepsy awareness throughout the world.</p>
          </div>

          <div>
            <h2 class="flex items-center gap-3">
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">?</span>
              Why zebra colours?
            </h2>
            <p>We searched for a common colour, and common animal on the continent that could help us send a strong message. We found the zebra and its colours very attractive. Zebra stripes represent belonging, oneness, strengths, shining and visibility. That is why they have been selected to represent epilepsy week. In Africa, where the epilepsy week idea originated from, zebras are well known and liked.</p>
          </div>

          <div>
            <h2 class="flex items-center gap-3">
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">?</span>
              Why this event?
            </h2>
            <p>The event is organised to accelerate epilepsy awareness. If many of us create awareness messages and share them, the challenge of epilepsy will be lessened.</p>
          </div>

          <div class="bg-secondary/40 border-l-4 border-foreground p-6">
            <h2 class="mt-0 flex items-center gap-3">
              What can I wear or do?
            </h2>
            <p>There are many suggestions of what can be done by individuals, families, communities, organisations, schools, workplaces and government during epilepsy week:</p>
            <ul class="space-y-2 mt-4">
              <li><strong>Wear or use zebra stripes:</strong> A hat, scarf, headcover, shirt, dress, blouse, trousers, bag, belt, t-shirt and tie or cushion or hair.</li>
              <li><strong>Arrange an event:</strong> Face to face or online awareness campaigns.</li>
              <li><strong>Share information:</strong> By word of mouth or social media.</li>
              <li><strong>Tell a story:</strong> Share your story or your family’s story with epilepsy.</li>
              <li><strong>Listen:</strong> Listen to a story of someone with epilepsy.</li>
              <li><strong>Show support:</strong> Change the status or profile picture for your social media pages.</li>
            </ul>
          </div>
        </div>

        <hr class="my-12 border-border" />

        <h2>Past Themes</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 text-center">
          <div class="border border-border rounded-lg p-6">
            <h4 class="font-display text-3xl text-primary m-0">2023</h4>
            <p class="font-medium mt-2">Making epilepsy visible</p>
          </div>
          <div class="border border-border rounded-lg p-6">
            <h4 class="font-display text-3xl text-primary m-0">2022</h4>
            <p class="font-medium mt-2">More voices. More awareness</p>
          </div>
          <div class="border border-border rounded-lg p-6">
            <h4 class="font-display text-3xl text-primary m-0">2021</h4>
            <p class="font-medium mt-2">Share a story. Listen to a story</p>
          </div>
        </div>

        <div class="mt-16 flex flex-wrap gap-3 justify-center">
          <span class="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold tracking-wider text-primary-foreground">#EpilepsyWeek</span>
          <span class="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold tracking-wider text-primary-foreground">#StripesWeek</span>
          <span class="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary">#EpiWeek2022</span>
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
            
            <section>
              <h2 class="flex items-center gap-3 border-b border-border pb-2 text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Annual Reports
              </h2>
              <ul class="space-y-3 mt-4 list-none p-0">
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Annual-Report-2020_Epilepsy-Alliance-Africa</a></li>
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Annual-Report-2021</a></li>
              </ul>
            </section>

            <section>
              <h2 class="flex items-center gap-3 border-b border-border pb-2 text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                Guidelines & Call to Action
              </h2>
              <ul class="space-y-3 mt-4 list-none p-0">
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> GUIDELINES-TO-FORM-A-GROUP-ASSOCIATION-OR-ORGANISATION</a></li>
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Epilepsy-in-Africa_Call-to-Action</a></li>
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Themes-from-discussion-Epilepsy-in-Africa</a></li>
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> Intersectoral Global Action Plan on epilepsy and other neurological disorders 2022 – 2031</a></li>
              </ul>
            </section>

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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                For Clinics & Hospitals
              </h2>
              <ul class="space-y-3 mt-4 list-none p-0">
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Epilepsy-Patient-Register_Epilepsy-Alliance-Africa.pdf</a></li>
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Epilepsy-Patient Register.docx</a></li>
              </ul>
            </section>

            <section>
              <h2 class="flex items-center gap-3 border-b border-border pb-2 text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                Presentations & Miscellaneous
              </h2>
              <ul class="space-y-3 mt-4 list-none p-0">
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Group-discussions-during-conference-2022</a></li>
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Leaders-capacity-building-EAAC3_Ubuntu-model</a></li>
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> RWANDA-TRAINING-EPILEPSY-SOCIAL-ISSUES-AND-MANAGEMENT</a></li>
                <li><a href="#" class="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium no-underline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> NAMES-GIVEN-TO-EPILEPSY3</a></li>
              </ul>
            </section>

            <section>
              <h2 class="flex items-center gap-3 border-b border-border pb-2 text-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                Stories & Media
              </h2>
              <ul class="space-y-3 mt-4 list-none p-0">
                <li class="p-4 rounded-md border border-border bg-secondary/20">
                  <span class="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1 block">Audio</span>
                  <a href="#" class="flex items-center gap-2 text-foreground hover:text-primary font-medium no-underline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary shrink-0"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                    Song_Epilepsy Alliance Africa_2021
                  </a>
                </li>
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
                    Impact Story of a Person with Epilepsy Enat Yewnetu Ethiopia – My Personal Journey with Epilepsy
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

          <!-- Right Column: Video Library -->
          <div class="lg:col-span-5">
            <div class="sticky top-24 border border-border rounded-xl bg-background overflow-hidden shadow-sm">
              <div class="bg-secondary/50 p-4 border-b border-border flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
                <h3 class="font-display text-xl m-0">Video Library</h3>
              </div>
              <div class="max-h-[800px] overflow-y-auto p-2">
                <ul class="space-y-1 list-none p-0 m-0">
                  ${[
                    "Webinar 19 Enat Yewnetu, MPH",
                    "Webinar 19 Dr Tesfaye Zelleke",
                    "Epilepsy Indaba 1 EpilepsyAllianceAfrica",
                    "Professor Dr Samuel Wiebe, Secretary General of the ILAE, Canada International Epilepsy Policy",
                    "Dr Helen Cross, Head of Neurosciences Unit at University College London",
                    "DR GAMS DANIEL MASSI, CAMEROON, SECRETARY GENERAL CHEZ AFRICAN ACADEMY OF NEUROLOGY",
                    "Dr Rory Horner, Local Production of Anti Epileptic Drugs Agenda",
                    "EPILEPSY SUPPORT ASSOCIATION OF UGANDA ESAU SARAH NEKESA",
                    "H E Nebiat Getachew Assegid Ambassador of Ethiopia to Algeria",
                    "PROFESSOR HEREKAR, PAKISTAN, PROFESSOR IBRAHIM, SUDAN AND MS FREDA BEDIAKO PUNI, GHANA",
                    "CLOSING REMARKS BY MR TAURAI KADZVITI, ZIMBABWE, PRESIDENT OF EAA AND ENAT YEWNETU",
                    "Dr Naluca Mwendaweli The Work of Young Epilepsy at ILAE",
                    "Dr John Mangwiro – Deputy Minister of Health and Child Care – Zimbabwe",
                    "Rumbidzai Mutekeri Choice of AEDs in Women of Child Bearing Age",
                    "Dr Musa Watila The Impact of Epilepsy in the Africa Context",
                    "HE Mr Teferi Melesse Desta Ethiopia High Commissioner to UK and Ireland",
                    "Mr Taurai Kadzviti EAA President Welcome Speech",
                    "Samuel Chigamba Epilepsy Warriors Malawi",
                    "Chantal Kanyabutembo Remarques de bienvenue // Welcome Remarks",
                    "Enat Yewnetu Ethiopia Welcome Message",
                    "Webinar 13_Ethiopia_Enat Yewnetu",
                    "Webinar 13_Ethiopia_Kim Morley",
                    "Conference Invitation – Epilepsy Alliance Africa Conference 2021 (EAAC2)",
                    "Munokokwa kuUngano (Shona) – EAAC2",
                    "First anniversary celebrations of EAA – Speech Dr Jacob Rugare Mugumbate",
                    "Musimbi Epillose Kenya, EAA 1st Anniversary Message",
                    "PETER NYETTE, KENYA, EAA FIRST ANNIVERSARY",
                    "The way forward for Africa to defeat epilepsy: themes from first conference",
                    "Zimbabwe Epilepsy Week Webinar Dr Manangazira",
                    "ZIMBABWE EPILEPSY WEEK 2020 WEBINAR DR GWEN KANDAWASVIKA",
                    "Adam Janneh, The Gambia – Building Sustainable Associations",
                    "Musimbi Epillose, Kenya: Youth and training",
                    "Dr Gams Massi, Cameroon, Epilepsy and pregnancy in Africa",
                    "Chikhulupiliro Ng’ombe – Challenges of a person with epilepsy in Malawi",
                    "Chantal Kanyabutembo, Rwanda, Epilepsy in Rwanda: my personal journey",
                    "Dr Charlotte Baker, Lancaster University, UK, Alternative explanations for disability",
                    "Natalie L. Boehm, The Defeating Epilepsy Foundation. Finding Donors & Sponsors",
                    "The work of epilepsy specialist Anthony M. Zimba, 1954-2020",
                    "Mr Lefhoko Kesamang, Snr Social Welfare Officer, African Union",
                    "Webinar 5 Welcome Remarks",
                    "Epilepsy in Africa_Intervention of ROW Foundation_Lori Hairell",
                    "Epilepsy and Autism_Joan Kagema_Kenya",
                    "Epilepsy in Africa_Africa Driven Research_Dr Jacob R. Mugumbate",
                    "Epilepsy Research Challenges & Opportunities_Dr Gams Massi _Cameroon",
                    "Epilepsy in Africa, health workers’ knowledge in Sierra",
                  ]
                    .map(
                      (video) => `
                    <li>
                      <a href="#" class="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors no-underline group text-left">
                        <div class="mt-0.5 shrink-0 bg-primary/10 text-primary p-2 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                        <span class="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">${video}</span>
                      </a>
                    </li>
                  `,
                    )
                    .join("")}
                </ul>
              </div>
            </div>
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
          {busy ? "Submitting…" : "Submit to EAA"}
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
