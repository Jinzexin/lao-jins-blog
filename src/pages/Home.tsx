import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import { articles, siteConfig } from "../data/site";
import { Link } from "../components/Link";

export function Home() {
  const [featured, ...rest] = articles.slice(0, 3);

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      {/* Hero: asymmetric split, text left / monogram right */}
      <section className="relative flex min-h-[100dvh] items-center overflow-hidden px-6 pt-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,var(--c-glow),transparent_60%)]" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="fade-up text-sm text-brand-accent">{siteConfig.title}</p>
            <h1 className="fade-up fade-up-1 mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              你好，我是 <span className="text-brand-accent">{siteConfig.name}</span>
            </h1>
            <p className="fade-up fade-up-2 mt-6 max-w-[52ch] text-base leading-relaxed text-gray-400 md:text-lg">
              {siteConfig.description}
            </p>
            <div className="fade-up fade-up-3 mt-9 flex flex-wrap gap-4">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 bg-brand-accent px-6 py-3 font-medium text-zinc-950 transition hover:bg-brand-accent-hover"
              >
                阅读笔记<ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 border border-brand-border px-6 py-3 font-medium text-gray-300 transition hover:border-brand-accent/60 hover:text-white"
              >
                看看作品
              </Link>
            </div>
          </div>
          <div className="fade-up fade-up-2 md:col-span-5">
            <div className="mx-auto flex h-40 w-40 items-center justify-center border-2 border-brand-accent/50 bg-brand-card text-6xl font-bold text-brand-accent md:mx-0 md:h-48 md:w-48">
              {siteConfig.avatar}
            </div>
            <dl className="mx-auto mt-8 max-w-xs divide-y divide-brand-border border-y border-brand-border md:mx-0">
              {siteConfig.stats.map((stat) => (
                <div key={stat.label} className="flex items-baseline justify-between py-3">
                  <dt className="text-sm text-gray-500">{stat.label}</dt>
                  <dd className="font-mono text-lg text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Featured note: split layout, image left / text right */}
      <section className="border-t border-brand-border px-6 py-24">
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
            <div className="flex flex-col justify-center p-8 md:p-10">
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
              <Link key={article.id} to={`/article?id=${article.id}`} className="group flex items-center justify-between gap-6 py-6 transition">
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

      {/* Quote: editorial manifesto */}
      <section className="border-t border-brand-border px-6 py-28">
        <figure className="mx-auto max-w-3xl text-center">
          <blockquote className="text-2xl font-light leading-relaxed tracking-tight text-gray-200 md:text-3xl">
            {siteConfig.quote}
          </blockquote>
          <figcaption className="mt-6 text-sm text-gray-500">{siteConfig.name}</figcaption>
        </figure>
      </section>

      <footer className="border-t border-brand-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 text-sm text-gray-500">
          <span>{siteConfig.name} · {siteConfig.title}</span>
          <Link to="/contact" className="transition hover:text-brand-accent">学习资源</Link>
        </div>
      </footer>
    </div>
  );
}
