import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { siteConfig } from "../data/site";
import { Link } from "./Link";

type Theme = "dark" | "light";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function Header() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-brand-border/60 bg-brand-header backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="text-base font-bold tracking-tight text-brand-accent">
          {siteConfig.name}<span className="text-white">.</span>dev
        </Link>
        <div className="flex items-center gap-5 md:gap-7">
          <nav className="flex items-center gap-5 text-sm md:gap-7">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} to={item.href} className="text-gray-400 transition hover:text-brand-accent">
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
            title={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-brand-border text-gray-400 transition hover:border-brand-accent/60 hover:text-brand-accent"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
