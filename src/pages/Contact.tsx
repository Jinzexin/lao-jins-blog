import { ArrowUpRight, BookOpen } from "lucide-react";
import { resources } from "../data/site";
import { Link } from "../components/Link";
import { SiteFooter } from "../components/SiteFooter";

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
          <p className="mt-3 text-gray-400">Docker 部署、Git 操作、Cloudflare Tunnel 与 AI 智能体技能文档实践记录。</p>
          <Link to="/blog" className="mt-8 inline-flex bg-brand-accent px-5 py-3 font-medium text-zinc-950 transition hover:bg-brand-accent-hover">
            查看笔记
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
