# 首批 50 工具 staged CSV 导入 dry-run v1

Status: active

## 1. 当前目标

本步骤只建立 staged CSV 到工具数据库字段的 dry-run 校验。

本步骤不写入 Supabase，不发布工具，不修改前台页面。

## 2. 输入文件

- docs/content/bulk-tools-staged-v1.csv

## 3. 输出文件

- docs/content/bulk-tools-import-dry-run-report-v1.json

## 4. dry-run 检查内容

脚本会检查：

- CSV 表头
- 行数
- 列数
- slug 唯一性
- slug 格式
- item_status 是否为 `copy_ready`
- publish_ready 是否仍为 `no`
- 必填字段是否齐全
- 官方网站是否可访问
- 代码仓库、license、pricing 等待核验字段
- 风险标签
- staged 字段到当前工具字段的候选映射

## 5. 字段映射策略

先输出候选映射，不强行写数据库字段。

可以直接映射的字段优先放入候选表，其余字段写入 `unmapped_staged_fields`。

## 6. 为什么先 dry-run

当前内容仍处于 staged 阶段，还没有正式导入器。

先 dry-run 可以提前发现：

- 字段缺失
- slug 冲突
- 风险标签过高
- 来源链接不完整
- 还需要人工确认的字段

## 7. 下一步

根据 dry-run 报告决定：

- 是否需要补齐 staged CSV
- 是否需要生成后端导入表
- 是否需要继续人工复核后再导入
