type CopyrightNoticeProps = {
  className?: string;
};

export function CopyrightNotice({ className = "" }: CopyrightNoticeProps) {
  return (
    <section
      className={`glass-card border-slate-200/80 px-4 py-5 text-xs leading-6 text-slate-500 sm:px-5 sm:text-sm sm:leading-7 ${className}`}
    >
      <h2 className="text-sm font-bold text-slate-800">版权声明</h2>
      <div className="mt-3 space-y-3">
        <p>本文由知享整理发布，主要用于信息整理、技术研究、工具体验与经验分享。</p>
        <p>
          文中提到的工具、项目、软件、网站或服务，版权、商标及相关权益均归原作者、开发者或所属公司所有。本站不提供破解、盗版、绕过付费、未授权下载或侵权资源，相关功能、价格、授权方式、服务条款及隐私政策请以官方网站说明为准。
        </p>
        <p>
          如本文内容存在错误、失效链接，或涉及版权、商标、授权、权益等问题，请通过邮箱联系我们：tiancaisongkuntai#gmail.com。发送邮件时请将 # 替换为 @，并提供相关证明材料，我们会在核实后及时处理。
        </p>
        <p>转载或引用本站内容，请保留原文链接并注明来源。</p>
      </div>
    </section>
  );
}
