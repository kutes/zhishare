# zhishare 工具内容字段标准 v1 - 真实写手风 GEO 版

## 1. 目标

本字段标准用于首批工具内容整理、人工复核、CSV 导入准备和后续飞书多维表格同步。

当前阶段只做草稿，不直接发布。

## 2. 核心原则

- 不编造价格
- 不编造评分
- 不编造用户数
- 不编造官方背书
- 不写“全网最强”
- 不写“永久免费”
- 不写“绝对安全”
- 不把广告伪装成评测
- 不提供侵权下载入口
- 不直接搬运官网原文
- 没有真实测试就不写“我试过”
- 没有踩坑经历就不写“我踩坑”
- 每条工具都必须说明适合谁、不适合谁、风险点
- 每条工具都要预留真实体验字段

## 3. CSV 字段

字段顺序固定如下：

1. status
2. name
3. slug
4. category
5. tags
6. short_description
7. long_description
8. use_cases
9. target_users
10. not_for
11. pricing
12. difficulty
13. official_url
14. alternatives
15. pros
16. cons
17. privacy_notes
18. copyright_notes
19. source_notes
20. first_hand_status
21. test_scenario
22. what_worked
23. what_failed
24. final_verdict
25. trust_level
26. geo_summary
27. discussion_hook
28. cover_image_prompt
29. editor_notes

## 4. 新增真实写手字段说明

### first_hand_status

真实使用状态。

允许值：

- 待实测
- 已初测
- 已深度使用
- 已放弃
- 不适合本站

首批统一使用：待实测。

### test_scenario

测试场景。

未测试前写：

待补充真实测试场景。

### what_worked

实际好用的地方。

未测试前写：

待实测后补充。

### what_failed

翻车点或劝退点。

未测试前写：

待实测后补充。

### final_verdict

最终判断。

未测试前写：

暂不下最终推荐结论。

### trust_level

当前可信度。

允许值：

- 草稿
- 待核验
- 已核验基础信息
- 已实测
- 可推荐

首批统一使用：草稿。

### geo_summary

给人和 AI 都能快速提取的短结论。

要求：

- 一句话
- 结论先行
- 不夸大
- 未测试就明确说明

示例：

这是一个待实测的 AI 写作工具条目，当前只完成基础信息整理，暂不做最终推荐。

### discussion_hook

结尾互动问题。

示例：

你用过这个工具吗？最劝退你的地方是什么？

## 5. 发布前检查

发布前必须确认：

- 官网链接有效
- 价格没有编造
- 功能没有编造
- 真实体验字段已补充
- 风险点已写
- 分类和标签合理
- 不含侵权资源
- 没有明显标题党
- 没有伪装广告
- 没有假装实测
