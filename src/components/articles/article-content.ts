import { mockArticles, type MockArticle } from "@/data/mock-articles";

export type ArticleSection =
  | {
      type: "paragraphs";
      title: string;
      paragraphs: string[];
    }
  | {
      type: "list";
      title: string;
      items: string[];
    };

export type ArticleItem = MockArticle & {
  slug: string;
  tags: string[];
  sections: ArticleSection[];
};

const articleDetails: Record<string, { tags: string[]; sections: ArticleSection[] }> = {
  "ai-tool-checklist": {
    tags: ["AI 应用", "工具选择", "避坑指南"],
    sections: [
      {
        type: "paragraphs",
        title: "先确认它解决什么问题",
        paragraphs: [
          "很多 AI 工具看起来功能很多，但真正适合长期使用的，通常是能稳定解决一个具体问题的工具。",
          "在尝试前先写下自己的使用场景，例如写作辅助、资料检索、图片处理或代码解释，再判断工具是否真的匹配。",
        ],
      },
      {
        type: "list",
        title: "选择前重点检查",
        items: ["数据来源是否清楚", "输出结果是否可核验", "隐私政策是否明确", "免费额度是否够用", "是否有可替代方案"],
      },
      {
        type: "paragraphs",
        title: "不要忽略长期成本",
        paragraphs: [
          "试用阶段好用，不代表长期使用成本低。需要关注价格、导出能力、团队协作限制和服务稳定性。",
          "涉及工作资料时，还要确认上传内容是否会被用于训练或分享给第三方服务。",
        ],
      },
      {
        type: "list",
        title: "适合的使用方式",
        items: ["先用小任务试运行", "保留原始资料和来源链接", "对关键结论做二次核对", "不要把敏感文件直接上传到不熟悉的平台"],
      },
    ],
  },
  "open-source-license": {
    tags: ["开源项目", "许可证", "合规"],
    sections: [
      {
        type: "paragraphs",
        title: "许可证不是装饰信息",
        paragraphs: [
          "开源项目是否能商用、能否二次分发、是否需要公开修改后的代码，通常都和许可证有关。",
          "介绍开源项目时，如果忽略许可证，读者很容易误以为代码可以无条件使用。",
        ],
      },
      {
        type: "list",
        title: "常见许可证差异",
        items: ["MIT 通常比较宽松", "Apache-2.0 对专利授权说明更完整", "GPL 对衍生作品有更强约束", "AGPL 对网络服务场景更敏感"],
      },
      {
        type: "paragraphs",
        title: "介绍时应该写清边界",
        paragraphs: [
          "工具站介绍开源项目，不需要把许可证全文搬过来，但应该提醒用户以项目官方仓库和 LICENSE 文件为准。",
          "如果项目用于公司业务、商业产品或二次分发，最好在真正采用前做一次更严谨的合规确认。",
        ],
      },
      {
        type: "list",
        title: "推荐检查项",
        items: ["项目仓库是否仍在维护", "LICENSE 文件是否存在", "依赖项许可证是否兼容", "商业使用是否有额外限制"],
      },
    ],
  },
  "online-tools-safety": {
    tags: ["在线工具", "隐私安全", "文件处理"],
    sections: [
      {
        type: "paragraphs",
        title: "在线工具适合轻量任务",
        paragraphs: [
          "在线工具的优势是打开即用，适合图片压缩、格式转换、临时排版、白板绘图等轻量任务。",
          "但便利性不等于安全性。只要涉及上传文件，就需要先判断文件本身是否包含敏感信息。",
        ],
      },
      {
        type: "list",
        title: "不要随便上传的内容",
        items: ["身份证件和合同", "客户资料和内部文档", "密钥、令牌和配置文件", "未公开产品方案", "带隐私信息的照片"],
      },
      {
        type: "paragraphs",
        title: "先看隐私和删除规则",
        paragraphs: [
          "靠谱的在线工具通常会说明文件保存多久、是否会被公开访问、是否用于训练或统计分析。",
          "如果页面没有说明上传文件的处理方式，就应优先选择本地工具、开源自托管方案或可信平台。",
        ],
      },
      {
        type: "list",
        title: "更稳妥的做法",
        items: ["敏感文件优先本地处理", "上传前删除个人信息", "使用后及时清理链接", "重要资料不要依赖单一在线工具"],
      },
    ],
  },
};

export function getArticles(): ArticleItem[] {
  return mockArticles.map((article) => {
    const detail = articleDetails[article.id];

    return {
      ...article,
      slug: article.id,
      tags: detail?.tags ?? [article.category],
      sections: detail?.sections ?? [
        {
          type: "paragraphs",
          title: "文章说明",
          paragraphs: [article.summary],
        },
      ],
    };
  });
}

export function getArticleBySlug(slug: string) {
  return getArticles().find((article) => article.slug === slug);
}

export function getRelatedArticles(article: ArticleItem) {
  return getArticles()
    .filter((item) => item.slug !== article.slug)
    .filter((item) => item.category === article.category)
    .slice(0, 3);
}
