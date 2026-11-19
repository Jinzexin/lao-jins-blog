import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { articles, bookmarks, projects } from "../data/site";
import { toolItems } from "../data/toolCatalog";
import { Link } from "./Link";

interface SearchItem {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  type: "工具" | "笔记" | "项目" | "书签";
}

const searchItems: SearchItem[] = [
  ...toolItems.map((item) => ({
    id: `tool-${item.id}`,
    title: item.title,
    description: item.description,
    href: item.href,
    category: item.badge,
    type: "工具" as const,
  })),
  ...articles.map((item) => ({
    id: `article-${item.id}`,
    title: item.title,
    description: item.summary,
    href: `/article?id=${item.id}`,
    category: item.readTime,
    type: "笔记" as const,
  })),
  ...projects.map((item, index) => ({
    id: `project-${index}`,
    title: item.title,
    description: item.description,
    href: `/projects?project=${encodeURIComponent(item.title)}`,
    category: item.category,
    type: "项目" as const,
  })),
  ...bookmarks.map((item, index) => ({
    id: `bookmark-${index}`,
    title: item.title,
    description: item.description,
    href: `/bookmarks?bookmark=${encodeURIComponent(item.title)}`,
    category: item.category,
    type: "书签" as const,
  })),
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return searchItems.slice(0, 8);
    return searchItems.filter((item) => {
      const haystack = [item.title, item.description, item.category, item.type, ...(item.id.split("-"))].join(" ").toLowerCase();
      return haystack.includes(keyword);
    }).slice(0, 16);
  }, [query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (!open) return;
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((value) => Math.min(value + 1, Math.max(results.length - 1, 0)));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((value) => Math.max(value - 1, 0));
      }
      if (event.key === "Enter" && results[activeIndex]) {
        event.preventDefault();
        window.location.href = results[activeIndex].href;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, open, results]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  function openSearch() {
    setOpen(true);
    setActiveIndex(0);
  }

  function updateQuery(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  const activeResult = results[Math.min(activeIndex, results.length - 1)];
  const shortcutKey = navigator.platform.toLowerCase().includes("mac") ? "⌘ K" : "Ctrl K";

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className="flex h-9 items-center gap-2 border border-brand-border px-3 text-sm text-gray-400 transition hover:border-brand-accent/50 hover:text-brand-accent"
        aria-label="打开全局搜索"
      >
        <Search className="h-4 w-4" />
        <span className="hidden xl:inline">搜索</span>
        <kbd className="hidden rounded border border-brand-border px-1.5 py-0.5 text-[10px] text-gray-500 xl:inline">{shortcutKey}</kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex bg-black/70 p-4 backdrop-blur-sm sm:items-start sm:justify-center sm:p-8"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="mt-0 h-fit w-full max-w-2xl border border-brand-border bg-brand-bg shadow-2xl sm:mt-16"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="全局搜索"
          >
            <div className="flex items-center gap-3 border-b border-brand-border px-4 py-3">
              <Search className="h-4 w-4 text-brand-accent" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="搜索工具、笔记、项目和书签…"
                className="h-9 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                aria-label="搜索关键词"
              />
              <button type="button" onClick={() => setOpen(false)} className="rounded border border-brand-border px-2 py-1 text-xs text-gray-500 transition hover:text-white">Esc</button>
            </div>

            <div className="max-h-[min(64vh,520px)] overflow-y-auto p-2">
              {results.length ? results.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`group flex items-center gap-3 border-l-2 px-3 py-3 transition ${
                    index === (activeResult ? results.indexOf(activeResult) : 0)
                      ? "border-brand-accent bg-brand-card"
                      : "border-transparent hover:bg-brand-card"
                  }`}
                >
                  <span className="w-12 shrink-0 bg-brand-accent/10 px-2 py-1 text-center text-xs text-brand-accent">{item.type}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium group-hover:text-brand-accent">{item.title}</span>
                    <span className="mt-1 block truncate text-xs text-gray-500">{item.description}</span>
                  </span>
                  <span className="hidden shrink-0 text-xs text-gray-600 sm:block">{item.category}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-600 transition group-hover:text-brand-accent" />
                </Link>
              )) : (
                <div className="p-8 text-center text-sm text-gray-500">没有找到「{query}」相关内容。</div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-brand-border px-4 py-2 text-xs text-gray-600">
              <span>↑ ↓ 选择 · Enter 打开 · Esc 关闭</span>
              <span>{results.length} 条结果</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
