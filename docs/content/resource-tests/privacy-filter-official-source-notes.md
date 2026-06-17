# Privacy Filter 官方来源备注 v1

## 1. 当前定位

Privacy Filter 是 ahhhhfs 稀有资源二创候选池里的 P0 资源。

当前阶段只记录官方来源和官方声明，不写最终测试结论。

## 2. 已确认来源候选

### ahhhhfs 线索页

URL:

```text
https://www.ahhhhfs.com/81007/
```

用途：

- 只作为选题线索；
- 不作为最终事实来源；
- 不复制原文；
- 不直接搬标题。

### Privacy Filter 官方网页特版

URL:

```text
https://privacyfilter.app/zh-hans/
```

页面可记录的官方声明：

- 页面标题为在线隐私过滤器；
- 声称可在浏览器中检测姓名、邮箱、电话、地址、账户、日期、URL 与密钥；
- 声称一键生成脱敏文本；
- 声称完全本地运行、零上传；
- 声称首次运行会从 Hugging Face 下载模型文件；
- 声称支持 WebGPU，不可用时回退到 WebAssembly；
- 声称文本不会上传到服务器；
- 声称支持文本和图片 OCR 脱敏。

注意：

这些是官方页面声明，不等于 zhishare 的最终测试结论。

### GitHub 项目主页

URL:

```text
https://github.com/becoolme/privacyfilter.app
```

后续需人工核验：

- README；
- 许可证；
- 最新维护状态；
- issue；
- release；
- 部署方式；
- 是否有隐私说明。

### Hugging Face 模型卡

URL:

```text
https://huggingface.co/openai/privacy-filter
```

可记录的模型信息：

- 模型名为 openai/privacy-filter；
- 任务类型为 token-classification；
- 模型用于 PII detection and masking；
- 模型卡显示许可证为 Apache 2.0；
- 模型卡提示漏检、误伤、高敏场景风险与高风险使用流程需要人工审核。

## 3. 当前不能写死的结论

暂时不能写：

- 我试过；
- 我实测发现；
- 它绝对安全；
- 它完全不会上传；
- 它可以替代人工审核；
- 它可以替代企业级 DLP；
- 它适合处理真实客户资料；
- 它适合处理医疗、法律、金融、人事、教育、政府等高敏数据。

## 4. 下一步真实测试

后续必须补：

- 用虚构客户资料测试 PII 识别；
- 用虚构 API Key 和密码测试 secret 识别；
- 用脱敏后文本测试上下文是否保留；
- 记录漏检和误伤；
- 打开浏览器 Network 面板观察是否有上传请求；
- 记录模型文件下载请求；
- 明确哪些观察是官方声明，哪些是我们实测。
