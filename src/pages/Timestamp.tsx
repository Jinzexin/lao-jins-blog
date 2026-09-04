import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Copy, RefreshCw } from "lucide-react";
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
      weekday: ["日", "一", "二", "三", "四", "五", "六"][d.getDay()] + "星期",
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
      full: d.toLocaleString("zh-CN", { hour12: false }),
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
      <section className="relative overflow-hidden px-6 pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e1e3a,transparent_70%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-accent/40 bg-brand-card">
            <Clock className="h-7 w-7 text-brand-accent" />
          </div>
          <h1 className="mt-6 text-4xl font-bold md:text-5xl">时间戳转换</h1>
          <p className="mt-4 text-gray-400">Unix 时间戳 ↔ 可读日期，实时时钟一目了然</p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl space-y-8">

          {/* Current Time */}
          <div className="rounded-xl border border-brand-border bg-brand-card p-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <RefreshCw className="h-3.5 w-3.5" />实时时钟
            </div>
            <div className="mt-4 grid gap-3 text-sm">
              <TimeRow label="当前时间戳（秒）" value={Math.floor(now / 1000).toString()} field="now-sec" now={now} copiedField={copiedField} onCopy={copy} />
              <TimeRow label="当前时间戳（毫秒）" value={now.toString()} field="now-ms" now={now} copiedField={copiedField} onCopy={copy} />
              <div className="flex items-center justify-between border-t border-brand-border/50 pt-3">
                <span className="text-gray-400">{nowFormatted.date} {nowFormatted.weekday}</span>
                <span className="font-mono text-lg font-semibold text-brand-accent">{nowFormatted.time}</span>
              </div>
              <div className="flex items-center justify-between border-t border-brand-border/50 pt-3">
                <span className="text-xs text-gray-500">ISO 8601</span>
                <TimeRow value={nowFormatted.iso} field="now-iso" now={now} copiedField={copiedField} onCopy={copy} compact />
              </div>
            </div>
          </div>

          {/* Unix → Date */}
          <div className="rounded-xl border border-brand-border bg-brand-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium">时间戳 → 日期</span>
              <div className="flex rounded-lg border border-brand-border overflow-hidden">
                <button onClick={() => { setUnit("sec"); setUnixInput(""); }} className={`px-3 py-1 text-xs transition ${unit === "sec" ? "bg-brand-accent text-white" : "bg-brand-bg text-gray-400 hover:text-white"}`}>秒</button>
                <button onClick={() => { setUnit("ms"); setUnixInput(""); }} className={`px-3 py-1 text-xs transition ${unit === "ms" ? "bg-brand-accent text-white" : "bg-brand-bg text-gray-400 hover:text-white"}`}>毫秒</button>
              </div>
            </div>
            <input
              type="text"
              value={unixInput}
              onChange={(e) => setUnixInput(e.target.value)}
              placeholder={unit === "sec" ? "输入秒级时间戳，如 1725400000" : "输入毫秒级时间戳，如 1725400000000"}
              className="mb-3 w-full rounded-lg border border-brand-border bg-brand-bg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-brand-accent/50 transition font-mono"
            />
            {unixResult ? (
              <div className="space-y-2 text-sm">
                <ResultRow label="本地时间" value={unixResult.full} field="unix-full" copiedField={copiedField} onCopy={copy} />
                <ResultRow label="ISO 8601" value={unixResult.iso} field="unix-iso" copiedField={copiedField} onCopy={copy} />
                <ResultRow label="日期" value={unixResult.date} field="unix-date" copiedField={copiedField} onCopy={copy} />
                <ResultRow label="时间" value={unixResult.time} field="unix-time" copiedField={copiedField} onCopy={copy} />
              </div>
            ) : unixInput && (
              <p className="text-sm text-red-400">无法解析，请输入有效数字</p>
            )}
          </div>

          {/* Date → Unix */}
          <div className="rounded-xl border border-brand-border bg-brand-card p-6">
            <div className="mb-4 font-medium">日期 → 时间戳</div>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="mb-3 w-full rounded-lg border border-brand-border bg-brand-bg px-4 py-2.5 text-sm text-white outline-none focus:border-brand-accent/50 transition"
            />
            {dateResult ? (
              <div className="space-y-2 text-sm">
                <ResultRow label="时间戳（秒）" value={dateResult.unixSec} field="date-sec" copiedField={copiedField} onCopy={copy} />
                <ResultRow label="时间戳（毫秒）" value={dateResult.unixMs} field="date-ms" copiedField={copiedField} onCopy={copy} />
                <ResultRow label="ISO 8601" value={dateResult.iso} field="date-iso" copiedField={copiedField} onCopy={copy} />
              </div>
            ) : dateInput && (
              <p className="text-sm text-red-400">无法解析，请检查日期格式</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <Link to="/tools" className="inline-flex items-center gap-1.5 text-gray-400 transition hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />返回工具列表
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function TimeRow({ label, value, field, now, copiedField, onCopy, compact }: {
  label?: string; value: string; field: string; now?: number; copiedField: string | null; onCopy: (v: string, f: string) => void; compact?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      {label && <span className="shrink-0 text-xs text-gray-500">{label}</span>}
      <span className="font-mono text-sm text-gray-200 truncate">{value}</span>
      <button onClick={() => onCopy(value, field)} className={`shrink-0 transition ${copiedField === field ? "text-brand-accent" : "text-gray-600 hover:text-white"}`}>
        {copiedField === field ? <CheckCircleIcon /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

function ResultRow({ label, value, field, copiedField, onCopy }: {
  label: string; value: string; field: string; copiedField: string | null; onCopy: (v: string, f: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 text-xs text-gray-500">{label}</span>
      <span className="font-mono text-sm text-gray-200">{value}</span>
      <button onClick={() => onCopy(value, field)} className={`shrink-0 transition ${copiedField === field ? "text-brand-accent" : "text-gray-600 hover:text-white"}`}>
        {copiedField === field ? <CheckCircleIcon /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
