# Feishu Bitable Schema

This schema maps the normalized content pipeline rows into a Feishu Bitable table.

## Table name

- `content_items`

## Fields

- `标题` - single line text
- `链接` - URL
- `GitHub星数` - number
- `简介` - long text
- `发布时间` - text or datetime
- `关键词` - multi-select or long text
- `来源站点` - single line text
- `分类` - single line text
- `是否开源` - checkbox
- `AI分数` - number
- `AI结论` - single select
- `审核状态` - single select
- `是否已二创` - checkbox
- `备注` - long text

## Suggested values

- `审核状态`: `pending`, `approved`, `rejected`
- `AI结论`: `优先二创`, `待人工复核`, `先留档`
- `是否已二创`: `false` on ingest, set to `true` only after editorial rewrite

## Notes

- Keep the table focused on public, factual, and editable content.
- Store only source facts in the table.
- Never auto-publish from the table without manual review.
