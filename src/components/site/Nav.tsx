import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide if scrolling down past 150px, show if scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-sm transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-6 md:px-10 text-[0.7rem] sm:text-xs font-semibold tracking-wide">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 bg-primary-foreground/10 px-3 py-1 rounded-full">
            <Globe className="h-3.5 w-3.5" />
            <span>47 members in 31 African countries</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <a href="https://wa.me/254705001510" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors">
              <MessageCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-none">+254705001510 <span className="opacity-75 font-normal ml-1 hidden lg:inline">Join our WhatsApp Hub</span></span>
            </a>
            <a href="mailto:epilepsyallianceafrica@gmail.com" className="flex items-center gap-2 hover:text-primary-foreground/80 transition-colors">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-none">epilepsyallianceafrica@gmail.com <span className="opacity-75 font-normal ml-1 hidden lg:inline">Send us an Email</span></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto flex py-3 max-w-7xl items-center justify-between px-6 md:px-10">
        <Link to="/" className="flex items-center gap-3" aria-label="ILAE Youth Nurse Rwanda home">
          <img
            src={logo}
            alt="Epilepsy Alliance Africa logo"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-primary/10 shadow-sm shrink-0"
          />
          <span className="text-base md:text-lg font-black tracking-tight font-display hidden sm:block whitespace-nowrap">
            EPILEPSY ALLIANCE AFRICA
          </span>
        </Link>

        <nav className="hidden items-center gap-4 lg:gap-6 xl:gap-8 md:flex">
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
