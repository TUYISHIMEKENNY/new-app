import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  listMessages,
  listPhotos,
  listPosts,
  listPages,
  type AdminMessage,
  type AdminPhoto,
  type AdminPost,
} from "@/lib/admin-store";
import { FileText, File, Image as ImageIcon, Mail, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [pages, setPages] = useState<AdminPost[]>([]);
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [p, pg, ph, m] = await Promise.all([
          listPosts(),
          listPages(),
          listPhotos(),
          listMessages(),
        ]);
        if (!active) return;
        setPosts(p);
        setPages(pg);
        setPhotos(ph);
        setMessages(m);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const unread = messages.filter((m) => !m.read).length;
  const publishedPosts = posts.filter((p) => p.status === "Published").length;
  const draftsPosts = posts.length - publishedPosts;
  const publishedPages = pages.filter((p) => p.status === "Published").length;
  const draftsPages = pages.length - publishedPages;

  const stats = [
    {
      label: "Total posts",
      value: posts.length,
      sub: `${publishedPosts} published · ${draftsPosts} draft`,
      icon: FileText,
    },
    {
      label: "Total pages",
      value: pages.length,
      sub: `${publishedPages} published · ${draftsPages} draft`,
      icon: File,
    },
    { label: "Messages", value: messages.length, sub: `${unread} unread`, icon: Mail },
    { label: "Total photos", value: photos.length, sub: "In gallery", icon: ImageIcon },
  ];

  const recentPosts = [...posts].slice(0, 4);
  const recentMessages = [...messages].slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      <div className="mb-8">
        <p className="eyebrow">Overview</p>
        <h2 className="mt-3 font-display text-4xl text-foreground">Good morning, editor.</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {loading
            ? "Loading…"
            : "A snapshot of the journal, the gallery, and reader correspondence."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-paper p-6">
              <div className="flex items-start justify-between">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {s.label}
                </p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-4 font-display text-4xl text-foreground">{s.value}</p>
              <p className="mt-2 text-xs text-muted-foreground">{s.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="border border-border bg-paper">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="font-display text-lg">Recent posts</h3>
            <Link
              to="/admin/posts"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary hover:underline"
            >
              Manage →
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {recentPosts.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="truncate font-display text-base text-foreground">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.author} · {p.date}
                  </p>
                </div>
                <span
                  className={`shrink-0 border px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${
                    p.status === "Published"
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {p.status}
                </span>
              </li>
            ))}
            {recentPosts.length === 0 && !loading && (
              <li className="px-6 py-10 text-center text-sm text-muted-foreground">
                No posts yet — create one in <strong>Posts</strong>.
              </li>
            )}
          </ul>
        </section>

        <section className="border border-border bg-paper">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="font-display text-lg">Recent pages</h3>
            <Link
              to="/admin/pages"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary hover:underline"
            >
              Manage →
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {pages.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="truncate font-display text-base text-foreground">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground truncate">{p.slug}</p>
                </div>
                <span
                  className={`shrink-0 border px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${
                    p.status === "Published"
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {p.status}
                </span>
              </li>
            ))}
            {pages.length === 0 && !loading && (
              <li className="px-6 py-10 text-center text-sm text-muted-foreground">
                No pages yet.
              </li>
            )}
          </ul>
        </section>

        <section className="border border-border bg-paper lg:col-span-2">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="font-display text-lg">Latest messages</h3>
            <Link
              to="/admin/messages"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary hover:underline"
            >
              Inbox →
            </Link>
          </header>
          <ul className="divide-y divide-border">
            {recentMessages.map((m) => (
              <li key={m.id} className="flex items-start justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {!m.read && <span className="inline-block h-2 w-2 rounded-full bg-primary" />}
                    {m.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{m.subject}</p>
                </div>
                <p className="shrink-0 text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {new Date(m.receivedAt).toLocaleDateString()}
                </p>
              </li>
            ))}
            {recentMessages.length === 0 && !loading && (
              <li className="px-6 py-10 text-center text-sm text-muted-foreground">
                No messages yet.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
