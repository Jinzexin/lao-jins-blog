import { useState } from "react";
import { ArrowLeft, CheckCircle2, Copy, FileJson, XCircle } from "lucide-react";
import { Link } from "../components/Link";

export function JsonParser() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function parse() {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "JSON 格式错误";
      setError(msg);
      setOutput("");
    }
  }

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setError(null);
  }

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <section className="relative overflow-hidden px-6 pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e1e3a,transparent_70%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-accent/40 bg-brand-card">
            <FileJson className="h-7 w-7 text-brand-accent" />
          </div>
          <h1 className="mt-6 text-4xl font-bold md:text-5xl">JSON 在线解析</h1>
          <p className="mt-4 text-gray-400">粘贴 JSON 文本，一键格式化、校验并高亮展示</p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Input */}
            <div className="flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">输入 JSON</span>
                <button onClick={clearAll} className="text-xs text-gray-500 hover:text-white transition">清空</button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyUp={parse}
                placeholder='粘贴 JSON 数据，例如：{"name": "张三", "age": 25}'
                className="min-h-[400px] w-full resize-none rounded-lg border border-brand-border bg-brand-card p-4 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-brand-accent/50 transition font-mono"
                spellCheck={false}
              />
            </div>

            {/* Output */}
            <div className="flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">
                  格式化结果
                  {error ? null : output && <span className="ml-2 text-brand-accent">合法</span>}
                </span>
                {output && (
                  <button onClick={copyOutput} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition">
                    {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-brand-accent" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "已复制" : "复制"}
                  </button>
                )}
              </div>
              <div className={`min-h-[400px] flex-1 rounded-lg border p-4 font-mono text-sm leading-6 ${error ? "border-red-500/40 bg-red-950/20" : "border-brand-border bg-brand-card"}`}>
                {error ? (
                  <div className="flex items-start gap-2 text-red-400">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                ) : output ? (
                  <pre className="whitespace-pre-wrap break-all text-gray-200">{output}</pre>
                ) : (
                  <span className="text-gray-600">格式化结果将在此显示…</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <Link to="/tools" className="inline-flex items-center gap-1.5 text-gray-400 transition hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />返回工具列表
            </Link>
            <span>按 Enter 键快速格式化</span>
          </div>
        </div>
      </section>
    </div>
  );
}
