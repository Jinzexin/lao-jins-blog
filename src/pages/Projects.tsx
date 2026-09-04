import { ArrowUpRight, Globe2 } from "lucide-react";
import { projects, siteConfig } from "../data/site";
import { Link } from "../components/Link";

export function Projects() {
  const [featured, ...rest] = projects;

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <section className="relative overflow-hidden px-6 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--c-glow),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">我的作品</h1>
          <p className="mt-4 max-w-[52ch] text-gray-400">探索我参与开发的其他项目和实践成果</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {/* Featured project: split with image */}
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid gap-8 border border-brand-border bg-brand-card transition hover:border-brand-accent/40 md:grid-cols-2"
          >
            <img
              src={`https://picsum.photos/seed/${featured.title}-work/800/520`}
              alt={featured.title}
              loading="lazy"
              className="aspect-[16/10] h-full w-full object-cover grayscale transition group-hover:grayscale-0"
            />
            <div className="flex flex-col justify-center p-8 md:p-10">
              <div className="flex items-center justify-between">
                <span className="bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent">{featured.category}</span>
                <ArrowUpRight className="h-5 w-5 text-gray-600 transition group-hover:text-brand-accent" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold tracking-tight group-hover:text-brand-accent">{featured.title}</h2>
              <p className="mt-3 max-w-[48ch] leading-relaxed text-gray-400">{featured.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {featured.tags.map((tag) => (
                  <span key={tag} className="border border-brand-border px-2.5 py-1 text-xs text-gray-400">{tag}</span>
                ))}
              </div>
            </div>
          </a>

          {/* Remaining projects: 2-col cards */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {rest.map((project) => (
              <a
                key={project.title}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-brand-border bg-brand-card p-6 transition hover:border-brand-accent/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent">{project.category}</span>
                  <ArrowUpRight className="h-4 w-4 text-gray-600 transition group-hover:text-brand-accent" />
                </div>
                <h2 className="mt-5 text-xl font-semibold tracking-tight group-hover:text-brand-accent">{project.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="border border-brand-border px-2.5 py-1 text-xs text-gray-400">{tag}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-border px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Globe2 className="mx-auto h-7 w-7 text-brand-accent" />
          <h2 className="mt-5 text-2xl font-bold tracking-tight">还有其他精彩项目</h2>
          <p className="mt-3 text-gray-400">更多项目正在持续更新中，欢迎持续关注。</p>
          <Link to="/contact" className="mt-8 inline-flex bg-brand-accent px-5 py-3 font-medium text-zinc-950 transition hover:bg-brand-accent-hover">
            浏览学习资源
          </Link>
        </div>
      </section>

      <footer className="border-t border-brand-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 text-sm text-gray-500">
          <span>{siteConfig.name} · {siteConfig.title}</span>
          <span className="flex items-center gap-2"><Globe2 className="h-4 w-4" />我的作品</span>
        </div>
      </footer>
    </div>
  );
}
