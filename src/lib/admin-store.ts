// Local storage-backed data layer for Lumen / ILAE YOUTH NURSE RWANDA.
import { getCmsDefaults } from "@/data/cms-defaults";
import { defaultTeamMembers } from "@/data/team-members";
import { events, posts } from "@/data/content";

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

// ---------- Default Datasets ----------
export const defaultAdminPosts: AdminPost[] = posts.map((p, idx) => ({
  id: `default-post-${idx + 1}`,
  slug: p.slug,
  title: p.title,
  category: p.category,
  author: p.author,
  date: p.date,
  status: "Published",
  excerpt: p.dek,
  body: Array.isArray(p.body) ? p.body.join("\n\n") : (p.body || ""),
  cover: p.cover,
}));

export const defaultPhotos: AdminPhoto[] = events.map((e, idx) => ({
  id: `default-photo-${idx + 1}`,
  src: e.src,
  title: e.title || "",
  caption: e.caption || "",
  uploadedAt: "2026-01-01",
}));

// ---------- Storage Keys ----------
const KEYS = {
  POSTS: "lumen_posts",
  TEAM: "lumen_team",
  PHOTOS: "lumen_photos",
  MESSAGES: "lumen_messages",
  CMS_PREFIX: "lumen_cms_",
  REVISIONS_PREFIX: "lumen_cms_rev_",
};

// ---------- In-Memory Cache ----------
// Avoids repeated JSON.parse of localStorage on every navigation.
// Cache is invalidated whenever data is written.
const _memCache = new Map<string, unknown>();

function invalidateCache(key: string) {
  _memCache.delete(key);
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

function getStored<T>(key: string, fallback: T): T {
  if (_memCache.has(key)) {
    return _memCache.get(key) as T;
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    _memCache.set(key, parsed);
    return parsed;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Update in-memory cache immediately
    _memCache.set(key, value);
  } catch (e) {
    console.warn("Storage quota exceeded or error writing to localStorage", e);
    invalidateCache(key);
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------- Posts & Pages ----------
export async function listPosts(): Promise<AdminPost[]> {
  const stored = getStored<AdminPost[]>(KEYS.POSTS, []);
  
  // Merge defaults with stored custom posts
  const storedIds = new Set(stored.map((p) => p.id));
  const storedSlugs = new Set(stored.map((p) => p.slug));
  const missingDefaults = defaultAdminPosts.filter(
    (p) => !storedIds.has(p.id) && !storedSlugs.has(p.slug)
  );
  
  const all = [...stored, ...missingDefaults].filter(
    (p) =>
      p.category !== "Page" &&
      p.category !== "TeamMember" &&
      p.category !== "CMSPageContent" &&
      p.category !== "CMSPageRevision"
  );
  
  return all.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export async function listPages(): Promise<AdminPost[]> {
  const stored = getStored<AdminPost[]>(KEYS.POSTS, []);
  return stored.filter((p) => p.category === "Page");
}

export async function getPageBySlug(slug: string): Promise<AdminPost | null> {
  const pages = await listPages();
  return pages.find((p) => p.slug === slug) || null;
}

export async function listTeamMembers(): Promise<AdminPost[]> {
  const stored = getStored<AdminPost[]>(KEYS.TEAM, []);
  
  const storedIds = new Set(stored.map((p) => p.id));
  const storedSlugs = new Set(stored.map((p) => p.slug));
  const missingDefaults = (defaultTeamMembers as AdminPost[]).filter(
    (def) => !storedIds.has(def.id) && !storedSlugs.has(def.slug)
  );

  return [...stored, ...missingDefaults];
}

export async function createPost(input: Omit<AdminPost, "id" | "slug"> & { slug?: string }): Promise<AdminPost> {
  const slug = input.slug?.trim() || `${slugify(input.title)}-${Date.now().toString(36)}`;
  const newPost: AdminPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    slug,
    title: input.title,
    category: input.category,
    author: input.author || "Admin",
    date: input.date || new Date().toISOString().slice(0, 10),
    status: input.status,
    excerpt: input.excerpt,
    body: input.body ?? null,
    cover: input.cover ?? null,
  };

  if (input.category === "TeamMember") {
    const current = await listTeamMembers();
    setStored(KEYS.TEAM, [newPost, ...current.filter((c) => c.id !== newPost.id)]);
  } else {
    const current = getStored<AdminPost[]>(KEYS.POSTS, defaultAdminPosts);
    setStored(KEYS.POSTS, [newPost, ...current]);
  }

  return newPost;
}

export async function updatePost(id: string, patch: Partial<AdminPost>): Promise<void> {
  const team = getStored<AdminPost[]>(KEYS.TEAM, defaultTeamMembers as AdminPost[]);
  const isTeam = team.some((t) => t.id === id);

  if (isTeam) {
    const updated = team.map((t) => (t.id === id ? { ...t, ...patch } : t));
    setStored(KEYS.TEAM, updated);
    return;
  }

  const postsList = getStored<AdminPost[]>(KEYS.POSTS, defaultAdminPosts);
  const updated = postsList.map((p) => (p.id === id ? { ...p, ...patch } : p));
  setStored(KEYS.POSTS, updated);
}

export async function deletePost(id: string): Promise<void> {
  const team = getStored<AdminPost[]>(KEYS.TEAM, defaultTeamMembers as AdminPost[]);
  if (team.some((t) => t.id === id)) {
    setStored(KEYS.TEAM, team.filter((t) => t.id !== id));
    return;
  }

  const postsList = getStored<AdminPost[]>(KEYS.POSTS, defaultAdminPosts);
  setStored(KEYS.POSTS, postsList.filter((p) => p.id !== id));
}

export async function uploadPostCover(file: File): Promise<string> {
  return await fileToDataUrl(file);
}

// ---------- Photos ----------
export async function listPhotos(): Promise<AdminPhoto[]> {
  const stored = getStored<AdminPhoto[]>(KEYS.PHOTOS, []);
  const storedIds = new Set(stored.map((p) => p.id));
  const missingDefaults = defaultPhotos.filter((p) => !storedIds.has(p.id));
  return [...stored, ...missingDefaults];
}

export async function uploadPhoto(file: File, title: string, caption: string): Promise<AdminPhoto> {
  const dataUrl = await fileToDataUrl(file);
  const newPhoto: AdminPhoto = {
    id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    src: dataUrl,
    title: title || file.name.replace(/\.[^.]+$/, ""),
    caption: caption || "",
    uploadedAt: new Date().toISOString().slice(0, 10),
  };

  const current = await listPhotos();
  setStored(KEYS.PHOTOS, [newPhoto, ...current]);
  return newPhoto;
}

export async function deletePhoto(id: string, _storagePath?: string | null): Promise<void> {
  const current = await listPhotos();
  setStored(KEYS.PHOTOS, current.filter((p) => p.id !== id));
}

// ---------- Messages ----------
export async function listMessages(): Promise<AdminMessage[]> {
  return getStored<AdminMessage[]>(KEYS.MESSAGES, []);
}

export async function markMessageRead(id: string, read: boolean): Promise<void> {
  const messages = await listMessages();
  setStored(KEYS.MESSAGES, messages.map((m) => (m.id === id ? { ...m, read } : m)));
}

export async function deleteMessage(id: string): Promise<void> {
  const messages = await listMessages();
  setStored(KEYS.MESSAGES, messages.filter((m) => m.id !== id));
}

export async function submitMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const newMessage: AdminMessage = {
    id: `msg-${Date.now()}`,
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    receivedAt: new Date().toISOString(),
    read: false,
  };

  const current = await listMessages();
  setStored(KEYS.MESSAGES, [newMessage, ...current]);
}

// ---------- CMS Content ----------
export async function getCMSContent(slug: string): Promise<any> {
  const defaults = getCmsDefaults(slug);
  const stored = getStored<any | null>(`${KEYS.CMS_PREFIX}${slug}`, null);

  if (!stored) {
    return defaults;
  }

  return {
    ...defaults,
    ...stored,
    seo: {
      ...defaults.seo,
      ...(stored.seo || {}),
    },
    cover: stored.cover || defaults.cover,
    title: stored.title || defaults.title,
    excerpt: stored.excerpt || defaults.excerpt,
  };
}

export async function saveCMSContent(slug: string, content: any): Promise<void> {
  setStored(`${KEYS.CMS_PREFIX}${slug}`, content);
  await saveCMSRevision(slug, content);
}

export async function saveCMSRevision(slug: string, content: any): Promise<void> {
  const revs = getStored<any[]>(`${KEYS.REVISIONS_PREFIX}${slug}`, []);
  const newRev = {
    id: `rev-${Date.now()}`,
    slug: `${slug}-rev-${Date.now()}`,
    title: `Revision for ${slug} at ${new Date().toLocaleString()}`,
    date: new Date().toISOString(),
    content,
  };
  setStored(`${KEYS.REVISIONS_PREFIX}${slug}`, [newRev, ...revs].slice(0, 20));
}

export async function listCMSRevisions(slug: string): Promise<any[]> {
  return getStored<any[]>(`${KEYS.REVISIONS_PREFIX}${slug}`, []);
}

export async function restoreCMSRevision(id: string, slug: string): Promise<void> {
  const revs = await listCMSRevisions(slug);
  const found = revs.find((r) => r.id === id);
  if (!found) throw new Error("Revision not found");
  await saveCMSContent(slug, found.content);
}
