import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import {
  LayoutDashboard,
  FileText,
  File,
  Image as ImageIcon,
  Mail,
  LogOut,
  Menu,
  X,
  Users,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [{ title: "Admin — ILAE YOUTH NURSE RWANDA " }, { name: "robots", content: "noindex" }],
  }),
});

type NavItem = {
  to:
    | "/admin"
    | "/admin/posts"
    | "/admin/pages"
    | "/admin/team"
    | "/admin/gallery"
    | "/admin/messages";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/posts", label: "Posts", icon: FileText },
  { to: "/admin/pages", label: "Pages", icon: File },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/messages", label: "Messages", icon: Mail },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isReady, user, isAdmin } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginRoute = location.pathname === "/admin/login";

  useEffect(() => {
    if (!isReady || isLoginRoute) return;
    if (!user) navigate({ to: "/admin/login" });
  }, [isReady, user, isLoginRoute, navigate]);

  if (isLoginRoute) {
    return <Outlet />;
  }

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-sm text-muted-foreground">
        Verifying session…
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
        <p className="eyebrow">Access denied</p>
        <h2 className="font-display text-3xl text-foreground">No admin role on this account</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Your account is signed in but doesn't have admin privileges. Sign in with an admin
          account, or create the first admin from the login page.
        </p>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/admin/login" });
          }}
          className="mt-2 bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:bg-primary"
        >
          Sign out
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const isActive = (to: string, exact?: boolean) =>
    exact
      ? location.pathname === to
      : location.pathname === to || location.pathname.startsWith(to + "/");

  const currentLabel = NAV.find((n) => isActive(n.to, n.exact))?.label ?? "Dashboard";
  const initials = (user.email ?? "AD").slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-cream text-foreground">
      {/* Sidebar — desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-paper md:flex">
        <div className="border-b border-border px-6 py-6">
          <Link to="/" className="block">
            <p className="font-display text-2xl tracking-tight text-foreground">Lumen</p>
            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Editorial console
            </p>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 border-l-2 px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? "border-primary bg-secondary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <p className="mb-2 truncate px-4 text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
            {user.email}
          </p>
          <div className="flex w-full items-center justify-between px-4 py-2.5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-paper">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <p className="font-display text-xl">ILAE YOUTH NURSE RWANDA </p>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to, item.exact);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 border-l-2 px-4 py-2.5 text-sm ${
                      active
                        ? "border-primary bg-secondary font-medium text-foreground"
                        : "border-transparent text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 border-t border-border px-6 py-4 text-sm text-muted-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-paper px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Lumen / Admin
              </p>
              <h1 className="font-display text-xl text-foreground">{currentLabel}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground sm:inline"
            >
              View site →
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
