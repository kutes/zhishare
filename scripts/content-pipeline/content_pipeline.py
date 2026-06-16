#!/usr/bin/env python3
"""Minimal content collection pipeline skeleton.

This script is intentionally small and conservative:
- fetches RSS or HTML sources
- normalizes a common row shape
- computes a simple heuristic score stub
- writes JSON rows to stdout or a file

It is meant to be the first step in the zhishare content ingestion pipeline.
"""

from __future__ import annotations

import argparse
import dataclasses
import datetime as dt
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass, asdict
from html import unescape
from pathlib import Path
from typing import Any, Iterable, Optional


@dataclass
class SourceConfig:
    name: str
    url: str
    kind: str = "rss"
    category: str = ""
    keywords: list[str] = dataclasses.field(default_factory=list)


@dataclass
class ContentRow:
    title: str
    link: str
    github_stars: Optional[int]
    summary: str
    published_at: str
    keywords: list[str]
    source_name: str
    category: str
    is_open_source: bool
    ai_score: int
    ai_verdict: str


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Optional[Path], payload: Any) -> None:
    text = json.dumps(payload, ensure_ascii=False, indent=2)
    if path is None:
        sys.stdout.write(text)
        sys.stdout.write("\n")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def fetch_url(url: str, timeout: int = 20) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "zhishare-content-pipeline/0.1 (+https://zhishare.vercel.app/)",
            "Accept": "application/rss+xml, application/xml, text/html, */*",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        return resp.read().decode(charset, errors="replace")


def parse_rss(xml_text: str) -> list[dict[str, Any]]:
    root = ET.fromstring(xml_text)
    items: list[dict[str, Any]] = []
    for node in root.findall(".//item"):
        title = text_or_empty(node.findtext("title"))
        link = text_or_empty(node.findtext("link"))
        summary = text_or_empty(node.findtext("description") or node.findtext("{http://www.w3.org/2005/Atom}summary"))
        published = text_or_empty(node.findtext("pubDate") or node.findtext("{http://purl.org/dc/elements/1.1/}date"))
        items.append(
            {
                "title": title,
                "link": link,
                "summary": strip_html(summary),
                "published_at": published,
            }
        )
    return items


def strip_html(value: str) -> str:
    text = re.sub(r"<[^>]+>", " ", value)
    text = unescape(text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def text_or_empty(value: Optional[str]) -> str:
    return strip_html(value or "")


def parse_html_page(html_text: str) -> dict[str, str]:
    try:
        from bs4 import BeautifulSoup  # type: ignore
    except Exception:
        return fallback_html_parse(html_text)

    soup = BeautifulSoup(html_text, "html.parser")
    title = text_or_empty(soup.title.text if soup.title else "")
    meta_desc = ""
    meta_keywords = ""
    summary = ""
    desc_tag = soup.find("meta", attrs={"name": re.compile("^description$", re.I)})
    if desc_tag and desc_tag.get("content"):
        meta_desc = text_or_empty(str(desc_tag.get("content")))
    kw_tag = soup.find("meta", attrs={"name": re.compile("^keywords$", re.I)})
    if kw_tag and kw_tag.get("content"):
        meta_keywords = text_or_empty(str(kw_tag.get("content")))
    first_p = soup.find("p")
    if first_p:
        summary = text_or_empty(first_p.get_text(" ", strip=True))
    return {
        "title": title,
        "summary": summary or meta_desc,
        "keywords": meta_keywords,
    }


def fallback_html_parse(html_text: str) -> dict[str, str]:
    title_match = re.search(r"<title[^>]*>(.*?)</title>", html_text, flags=re.I | re.S)
    meta_desc_match = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']',
        html_text,
        flags=re.I | re.S,
    )
    meta_keywords_match = re.search(
        r'<meta[^>]+name=["\']keywords["\'][^>]+content=["\'](.*?)["\']',
        html_text,
        flags=re.I | re.S,
    )
    first_p_match = re.search(r"<p[^>]*>(.*?)</p>", html_text, flags=re.I | re.S)
    return {
        "title": text_or_empty(title_match.group(1)) if title_match else "",
        "summary": strip_html(first_p_match.group(1)) if first_p_match else text_or_empty(meta_desc_match.group(1)) if meta_desc_match else "",
        "keywords": text_or_empty(meta_keywords_match.group(1)) if meta_keywords_match else "",
    }


def normalize_keywords(values: Iterable[str], extra: str = "") -> list[str]:
    tokens: list[str] = []
    for value in values:
        for token in re.split(r"[,\s/|]+", value):
            token = token.strip()
            if token:
                tokens.append(token)
    for token in re.split(r"[,\s/|]+", extra):
        token = token.strip()
        if token:
            tokens.append(token)
    seen: set[str] = set()
    result: list[str] = []
    for token in tokens:
        key = token.lower()
        if key not in seen:
            seen.add(key)
            result.append(token)
    return result


def parse_github_stars(text: str) -> Optional[int]:
    match = re.search(r"(\d[\d,]*)\s*[kK]?\s*stars?", text, flags=re.I)
    if match:
        raw = match.group(1).replace(",", "")
        try:
            return int(raw)
        except ValueError:
            return None
    match = re.search(r"(\d[\d,]*)\s*[kK]?", text)
    if match:
        raw = match.group(1).replace(",", "")
        try:
            return int(raw)
        except ValueError:
            return None
    return None


def score_item(row: dict[str, Any]) -> tuple[int, str]:
    score = 0
    summary = f"{row.get('title', '')} {row.get('summary', '')}".lower()
    keywords = {kw.lower() for kw in row.get("keywords", [])}
    if row.get("github_stars") is not None:
        stars = int(row["github_stars"])
        if stars >= 5000:
            score += 30
        elif stars >= 1000:
            score += 24
        elif stars >= 200:
            score += 18
        elif stars >= 50:
            score += 10
    if any(token in summary for token in ["open source", "开源", "github", "self-host", "自托管"]):
        score += 20
    if any(token in summary for token in ["workflow", "自动化", "效率", "editor", "note", "笔记", "design", "开发"]):
        score += 15
    if any(token in keywords for token in ["ai", "github", "open-source", "opensource"]):
        score += 10
    if row.get("is_open_source"):
        score += 10
    if len(summary.strip()) > 80:
        score += 5

    if score >= 80:
        verdict = "优先二创"
    elif score >= 60:
        verdict = "待人工复核"
    else:
        verdict = "先留档"
    return min(score, 100), verdict


def parse_source_config(path: Path) -> list[SourceConfig]:
    raw = read_json(path)
    if isinstance(raw, dict):
        raw = raw.get("sources", [])
    sources: list[SourceConfig] = []
    for entry in raw:
        sources.append(
            SourceConfig(
                name=str(entry["name"]).strip(),
                url=str(entry["url"]).strip(),
                kind=str(entry.get("kind", "rss")).strip().lower(),
                category=str(entry.get("category", "")).strip(),
                keywords=[str(v).strip() for v in entry.get("keywords", []) if str(v).strip()],
            )
        )
    return sources


def build_rows(source: SourceConfig, content: list[dict[str, Any]]) -> list[ContentRow]:
    rows: list[ContentRow] = []
    for item in content:
        item_keywords = normalize_keywords(source.keywords, item.get("keywords", ""))
        github_stars = item.get("github_stars")
        payload = {
            "title": item.get("title", "").strip(),
            "summary": item.get("summary", "").strip(),
            "github_stars": github_stars,
            "keywords": item_keywords,
            "is_open_source": bool(item.get("is_open_source", False)),
        }
        ai_score, ai_verdict = score_item(payload)
        rows.append(
            ContentRow(
                title=payload["title"] or "(untitled)",
                link=str(item.get("link", "")).strip(),
                github_stars=github_stars,
                summary=payload["summary"],
                published_at=str(item.get("published_at", "")).strip(),
                keywords=item_keywords,
                source_name=source.name,
                category=source.category,
                is_open_source=bool(item.get("is_open_source", False)),
                ai_score=ai_score,
                ai_verdict=ai_verdict,
            )
        )
    return rows


def collect_source(source: SourceConfig) -> list[dict[str, Any]]:
    raw = fetch_url(source.url)
    if source.kind == "rss":
        return parse_rss(raw)
    if source.kind == "html":
        page = parse_html_page(raw)
        return [
            {
                "title": page.get("title", ""),
                "link": source.url,
                "summary": page.get("summary", ""),
                "published_at": dt.datetime.now(dt.timezone.utc).isoformat(),
                "keywords": page.get("keywords", ""),
                "github_stars": None,
                "is_open_source": False,
            }
        ]
    raise ValueError(f"Unsupported source kind: {source.kind}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Collect public content into normalized JSON rows.")
    parser.add_argument("--source-file", type=Path, required=True, help="JSON file with source definitions")
    parser.add_argument("--output", type=Path, default=None, help="Optional output JSON file")
    args = parser.parse_args()

    sources = parse_source_config(args.source_file)
    all_rows: list[ContentRow] = []
    for source in sources:
        try:
            content = collect_source(source)
        except (urllib.error.URLError, urllib.error.HTTPError, ET.ParseError, ValueError) as exc:
            print(f"[warn] {source.name}: {exc}", file=sys.stderr)
            continue
        all_rows.extend(build_rows(source, content))

    payload = {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "count": len(all_rows),
        "rows": [asdict(row) for row in all_rows],
    }
    write_json(args.output, payload)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
