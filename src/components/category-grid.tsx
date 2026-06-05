import type { MockCategory } from "@/data/mock-tools";

const accentClasses: Record<MockCategory["accent"], string> = {
  cyan: "bg-cyan-400",
  emerald: "bg-emerald-400",
  amber: "bg-amber-400",
  blue: "bg-blue-400",
};

type CategoryGridProps = {
  categories: MockCategory[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section id="categories" className="section-gradient-cyan section-block">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-cyan-700">分类入口</p>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">按使用场景开始浏览</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            分类先保持简单，后续接入数据库时再根据真实内容数量调整。
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <a
              key={category.name}
              href="#featured-tools"
              className="glass-card soft-card-hover group flex min-h-48 flex-col p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`h-3 w-3 rounded-full shadow-sm ${accentClasses[category.accent]}`} />
                <span className="rounded-full border border-white/70 bg-white/60 px-3 py-1 text-xs font-semibold text-slate-500">
                  {category.count} 个条目
                </span>
              </div>
              <h3 className="mt-8 text-xl font-black text-ink">{category.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">{category.description}</p>
              <p className="mt-5 text-sm font-semibold text-cyan-700 transition group-hover:text-cyan-600">浏览分类</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
