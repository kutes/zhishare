# 首批 3 条工具小批量导入脚本 v1

Status: active

## 1. 当前目标

本步骤只创建首批 3 条工具的小批量导入脚本。
默认只做 dry-run，不执行真实导入。

## 2. 输入文件

- `docs/content/first-3-tools-ready-to-import-v1.csv`

## 3. 输出文件

- `docs/content/first-3-tools-import-dry-run-report-v1.json`

## 4. 首批 3 条

本次选择：

- `cyberchef`
- `stirling-pdf`
- `localsend`

## 5. 安全阀

脚本默认不写数据库。

只有显式传入 `--execute` 时，才允许进入真实导入分支。

本步骤不允许运行 `--execute`。

## 6. 当前不直接导入的原因

虽然首批 10 条的 dry-run 已经通过，但首批 3 条仍然需要保持守护模式：

- 先确认 CSV 结构完全稳定
- 先确认 dry-run 报告稳定
- 先确认没有真实密钥暴露
- 先确认没有误写入

## 7. 下一步建议

- 先跑 dry-run
- 如果 report 里没有 blocker，再考虑后续的真实导入执行步骤
