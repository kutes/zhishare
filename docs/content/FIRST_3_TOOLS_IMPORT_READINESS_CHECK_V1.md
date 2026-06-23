# 首批 3 条工具真实时导入前只读预检 v1

Status: active

## 1. 当前目标

本步骤只做首批 3 条工具真时导入前的 Supabase 只读预检。

本步骤不写数据库，不执行 insert，不发布工具。

## 2. 预检对象

- `localsend`
- `stirling-pdf`
- `cyberchef`

## 3. 只读检查内容

脚本会检查：

- Supabase URL 是否存在
- service key 或 anon key 是否存在
- tools 表名是否能从现有源码确认
- 3 个 slug 是否已经存在
- 是否存在导入 blocker

## 4. 安全边界

本步骤只允许 `select` 查询。

本步骤禁止：

- insert
- update
- upsert
- delete
- 读取 `.env.local`
- 打印完整密钥
- 修改 CSV
- 发布工具

## 5. 下一步建议

- 如果 blockers 为空，且 selected slugs 都不存在，则可进入 execute review。
- 如果存在 blocker，先修复 blocker，再考虑后续执行步骤。
