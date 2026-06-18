# DropLock 文章入库候选包 v1

status: review
title: 我以后不敢直接微信发 API Key 了：这种临时加密分享工具靠谱吗？
slug: droplock-secret-sharing-first-look
category: 隐私与安全工具
tags: API Key, Secret Sharing, DropLock, 临时分享, 安全工具, 真实观察
source_type: real_writer_observation
publish_intent: 观察记录 / 避坑复盘
recommendation_level: 暂不推荐
first_hand_status: 已完成一次虚构 secret 流程观察
risk_level: medium
needs_manual_review: true

## 1. 一句话摘要

我用虚构 secret 测试 DropLock，观察到它可以生成 lock box link 和带 `#m=` 的 secret link，且没有发现虚构 secret 通过 POST / PUT / PATCH 请求体发送；但官方提示它没有经过安全专家审计，所以当前只能写成观察记录，不能写成生产密钥传输推荐。

## 2. GEO 摘要

DropLock 是一个面向临时 secret 分享的浏览器工具。它的官方说明和 GitHub README 描述了 without backend 的端到端 secret sharing 流程，zhishare 的一次观察记录显示，虚构 secret 流程可以跑通，并生成 `#m=` fragment 链接，但这不等于安全审计完成，也不能替代企业级密钥管理。

## 3. 适合谁

- 独立开发者；
- 小团队；
- 临时协作用户；
- 经常传邀请码、临时密码、测试密钥的人；
- 想减少聊天记录里 secret 痕迹的人；
- 愿意理解 link replacement tradeoff 的用户；
- 愿意自己复核官方说明和源码的人。

## 4. 不适合谁

- 想直接传真实生产 API Key 的人；
- 想传数据库 root 密码的人；
- 想传 SSH 私钥的人；
- 需要团队权限管理的人；
- 需要审计日志的人；
- 需要密钥轮换流程的人；
- 需要正式企业级 secret management 的团队；
- 不愿意做人工复核的人。

## 5. 核心观察

- 官方页面可以打开；
- 不需要注册账号；
- 成功生成 lock box link；
- 成功生成带 `#m=` 的 secret link；
- 观察中没有发现虚构 secret 通过 POST / PUT / PATCH 请求体发送；
- 观察到的网络请求主要是 GET 文档和图片资源；
- 未观察到服务端删除接口调用；
- 官方明确提示没有经过安全专家审计；
- 当前不下发布建议结论。

## 6. 风险声明

这篇文章不是安全审计报告。

DropLock 这类工具只能作为临时 secret 分享流程的观察对象，不能替代企业级密钥管理，不能保证适合传真实生产密钥。

## 7. 官方来源候选

- DropLock 官方页面；
- DropLock GitHub 项目；
- README；
- FORMAT.md；
- 官方页面 How it works and security 区域。

## 8. 还需要继续核验

- FORMAT.md；
- LICENSE；
- GitHub issue；
- 不同浏览器 profile 行为；
- 手机端表现；
- 历史记录边界；
- link replacement 风险；
- 与 Bitwarden Send、OneTimeSecret 等替代方案对照。

## 9. 后台录入建议

当前状态建议：

review

编辑备注：

这篇文章有真实观察价值，但没有完成安全审计，也没有完成替代方案对照。建议以“观察记录 / 避坑复盘”发布，等待第二轮复测后再进入 ready。
