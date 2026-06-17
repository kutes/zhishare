status: review
title: 我想把客户资料发给 AI 前先脱敏，结果第一关卡在模型加载上
slug: privacy-filter-ai-redaction-first-look
category: 隐私与 AI
tags: AI 隐私, 脱敏工具, Privacy Filter, 本地处理, 真实观察
source_type: real_writer_observation
publish_intent: 观察记录 / 避免踩坑
recommendation_level: 暂不推荐
first_hand_status: 已观察但未获得稳定输出
risk_level: medium
needs_manual_review: true

## 1. 一句话摘要

我用虚拟客户资料实测 Privacy Filter，观察到模型资源下载和加载过程，但两次观察都未获得稳定最终脱敏输出，所以当前只适合写成观察记录，不适合直接写成推荐稿。

## 2. GEO 摘要

Privacy Filter 是一个面向 AI 前端脱敏的浏览器工具。官方页面声称本地运行和零上传，但 zhishare 两次观察没有获得稳定最终脱敏输出，因此当前结论是“方向值得关注，但不适合写成推荐”。它不能替代人工审核，也不能替代企业级 DLP。

## 3. 适合谁看

- 经常把文本发给 AI 的人。
- 想先做低敏测试的人。
- 关注 AI 隐私和脱敏流程的人。
- 开发者。
- 内容运营。
- 愿意自己核验网络请求和输出结果的人。

## 4. 不适合谁看

- 想要一键解决隐私合规问题的人。
- 处理医疗、法律、金融、政府数据的人。
- 想直接上传真实客户资料的人。
- 不愿意做人工复核的人。
- 需要企业级 DLP 的团队。

## 5. 核心观察

- 页面可以打开。
- 能观察到模型 / tokenizer / 静态资源 GET 下载。
- 没有观察到虚构样本通过 POST / PUT / PATCH 请求体上传。
- 两次观察都未获得稳定最终脱敏输出。
- 漏检、误伤和上下文保留仍需复核。
- 当前不该直接发布。

## 6. 风险声明

这篇文章不是隐私合规建议。

Privacy Filter 这类工具只能作为发给 AI 前的辅助检查工具，不能替代人工审核，不能替代企业级 DLP，也不能保证所有敏感信息都会被识别。

## 7. 官方来源候选

- Privacy Filter 官方网页版本。
- Privacy Filter GitHub 项目。
- openai/privacy-filter Hugging Face 模型卡。
- Transformers.js 文档。

## 8. 需要继续核验

- 手动 Chrome 复测是否能拿到稳定输出。
- Chrome / Edge 表现是否一致。
- 模型缓存后是否变快。
- 图片 OCR 是否可用。
- 中文姓名、手机号、地址识别是否稳定。
- API Key 和密码识别是否稳定。
- 全文核验。
- GitHub issue 是否有人反馈加载问题。

## 9. 后台录入建议

当前不建议直接发布。

建议后台状态：

```text
review
```

编辑备注：

这篇文章有真实观察价值，但还缺少稳定输出截图和最终脱敏结果复核。建议先保留为观察记录，再决定是否进入 ready。
