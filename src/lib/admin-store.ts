// Supabase-backed admin data layer for Lumen.
// Replaces the old localStorage demo store.

import { supabase } from "@/integrations/supabase/client";

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
}

export async function listPages(): Promise<AdminPost[]> {
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
}

export async function getPageBySlug(slug: string): Promise<AdminPost | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", "Page")
    .eq("slug", slug)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
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
}

export async function listTeamMembers(): Promise<AdminPost[]> {
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
}

export async function createPost(input: Omit<AdminPost, "id" | "slug"> & { slug?: string }) {
  const slug = input.slug?.trim() || `${slugify(input.title)}-${Date.now().toString(36)}`;
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
}

export async function updatePost(id: string, patch: Partial<AdminPost>) {
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
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadPostCover(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabase.storage.from("gallery").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
  return pub.publicUrl;
}

// ---------- Photos ----------
export async function listPhotos(): Promise<AdminPhoto[]> {
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
}

export async function uploadPhoto(file: File, title: string, caption: string) {
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
}

export async function deletePhoto(id: string, storagePath?: string | null) {
  if (storagePath) {
    await supabase.storage.from("gallery").remove([storagePath]);
  }
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Messages ----------
export async function listMessages(): Promise<AdminMessage[]> {
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
}

export async function markMessageRead(id: string, read: boolean) {
  const { error } = await supabase.from("messages").update({ read }).eq("id", id);
  if (error) throw error;
}

export async function deleteMessage(id: string) {
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw error;
}

// Public — anyone can submit
export async function submitMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { error } = await supabase.from("messages").insert(input);
  if (error) throw error;
}
