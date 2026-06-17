# DropLock 官方来源说明 v1

## 1. 当前定位

DropLock 是 ahhhhfs 资源线索里的 P0 候选资源。

这一轮只做官方来源发现和源表预填，不写最终结论，也不进入真实测试。

## 2. 已找到的官方来源

- 官方首页：<https://droplock.apitman.com/>
- 官方仓库：<https://github.com/anderspitman/DropLock/>

## 3. 可直接确认的官方信息

- 官方首页明确写了 DropLock 是 `Simple safe secret sharing`。
- 官方首页说明浏览器会创建公私钥对。
- 官方首页说明私钥保存在当前浏览器中，且是 non-extractable。
- 官方首页说明链接中的片段内容不会发送到 web server。
- 官方首页明确提示没有经过 security expert review。
- 官方仓库 README 说明它是 `End-to-end encrypted secret sharing without a backend`。
- 官方仓库 README 说明接收方生成带公钥的请求链接，发送方加密后得到回链，再由接收方打开读取。

## 4. 还需要人工复核的部分

- 是否有清晰的许可证说明
- 是否有完整的过期或一次性打开规则说明
- 是否有完整隐私政策或数据处理说明
- 是否有完整使用条款或责任边界说明
- 是否存在更完整的网络行为说明
- 是否存在可直接列入对比的替代方案官方来源

## 5. 当前处理建议

- 已确认的官方来源，先在 checklist 里标记为 checked
- 暂时缺失的项目，标记为 source_unverified
- 所有条目都保留 needs_review，后续再补人工核验
- 不要把“新建 key 后旧消息失效”直接写成完整的过期机制结论
- 不要在这一阶段写结论性建议
- 不要进入真实 secret 测试
