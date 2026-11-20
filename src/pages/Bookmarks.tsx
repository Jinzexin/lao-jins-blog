import { useMemo, useState } from "react";
import { ArrowUpRight, Bookmark, Check, Copy, LayoutGrid, Search } from "lucide-react";
import { bookmarkCategories, bookmarks } from "../data/site";
import { SiteFooter } from "../components/SiteFooter";
import { copyText } from "../lib/toolUtils";

export function Bookmarks() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get("bookmark") ?? "");
  const [category, setCategory] = useState("全部");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [copied, setCopied] = useState("");

  const tags = useMemo(
    () => Array.from(new Set(bookmarks.flatMap((bookmark) => bookmark.tags)))
      .sort((left, right) => left.localeCompare(right, "zh-CN")),
    [],
  );

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return bookmarks.filter((bookmark) => {
      const haystack = [bookmark.title, bookmark.description, bookmark.url, bookmark.category, ...bookmark.tags]
        .join(" ")
        .toLowerCase();
      return keyword ? haystack.includes(keyword) : true;
    }).filter((bookmark) => category === "全部" || bookmark.category === category)
      .filter((bookmark) => activeTags.every((tag) => bookmark.tags.includes(tag)));
  }, [query, category, activeTags]);

  const grouped = useMemo(() => {
    return bookmarkCategories
      .map((name) => ({ name, items: filtered.filter((bookmark) => bookmark.category === name) }))
      .filter((group) => group.items.length > 0);
  }, [filtered]);

  function toggleTag(tag: string) {
    setActiveTags((current) => current.includes(tag)
      ? current.filter((item) => item !== tag)
      : [...current, tag]);
  }

  function copyBookmark(url: string) {
    copyText(url);
    setCopied(url);
    window.setTimeout(() => setCopied(""), 1200);
  }

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <section className="relative overflow-hidden px-4 pt-32 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--c-glow),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm text-brand-accent">Personal Navigation</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">个人书签导航</h1>
          <p className="mt-4 max-w-[64ch] text-gray-400">
            集中管理常用站点。共享网址项目、开发工具、文档和效率服务都按分类整理，可以用标签和关键词快速打开。
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="border border-brand-border bg-brand-card p-5 sm:p-6">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索书签名称、网址、标签或用途"
                className="h-11 w-full border border-brand-border bg-brand-bg pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-brand-accent/60"
                aria-label="搜索书签"
              />
            </label>

            <div className="mt-5 flex flex-wrap gap-2">
              {["全部", ...bookmarkCategories].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCategory(name)}
                  className={`px-3 py-1.5 text-xs transition ${
                    category === name
                      ? "bg-brand-accent font-medium text-zinc-950"
                      : "border border-brand-border text-gray-400 hover:border-brand-accent/40 hover:text-white"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-brand-border/60 pt-4">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-xs transition ${
                    activeTags.includes(tag)
                      ? "bg-brand-accent/15 text-brand-accent ring-1 ring-brand-accent/40"
                      : "text-gray-500 transition hover:text-brand-accent"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center gap-2"><LayoutGrid className="h-4 w-4" />{filtered.length} / {bookmarks.length} 个书签</span>
            <button
              type="button"
              onClick={() => { setQuery(""); setCategory("全部"); setActiveTags([]); }}
              className="text-brand-accent transition hover:text-brand-accent-hover"
            >
              清除筛选
            </button>
          </div>

          <div className="mt-10 space-y-12">
            {grouped.map((group) => (
              <div key={group.name}>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold tracking-tight">{group.name}</h2>
                  <span className="text-sm text-gray-600">{group.items.length}</span>
                  <span className="h-px flex-1 bg-brand-border" />
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((bookmark) => (
                    <article key={bookmark.url} className="group flex flex-col border border-brand-border bg-brand-card p-5 transition hover:border-brand-accent/40">
                      <div className="flex items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-brand-accent/40 bg-brand-bg text-lg font-bold text-brand-accent">
                          {bookmark.title.slice(0, 1)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-semibold tracking-tight group-hover:text-brand-accent">{bookmark.title}</h3>
                          <p className="mt-1 truncate text-xs text-gray-600">{new URL(bookmark.url).hostname}</p>
                        </div>
                      </div>

                      <p className="mt-4 min-h-[44px] text-sm leading-6 text-gray-400">{bookmark.description}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {bookmark.tags.map((tag) => (
                          <button key={tag} type="button" onClick={() => toggleTag(tag)} className="bg-brand-accent/10 px-2 py-1 text-xs text-brand-accent transition hover:bg-brand-accent/20">
                            #{tag}
                          </button>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center gap-2 pt-6">
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-1.5 bg-brand-accent px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-brand-accent-hover"
                        >
                          打开<ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => copyBookmark(bookmark.url)}
                          className="flex h-9 w-9 items-center justify-center border border-brand-border text-gray-500 transition hover:border-brand-accent/50 hover:text-brand-accent"
                          aria-label={`复制 ${bookmark.title} 链接`}
                        >
                          {copied === bookmark.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!filtered.length ? (
            <div className="mt-10 border border-brand-border bg-brand-card p-12 text-center">
              <Bookmark className="mx-auto h-8 w-8 text-gray-600" />
              <p className="mt-4 text-gray-400">没有符合条件的书签。</p>
            </div>
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
