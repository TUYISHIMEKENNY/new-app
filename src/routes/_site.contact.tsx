import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { submitMessage } from "@/lib/admin-store";

export const Route = createFileRoute("/_site/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Lumen" },
      {
        name: "description",
        content:
          "Get in touch with the Lumen Epilepsy Initiative — questions, partnerships, or press inquiries.",
      },
    ],
  }),
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await submitMessage(form);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-6 font-display text-5xl text-foreground md:text-7xl">Write to us.</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Questions, partnership inquiries, press, or just a note — we read everything ourselves.
          </p>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-20 md:px-10 lg:grid-cols-12">
        <aside className="space-y-10 lg:col-span-4">
          <div>
            <p className="eyebrow">Email</p>
            <a
              href="mailto:hello@lumen.org"
              className="mt-3 flex items-center gap-3 font-display text-2xl text-foreground hover:text-primary"
            >
              <Mail className="h-5 w-5" />
              yesilaerwanda@gmail.com.org
            </a>
          </div>
          <div>
            <p className="eyebrow">Phone</p>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href="tel:+447984880322"
                className="flex items-center gap-3 text-base text-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                +44 7984 880322
              </a>
              <a
                href="tel:+250785457841"
                className="flex items-center gap-3 text-base text-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                +250 785 457 841
              </a>
            </div>
          </div>
          <div>
            <p className="eyebrow">Studio</p>
            <p className="mt-3 flex items-start gap-3 text-base text-foreground">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <span>
                Rwanda
                <br />
                KIGALI
                <br />
                Ndera
              </span>
            </p>
          </div>
          <div>
            <p className="eyebrow">Hours</p>
            <p className="mt-3 text-base text-foreground">
              Monday — Friday
              <br />
              09:00 — 17:00 CET
            </p>
          </div>
        </aside>

        <form className="space-y-6 lg:col-span-8" onSubmit={onSubmit}>
          {sent ? (
            <div className="rounded-md border border-border bg-background p-10 text-center">
              <p className="eyebrow">Message received</p>
              <h3 className="mt-3 font-display text-3xl">Thank you.</h3>
              <p className="mt-3 text-muted-foreground">We'll respond within two business days.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field
                  label="Name"
                  id="name"
                  required
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                />
                <Field
                  label="Email"
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                />
              </div>
              <Field
                label="Subject"
                id="subject"
                value={form.subject}
                onChange={(v) => setForm({ ...form, subject: v })}
              />
              <div>
                <label htmlFor="message" className="eyebrow block">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={7}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-3 w-full border-0 border-b border-border bg-transparent pb-2 text-lg text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>
              {error && (
                <p className="border-l-2 border-destructive bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={busy}
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary disabled:opacity-60"
                >
                  {busy ? "Sending…" : "Send message"}
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </>
          )}
        </form>
      </section>
    </article>
  );
}

function Field({
  label,
  id,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full border-0 border-b border-border bg-transparent pb-2 text-lg text-foreground outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}
