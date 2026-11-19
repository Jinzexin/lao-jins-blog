export function formatSql(input: string): string {
  const protectedParts: string[] = [];
  let text = input.replace(/('(?:''|[^'])*'|"(?:[^"]|"")*"|`(?:[^`]|``)*`|--[^\n]*|\/\*[\s\S]*?\*\/)/g, (part) => {
    protectedParts.push(part);
    return `@@SQL_TOKEN_${protectedParts.length - 1}@@`;
  });

  text = text
    .replace(/\s+/g, " ")
    .replace(/\s*([,;()])\s*/g, "$1")
    .replace(/\b(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|OFFSET|UNION ALL|UNION|LEFT JOIN|RIGHT JOIN|FULL JOIN|INNER JOIN|CROSS JOIN|JOIN|ON|VALUES|INSERT INTO|UPDATE|SET|DELETE FROM)\b/gi, (word) => `\n${word.toUpperCase()}`)
    .replace(/\bAND\b|\bOR\b/gi, (word) => `\n  ${word.toUpperCase()}`)
    .replace(/,(?![\s\n])/g, ",\n  ");

  let indent = 0;
  return text
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^(FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|OFFSET|UNION ALL|UNION|LEFT JOIN|RIGHT JOIN|FULL JOIN|INNER JOIN|CROSS JOIN|JOIN|ON|VALUES|SET)$/i.test(line)) indent = Math.max(0, indent);
      const formatted = "  ".repeat(indent) + line
        .replace(/,/g, ",\n")
        .split("\n")
        .map((part, index) => index === 0 ? part : `${"  ".repeat(indent + 1)}${part.trim()}`)
        .join("\n");
      indent += (line.match(/\(/g)?.length ?? 0) - (line.match(/\)/g)?.length ?? 0);
      indent = Math.max(0, indent);
      return formatted;
    })
    .join("\n")
    .replace(/;/g, ";\n")
    .replace(/@@SQL_TOKEN_(\d+)@@/g, (_, index) => protectedParts[Number(index)]);
}
