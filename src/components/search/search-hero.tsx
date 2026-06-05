const heroTags = ["工具搜索", "文章搜索", "标签匹配", "分类筛选", "快速发现"];
const suggestions = ["AI 写作", "PDF 工具", "开源项目", "图片处理", "效率软件"];

type SearchHeroProps = {
  onKeywordClick: (keyword: string) => void;
};

export function SearchHero({ onKeywordClick }: SearchHeroProps) {
  return (
    <section className="section-gradient-blue">
      <div className="page-shell py-14 sm:py-16 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-sky-200/80 bg-white/60 px-4 py-2 text-xs font-bold text-sky-700 shadow-sm backdrop-blur">
              全站发现入口
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              搜索工具、文章与效率技巧
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              输入关键词，快速查找 AI 工具、在线工具、开源项目、软件应用和使用教程。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {heroTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-sky-200/80 bg-white/65 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card-strong p-6 sm:p-8">
            <p className="text-sm font-bold text-sky-700">搜索建议</p>
            <h2 className="mt-3 text-2xl font-black text-ink">从常见关键词开始</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onKeywordClick(suggestion)}
                  className="min-h-11 rounded-2xl border border-white/75 bg-white/65 px-4 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/80 hover:text-sky-800 hover:shadow-md"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
