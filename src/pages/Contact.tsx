import { ArrowUpRight, BookOpen, Globe2 } from "lucide-react";
import { resources, siteConfig } from "../data/site";
import { Link } from "../components/Link";

export function Contact() {
  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <section className="relative overflow-hidden px-6 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--c-glow),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">学习资源</h1>
          <p className="mt-4 max-w-[52ch] text-gray-400">旧项目中整理并持续使用的技术文档与学习资料</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl divide-y divide-brand-border border-y border-brand-border">
          {resources.map((resource) => (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-6 py-6 transition"
            >
              <div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 className="text-lg font-semibold transition group-hover:text-brand-accent">{resource.title}</h2>
                  <span className="font-mono text-xs text-brand-accent">{resource.category}</span>
                </div>
                <p className="mt-1.5 max-w-[64ch] text-sm leading-relaxed text-gray-500">{resource.description}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-gray-600 transition group-hover:text-brand-accent" />
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-brand-border px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <BookOpen className="mx-auto h-7 w-7 text-brand-accent" />
          <h2 className="mt-5 text-2xl font-bold tracking-tight">项目技术笔记</h2>
          <p className="mt-3 text-gray-400">Docker、Git、Node.js、PostgreSQL、Vue 3 与 Cloudflare Tunnel 的实践记录已完整迁移。</p>
          <Link to="/blog" className="mt-8 inline-flex bg-brand-accent px-5 py-3 font-medium text-zinc-950 transition hover:bg-brand-accent-hover">
            查看笔记
          </Link>
        </div>
      </section>

      <footer className="border-t border-brand-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 text-sm text-gray-500">
          <span>{siteConfig.name} · {siteConfig.title}</span>
          <span className="flex items-center gap-2"><Globe2 className="h-4 w-4" />技术资源</span>
        </div>
      </footer>
    </div>
  );
}
