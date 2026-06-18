# OpenLess 官方来源备注 v1

## 1. 当前定位

OpenLess 是第三个 P0 资源候选。

当前阶段只记录官方来源和官方说明，不写最终观察结论。

文章方向：

我懒得打字给 AI，下意识说一堆废话，它能不能整理成靠谱 Prompt？

## 2. 已确认来源

### 官方官网

```text
https://openless.top/
```

可记录的官方声明：

- OpenLess 是开源、本地优先的语音输入工具。
- 按下热键、说话，在光标处获得打磨干净的提示词。
- 兼容 ChatGPT、Claude、Cursor、Gemini、Notion、Slack、Lark、WeChat、Mail、VS Code、Figma、Linear、Obsidian、Raycast 等有光标的输入框。
- 官网声明音频、转写、词典、历史都存在本地。
- Keychain 存凭证，`~/.openless` 存配置。
- 官网提到 BYO 凭证。
- 官网提到火山引擎流式 ASR + Ark / DeepSeek 兼容的 chat-completions。
- 官网明确要求麦克风和辅助功能权限。
- 授权辅助功能后可能需要重启 OpenLess。
- 当前 macOS 版本是 ad-hoc 签名，首次启动可能需要解除 quarantine。
- 官网写明 MIT 协议。

注意：

这里记录的是官方声明，不是 zhishare 的最终实测结论。

### GitHub 仓库

```text
https://github.com/Open-Less/openless
```

可记录的官方声明：

- README 称其为 macOS / Windows 开源语音输入工具。
- 按住热键说话，AI 润色文本会流式插入当前光标。
- 如果插入被阻止，会复制到剪贴板。
- README 把 OpenLess 定位成商业语音输入工具的开源替代。
- README 强调 AI Prompt 场景：把松散口述整理成带上下文、约束和请求的 Prompt。
- README 写到 style pack marketplace。
- README 写到每次听写都是独立 cleanup request，不积累对话上下文。

### USAGE.md

```text
https://github.com/Open-Less/openless/blob/main/USAGE.md
```

可记录的官方声明：

- 需要继续核验热键。
- 需要继续核验样式包。
- 需要继续核验插入行为。
- 需要继续核验剪贴板回退。
- 需要继续核验配置方式。

### 技术架构

```text
https://github.com/Open-Less/openless/tree/main/docs
```

可记录的官方声明：

- 音频采集。
- ASR。
- LLM cleanup。
- 插入方式。
- 权限调用。
- 本地存储。
- 供应商配置。
- marketplace 后端边界。

### 许可证

```text
https://github.com/Open-Less/openless/blob/main/LICENSE
```

来源预检记录为 MIT。

## 3. 当前不能写成最终结论的内容

暂时不能写成已经验证完成的表述。

例如，不能直接下这些结论：

- 已经真实跑过测试
- 已经实机验证成功
- 已经确认是纯本地断网运行
- 已经确认不会访问任何外部服务
- 已经确认适合处理真实客户资料
- 已经确认可以替代人工思考
- 已经确认可以替代 Prompt 能力
- 已经确认能稳定插入所有输入框
- 已经确认在 ChatGPT、Claude、Cursor、微信、飞书中都稳定可用

## 4. 下一步真实测试前必须再次确认的边界

进入真实测试前必须确认：

- 使用虚构口述样本。
- 不使用真实客户资料。
- 不使用真实公司文档。
- 不使用真实会议录音。
- 不使用真实 API Key。
- 记录麦克风权限。
- 记录辅助功能权限。
- 记录是否出现外部 ASR / LLM 请求。
- 记录输出是否进入当前光标。
- 记录插入失败时是否复制到剪贴板。
- 记录小白安装和权限步骤是否卡壳。

## 5. 发布前保留的写法

最终文章在真实测试前只能保留：

- OpenLess 是本地优先，但不能直接写成全程离网。
- 如果使用外部 ASR / LLM 提供商，音频或文本可能离开本机。
- 麦克风和辅助功能权限需要谨慎理解。
- 它只会整理你的表达，不能替你思考。
- 它不适合处理敏感会议、客户资料、公司内部材料。
- 真正使用前要先用低敏样本测试。
