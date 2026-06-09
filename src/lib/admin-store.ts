// Supabase-backed admin data layer for Lumen.
// Replaces the old localStorage demo store.

import { supabase } from "@/integrations/supabase/client";
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

// ---------- LocalStorage Fallback Helpers ----------
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
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .not("category", "in", '("Page","TeamMember")')
      .order("date", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      category: p.category,
      author: p.author,
      date: p.date,
      status: p.status as "Draft" | "Published",
      excerpt: p.excerpt ?? "",
      body: p.body,
      cover: p.cover,
    }));
  } catch (err) {
    console.warn("Supabase connection failed. Falling back to local storage posts.", err);
    return getLocalPosts().filter((p) => p.category !== "Page" && p.category !== "TeamMember");
  }
}

export async function listPages(): Promise<AdminPost[]> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("category", "Page")
      .order("date", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      category: p.category,
      author: p.author,
      date: p.date,
      status: p.status as "Draft" | "Published",
      excerpt: p.excerpt ?? "",
      body: p.body,
      cover: p.cover,
    }));
  } catch (err) {
    console.warn("Supabase connection failed. Falling back to local storage pages.", err);
    return getLocalPosts().filter((p) => p.category === "Page");
  }
}

export async function getPageBySlug(slug: string): Promise<AdminPost | null> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("category", "Page")
      .eq("slug", slug)
      .maybeSingle();
    if (error) {
      throw error;
    }
    if (!data) return null;
    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      category: data.category,
      author: data.author,
      date: data.date,
      status: data.status as "Draft" | "Published",
      excerpt: data.excerpt ?? "",
      body: data.body,
      cover: data.cover,
    };
  } catch (err) {
    console.warn(`Supabase connection failed. Falling back to local storage page: ${slug}`, err);
    const post = getLocalPosts().find((p) => p.category === "Page" && p.slug === slug);
    return post || null;
  }
}

export async function listTeamMembers(): Promise<AdminPost[]> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("category", "TeamMember")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      category: p.category,
      author: p.author,
      date: p.date,
      status: p.status as "Draft" | "Published",
      excerpt: p.excerpt ?? "",
      body: p.body,
      cover: p.cover,
    }));
  } catch (err) {
    console.warn("Supabase connection failed. Falling back to local storage team members.", err);
    return getLocalPosts().filter((p) => p.category === "TeamMember");
  }
}

export async function createPost(input: Omit<AdminPost, "id" | "slug"> & { slug?: string }) {
  const slug = input.slug?.trim() || `${slugify(input.title)}-${Date.now().toString(36)}`;
  try {
    const { data, error } = await supabase
      .from("posts")
      .insert({
        slug,
        title: input.title,
        category: input.category,
        author: input.author,
        date: input.date,
        status: input.status,
        excerpt: input.excerpt,
        body: input.body ?? null,
        cover: input.cover ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn("Supabase connection failed. Creating post in local storage instead.", err);
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
}

export async function updatePost(id: string, patch: Partial<AdminPost>) {
  try {
    const { error } = await supabase
      .from("posts")
      .update({
        slug: patch.slug,
        title: patch.title,
        category: patch.category,
        author: patch.author,
        date: patch.date,
        status: patch.status,
        excerpt: patch.excerpt,
        body: patch.body,
        cover: patch.cover,
      })
      .eq("id", id);
    if (error) throw error;
  } catch (err) {
    console.warn("Supabase connection failed. Updating post in local storage instead.", err);
    const posts = getLocalPosts();
    const idx = posts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      posts[idx] = { ...posts[idx], ...patch };
      saveLocalPosts(posts);
    }
  }
}

export async function deletePost(id: string) {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
  } catch (err) {
    console.warn("Supabase connection failed. Deleting post from local storage instead.", err);
    const posts = getLocalPosts();
    const updated = posts.filter((p) => p.id !== id);
    saveLocalPosts(updated);
  }
}

export async function uploadPostCover(file: File): Promise<string> {
  try {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (upErr) throw upErr;
    const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
    return pub.publicUrl;
  } catch (err) {
    console.warn("Supabase connection failed. Generating local object URL for upload.", err);
    return URL.createObjectURL(file);
  }
}

// ---------- Photos ----------
export async function listPhotos(): Promise<AdminPhoto[]> {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((p) => ({
      id: p.id,
      src: p.src,
      title: p.title,
      caption: p.caption,
      storage_path: p.storage_path,
      uploadedAt: p.created_at.slice(0, 10),
    }));
  } catch (err) {
    console.warn("Supabase connection failed. Falling back to local storage photos.", err);
    return getLocalPhotos();
  }
}

export async function uploadPhoto(file: File, title: string, caption: string) {
  try {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (upErr) throw upErr;
    const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
    const { data, error } = await supabase
      .from("photos")
      .insert({
        src: pub.publicUrl,
        title: title || file.name.replace(/\.[^.]+$/, ""),
        caption,
        storage_path: path,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn("Supabase connection failed. Saving photo to local storage instead.", err);
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
}

export async function deletePhoto(id: string, storagePath?: string | null) {
  try {
    if (storagePath && !storagePath.startsWith("local-path-")) {
      await supabase.storage.from("gallery").remove([storagePath]);
    }
    const { error } = await supabase.from("photos").delete().eq("id", id);
    if (error) throw error;
  } catch (err) {
    console.warn("Supabase connection failed. Deleting photo from local storage instead.", err);
    const photos = getLocalPhotos();
    const updated = photos.filter((p) => p.id !== id);
    saveLocalPhotos(updated);
  }
}

// ---------- Messages ----------
export async function listMessages(): Promise<AdminMessage[]> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      read: m.read,
      receivedAt: m.created_at,
    }));
  } catch (err) {
    console.warn("Supabase connection failed. Falling back to local storage messages.", err);
    return getLocalMessages();
  }
}

export async function markMessageRead(id: string, read: boolean) {
  try {
    const { error } = await supabase.from("messages").update({ read }).eq("id", id);
    if (error) throw error;
  } catch (err) {
    console.warn("Supabase connection failed. Marking message as read in local storage instead.", err);
    const messages = getLocalMessages();
    const idx = messages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      messages[idx].read = read;
      saveLocalMessages(messages);
    }
  }
}

export async function deleteMessage(id: string) {
  try {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) throw error;
  } catch (err) {
    console.warn("Supabase connection failed. Deleting message from local storage instead.", err);
    const messages = getLocalMessages();
    const updated = messages.filter((m) => m.id !== id);
    saveLocalMessages(updated);
  }
}

// Public — anyone can submit
export async function submitMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const { error } = await supabase.from("messages").insert(input);
    if (error) throw error;
  } catch (err) {
    console.warn("Supabase connection failed. Submitting message to local storage instead.", err);
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
}
