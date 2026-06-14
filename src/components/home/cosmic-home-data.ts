export type HeroHotword = {
  label: string;
  href: string;
};

export type PortalCategory = {
  name: string;
  description: string;
  count: string;
  href: string;
  icon: "ai" | "tool" | "dev" | "software" | "guide";
};

export type PartnerAd = {
  label: string;
  title: string;
  description: string;
  href: string;
};

export type FeaturedResource = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  meta: string;
};

export type LatestGuide = {
  category: string;
  title: string;
  description: string;
  href: string;
  date: string;
  views: string;
};

export type RankingGroup = {
  title: string;
  description: string;
  href: string;
  items: {
    title: string;
    views: string;
    href: string;
  }[];
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
    count: "86+",
    href: "/tools?category=ai",
    icon: "ai",
  },
  {
    name: "在线工具",
    description: "图片、PDF、格式转换和浏览器即可使用的实用工具",
    count: "128+",
    href: "/tools?category=online",
    icon: "tool",
  },
  {
    name: "开发项目",
    description: "开源替代、自托管项目、开发者工具和脚本",
    count: "64+",
    href: "/tools?category=dev",
    icon: "dev",
  },
  {
    name: "软件资源",
    description: "Windows、macOS、Android 与效率软件资源",
    count: "92+",
    href: "/tools?category=software",
    icon: "software",
  },
  {
    name: "教程指南",
    description: "小白教程、配置避坑、实战指南和长期使用建议",
    count: "35+",
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

export const featuredResources: FeaturedResource[] = [
  {
    eyebrow: "AI 工具 · 重点推荐",
    title: "ChatGPT：从对话助手到内容生产工作流",
    description: "适合写作、翻译、代码辅助、资料整理与自动化流程设计，是新手最容易入门的 AI 工具之一。",
    href: "/tools/chatgpt",
    meta: "工具库 · 入门优先 · 高使用频率",
  },
  {
    eyebrow: "设计工具",
    title: "Figma：团队协作界面设计工具",
    description: "适合 UI 设计、原型制作和团队协作。",
    href: "/tools/figma",
    meta: "设计 · 协作",
  },
  {
    eyebrow: "开发工具",
    title: "Cursor：AI 辅助代码编辑器",
    description: "适合用自然语言改代码、理解项目和快速迭代。",
    href: "/tools/cursor",
    meta: "开发 · AI 编程",
  },
  {
    eyebrow: "图片处理",
    title: "TinyPNG：图片压缩与网页性能优化",
    description: "适合批量压缩图片，降低页面体积。",
    href: "/tools/tinypng",
    meta: "在线工具 · 图片",
  },
  {
    eyebrow: "知识管理",
    title: "Notion：文档、数据库与个人知识库",
    description: "适合内容规划、项目管理和长期资料沉淀。",
    href: "/tools/notion",
    meta: "效率 · 文档",
  },
];

export const latestGuides: LatestGuide[] = [
  {
    category: "AI 工具",
    title: "新手如何选择第一个 AI 工具：从需求而不是热度开始",
    description: "用写作、设计、代码、资料整理四个场景，判断你真正需要哪类 AI 工具。",
    href: "/articles",
    date: "2026-06-13",
    views: "2.4K",
  },
  {
    category: "开发项目",
    title: "自托管项目入门：部署前必须确认的 5 件事",
    description: "服务、域名、备份、更新和权限，是小白最容易忽略的风险点。",
    href: "/articles",
    date: "2026-06-12",
    views: "1.8K",
  },
  {
    category: "在线工具",
    title: "图片压缩、抠图、格式转换：常用在线工具组合",
    description: "整理日常内容创作和网站运营里最常见的图片处理流程。",
    href: "/articles",
    date: "2026-06-10",
    views: "3.1K",
  },
  {
    category: "软件资源",
    title: "Windows 效率软件清单：从文件整理到截图标注",
    description: "适合刚开始整理电脑工作流的用户，优先推荐低门槛工具。",
    href: "/articles",
    date: "2026-06-09",
    views: "1.2K",
  },
  {
    category: "教程指南",
    title: "如何判断一个工具是否值得长期使用",
    description: "从更新频率、数据安全、导出能力、价格和替代方案五个维度判断。",
    href: "/articles",
    date: "2026-06-08",
    views: "2.7K",
  },
  {
    category: "AI Agent",
    title: "AI Agent 不等于万能自动化：先理解边界",
    description: "用真实任务拆解 Agent 的优势和限制，避免盲目追热点。",
    href: "/articles",
    date: "2026-06-07",
    views: "956",
  },
  {
    category: "效率工具",
    title: "内容创作者的工具链：选题、写作、制图、发布",
    description: "适合公众号、小红书和独立站运营者的轻量工作流。",
    href: "/articles",
    date: "2026-06-06",
    views: "1.6K",
  },
  {
    category: "自托管",
    title: "个人服务部署避坑：不要把安全留到最后",
    description: "账号权限、默认端口、环境变量和备份策略都需要提前规划。",
    href: "/articles",
    date: "2026-06-05",
    views: "1.1K",
  },
];

export const rankingGroups: RankingGroup[] = [
  {
    title: "AI 工具榜",
    description: "近期更值得尝试的 AI 应用与工作流",
    href: "/tools?category=ai",
    items: [
      { title: "ChatGPT 内容生产工作流", views: "8.2K", href: "/tools/chatgpt" },
      { title: "Cursor AI 编程实践", views: "6.4K", href: "/tools/cursor" },
      { title: "DeepSeek 使用场景整理", views: "5.9K", href: "/search?q=DeepSeek" },
      { title: "AI 图片处理工具合集", views: "4.8K", href: "/search?q=AI%20图片" },
      { title: "AI Agent 入门清单", views: "3.7K", href: "/search?q=AI%20Agent" },
    ],
  },
  {
    title: "在线工具榜",
    description: "浏览器打开就能用的高频工具",
    href: "/tools?category=online",
    items: [
      { title: "TinyPNG 图片压缩", views: "7.1K", href: "/tools/tinypng" },
      { title: "Remove.bg 在线抠图", views: "6.9K", href: "/tools/remove-bg" },
      { title: "PDF 转换工具合集", views: "5.3K", href: "/search?q=PDF%20工具" },
      { title: "在线格式转换工具", views: "3.8K", href: "/search?q=格式转换" },
      { title: "站长常用检测工具", views: "2.6K", href: "/search?q=站长工具" },
    ],
  },
  {
    title: "开发项目榜",
    description: "适合开发者收藏和部署的项目",
    href: "/tools?category=dev",
    items: [
      { title: "自托管项目入门", views: "5.8K", href: "/search?q=自托管" },
      { title: "开源替代工具清单", views: "4.6K", href: "/search?q=开源替代" },
      { title: "开发者效率工具", views: "4.1K", href: "/search?q=开发工具" },
      { title: "API 调试工具合集", views: "2.9K", href: "/search?q=API" },
      { title: "自动化脚本资源", views: "2.2K", href: "/search?q=自动化" },
    ],
  },
  {
    title: "软件资源榜",
    description: "系统工具、效率软件与桌面应用",
    href: "/tools?category=software",
    items: [
      { title: "Windows 效率软件", views: "6.2K", href: "/search?q=Windows%20软件" },
      { title: "macOS 实用工具", views: "4.9K", href: "/search?q=macOS" },
      { title: "浏览器扩展精选", views: "4.4K", href: "/search?q=浏览器扩展" },
      { title: "截图与标注工具", views: "3.1K", href: "/search?q=截图工具" },
      { title: "文件整理工具", views: "2.4K", href: "/search?q=文件整理" },
    ],
  },
];
