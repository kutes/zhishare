// Tool detail media lives as a per-tool JSON file in the public `tool-media`
// storage bucket (tool-media/{slug}.json). This avoids a schema change while
// letting guarded scripts populate galleries. The detail page fetches it
// server-side; any failure yields an empty gallery so the page never breaks.

export type ToolMediaImage = {
  type: "image";
  url: string;
  caption?: string;
};

export type ToolMediaEmbed = {
  type: "embed";
  provider: "bilibili" | "youtube";
  url: string;
  caption?: string;
};

export type ToolMediaItem = ToolMediaImage | ToolMediaEmbed;

// Only these hosts may be turned into an <iframe>, to prevent arbitrary embeds.
const EMBED_HOST_ALLOWLIST = new Map<string, "bilibili" | "youtube">([
  ["player.bilibili.com", "bilibili"],
  ["www.youtube.com", "youtube"],
  ["youtube.com", "youtube"],
  ["www.youtube-nocookie.com", "youtube"],
]);

export function getEmbedProvider(url: string): "bilibili" | "youtube" | null {
  try {
    const host = new URL(url).host.toLowerCase();
    return EMBED_HOST_ALLOWLIST.get(host) ?? null;
  } catch {
    return null;
  }
}

function sanitizeItems(raw: unknown): ToolMediaItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const items: ToolMediaItem[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object") {
      continue;
    }
    const record = entry as Record<string, unknown>;
    const caption = typeof record.caption === "string" ? record.caption.trim() : undefined;

    if (record.type === "image" && typeof record.url === "string" && /^https?:\/\//.test(record.url)) {
      items.push({ type: "image", url: record.url, caption });
      continue;
    }

    if (record.type === "embed" && typeof record.url === "string") {
      const provider = getEmbedProvider(record.url);
      if (provider) {
        items.push({ type: "embed", provider, url: record.url, caption });
      }
    }
  }
  return items;
}

export async function fetchToolMedia(slug: string): Promise<ToolMediaItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  if (!baseUrl || !slug) {
    return [];
  }

  const url = `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/tool-media/${encodeURIComponent(slug)}.json`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    const data: unknown = await response.json();
    const items = (data as { items?: unknown })?.items;
    return sanitizeItems(items);
  } catch {
    return [];
  }
}

// Optional per-tool feature list ("核心功能"). The tools table has no features
// column, so it lives in the same tool-media/{slug}.json under `features`;
// the detail page merges it into the tool object where getToolList expects it.
export async function fetchToolFeatures(slug: string): Promise<string[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  if (!baseUrl || !slug) {
    return [];
  }

  const url = `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/tool-media/${encodeURIComponent(slug)}.json`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }
    const data: unknown = await response.json();
    const value = (data as { features?: unknown })?.features;
    if (!Array.isArray(value)) {
      return [];
    }
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  } catch {
    return [];
  }
}

// Optional per-tool official download page URL. Stored in the same tool-media/{slug}.json
// under `officialDownloadUrl` so no schema change is needed; guarded scripts populate it.
// The detail page renders a disabled (gray) button when this is absent.
export async function fetchToolOfficialDownloadUrl(slug: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  if (!baseUrl || !slug) {
    return "";
  }

  const url = `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/tool-media/${encodeURIComponent(slug)}.json`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return "";
    }
    const data: unknown = await response.json();
    const value = (data as { officialDownloadUrl?: unknown })?.officialDownloadUrl;
    return typeof value === "string" && /^https?:\/\//.test(value.trim()) ? value.trim() : "";
  } catch {
    return "";
  }
}
