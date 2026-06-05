type AdPlaceholderProps = {
  variant: "sidebar" | "banner" | "inline";
  title?: string;
  description?: string;
  className?: string;
};

const variantClasses: Record<AdPlaceholderProps["variant"], string> = {
  sidebar: "min-h-28 px-5 py-6 lg:min-h-52",
  banner: "min-h-32 px-5 py-7 sm:px-8 lg:px-10",
  inline: "min-h-24 px-5 py-5",
};

const contentClasses: Record<AdPlaceholderProps["variant"], string> = {
  sidebar: "flex-col text-center sm:flex-row sm:text-left lg:flex-col lg:text-center",
  banner: "flex-col text-center sm:flex-row sm:items-center sm:justify-between sm:text-left",
  inline: "flex-col text-center sm:flex-row sm:items-center sm:justify-between sm:text-left",
};

export function AdPlaceholder({
  variant,
  title = "合作推广",
  description = "此处可展示赞助工具、精选服务或广告内容",
  className = "",
}: AdPlaceholderProps) {
  return (
    <aside
      aria-label={`${title}广告位`}
      className={`ad-glass flex w-full items-center justify-center gap-4 border-dashed ${variantClasses[variant]} ${className}`}
    >
      <div className={`flex w-full max-w-3xl gap-4 ${contentClasses[variant]}`}>
        <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50/80 text-xs font-black text-cyan-700 shadow-inner sm:mx-0">
          广告位
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold tracking-[0.16em] text-slate-500">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
    </aside>
  );
}
