import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-secondary focus:outline-none"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 transition-all dark:hidden" />
      <Moon className="hidden h-4 w-4 transition-all dark:block" />
    </button>
  );
}
