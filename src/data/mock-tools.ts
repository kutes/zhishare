export type MockCategory = {
  name: string;
  description: string;
  count: number;
  accent: "cyan" | "emerald" | "amber" | "blue";
};

export type MockTool = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  pricing: string;
  website_url?: string;
  is_free: boolean;
  is_open_source: boolean;
  free_status: string;
  open_source_status: string;
  highlight: string;
  detail: {
    introduction: string[];
    features: string[];
    audience: string[];
    scenarios: string[];
    pros: string[];
    cons: string[];
    risks: string[];
  };
};

export const mockCategories: MockCategory[] = [
  {
    name: "AI 工具",
    description: "写作、搜索、设计、编程等 AI 应用",
    count: 18,
    accent: "cyan",
  },
  {
    name: "效率软件",
    description: "提升个人和团队工作效率的应用",
    count: 24,
    accent: "emerald",
  },
  {
    name: "开源项目",
    description: "值得关注的 GitHub 项目与自托管工具",
    count: 16,
    accent: "blue",
  },
  {
    name: "在线工具",
    description: "无需安装，打开浏览器就能使用",
    count: 21,
    accent: "amber",
  },
];

export const mockTools: MockTool[] = [
  {
    id: "raycast",
    slug: "raycast",
    name: "Raycast",
    tagline: "Mac 上的效率启动器",
    description: "用快捷键启动应用、执行脚本、管理剪贴板，也能连接常用在线服务。",
    category: "效率软件",
    tags: ["快捷启动", "自动化", "Mac"],
    pricing: "免费起步",
    website_url: "https://www.raycast.com/",
    is_free: true,
    is_open_source: false,
    free_status: "免费起步",
    open_source_status: "非开源",
    highlight: "适合想把日常操作集中到键盘里的用户。",
    detail: {
      introduction: [
        "Raycast 是面向 Mac 用户的效率启动器，适合把应用启动、命令执行、剪贴板管理和常用服务入口集中到一个快捷键里。",
        "它的价值不只是打开应用，而是把重复操作做成稳定的命令，让日常工作少一些切换和寻找。",
      ],
      features: ["快速启动应用和文件", "管理剪贴板历史", "执行脚本和快捷命令", "安装扩展连接常用在线服务"],
      audience: ["Mac 重度用户", "开发者和设计师", "希望减少鼠标操作的效率爱好者"],
      scenarios: ["快速打开项目和应用", "复制多段文本后统一处理", "用快捷命令触发日常工作流"],
      pros: ["启动速度快", "扩展生态丰富", "键盘操作体验好"],
      cons: ["主要面向 Mac 用户", "高级团队功能需要付费", "扩展过多后需要定期整理"],
      risks: ["安装第三方扩展前需要确认来源，避免把敏感账号或工作数据暴露给不可信扩展。"],
    },
  },
  {
    id: "obsidian",
    slug: "obsidian",
    name: "Obsidian",
    tagline: "本地优先的知识笔记工具",
    description: "基于 Markdown 和双向链接组织长期知识，插件生态成熟，数据保存在本地。",
    category: "知识管理",
    tags: ["Markdown", "笔记", "本地优先"],
    pricing: "个人免费",
    website_url: "https://obsidian.md/",
    is_free: true,
    is_open_source: false,
    free_status: "个人免费",
    open_source_status: "非开源",
    highlight: "适合建立长期可迁移的个人知识库。",
    detail: {
      introduction: [
        "Obsidian 是一款本地优先的 Markdown 笔记工具，适合长期积累知识、资料和想法。",
        "它通过双向链接、标签和插件生态帮助用户建立自己的知识网络，文件本身仍然是可迁移的 Markdown。",
      ],
      features: ["Markdown 写作", "双向链接和关系图谱", "丰富插件生态", "本地文件夹管理"],
      audience: ["知识工作者", "学生和研究者", "希望长期保存笔记资产的用户"],
      scenarios: ["整理读书笔记", "搭建个人知识库", "记录项目资料和复盘"],
      pros: ["数据本地保存", "Markdown 可迁移", "插件能力强"],
      cons: ["刚开始需要设计自己的组织方式", "插件选择太多时容易分散注意力", "跨设备同步需要额外配置或付费服务"],
      risks: ["重要笔记应定期备份；安装社区插件前应查看评价、权限和维护情况。"],
    },
  },
  {
    id: "supabase",
    slug: "supabase",
    name: "Supabase",
    tagline: "开源 Firebase 替代方案",
    description: "提供 PostgreSQL、认证、存储和实时能力，适合快速搭建现代 Web 应用后端。",
    category: "开源项目",
    tags: ["PostgreSQL", "Auth", "后端"],
    pricing: "免费额度",
    website_url: "https://supabase.com/",
    is_free: true,
    is_open_source: true,
    free_status: "免费额度",
    open_source_status: "开源",
    highlight: "适合从小项目平滑走向真实产品。",
    detail: {
      introduction: [
        "Supabase 是基于 PostgreSQL 的开源后端平台，常用于快速搭建应用的数据、认证、存储和实时能力。",
        "它适合先用托管服务启动项目，后续也能根据需要研究自托管和更细的权限控制。",
      ],
      features: ["PostgreSQL 数据库", "用户认证", "文件存储", "实时订阅", "Row Level Security 权限控制"],
      audience: ["独立开发者", "全栈团队", "需要快速验证产品的项目"],
      scenarios: ["搭建内容站后端", "开发 SaaS 原型", "管理用户账号和文件上传"],
      pros: ["数据库基础扎实", "文档和生态较成熟", "从原型到生产迁移路径清晰"],
      cons: ["权限设计需要认真学习", "复杂业务仍需要后端工程能力", "免费额度不等于无限使用"],
      risks: ["上线前必须正确配置 Row Level Security，避免公开数据和管理权限暴露。"],
    },
  },
  {
    id: "excalidraw",
    slug: "excalidraw",
    name: "Excalidraw",
    tagline: "手绘风在线白板",
    description: "快速画流程图、草图和产品想法，支持协作，也可以自托管。",
    category: "在线工具",
    tags: ["白板", "绘图", "协作"],
    pricing: "免费可用",
    website_url: "https://excalidraw.com/",
    is_free: true,
    is_open_source: true,
    free_status: "免费可用",
    open_source_status: "开源",
    highlight: "适合把复杂想法先画清楚。",
    detail: {
      introduction: [
        "Excalidraw 是一款手绘风格的在线白板工具，适合快速表达结构、流程和产品想法。",
        "它的重点是低门槛和表达速度，不追求复杂制图软件的精细控制。",
      ],
      features: ["手绘风图形绘制", "流程图和草图表达", "协作编辑", "导出图片和源文件"],
      audience: ["产品经理", "设计师", "教师和创作者", "需要快速沟通想法的团队"],
      scenarios: ["画产品流程", "讲解技术架构", "会议中快速共创草图"],
      pros: ["上手快", "视觉风格轻松", "适合早期想法表达"],
      cons: ["复杂排版能力有限", "大型图纸管理不如专业工具", "在线协作依赖网络环境"],
      risks: ["涉及未公开方案或敏感业务信息时，优先确认协作链接权限和数据保存方式。"],
    },
  },
  {
    id: "perplexity",
    slug: "perplexity",
    name: "Perplexity",
    tagline: "带来源的 AI 搜索助手",
    description: "围绕问题生成摘要并展示来源链接，适合做资料调研和信息核对。",
    category: "AI 工具",
    tags: ["搜索", "资料整理", "AI"],
    pricing: "免费起步",
    website_url: "https://www.perplexity.ai/",
    is_free: true,
    is_open_source: false,
    free_status: "免费起步",
    open_source_status: "非开源",
    highlight: "适合需要边查边验证的信息检索场景。",
    detail: {
      introduction: [
        "Perplexity 是一款 AI 搜索和问答工具，会围绕问题生成回答，并提供可点击的来源链接。",
        "它适合做资料调研的第一轮整理，但不应该替代用户对来源、时间和事实的核对。",
      ],
      features: ["AI 问答搜索", "来源链接展示", "资料摘要", "连续追问"],
      audience: ["研究资料的人", "内容创作者", "需要快速了解陌生主题的用户"],
      scenarios: ["查找主题背景", "比较多个资料来源", "整理文章或报告的初步线索"],
      pros: ["回答速度快", "能展示来源", "适合扩展问题方向"],
      cons: ["摘要可能遗漏细节", "来源质量需要人工判断", "部分高级能力需要付费"],
      risks: ["涉及医疗、法律、金融等高风险信息时，必须回到权威来源核验，不能只依赖 AI 摘要。"],
    },
  },
  {
    id: "localsend",
    slug: "localsend",
    name: "LocalSend",
    tagline: "局域网跨设备传文件",
    description: "开源、跨平台、无需登录，在同一局域网内快速传输文件和文本。",
    category: "开源项目",
    tags: ["传输", "跨平台", "开源"],
    pricing: "免费开源",
    website_url: "https://localsend.org/",
    is_free: true,
    is_open_source: true,
    free_status: "免费",
    open_source_status: "开源",
    highlight: "适合不想依赖云盘的临时文件传输。",
    detail: {
      introduction: [
        "LocalSend 是一款开源的局域网文件传输工具，可以在不同系统设备之间发送文件和文本。",
        "它不要求登录账号，适合临时传文件、跨平台传资料和减少对云盘的依赖。",
      ],
      features: ["局域网文件传输", "发送文本", "跨平台支持", "无需账号登录"],
      audience: ["多设备用户", "需要临时传文件的人", "偏好开源工具的用户"],
      scenarios: ["手机和电脑互传图片", "办公室局域网内传资料", "不用云盘传临时文件"],
      pros: ["免费开源", "无需登录", "跨平台覆盖广"],
      cons: ["通常需要设备在同一局域网", "外网远程传输不是它的核心场景", "网络发现可能受防火墙影响"],
      risks: ["在公共网络中使用时，应确认接收设备身份，避免把文件发给错误设备。"],
    },
  },
];
