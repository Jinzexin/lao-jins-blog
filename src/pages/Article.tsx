import { ArrowLeft, Clock, FileText } from "lucide-react";
import type { Article as ArticleType } from "../data/site";
import { Link } from "../components/Link";

interface ArticleProps { article: ArticleType | undefined; }

function renderLine(line: string, key: number) {
  if (line.startsWith("# ")) return <h1 key={key} className="mt-10 text-3xl font-bold first:mt-0">{line.slice(2)}</h1>;
  if (line.startsWith("## ")) return <h2 key={key} className="mt-10 text-2xl font-semibold">{line.slice(3)}</h2>;
  if (line.startsWith("### ")) return <h3 key={key} className="mt-7 text-lg font-semibold">{line.slice(4)}</h3>;
  if (/^[-*] /.test(line)) return <p key={key} className="ml-5 mt-2 leading-7 text-gray-300">- {line.slice(2)}</p>;
  if (/^\d+\. /.test(line)) return <p key={key} className="mt-2 leading-7 text-gray-300">{line}</p>;
  return line ? <p key={key} className="mt-4 leading-8 text-gray-300">{line}</p> : null;
}

export function Article({ article }: ArticleProps) {
  if (!article) return <div className="min-h-screen bg-brand-bg px-6 pt-32 text-center text-white"><FileText className="mx-auto h-10 w-10 text-brand-accent" /><h1 className="mt-5 text-2xl font-bold">未找到这篇笔记</h1><Link to="/blog" className="mt-6 inline-flex text-brand-accent">返回笔记列表</Link></div>;
  const blocks = article.body.split(/(```[\s\S]*?```)/g);
  return <article className="min-h-screen bg-brand-bg px-6 pb-20 pt-28 text-white"><div className="mx-auto max-w-3xl"><Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-brand-accent"><ArrowLeft className="h-4 w-4" />返回笔记列表</Link><header className="mt-8 border-b border-brand-border pb-8"><div className="flex flex-wrap gap-2">{article.tags.map((tag) => <span key={tag} className="bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent">{tag}</span>)}</div><h1 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">{article.title}</h1><p className="mt-4 flex items-center gap-2 text-sm text-gray-500"><Clock className="h-4 w-4" />{article.readTime}</p></header><div className="mt-10">{blocks.map((block, blockIndex) => block.startsWith("```") ? <pre key={blockIndex} className="mt-5 overflow-x-auto border border-brand-border bg-[#0d0d14] p-4 text-sm leading-6 text-gray-300"><code>{block.replace(/^```[^\n]*\n?/, "").replace(/```$/, "")}</code></pre> : block.split("\n").map((line, lineIndex) => renderLine(line, blockIndex * 1000 + lineIndex)))}</div></div></article>;
}
