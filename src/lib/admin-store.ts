// Supabase-backed admin data layer for Lumen.
import { supabase } from "@/integrations/supabase";

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

async function uploadFileToStorage(file: File, bucket: string = "gallery"): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

// ---------- Posts ----------
export async function listPosts(): Promise<AdminPost[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .neq("category", "Page")
    .neq("category", "TeamMember")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error listing posts from Supabase:", error);
    return [];
  }
  return (data || []) as AdminPost[];
}

export async function listPages(): Promise<AdminPost[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", "Page")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error listing pages from Supabase:", error);
    return [];
  }
  return (data || []) as AdminPost[];
}

export async function getPageBySlug(slug: string): Promise<AdminPost | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", "Page")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error getting page by slug:", error);
    return null;
  }
  return data as AdminPost | null;
}

export async function listTeamMembers(): Promise<AdminPost[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", "TeamMember")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error listing team members:", error);
    return [];
  }
  return (data || []) as AdminPost[];
}

export async function createPost(input: Omit<AdminPost, "id" | "slug"> & { slug?: string }) {
  const slug = input.slug?.trim() || `${slugify(input.title)}-${Date.now().toString(36)}`;
  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        slug,
        title: input.title,
        category: input.category,
        author: input.author,
        date: input.date,
        status: input.status,
        excerpt: input.excerpt,
        body: input.body ?? null,
        cover: input.cover ?? null,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating post in Supabase:", error);
    throw error;
  }
  return data as AdminPost;
}

export async function updatePost(id: string, patch: Partial<AdminPost>) {
  const { error } = await supabase
    .from("posts")
    .update(patch)
    .eq("id", id);

  if (error) {
    console.error("Error updating post in Supabase:", error);
    throw error;
  }
}

export async function deletePost(id: string) {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting post from Supabase:", error);
    throw error;
  }
}

export async function uploadPostCover(file: File): Promise<string> {
  try {
    return await uploadFileToStorage(file);
  } catch (error) {
    console.error("Error uploading post cover to Supabase:", error);
    return URL.createObjectURL(file);
  }
}

// ---------- Photos ----------
export async function listPhotos(): Promise<AdminPhoto[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("id, src, title, caption, storage_path, uploaded_at")
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("Error listing photos from Supabase:", error);
    return [];
  }

  return (data || []).map((p) => ({
    id: p.id,
    src: p.src,
    title: p.title,
    caption: p.caption || "",
    storage_path: p.storage_path,
    uploadedAt: p.uploaded_at ? new Date(p.uploaded_at).toISOString().slice(0, 10) : "",
  }));
}

export async function uploadPhoto(file: File, title: string, caption: string) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `gallery/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading file to storage:", uploadError);
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from("gallery")
    .getPublicUrl(filePath);

  const src = publicUrlData.publicUrl;

  const { data, error: dbError } = await supabase
    .from("photos")
    .insert([
      {
        src,
        title: title || file.name.replace(/\.[^.]+$/, ""),
        caption,
        storage_path: filePath,
      }
    ])
    .select()
    .single();

  if (dbError) {
    console.error("Error inserting photo record in Supabase:", dbError);
    throw dbError;
  }

  return {
    id: data.id,
    src: data.src,
    title: data.title,
    caption: data.caption || "",
    storage_path: data.storage_path,
    uploadedAt: data.uploaded_at ? new Date(data.uploaded_at).toISOString().slice(0, 10) : "",
  };
}

export async function deletePhoto(id: string, storagePath?: string | null) {
  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from("gallery")
      .remove([storagePath]);
    if (storageError) {
      console.warn("Could not delete file from storage bucket:", storageError);
    }
  }

  const { error: dbError } = await supabase
    .from("photos")
    .delete()
    .eq("id", id);

  if (dbError) {
    console.error("Error deleting photo record from Supabase:", dbError);
    throw dbError;
  }
}

// ---------- Messages ----------
export async function listMessages(): Promise<AdminMessage[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("id, name, email, subject, message, read, received_at")
    .order("received_at", { ascending: false });

  if (error) {
    console.error("Error listing messages from Supabase:", error);
    return [];
  }

  return (data || []).map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject || "",
    message: m.message,
    read: !!m.read,
    receivedAt: m.received_at,
  }));
}

export async function markMessageRead(id: string, read: boolean) {
  const { error } = await supabase
    .from("messages")
    .update({ read })
    .eq("id", id);

  if (error) {
    console.error("Error marking message read in Supabase:", error);
    throw error;
  }
}

export async function deleteMessage(id: string) {
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting message from Supabase:", error);
    throw error;
  }
}

// Public — anyone can submit
export async function submitMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { error } = await supabase
    .from("messages")
    .insert([
      {
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        read: false,
      }
    ]);

  if (error) {
    console.error("Error submitting message to Supabase:", error);
    throw error;
  }
}
