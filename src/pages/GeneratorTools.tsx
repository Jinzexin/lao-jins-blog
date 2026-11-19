import { useState } from "react";
import { ToolButton, ToolCard, ToolInput, ToolLabel, ToolMessage, ToolResult, ToolShell, ToolTextarea } from "../components/ToolShell";
import { copyText, downloadText, readFileAsDataUrl } from "../lib/toolUtils";

interface BarcodeLike {
  detect(source: string): Promise<Array<{ rawValue: string }>>;
}

export function GeneratorTools() {
  return (
    <ToolShell
      title="生成工具"
      description="生成 UUID、随机密码和二维码，解析二维码图片，或快速理解 Cron 表达式。"
      tabs={[
        { id: "uuid", label: "UUID", content: <UuidTab /> },
        { id: "password", label: "随机密码", content: <PasswordTab /> },
        { id: "qr", label: "二维码", content: <QrTab /> },
        { id: "cron", label: "Cron 解释", content: <CronTab /> },
      ]}
    />
  );
}

function UuidTab() {
  const [items, setItems] = useState<string[]>([]);
  const [count, setCount] = useState("5");

  function generate() {
    const total = Math.min(Math.max(Number(count) || 1, 1), 100);
    setItems(Array.from({ length: total }, () => crypto.randomUUID()));
  }

  return (
    <ToolCard title="UUID v4 生成器">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-32">
          <ToolLabel htmlFor="uuid-count">生成数量</ToolLabel>
          <ToolInput id="uuid-count" type="number" value={count} onChange={setCount} />
        </div>
        <ToolButton primary onClick={generate}>生成</ToolButton>
        <ToolButton onClick={() => copyText(items.join("\n"))} disabled={!items.length}>复制全部</ToolButton>
        <ToolButton onClick={() => downloadText("uuids.txt", items.join("\n"))} disabled={!items.length}>下载</ToolButton>
      </div>
      {items.length ? <ToolResult className="mt-5 max-h-[480px] font-mono">{items.join("\n")}</ToolResult> : null}
    </ToolCard>
  );
}

function PasswordTab() {
  const [length, setLength] = useState("18");
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");

  function generate() {
    let alphabet = "";
    if (uppercase) alphabet += "ABCDEFGHJKLMNPQRSTUVWXYZ";
    if (lowercase) alphabet += "abcdefghijkmnpqrstuvwxyz";
    if (numbers) alphabet += "23456789";
    if (symbols) alphabet += "!@#$%^&*()-_=+[]{};:,.<>?";
    if (!alphabet) { setPassword(""); return; }
    const size = Math.min(Math.max(Number(length) || 12, 6), 128);
    const values = new Uint32Array(size);
    crypto.getRandomValues(values);
    setPassword(Array.from(values, (value) => alphabet[value % alphabet.length]).join(""));
  }

  const checks = [
    { label: "大写字母", value: uppercase, onChange: setUppercase },
    { label: "小写字母", value: lowercase, onChange: setLowercase },
    { label: "数字", value: numbers, onChange: setNumbers },
    { label: "特殊字符", value: symbols, onChange: setSymbols },
  ];

  return (
    <ToolCard title="随机密码">
      <div className="grid gap-5 md:grid-cols-[180px_1fr]">
        <div>
          <ToolLabel htmlFor="password-length">长度（6-128）</ToolLabel>
          <ToolInput id="password-length" type="number" value={length} onChange={setLength} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {checks.map((check) => (
            <label key={check.label} className="flex items-center gap-3 border border-brand-border bg-brand-bg px-4 py-2.5 text-sm text-gray-300">
              <input type="checkbox" checked={check.value} onChange={(event) => check.onChange(event.target.checked)} className="accent-[rgb(var(--c-accent))]" />
              {check.label}
            </label>
          ))}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <ToolButton primary onClick={generate}>生成密码</ToolButton>
        <ToolButton onClick={() => copyText(password)} disabled={!password}>复制</ToolButton>
      </div>
      <ToolResult className="mt-4 font-mono">{password || <span className="text-gray-600">密码将在此显示…</span>}</ToolResult>
    </ToolCard>
  );
}

function QrTab() {
  const [content, setContent] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [parsed, setParsed] = useState<string[]>([]);
  const [error, setError] = useState("");

  function generate() {
    if (!content.trim()) return;
    setError("");
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=14&data=${encodeURIComponent(content)}`);
  }

  async function parseImage(file: File) {
    setError("");
    setParsed([]);
    try {
      const holder = window as unknown as { BarcodeDetector?: new (options: { formats: string[] }) => BarcodeLike };
      if (!holder.BarcodeDetector) {
        setError("当前浏览器不支持 BarcodeDetector，请使用新版 Chrome 或 Edge。");
        return;
      }
      const detector = new holder.BarcodeDetector({ formats: ["qr_code"] });
      const source = await readFileAsDataUrl(file);
      const results = await detector.detect(source);
      if (!results.length) {
        setError("未在图片中识别到二维码。");
        return;
      }
      setParsed(results.map((item) => item.rawValue));
    } catch {
      setError("二维码解析失败，请换一张更清晰的图片。");
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <ToolCard title="生成二维码">
          <ToolLabel htmlFor="qr-content">二维码内容</ToolLabel>
          <ToolTextarea id="qr-content" value={content} onChange={setContent} rows={7} placeholder="输入网址或文本" />
          <div className="mt-4 flex flex-wrap gap-3">
            <ToolButton primary onClick={generate} disabled={!content.trim()}>生成</ToolButton>
            <ToolButton onClick={() => downloadText("qr-link.txt", qrUrl)} disabled={!qrUrl}>保存图片链接</ToolButton>
          </div>
          {qrUrl ? (
            <div className="mt-5 border border-brand-border bg-white p-4">
              <img src={qrUrl} alt="生成的二维码" className="mx-auto h-[280px] w-[280px]" />
            </div>
          ) : null}
        </ToolCard>
        <ToolCard title="解析二维码图片">
          <label className="flex cursor-pointer items-center justify-center border border-dashed border-brand-border bg-brand-bg px-4 py-10 text-sm text-gray-400 transition hover:border-brand-accent/40 hover:text-white">
            选择二维码图片
            <input type="file" accept="image/*" className="hidden" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void parseImage(file);
            }} />
          </label>
          {error ? <div className="mt-4"><ToolMessage kind="error">{error}</ToolMessage></div> : null}
          {parsed.length ? <ToolResult className="mt-4 break-all font-mono">{parsed.join("\n")}</ToolResult> : null}
        </ToolCard>
      </div>
      <ToolMessage>生成二维码使用公共图片服务，请勿包含敏感内容；二维码图片解析完全在本机浏览器中完成。</ToolMessage>
    </div>
  );
}

function CronTab() {
  const [expression, setExpression] = useState("*/10 9-18 * * 1-5");
  const result = explainCron(expression);

  return (
    <ToolCard title="Cron 表达式解释器">
      <ToolLabel htmlFor="cron-input">五段 Cron 表达式</ToolLabel>
      <ToolInput id="cron-input" value={expression} onChange={setExpression} placeholder="分 时 日 月 周" />
      <ToolResult className="mt-5 whitespace-pre-wrap">{result.description}</ToolResult>
      <div className="mt-4">
        <ToolMessage kind={result.valid ? "success" : "error"}>
          {result.valid ? "表达式结构有效。" : result.error}
        </ToolMessage>
      </div>
    </ToolCard>
  );
}

function explainCron(expression: string): { valid: boolean; description: string; error?: string } {
  const labels = ["分钟", "小时", "日期", "月份", "星期"];
  const ranges = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 7]];
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { valid: false, description: "请输入完整的五段表达式：分 时 日 月 周。", error: "段数必须是 5。" };
  }
  const descriptions: string[] = [];
  for (let index = 0; index < parts.length; index += 1) {
    const explanation = explainField(parts[index], ranges[index][0], ranges[index][1], labels[index]);
    if (!explanation.valid) {
      return { valid: false, description: "表达式无效，请检查每个字段。", error: `${labels[index]}：${explanation.error}` };
    }
    descriptions.push(explanation.text);
  }
  return { valid: true, description: descriptions.join("，") + "。" };
}

function explainField(field: string, min: number, max: number, label: string): { valid: boolean; text: string; error?: string } {
  if (field === "*") return { valid: true, text: `每${label}` };
  if (field.startsWith("*/")) {
    const step = Number(field.slice(2));
    if (!Number.isInteger(step) || step <= 0) return { valid: false, text: "", error: "步长必须是正整数。" };
    return { valid: true, text: `每 ${step} ${label}` };
  }

  const values = new Set<number>();
  for (const chunk of field.split(",")) {
    if (!chunk) return { valid: false, text: "", error: "存在空值。" };
    const range = chunk.split("-");
    if (range.length > 2) return { valid: false, text: "", error: "范围格式无效。" };
    let start = range[0] === "*" ? min : Number(range[0]);
    let end = range.length === 2 ? Number(range[1]) : start;
    if (start === 7 && max === 7) start = 0;
    if (end === 7 && max === 7) end = 0;
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < min || end > max || start > end) {
      return { valid: false, text: "", error: `允许范围是 ${min}-${max}。` };
    }
    for (let value = start; value <= end; value += 1) values.add(value);
  }
  return { valid: true, text: `${label}为 ${Array.from(values).sort((a, b) => a - b).join("、")}` };
}
