import { ArrowUpRight, BookOpen, Globe2 } from "lucide-react";
import { resources, siteConfig } from "../data/site";
import { Link } from "../components/Link";

export function Contact() {
  return <div className="min-h-screen bg-brand-bg text-white">
    <section className="relative overflow-hidden px-6 pt-28"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e1e3a,transparent_70%)]" /><div className="relative mx-auto max-w-5xl text-center"><h1 className="text-4xl font-bold md:text-5xl">学习资源</h1><p className="mt-4 text-gray-400">旧项目中整理并持续使用的技术文档与学习资料</p></div></section>
    <section className="px-6 py-16"><div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">{resources.map((resource) => <a key={resource.title} href={resource.url} target="_blank" rel="noopener noreferrer" className="group border border-brand-border bg-brand-card p-6 transition hover:border-brand-accent/40"><div className="flex items-start justify-between gap-4"><span className="bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent">{resource.category}</span><ArrowUpRight className="h-4 w-4 text-gray-600 transition group-hover:text-brand-accent" /></div><h2 className="mt-5 text-xl font-semibold">{resource.title}</h2><p className="mt-2 text-sm leading-relaxed text-gray-400">{resource.description}</p></a>)}</div></section>
    <section className="border-t border-brand-border px-6 py-16"><div className="mx-auto max-w-3xl text-center"><BookOpen className="mx-auto h-7 w-7 text-brand-accent" /><h2 className="mt-4 text-2xl font-bold">项目技术笔记</h2><p className="mt-3 text-gray-400">Docker、Git、Node.js、PostgreSQL、Vue 3 与 Cloudflare Tunnel 的实践记录已完整迁移。</p><Link to="/blog" className="mt-7 inline-flex bg-brand-accent px-5 py-3 font-medium transition hover:bg-brand-accent-hover">查看笔记</Link></div></section>
    <footer className="border-t border-brand-border px-6 py-10"><div className="mx-auto flex max-w-5xl items-center justify-between gap-4 text-sm text-gray-500"><span>{siteConfig.name} · {siteConfig.title}</span><span className="flex items-center gap-2"><Globe2 className="h-4 w-4" />技术资源</span></div></footer>
  </div>;
}
