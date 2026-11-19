import { useRef, useState } from "react";
import { ToolButton, ToolCard, ToolInput, ToolLabel, ToolMessage, ToolSelect, ToolShell } from "../components/ToolShell";
import { formatBytes } from "../lib/toolUtils";

type WatermarkPosition = "none" | "tile" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export function ImageTools() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [sourceSize, setSourceSize] = useState(0);
  const [outputSize, setOutputSize] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [maxWidth, setMaxWidth] = useState("1920");
  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState("80");
  const [watermark, setWatermark] = useState("");
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right");
  const [opacity, setOpacity] = useState("70");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const imageRef = useRef<HTMLImageElement | null>(null);



  function selectImage(selected: File | null) {
    if (!selected || !selected.type.startsWith("image/")) {
      setError("请选择图片文件。");
      return;
    }
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setError("");
    setFile(selected);
    setSourceSize(selected.size);
    setOutputSize(0);
    setOutputUrl("");
    setSourceUrl(URL.createObjectURL(selected));
  }

  async function processImage() {
    const image = imageRef.current;
    if (!image || !file) return;
    setBusy(true);
    setError("");
    try {
      const targetWidth = Math.min(Number(maxWidth) || image.naturalWidth, image.naturalWidth);
      const scale = targetWidth / image.naturalWidth;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("无法创建 Canvas 上下文。");
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      drawWatermark(context, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, format, Number(quality) / 100));
      if (!blob) throw new Error("图片导出失败。");
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      setDimensions({ width: canvas.width, height: canvas.height });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "图片处理失败。");
    } finally {
      setBusy(false);
    }
  }

  function drawWatermark(context: CanvasRenderingContext2D, width: number, height: number) {
    if (!watermark || position === "none") return;
    const fontSize = Math.max(16, Math.round(width / 28));
    context.font = `600 ${fontSize}px sans-serif`;
    context.fillStyle = `rgba(255, 255, 255, ${Math.min(Math.max(Number(opacity) || 70, 1), 100) / 100})`;
    context.strokeStyle = "rgba(0, 0, 0, 0.45)";
    context.lineWidth = Math.max(1, fontSize / 18);
    context.textBaseline = "middle";
    const margin = fontSize;
    if (position === "tile") {
      context.save();
      context.translate(width / 2, height / 2);
      context.rotate(-Math.PI / 12);
      const stepX = fontSize * watermark.length * 1.4;
      const stepY = fontSize * 4;
      const limitX = Math.hypot(width, height) / 2 + stepX;
      const limitY = Math.hypot(width, height) / 2 + stepY;
      for (let y = -limitY; y <= limitY; y += stepY) {
        for (let x = -limitX; x <= limitX; x += stepX) {
          context.strokeText(watermark, x, y);
          context.fillText(watermark, x, y);
        }
      }
      context.restore();
      return;
    }
    const metrics = context.measureText(watermark);
    const x = position.endsWith("left") ? margin : width - metrics.width - margin;
    const y = position.startsWith("top") ? margin + fontSize / 2 : height - margin - fontSize / 2;
    context.strokeText(watermark, x, y);
    context.fillText(watermark, x, y);
  }

  const reduction = sourceSize && outputSize ? ((1 - outputSize / sourceSize) * 100).toFixed(1) : "";

  return (
    <ToolShell
      title="图片处理"
      description="压缩、转换格式并添加文字水印。图片只在浏览器 Canvas 中处理，不会上传到服务器。"
      tabs={[{ id: "image", label: "本地处理", content: (
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <ToolCard title="图片预览">
              <label className="flex min-h-[180px] cursor-pointer items-center justify-center border border-dashed border-brand-border bg-brand-bg px-4 text-sm text-gray-400 transition hover:border-brand-accent/40 hover:text-white">
                {file ? `重新选择：${file.name}` : "选择本地图片"}
                <input type="file" accept="image/*" className="hidden" onChange={(event) => selectImage(event.target.files?.[0] ?? null)} />
              </label>
              {sourceUrl ? (
                <img
                  ref={imageRef}
                  src={sourceUrl}
                  alt="待处理图片"
                  onLoad={() => imageRef.current && setDimensions({ width: imageRef.current.naturalWidth, height: imageRef.current.naturalHeight })}
                  className="mt-4 max-h-[520px] w-full object-contain"
                />
              ) : (
                <div className="mt-4 flex h-[280px] items-center justify-center border border-brand-border text-gray-600">尚未选择图片</div>
              )}
            </ToolCard>

            <ToolCard title="处理设置">
              <div className="space-y-4">
                <div>
                  <ToolLabel htmlFor="max-width">最大宽度</ToolLabel>
                  <ToolInput id="max-width" type="number" value={maxWidth} onChange={setMaxWidth} />
                </div>
                <div>
                  <ToolLabel htmlFor="image-format">输出格式</ToolLabel>
                  <ToolSelect id="image-format" value={format} onChange={setFormat} options={[
                    { value: "image/jpeg", label: "JPEG（体积小）" },
                    { value: "image/webp", label: "WebP（推荐）" },
                    { value: "image/png", label: "PNG（无损）" },
                  ]} />
                </div>
                <div>
                  <ToolLabel htmlFor="image-quality"><span>质量：{quality}%</span></ToolLabel>
                  <input id="image-quality" type="range" min="10" max="100" value={quality} onChange={(event) => setQuality(event.target.value)} className="w-full accent-[rgb(var(--c-accent))]" />
                </div>
                <div>
                  <ToolLabel htmlFor="watermark-text">水印文字</ToolLabel>
                  <ToolInput id="watermark-text" value={watermark} onChange={setWatermark} placeholder="留空则不添加" />
                </div>
                <div>
                  <ToolLabel htmlFor="watermark-position">水印位置</ToolLabel>
                  <ToolSelect id="watermark-position" value={position} onChange={(value) => setPosition(value as WatermarkPosition)} options={[
                    { value: "none", label: "不添加水印" },
                    { value: "bottom-right", label: "右下角" },
                    { value: "bottom-left", label: "左下角" },
                    { value: "top-right", label: "右上角" },
                    { value: "top-left", label: "左上角" },
                    { value: "tile", label: "平铺全图" },
                  ]} />
                </div>
                <div>
                  <ToolLabel htmlFor="watermark-opacity"><span>不透明度：{opacity}%</span></ToolLabel>
                  <input id="watermark-opacity" type="range" min="10" max="100" value={opacity} onChange={(event) => setOpacity(event.target.value)} className="w-full accent-[rgb(var(--c-accent))]" />
                </div>
                <ToolButton primary onClick={processImage} disabled={!file || busy} >{busy ? "处理中…" : "处理并导出"}</ToolButton>
              </div>
            </ToolCard>
          </div>

          {error ? <ToolMessage kind="error">{error}</ToolMessage> : null}
          {outputUrl ? (
            <ToolCard title="处理结果">
              <div className="grid gap-4 text-sm text-gray-400 md:grid-cols-4">
                <div>原始大小：{formatBytes(sourceSize)}</div>
                <div>输出大小：{formatBytes(outputSize)}</div>
                <div>尺寸变化：{dimensions.width} × {dimensions.height}</div>
                <div className="text-brand-accent">{reduction ? `体积降低 ${reduction}%` : "体积可能增加"}</div>
              </div>
              <img src={outputUrl} alt="处理后的图片" className="mt-5 max-h-[480px] w-full object-contain" />
              <a
                href={outputUrl}
                download={`processed.${format.split("/")[1]}`}
                className="mt-4 inline-flex bg-brand-accent px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-brand-accent-hover"
              >
                下载图片
              </a>
            </ToolCard>
          ) : null}
        </div>
      )}]} />
  );
}
