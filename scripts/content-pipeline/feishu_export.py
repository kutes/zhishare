#!/usr/bin/env python3
"""Convert normalized pipeline rows into Feishu Bitable payloads.

This is a dry-run adapter only. It prepares the row payload shape that
can later be sent to Feishu once credentials are connected.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


FEISHU_FIELD_MAP = {
    "title": "标题",
    "link": "链接",
    "github_stars": "GitHub星数",
    "summary": "简介",
    "published_at": "发布时间",
    "keywords": "关键词",
    "source_name": "来源站点",
    "category": "分类",
    "is_open_source": "是否开源",
    "ai_score": "AI分数",
    "ai_verdict": "AI结论",
    "review_status": "审核状态",
    "is_remixed": "是否已二创",
    "notes": "备注",
}


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def build_feishu_record(row: dict[str, Any]) -> dict[str, Any]:
    fields = {
        FEISHU_FIELD_MAP["title"]: row.get("title", ""),
        FEISHU_FIELD_MAP["link"]: row.get("link", ""),
        FEISHU_FIELD_MAP["github_stars"]: row.get("github_stars"),
        FEISHU_FIELD_MAP["summary"]: row.get("summary", ""),
        FEISHU_FIELD_MAP["published_at"]: row.get("published_at", ""),
        FEISHU_FIELD_MAP["keywords"]: row.get("keywords", []),
        FEISHU_FIELD_MAP["source_name"]: row.get("source_name", ""),
        FEISHU_FIELD_MAP["category"]: row.get("category", ""),
        FEISHU_FIELD_MAP["is_open_source"]: row.get("is_open_source", False),
        FEISHU_FIELD_MAP["ai_score"]: row.get("ai_score", 0),
        FEISHU_FIELD_MAP["ai_verdict"]: row.get("ai_verdict", ""),
        FEISHU_FIELD_MAP["review_status"]: row.get("review_status", "pending"),
        FEISHU_FIELD_MAP["is_remixed"]: row.get("is_remixed", False),
        FEISHU_FIELD_MAP["notes"]: row.get("notes", ""),
    }
    return {"fields": fields}


def main() -> int:
    parser = argparse.ArgumentParser(description="Build Feishu Bitable payloads from normalized pipeline JSON.")
    parser.add_argument("--input", type=Path, required=True, help="Normalized JSON from content_pipeline.py")
    parser.add_argument("--output", type=Path, default=None, help="Optional output file for Feishu payload JSON")
    args = parser.parse_args()

    data = load_json(args.input)
    rows = data.get("rows", [])
    payload = {
        "records": [build_feishu_record(row) for row in rows],
        "count": len(rows),
    }
    text = json.dumps(payload, ensure_ascii=False, indent=2)
    if args.output is None:
        print(text)
    else:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(text, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
