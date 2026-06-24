# 首批 3 条工具 execute 前审批包 v1

Status: pending_manual_approval

## 1. 当前状态

首批 3 条工具已经完成：

- dry-run 导入脚本；
- dry-run payload 检查；
- Supabase 只读 readiness 检查；
- slug 冲突检查。

用户手动在临时环境变量中设置了 Supabase URL / anon key，并已经完成只读 readiness 复跑。

只读 readiness 结果：

```text
FIRST_3_TOOLS_IMPORT_READINESS_CHECK_OK
ROW_COUNT: 3
SELECT_ONLY: true
EXISTING_SLUG_COUNT: 0
BLOCKERS_COUNT: 0
READY_FOR_EXECUTE_REVIEW: true
```

说明：

- 该结果来自用户本地临时环境运行；
- 不包含任何 key；
- 没有写入数据库。

## 2. 首批 3 条工具

本次准备进入真实导入审批的工具：

- localsend
- stirling-pdf
- cyberchef

## 3. 当前仍未执行的动作

当前仍未执行：

- 运行 `--execute`；
- 写入 Supabase；
- 发布工具；
- 修改前台页面；
- 修改后台页面；
- 修改数据库 schema；
- 修改原始 CSV；
- 提交任何密钥。

## 4. execute 前必须人工确认

真实导入前必须确认：

- 当前工作区干净；
- 当前分支正确；
- `docs/content/first-3-tools-ready-to-import-v1.csv` 仍只有 3 行；
- 3 个 slug 仍为 `localsend` / `stirling-pdf` / `cyberchef`；
- 只读 readiness 仍是 `BLOCKERS_COUNT=0`；
- `EXISTING_SLUG_COUNT=0`；
- `READY_FOR_EXECUTE_REVIEW=true`；
- 没有运行过 `--execute`；
- 没有把 Supabase key 写入文件；
- 没有把 Supabase key 提交到 git；
- 用户明确同意执行真实导入。

## 5. 真正导入边界

真实导入只能由下一步单独执行，且必须显式使用：

```powershell
npm run content:first-3-tools-import:dry-run -- --execute
```

如果项目脚本不支持这种参数透传，则必须改用直接 node 命令，并在命令里显式带上 `--execute`。

本步骤不允许运行以上命令。

## 6. 真实导入后必须检查

真实导入后必须立即检查：

- Supabase 是否返回成功；
- 插入数量是否为 3；
- 是否有重复 slug 错误；
- 是否有 RLS 权限错误；
- `git status --short` 是否干净；
- `/tools` 是否显示新增加的工具；
- `/tools/localsend` 是否 200；
- `/tools/stirling-pdf` 是否 200；
- `/tools/cyberchef` 是否 200；
- sitemap 是否正常；
- build 是否仍通过。

## 7. 回滚原则

如果真实导入后出现问题：

- 不要继续导入更多工具；
- 先记录错误；
- 如果已经插入了部分数据，优先通过后端删除这 3 条；
- 如果后端无法删除，再单独制定 Supabase 删除步骤；
- 不允许随手写 delete 脚本；
- 所有回滚都必须单独审批。

## 8. 当前结论

当前可以进入下一步：

- 第八十二步：首批 3 条工具真实 execute 导入。

但必须由用户明确确认后才能执行。
