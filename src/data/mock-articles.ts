export type MockArticle = {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: string;
};

export const mockArticles: MockArticle[] = [
  {
    id: "ai-tool-checklist",
    title: "选择 AI 工具前，可以先看这 5 个问题",
    summary: "从数据来源、隐私、价格、输出质量和替代方案几个角度，判断一个 AI 工具是否值得长期使用。",
    category: "AI 工具",
    date: "2026-05-31",
    readTime: "5 分钟",
  },
  {
    id: "open-source-license",
    title: "开源项目介绍里，许可证为什么不能省略",
    summary: "MIT、Apache-2.0、GPL 等许可证会影响商用和二次分发，写工具介绍时需要把边界说清楚。",
    category: "开源项目",
    date: "2026-05-30",
    readTime: "6 分钟",
  },
  {
    id: "online-tools-safety",
    title: "在线工具很好用，但敏感文件不要随便上传",
    summary: "浏览器工具适合处理轻量任务，涉及合同、证件、密钥和客户资料时要先确认隐私政策。",
    category: "安全技巧",
    date: "2026-05-29",
    readTime: "4 分钟",
  },
];
