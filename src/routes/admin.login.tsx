import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
  head: () => ({
    meta: [{ title: "Admin · Sign in — Lumen" }, { name: "robots", content: "noindex" }],
  }),
});

function AdminLogin() {
  const navigate = useNavigate();
  const { isReady, user, isAdmin } = useAdminAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // If already signed in as admin, jump to dashboard.
  useEffect(() => {
    if (isReady && user && isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [isReady, user, isAdmin, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        // Sign up the very first admin. If admins already exist, this account
        // will sign in but won't get the admin role automatically.
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (signUpErr) throw signUpErr;

        // Try to claim the first-admin role. Allowed only if no admins exist yet.
        if (data.user) {
          const { error: roleErr } = await supabase.rpc("claim_first_admin");
          if (roleErr) {
            // Falls back silently — user can be promoted later.
            console.warn("claim_first_admin:", roleErr.message);
          }
        }

        if (!data.session) {
          setInfo(
            "Account created. Check your email to confirm, then sign in. (Tip: disable email confirmation in Lovable Cloud → Auth for instant access.)",
          );
          setMode("signin");
        } else {
          navigate({ to: "/admin" });
        }
      } else {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInErr) throw signInErr;
        // Auth listener will pick up the session and redirect via the effect above.
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
        <div className="grid w-full grid-cols-1 overflow-hidden border border-border bg-paper md:grid-cols-2">
          <aside className="relative hidden flex-col justify-between border-r border-border bg-foreground p-10 text-background md:flex">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-background/70">
                ILAE YOUTH NURSE RWANDA 
              </p>
              <p className="mt-2 text-sm text-background/70">Editorial console</p>
            </div>
            <div>
              <h1 className="font-display text-4xl leading-tight">
                The quiet machinery <br /> behind the journal.
              </h1>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-background/70">
                Manage stories, gallery, and reader correspondence from one place. Every change is recorded.
              </p>
            </div>
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-background/50">
              Authorized personnel only
            </p>
          </aside>

          <section className="p-8 md:p-12">
            <p className="eyebrow">{mode === "signin" ? "Sign in" : "Create first admin"}</p>
            <h2 className="mt-4 font-display text-3xl text-foreground">Admin console</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Use your editorial credentials to continue."
                : "Set up the very first admin account for this workspace."}
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  placeholder="you@lumen.org"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>

              {error && (
                <p className="border-l-2 border-destructive bg-destructive/5 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}
              {info && (
                <p className="border-l-2 border-primary bg-secondary/40 px-3 py-2 text-xs text-foreground">
                  {info}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="group relative inline-flex w-full items-center justify-center bg-foreground px-6 py-3 text-sm font-medium uppercase tracking-[0.16em] text-background transition-colors hover:bg-primary disabled:opacity-60"
              >
                {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create admin"}
              </button>
            </form>

            <div className="mt-8 border-t border-border pt-6">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setInfo(null);
                  setMode(mode === "signin" ? "signup" : "signin");
                }}
                className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary hover:underline"
              >
                {mode === "signin"
                  ? "First time? Create the initial admin →"
                  : "← Back to sign in"}
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                The first account that signs up automatically gets the admin role.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
