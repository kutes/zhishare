# 首批 10 工具 Supabase 导入映射 dry-run v1

Status: active

## 1. 当前目标

本步骤只做 ready-to-publish CSV 到当前工具字段的导入映射 dry-run。
本步骤不写入 Supabase，不发布工具，不修改前台页面。

## 2. 输入文件

- `docs/content/bulk-tools-first-10-ready-to-publish-v1.csv`
- `docs/content/bulk-tools-first-10-publish-risk-notes-v1.csv`

## 3. 输出文件

- `docs/content/first-10-tools-supabase-import-dry-run-report-v1.json`

## 4. 检查内容

脚本会检查：

- ready CSV 行数
- `item_status`
- `publish_ready`
- `slug` 唯一性
- `slug` 格式
- 当前项目工具字段
- 后台表单字段
- staged 字段到当前字段的候选映射
- 无法直接写入的字段
- 可能需要压缩进 `description` / `metadata` / `notes` 的字段
- insert payload preview

## 5. 为什么仍然只是 dry-run

当前 ready 包仍然包含较多内容运营字段，和真实数据库可直接写入字段不是一一对应关系。
因此先做 dry-run，先把下面几件事理清：

- 哪些字段能直接落到当前工具表
- 哪些字段适合压缩到 `description` 或备注
- 哪些字段目前还需要人工确认

## 6. 当前不允许做的事

- 直接写入 Supabase
- 直接发布工具
- 修改 ready CSV
- 修改 staged CSV
- 修改候选 CSV
- 编造字段映射
- 编造许可证、价格、实测或评论内容

## 7. 下一步建议

- 先看 dry-run 报告里的 `needs_manual_mapping`
- 再决定是否需要补字段、压缩字段，或者拆成人工备注
- 如果映射稳定，再考虑小批量导入
