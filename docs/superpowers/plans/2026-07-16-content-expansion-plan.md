# 内容扩容计划(2026-07-16 制定,已获批准顺序:P0 → P1 → P2 → P3)

> 状态:计划已定稿,**尚未开始执行**。执行时每完成一批就验证、提交、向用户汇报一次。
> 所有写库走守门脚本(dry-run 默认 + `--execute` + 服务密钥仅环境变量 + 读回校验);
> 文案遵守 `docs/CONTENT_STYLE_STANDARD.md`;封面遵守封面链标准(真实图优先,禁大字母);
> 文章遵守 `docs/ARTICLE_CONTENT_STANDARD.md` v2(富文块)。

## P0 地基修补

### P0-1 给现有 5 篇文章挂标签

标签筛选器目前是空壳(6 个标签无一挂到文章)。需要建 articles↔tags 关联(沿用工具的 tool_tags 模式,先查 article_tags 表是否已存在;若无表则用现有标签字段方案,以实际 schema 为准,**不新建表**——零数据库改动原则,若确实无处可挂则此项降级为"标签在文章 markdown 中维护")。

| 文章 | 挂标签 |
| --- | --- |
| 免费 AI 工具到底安不安全 | 免费、AI写作 |
| 下载资源先去官网 | 免费、效率软件 |
| 5 个免费图片工具怎么分工 | 免费、图片处理 |
| 传文件不用网盘 | 免费、开源 |
| 笔记工具选 Notion 还是 Obsidian | 效率软件、中文 |

新增标签(如 schema 允许):`避坑`、`新手入门`。

### P0-2 完成并发布 2 个草稿工具

| slug | 处理 |
| --- | --- |
| raycast | 补全文案(定位:Mac 启动器/效率中枢;注意:仅 macOS,免费版够用)、抓官网真实封面、按文案标准写 audience/scenarios/优缺点,发布 |
| open-design | 先核实这是什么项目(草稿里 og:image 指向 GitHub repo)。若定位模糊/项目不活跃则**删除草稿**而不是硬发——收录质量优先 |

### P0-3 工具分类归并(10 → 7)

| 现分类 | 归入 |
| --- | --- |
| 图片工具(1)+ 图片处理(2) | **图片处理** |
| 效率工具(1)+ 效率软件(3)+ 效率笔记(1) | **效率软件**(Notion/Obsidian 属它) |
| 设计工具(2) | **设计创作**(后续 Excalidraw/draw.io 也进这里) |
| 视频剪辑(2) | **音视频**(为 OBS/HandBrake/Audacity 预留) |
| AI工具 / 在线工具 / 编程工具 | 保持不变 |

归并方式:改 tools.category_id 指向保留分类,清空后删除空分类(守门脚本,先 dry-run 输出迁移清单)。注意文章分类(工具合集/效率笔记/软件避坑/AI 入门)如与工具共表,只动工具引用的行,不碰文章分类。

## P1 工具库扩容:20 → 35(15 个新工具,分 3 批)

收录标准:免费可用(或免费额度实用)、国内可直接访问优先、适合"小白效率"定位、官网可抓真实封面。每个工具:按 CONTENT_STYLE_STANDARD 写全字段(tagline/description/highlight/audience/scenarios/优缺点,去模板腔、带操作体验)、真实封面(og:image 优先,抓不到用 Playwright 截官网首页,复用 upload-tool-cover-screenshots.mjs 模式)、挂分类挂标签。

### 批次 A:办公与系统(Windows 小白刚需,当前完全空缺)

| 工具 | 官网 | 免费/开源 | 一句话定位 | 国内访问 |
| --- | --- | --- | --- | --- |
| 7-Zip | 7-zip.org | 开源免费 | 压缩解压一个就够,替代付费 WinRAR | ✅ |
| Everything | voidtools.com | 免费 | 文件名秒搜,比 Windows 自带搜索快几个量级 | ✅ |
| PowerToys | learn.microsoft.com/powertoys(GitHub 发布) | 开源免费(微软官方) | Windows 增强合集:取色、批量改名、窗口布局 | ✅ |
| Snipaste | snipaste.com | 免费(Pro 可选) | 截图+贴图,截完钉在屏幕上对着抄 | ✅ 国产 |
| LibreOffice | libreoffice.org | 开源免费 | 免费办公套件,打开 doc/xls/ppt 不求人 | ✅ |

### 批次 B:音视频 + 画图白板

| 工具 | 官网 | 免费/开源 | 一句话定位 | 国内访问 |
| --- | --- | --- | --- | --- |
| OBS Studio | obsproject.com | 开源免费 | 录屏/直播标准工具,免费无水印无时长限制 | ✅ |
| HandBrake | handbrake.fr | 开源免费 | 视频压缩转码,大文件变小画质不崩 | ✅ |
| Audacity | audacityteam.org | 开源免费 | 录音剪音频,播客/配音入门够用 | ✅ |
| Excalidraw | excalidraw.com | 开源免费 | 手绘风白板,画架构图/示意图零学习成本 | ✅ |
| draw.io (diagrams.net) | drawio.com | 开源免费 | 正经流程图/架构图,可存本地不上传 | ✅ |

### 批次 C:AI 助手 + 浏览器增强

| 工具 | 官网 | 免费/开源 | 一句话定位 | 国内访问 |
| --- | --- | --- | --- | --- |
| DeepSeek | deepseek.com | 免费 | 国产免费 AI 对话,推理能力强,不限次 | ✅ 国产 |
| Kimi | kimi.moonshot.cn | 免费 | 长文档阅读总结见长,网页/PDF 直接喂 | ✅ 国产 |
| 豆包 | doubao.com | 免费 | 字节系 AI 助手,语音/图片功能全,上手门槛最低 | ✅ 国产 |
| uBlock Origin | github.com/gorhill/uBlock | 开源免费 | 浏览器去广告标准答案,省流量提速 | ✅(商店安装视浏览器) |
| 沉浸式翻译 | immersivetranslate.com | 免费(Pro 可选) | 网页双语对照翻译,读外文资料利器 | ✅ 国产 |

批次内流程:写文案 JSON → 守门 INSERT(复用 insert 脚本改造为工具版,或走后台表单模式)→ 抓封面 → 截图验证列表/详情页 → 提交汇报。**每批做完停下来给用户看**。

### 候补名单(用户想换人时备选)

Ventoy(U盘装机)、LocalMonero 不收、Motrix(下载器)、Zotero(文献)、Calibre(电子书)、KeePassXC(密码库,注意:涉及密码管理需谨慎表述)、Flameshot、Inkscape、Blender(偏专业)。

## P2 文章扩容:5 → 10(全部 v2 富格式)

每篇必含:速览、⚑来源、编号节、≥1 个富文块(对比卡/参数表/步骤条按内容选)、教读图式图注(如有图)、[END] 收束句;封面走封面链(相关工具真实图 > 亮色简笔画);互链站内工具详情页。

| # | 选题 | 绑定工具 | 主打富文块 | 分类 |
| --- | --- | --- | --- | --- |
| 1 | 装机先装这 4 个:7-Zip、Everything、PowerToys、Snipaste 各管什么 | 批次 A | KV 参数表 + 分工列表 | 工具合集 |
| 2 | OBS 第一次录屏:从安装到出片的完整路径 | OBS | STEPS 步骤条 ×2 + 避坑 KEY | 效率笔记 |
| 3 | 在线画图选 Excalidraw 还是 draw.io:先看你画给谁看 | Excalidraw/draw.io | VS 对比卡 + KV | 效率笔记 |
| 4 | 国内免费 AI 助手怎么选:DeepSeek、Kimi、豆包各自强在哪 | 批次 C | KV 对照 + STATS(免费额度等真实数字,查证后写,查不到不编) | AI 入门 |
| 5 | 浏览器两件套:uBlock 去广告 + 沉浸式翻译读外文 | uBlock/沉浸式翻译 | STEPS 安装配置 + VS 好坏做法 | 软件避坑/工具合集 |

写作顺序跟批次走:批次 A 发布后写 #1,B 后写 #2/#3,C 后写 #4/#5。

## P3 工具详情页富格式(原任务 #52)

复用文章的富文块 CSS 组件(article-detail-stats/kv/contrast 已有样式,提取为共用类或在工具详情页写等价类):

| 工具详情现有数据 | 呈现为 |
| --- | --- |
| GitHub stars/forks/issues(开源工具,GitHub API 真实数据) | STATS 大数字卡 |
| 价格/平台/开源协议/中文支持 | KV 参数表 |
| 优点/缺点列表 | VS 双栏对比卡(替换现纯列表) |
| 上手步骤(如文案里有) | STEPS 步骤条 |

原则:只做真实数据的可视化,没有的数据不编造;GitHub 数据需要脚本定期抓取回写(guarded,记录抓取时间)。

## 验收清单(每期完成时过一遍)

- [ ] P0:标签筛选器出现真实标签且可筛;草稿清零;分类数 ≤7 且无空分类
- [ ] P1:35 个工具全部真实封面、全字段文案、分类标签齐;三批各有截图验证记录
- [ ] P2:10 篇文章全部含富文块与收束句;新 5 篇与工具互链
- [ ] P3:开源工具详情页出现真实 star 数字卡;优缺点变对比卡
- [ ] 全程:无假数据;每批一个 commit;推送线上仅在用户明确说时执行
