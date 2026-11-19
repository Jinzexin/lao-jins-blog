import { useState, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "./Link";

export interface ToolTab {
  id: string;
  label: string;
  content: ReactNode;
}

interface ToolShellProps {
  title: string;
  description: string;
  tabs: ToolTab[];
}

export function ToolShell({ title, description, tabs }: ToolShellProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <section className="relative overflow-hidden px-6 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--c-glow),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-[64ch] text-gray-400">{description}</p>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {tabs.length > 1 ? (
            <div className="mb-6 flex gap-2 overflow-x-auto border-b border-brand-border pb-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveId(tab.id)}
                  className={`whitespace-nowrap px-4 py-2 text-sm transition ${
                    tab.id === activeTab?.id
                      ? "bg-brand-accent font-medium text-zinc-950"
                      : "border border-brand-border text-gray-400 hover:border-brand-accent/40 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : null}
          {activeTab?.content}
        </div>
      </section>

      <footer className="border-t border-brand-border px-6 py-10">
        <div className="mx-auto max-w-6xl text-sm">
          <Link to="/tools" className="inline-flex items-center gap-1.5 text-gray-400 transition hover:text-brand-accent">
            <ArrowLeft className="h-3.5 w-3.5" />
            返回工具列表
          </Link>
        </div>
      </footer>
    </div>
  );
}

export function ToolCard({ title, children, className = "" }: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-brand-border bg-brand-card p-6 ${className}`}>
      {title ? <h2 className="mb-4 text-lg font-semibold tracking-tight">{title}</h2> : null}
      {children}
    </section>
  );
}

export function ToolLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-center justify-between text-xs font-medium text-gray-400">
      {children}
    </label>
  );
}

export function ToolTextarea({ id, value, onChange, placeholder, rows = 8, readOnly = false, className = "" }: {
  id: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <textarea
      id={id}
      value={value}
      rows={rows}
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      className={`w-full resize-y border border-brand-border bg-brand-bg px-4 py-3 font-mono text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-brand-accent/60 ${className}`}
    />
  );
}

export function ToolInput({ id, value, onChange, placeholder, type = "text" }: {
  id: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="w-full border border-brand-border bg-brand-bg px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-brand-accent/60"
    />
  );
}

export function ToolButton({ children, onClick, type = "button", disabled = false, primary = false }: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
        primary
          ? "bg-brand-accent font-medium text-zinc-950 hover:bg-brand-accent-hover"
          : "border border-brand-border text-gray-300 hover:border-brand-accent/40 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export function ToolSelect({ id, value, onChange, options }: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full border border-brand-border bg-brand-bg px-3 py-2.5 text-sm text-white outline-none transition focus:border-brand-accent/60"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

export function ToolResult({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-auto border border-brand-border bg-brand-code p-4 text-sm leading-6 text-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function ToolMessage({ kind = "info", children }: { kind?: "info" | "error" | "success"; children: ReactNode }) {
  const styles = {
    info: "border-brand-border bg-brand-card text-gray-400",
    error: "border-brand-error-border bg-brand-error-bg text-brand-error",
    success: "border-brand-accent/40 bg-brand-accent/10 text-brand-accent",
  }[kind];
  return <div className={`border p-3 text-sm ${styles}`}>{children}</div>;
}
