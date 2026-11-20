import { Mail } from "lucide-react";
import { siteConfig } from "../data/site";
import { Link } from "./Link";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.096 24 17.597 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const footerNav = [
  { label: "作品", href: "/projects" },
  { label: "工具", href: "/tools" },
  { label: "导航", href: "/bookmarks" },
  { label: "笔记", href: "/blog" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-border px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_220px] md:gap-16">
        <div>
          <div className="text-base font-bold tracking-tight text-brand-accent">
            {siteConfig.name}<span className="text-white">.</span>dev
          </div>
          <p className="mt-3 max-w-[58ch] text-sm leading-6 text-gray-500">
            记录能跑起来的项目、踩坑过程和常用工具。
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={siteConfig.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center border border-brand-border text-gray-500 transition hover:border-brand-accent/50 hover:text-brand-accent"
              aria-label={siteConfig.contact.githubLabel}
            >
              <GithubMark className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex h-9 w-9 items-center justify-center border border-brand-border text-gray-500 transition hover:border-brand-accent/50 hover:text-brand-accent"
              aria-label={`发送邮件：${siteConfig.contact.email}`}
            >
              <Mail className="h-4 w-4" />
            </a>
            <span className="text-xs text-gray-600">{siteConfig.contact.email}</span>
          </div>
        </div>

        <nav aria-label="页脚导航" className="grid grid-cols-2 gap-3 text-sm md:grid-cols-1">
          {footerNav.map((item) => (
            <Link key={item.href} to={item.href} className="text-gray-500 transition hover:text-brand-accent">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-brand-border/60 pt-6 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 {siteConfig.name}.dev. All rights reserved.</span>
        <span>Built with React, TypeScript and Cloudflare-ready infrastructure.</span>
      </div>
    </footer>
  );
}
