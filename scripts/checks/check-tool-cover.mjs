import assert from "node:assert/strict";
import { generateToolCover, getToolInitials } from "../../src/lib/covers/tool-cover.mjs";

const input = { title: "LocalSend", slug: "localsend", category: "效率软件" };
const a = generateToolCover(input);
const b = generateToolCover(input);

assert.equal(a.coverSvg, b.coverSvg, "cover must be deterministic");
assert.equal(a.iconSvg, b.iconSvg, "icon must be deterministic");
assert.ok(a.coverSvg.startsWith("<svg"), "coverSvg is svg");
assert.ok(a.coverSvg.includes('viewBox="0 0 1200 675"'), "cover viewBox 16:9");
assert.ok(a.iconSvg.includes('viewBox="0 0 256 256"'), "icon viewBox 1:1");
assert.ok(a.coverSvg.includes(">LS<"), "initials rendered");
assert.ok(!/\?\?+/.test(a.coverSvg), "no mojibake");

// 分类兜底:未知分类不许抛错
const c = generateToolCover({ title: "X", slug: "x", category: "不存在的分类" });
assert.ok(c.coverSvg.startsWith("<svg"), "unknown category falls back");

// slug 匹配与名称匹配等价
const bySlug = generateToolCover({ title: "T", slug: "t", category: "coding-tools" });
const byName = generateToolCover({ title: "T", slug: "t", category: "编程工具" });
assert.equal(bySlug.coverSvg, byName.coverSvg, "slug and name map to same motif");

assert.equal(getToolInitials("LocalSend"), "LS");
assert.equal(getToolInitials(""), "工");
console.log("CHECK_TOOL_COVER_OK");
