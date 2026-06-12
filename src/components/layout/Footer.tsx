import Link from "next/link";

const quickLinks = [
  { label: "首页", href: "/" },
  { label: "工具库", href: "/tools" },
  { label: "文章", href: "/articles" },
  { label: "搜索", href: "/search" },
];

const mobileQuickLinks = [
  { label: "首页", href: "/" },
  { label: "工具库", href: "/tools" },
  { label: "文章", href: "/articles" },
];

const feedbackLinks = [
  { label: "推荐工具", href: "/submit" },
  { label: "版权投诉", href: "/copyright" },
];

const principles = ["来源清晰", "人工整理", "不提供破解盗版", "优先指向官网"];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="section-gradient-soft border-t border-white/70">
      <div className="page-shell py-8 sm:py-12">
        <div className="glass-card-strong p-4 sm:p-8">
          <div className="space-y-5 md:hidden">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
                  知
                </span>
                <span className="text-lg font-bold text-ink">知享</span>
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600">
                一个面向中文用户的工具与知识发现站，持续整理 AI 工具、在线工具、效率软件、开源项目和实用教程。
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold text-ink">快速访问</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {mobileQuickLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-white/70 pt-4 text-xs font-medium text-slate-500">
              © {year} 知享. All rights reserved.
            </div>
          </div>

          <div className="hidden gap-8 md:grid md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
                  知
                </span>
                <span className="text-lg font-bold text-ink">知享</span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
                一个面向中文用户的工具与知识发现站，持续整理 AI 工具、在线工具、效率软件、开源项目和实用教程。
              </p>
            </div>

            <FooterLinkGroup title="快速访问" links={quickLinks} />
            <FooterLinkGroup title="参与与反馈" links={feedbackLinks} />

            <div>
              <h2 className="text-sm font-bold text-ink">内容原则</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {principles.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/70 bg-white/60 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden border-t border-white/70 pt-5 text-xs font-medium text-slate-500 md:block">
            © {year} 知享. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h2 className="text-sm font-bold text-ink">{title}</h2>
      <div className="mt-4 grid gap-3">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
