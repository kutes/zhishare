# 内容数据映射

本文件记录 GEO 内容模块与当前项目字段之间的映射关系。

根据当前项目扫描结果，前台工具数据主要来自 Supabase `tools` 表，读取入口是：

- `src/lib/db/tools.ts`

工具详情页路由：

- `src/app/tools/[slug]/page.tsx`

工具详情页主体组件：

- `src/components/tools/tool-detail-page.tsx`

后台工具表单：

- `src/components/admin/AdminToolForm.tsx`

工具类型定义：

- `src/types/database.ts`
- `src/types/tool.ts`

## 1. 当前工具表字段

当前 `tools` 表已有字段：

| 字段 | 说明 |
|---|---|
| id | 工具 ID |
| title | 工具标题 |
| name | 工具名称 |
| slug | URL slug |
| summary | 简短摘要 |
| description | 工具描述 |
| website_url | 官网链接 |
| download_url | 字段存在，但第一阶段必须留空 |
| cover_url | 封面图 |
| category_id | 分类 ID |
| category | 分类信息 |
| tags | 标签信息 |
| is_free | 是否免费 |
| is_open_source | 是否开源 |
| pricing | 价格信息 |
| free_status | 免费状态 |
| open_source_status | 开源状态 |
| target_users | 目标用户 |
| use_cases | 使用场景 |
| features | 功能 |
| pros | 优点 |
| cons | 缺点 |
| risk_notice | 风险提醒 |
| status | 状态 |
| created_at | 创建时间 |
| updated_at | 更新时间 |

## 2. 当前后台工具表单字段

后台工具表单当前支持：

| 字段 | 是否支持 |
|---|---|
| title | 支持 |
| slug | 支持 |
| summary | 支持 |
| description | 支持 |
| website_url | 支持 |
| download_url | 支持，但第一阶段留空 |
| cover_url | 支持 |
| category_id | 支持 |
| status | 支持 |
| is_free | 支持 |
| is_open_source | 支持 |
| target_users | 支持 |
| use_cases | 支持 |
| pros | 支持 |
| cons | 支持 |
| risk_notice | 支持 |
| tags | 暂不支持后台编辑 |
| content / body / long_description | 暂不支持 |

## 3. GEO 模块映射表

| GEO 内容模块 | 当前是否有字段承接? | 可能对应字段 | 是否需要改 UI | 是否需要改数据库? | 第一阶段处理方式 |
|---|---|---|---|---|---|
| 一句话结论 | 是 | summary / tagline | 否 | 否 | 直接写入 summary |
| 我试过什么 | 否 | 无专用字段 | 是 | 暂不做 | 先放文章内容，不进工具字段 |
| 它真正解决什么问题 | 是 | description / summary | 否 | 否 | 写入 description |
| 哪里容易坑小白 | 是 | risk_notice | 否 | 否 | 写入 risk_notice |
| 适合谁 | 是 | target_users | 否 | 否 | 写入 target_users |
| 不适合谁 | 部分 | cons | 是 | 暂不做 | 暂时写入 cons |
| 怎么选 | 部分 | pros / cons / risk_notice | 是 | 暂不做 | 暂时放入文章或 risk_notice |
| 新手步骤 | 部分 | use_cases | 是 | 暂不做 | 暂时不强行写入工具页 |
| FAQ | 否 | 无 | 是 | 暂不做 | 先放文章系统 |
| 风险提醒 | 是 | risk_notice | 否 | 否 | 直接写入 risk_notice |
| 最后建议 | 部分 | risk_notice / cons | 是 | 暂不做 | 暂时放文末 |

## 4. 第一阶段策略

第一阶段不扩数据库。

原因：

1. 当前工具表已经能承接基础 GEO 内容。
2. 后台表单已经支持多个可用字段。
3. 工具详情页已经能展示适合人群、使用场景、优点、缺点、风险提醒。
4. `download_url` 虽然存在，但第一阶段不承接真实下载地址，只保留官网入口。
5. 盲目新增字段会增加后台、类型、查询、前台渲染的联动成本。
6. 当前文章系统已经存在，可以承接长内容、FAQ、新手步骤、最后建议。

## 5. 工具页第一阶段字段写作标准

| 字段 | 写作目标 |
|---|---|
| summary | 一句话结论 |
| description | 工具是什么 + 真正解决的问题 |
| target_users | 适合谁 |
| use_cases | 使用场景 |
| pros | 优点 |
| cons | 缺点 / 不适合谁 |
| risk_notice | 坑点 / 风险提醒 |
| website_url | 官网 |
| download_url | 第一阶段留空，不填写真实下载链接 |

## 6. 暂不建议修改的内容

暂时不建议做：

- 给 `tools` 表新增 content 字段
- 给 `tools` 表新增 FAQ 字段
- 给 `tools` 表新增 step 字段
- 给 `tools` 表新增 final_advice 字段
- 工具详情页接入 Markdown
- 后台工具表单接入富文本编辑器
- 后台工具表单接入标签绑定 UI
- 文章系统改成 MDX
- 评论、点赞、转发、随机数据生成

这些功能可以后续规划，但不放在第一阶段。

## 7. download_url 当前规则

当前项目已有 `download_url` 字段，也已有后台表单输入位。

但第一阶段内容规则统一为：

1. `download_url` 保持为空。
2. 不写网盘链接。
3. 不写第三方下载站或镜像站。
4. 不写安装包直链。
5. 如果工具确实存在下载方式，当前阶段只保留 `website_url` 指向官网或官方入口页。
