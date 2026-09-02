import walk from "@/assets/event 1.jpeg";
import gala from "@/assets/events 2.jpeg";
import clinic from "@/assets/event 3.jpeg";
import school from "@/assets/event 4.jpeg";
import volunteer from "@/assets/event 5.jpeg";
import research from "@/assets/event 6.jpeg";
import landmark from "@/assets/event 7.jpeg";
import event1 from "@/assets/event 1.jpeg";
import event2 from "@/assets/events 2.jpeg";
import event3 from "@/assets/event 3.jpeg";
import event4 from "@/assets/event 4.jpeg";
import event5 from "@/assets/event 5.jpeg";
import event6 from "@/assets/event 6.jpeg";
import event7 from "@/assets/event 7.jpeg";
import event8 from "@/assets/event 8.jpeg";
import speech1 from "@/assets/speech 1.jpeg";
import speech2 from "@/assets/speech 2.jpeg";
import speech3 from "@/assets/speech 3.jpeg";
import sportEvent from "@/assets/sport-event.jpeg";
import galleryBkWalk from "@/assets/gallery-bk-walk.jpg";
import gallerySchoolOutreach1 from "@/assets/gallery-school-outreach-1.jpg";
import gallerySchoolOutreach2 from "@/assets/gallery-school-outreach-2.jpg";
import galleryConferencePanel from "@/assets/gallery-conference-panel.jpg";
import galleryConferenceMeeting from "@/assets/gallery-conference-meeting.jpg";

export type Post = {
  slug: string;
  title: string;
  dek: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  cover: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "what-we-talk-about-when-we-talk-about-epilepsy",
    title: "What we talk about when we talk about epilepsy",
    dek: "Fifty million people live with epilepsy worldwide. Most of what the public believes about the condition is wrong.",
    author: "Dr. Amara Okafor",
    date: "March 26, 2025",
    readTime: "8 min read",
    category: "Perspective",
    cover: research,
    body: [
      "Epilepsy is not one disease. It is an umbrella for more than forty distinct syndromes, each with its own genetic signature, age of onset, and response to treatment. To speak of it in the singular is already to misunderstand it.",
      "And yet — for most of human history, that is precisely what we have done. Hippocrates called it the sacred disease. The Romans called it morbus comitialis, the disease of the assembly, because a seizure on the senate floor was reason enough to dissolve the day's proceedings. Across centuries and continents, the language has shifted, but the silence around it has remained remarkably constant.",
      "What changes that silence is, almost always, a story. A friend's diagnosis. A child's first seizure. A coworker who steps quietly into a conference room to take a phone call from a neurologist. The condition becomes real when it acquires a face.",
      "This journal exists to give it many faces — patients, researchers, caregivers, neighbors. Not to romanticize the experience, but to render it accurately, in language that respects both the science and the lived reality.",
    ],
  },
  {
    slug: "first-aid-the-five-minute-rule",
    title: "First aid: the five minute rule",
    dek: "What to do — and what not to do — if someone near you has a seizure. A guide every adult should read.",
    author: "Maya Lindqvist, RN",
    date: "March 18, 2025",
    readTime: "5 min read",
    category: "Guide",
    cover: clinic,
    body: [
      "Move sharp objects away. Cushion the head. Note the time. These three actions, performed by a stranger on a sidewalk, can change the outcome of a seizure entirely.",
      "The most common myth — that you should put something in the mouth of someone seizing — is also the most dangerous. You cannot swallow your tongue. You can, however, break teeth or fingers in the attempt to insert one.",
      "If a convulsive seizure lasts longer than five minutes, call emergency services. Until then, the right thing to do is often the hardest: stay calm, stay close, and wait.",
    ],
  },
  {
    slug: "the-quiet-revolution-in-genetic-testing",
    title: "The quiet revolution in genetic testing",
    dek: "A new generation of panels is rewriting what we know about pediatric epilepsy — and what we can do about it.",
    author: "Dr. Ren Park",
    date: "February 28, 2025",
    readTime: "12 min read",
    category: "Research",
    cover: research,
    body: [
      "Ten years ago, a child presenting with early-onset seizures might wait years for a diagnosis. Today, a saliva sample and a four-week turnaround can identify a causal mutation in roughly forty percent of cases.",
      "The implications go beyond classification. For a growing number of syndromes — Dravet, KCNQ2, SCN2A — the underlying genetics determine which medications will work and which will make seizures worse. A diagnosis is not academic. It is the difference between months of suffering and a manageable life.",
    ],
  },
  {
    slug: "stigma-and-the-workplace",
    title: "Stigma and the workplace",
    dek: "Why two-thirds of adults with epilepsy never disclose their diagnosis to an employer — and what that costs them.",
    author: "Jordan Reyes",
    date: "February 12, 2025",
    readTime: "7 min read",
    category: "Society",
    cover: volunteer,
    body: [
      "The numbers are stark. In a 2023 survey of working adults with controlled epilepsy, sixty-eight percent said they had never disclosed their diagnosis at work. Of those who had, nearly a third reported a measurable change in how they were treated afterward.",
      "The math, for many, is simple. The risk of disclosure is concrete. The benefit is theoretical.",
    ],
  },
];

export const events = [
  { src: walk, title: "", caption: "", span: "tall" },
  { src: gala, title: "", caption: "", span: "wide" },
  { src: sportEvent, title: "", caption: "", span: "default" },
  { src: speech1, title: "", caption: "", span: "default" },
  { src: event1, title: "", caption: "", span: "default" },
  { src: school, title: "", caption: "", span: "default" },
  { src: event3, title: "", caption: "", span: "wide" },
  { src: volunteer, title: "", caption: "", span: "default" },
  { src: speech2, title: "", caption: "", span: "default" },
  { src: event4, title: "", caption: "", span: "tall" },
  { src: research, title: "", caption: "", span: "wide" },
  { src: event5, title: "", caption: "", span: "default" },
  { src: speech3, title: "", caption: "", span: "default" },
  { src: event6, title: "", caption: "", span: "default" },
  { src: landmark, title: "", caption: "", span: "tall" },
  { src: event7, title: "", caption: "", span: "wide" },
  { src: event8, title: "", caption: "", span: "default" },
  { src: event2, title: "", caption: "", span: "default" },
  { src: galleryBkWalk, title: "", caption: "", span: "wide" },
  { src: gallerySchoolOutreach1, title: "", caption: "", span: "default" },
  { src: gallerySchoolOutreach2, title: "", caption: "", span: "tall" },
  { src: galleryConferencePanel, title: "", caption: "", span: "wide" },
  { src: galleryConferenceMeeting, title: "", caption: "", span: "default" },
] as const;

export const facts = [
  { stat: "50M", label: "People living with epilepsy worldwide" },
  { stat: "42+", label: "People living with epilepsy in Rwanda" },
  { stat: "25M", label: "People living with epilepsy in Africa" },
  { stat: "1 in 26", label: "Will develop epilepsy in their lifetime" },
];
