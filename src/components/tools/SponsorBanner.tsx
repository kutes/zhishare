export function SponsorBanner() {
  const sellingPoints = [
    {
      mark: "01",
      label: "高质量曝光",
      desc: "面向正在主动寻找工具的用户。",
    },
    {
      mark: "02",
      label: "品牌展示",
      desc: "在工具库场景中自然触达受众。",
    },
    {
      mark: "03",
      label: "灵活合作",
      desc: "支持多种内容与广告形式。",
    },
  ];

  return (
    <section className="zh-tools-sponsor">
      <div className="zh-tools-sponsor-copy">
        <p className="zh-tools-eyebrow">SPONSORED</p>
        <h2 className="zh-tools-section-title">在这里展示你的产品或服务</h2>
        <p className="zh-tools-section-copy">
          我们会把广告位放在资源发现链路里，让产品信息和用户需求更自然地发生连接。
        </p>
        <button type="button" className="zh-tools-button">
          了解合作
        </button>
      </div>

      <div className="zh-tools-sponsor-grid">
        {sellingPoints.map((point) => (
          <div key={point.label} className="zh-tools-sponsor-card">
            <span className="zh-tools-sponsor-mark">{point.mark}</span>
            <div>
              <p className="zh-tools-sponsor-title">{point.label}</p>
              <p className="zh-tools-sponsor-desc">{point.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
