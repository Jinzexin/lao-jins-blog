import { useMemo, useState } from "react";
import { ToolButton, ToolCard, ToolInput, ToolLabel, ToolMessage, ToolResult, ToolSelect, ToolShell, ToolTextarea } from "../components/ToolShell";
import { copyText } from "../lib/toolUtils";
import { hashText, md5 } from "../lib/textHash";
import { diffLines } from "../lib/textDiff";

type DiffLine = ReturnType<typeof diffLines>[number];

export function TextTools() {
  return (
    <ToolShell
      title="文本工具箱"
      description="编码解码、哈希计算、正则测试、文本对比和字数统计。全部处理都在浏览器中完成。"
      tabs={[
        { id: "codec", label: "Base64 / URL", content: <CodecTab /> },
        { id: "hash", label: "哈希", content: <HashTab /> },
        { id: "regex", label: "正则测试", content: <RegexTab /> },
        { id: "diff", label: "文本对比", content: <DiffTab /> },
        { id: "count", label: "字数统计", content: <CountTab /> },
      ]}
    />
  );
}

function CodecTab() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"base64" | "url">("base64");
  const [action, setAction] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  function convert() {
    setError("");
    try {
      if (mode === "base64") {
        if (action === "encode") setOutput(btoa(String.fromCharCode(...new TextEncoder().encode(input))));
        else setOutput(new TextDecoder().decode(Uint8Array.from(atob(input.trim()), (char) => char.charCodeAt(0))));
      } else if (action === "encode") setOutput(encodeURIComponent(input));
      else setOutput(decodeURIComponent(input.replaceAll("+", "%20")));
    } catch {
      setError("解码失败，请确认输入内容与所选编码一致。");
      setOutput("");
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ToolCard title="输入">
        <div className="mb-4 grid grid-cols-2 gap-3">
          <ToolSelect id="codec-mode" value={mode} onChange={(value) => setMode(value as typeof mode)} options={[
            { value: "base64", label: "Base64" },
            { value: "url", label: "URL 编码" },
          ]} />
          <ToolSelect id="codec-action" value={action} onChange={(value) => setAction(value as typeof action)} options={[
            { value: "encode", label: "编码" },
            { value: "decode", label: "解码" },
          ]} />
        </div>
        <ToolLabel htmlFor="codec-input">原文或编码内容</ToolLabel>
        <ToolTextarea id="codec-input" value={input} onChange={setInput} rows={10} placeholder="粘贴需要处理的文本" />
        <div className="mt-4 flex gap-3">
          <ToolButton primary onClick={convert} disabled={!input.trim()}>转换</ToolButton>
          <ToolButton onClick={() => copyText(output)} disabled={!output}>复制结果</ToolButton>
        </div>
      </ToolCard>
      <ToolCard title="结果">
        {error ? <ToolMessage kind="error">{error}</ToolMessage> : null}
        <ToolResult className={error ? "mt-3" : ""}>
          {output || <span className="text-gray-600">转换结果将在此显示…</span>}
        </ToolResult>
      </ToolCard>
    </div>
  );
}

function HashTab() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<"MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512">("SHA-256");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);

  async function calculate() {
    if (!input) return;
    setBusy(true);
    try {
      setResult(algorithm === "MD5" ? md5(input) : await hashText(input, algorithm));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ToolCard title="输入">
        <ToolLabel htmlFor="hash-input">待哈希文本</ToolLabel>
        <ToolTextarea id="hash-input" value={input} onChange={setInput} rows={10} placeholder="输入任意文本" />
        <div className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr]">
          <ToolSelect id="hash-algorithm" value={algorithm} onChange={(value) => setAlgorithm(value as typeof algorithm)} options={[
            { value: "MD5", label: "MD5" },
            { value: "SHA-1", label: "SHA-1" },
            { value: "SHA-256", label: "SHA-256" },
            { value: "SHA-384", label: "SHA-384" },
            { value: "SHA-512", label: "SHA-512" },
          ]} />
          <ToolButton primary onClick={calculate} disabled={!input.trim() || busy}>{busy ? "计算中…" : "计算哈希"}</ToolButton>
        </div>
      </ToolCard>
      <ToolCard title="哈希值">
        <ToolResult className="break-all">{result || <span className="text-gray-600">计算结果将在此显示…</span>}</ToolResult>
        <div className="mt-4"><ToolButton onClick={() => copyText(result)} disabled={!result}>复制</ToolButton></div>
      </ToolCard>
    </div>
  );
}

function RegexTab() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [replacement, setReplacement] = useState("");
  const [text, setText] = useState("");

  const result = useMemo(() => {
    if (!pattern || !text) return { matches: [] as RegExpMatchArray[], replaced: text, error: "" };
    try {
      const matcher = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
      const matches = Array.from(text.matchAll(matcher));
      const replaced = text.replace(new RegExp(pattern, flags), replacement);
      return { matches: matches.slice(0, 200), replaced, error: "" };
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "正则表达式无效";
      return { matches: [], replaced: text, error: message };
    }
  }, [pattern, flags, replacement, text]);

  return (
    <div className="space-y-5">
      <ToolCard title="正则设置">
        <div className="grid gap-4 md:grid-cols-[1fr_140px_1fr]">
          <div>
            <ToolLabel htmlFor="regex-pattern">表达式</ToolLabel>
            <ToolInput id="regex-pattern" value={pattern} onChange={setPattern} placeholder="例如：[\u4e00-\u9fa5]{2,}" />
          </div>
          <div>
            <ToolLabel htmlFor="regex-flags">标志</ToolLabel>
            <ToolInput id="regex-flags" value={flags} onChange={setFlags} placeholder="gmi" />
          </div>
          <div>
            <ToolLabel htmlFor="regex-replace">替换为</ToolLabel>
            <ToolInput id="regex-replace" value={replacement} onChange={setReplacement} placeholder="可使用 $1、$2" />
          </div>
        </div>
      </ToolCard>
      <div className="grid gap-5 lg:grid-cols-2">
        <ToolCard title="测试文本">
          <ToolTextarea id="regex-text" value={text} onChange={setText} rows={12} placeholder="粘贴要匹配的文本" />
        </ToolCard>
        <ToolCard title="匹配结果">
          {result.error ? <ToolMessage kind="error">{result.error}</ToolMessage> : null}
          <ToolResult>
            {result.matches.length ? (
              <ul className="space-y-2">
                {result.matches.map((match, index) => (
                  <li key={`${match.index}-${index}`} className="break-all">
                    <span className="text-gray-500">#{index + 1} · 位置 {match.index}</span>
                    <div className="mt-1 font-mono text-brand-accent">{match[0]}</div>
                    {match.length > 1 ? <div className="mt-1 text-xs text-gray-500">分组：{match.slice(1).map((group) => group ?? "—").join(" | ")}</div> : null}
                  </li>
                ))}
              </ul>
            ) : <span className="text-gray-600">没有匹配结果…</span>}
          </ToolResult>
          <ToolLabel htmlFor="regex-replaced"><span>替换结果</span></ToolLabel>
          <ToolTextarea id="regex-replaced" value={result.replaced} readOnly rows={8} />
        </ToolCard>
      </div>
    </div>
  );
}

function DiffTab() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [result, setResult] = useState<DiffLine[] | null>(null);
  const [error, setError] = useState("");

  function compare() {
    try {
      setResult(diffLines(left, right));
      setError("");
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "对比失败");
    }
  }

  const added = result?.filter((line) => line.type === "added").length ?? 0;
  const removed = result?.filter((line) => line.type === "removed").length ?? 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <ToolCard title="原文本">
          <ToolTextarea id="diff-left" value={left} onChange={setLeft} rows={12} />
        </ToolCard>
        <ToolCard title="新文本">
          <ToolTextarea id="diff-right" value={right} onChange={setRight} rows={12} />
        </ToolCard>
      </div>
      <div className="flex items-center gap-4">
        <ToolButton primary onClick={compare}>逐行对比</ToolButton>
        {result ? <span className="text-sm text-gray-400">新增 {added} 行，删除 {removed} 行</span> : null}
      </div>
      {error ? <ToolMessage kind="error">{error}</ToolMessage> : null}
      {result ? (
        <ToolCard title="对比结果">
          <ToolResult className="max-h-[520px]">
            {result.map((line, index) => (
              <div
                key={`${index}-${line.type}`}
                className={`flex gap-3 px-2 py-1 font-mono ${
                  line.type === "added" ? "bg-brand-accent/10 text-brand-accent"
                    : line.type === "removed" ? "bg-brand-error-bg text-brand-error"
                      : "text-gray-400"
                }`}
              >
                <span className="w-10 shrink-0 text-right text-xs opacity-60">{line.left ?? ""}</span>
                <span className="w-10 shrink-0 text-right text-xs opacity-60">{line.right ?? ""}</span>
                <span className="w-4 shrink-0">{line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}</span>
                <span className="whitespace-pre-wrap break-all">{line.text || " "}</span>
              </div>
            ))}
          </ToolResult>
        </ToolCard>
      ) : null}
    </div>
  );
}

function CountTab() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const chinese = (text.match(/[\u4e00-\u9fff]/g) ?? []).length;
    const englishWords = trimmed ? (trimmed.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) ?? []).length : 0;
    return {
      characters: text.length,
      charactersNoSpace: text.replaceAll(/\s/g, "").length,
      chinese,
      englishWords,
      words: chinese + englishWords,
      lines: text ? text.split(/\r?\n/).length : 0,
      paragraphs: trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0,
      sentences: trimmed ? (trimmed.match(/[。！？.!?\n]+/g) ?? []).length : 0,
    };
  }, [text]);

  const rows = [
    ["总字符", stats.characters], ["不含空格", stats.charactersNoSpace], ["中文字符", stats.chinese],
    ["英文单词", stats.englishWords], ["混合字数", stats.words], ["行数", stats.lines],
    ["段落数", stats.paragraphs], ["句子数", stats.sentences],
  ] as const;

  return (
    <ToolCard title="实时统计">
      <ToolTextarea id="count-input" value={text} onChange={setText} rows={14} placeholder="粘贴文章或文本" />
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {rows.map(([label, value]) => (
          <div key={label} className="border border-brand-border bg-brand-bg p-4">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="mt-2 font-mono text-xl text-brand-accent">{value}</div>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}
