// Deterministic warm-editorial SVG covers for tools. Zero deps; runs in Node and browser.
// Palette and motifs are locked to the site's warm editorial theme.

const BG_TOP = "#171210";
const BG_BOTTOM = "#120f0e";
const CREAM = "#F7F1EA";
const ACCENTS = ["#E3A75F", "#D98E4A", "#EDBD7E"];
const SERIF = "Songti SC, Noto Serif SC, STSong, Source Han Serif SC, Georgia, SimSun, serif";
const SANS = "PingFang SC, Microsoft YaHei, Helvetica Neue, Arial, sans-serif";

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Short label under the big initials, so generated covers read as intentional
// branded art rather than placeholders. Long titles are truncated with an ellipsis.
function coverLabel(title) {
  const text = String(title ?? "").trim();
  if (!text) return "";
  return escapeXml(text.length > 22 ? `${text.slice(0, 21)}…` : text);
}

export function getToolInitials(title) {
  if (!title || title.trim().length === 0) {
    return "工";
  }
  const text = title.trim();
  const upperChars = text.replace(/[^A-Z]/g, "");
  if (upperChars.length >= 2) {
    return upperChars.slice(0, 2);
  }
  if (upperChars.length === 1 && text.length > 1) {
    const secondChar = text.replace(/[^a-zA-Z]/g, "").charAt(1);
    return upperChars + (secondChar || text.charAt(1).toUpperCase());
  }
  return text.slice(0, 2);
}

function hashString(value) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) + hash + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

// One geometric motif per category family; keyed by BOTH slug and display name.
const MOTIFS = {
  brackets: (a) =>
    `<g stroke="${a}" stroke-width="10" fill="none" opacity="0.5">` +
    `<path d="M-40 80 L60 180 L-40 280"/><path d="M1240 395 L1140 495 L1240 595"/></g>`,
  ripples: (a) =>
    `<g stroke="${a}" fill="none" opacity="0.45">` +
    [90, 150, 210, 270].map((r) => `<circle cx="1050" cy="120" r="${r}" stroke-width="3"/>`).join("") +
    `</g>`,
  grid: (a) => {
    let dots = "";
    for (let x = 60; x <= 420; x += 72) {
      for (let y = 420; y <= 620; y += 66) {
        dots += `<circle cx="${x}" cy="${y}" r="5" fill="${a}"/>`;
      }
    }
    return `<g opacity="0.4">${dots}</g>`;
  },
  starburst: (a) => {
    let rays = "";
    for (let i = 0; i < 12; i += 1) {
      const ang = (Math.PI * 2 * i) / 12;
      const x1 = 1080 + Math.cos(ang) * 70;
      const y1 = 140 + Math.sin(ang) * 70;
      const x2 = 1080 + Math.cos(ang) * 150;
      const y2 = 140 + Math.sin(ang) * 150;
      rays += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    }
    return `<g stroke="${a}" stroke-width="6" opacity="0.5">${rays}</g>`;
  },
  branches: (a) =>
    `<g stroke="${a}" stroke-width="6" fill="none" opacity="0.5">` +
    `<path d="M80 620 L80 460 M80 520 L200 420 M80 560 L220 560"/>` +
    `<circle cx="80" cy="440" r="14" fill="${a}"/><circle cx="214" cy="410" r="14" fill="${a}"/>` +
    `<circle cx="236" cy="560" r="14" fill="${a}"/></g>`,
  rings: (a) =>
    `<g stroke="${a}" fill="none" opacity="0.5">` +
    `<circle cx="150" cy="150" r="90" stroke-width="14"/><circle cx="150" cy="150" r="40" stroke-width="6"/></g>`,
  viewfinder: (a) =>
    `<g stroke="${a}" stroke-width="10" fill="none" opacity="0.5">` +
    `<path d="M950 60 h90 M950 60 v90 M1140 615 h-90 M1140 615 v-90"/>` +
    `<circle cx="1045" cy="337" r="46" stroke-width="6"/></g>`,
  timeline: (a) => {
    let marks = "";
    for (let x = 80; x <= 560; x += 60) {
      const tall = ((x / 60) | 0) % 2 === 0;
      marks += `<line x1="${x}" y1="${tall ? 540 : 560}" x2="${x}" y2="600"/>`;
    }
    return `<g stroke="${a}" stroke-width="6" opacity="0.5"><line x1="60" y1="600" x2="580" y2="600"/>${marks}</g>`;
  },
  ruled: (a) =>
    `<g stroke="${a}" stroke-width="4" opacity="0.4">` +
    [480, 520, 560, 600].map((y) => `<line x1="70" y1="${y}" x2="430" y2="${y}"/>`).join("") +
    `</g>`,
  hazard: (a) => {
    let stripes = "";
    for (let x = 880; x <= 1220; x += 56) {
      stripes += `<line x1="${x}" y1="675" x2="${x + 120}" y2="555"/>`;
    }
    return `<g stroke="${a}" stroke-width="12" opacity="0.4">${stripes}</g>`;
  },
  mosaic: (a) => {
    let cells = "";
    for (let x = 0; x < 3; x += 1) {
      for (let y = 0; y < 3; y += 1) {
        cells += `<rect x="${970 + x * 78}" y="${420 + y * 78}" width="58" height="58" rx="12"/>`;
      }
    }
    return `<g stroke="${a}" stroke-width="5" fill="none" opacity="0.45">${cells}</g>`;
  },
};

const CATEGORY_MOTIF = {
  "coding-tools": "brackets",
  "编程工具": "brackets",
  "online-tools": "ripples",
  "在线工具": "ripples",
  "productivity": "grid",
  "效率软件": "grid",
  "productivity-tools": "grid",
  "效率工具": "grid",
  "ai-tools": "starburst",
  "AI工具": "starburst",
  "ai-basics": "starburst",
  "AI 入门": "starburst",
  "open-source": "branches",
  "开源项目": "branches",
  "design-tools": "rings",
  "设计工具": "rings",
  "image-tools": "viewfinder",
  "图片工具": "viewfinder",
  "image-processing": "viewfinder",
  "图片处理": "viewfinder",
  "video-editing": "timeline",
  "视频剪辑": "timeline",
  "productivity-notes": "ruled",
  "效率笔记": "ruled",
  "software-risks": "hazard",
  "软件避坑": "hazard",
  "tool-collections": "mosaic",
  "工具合集": "mosaic",
};

function resolveMotif(category) {
  const key = String(category ?? "").trim();
  return MOTIFS[CATEGORY_MOTIF[key] ?? "grid"];
}

export function generateToolCover({ title, slug, category }) {
  const hash = hashString(String(slug ?? ""));
  const accent = ACCENTS[hash % ACCENTS.length];
  const initials = getToolInitials(String(title ?? ""));
  const label = coverLabel(title);
  const motif = resolveMotif(category);
  const glowX = 300 + (hash % 600);

  const coverSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img">` +
    `<defs>` +
    `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${BG_TOP}"/><stop offset="1" stop-color="${BG_BOTTOM}"/>` +
    `</linearGradient>` +
    `<radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">` +
    `<stop offset="0" stop-color="${accent}" stop-opacity="0.28"/>` +
    `<stop offset="1" stop-color="${accent}" stop-opacity="0"/>` +
    `</radialGradient>` +
    `</defs>` +
    `<rect width="1200" height="675" fill="url(#bg)"/>` +
    `<ellipse cx="${glowX}" cy="180" rx="460" ry="300" fill="url(#glow)"/>` +
    `<ellipse cx="1050" cy="620" rx="380" ry="240" fill="rgba(91,58,82,0.18)"/>` +
    motif(accent) +
    `<text x="600" y="300" dy="0.36em" text-anchor="middle" fill="${CREAM}" ` +
    `font-family="${SERIF}" font-size="196" font-weight="600" letter-spacing="8">${initials}</text>` +
    (label
      ? `<line x1="540" y1="452" x2="660" y2="452" stroke="${accent}" stroke-width="4" opacity="0.85"/>` +
        `<text x="600" y="512" text-anchor="middle" fill="${CREAM}" fill-opacity="0.92" ` +
        `font-family="${SANS}" font-size="52" font-weight="600" letter-spacing="2">${label}</text>`
      : "") +
    `<rect x="0.5" y="0.5" width="1199" height="674" fill="none" stroke="rgba(247,241,234,0.1)"/>` +
    `</svg>`;

  const iconSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img">` +
    `<defs>` +
    `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${BG_TOP}"/><stop offset="1" stop-color="${BG_BOTTOM}"/>` +
    `</linearGradient>` +
    `</defs>` +
    `<rect width="256" height="256" rx="28" fill="url(#bg)"/>` +
    `<circle cx="200" cy="56" r="64" fill="${accent}" opacity="0.22"/>` +
    `<text x="128" y="128" dy="0.36em" text-anchor="middle" fill="${CREAM}" ` +
    `font-family="${SERIF}" font-size="92" font-weight="600" letter-spacing="2">${initials}</text>` +
    `<rect x="1" y="1" width="254" height="254" rx="27" fill="none" stroke="rgba(227,167,95,0.4)" stroke-width="2"/>` +
    `</svg>`;

  return { coverSvg, iconSvg };
}
