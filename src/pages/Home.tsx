import { ArrowRight, BookOpen, Quote } from "lucide-react";
import { articles, siteConfig } from "../data/site";
import { Link } from "../components/Link";

export function Home() {
  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <section className="relative flex min-h-[88vh] items-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#1e1e3a,transparent_70%)]" />
        <div className="relative mx-auto w-full max-w-5xl text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-2 border-brand-accent/40 bg-brand-card text-4xl font-bold text-brand-accent md:h-40 md:w-40 md:text-5xl">{siteConfig.avatar}</div>
          <h1 className="mt-8 text-4xl font-bold md:text-6xl">你好，我是 <span className="text-brand-accent">{siteConfig.name}</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">{siteConfig.description}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {siteConfig.tags.map((tag) => <span key={tag} className="border border-brand-border bg-brand-card px-3 py-1.5 text-sm text-gray-300">{tag}</span>)}
          </div>
          <div className="mt-9 flex justify-center gap-4">
            <Link to="/blog" className="inline-flex items-center gap-2 bg-brand-accent px-6 py-3 font-medium transition hover:bg-brand-accent-hover"><BookOpen className="h-4 w-4" />阅读笔记</Link>
            <Link to="/about" className="inline-flex items-center gap-2 border border-brand-border px-6 py-3 font-medium text-gray-300 transition hover:border-brand-accent/50 hover:text-white">了解更多</Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex items-end justify-between"><div><h2 className="text-3xl font-bold">技术笔记</h2><p className="mt-2 text-gray-400">从旧项目迁移的真实开发记录</p></div><Link to="/blog" className="hidden items-center gap-1 text-sm text-brand-accent md:flex">查看全部<ArrowRight className="h-3.5 w-3.5" /></Link></div>
          <div className="grid gap-5 md:grid-cols-3">
            {articles.slice(0, 3).map((article) => <a key={article.id} href={`/article?id=${article.id}`} className="group border border-brand-border bg-brand-card p-6 transition hover:border-brand-accent/40"><div className="flex flex-wrap gap-2">{article.tags.map((tag) => <span key={tag} className="bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent">{tag}</span>)}</div><h3 className="mt-4 text-lg font-semibold group-hover:text-brand-accent">{article.title}</h3><p className="mt-2 text-sm leading-relaxed text-gray-400">{article.summary}</p><p className="mt-5 text-xs text-gray-500">{article.readTime}</p></a>)}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-border px-6 py-20"><div className="mx-auto max-w-3xl text-center"><Quote className="mx-auto h-8 w-8 text-brand-accent/40" /><blockquote className="mt-6 text-2xl font-light italic leading-relaxed text-gray-300 md:text-3xl">{siteConfig.quote}</blockquote><p className="mt-4 text-gray-500">{siteConfig.name}</p></div></section>
      <footer className="border-t border-brand-border px-6 py-10"><div className="mx-auto flex max-w-5xl items-center justify-between gap-4 text-sm text-gray-500"><span>{siteConfig.name} · {siteConfig.title}</span><Link to="/contact" className="transition hover:text-white">学习资源</Link></div></footer>
    </div>
  );
}
