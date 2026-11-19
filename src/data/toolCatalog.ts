export interface ToolItem {
  id: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  badge: string;
}

export interface ToolGroup {
  title: string;
  tools: ToolItem[];
}

export const toolGroups: ToolGroup[] = [
  {
    title: "扩充工具箱",
    tools: [
      {
        id: "text-tools",
        title: "文本工具箱",
        description: "Base64 / URL 编码解码、MD5 / SHA 哈希、正则测试、文本 diff 和字数统计。",
        href: "/tools/text",
        tags: ["Base64", "哈希", "MD5", "SHA", "正则", "Diff", "字数"],
        badge: "文本类",
      },
      {
        id: "format-tools",
        title: "格式转换与预览",
        description: "JSON ⇄ YAML ⇄ CSV 转换、Markdown 预览和 SQL 格式化。",
        href: "/tools/format",
        tags: ["JSON", "YAML", "CSV", "Markdown", "SQL"],
        badge: "格式转换",
      },
      {
        id: "generator-tools",
        title: "生成工具",
        description: "UUID、随机密码、二维码生成 / 解析和 Cron 表达式解释器。",
        href: "/tools/generators",
        tags: ["UUID", "密码", "二维码", "Cron"],
        badge: "生成类",
      },
      {
        id: "image-tools",
        title: "图片处理",
        description: "纯前端 Canvas 压缩、格式转换和文字水印，图片数据不出浏览器。",
        href: "/tools/image",
        tags: ["压缩", "格式转换", "水印", "Canvas"],
        badge: "图片类",
      },
      {
        id: "daily-tools",
        title: "日常工具",
        description: "单位换算、汇率换算、倒计时和番茄钟。",
        href: "/tools/daily",
        tags: ["单位", "汇率", "倒计时", "番茄钟"],
        badge: "日常类",
      },
    ],
  },
  {
    title: "开发工具",
    tools: [
      {
        id: "json-parser",
        title: "JSON 在线解析",
        description: "粘贴 JSON 文本，一键美化格式化、校验合法性，快速查看结构。",
        href: "/tools/json-parser",
        tags: ["JSON", "格式化", "解析"],
        badge: "工具",
      },
      {
        id: "timestamp",
        title: "时间戳转换",
        description: "Unix 时间戳与可读日期互相转换，支持秒/毫秒切换，实时显示当前时间。",
        href: "/tools/timestamp",
        tags: ["时间戳", "日期", "Unix"],
        badge: "工具",
      },
    ],
  },
];

export const toolItems: ToolItem[] = toolGroups.flatMap((group) => group.tools);
