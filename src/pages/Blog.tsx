import { useState } from "react";
import { ArrowUpRight, Clock, Search } from "lucide-react";
import { articles, siteConfig } from "../data/site";

export function Blog() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const allTags = Array.from(new Set(articles.flatMap((article) => article.tags)));
  const filtered = articles.filter((article) => (!search || `${article.title}${article.summary}`.toLowerCase().includes(search.toLowerCase())) && (!activeTag || article.tags.includes(activeTag)));

  return <div className="min-h-screen bg-brand-bg text-white">
    <section className="relative overflow-hidden px-6 pt-28"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e1e3a,transparent_70%)]" /><div className="relative mx-auto max-w-5xl text-center"><h1 className="text-4xl font-bold md:text-5xl">技术笔记</h1><p className="mt-4 text-gray-400">来自真实项目实践的技术笔记与操作记录</p><div className="mx-auto mt-8 flex max-w-md items-center gap-2 border border-brand-border bg-brand-card px-4 py-2.5"><Search className="h-4 w-4 shrink-0 text-gray-500" /><input type="search" placeholder="搜索笔记..." value={search} onChange={(event) => setSearch(event.target.value)} className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none" /></div><div className="mt-6 flex flex-wrap justify-center gap-2"><button onClick={() => setActiveTag(null)} className={`px-4 py-1.5 text-sm transition ${!activeTag ? "bg-brand-accent text-white" : "border border-brand-border text-gray-400 hover:border-brand-accent/50"}`}>全部</button>{allTags.map((tag) => <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)} className={`px-4 py-1.5 text-sm transition ${activeTag === tag ? "bg-brand-accent text-white" : "border border-brand-border text-gray-400 hover:border-brand-accent/50"}`}>{tag}</button>)}</div></div></section>
    <section className="px-6 py-16"><div className="mx-auto max-w-5xl">{filtered.length ? <div className="grid gap-5 md:grid-cols-2">{filtered.map((article) => <a key={article.id} href={`/article?id=${article.id}`} className="group border border-brand-border bg-brand-card p-6 transition hover:border-brand-accent/40"><div className="flex flex-wrap gap-2">{article.tags.map((tag) => <span key={tag} className="bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent">{tag}</span>)}</div><h2 className="mt-4 text-xl font-semibold group-hover:text-brand-accent">{article.title}</h2><p className="mt-2 text-sm leading-relaxed text-gray-400">{article.summary}</p><div className="mt-5 flex items-center justify-between text-sm text-gray-500"><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.readTime}</span><ArrowUpRight className="h-4 w-4 transition group-hover:text-brand-accent" /></div></a>)}</div> : <p className="py-20 text-center text-gray-500">没有找到匹配的笔记</p>}<p className="mt-7 text-center text-sm text-gray-500">共 {filtered.length} 篇笔记</p></div></section>
    <footer className="border-t border-brand-border px-6 py-10"><div className="mx-auto max-w-5xl text-sm text-gray-500">{siteConfig.name} · {siteConfig.title}</div></footer>
  </div>;
}
