# DropLock 第一次真实观察记录 - 2026-06-17

## 1. 测试边界

- 本次只使用虚构 secret。
- 本次不是企业级密钥管理评估。
- 本次不代表生产密钥安全结论。
- 本次只记录一次浏览器观察结果。
- 本次结论不应过早定性。

## 2. 测试页面

- DropLock 官方页面

## 3. 虚构样本

```text
DEMO_OPENAI_KEY=sk-test-droplock-demo-1234567890
DEMO_DB_PASSWORD=Demo_DB_Password_2026!
DEMO_INVITE_CODE=ZHISHARE-DEMO-2026
```

## 4. 页面可用性观察

记录：

- 页面是否打开：是
- 是否不需要账号：是
- 是否能看到 open lock box 链接：是
- 是否能输入 secret：是
- 是否能生成 locked link：是
- 接收方是否能打开：是
- 是否有明显报错：否

## 5. 流程观察

分别记录：

- 创建 lock box：页面先给出 open lock box 链接。
- 打开 lock box：页面切到 Share a secret。
- 输入虚构 secret：可正常输入。
- 生成 `#m=` secret link：是。
- 接收方是否能读取 secret：可回到 Receive a secret 页面。

## 6. 过期 / 一次性 / 删除观察

记录：

- 是否观察到过期设置：本轮未观察到。
- 是否观察到一次性打开设置：本轮未观察到。
- 是否观察到撤回或删除设置：本轮未观察到。

## 7. 网络请求观察

记录：

- 是否有 POST / PUT / PATCH 携带 secret：否。
- 是否只有静态资源请求：是。
- 是否生成 URL fragment：是。
- 为什么这还不能直接下完整结论：本轮只做了有限观察。

## 8. 安全边界观察

记录：

- 官方页面 / README 的加密说明：已看到。
- 官方 warning：已看到。
- 未经专家审计的提醒：已看到。
- link 被替换的 tradeoff：存在。
- 为什么不能替代企业级 secret management：仍需人工复核。

## 9. 初步判断

只能写：

- 可继续测试。
- 适合做临时 secret 分享流程观察。
- 不应直接替代企业级密钥管理。
- 不应把虚构样本当成生产密钥。
- 仍需要人工复核加密实现和使用边界。

## 10. 下一步

- 手动复测。
- 验证不同浏览器 profile。
- 验证刷新和历史记录行为。
- 验证 lock box 是否还能打开。
- 查看 FORMAT.md。
- 核验 LICENSE。
- 核验是否有 issue 反馈。
- 对比 Bitwarden Send、OneTimeSecret 等替代方案。
