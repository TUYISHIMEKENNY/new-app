// LocalStorage-backed admin data layer for Lumen.

import { posts as defaultPosts, events as defaultEvents } from "@/data/content";

// ---------- Types ----------
export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string; // YYYY-MM-DD
  status: "Draft" | "Published";
  excerpt: string;
  body?: string | null;
  cover?: string | null;
};

export type AdminPhoto = {
  id: string;
  src: string;
  title: string;
  caption: string;
  storage_path?: string | null;
  uploadedAt: string;
};

export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt: string;
  read: boolean;
};

// ---------- Fallback Default Data ----------
const defaultAdminPosts: AdminPost[] = defaultPosts.map((p, i) => ({
  id: `default-post-${i}`,
  slug: p.slug,
  title: p.title,
  category: p.category,
  author: p.author,
  date: p.date,
  status: "Published",
  excerpt: p.dek,
  body: Array.isArray(p.body) ? p.body.join("\n\n") : p.body,
  cover: p.cover,
}));

// Add default pages
defaultAdminPosts.push({
  id: "page-webinars",
  slug: "webinars",
  title: "Webinars",
  category: "Page",
  author: "System",
  date: "2026-06-09",
  status: "Published",
  excerpt: "Join our upcoming webinars and view past recordings.",
  body: "<h2>Upcoming Webinars</h2><p>Content goes here.</p>",
  cover: null,
});

// Add default team members
const defaultTeamMembers: AdminPost[] = [
  {
    id: "team-1",
    slug: "dr-jean-baptiste-rwandar",
    title: "Dr. Jean Baptiste",
    category: "TeamMember",
    author: "System",
    date: "2026-06-09",
    status: "Published",
    excerpt: "President",
    body: "Lead neurologist and advocate for child healthcare policies.",
    cover: null,
  },
  {
    id: "team-2",
    slug: "nurse-clarisse-mugisha",
    title: "Nurse Clarisse Mugisha",
    category: "TeamMember",
    author: "System",
    date: "2026-06-09",
    status: "Published",
    excerpt: "Vice President",
    body: "Primary care nurse coordinator specializing in pediatric care and education.",
    cover: null,
  }
];
defaultAdminPosts.push(...defaultTeamMembers);

const defaultAdminPhotos: AdminPhoto[] = defaultEvents.map((evt, i) => ({
  id: `default-photo-${i}`,
  src: evt.src,
  title: evt.title,
  caption: evt.caption,
  storage_path: null,
  uploadedAt: "2026-06-09",
}));

// ---------- LocalStorage Helpers ----------
const LOCAL_POSTS_KEY = "lumen_fallback_posts";
const LOCAL_PHOTOS_KEY = "lumen_fallback_photos";
const LOCAL_MESSAGES_KEY = "lumen_fallback_messages";

function getLocalPosts(): AdminPost[] {
  if (typeof window === "undefined") return [];
  const val = localStorage.getItem(LOCAL_POSTS_KEY);
  if (!val) {
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(defaultAdminPosts));
    return defaultAdminPosts;
  }
  return JSON.parse(val);
}

function saveLocalPosts(posts: AdminPost[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  }
}

function getLocalPhotos(): AdminPhoto[] {
  if (typeof window === "undefined") return [];
  const val = localStorage.getItem(LOCAL_PHOTOS_KEY);
  if (!val) {
    localStorage.setItem(LOCAL_PHOTOS_KEY, JSON.stringify(defaultAdminPhotos));
    return defaultAdminPhotos;
  }
  return JSON.parse(val);
}

function saveLocalPhotos(photos: AdminPhoto[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_PHOTOS_KEY, JSON.stringify(photos));
  }
}

function getLocalMessages(): AdminMessage[] {
  if (typeof window === "undefined") return [];
  const val = localStorage.getItem(LOCAL_MESSAGES_KEY);
  if (!val) return [];
  return JSON.parse(val);
}

function saveLocalMessages(messages: AdminMessage[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(messages));
  }
}

// ---------- Helpers ----------
function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// ---------- Posts ----------
export async function listPosts(): Promise<AdminPost[]> {
  return getLocalPosts().filter((p) => p.category !== "Page" && p.category !== "TeamMember");
}

export async function listPages(): Promise<AdminPost[]> {
  return getLocalPosts().filter((p) => p.category === "Page");
}

export async function getPageBySlug(slug: string): Promise<AdminPost | null> {
  const post = getLocalPosts().find((p) => p.category === "Page" && p.slug === slug);
  return post || null;
}

export async function listTeamMembers(): Promise<AdminPost[]> {
  return getLocalPosts().filter((p) => p.category === "TeamMember");
}

export async function createPost(input: Omit<AdminPost, "id" | "slug"> & { slug?: string }) {
  const slug = input.slug?.trim() || `${slugify(input.title)}-${Date.now().toString(36)}`;
  const newPost: AdminPost = {
    id: `local-post-${Date.now()}`,
    slug,
    title: input.title,
    category: input.category,
    author: input.author,
    date: input.date,
    status: input.status,
    excerpt: input.excerpt,
    body: input.body ?? null,
    cover: input.cover ?? null,
  };
  const posts = getLocalPosts();
  posts.unshift(newPost);
  saveLocalPosts(posts);
  return newPost;
}

export async function updatePost(id: string, patch: Partial<AdminPost>) {
  const posts = getLocalPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx !== -1) {
    posts[idx] = { ...posts[idx], ...patch };
    saveLocalPosts(posts);
  }
}

export async function deletePost(id: string) {
  const posts = getLocalPosts();
  const updated = posts.filter((p) => p.id !== id);
  saveLocalPosts(updated);
}

export async function uploadPostCover(file: File): Promise<string> {
  return URL.createObjectURL(file);
}

// ---------- Photos ----------
export async function listPhotos(): Promise<AdminPhoto[]> {
  return getLocalPhotos();
}

export async function uploadPhoto(file: File, title: string, caption: string) {
  const localUrl = URL.createObjectURL(file);
  const newPhoto: AdminPhoto = {
    id: `local-photo-${Date.now()}`,
    src: localUrl,
    title: title || file.name.replace(/\.[^.]+$/, ""),
    caption,
    storage_path: `local-path-${Date.now()}`,
    uploadedAt: new Date().toISOString().slice(0, 10),
  };
  const photos = getLocalPhotos();
  photos.unshift(newPhoto);
  saveLocalPhotos(photos);
  return newPhoto;
}

export async function deletePhoto(id: string, storagePath?: string | null) {
  const photos = getLocalPhotos();
  const updated = photos.filter((p) => p.id !== id);
  saveLocalPhotos(updated);
}

// ---------- Messages ----------
export async function listMessages(): Promise<AdminMessage[]> {
  return getLocalMessages();
}

export async function markMessageRead(id: string, read: boolean) {
  const messages = getLocalMessages();
  const idx = messages.findIndex((m) => m.id === id);
  if (idx !== -1) {
    messages[idx].read = read;
    saveLocalMessages(messages);
  }
}

export async function deleteMessage(id: string) {
  const messages = getLocalMessages();
  const updated = messages.filter((m) => m.id !== id);
  saveLocalMessages(updated);
}

// Public — anyone can submit
export async function submitMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const newMessage: AdminMessage = {
    id: `local-message-${Date.now()}`,
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    read: false,
    receivedAt: new Date().toISOString(),
  };
  const messages = getLocalMessages();
  messages.unshift(newMessage);
  saveLocalMessages(messages);
}
