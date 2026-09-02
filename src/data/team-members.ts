import member1 from "@/assets/team/member1.jpg";
import member2 from "@/assets/team/member2.jpg";
import member3 from "@/assets/team/member3.jpg";
import member4 from "@/assets/team/member4.jpg";
import member5 from "@/assets/team/member5.jpg";
import member6 from "@/assets/team/member6.jpg";
import member7 from "@/assets/team/member7.jpg";

export type TeamMember = {
  id: string;
  slug: string;
  title: string;
  category: "TeamMember";
  author: string;
  date: string;
  status: "Published";
  excerpt: string; // Role / Position
  body?: string | null;
  cover?: string | null;
};

export const defaultTeamMembers: TeamMember[] = [
  {
    id: "team-kanyabutembo-chantal",
    slug: "kanyabutembo-chantal",
    title: "Kanyabutembo Chantal",
    excerpt: "Vice President & Advocate",
    category: "TeamMember",
    author: "System",
    date: "2026-01-01",
    status: "Published",
    cover: member1,
    body: null,
  },
  {
    id: "team-dr-raymond-clevor",
    slug: "dr-raymond-clevor",
    title: "Dr. Raymond Clevor",
    excerpt: "Neurologist",
    category: "TeamMember",
    author: "System",
    date: "2026-01-02",
    status: "Published",
    cover: member2,
    body: null,
  },
  {
    id: "team-theogene-ndikumana",
    slug: "theogene-ndikumana",
    title: "Theogene Ndikumana",
    excerpt: "Advisor",
    category: "TeamMember",
    author: "System",
    date: "2026-01-03",
    status: "Published",
    cover: member3,
    body: null,
  },
  {
    id: "team-habimana-jean-leon",
    slug: "habimana-jean-leon",
    title: "Habimana Jean Leon",
    excerpt: "Projects Coordinator",
    category: "TeamMember",
    author: "System",
    date: "2026-01-04",
    status: "Published",
    cover: member4,
    body: null,
  },
  {
    id: "team-bajeneza-stiven",
    slug: "bajeneza-stiven",
    title: "Bajeneza Stiven",
    excerpt: "Treasurer",
    category: "TeamMember",
    author: "System",
    date: "2026-01-05",
    status: "Published",
    cover: member5,
    body: null,
  },
  {
    id: "team-SERVILIEN-NDERERIMANA",
    slug: "team-SERVILIEN-NDERERIMANA",
    title: "SERVILIEN NDERERIMANA",
    excerpt: "PRESIDENTS",
    category: "TeamMember",
    author: "System",
    date: "2026-01-06",
    status: "Published",
    cover: member6,
    body: null,
  },
  {
    id: "team-Umutoniwase-Anisie",
    slug: "team-Umutoniwase-Anisie",
    title: "Umutoniwase Anisie",
    excerpt: "Communication and public relation officer",
    category: "TeamMember",
    author: "System",
    date: "2026-01-07",
    status: "Published",
    cover: member7,
    body: null,
  },
];
