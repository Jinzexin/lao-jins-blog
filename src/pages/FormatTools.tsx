import { useMemo, useState, type ReactNode } from "react";
import { ToolButton, ToolCard, ToolLabel, ToolMessage, ToolResult, ToolSelect, ToolShell, ToolTextarea } from "../components/ToolShell";
import { copyText, downloadText } from "../lib/toolUtils";
import { parseCsv, parseYaml, stringifyCsv, stringifyYaml, type JsonValue } from "../lib/dataFormat";
import { formatSql } from "../lib/sqlFormat";

export function FormatTools() {
  return (
    <ToolShell
      title="格式转换与预览"
      description="在 JSON、YAML、CSV 之间转换，预览 Markdown，或快速整理 SQL。数据处理不会离开浏览器。"
      tabs={[
        { id: "convert", label: "JSON / YAML / CSV", content: <ConvertTab /> },
        { id: "markdown", label: "Markdown 预览", content: <MarkdownTab /> },
        { id: "sql", label: "SQL 格式化", content: <SqlTab /> },
      ]}
    />
  );
}

function ConvertTab() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [inputFormat, setInputFormat] = useState("json");
  const [outputFormat, setOutputFormat] = useState("yaml");
  const [error, setError] = useState("");

  function parseInput(): JsonValue {
    if (inputFormat === "json") return JSON.parse(input) as JsonValue;
    if (inputFormat === "yaml") return parseYaml(input);
    return parseCsv(input);
  }

  function convert() {
    setError("");
    setOutput("");
    try {
      let value = parseInput();
      if (outputFormat === "csv" && (!Array.isArray(value) || (value.length && typeof value[0] !== "object"))) {
        value = [value];
      }
      if (outputFormat === "json") setOutput(JSON.stringify(value, null, 2));
      else if (outputFormat === "yaml") setOutput(stringifyYaml(value));
      else setOutput(stringifyCsv(value));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "转换失败，请检查内容格式");
    }
  }

  return (
    <div className="space-y-5">
      <ToolCard title="转换设置">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <ToolLabel htmlFor="input-format">输入格式</ToolLabel>
            <ToolSelect id="input-format" value={inputFormat} onChange={setInputFormat} options={[
              { value: "json", label: "JSON" },
              { value: "yaml", label: "YAML" },
              { value: "csv", label: "CSV" },
            ]} />
          </div>
          <div>
            <ToolLabel htmlFor="output-format">输出格式</ToolLabel>
            <ToolSelect id="output-format" value={outputFormat} onChange={setOutputFormat} options={[
              { value: "json", label: "JSON" },
              { value: "yaml", label: "YAML" },
              { value: "csv", label: "CSV" },
            ]} />
          </div>
        </div>
      </ToolCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <ToolCard title="输入内容">
          <ToolTextarea id="format-input" value={input} onChange={setInput} rows={14} placeholder={
            inputFormat === "csv" ? "name,age\nAlice,18" : inputFormat === "yaml" ? "name: Alice\nage: 18" : '{"name":"Alice","age":18}'
          } />
          <div className="mt-4 flex flex-wrap gap-3">
            <ToolButton primary onClick={convert} disabled={!input.trim()}>转换</ToolButton>
            <ToolButton onClick={() => copyText(output)} disabled={!output}>复制</ToolButton>
            <ToolButton onClick={() => downloadText(`converted.${outputFormat}`, output)} disabled={!output}>下载</ToolButton>
          </div>
        </ToolCard>
        <ToolCard title="转换结果">
          {error ? <ToolMessage kind="error">{error}</ToolMessage> : null}
          <ToolResult className={`whitespace-pre-wrap ${error ? "mt-3" : ""}`}>
            {output || <span className="text-gray-600">结果将在此显示…</span>}
          </ToolResult>
        </ToolCard>
      </div>
    </div>
  );
}

function MarkdownTab() {
  const [markdown, setMarkdown] = useState("# 标题\n\n这是一段支持 **加粗**、*斜体* 和 `代码` 的文本。\n\n- 项目一\n- 项目二\n\n> 引用内容");
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ToolCard title="Markdown 源码">
        <ToolTextarea id="markdown-input" value={markdown} onChange={setMarkdown} rows={20} />
      </ToolCard>
      <ToolCard title="预览">
        <article className="max-h-[640px] overflow-auto text-sm leading-7 text-gray-300">
          <MarkdownView value={markdown} />
        </article>
      </ToolCard>
    </div>
  );
}

function MarkdownView({ value }: { value: string }) {
  const blocks = useMemo(() => renderMarkdown(value), [value]);
  return <div className="space-y-3">{blocks}</div>;
}

function renderMarkdown(value: string): ReactNode[] {
  const lines = value.split(/\r?\n/);
  const nodes: ReactNode[] = [];
  let index = 0;
  let key = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index += 1; continue; }
    if (line.trim() === "```") {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== "```") { code.push(lines[index]); index += 1; }
      index += 1;
      nodes.push(<pre key={key++} className="overflow-auto border border-brand-border bg-brand-code p-4 font-mono text-xs text-gray-200">{code.join("\n")}</pre>);
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const sizes = ["text-3xl", "text-2xl", "text-xl", "text-lg", "text-base", "text-sm"];
      nodes.push(<h3 key={key++} className={`font-semibold text-white ${sizes[level - 1]}`}>{renderInline(heading[2])}</h3>);
      index += 1; continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      nodes.push(<hr key={key++} className="border-brand-border" />);
      index += 1; continue;
    }
    if (line.trim().startsWith("> ")) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("> ")) { quote.push(lines[index].trim().slice(2)); index += 1; }
      nodes.push(<blockquote key={key++} className="border-l-2 border-brand-accent/60 pl-4 text-gray-400">{renderInline(quote.join(" "))}</blockquote>);
      continue;
    }
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*[-*+]\s+/.test(lines[index])) { items.push(lines[index].replace(/^\s*[-*+]\s+/, "")); index += 1; }
      nodes.push(<ul key={key++} className="list-disc space-y-1 pl-5">{items.map((item, itemKey) => <li key={itemKey}>{renderInline(item)}</li>)}</ul>);
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) { items.push(lines[index].replace(/^\s*\d+\.\s+/, "")); index += 1; }
      nodes.push(<ol key={key++} className="list-decimal space-y-1 pl-5">{items.map((item, itemKey) => <li key={itemKey}>{renderInline(item)}</li>)}</ol>);
      continue;
    }
    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !/^(#{1,6}\s|>\s|\s*[-*+]\s|\s*\d+\.\s|```)/.test(lines[index])) {
      paragraph.push(lines[index]); index += 1;
    }
    nodes.push(<p key={key++}>{renderInline(paragraph.join(" "))}</p>);
  }
  return nodes;
}

function renderInline(value: string): ReactNode[] {
  return value.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean).map((part, key) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={key} className="rounded bg-brand-code px-1.5 py-0.5 font-mono text-brand-accent">{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={key} className="text-white">{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <a key={key} href={link[2]} target="_blank" rel="noreferrer" className="text-brand-accent underline">{link[1]}</a>;
    return <span key={key}>{part}</span>;
  });
}

function SqlTab() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function format() {
    try {
      setOutput(formatSql(input));
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "SQL 格式化失败");
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ToolCard title="SQL 输入">
        <ToolTextarea id="sql-input" value={input} onChange={setInput} rows={18} placeholder="SELECT id,name FROM users WHERE age > 18" />
        <div className="mt-4 flex flex-wrap gap-3">
          <ToolButton primary onClick={format} disabled={!input.trim()}>格式化</ToolButton>
          <ToolButton onClick={() => copyText(output)} disabled={!output}>复制</ToolButton>
        </div>
      </ToolCard>
      <ToolCard title="格式化结果">
        {error ? <ToolMessage kind="error">{error}</ToolMessage> : null}
        <ToolResult className={error ? "mt-3" : ""}>
          <pre className="whitespace-pre-wrap font-mono">{output || <span className="text-gray-600">格式化 SQL 将在此显示…</span>}</pre>
        </ToolResult>
      </ToolCard>
    </div>
  );
}
