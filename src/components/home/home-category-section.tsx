import type { MockCategory } from "@/data/mock-tools";

type HomeCategorySectionProps = {
  categories: MockCategory[];
};

export function HomeCategorySection({ categories }: HomeCategorySectionProps) {
  return (
    <section id="categories" className="section-gradient-cyan section-block">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-cyan-700">场景分类</p>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">按使用场景开始浏览</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            分类先保持简单，后续接入数据库时再根据真实内容数量调整。
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="mt-8 grid gap-5 lg:grid-cols-4">
            {categories.map((category) => (
              <article key={category.name} className="glass-card soft-card-hover flex min-h-52 flex-col p-5">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-white text-base font-black text-cyan-700 shadow-inner">
                  {category.name.slice(0, 1)}
                </div>
                <h3 className="text-xl font-black text-ink">{category.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">{category.description}</p>
                <p className="mt-5 inline-flex w-fit rounded-full border border-white/75 bg-white/60 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {category.count} 个项目
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="glass-card mt-8 p-6 text-sm leading-7 text-slate-500">
            暂无可展示分类。发布内容后，这里会显示分类入口。
          </div>
        )}
      </div>
    </section>
  );
}
