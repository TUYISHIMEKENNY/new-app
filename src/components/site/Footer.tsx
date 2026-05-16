import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
                <span className="h-2 w-2 rounded-full bg-primary-foreground" />
              </span>
              <span className="font-display text-xl">ILAE YOUTH NURSE RWANDA </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              An independent initiative working to change the conversation around epilepsy through
              research, education, and community.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow">Explore</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link to="/posts" className="hover:text-primary">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-primary">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow">Crisis & Support</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              If you or someone you know is experiencing a medical emergency, please call your local
              emergency number immediately.
            </p>
            <p className="mt-4 text-sm">
              <a
                href="mailto:hello@lumen.org"
                className="underline underline-offset-4 hover:text-primary"
              >
                YOUNG EPILEPSY RWANDA
              </a>
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
          <div className="flex flex-col gap-2 md:flex-row md:gap-6">
            <p>© {new Date().getFullYear()} ILAE YOUTH NURSE RWANDA . All rights reserved.</p>
          </div>
          <p>Purple Day · Every March 26th</p>
        </div>
      </div>
    </footer>
  );
}
