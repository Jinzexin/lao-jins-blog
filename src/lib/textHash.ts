function rotateLeft(value: number, count: number) {
  return (value << count) | (value >>> (32 - count));
}

function addUnsigned(a: number, b: number) {
  return (a + b) | 0;
}

function md5ToHex(bytes: number[]) {
  return bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function md5(input: string): string {
  const text = new TextEncoder().encode(input);
  const originalLength = text.length;
  const withPadding: number[] = [...text, 0x80];
  while (withPadding.length % 64 !== 56) withPadding.push(0);
  const bitLength = originalLength * 8;
  for (let i = 0; i < 8; i += 1) withPadding.push((bitLength >>> (8 * i)) & 0xff);

  const s = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  const k = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32));
  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let chunk = 0; chunk < withPadding.length; chunk += 64) {
    const m: number[] = [];
    for (let i = 0; i < 16; i += 1) {
      const start = chunk + i * 4;
      m.push(withPadding[start] | (withPadding[start + 1] << 8) | (withPadding[start + 2] << 16) | (withPadding[start + 3] << 24));
    }
    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;
    for (let i = 0; i < 64; i += 1) {
      let f: number;
      let g: number;
      if (i < 16) { f = (b & c) | (~b & d); g = i; }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; }
      const temp = d;
      d = c;
      c = b;
      const rotated = rotateLeft(addUnsigned(addUnsigned(a, f), addUnsigned(k[i], m[g])), s[i % 4 + Math.floor(i / 16) * 4]);
      b = addUnsigned(b, rotated);
      a = temp;
    }
    a0 = addUnsigned(a0, a);
    b0 = addUnsigned(b0, b);
    c0 = addUnsigned(c0, c);
    d0 = addUnsigned(d0, d);
  }

  const output = [a0, b0, c0, d0].flatMap((value) => [
    value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff,
  ]);
  return md5ToHex(output);
}

export async function hashText(input: string, algorithm: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512") {
  const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
