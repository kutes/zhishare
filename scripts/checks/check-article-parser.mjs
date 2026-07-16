// 文章内容标记解析器自检。直接 import src/lib/db/article-parser.mjs 跑最小样例,
// 断言:旧内容兼容(lead/big/编号/无重复标题)、[速览]/[来源] 仅文首、VIDEO 白名单、KEY/WHY/IMG 边界。
// 运行:node scripts/checks/check-article-parser.mjs

import { parseArticleSections } from "../../src/lib/db/article-parser.mjs";

const stubProvider = (url) => {
  if (url.startsWith("https://player.bilibili.com/")) return "bilibili";
  if (url.startsWith("https://www.youtube.com/embed/")) return "youtube";
  return null;
};

let failures = 0;

function check(name, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    console.log(`PASS  ${name}`);
  } else {
    failures += 1;
    console.error(`FAIL  ${name}\n  expected: ${e}\n  actual:   ${a}`);
  }
}

// 样例 1:旧文章(无任何新记号)——lead/big/编号/混合列表不重复标题
{
  const legacy = [
    "## 第一节标题",
    "",
    "第一段。",
    "第二段。",
    "第三段。",
    "",
    "- 项目甲",
    "- 项目乙",
    "",
    "## 第二节标题",
    "",
    "第二节第一段。",
    "第二节第二段。",
  ].join("\n");
  const { sections, tldr, sourceNote } = parseArticleSections(legacy, stubProvider);

  check("旧内容: 小节数量(混合内容不拆分)", sections.length, 2);
  check("旧内容: 编号", sections.map((s) => s.number), [1, 2]);
  check("旧内容: 无标签", sections.map((s) => s.tag), [undefined, undefined]);
  check(
    "旧内容: 第 1 节权重 lead/big/normal",
    sections[0].blocks.filter((b) => b.kind === "paragraph").map((b) => b.weight),
    ["lead", "big", "normal"],
  );
  check(
    "旧内容: 第 2 节 big 不出现",
    sections[1].blocks.filter((b) => b.kind === "paragraph").map((b) => b.weight),
    ["lead", "normal"],
  );
  check("旧内容: 列表合并进同一小节", sections[0].blocks.at(-1), { kind: "list", items: ["项目甲", "项目乙"] });
  check("旧内容: 无速览/来源", [tldr, sourceNote], [undefined, undefined]);
}

// 样例 2:完整新记号
{
  const modern = [
    "[速览]",
    "- 要点一。",
    "- 要点二。",
    "",
    "[来源] 本文基于官方文档整理。",
    "",
    "## [发布] 开篇标题",
    "",
    "开篇结论。",
    "开篇展开。",
    "",
    "[WHY] 与读者的关系。",
    "",
    "[KEY 核心 · 一] 正文里 **加粗短语** 保留星号。",
    "",
    "[IMG] https://example.com/a.jpg | 图说，来源：官方",
    "",
    "[VIDEO] https://player.bilibili.com/player.html?bvid=1 | 视频说明，来源：官方",
    "",
    "[VIDEO] https://evil.example.com/x | 非白名单被跳过",
    "",
    "## 无标签小节",
    "",
    "本节结论。",
  ].join("\n");
  const { sections, tldr, sourceNote } = parseArticleSections(modern, stubProvider);

  check("新记号: 速览收集", tldr, ["要点一。", "要点二。"]);
  check("新记号: 来源披露", sourceNote, "本文基于官方文档整理。");
  check("新记号: 小节标签", sections.map((s) => s.tag), ["发布", undefined]);
  check("新记号: 标题不含标签", sections[0].title, "开篇标题");
  check(
    "新记号: 第 1 节 block 顺序",
    sections[0].blocks.map((b) => b.kind),
    ["paragraph", "paragraph", "why", "keypoint", "photo", "video"],
  );
  check("新记号: WHY 文本", sections[0].blocks[2], { kind: "why", text: "与读者的关系。" });
  check("新记号: KEY 标签与星号保留", sections[0].blocks[3], {
    kind: "keypoint",
    tag: "核心 · 一",
    text: "正文里 **加粗短语** 保留星号。",
  });
  check("新记号: IMG 分隔裁剪", sections[0].blocks[4], {
    kind: "photo",
    url: "https://example.com/a.jpg",
    caption: "图说，来源：官方",
  });
  check("新记号: VIDEO 白名单通过", sections[0].blocks[5].provider, "bilibili");
  check(
    "新记号: 非白名单 VIDEO 整块跳过且不报错",
    sections[0].blocks.filter((b) => b.kind === "video").length,
    1,
  );
  check("新记号: 第 2 节首段仍是 lead", sections[1].blocks[0].weight, "lead");
}

// 样例 3:[来源] 只在文首生效;[速览] 只收紧邻列表
{
  const midSource = ["## 标题", "", "正文段。", "", "[来源] 出现在小节内不该被提取。"].join("\n");
  const { sections, sourceNote } = parseArticleSections(midSource, stubProvider);
  check("边界: 小节内 [来源] 不提取", sourceNote, undefined);
  check(
    "边界: 小节内 [来源] 行退化为普通段落",
    sections[0].blocks.at(-1).text,
    "[来源] 出现在小节内不该被提取。",
  );

  const brokenTldr = ["[速览]", "不是列表行", "- 这条不该被收进速览", "", "## 标题", "", "正文。"].join("\n");
  const parsed = parseArticleSections(brokenTldr, stubProvider);
  check("边界: 速览遇非列表行即停止收集", parsed.tldr, undefined);
}

// 样例 5:v2 富文块([SUB]/[STATS]/[VS]/[KV]/[STEPS]/[END])
{
  const rich = [
    "## 富文块小节",
    "",
    "本节结论。",
    "",
    "[SUB] 那么,它到底是什么?",
    "",
    "[STATS] 9750 亿|总参数 ;; 410 亿|每 token 激活",
    "",
    "[VS] 先去官网|官网能证明来源和授权。|直接用网盘|网盘链接只能证明文件存在。",
    "",
    "[VS] 推荐做法|去官网下载。 ;; 避免做法|网盘直接装。",
    "",
    "[KV] 免费额度|每天 50 次 ;; 离线可用|是 ;; 中文界面|是",
    "",
    "[STEPS] 打开官网|认准域名 ;; 下载安装包 ;; 校验签名|可选",
    "",
    "[STATS] 只有一项|不足两项该被丢弃",
    "",
    "[END] 一句可以带走的收束判断。",
  ].join("\n");
  const { sections } = parseArticleSections(rich, stubProvider);
  const blocks = sections[0].blocks;

  check(
    "富文块: block 顺序(非法块被丢弃)",
    blocks.map((b) => b.kind),
    ["paragraph", "subheading", "stats", "contrast", "kv", "steps", "takeaway"],
  );
  check("富文块: SUB 文本", blocks[1], { kind: "subheading", text: "那么,它到底是什么?" });
  check("富文块: STATS 拆条", blocks[2], {
    kind: "stats",
    items: [
      { value: "9750 亿", label: "总参数" },
      { value: "410 亿", label: "每 token 激活" },
    ],
  });
  check("富文块: 非两栏 VS 被丢弃,合法 VS 两栏解析", blocks[3], {
    kind: "contrast",
    good: { title: "推荐做法", text: "去官网下载。" },
    bad: { title: "避免做法", text: "网盘直接装。" },
  });
  check("富文块: KV 三行", blocks[4].rows.length, 3);
  check("富文块: STEPS 可选说明", blocks[5], {
    kind: "steps",
    items: [{ title: "打开官网", text: "认准域名" }, { title: "下载安装包" }, { title: "校验签名", text: "可选" }],
  });
  check("富文块: END 收束句", blocks[6], { kind: "takeaway", text: "一句可以带走的收束判断。" });
}

// 样例 4:无任何 ## 的纯文本(解析器返回隐式小节,兜底逻辑在 normalizers)
{
  const plain = ["只有一段话。", "第二段。"].join("\n");
  const { sections } = parseArticleSections(plain, stubProvider);
  check("兜底: 无标题内容进隐式小节", sections.length, 1);
  check("兜底: 隐式小节标题", sections[0].title, "正文内容");
  check(
    "兜底: 隐式小节也有 lead/big",
    sections[0].blocks.map((b) => b.weight),
    ["lead", "big"],
  );
}

if (failures > 0) {
  console.error(`\n${failures} 项断言失败`);
  process.exit(1);
}
console.log("\n全部断言通过");
