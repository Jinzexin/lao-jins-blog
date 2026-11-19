export interface DiffLine {
  type: "same" | "added" | "removed";
  text: string;
  left: number | null;
  right: number | null;
}

export function diffLines(leftText: string, rightText: string): DiffLine[] {
  const left = leftText.split(/\r?\n/);
  const right = rightText.split(/\r?\n/);
  if (left.length * right.length > 1_000_000) throw new Error("文本过长，请先截取后再比较");

  const lcs: number[][] = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0));
  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      lcs[i][j] = left[i] === right[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      result.push({ type: "same", text: left[i], left: i + 1, right: j + 1 });
      i += 1; j += 1;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      result.push({ type: "removed", text: left[i], left: i + 1, right: null });
      i += 1;
    } else {
      result.push({ type: "added", text: right[j], left: null, right: j + 1 });
      j += 1;
    }
  }
  while (i < left.length) { result.push({ type: "removed", text: left[i], left: i + 1, right: null }); i += 1; }
  while (j < right.length) { result.push({ type: "added", text: right[j], left: null, right: j + 1 }); j += 1; }
  return result;
}
