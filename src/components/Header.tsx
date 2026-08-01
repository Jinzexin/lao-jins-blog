import { siteConfig } from "../data/site";
import { Link } from "./Link";

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-brand-border/50 bg-brand-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold tracking-tight text-brand-accent">{siteConfig.name}</Link>
        <nav className="flex items-center gap-5 text-sm md:gap-6">
          {siteConfig.nav.map((item) => <Link key={item.href} to={item.href} className="text-gray-400 transition hover:text-white">{item.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
