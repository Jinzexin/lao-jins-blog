export type JsonScalar = string | number | boolean | null;
export type JsonValue = JsonScalar | JsonValue[] | { [key: string]: JsonValue };

export function parseCsv(text: string): JsonValue[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; }
        else quoted = false;
      } else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += char;
  }
  row.push(field);
  rows.push(row);

  const meaningful = rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
  if (!meaningful.length) return [];
  const headers = meaningful[0].map((header) => header.trim());
  return meaningful.slice(1).map((cells) => {
    const record: { [key: string]: JsonValue } = {};
    headers.forEach((header, index) => {
      const raw = cells[index]?.trim() ?? "";
      record[header] = raw === "" ? "" : parseScalar(raw);
    });
    return record;
  });
}

function csvCell(value: JsonValue): string {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function stringifyCsv(value: JsonValue): string {
  if (!Array.isArray(value)) throw new Error("CSV 输出需要是一个数组");
  if (!value.length) return "";
  const first = value[0];
  if (typeof first !== "object" || first === null || Array.isArray(first)) {
    return value.map((item) => csvCell(item as JsonValue)).join("\n");
  }
  const records = value as Array<{ [key: string]: JsonValue }>;
  const headers = Array.from(new Set(records.flatMap((record) => Object.keys(record))));
  const rows = [headers.map(csvCell).join(",")];
  records.forEach((record) => {
    rows.push(headers.map((header) => csvCell(record[header] ?? "")).join(","));
  });
  return rows.join("\n");
}

export function parseScalar(value: string): JsonScalar {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(null|Null|NULL|~)$/.test(trimmed)) return null;
  if (/^(true|True|TRUE)$/.test(trimmed)) return true;
  if (/^(false|False|FALSE)$/.test(trimmed)) return false;
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  if (/^-?\d*\.\d+(e[+-]?\d+)?$/i.test(trimmed)) return Number(trimmed);
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).replaceAll('\\"', '"').replaceAll("\\n", "\n");
  }
  return trimmed;
}

export function stringifyYaml(value: JsonValue, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (value === null) return "null";
  if (typeof value !== "object") {
    if (typeof value !== "string") return String(value);
    const specialCharacters = ":{}[],&*?##|>-!%@`\"'\n";
    return specialCharacters.split("").some((character) => value.includes(character)) ? JSON.stringify(value) : value;
  }
  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    return value.map((item) => {
      if (item !== null && typeof item === "object") {
        const nested = stringifyObjectEntries(item as { [key: string]: JsonValue }, indent + 1);
        const firstLine = nested.split("\n")[0];
        const rest = nested.split("\n").slice(1).join("\n");
        return `${pad}- ${firstLine}${rest ? `\n${rest}` : ""}`;
      }
      return `${pad}- ${stringifyYaml(item)}`;
    }).join("\n");
  }
  return stringifyObjectEntries(value as { [key: string]: JsonValue }, indent);
}

function stringifyObjectEntries(record: { [key: string]: JsonValue }, indent: number): string {
  const pad = "  ".repeat(indent);
  return Object.entries(record).map(([key, item]) => {
    if (item !== null && typeof item === "object") {
      const nested = stringifyYaml(item, indent + 1);
      return `${pad}${key}:\n${nested}`;
    }
    return `${pad}${key}: ${stringifyYaml(item)}`;
  }).join("\n");
}

export function parseYaml(text: string): JsonValue {
  const trimmed = text.trim();
  if (!trimmed) return "";
  try { return JSON.parse(trimmed) as JsonValue; } catch { /* fall through to YAML */ }
  const lines = text.replaceAll("\t", "  ").split(/\r?\n/);
  const [value] = parseBlock(lines, 0, 0);
  return value;
}

function parseBlock(lines: string[], start: number, indent: number): [JsonValue, number] {
  let index = start;
  while (index < lines.length && (!lines[index].trim() || lines[index].trim().startsWith("#"))) index += 1;
  if (index >= lines.length) return [null, index];
  const currentIndent = lines[index].match(/^\s*/)?.[0].length ?? 0;
  if (lines[index].trim().startsWith("- ")) return parseArray(lines, index, currentIndent);
  if (currentIndent < indent) return [null, index];
  return parseObject(lines, index, currentIndent);
}

function parseArray(lines: string[], start: number, indent: number): [JsonValue[], number] {
  const result: JsonValue[] = [];
  let index = start;
  while (index < lines.length) {
    const raw = lines[index];
    if (!raw.trim() || raw.trim().startsWith("#")) { index += 1; continue; }
    const currentIndent = raw.match(/^\s*/)?.[0].length ?? 0;
    if (currentIndent !== indent || !raw.trim().startsWith("- ")) break;
    const content = raw.trim().slice(2).trim();
    if (!content) {
      const [child, next] = parseBlock(lines, index + 1, indent + 1);
      result.push(child);
      index = next;
    } else if (content.includes(":")) {
      const [key, rest] = splitMappingLine(content);
      const record: { [key: string]: JsonValue } = {};
      if (rest) record[key] = parseScalar(rest);
      const [child, next] = parseBlock(lines, index + 1, indent + 2);
      if (child !== null && typeof child === "object" && !Array.isArray(child)) Object.assign(record, child);
      if (!(key in record)) record[key] = child;
      result.push(record);
      index = next;
    } else {
      result.push(parseScalar(content));
      index += 1;
    }
  }
  return [result, index];
}

function parseObject(lines: string[], start: number, indent: number): [{ [key: string]: JsonValue } | JsonValue, number] {
  const record: { [key: string]: JsonValue } = {};
  let index = start;
  let sawMapping = false;
  while (index < lines.length) {
    const raw = lines[index];
    if (!raw.trim() || raw.trim().startsWith("#")) { index += 1; continue; }
    const currentIndent = raw.match(/^\s*/)?.[0].length ?? 0;
    if (currentIndent < indent) break;
    if (currentIndent === indent && raw.trim().startsWith("- ")) break;
    if (currentIndent !== indent) throw new Error("YAML 缩进不一致");
    const [key, rest] = splitMappingLine(raw.trim());
    sawMapping = true;
    if (rest) record[key] = parseScalar(rest);
    else {
      let next = index + 1;
      while (next < lines.length && (!lines[next].trim() || lines[next].trim().startsWith("#"))) next += 1;
      const childIndent = next < lines.length ? lines[next].match(/^\s*/)?.[0].length ?? 0 : indent;
      const isChildArray = next < lines.length && lines[next].trim().startsWith("- ");
      if (next >= lines.length || (!isChildArray && childIndent <= indent)) record[key] = null;
      else {
        const [child, consumed] = parseBlock(lines, next, isChildArray ? indent : childIndent);
        record[key] = child;
        index = consumed - 1;
      }
    }
    index += 1;
  }
  if (!sawMapping && start < lines.length) return [parseScalar(lines[start].trim()), start + 1];
  return [record, index];
}

function splitMappingLine(line: string): [string, string] {
  const quoted = /^["'][^"']+["']\s*:/.test(line);
  const colon = quoted ? line.indexOf(":", 1) : line.indexOf(":");
  if (colon < 0) throw new Error(`无效的 YAML 行：${line}`);
  const key = line.slice(0, colon).trim().replace(/^["']|["']$/g, "");
  return [key, line.slice(colon + 1).trim()];
}
