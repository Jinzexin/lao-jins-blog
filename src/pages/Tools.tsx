import { Wrench } from "lucide-react";
import { toolGroups } from "../data/toolCatalog";
import { Link } from "../components/Link";
import { SiteFooter } from "../components/SiteFooter";

export function Tools() {
  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <section className="relative overflow-hidden px-6 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--c-glow),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">在线工具箱</h1>
          <p className="mt-4 max-w-[52ch] text-gray-400">常用在线工具，开箱即用，无需登录。也可以按 <kbd className="rounded border border-brand-border px-1.5 py-0.5 text-xs">Ctrl + K</kbd> 搜索。</p>
        </div>
      </section>

      {toolGroups.map((group) => (
        <section key={group.title} className="px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-xl font-semibold tracking-tight">{group.title}</h2>
              <span className="h-px flex-1 bg-brand-border" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.href}
                  className="group border border-brand-border bg-brand-card p-6 transition hover:border-brand-accent/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent">{tool.badge}</span>
                    <Wrench className="h-4 w-4 text-gray-600 transition group-hover:text-brand-accent" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight group-hover:text-brand-accent">{tool.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{tool.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <span key={tag} className="border border-brand-border px-2.5 py-1 text-xs text-gray-400">{tag}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
      <SiteFooter />
    </div>
  );
}
