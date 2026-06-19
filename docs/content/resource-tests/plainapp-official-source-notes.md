# PlainApp 官方来源与边界说明 v1

## 1. 当前定位

PlainApp 是第三资源预检中的 P1 候选。

当前阶段只做来源补强和权限边界整理，不做真实测试，不写完整文章。

## 2. 已确认来源

### 官方官网

URL:

```text
https://plainapp.app/
```

可记录的官方声明：

- PlainApp 是 Phone Web Portal。
- 可以通过同一网络的浏览器管理 Android 手机。
- 官方页面写到 no signup、no cloud、no ads。
- 可以管理文件、照片、视频、音乐、短信、通话记录、Markdown notes、屏幕镜像、RSS 等。
- 使用方式是安装 app、点击 Start、在同一 Wi-Fi 浏览器访问手机端显示的 URL。
- 官方写到可从 Google Play、F-Droid、GitHub 下载。
- 官方页面写到 open source、local、encrypted、ad-free。
- 官方底部显示 AGPL 3.0。

注意：

这些是官方声明，不是 zhishare 的实测结论。

### GitHub 仓库

URL:

```text
https://github.com/plainhub/plain-app
```

可记录的官方声明：

- README 称 PlainApp 是开源 Android app。
- 它把手机变成 self-hosted management hub。
- 可以从同一网络浏览器访问。
- README 写到 no accounts、no cloud、no subscriptions。
- README 写到 100% local。
- README 写到 phone 与 browser 之间的流量被加密。
- README 写到 TLS + XChaCha20-Poly1305。
- README 页面显示 AGPL-3.0 license。

注意：

这些仍然是官方声明，不是安全审计结论。

## 3. 需要重点核验的风险边界

PlainApp 不是普通效率工具。

它可能涉及：

- 文件管理
- 内部存储
- SD 卡
- USB drives
- 照片
- 视频
- 音乐
- 联系人
- SMS
- 通话记录
- 通知
- 屏幕镜像
- 远程控制
- 设备信息
- 局域网浏览器访问
- HTTPS / 证书
- Android 权限
- 分发渠道版本差异

这些都必须在真实测试前拆清楚。

## 4. 当前不能写的结论

暂时不能写：

- 我试过
- 我实测发现
- 它绝对安全
- 它完全本地所以没有风险
- 它不会泄露手机数据
- 它适合管理主力手机
- 它适合打开真实短信、照片、联系人
- 它适合在公共 Wi-Fi 使用
- 它可以替代所有手机管理工具
- 它一定比 AirDroid / KDE Connect 更安全

## 5. 后续真实测试条件

只有满足以下条件才允许进入真测：

- 用户明确同意
- 使用备用 Android 设备或低敏环境
- 不使用主力手机
- 不打开真实照片、短信、联系人、通话记录
- 不连接公共 Wi-Fi
- 只在可信局域网测试
- 记录 app 请求的 Android 权限
- 记录浏览器访问 URL、端口和证书行为
- 记录是否出现外部网络请求
- 记录是否能限制访问范围
- 记录停止服务后浏览器是否还能访问
- 记录小白是否能理解风险

## 6. 文章必须保留的边界

最终文章必须写清：

- no cloud 不等于没有风险
- 同网段访问不等于只有你能访问
- 手机文件、短信、照片、通话记录都属于高敏内容
- 开源不等于自动安全
- 官方加密声明不等于安全审计
- 真实测试必须使用低敏设备
- 主力手机不建议直接测
