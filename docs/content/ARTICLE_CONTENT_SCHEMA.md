# zhishare 文章内容字段标准 v1 - 真实写手风 GEO 版

## 1. 目标

本字段标准用于首批文章选题整理、人工复核、真实测试计划、GEO 摘要设计和后续内容导入准备。

当前阶段只做选题和模板，不直接发布文章。

## 2. 文章内容原则

zhishare 的文章不能写成百科体，也不能写成工厂体。

每篇文章必须回答：

- 这篇文章帮谁解决问题？
- 读者进来前三行能不能看到结论？
- 有没有明确测试场景？
- 哪些地方还没实测？
- 哪些信息需要人工核验？
- 有没有说明适合谁？
- 有没有说明不适合谁？
- 有没有说明风险？
- 有没有给出最终判断？
- 有没有给 AI 和用户都能快速提取的摘要？

## 3. CSV 字段

字段顺序固定如下：

1. status
2. title
3. slug
4. category
5. tags
6. content_type
7. target_reader
8. search_intent
9. core_question
10. opening_hook
11. early_verdict
12. real_test_status
13. test_plan
14. personal_angle
15. what_to_verify
16. possible_failure_points
17. article_outline
18. related_tools
19. related_articles
20. source_notes
21. risk_notes
22. geo_summary
23. discussion_hook
24. cover_image_prompt
25. editor_notes

## 4. 关键字段说明

### status

允许值：

- draft
- review
- ready
- published
- archived

首批统一使用 draft。

### content_type

允许值：

- 工具教程
- 对比选择
- 风险避坑
- 资源合集
- 问答解释
- 真实体验
- 工具箱搭建

### opening_hook

文章开头钩子。

要求：

- 不要废话
- 不要长铺垫
- 开头三行给出问题或结论
- 可以有危机感，但不能造假

### early_verdict

开头结论。

要求：

- 先给判断
- 不绕弯子
- 如果未实测，必须写“暂不下最终结论”
- 不能假装亲测

### real_test_status

真实测试状态。

允许值：

- 待实测
- 待核验
- 已初测
- 已深度测试
- 已发布复盘

首批统一使用：待实测。

### test_plan

准备怎么测试。

示例：

用真实小白任务测试免费版限制、输出质量、上手难度和隐私边界。

### personal_angle

真实写手角度。

未测试前可以写：

准备从小白第一次使用的角度观察，不提前下推荐结论。

### what_to_verify

需要核验的事实。

必须包含：

- 官网
- 价格
- 免费额度
- 隐私条款
- 商用授权
- 是否仍然可用

### possible_failure_points

可能翻车点。

要求：

- 写预期风险
- 不伪造实际翻车
- 实测后再改成真实踩坑

### article_outline

文章大纲。

要求：

- 结论先行
- 测试场景
- 好用点
- 翻车点
- 适合谁
- 不适合谁
- 替代方案
- 最终判断

### geo_summary

给 AI 和用户都能快速提取的一句话摘要。

要求：

- 简短
- 清楚
- 有判断
- 未实测就说明未实测

### discussion_hook

结尾互动问题。

示例：

你用这个工具时最先卡在哪一步？

## 5. 发布前检查

发布前必须确认：

- 没有假装实测
- 没有编造价格
- 没有编造数据
- 没有编造排名
- 没有编造官方背书
- 有真实测试计划
- 有风险提示
- 有适合谁 / 不适合谁
- 有清楚结论
- 有来源核验记录
