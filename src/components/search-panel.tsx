const popularKeywords = ["AI 写作", "开源工具", "图片处理", "效率软件", "在线白板"];

export function SearchPanel() {
  return (
    <section id="search" className="relative -mt-10 px-4 pb-12 sm:px-6 lg:px-8">
      <div className="page-shell glass-card p-4 sm:p-6 lg:p-7">
        <form className="grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="tool-search">
            搜索工具
          </label>
          <input
            id="tool-search"
            name="q"
            type="search"
            placeholder="搜索工具、AI 应用、开源项目或使用技巧"
            className="min-h-14 rounded-[18px] border border-white/80 bg-white/75 px-5 text-base text-ink shadow-inner outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100 sm:min-h-16"
          />
          <button
            type="submit"
            className="min-h-14 rounded-[18px] bg-ink px-8 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-lg sm:min-h-16"
          >
            搜索
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="mr-1 font-medium text-slate-500">热门：</span>
          {popularKeywords.map((keyword) => (
            <a
              key={keyword}
              href="#featured-tools"
              className="rounded-full border border-white/80 bg-white/65 px-4 py-2 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
            >
              {keyword}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
