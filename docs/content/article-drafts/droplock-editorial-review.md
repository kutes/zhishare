# DropLock 文稿发布前编辑复核 v1

Status: review

Article draft:

- docs/content/article-drafts/droplock-secret-sharing-first-look.md

Social draft:

- docs/content/article-drafts/droplock-social-posts-v1.md

## 1. 当前文章判断

这篇文章当前可以进入人工复核，但不能直接发布为安全推荐文。

原因如下：

- 当前只完成了一次浏览器流程观察；
- 只使用了虚构 secret；
- 没有做代码审计；
- 没有做密钥实现审计；
- 没有验证所有浏览器和移动端场景；
- 没有验证历史记录、复制转发、链接替换等边界风险；
- 官方页面明确提醒没有经过安全专家审计；
- 不能把“未观察到明文 POST / PUT / PATCH”写成“不会泄露”；
- 不能把 `#m=` fragment 流程写成生产密钥安全保证。

## 2. 可以保留的文稿方向

可以保留：

- 直接把 API Key、密码、邀请码发到聊天框里是现实风险；
- DropLock 这个方向值得继续关注；
- 官方页面和 README 描述了 without backend 的端到端 secret sharing 流程；
- 观察中生成了 lock box link；
- 观察中生成了带 `#m=` 的 secret link；
- 观察中没有发现虚构 secret 通过 POST / PUT / PATCH 请求体发送；
- 文章明确只使用虚构 secret；
- 文章明确官方提示没有经过安全专家审计；
- 文章明确不能替代企业级密钥管理；
- 文章强调“secret 不是普通文本”。

## 3. 必须避免的表达

禁止把这篇文章包装成：

- 已经完成充分安全审计的工具推荐；
- 保证安全的一键 secret 分享方案；
- 可以放心传真实生产密钥的方案；
- 可以替代 1Password、Bitwarden、Vault 或云厂商 Secret Manager 的方案；
- 可以替代企业权限、审计、轮换流程的方案；
- 不需要读者继续核验的结论文。

## 4. 发布前还需要补齐

建议在发布前补齐：

- 更多浏览器复测；
- 不同浏览器 profile 行为；
- 手机端行为；
- 长文本和特殊字符；
- 历史记录、复制、转发边界；
- 链接替换风险；
- FORMAT.md 与 LICENSE 核对；
- GitHub issue 与 README 信息核对；
- 竞品替代方案对照。

## 5. 当前状态建议

建议状态：

review

原因：

这篇文稿已经有真实观察价值，但还缺少更完整的复核与边界确认，因此适合先进入 review，而不是直接进入 published。
