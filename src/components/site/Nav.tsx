import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ChevronDown, Globe, MessageCircle, Mail } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const mainLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/posts", label: "Journal" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

const resourceLinks = [
  { to: "/pages/teams", label: "Teams" },
  { to: "/pages/members", label: "Members" },
  { to: "/pages/stories", label: "Stories" },
  { to: "/pages/programs-services", label: "Programs & Services" },
  { to: "/pages/conferences", label: "Conferences" },
  { to: "/pages/stripes-week", label: "Stripes Week" },
  { to: "/pages/info-forms-videos", label: "Info / Forms / Videos" },
  { to: "/pages/webinars", label: "Webinars" },
  { to: "/pages/research", label: "Research" },
  { to: "/pages/tele-health", label: "Tele-Health" },
  { to: "/pages/leaders-section", label: "Leader's Section" },
  { to: "/pages/discussion-forum", label: "Discussion Forum" },
  { to: "/pages/newsletter", label: "Newsletter" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-6 md:px-10 text-[0.7rem] sm:text-xs font-semibold tracking-wide">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 bg-primary-foreground/10 px-3 py-1 rounded-full">
            <Globe className="h-3.5 w-3.5" />
            <span>47 members in 31 African countries</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <a href="https://wa.me/250784115806" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>+250784115806 <span className="opacity-75 font-normal ml-1">Join our WhatsApp Hub</span></span>
            </a>
            <a href="mailto:epilepsyallianceafrica@gmail.com" className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors">
              <Mail className="h-3.5 w-3.5" />
              <span>epilepsyallianceafrica@gmail.com <span className="opacity-75 font-normal ml-1">Send us an Email</span></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex py-3 max-w-7xl items-center justify-between px-6 md:px-10">
        <Link to="/" className="flex items-center gap-3" aria-label="ILAE Youth Nurse Rwanda home">
          <img
            src={logo}
            alt="ILAE Youth Nurse Rwanda logo"
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-primary/10 shadow-sm"
          />
          <span className="text-xl sm:text-2xl font-black tracking-tight font-display hidden sm:block">
            EPILEPSY ALLIANCE AFRICA
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {mainLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-primary outline-none">
              Resources <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md border-border">
              {resourceLinks.map((r) => (
                <DropdownMenuItem key={r.to} asChild className="cursor-pointer hover:bg-muted focus:bg-muted">
                  <Link to={r.to} className="w-full">
                    {r.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <Link
            to="/donate"
            className="hidden items-center rounded-full bg-foreground px-5 py-2 text-xs font-semibold uppercase tracking-wider text-background transition-colors hover:bg-primary md:inline-flex"
          >
            Donate
          </Link>
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex flex-col px-6 py-4">
            {mainLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 text-sm text-foreground/80"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="py-3 text-sm font-semibold text-foreground border-b border-border">
              Resources
            </div>
            <div className="pl-4 border-b border-border pb-2">
              {resourceLinks.map((r) => (
                <Link
                  key={r.to}
                  to={r.to}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm text-foreground/70"
                  activeProps={{ className: "text-primary" }}
                >
                  {r.label}
                </Link>
              ))}
            </div>
            <Link
              to="/donate"
              onClick={() => setOpen(false)}
              className="py-3 text-sm text-foreground/80 font-semibold"
            >
              Donate
            </Link>
            <div className="pt-6 border-t border-border mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
