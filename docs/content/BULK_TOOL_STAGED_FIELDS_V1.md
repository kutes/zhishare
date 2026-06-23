# 首批工具内容 staged CSV 字段冻结 v1

Status: active

## 1. 目标

本文件用于冻结 `zhishare` 首批工具内容的 staged CSV 字段。

下一步 ChatGPT 会按这个字段生成第一批 50 个工具条目。

本阶段不直接写入 Supabase，不发布工具，只创建可人工复核的 CSV。

## 2. 推荐路径

当前推荐路径：

候选工具 -> staged CSV -> 人工复核 -> 后台录入 / Feishu 中转 / 后续导入脚本 -> 发布

暂不直接 CSV -> Supabase。

原因：

- 当前 content pipeline 只是中间层骨架；
- 还没有成品 Supabase 批量导入器；
- 批量导入前需要先确认字段、slug、分类、标签、来源和风险边界；
- staged CSV 更适合人工快速审核。

## 3. CSV 字段

首批工具 staged CSV 固定字段如下：

- batch_id
- item_status
- title
- slug
- category
- tags
- short_description
- long_description
- team_tested_label
- tested_summary
- public_review_summary
- official_website
- official_repository
- license
- platform
- pricing
- risk_tags
- suitable_for
- not_suitable_for
- key_features
- use_cases
- caution_notes
- source_urls
- cover_image_prompt
- seo_title
- seo_description
- social_post_x
- social_post_xhs
- editor_notes
- publish_ready

## 4. 字段说明

### batch_id

批次编号。

示例：

- tools-batch-001

### item_status

内容状态。

允许值：

- draft
- source_checked
- copy_ready
- needs_review
- rejected

### title

工具名称。

必须准确，不要乱改品牌名。

### slug

URL slug。

要求：

- 小写；
- 英文；
- 数字；
- 短横线；
- 不允许中文；
- 不允许空格；
- 不允许特殊符号；
- 同批次不能重复。

### category

工具分类。

建议使用：

- AI 工具
- 效率软件
- 开源项目
- 隐私安全
- 设计工具
- 开发工具
- 内容创作
- 文件管理
- 浏览器工具
- 系统工具
- 手机工具
- 视频工具
- 写作工具
- 自动化工具

### tags

竖线分隔。

示例：

AI|Prompt|效率|开源

### short_description

一句话简介。

要求：

- 35 到 80 字；
- 直接说明它解决什么问题；
- 可以有营销感，但不要空泛；
- 不要空话。

### long_description

详情页正文简介。

要求：

- 180 到 350 字；
- 真实写手风；
- 有痛点；
- 有场景；
- 说明适合谁；
- 说明边界；
- 可以写团队亲测，但不能编造具体细节。

### team_tested_label

团队测试标签。

允许值：

- 本人亲测
- 团队亲测
- 站内容测
- 团队筛选
- 来源核验
- 网友反馈摘选

### tested_summary

测试摘要。

规则：

- 如果用户提供具体测试信息，就写具体观察；
- 如果只确认团队测过，就写“团队测试后认为值得收录”；
- 不编造测试天数、设备、数据、bug、对比结论。

### public_review_summary

公开评论摘选。

规则：

- 可以根据公开评论总结；
- 必须标注“公开评论 / 社区反馈 / 网友反馈”；
- 没有搜索到就写“待补充”；
- 不编造评论；
- 不把少量评论写成全网结论。

### official_website

官方网站。

找不到就写：

待核验

### official_repository

官方仓库。

没有就写：

无 / 待核验

### license

许可证。

示例：

- MIT
- AGPL-3.0
- Apache-2.0
- GPL-3.0
- Proprietary
- 待核验

### platform

支持平台。

示例：

- Web
- Windows
- macOS
- Linux
- Android
- iOS
- Chrome Extension
- Docker
- Self-hosted

### pricing

价格类型。

示例：

- 免费
- 免费增值
- 开源免费
- 付费
- 订阅制
- 待核验

### risk_tags

风险标签。

竖线分隔。

示例：

未实测|账号权限|第三方服务|文件访问

### suitable_for

适合人群。

要求：

- 写具体人群；
- 不要写“所有人”。

### not_suitable_for

不适合人群。

要求：

- 必填；
- 这是防止低质推广页的重要字段。

### key_features

核心功能。

竖线分隔。

### use_cases

使用场景。

竖线分隔。

### caution_notes

注意事项。

必须写：

- 权限；
- 数据；
- 账号；
- 文件；
- 价格；
- 许可证；
- 平台；
- 或“无明显高敏权限，但仍建议从低敏场景开始”。

### source_urls

来源链接。

多个链接用竖线分隔。

### cover_image_prompt

封面图提示词。

要求：

- 不使用品牌 Logo 侵权素材；
- 使用抽象场景图；
- 使用暗黑暖黑编辑风；
- 可用于后续生成工具封面图。

### seo_title

SEO 标题。

要求：

- 不堆关键字；
- 直接体现工具名 + 场景。

### seo_description

SEO 描述。

要求：

- 80 到 160 字；
- 包含工具用途、适合人群、风险提示。

### social_post_x

X 平台短文案。

要求：

- 强钩子；
- 适合传播；
- 不编造事实。

### social_post_xhs

小红书文案。

要求：

- 小白能看懂；
- 强痛点；
- 可以稍微焦虑化；
- 不写虚假承诺。

### editor_notes

编辑备注。

用于人工复核，不展示给用户。

### publish_ready

是否准备发布。

允许值：

- yes
- no

默认 no。

## 5. 禁止内容

下面内容不能写进 staged CSV：

- 破解软件；
- 盗版下载；
- 去水印工具；
- 绕过付费工具；
- 灰产引流；
- 换脸滥用；
- 隐私侵害；
- 数据窃取；
- 木马；
- 后门；
- 恶意脚本；
- 来源不明安装包；
- 只有网盘链接、没有官方来源的软件。

## 6. 首批内容生成原则

首批工具内容优先选择：

- AI 提效工具；
- 开源项目；
- 隐私安全工具；
- 文件管理工具；
- 写作工具；
- 浏览器工具；
- 录屏 / 视频工具；
- 开发者工具；
- 小众但有真实场景的工具。

不要只写人人都知道的 ChatGPT、Notion、Figma。

## 7. 下一步

下一步由 ChatGPT 生成：

- 第一批 50 个工具条目；
- 写入 `docs/content/bulk-tools-staged-v1.csv`；
- 每个条目保持 `publish_ready=no`；
- 先人工复核，再决定是否导入或发布。
