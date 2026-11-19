import { useMemo, useState } from "react";
import { ArrowUpRight, Filter, Globe2, LayoutGrid, Search } from "lucide-react";
import { projects, siteConfig, type ProjectStatus } from "../data/site";
import { Link } from "../components/Link";

const statusFilters: Array<"全部" | ProjectStatus> = ["全部", "运行中", "维护中", "开发中"];

export function Projects() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get("project") ?? "");
  const [category, setCategory] = useState("全部");
  const [status, setStatus] = useState<"全部" | ProjectStatus>("全部");

  const categories = useMemo(
    () => ["全部", ...Array.from(new Set(projects.map((project) => project.category)))],
    [],
  );
  const tags = useMemo(
    () => Array.from(new Set(projects.flatMap((project) => project.tags))).sort((left, right) => left.localeCompare(right, "zh-CN")),
    [],
  );
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return projects.filter((project) => {
      const haystack = [project.title, project.description, project.category, project.status, ...project.tags, ...project.techStack]
        .join(" ")
        .toLowerCase();
      return keyword ? haystack.includes(keyword) : true;
    }).filter((project) => category === "全部" || project.category === category)
      .filter((project) => status === "全部" || project.status === status)
      .filter((project) => activeTags.every((tag) => project.tags.includes(tag)));
  }, [query, category, status, activeTags]);

  const counts = {
    total: projects.length,
    running: projects.filter((project) => project.status === "运行中").length,
    maintenance: projects.filter((project) => project.status === "维护中").length,
    development: projects.filter((project) => project.status === "开发中").length,
  };

  function toggleTag(tag: string) {
    setActiveTags((current) => current.includes(tag)
      ? current.filter((item) => item !== tag)
      : [...current, tag]);
  }

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <section className="relative overflow-hidden px-4 pt-32 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--c-glow),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm text-brand-accent">Project Directory</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">作品导航</h1>
          <p className="mt-4 max-w-[64ch] text-gray-400">
            每个项目都有截图、简介、技术栈和运行状态。可以直接跳转到线上入口，或用关键词快速定位。
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "全部项目", value: counts.total },
              { label: "运行中", value: counts.running },
              { label: "维护中", value: counts.maintenance },
              { label: "开发中", value: counts.development },
            ].map((item) => (
              <div key={item.label} className="border border-brand-border bg-brand-card p-5">
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="mt-2 font-mono text-2xl text-brand-accent">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="border border-brand-border bg-brand-card p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_200px_200px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索项目名称、技术栈或功能"
                  className="h-11 w-full border border-brand-border bg-brand-bg pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-brand-accent/60"
                  aria-label="搜索项目"
                />
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-11 border border-brand-border bg-brand-bg px-3 text-sm text-white outline-none transition focus:border-brand-accent/60"
                aria-label="按分类筛选"
              >
                {categories.map((item) => <option key={item} value={item}>{item === "全部" ? "全部分类" : item}</option>)}
              </select>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as typeof status)}
                className="h-11 border border-brand-border bg-brand-bg px-3 text-sm text-white outline-none transition focus:border-brand-accent/60"
                aria-label="按状态筛选"
              >
                {statusFilters.map((item) => <option key={item} value={item}>{item === "全部" ? "全部状态" : item}</option>)}
              </select>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-xs transition ${
                    activeTags.includes(tag)
                      ? "bg-brand-accent font-medium text-zinc-950"
                      : "border border-brand-border text-gray-400 hover:border-brand-accent/40 hover:text-white"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center gap-2"><Filter className="h-4 w-4" />{filtered.length} / {projects.length} 个项目</span>
            <button
              type="button"
              onClick={() => { setQuery(""); setCategory("全部"); setStatus("全部"); setActiveTags([]); }}
              className="text-brand-accent transition hover:text-brand-accent-hover"
            >
              清除筛选
            </button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <article key={project.title} className="group flex flex-col border border-brand-border bg-brand-card transition hover:border-brand-accent/40">
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="relative block overflow-hidden">
                  <img
                    src={project.screenshot}
                    alt={`${project.title} 截图`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="aspect-[16/10] w-full object-cover opacity-90 transition group-hover:scale-[1.02] group-hover:opacity-100"
                  />
                  <span className="absolute left-4 top-4 bg-brand-bg/85 px-2.5 py-1 text-xs text-brand-accent backdrop-blur">{project.category}</span>
                  <StatusBadge status={project.status} />
                </a>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-semibold tracking-tight transition group-hover:text-brand-accent">{project.title}</h2>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-gray-600 transition group-hover:text-brand-accent" />
                  </div>
                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-gray-400">{project.description}</p>

                  <div className="mt-5">
                    <p className="text-xs text-gray-500">技术栈</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="bg-brand-accent/10 px-2 py-1 text-xs text-brand-accent">{tech}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-gray-500">标签</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <button key={tag} type="button" onClick={() => toggleTag(tag)} className="border border-brand-border px-2 py-1 text-xs text-gray-400 transition hover:border-brand-accent/40 hover:text-white">
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3 border-t border-brand-border/60 pt-5">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center bg-brand-accent px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-brand-accent-hover"
                    >
                      打开项目
                    </a>
                    <span className="text-xs text-gray-500">{project.status}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!filtered.length ? (
            <div className="mt-10 border border-brand-border bg-brand-card p-12 text-center">
              <LayoutGrid className="mx-auto h-8 w-8 text-gray-600" />
              <p className="mt-4 text-gray-400">没有符合条件的项目。</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-t border-brand-border px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl text-center md:text-left">
          <div className="border border-brand-border bg-brand-card p-8 md:flex md:items-center md:justify-between md:p-10">
            <div>
              <Globe2 className="h-7 w-7 text-brand-accent" />
              <h2 className="mt-5 text-2xl font-bold tracking-tight">个人书签与常用站点导航</h2>
              <p className="mt-3 max-w-[64ch] text-gray-400">把常用站点按分类整理，支持标签筛选和关键词搜索。</p>
            </div>
            <Link to="/bookmarks" className="mt-7 inline-flex bg-brand-accent px-6 py-3 font-medium text-zinc-950 transition hover:bg-brand-accent-hover md:mt-0">
              进入导航页
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-brand-border px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>{siteConfig.name} · {siteConfig.title}</span>
          <span className="flex items-center gap-2"><Globe2 className="h-4 w-4" />作品导航</span>
        </div>
      </footer>
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles = {
    "运行中": "bg-brand-accent text-zinc-950",
    "维护中": "bg-brand-bg/85 text-gray-300 border border-brand-border",
    "开发中": "bg-brand-error-bg text-brand-error border border-brand-error-border",
  }[status];
  return <span className={`absolute right-4 top-4 px-2.5 py-1 text-xs backdrop-blur ${styles}`}>{status}</span>;
}
