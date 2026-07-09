import type { ToolMediaItem } from "@/lib/media/tool-media";

type ToolMediaGalleryProps = {
  items: ToolMediaItem[];
  className?: string;
};

// Renders official screenshots (with captions) and allowlisted video embeds
// inside the detail article. Renders nothing when there is no media.
export function ToolMediaGallery({ items, className = "" }: ToolMediaGalleryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={`tool-detail-section tool-media ${className}`.trim()}>
      <h2 className="tool-detail-section-title">截图与演示</h2>
      <div className="tool-media-list">
        {items.map((item, index) => (
          <figure className="tool-media-item" key={`${item.type}-${index}`}>
            {item.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="tool-media-image" src={item.url} alt={item.caption ?? ""} loading="lazy" />
            ) : (
              <div className="tool-media-embed">
                <iframe
                  src={item.url}
                  title={item.caption ?? `视频演示 ${index + 1}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            )}
            {item.caption ? <figcaption className="tool-media-caption">{item.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
