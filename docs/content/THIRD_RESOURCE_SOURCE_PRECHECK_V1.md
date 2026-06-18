# 第三个 P0 资源来源预检 v1

## 目标

- 为第三个 P0 资源候选做来源预检。
- 只确认官方主页、官方仓库、许可与隐私或权限边界。
- 不做真实抓取导入，不写完整文章，不改任何前台或后台代码。

## 预检结论

| 资源 | source_status | 官方主页 | 官方仓库 | license_status | privacy_or_permission_status | selection_rank |
| --- | --- | --- | --- | --- | --- | --- |
| OpenLess | source_confirmed | https://openless.top/ | https://github.com/Open-Less/openless | MIT | 已确认本地优先；麦克风与辅助功能权限用于输入 | P0_candidate |
| PlainApp | source_confirmed | https://plainapp.app/ | https://github.com/plainhub/plain-app | AGPL-3.0 | 已确认无账号；无云；同网段本地访问；权限边界待人工继续核验 | P1_candidate |
| Recordly | source_partial | https://recordly.dev/ | https://github.com/webadderallorg/recordly | AGPL-3.0 | 待人工继续核验 | hold |

## 候选分析

### OpenLess

- 官方主页与官方仓库都能确认。
- 仓库明确标注 MIT license。
- 官方页面和仓库都强调本地优先与本地凭证存储。
- 麦克风与辅助功能权限说明清楚。
- 适合进入下一轮测试，且是本次最稳的第三个 P0 候选。

### PlainApp

- 官方主页与官方仓库都能确认。
- 官方主页明确写到 no signup、100% private、same network、本地优先。
- 仓库显示 AGPL-3.0 license。
- 适合做稳定的备选资源，但它更偏 Android 设备管理，不是本轮最强的第三个 P0。

### Recordly

- 官方主页与官方仓库都能确认。
- 官方主页和仓库都能确认它是开源录屏工具。
- 许可信息可确认，但本轮没有把隐私或权限边界核全。
- 先保留为 hold，后续需要人工继续核验。

## 推荐

- 最佳第三个 P0 资源：OpenLess
- 备选：PlainApp
- 暂缓：Recordly

## 风险说明

- 这次只做来源预检，不代表已经完成真实测试。
- 任何没有被官方主页、官方仓库或官方说明确认的部分，都必须保留为待人工继续核验。
