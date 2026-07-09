export type HeroHotword = {
  label: string;
  href: string;
};

export type PortalCategory = {
  name: string;
  description: string;
  // DB category names counted into this gateway; the guide gateway counts articles instead.
  match: string[];
  href: string;
  icon: "ai" | "tool" | "dev" | "software" | "guide";
};

export type PartnerAd = {
  label: string;
  title: string;
  description: string;
  href: string;
};

export const heroHotwords: HeroHotword[] = [
  { label: "AI 工具", href: "/search?q=AI%20工具" },
  { label: "ChatGPT", href: "/search?q=ChatGPT" },
  { label: "DeepSeek", href: "/search?q=DeepSeek" },
  { label: "AI Agent", href: "/search?q=AI%20Agent" },
  { label: "开源项目", href: "/search?q=开源项目" },
  { label: "自动化", href: "/search?q=自动化" },
  { label: "效率工具", href: "/search?q=效率工具" },
  { label: "在线工具", href: "/search?q=在线工具" },
];

export const portalCategories: PortalCategory[] = [
  {
    name: "AI 工具",
    description: "大模型应用、写作、编程和工作流自动化工具",
    match: ["AI工具", "AI 工具", "AI 入门"],
    href: "/tools",
    icon: "ai",
  },
  {
    name: "在线工具",
    description: "图片、PDF、格式转换和浏览器即可使用的实用工具",
    match: ["在线工具", "图片工具", "图片处理"],
    href: "/tools",
    icon: "tool",
  },
  {
    name: "开发项目",
    description: "开源替代、自托管项目、开发者工具和脚本",
    match: ["开源项目", "编程工具"],
    href: "/tools",
    icon: "dev",
  },
  {
    name: "软件资源",
    description: "效率软件、设计工具、视频与笔记等桌面/在线软件",
    match: ["效率软件", "效率工具", "效率笔记", "设计工具", "视频剪辑"],
    href: "/tools",
    icon: "software",
  },
  {
    name: "教程指南",
    description: "小白教程、配置避坑、实战指南和长期使用建议",
    match: [],
    href: "/articles",
    icon: "guide",
  },
];

export const partnerAds: PartnerAd[] = [
  {
    label: "推广",
    title: "云服务器精选位",
    description: "适合部署网站、自动化脚本与自托管服务",
    href: "/submit",
  },
  {
    label: "推广",
    title: "效率工具合作位",
    description: "面向创作者、开发者和小团队的工具入口",
    href: "/submit",
  },
  {
    label: "推广",
    title: "开发者资源位",
    description: "展示 API、开源项目、SaaS 与技术产品",
    href: "/submit",
  },
  {
    label: "推广",
    title: "本站赞助位",
    description: "保留高级暗黑视觉，不做刺眼广告样式",
    href: "/submit",
  },
];
