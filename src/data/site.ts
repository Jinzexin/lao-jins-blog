import cloudflareTunnel from "./materials/cloudflare-tunnel.md?raw";
import dockerCommands from "./materials/docker-commands.md?raw";
import gitCheatsheet from "./materials/git-cheatsheet.md?raw";
import nodejsGuide from "./materials/nodejs-guide.md?raw";
import postgresqlNotes from "./materials/postgresql-notes.md?raw";
import vue3Notes from "./materials/vue3-notes.md?raw";

export const siteConfig = {
  name: "老金",
  title: "全栈开发者 / 技术爱好者",
  avatar: "金",
  headline: "记录实践，沉淀技术",
  description:
    "一名热爱技术的全栈开发者，专注于 Web 应用开发，使用 Vue.js、Node.js 等现代技术栈构建高质量应用。",
  bio: "大家好，我是老金，一名热爱技术的全栈开发者。专注于 Web 应用开发，擅长使用 Vue.js、Node.js 等现代技术栈构建高质量的应用程序。这个项目是我用来学习和实践前后端技术的作品之一，包含了云存储、AI 对话、游戏中心等功能模块。希望通过这个项目能和大家一起交流学习，共同进步。",
  quote: "代码如诗，优雅简洁；技术无界，学无止境。",
  tags: ["Vue.js", "Node.js", "Python", "Docker", "PostgreSQL", "MinIO"],
  stats: [
    { label: "开发经验", value: "5年+" },
    { label: "实践项目", value: "20+" },
    { label: "技术栈", value: "10+" },
  ],
  nav: [
    { label: "首页", href: "/" },
    { label: "关于", href: "/about" },
    { label: "笔记", href: "/blog" },
    { label: "资源", href: "/contact" },
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
  { id: "vue3-notes", title: "Vue 3 学习笔记", summary: "整理组合式 API、组件通信、响应式原理和生命周期等 Vue 3 核心知识。", tags: ["Vue.js", "前端"], readTime: "8 分钟", body: vue3Notes },
  { id: "nodejs-guide", title: "Node.js 后端开发指南", summary: "从 Express 服务、JWT 认证到 PostgreSQL 连接，记录 Node.js 后端开发的基础实践。", tags: ["Node.js", "后端"], readTime: "10 分钟", body: nodejsGuide },
  { id: "postgresql-notes", title: "PostgreSQL 学习笔记", summary: "覆盖数据库连接、表设计、增删改查、索引、事务与备份恢复等常用操作。", tags: ["PostgreSQL", "数据库"], readTime: "12 分钟", body: postgresqlNotes },
  { id: "docker-commands", title: "Docker 部署常用命令", summary: "汇总镜像、容器、Compose、网络与卷等 Docker 部署场景的常用命令。", tags: ["Docker", "运维"], readTime: "10 分钟", body: dockerCommands },
  { id: "git-cheatsheet", title: "Git 常用操作速查表", summary: "集中记录 Git 配置、分支、提交、远程仓库及撤销操作的常用指令。", tags: ["Git", "工具"], readTime: "8 分钟", body: gitCheatsheet },
  { id: "cloudflare-tunnel", title: "Cloudflare Tunnel 本地服务暴露公网完整操作笔记", summary: "无需公网 IP 或端口映射，使用 Cloudflare Tunnel 将本地服务安全发布到公网。", tags: ["Cloudflare", "运维"], readTime: "12 分钟", body: cloudflareTunnel },
];

export type Article = (typeof articles)[number];
