import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  deleteMessage,
  listMessages,
  markMessageRead,
  type AdminMessage,
} from "@/lib/admin-store";
import { Mail, MailOpen, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessages,
});

function AdminMessages() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const all = await listMessages();
      setMessages(all);
      setSelectedId((id) => id ?? all[0]?.id ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const select = async (id: string) => {
    setSelectedId(id);
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) {
      try {
        await markMessageRead(id, true);
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMessage(id);
      const next = messages.filter((m) => m.id !== id);
      setMessages(next);
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const selected = messages.find((m) => m.id === selectedId);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      <div className="mb-8">
        <p className="eyebrow">Inbox</p>
        <h2 className="mt-3 font-display text-4xl text-foreground">Messages</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {loading ? "Loading…" : `${messages.length} total · ${unread} unread`}
        </p>
        {error && (
          <p className="mt-3 border-l-2 border-destructive bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 overflow-hidden border border-border bg-paper lg:grid-cols-[360px_1fr]">
        <ul className="max-h-[70vh] divide-y divide-border overflow-y-auto border-b border-border lg:border-b-0 lg:border-r">
          {messages.map((m) => {
            const active = m.id === selectedId;
            return (
              <li key={m.id}>
                <button
                  onClick={() => void select(m.id)}
                  className={`block w-full border-l-2 px-5 py-4 text-left transition-colors ${
                    active
                      ? "border-primary bg-secondary"
                      : "border-transparent hover:bg-secondary/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      {!m.read && <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      <p
                        className={`truncate text-sm ${
                          m.read ? "text-foreground" : "font-semibold text-foreground"
                        }`}
                      >
                        {m.name}
                      </p>
                    </div>
                    <p className="shrink-0 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {new Date(m.receivedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="mt-1 truncate text-sm text-foreground">{m.subject}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{m.message}</p>
                </button>
              </li>
            );
          })}
          {messages.length === 0 && !loading && (
            <li className="px-6 py-16 text-center text-sm text-muted-foreground">
              No messages yet.
            </li>
          )}
        </ul>

        <article className="min-h-[60vh]">
          {selected ? (
            <>
              <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-8 py-6">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Subject
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-foreground">{selected.subject}</h3>
                  <p className="mt-3 text-sm text-foreground">
                    {selected.name}{" "}
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      &lt;{selected.email}&gt;
                    </a>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(selected.receivedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground hover:border-primary hover:text-primary"
                  >
                    <MailOpen className="h-3.5 w-3.5" /> Reply
                  </a>
                  <button
                    onClick={() => void remove(selected.id)}
                    className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </header>
              <div className="px-8 py-8">
                <p className="whitespace-pre-line text-base leading-relaxed text-foreground">
                  {selected.message}
                </p>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
              <Mail className="h-8 w-8 text-muted-foreground" />
              <p className="mt-4 font-display text-xl text-foreground">No message selected</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick a message from the list to read it.
              </p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
