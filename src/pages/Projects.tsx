import { ArrowUpRight, Globe2 } from "lucide-react";
import { projects, siteConfig } from "../data/site";
import { Link } from "../components/Link";

export function Projects() {
  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <section className="relative overflow-hidden px-6 pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e1e3a,transparent_70%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold md:text-5xl">我的作品</h1>
          <p className="mt-4 text-gray-400">探索我参与开发的其他项目和实践成果</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-brand-border bg-brand-card p-6 transition hover:border-brand-accent/40"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent">
                  {project.category}
                </span>
                <ArrowUpRight className="h-4 w-4 text-gray-600 transition group-hover:text-brand-accent" />
              </div>
              <h2 className="mt-5 text-xl font-semibold group-hover:text-brand-accent">
                {project.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {project.description}
              </p>
              {project.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="bg-brand-border/40 px-2.5 py-1 text-xs text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-brand-border px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <Globe2 className="mx-auto h-7 w-7 text-brand-accent" />
          <h2 className="mt-4 text-2xl font-bold">还有其他精彩项目</h2>
          <p className="mt-3 text-gray-400">
            这里只展示了部分作品，更多项目正在持续更新中，欢迎持续关注。
          </p>
          <Link
            to="/contact"
            className="mt-7 inline-flex items-center gap-2 bg-brand-accent px-5 py-3 font-medium transition hover:bg-brand-accent-hover"
          >
            浏览学习资源
          </Link>
        </div>
      </section>

      <footer className="border-t border-brand-border px-6 py-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 text-sm text-gray-500">
          <span>{siteConfig.name} · {siteConfig.title}</span>
          <span className="flex items-center gap-2"><Globe2 className="h-4 w-4" />我的作品</span>
        </div>
      </footer>
    </div>
  );
}
