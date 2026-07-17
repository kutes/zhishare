// 文章内容标记解析器(状态机,单趟扫描)。
// 独立 .mjs 文件:node 可直接 import 做自检(scripts/checks/check-article-parser.mjs),
// TS 侧经 article-parser.d.mts 获得类型。视频白名单判定由调用方注入,避免依赖 TS 模块。
// 标记语法见 docs/ARTICLE_CONTENT_STANDARD.md 与对应 spec。

const LIST_LINE_PATTERN = /^(?:[-*•]|\d+[.)])\s+(.+)$/;

function splitEntries(payload) {
  return payload
    .split(";;")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function parseArticleSections(markdown, getEmbedProvider) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const sections = [];

  let current = null;
  let tldr;
  let sourceNote;
  let collectingTldr = false;
  let seenHeading = false;
  let atSectionStart = false;
  let openingParagraphs = 0;

  const pushCurrent = () => {
    if (current) {
      sections.push(current);
      current = null;
    }
  };

  const ensureSection = () => {
    if (!current) {
      current = { number: sections.length + 1, title: "正文内容", blocks: [] };
      atSectionStart = true;
      openingParagraphs = 0;
    }
    return current;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (collectingTldr) {
      const tldrItem = line.match(LIST_LINE_PATTERN);
      if (tldrItem) {
        tldr.push(tldrItem[1].trim());
        continue;
      }
      collectingTldr = false;
    }

    if (!line || line === "---") {
      continue;
    }

    if (!seenHeading && !current) {
      if (line === "[速览]" && !tldr) {
        tldr = [];
        collectingTldr = true;
        continue;
      }

      const sourceMatch = line.match(/^\[来源\]\s*(.+)$/);
      if (sourceMatch && !sourceNote) {
        sourceNote = sourceMatch[1].trim();
        continue;
      }
    }

    const headingMatch = line.match(/^#{1,3}\s*(?:\[([^\]]+)\])?\s*(.+)$/);
    if (headingMatch) {
      pushCurrent();
      current = {
        number: sections.length + 1,
        tag: headingMatch[1]?.trim() || undefined,
        title: headingMatch[2].trim(),
        blocks: [],
      };
      seenHeading = true;
      atSectionStart = true;
      openingParagraphs = 0;
      continue;
    }

    const whyMatch = line.match(/^\[WHY\]\s*(.+)$/);
    if (whyMatch) {
      ensureSection().blocks.push({ kind: "why", text: whyMatch[1].trim() });
      atSectionStart = false;
      continue;
    }

    const keyMatch = line.match(/^\[KEY\s+([^\]]+)\]\s*(.+)$/);
    if (keyMatch) {
      ensureSection().blocks.push({ kind: "keypoint", tag: keyMatch[1].trim(), text: keyMatch[2].trim() });
      atSectionStart = false;
      continue;
    }

    const imgMatch = line.match(/^\[IMG\]\s*(.+)$/);
    if (imgMatch) {
      const [url, ...captionParts] = imgMatch[1].split("|");
      if (url?.trim()) {
        ensureSection().blocks.push({
          kind: "photo",
          url: url.trim(),
          caption: captionParts.join("|").trim(),
        });
        atSectionStart = false;
      }
      continue;
    }

    const mp4Match = line.match(/^\[MP4\]\s*(.+)$/);
    if (mp4Match) {
      const [url, ...rest] = mp4Match[1].split("|");
      if (url?.trim()) {
        // rest 可选：第一段为 poster（图片路径），其余为 caption
        let poster = "";
        let captionParts = rest;
        if (rest[0] && /\.(jpg|jpeg|png|webp|svg)$/i.test(rest[0].trim())) {
          poster = rest[0].trim();
          captionParts = rest.slice(1);
        }
        ensureSection().blocks.push({
          kind: "localvideo",
          url: url.trim(),
          poster,
          caption: captionParts.join("|").trim(),
        });
        atSectionStart = false;
      }
      continue;
    }

    const videoMatch = line.match(/^\[VIDEO\]\s*(.+)$/);
    if (videoMatch) {
      const [url, ...captionParts] = videoMatch[1].split("|");
      const provider = url?.trim() ? getEmbedProvider(url.trim()) : null;
      if (provider) {
        ensureSection().blocks.push({
          kind: "video",
          url: url.trim(),
          caption: captionParts.join("|").trim(),
          provider,
        });
        atSectionStart = false;
      }
      continue;
    }

    // v2 富文块标记(docs/ARTICLE_CONTENT_STANDARD.md「v2 补充」)。
    // 复合块用 ;; 分隔条目、| 分隔条目内字段;条目不合法时整块丢弃,不渲染半个组件。
    const subMatch = line.match(/^\[SUB\]\s*(.+)$/);
    if (subMatch) {
      ensureSection().blocks.push({ kind: "subheading", text: subMatch[1].trim() });
      atSectionStart = false;
      continue;
    }

    const statsMatch = line.match(/^\[STATS\]\s*(.+)$/);
    if (statsMatch) {
      const items = splitEntries(statsMatch[1])
        .map((entry) => {
          const [value, ...labelParts] = entry.split("|");
          return { value: value?.trim() ?? "", label: labelParts.join("|").trim() };
        })
        .filter((item) => item.value && item.label);
      if (items.length >= 2) {
        ensureSection().blocks.push({ kind: "stats", items });
        atSectionStart = false;
      }
      continue;
    }

    const vsMatch = line.match(/^\[VS\]\s*(.+)$/);
    if (vsMatch) {
      const halves = splitEntries(vsMatch[1]).map((entry) => {
        const [title, ...textParts] = entry.split("|");
        return { title: title?.trim() ?? "", text: textParts.join("|").trim() };
      });
      if (halves.length === 2 && halves.every((half) => half.title && half.text)) {
        ensureSection().blocks.push({ kind: "contrast", good: halves[0], bad: halves[1] });
        atSectionStart = false;
      }
      continue;
    }

    const kvMatch = line.match(/^\[KV\]\s*(.+)$/);
    if (kvMatch) {
      const rows = splitEntries(kvMatch[1])
        .map((entry) => {
          const [key, ...valueParts] = entry.split("|");
          return { key: key?.trim() ?? "", value: valueParts.join("|").trim() };
        })
        .filter((row) => row.key && row.value);
      if (rows.length >= 2) {
        ensureSection().blocks.push({ kind: "kv", rows });
        atSectionStart = false;
      }
      continue;
    }

    const stepsMatch = line.match(/^\[STEPS\]\s*(.+)$/);
    if (stepsMatch) {
      const items = splitEntries(stepsMatch[1])
        .map((entry) => {
          const [title, ...textParts] = entry.split("|");
          const text = textParts.join("|").trim();
          return { title: title?.trim() ?? "", ...(text ? { text } : {}) };
        })
        .filter((item) => item.title);
      if (items.length >= 2) {
        ensureSection().blocks.push({ kind: "steps", items });
        atSectionStart = false;
      }
      continue;
    }

    const endMatch = line.match(/^\[END\]\s*(.+)$/);
    if (endMatch) {
      ensureSection().blocks.push({ kind: "takeaway", text: endMatch[1].trim() });
      atSectionStart = false;
      continue;
    }

    const listMatch = line.match(LIST_LINE_PATTERN);
    if (listMatch) {
      const section = ensureSection();
      const lastBlock = section.blocks[section.blocks.length - 1];
      if (lastBlock?.kind === "list") {
        lastBlock.items.push(listMatch[1].trim());
      } else {
        section.blocks.push({ kind: "list", items: [listMatch[1].trim()] });
      }
      atSectionStart = false;
      continue;
    }

    const section = ensureSection();
    const text = line.replace(/^>\s?/, "");
    let weight = "normal";
    if (atSectionStart && openingParagraphs === 0) {
      weight = "lead";
      openingParagraphs = 1;
    } else if (atSectionStart && openingParagraphs === 1) {
      weight = section.number === 1 ? "big" : "normal";
      atSectionStart = false;
    }
    section.blocks.push({ kind: "paragraph", text, weight });
  }

  pushCurrent();

  return {
    sections,
    tldr: tldr && tldr.length > 0 ? tldr : undefined,
    sourceNote,
  };
}
