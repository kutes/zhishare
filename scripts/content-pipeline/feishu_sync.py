#!/usr/bin/env python3
"""Sync Feishu payloads into a Feishu Bitable table.

This script performs a conservative append-only sync:
- reads the payload produced by feishu_export.py
- obtains a tenant access token using app_id/app_secret
- POSTs each record to the Feishu Bitable create-record API

It intentionally keeps the first version simple and does not attempt
automatic deduplication or updates yet.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


DEFAULT_BASE_URL = "https://open.feishu.cn"


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def request_json(method: str, url: str, payload: dict[str, Any] | None = None, token: str | None = None) -> dict[str, Any]:
    body = None if payload is None else json.dumps(payload, ensure_ascii=False).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=30) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        return json.loads(resp.read().decode(charset, errors="replace"))


def get_tenant_access_token(base_url: str, app_id: str, app_secret: str) -> str:
    url = f"{base_url}/open-apis/auth/v3/tenant_access_token/internal"
    data = request_json("POST", url, {"app_id": app_id, "app_secret": app_secret})
    token = data.get("tenant_access_token")
    if not token:
        raise RuntimeError(f"tenant_access_token missing in response: {data}")
    return str(token)


def create_record(base_url: str, app_token: str, table_id: str, token: str, fields: dict[str, Any]) -> dict[str, Any]:
    url = f"{base_url}/open-apis/bitable/v1/apps/{urllib.parse.quote(app_token)}/tables/{urllib.parse.quote(table_id)}/records"
    return request_json("POST", url, {"fields": fields}, token=token)


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync Feishu Bitable payloads.")
    parser.add_argument("--input", type=Path, required=True, help="Feishu payload JSON from feishu_export.py")
    parser.add_argument("--dry-run", action="store_true", help="Print actions without calling Feishu")
    parser.add_argument("--limit", type=int, default=0, help="Optional limit for records to sync")
    args = parser.parse_args()

    app_id = os.getenv("FEISHU_APP_ID", "").strip()
    app_secret = os.getenv("FEISHU_APP_SECRET", "").strip()
    app_token = os.getenv("FEISHU_APP_TOKEN", "").strip()
    table_id = os.getenv("FEISHU_TABLE_ID", "").strip()
    base_url = os.getenv("FEISHU_BASE_URL", DEFAULT_BASE_URL).strip() or DEFAULT_BASE_URL

    data = load_json(args.input)
    records = list(data.get("records", []))
    if args.limit > 0:
        records = records[: args.limit]

    if args.dry_run or not (app_id and app_secret and app_token and table_id):
        print(json.dumps(
            {
                "mode": "dry-run",
                "count": len(records),
                "needs": {
                    "FEISHU_APP_ID": bool(app_id),
                    "FEISHU_APP_SECRET": bool(app_secret),
                    "FEISHU_APP_TOKEN": bool(app_token),
                    "FEISHU_TABLE_ID": bool(table_id),
                },
                "hint": "Set the Feishu env vars above, then rerun without --dry-run.",
            },
            ensure_ascii=False,
            indent=2,
        ))
        return 0

    token = get_tenant_access_token(base_url, app_id, app_secret)
    created = 0
    for record in records:
        fields = record.get("fields", {})
        try:
            response = create_record(base_url, app_token, table_id, token, fields)
        except (urllib.error.URLError, urllib.error.HTTPError, RuntimeError) as exc:
            print(f"[error] create failed for {fields.get('标题', '(untitled)')}: {exc}", file=sys.stderr)
            continue
        if response.get("code") not in (0, None):
            print(f"[error] feishu error: {response}", file=sys.stderr)
            continue
        created += 1

    print(json.dumps({"mode": "sync", "created": created, "attempted": len(records)}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
