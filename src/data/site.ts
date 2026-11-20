import agentSkillDocPrompt from "./materials/agent-skill-doc-prompt.md?raw";
import cloudflareTunnel from "./materials/cloudflare-tunnel.md?raw";
import dockerCommands from "./materials/docker-commands.md?raw";
import gitCheatsheet from "./materials/git-cheatsheet.md?raw";

export type ProjectStatus = "运行中" | "维护中" | "开发中";

export interface Project {
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  techStack: string[];
  status: ProjectStatus;
  screenshot: string;
}

function projectScreenshot(url: string): string {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200&h=750`;
}

export const siteConfig = {
  name: "老金",
  title: "全栈开发者 / 技术爱好者",
  avatar: "金",
  currentStatus: "正在折腾 AI 应用与 Cloudflare 自部署",
  contact: {
    github: "https://github.com/Jinzexin",
    githubLabel: "GitHub / Jinzexin",
    email: "1696922867@qq.com",
  },
  headline: "记录实践，沉淀技术",
  description:
    "把想法做成能跑的服务：业务系统、工具站、AI 应用和 Cloudflare 自部署实践。",
  bio: "我是老金，更愿意把自己理解成“能落地的全栈开发者”。过去几年做过业务系统、工具站和自部署服务，现在持续折腾 AI 应用、Cloudflare Pages 和可复用的小工具。比起概念清单，我更关注上线之后是否真的稳定、好用、能维护。",
  quote: "上线只是开始，长期稳定可用才重要。",
  tags: ["Vue.js", "Node.js", "Python", "Docker", "PostgreSQL", "MinIO"],
  stats: [
    { label: "开发经验", value: "5年+" },
    { label: "实践项目", value: "20+" },
    { label: "技术栈", value: "10+" },
  ],
  focusAreas: [
    { title: "AI 应用探索", description: "把 Agent、提示词和业务工具串成可用的产品流程。" },
    { title: "自部署服务", description: "影视聚合、音乐播放、共享书签等服务持续运行与维护。" },
    { title: "效率工具沉淀", description: "把重复工作整理成前端工具箱、导航页和可复用模板。" },
  ],
  nav: [
    { label: "首页", href: "/" },
    { label: "关于", href: "/about" },
    { label: "笔记", href: "/blog" },
    { label: "作品", href: "/projects" },
    { label: "工具", href: "/tools" },
    { label: "资源", href: "/contact" },
    { label: "导航", href: "/bookmarks" },
  ],
  projects: [
    {
      title: "需求收集",
      description: "简洁高效的需求收集工具，用于快速汇总和整理来自各方的想法与建议。",
      url: "https://jinzx.cc.cd/",
      category: "工具",
      tags: ["表单", "协作"],
      techStack: ["HTML", "CSS", "JavaScript", "Cloudflare Pages"],
      status: "运行中",
      screenshot: projectScreenshot("https://jinzx.cc.cd/"),
    },
    {
      title: "天机阁算命",
      description: "融合传统文化元素的趣味算命小项目，以轻松幽默的方式解读运势。",
      url: "https://tjg.jinzx.cc.cd/",
      category: "趣味项目",
      tags: ["传统文化", "趣味"],
      techStack: ["React", "TypeScript", "AI API"],
      status: "运行中",
      screenshot: projectScreenshot("https://tjg.jinzx.cc.cd/"),
    },
    {
      title: "泽鑫专属影院",
      description: "自部署的在线影视聚合站，聚合多源搜索与在线播放，支持手机、电视多端访问，还内置 IPTV 直播。",
      url: "https://video.jzx99.ccwu.cc/",
      category: "Web应用",
      tags: ["Next.js", "Cloudflare", "影视聚合"],
      techStack: ["Next.js", "Cloudflare", "影视聚合"],
      status: "运行中",
      screenshot: projectScreenshot("https://video.jzx99.ccwu.cc/"),
    },
    {
      title: "泽鑫专属音乐",
      description: "轻量在线音乐播放站，支持多平台歌曲搜索、播放列表和同步歌词。",
      url: "https://music.jzx99.ccwu.cc/",
      category: "Web应用",
      tags: ["HTML", "CSS", "JavaScript"],
      techStack: ["HTML", "CSS", "JavaScript", "Web Audio API"],
      status: "运行中",
      screenshot: projectScreenshot("https://music.jzx99.ccwu.cc/"),
    },
    {
      title: "资源共享",
      description: "集中保存、备注和共享常用网址的轻量资源索引，支持标签筛选与多人维护。",
      url: "https://zexin-resource-share.pages.dev/",
      category: "工具",
      tags: ["Cloudflare", "KV", "JavaScript"],
      techStack: ["JavaScript", "Cloudflare Pages", "Cloudflare KV"],
      status: "运行中",
      screenshot: projectScreenshot("https://zexin-resource-share.pages.dev/"),
    },
  ],
};

export const techStack = [
  { name: "Vue.js", level: 90 },
  { name: "JavaScript", level: 88 },
  { name: "Node.js", level: 85 },
  { name: "Python", level: 82 },
  { name: "Docker", level: 78 },
  { name: "PostgreSQL", level: 75 },
];

export const resources = [
  { title: "Vue.js 官方文档", description: "Vue.js 官方中文文档，最权威的学习资料", url: "https://cn.vuejs.org/", category: "前端" },
  { title: "Element Plus", description: "基于 Vue 3 的组件库，本项目使用的 UI 框架", url: "https://element-plus.org/zh-CN/", category: "前端" },
  { title: "Node.js 官方文档", description: "Node.js 运行时文档，后端开发必备", url: "https://nodejs.org/zh-cn/", category: "后端" },
  { title: "Docker 入门到实践", description: "容器化部署必备知识，一站式学习 Docker", url: "https://yeasy.gitbook.io/docker_practice/", category: "运维" },
  { title: "MinIO 中文文档", description: "高性能对象存储系统，本项目云盘功能的核心", url: "https://min.io/docs/minio/container/index.html", category: "运维" },
  { title: "MDN Web 文档", description: "Mozilla 维护的 Web 技术权威文档", url: "https://developer.mozilla.org/zh-CN/", category: "前端" },
];

export const articles = [
  { id: "docker-commands", title: "Docker 部署常用命令", summary: "汇总镜像、容器、Compose、网络与卷等 Docker 部署场景的常用命令。", tags: ["Docker", "运维"], readTime: "10 分钟", body: dockerCommands },
  { id: "git-cheatsheet", title: "Git 常用操作速查表", summary: "集中记录 Git 配置、分支、提交、远程仓库及撤销操作的常用指令。", tags: ["Git", "工具"], readTime: "8 分钟", body: gitCheatsheet },
  { id: "agent-skill-doc-prompt", title: "生成中文智能体技能文档提示词（v2）", summary: "v2 版本：区分生成/运行阶段，新增清单确认、交接契约、统一退出码和自动化校验脚本，把业务流程整理成可复用、可交接的智能体技能包。", tags: ["AI", "提示词"], readTime: "15 分钟", body: agentSkillDocPrompt },
  { id: "cloudflare-tunnel", title: "Cloudflare Tunnel 本地服务暴露公网完整操作笔记", summary: "无需公网 IP 或端口映射，使用 Cloudflare Tunnel 将本地服务安全发布到公网。", tags: ["Cloudflare", "运维"], readTime: "12 分钟", body: cloudflareTunnel },
];

export type Article = (typeof articles)[number];

export const projects: Project[] = siteConfig.projects as Project[];

export interface Bookmark {
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
}

export const bookmarks: Bookmark[] = [
  { title: "需求收集", description: "快速收集需求、建议和反馈的轻量表单。", url: "https://jinzx.cc.cd/", category: "我的站点", tags: ["表单", "协作", "常用"] },
  { title: "天机阁算命", description: "趣味命理与占卜工具站点。", url: "https://tjg.jinzx.cc.cd/", category: "我的站点", tags: ["命理", "趣味", "常用"] },
  { title: "泽鑫专属影院", description: "多源影视搜索、在线播放与 IPTV 直播入口。", url: "https://video.jzx99.ccwu.cc/", category: "我的站点", tags: ["影视", "IPTV", "娱乐"] },
  { title: "泽鑫专属音乐", description: "在线音乐搜索、播放列表和同步歌词。", url: "https://music.jzx99.ccwu.cc/", category: "我的站点", tags: ["音乐", "播放器", "娱乐"] },
  { title: "资源共享", description: "共享网址索引，支持标签筛选和协作维护。", url: "https://zexin-resource-share.pages.dev/", category: "我的站点", tags: ["书签", "共享", "索引"] },
  { title: "MDN Web Docs", description: "HTML、CSS、JavaScript 和 Web API 权威文档。", url: "https://developer.mozilla.org/zh-CN/", category: "开发文档", tags: ["前端", "文档", "Web API"] },
  { title: "Can I use", description: "查询浏览器兼容性与前端特性支持情况。", url: "https://caniuse.com/", category: "开发文档", tags: ["兼容性", "前端", "浏览器"] },
  { title: "Regex101", description: "可视化调试正则表达式并查看匹配说明。", url: "https://regex101.com/", category: "开发工具", tags: ["正则", "调试", "文本"] },
  { title: "Excalidraw", description: "手绘风格架构图、流程图和示意图白板。", url: "https://excalidraw.com/", category: "效率工具", tags: ["画图", "架构图", "协作"] },
  { title: "Cloudflare Dashboard", description: "管理 Pages、域名、KV、DNS 和访问策略。", url: "https://dash.cloudflare.com/", category: "运维部署", tags: ["Cloudflare", "部署", "控制台"] },
  { title: "GitHub", description: "代码仓库、Issue、Action 和开源项目托管。", url: "https://github.com/", category: "开发工具", tags: ["Git", "代码", "协作"] },
  { title: "Frankfurter", description: "基于欧洲央行数据的免费汇率 API。", url: "https://www.frankfurter.app/", category: "常用服务", tags: ["汇率", "API", "数据"] },
];

export const bookmarkCategories = Array.from(new Set(bookmarks.map((bookmark) => bookmark.category)));
