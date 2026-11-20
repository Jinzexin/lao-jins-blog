import { ArrowRight, ArrowUpRight, Clock, Terminal } from "lucide-react";
import { articles, projects, siteConfig } from "../data/site";
import { ContactLinks } from "../components/ContactLinks";
import { Link } from "../components/Link";
import { SiteFooter } from "../components/SiteFooter";

export function Home() {
  const [featured, ...rest] = articles.slice(0, 3);
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <section className="relative flex min-h-[80vh] items-center overflow-hidden px-4 pt-20 sm:px-6 md:min-h-[82vh]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,var(--c-glow),transparent_60%)]" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-12 lg:gap-16">
          <div className="md:col-span-7">
            <div className="fade-up inline-flex items-center gap-2 border border-brand-accent/30 bg-brand-accent/10 px-3 py-1.5 text-xs text-brand-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-accent" />
              </span>
              {siteConfig.currentStatus}
            </div>

            <h1 className="fade-up fade-up-1 mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              你好，我是 <span className="text-brand-accent">{siteConfig.name}</span>
            </h1>
            <p className="fade-up fade-up-2 mt-6 max-w-[56ch] text-base leading-relaxed text-gray-400 md:text-lg">
              {siteConfig.description}
            </p>

            <div className="fade-up fade-up-3 mt-8 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-brand-accent px-6 py-3 font-medium text-zinc-950 transition hover:bg-brand-accent-hover"
              >
                看作品<ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 border border-brand-border px-6 py-3 font-medium text-gray-300 transition hover:border-brand-accent/60 hover:text-white"
              >
                用工具
              </Link>
              <Link
                to="/bookmarks"
                className="inline-flex items-center gap-2 border border-brand-border px-6 py-3 font-medium text-gray-300 transition hover:border-brand-accent/60 hover:text-white"
              >
                个人导航
              </Link>
            </div>

            <ContactLinks variant="labelled" className="fade-up fade-up-3 mt-6" />
          </div>

          <HeroTerminal />
        </div>
      </section>

      <section className="border-t border-brand-border px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">作品导航</h2>
              <p className="mt-3 max-w-[64ch] text-gray-400">从截图、简介、技术栈到运行状态，直接进入你要用的项目。</p>
            </div>
            <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-brand-accent transition hover:text-brand-accent-hover">
              进入完整展示<ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredProjects.map((project) => (
              <article key={project.title} className="group flex flex-col overflow-hidden border border-brand-border bg-brand-card transition hover:border-brand-accent/40">
                <Link to={`/projects?project=${encodeURIComponent(project.title)}`} className="block overflow-hidden">
                  <img
                    src={project.screenshot}
                    alt={`${project.title} 截图`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="aspect-[16/10] w-full object-cover opacity-90 transition group-hover:scale-[1.02] group-hover:opacity-100"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight group-hover:text-brand-accent">{project.title}</h3>
                    <span className="shrink-0 text-xs text-brand-accent">{project.status}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="bg-brand-accent/10 px-2 py-1 text-xs text-brand-accent">{tech}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-6">
                    <Link
                      to={`/projects?project=${encodeURIComponent(project.title)}`}
                      className="inline-flex flex-1 items-center justify-center border border-brand-border px-3 py-2 text-sm text-gray-300 transition hover:border-brand-accent/40 hover:text-white"
                    >
                      详情
                    </Link>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 bg-brand-accent px-3 py-2 text-sm font-medium text-zinc-950 transition hover:bg-brand-accent-hover"
                    >
                      打开<ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-border px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-bold tracking-tight">技术笔记</h2>
            <Link to="/blog" className="hidden items-center gap-1 text-sm text-brand-accent transition hover:text-brand-accent-hover md:flex">
              查看全部<ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <Link
            to={`/article?id=${featured.id}`}
            className="group mt-10 grid gap-8 border border-brand-border bg-brand-card transition hover:border-brand-accent/40 md:grid-cols-2"
          >
            <img
              src={`https://picsum.photos/seed/${featured.id}-cover/800/520`}
              alt={featured.title}
              loading="lazy"
              className="aspect-[16/10] h-full w-full object-cover grayscale transition group-hover:grayscale-0"
            />
            <div className="flex flex-col justify-center p-6 md:p-10">
              <div className="flex flex-wrap gap-2">
                {featured.tags.map((tag) => (
                  <span key={tag} className="bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent">{tag}</span>
                ))}
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight group-hover:text-brand-accent">{featured.title}</h3>
              <p className="mt-3 max-w-[48ch] leading-relaxed text-gray-400">{featured.summary}</p>
              <p className="mt-6 flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="h-3.5 w-3.5" />{featured.readTime}
              </p>
            </div>
          </Link>

          <div className="mt-12 divide-y divide-brand-border border-t border-brand-border">
            {rest.map((article) => (
              <Link key={article.id} to={`/article?id=${article.id}`} className="group flex flex-col gap-3 py-6 transition sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div>
                  <h3 className="text-lg font-semibold transition group-hover:text-brand-accent">{article.title}</h3>
                  <p className="mt-1.5 max-w-[64ch] text-sm leading-relaxed text-gray-500">{article.summary}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-gray-600 transition group-hover:text-brand-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-border px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight">当前关注</h2>
          <p className="mt-3 max-w-[64ch] text-gray-400">不做概念清单，只保留能持续运行和维护的东西。</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {siteConfig.focusAreas.map((area) => (
              <div key={area.title} className="border border-brand-border bg-brand-card p-6">
                <h3 className="text-lg font-semibold tracking-tight">{area.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function HeroTerminal() {
  const services = projects.slice(0, 4).map((project) => project.title);

  return (
    <div className="fade-up fade-up-2 md:col-span-5">
      <div className="relative">
        <div className="pointer-events-none absolute -inset-8 bg-[radial-gradient(circle_at_center,var(--c-glow),transparent_70%)]" />
        <div className="relative border border-brand-border bg-brand-card shadow-[0_24px_80px_-32px_rgb(var(--c-accent)/0.32)]">
          <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-error/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-accent/80" />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Terminal className="h-3.5 w-3.5" />
              laojin@home
            </div>
          </div>

          <div className="space-y-4 p-5 font-mono text-sm">
            <div>
              <p className="text-gray-500">$ whoami</p>
              <p className="mt-1 text-white">能落地的全栈开发者</p>
            </div>
            <div>
              <p className="text-gray-500">$ ls ~/services</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {services.map((service) => (
                  <span key={service} className="border border-brand-border px-2 py-1 text-xs text-gray-300">{service}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-500">$ status --short</p>
              <p className="mt-1 flex items-center gap-2 text-brand-accent">
                <span className="h-2 w-2 rounded-full bg-brand-accent" />
                {projects.length} 个服务入口 · 持续维护
              </p>
            </div>
            <p className="text-brand-accent">
              <span className="mr-1 text-gray-500">$</span>
              building something useful<span className="cursor-blink">_</span>
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-brand-border border-t border-brand-border text-center">
            {[
              { label: "经验", value: "5年+" },
              { label: "服务", value: `${projects.length}` },
              { label: "模式", value: "独立开发" },
            ].map((item) => (
              <div key={item.label} className="px-3 py-4">
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="mt-1 font-mono text-base text-brand-accent">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
