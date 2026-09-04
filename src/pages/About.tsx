import { Code2, Sparkles } from "lucide-react";
import { siteConfig, techStack } from "../data/site";
import { Link } from "../components/Link";

const directions = [
  { title: "Web 应用开发", desc: "使用 Vue.js、Node.js 等现代技术栈构建实际应用。" },
  { title: "云存储", desc: "围绕对象存储、文件管理与服务部署进行功能探索。" },
  { title: "AI 对话", desc: "将 AI 能力接入实际应用，验证交互与服务整合方案。" },
  { title: "游戏中心", desc: "以完整功能模块为单位持续练习产品开发。" },
];

export function About() {
  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <section className="relative overflow-hidden px-6 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,var(--c-glow),transparent_55%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-start gap-10 md:flex-row md:gap-14">
          <div className="flex h-36 w-36 shrink-0 items-center justify-center border-2 border-brand-accent/50 bg-brand-card text-6xl font-bold text-brand-accent">
            {siteConfig.avatar}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">关于 {siteConfig.name}</h1>
            <p className="mt-5 max-w-[62ch] leading-relaxed text-gray-400">{siteConfig.bio}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
              <span className="flex items-center gap-2"><Code2 className="h-4 w-4 text-brand-accent" />{siteConfig.title}</span>
              <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-accent" />技术实践与分享</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack: grouped rows, mono level, no progress bars */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight">技术栈</h2>
          <ul className="mt-8 divide-y divide-brand-border border-y border-brand-border">
            {techStack.map((skill) => (
              <li key={skill.name} className="flex items-center justify-between gap-4 py-4">
                <span className="font-medium">{skill.name}</span>
                <span className="font-mono text-sm text-brand-accent">{skill.level}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-brand-border px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight">实践方向</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {directions.map((item) => (
              <div key={item.title} className="border-l-2 border-brand-accent/60 pl-5">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-border px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight">技术笔记</h2>
          <p className="mt-3 max-w-[52ch] text-gray-400">将项目实践中的操作经验整理为可检索的内容。</p>
          <Link to="/blog" className="mt-7 inline-flex bg-brand-accent px-5 py-3 font-medium text-zinc-950 transition hover:bg-brand-accent-hover">
            阅读笔记
          </Link>
        </div>
      </section>
    </div>
  );
}
