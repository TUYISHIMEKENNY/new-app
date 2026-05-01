import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  createPost,
  deletePost,
  listPages,
  updatePost,
  uploadPostCover,
  type AdminPost,
} from "@/lib/admin-store";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Pencil, Plus, Search, Trash2, X, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/pages")({
  component: AdminPages,
});

const empty: AdminPost = {
  id: "",
  slug: "",
  title: "",
  category: "Page",
  author: "Admin",
  date: new Date().toISOString().slice(0, 10),
  status: "Published",
  excerpt: "",
  body: "",
  cover: "",
};

function AdminPages() {
  const [pages, setPages] = useState<AdminPost[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<AdminPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setPages(await listPages());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load pages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const filtered = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(query.toLowerCase()),
  );

  const onDelete = async (id: string) => {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    try {
      await deletePost(id);
      await refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const onSave = async (post: AdminPost) => {
    if (!post.title.trim()) return;
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

  const seedPages = async () => {
    if (
      !confirm(
        "This will create all requested pages with placeholder content if they do not exist yet. Continue?",
      )
    )
      return;
    setLoading(true);
    try {
      const defaultPages = [
        { title: "Teams", slug: "teams", excerpt: "Meet the team behind our work." },
        { title: "Members", slug: "members", excerpt: "Information about our community members." },
        {
          title: "Stories",
          slug: "stories",
          excerpt: "Read inspiring stories from the community.",
        },
        {
          title: "Programs & Services",
          slug: "programs-services",
          excerpt: "Explore the programs and services we offer.",
        },
        {
          title: "Conferences",
          slug: "conferences",
          excerpt: "Details on upcoming and past conferences.",
        },
        {
          title: "Stripes Week",
          slug: "stripes-week",
          excerpt: "Information about Stripes Week events.",
        },
        {
          title: "Info / Forms / Videos",
          slug: "info-forms-videos",
          excerpt: "Helpful resources, forms, and video materials.",
        },
        {
          title: "Webinars",
          slug: "webinars",
          excerpt: "Watch past webinars and register for upcoming ones.",
        },
        {
          title: "Research",
          slug: "research",
          excerpt: "Discover our latest research initiatives and findings.",
        },
        {
          title: "Tele-Health",
          slug: "tele-health",
          excerpt: "Access our telehealth services and information.",
        },
        {
          title: "Leader's Section",
          slug: "leaders-section",
          excerpt: "Resources and updates for community leaders.",
        },
        {
          title: "Discussion Forum",
          slug: "discussion-forum",
          excerpt: "Join the conversation in our community forum.",
        },
        {
          title: "Newsletter",
          slug: "newsletter",
          excerpt: "Subscribe and read our latest newsletters.",
        },
      ];

      for (const p of defaultPages) {
        // Check if a page with this slug or title already exists
        if (!pages.some((existing) => existing.slug === p.slug || existing.title === p.title)) {
          await createPost({
            slug: p.slug,
            title: p.title,
            category: "Page",
            author: "System",
            date: new Date().toISOString().slice(0, 10),
            status: "Published",
            excerpt: p.excerpt,
            body: `<p>Welcome to the <strong>${p.title}</strong> page. This is placeholder content.</p>\n<p>As an admin, you can edit this page from the dashboard to add the actual content, images, and resources you want to share with the community.</p>`,
          });
        }
      }
      await refresh();
      alert("Pages seeded successfully!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to seed pages");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Content</p>
          <h2 className="mt-3 font-display text-4xl text-foreground">Manage pages</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {pages.length} total · {pages.filter((p) => p.status === "Published").length} published
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={seedPages}
            disabled={loading}
            className="inline-flex items-center gap-2 border border-border bg-paper px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground hover:bg-secondary disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" /> Seed Default Pages
          </button>
          <button
            onClick={() => setEditing({ ...empty })}
            className="inline-flex items-center gap-2 bg-foreground px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:bg-primary"
          >
            <Plus className="h-4 w-4" /> New page
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 border border-border bg-paper px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or excerpt…"
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
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditing(p)}
                      className="inline-flex h-8 w-8 items-center justify-center border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="inline-flex h-8 w-8 items-center justify-center border border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-16 text-center text-sm text-muted-foreground">
                  {loading ? "Loading…" : "No pages match your search."}
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
                  {editing.id ? "Edit page" : "New page"}
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
              <Field label="URL Slug (e.g., 'teams' or 'programs-services')">
                <input
                  required
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary font-mono text-muted-foreground"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
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
                <RichTextEditor
                  value={editing.body ?? ""}
                  onChange={(v) => setEditing({ ...editing, body: v })}
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
                  {saving ? "Saving…" : "Save page"}
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
