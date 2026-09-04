import { useState, useEffect } from "react";
import { ArrowLeft, Check, Clock, Copy, RefreshCw } from "lucide-react";
import { Link } from "../components/Link";

export function Timestamp() {
  const [now, setNow] = useState(Date.now());
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [unit, setUnit] = useState<"sec" | "ms">("sec");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  function formatUnix(ms: number) {
    const d = new Date(ms);
    return {
      full: d.toLocaleString("zh-CN", { hour12: false }),
      date: d.toLocaleDateString("zh-CN"),
      time: d.toLocaleTimeString("zh-CN", { hour12: false }),
      iso: d.toISOString(),
      weekday: "星期" + ["日", "一", "二", "三", "四", "五", "六"][d.getDay()],
    };
  }

  const nowFormatted = formatUnix(now);

  function convertFromUnix() {
    const num = Number(unixInput);
    if (isNaN(num) || !unixInput) return null;
    return formatUnix(num * (unit === "sec" ? 1000 : 1));
  }

  function convertToDate() {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    return {
      unixSec: Math.floor(d.getTime() / 1000).toString(),
      unixMs: d.getTime().toString(),
      iso: d.toISOString(),
    };
  }

  function copy(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1200);
  }

  const unixResult = convertFromUnix();
  const dateResult = convertToDate();

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <section className="relative overflow-hidden px-6 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--c-glow),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">时间戳转换</h1>
          <p className="mt-4 text-gray-400">Unix 时间戳与可读日期互相转换，实时时钟一目了然</p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Current time */}
          <div className="border border-brand-border bg-brand-card p-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RefreshCw className="h-3.5 w-3.5" />实时时钟
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <CopyRow label="时间戳（秒）" value={Math.floor(now / 1000).toString()} field="now-sec" copiedField={copiedField} onCopy={copy} />
              <CopyRow label="时间戳（毫秒）" value={now.toString()} field="now-ms" copiedField={copiedField} onCopy={copy} />
              <div className="flex items-center justify-between border-t border-brand-border/60 pt-3">
                <span className="text-gray-400">{nowFormatted.date} {nowFormatted.weekday}</span>
                <span className="font-mono text-lg font-semibold text-brand-accent">{nowFormatted.time}</span>
              </div>
              <CopyRow label="ISO 8601" value={nowFormatted.iso} field="now-iso" copiedField={copiedField} onCopy={copy} />
            </div>
          </div>

          {/* Unix → date */}
          <div className="border border-brand-border bg-brand-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium">时间戳 → 日期</span>
              <div className="flex border border-brand-border">
                <button
                  onClick={() => { setUnit("sec"); setUnixInput(""); }}
                  className={`px-3 py-1 text-xs transition ${unit === "sec" ? "bg-brand-accent font-medium text-zinc-950" : "text-gray-400 hover:text-white"}`}
                >秒</button>
                <button
                  onClick={() => { setUnit("ms"); setUnixInput(""); }}
                  className={`px-3 py-1 text-xs transition ${unit === "ms" ? "bg-brand-accent font-medium text-zinc-950" : "text-gray-400 hover:text-white"}`}
                >毫秒</button>
              </div>
            </div>
            <label htmlFor="unix-input" className="sr-only">时间戳输入</label>
            <input
              id="unix-input"
              type="text"
              value={unixInput}
              onChange={(e) => setUnixInput(e.target.value)}
              placeholder={unit === "sec" ? "输入秒级时间戳，如 1725400000" : "输入毫秒级时间戳，如 1725400000000"}
              className="mb-3 w-full border border-brand-border bg-brand-bg px-4 py-2.5 font-mono text-sm text-white placeholder-gray-600 outline-none transition focus:border-brand-accent/60"
            />
            {unixResult ? (
              <div className="space-y-2 text-sm">
                <CopyRow label="本地时间" value={unixResult.full} field="unix-full" copiedField={copiedField} onCopy={copy} />
                <CopyRow label="ISO 8601" value={unixResult.iso} field="unix-iso" copiedField={copiedField} onCopy={copy} />
                <CopyRow label="日期" value={`${unixResult.date} ${unixResult.weekday}`} field="unix-date" copiedField={copiedField} onCopy={copy} />
                <CopyRow label="时间" value={unixResult.time} field="unix-time" copiedField={copiedField} onCopy={copy} />
              </div>
            ) : unixInput ? (
              <p className="text-sm text-brand-error">无法解析，请输入有效数字</p>
            ) : null}
          </div>

          {/* Date → unix */}
          <div className="border border-brand-border bg-brand-card p-6">
            <label htmlFor="date-input" className="mb-4 block font-medium">日期 → 时间戳</label>
            <input
              id="date-input"
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="mb-3 w-full border border-brand-border bg-brand-bg px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand-accent/60"
            />
            {dateResult ? (
              <div className="space-y-2 text-sm">
                <CopyRow label="时间戳（秒）" value={dateResult.unixSec} field="date-sec" copiedField={copiedField} onCopy={copy} />
                <CopyRow label="时间戳（毫秒）" value={dateResult.unixMs} field="date-ms" copiedField={copiedField} onCopy={copy} />
                <CopyRow label="ISO 8601" value={dateResult.iso} field="date-iso" copiedField={copiedField} onCopy={copy} />
              </div>
            ) : dateInput ? (
              <p className="text-sm text-brand-error">无法解析，请检查日期格式</p>
            ) : null}
          </div>

          <div className="flex items-center justify-between pb-4 text-sm text-gray-500">
            <Link to="/tools" className="inline-flex items-center gap-1.5 text-gray-400 transition hover:text-brand-accent">
              <ArrowLeft className="h-3.5 w-3.5" />返回工具列表
            </Link>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />时钟每秒刷新</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function CopyRow({ label, value, field, copiedField, onCopy }: {
  label: string; value: string; field: string; copiedField: string | null; onCopy: (v: string, f: string) => void;
}) {
  const copied = copiedField === field;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 text-xs text-gray-500">{label}</span>
      <span className="truncate font-mono text-sm text-gray-200">{value}</span>
      <button
        onClick={() => onCopy(value, field)}
        aria-label={`复制${label}`}
        className={`shrink-0 transition ${copied ? "text-brand-accent" : "text-gray-600 hover:text-white"}`}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
