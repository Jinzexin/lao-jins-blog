import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { siteConfig } from "../data/site";
import { Link } from "./Link";
import { GlobalSearch } from "./GlobalSearch";

type Theme = "dark" | "light";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function Header() {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-brand-border/60 bg-brand-header backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0 text-base font-bold tracking-tight text-brand-accent">
          {siteConfig.name}<span className="text-white">.</span>dev
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-6 text-sm lg:flex">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} to={item.href} className="whitespace-nowrap text-gray-400 transition hover:text-brand-accent">
                {item.label}
              </Link>
            ))}
          </nav>

          <GlobalSearch />

          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
            title={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-brand-border text-gray-400 transition hover:border-brand-accent/60 hover:text-brand-accent"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-brand-border text-gray-400 transition hover:border-brand-accent/60 hover:text-brand-accent lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-brand-border bg-brand-bg/98 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-3 sm:px-6" aria-label="移动端导航">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block border-b border-brand-border/40 py-3 text-sm text-gray-300 transition last:border-b-0 hover:text-brand-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
