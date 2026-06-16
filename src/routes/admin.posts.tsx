import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  createPost,
  deletePost,
  listPosts,
  updatePost,
  uploadPostCover,
  type AdminPost,
} from "@/lib/admin-store";
import { Check, Pencil, Plus, Search, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/admin/posts")({
  component: AdminPosts,
});

const empty: AdminPost = {
  id: "",
  slug: "",
  title: "",
  category: "Perspective",
  author: "",
  date: new Date().toISOString().slice(0, 10),
  status: "Draft",
  excerpt: "",
  body: "",
  cover: "",
};

function AdminPosts() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<AdminPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setPosts(await listPosts());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.author.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()),
  );

  const onDeleteConfirmed = async (id: string) => {
    setDeleting(id);
    setConfirmDeleteId(null);
    try {
      await deletePost(id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const onSave = async (post: AdminPost) => {
    if (!post.title.trim() || !post.author.trim()) return;
    setSaving(true);
    setError(null);
    try {
      if (post.id) {
        await updatePost(post.id, post);
      } else {
        await createPost(post);
      }
      setEditing(null);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Journal</p>
          <h2 className="mt-3 font-display text-4xl text-foreground">Manage posts</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {posts.length} total · {posts.filter((p) => p.status === "Published").length} published
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="inline-flex items-center gap-2 bg-foreground px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:bg-primary"
        >
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      <div className="mt-8 flex items-center gap-3 border border-border bg-paper px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or category…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {error && (
        <p className="mt-4 border-l-2 border-destructive bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto border border-border bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/40 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                <td className="px-6 py-4">
                  <p className="font-display text-base text-foreground">{p.title}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{p.excerpt}</p>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{p.category}</td>
                <td className="px-6 py-4 text-muted-foreground">{p.author}</td>
                <td className="px-6 py-4 text-muted-foreground">{p.date}</td>
                <td className="px-6 py-4">
                  <span
                    className={`border px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${
                      p.status === "Published"
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end items-center gap-2">
                    {confirmDeleteId === p.id ? (
                      <>
                        <span className="text-xs text-muted-foreground mr-1">Delete?</span>
                        <button
                          onClick={() => onDeleteConfirmed(p.id)}
                          disabled={deleting === p.id}
                          className="inline-flex h-8 items-center gap-1 px-2 border border-destructive text-destructive text-xs hover:bg-destructive hover:text-white disabled:opacity-50"
                          aria-label="Confirm delete"
                        >
                          <Check className="h-3.5 w-3.5" /> Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="inline-flex h-8 items-center gap-1 px-2 border border-border text-muted-foreground text-xs hover:text-foreground"
                          aria-label="Cancel delete"
                        >
                          <X className="h-3.5 w-3.5" /> No
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditing(p)}
                          className="inline-flex h-8 w-8 items-center justify-center border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                          aria-label="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(p.id)}
                          disabled={deleting === p.id}
                          className="inline-flex h-8 w-8 items-center justify-center border border-border text-muted-foreground hover:border-destructive hover:text-destructive disabled:opacity-50"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-sm text-muted-foreground">
                  {loading ? "Loading…" : "No posts match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-foreground/40" onClick={() => setEditing(null)} />
          <div className="flex w-full max-w-xl flex-col overflow-y-auto border-l border-border bg-paper">
            <header className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {editing.id ? "Edit post" : "New post"}
                </p>
                <h3 className="mt-1 font-display text-2xl">
                  {editing.id ? editing.title || "Untitled" : "Compose"}
                </h3>
              </div>
              <button onClick={() => setEditing(null)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </header>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void onSave(editing);
              }}
              className="flex-1 space-y-5 p-6"
            >
              <Field label="Title">
                <input
                  required
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {["Perspective", "Guide", "Research", "Society", "Interview"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Status">
                  <select
                    value={editing.status}
                    onChange={(e) =>
                      setEditing({ ...editing, status: e.target.value as AdminPost["status"] })
                    }
                    className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    <option>Draft</option>
                    <option>Published</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Author">
                  <input
                    required
                    value={editing.author}
                    onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                    className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </Field>
                <Field label="Date">
                  <input
                    type="date"
                    value={editing.date}
                    onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                    className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </Field>
              </div>
              <Field label="Excerpt">
                <textarea
                  rows={3}
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </Field>
              <Field label="Cover Image">
                <div className="flex flex-col gap-3">
                  {editing.cover && (
                    <img
                      src={editing.cover}
                      alt="Cover preview"
                      className="h-32 w-full object-cover border border-border"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingCover}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingCover(true);
                      setError(null);
                      try {
                        const url = await uploadPostCover(file);
                        setEditing({ ...editing, cover: url });
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Failed to upload cover");
                      } finally {
                        setUploadingCover(false);
                      }
                    }}
                    className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary file:mr-4 file:py-1 file:px-3 file:border-0 file:text-[0.65rem] file:font-semibold file:uppercase file:tracking-[0.16em] file:bg-foreground file:text-background hover:file:bg-primary file:cursor-pointer disabled:opacity-50"
                  />
                  {uploadingCover && <p className="text-xs text-muted-foreground">Uploading…</p>}
                </div>
              </Field>
              <Field label="Body">
                <textarea
                  rows={8}
                  value={editing.body ?? ""}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </Field>

              {error && (
                <p className="border-l-2 border-destructive bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-foreground px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:bg-primary disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
