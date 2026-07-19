// Default fallback content for the website's pages when no database content exists.
import hero from "@/assets/new-hero.jpeg";
import researchImage from "@/assets/research.jpeg";
import sportEventHome from "@/assets/sport-event.jpeg";
import sportEventAbout from "@/assets/sport.jpeg";

export const cmsDefaults: Record<string, any> = {
  home: {
    seo: {
      title: "ILAE YOUTH NURSE RWANDA — Epilepsy Awareness Initiative",
      description: "Lumen is an independent initiative changing the conversation around epilepsy through research, education, and community.",
      keywords: "epilepsy, rwanda, nurse, health, neurology",
    },
    hero: {
      label: "ILAE YES RWANDA",
      heading: "Empowering primary care nurse education programme prioritise social care education",
      highlightedText: "epilepsy policies.",
      description: "The Young Epilepsy Section (YES) of the ILAE is a worldwide organization of young people who are in the early stages of a career focused on the care of people with epilepsy, and/or epilepsy research. By observing the high prevalence of epilepsy, new epilepsy diagnoses, and limited access to care due to the shortage of healthcare professionals in Rwanda.",
      buttonText: "Read the journal",
      buttonUrl: "/posts",
      buttonOpenNewTab: false,
      linkText: "Our mission",
      linkUrl: "/about",
      linkOpenNewTab: false,
      image: hero,
      imageAlt: "Community members gathering for a Brain Week movement event in Kigali, Rwanda.",
      bgClass: "",
      visible: true,
    },
    marquee: [
      { stat: "50M+", label: "People globally affected by epilepsy" },
      { stat: "70%", label: "Can live seizure-free with treatment" },
      { stat: "12+", label: "Active programs across Rwanda" },
      { stat: "100%", label: "Independent and evidence-led" },
    ],
    journalHeader: {
      label: "From the Journal",
      heading: "Reading list",
    },
    communityEvent: {
      label: "Community Impact",
      heading: "Advocacy through",
      highlightedText: "action.",
      description: "Our community events, including the recent sports initiative in Kigali, bring people together to raise awareness and foster inclusion for those living with epilepsy.",
      buttonText: "View event gallery",
      buttonUrl: "/gallery",
      buttonOpenNewTab: false,
      image: sportEventHome,
      imageAlt: "Participants at a community sport event for epilepsy awareness.",
      visible: true,
    },
    cta: {
      label: "A Note On Our Work",
      heading: "Quiet, careful, evidence-led.",
      description: "ILAE YOUTH NURSE RWANDA funds independent research, publishes plain-language guides for patients and families, and runs community programs in twelve cities. We don't sell anything. We don't accept industry funding. Everything we do is reviewed by our medical advisory board.",
      button1Text: "Read our principles",
      button1Url: "/about",
      button1OpenNewTab: false,
      button2Text: "Support the work",
      button2Url: "/donate",
      button2OpenNewTab: false,
      image: researchImage,
      imageAlt: "Research members working together.",
      visible: true,
    },
  },
  about: {
    seo: {
      title: "About — ILAE YES Rwanda",
      description: "Our mission, the science of epilepsy, and the principles that guide every part of our work.",
      keywords: "about, mission, principles, values",
    },
    header: {
      label: "About ILAE YOUTH NURSE RWANDA",
      heading: "No person life is limited by epilepsy or neurological diseases",
    },
    whoWeAre: {
      label: "Who we are",
      heading: "Who we are",
      paragraphs: [
        "Since 2020, ILAE YES Rwanda has brought together teachers and students in a shared mission to fight epilepsy through education, awareness, and community engagement. The initiative was established to increase understanding of epilepsy, reduce stigma and discrimination, and create a supportive environment for individuals living with the condition, especially students. Through advocacy campaigns, educational activities, and collaboration with schools and communities, members have worked to ensure that people with epilepsy are treated with dignity, respect, and inclusion.",
        "In 2024, nurses joined the initiative, strengthening the movement by adding healthcare expertise and expanding its capacity to support people affected by epilepsy. The collaboration between teachers, students, and nurses has created a multidisciplinary team committed to improving epilepsy awareness, promoting accurate knowledge about seizure management, and encouraging early access to medical care. Together, they work to support, accompany, and advocate for students living with epilepsy, helping them overcome challenges, succeed in their education, and fully participate in school and community life. Through this united effort, ILAE YES Rwanda continues to build a more informed, inclusive, and supportive society for people living with epilepsy.",
        "Our commitment is guided by integrity, teamwork, inclusiveness, and excellence. Together with our partners and communities, we strive to uplift lives, restore hope, and create lasting social transformation."
      ],
    },
    imageBreak: {
      image: sportEventAbout,
      imageAlt: "A community sports event for epilepsy awareness.",
      caption: "Sports Event, ILAE YES Rwanda",
    },
    factsList: {
      label: "Five things worth knowing",
      facts: [
        "Epilepsy affects 50 million people globally — more than Parkinson's, MS, and ALS combined.",
        "70% of people with epilepsy could become seizure-free with proper treatment.",
        "You cannot swallow your tongue. Never put anything in the mouth of someone seizing.",
        "Most seizures stop on their own within 1–3 minutes. Call emergency services after 5.",
        "Driving laws vary by country, but many people with controlled epilepsy can drive legally.",
      ],
    },
  },
  donate: {
    seo: {
      title: "Donate — Epilepsy Alliance Africa",
      description: "Make a contribution to Epilepsy Alliance Africa. Your gift funds quiet, careful, evidence-led work.",
      keywords: "donate, gift, support, contribute",
    },
    header: {
      label: "Support",
      heading: "Your gift funds quiet, careful, evidence-led work.",
      description: "Epilepsy Alliance Africa accepts no industry funding. We are sustained entirely by individual donors and a small number of mission-aligned foundations. Every contribution is acknowledged. Every dollar is accounted for.",
    },
    formConfig: {
      heading: "Make a Donation",
      amounts: [35, 50, 100, 250, 500],
      inquiryEmail: "epilepsyallianceafrica@gmail.com",
    },
  },
  "donate-details": {
    seo: {
      title: "Complete Donation — ILAE YES RWANDA",
      description: "Enter your secure payment and personal details to complete your donation.",
      keywords: "checkout, complete donation, payment",
    },
    header: {
      label: "Complete Your Gift",
      amountPrefix: "You are giving",
    },
  },
  gallery: {
    seo: {
      title: "Gallery — ILAE YOUTH NURSE RWANDA",
      description: "Photographs from Lumen events, programs, and community gatherings.",
      keywords: "gallery, photos, visual record",
    },
    header: {
      label: "Gallery",
      heading: "Programs, walks, gatherings.",
      description: "A visual record of the work — captured by photographers in the field, at clinics, and inside community rooms.",
    },
  },
  contact: {
    seo: {
      title: "Contact — Lumen",
      description: "Get in touch with the Lumen Epilepsy Initiative — questions, partnerships, or press inquiries.",
      keywords: "contact, email, phone, address",
    },
    header: {
      label: "Contact",
      heading: "Write to us.",
      description: "Questions, partnership inquiries, press, or just a note — we read everything ourselves.",
    },
    infoBlock: {
      email: "yesilaerwanda@gmail.com",
      phones: ["+44 7984 880322", "+250 785 457 841"],
      address: ["Rwanda", "KIGALI", "Ndera"],
      hours: ["Monday — Friday", "09:00 — 17:00 CET"],
    },
  },
  "posts-index": {
    seo: {
      title: "Journal — ILAE YOUTH NURSE RWANDA",
      description: "Articles, news, and publications from ILAE YOUTH NURSE RWANDA.",
      keywords: "news, blog, articles, publications",
    },
    header: {
      label: "Journal",
      heading: "Recent publications.",
      description: "Research, field notes, and guides on epilepsy in Africa. Updated monthly.",
    },
  },
};

export function getCmsDefaults(slug: string): any {
  if (cmsDefaults[slug]) {
    return cmsDefaults[slug];
  }
  // Default dynamic page fallback
  return {
    seo: {
      title: `${slug.toUpperCase()} — ILAE YOUTH NURSE RWANDA`,
      description: `Information and updates on ${slug}.`,
    },
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    excerpt: `Discover updates and resources for ${slug}.`,
    body: "",
  };
}
