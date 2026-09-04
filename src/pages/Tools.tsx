import { Wrench } from "lucide-react";
import { siteConfig } from "../data/site";
import { Link } from "../components/Link";

const tools = [
  {
    id: "json-parser",
    title: "JSON 在线解析",
    description: "粘贴 JSON 文本，一键美化格式化、校验合法性，快速查看结构。",
    href: "/tools/json-parser",
    tags: ["JSON", "格式化"],
  },
  {
    id: "timestamp",
    title: "时间戳转换",
    description: "Unix 时间戳与可读日期互相转换，支持秒/毫秒切换，实时显示当前时间。",
    href: "/tools/timestamp",
    tags: ["时间戳", "日期"],
  },
];

export function Tools() {
  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <section className="relative overflow-hidden px-6 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--c-glow),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">开发工具</h1>
          <p className="mt-4 max-w-[52ch] text-gray-400">常用在线工具，开箱即用，无需登录</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.href}
              className="group border border-brand-border bg-brand-card p-6 transition hover:border-brand-accent/40"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent">工具</span>
                <Wrench className="h-4 w-4 text-gray-600 transition group-hover:text-brand-accent" />
              </div>
              <h2 className="mt-5 text-xl font-semibold tracking-tight group-hover:text-brand-accent">{tool.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{tool.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span key={tag} className="border border-brand-border px-2.5 py-1 text-xs text-gray-400">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-brand-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 text-sm text-gray-500">
          <span>{siteConfig.name} · {siteConfig.title}</span>
          <span className="flex items-center gap-2"><Wrench className="h-4 w-4" />开发工具</span>
        </div>
      </footer>
    </div>
  );
}
