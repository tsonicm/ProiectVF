import json
import threading
import re
from pathlib import Path
from uuid import uuid4
from datetime import datetime
from urllib.parse import urlparse

import httpx
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

from models import Tool

load_dotenv()

router = APIRouter(prefix="/api", tags=["tools-store"])

_lock = threading.Lock()

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
PENDING_PATH = DATA_DIR / "pending.json"
APPROVED_PATH = DATA_DIR / "approved.json"
DENIED_PATH = DATA_DIR / "denied.json"


def _ensure_files():
    DATA_DIR.mkdir(exist_ok=True)
    for p in [PENDING_PATH, APPROVED_PATH, DENIED_PATH]:
        if not p.exists():
            p.write_text("[]", encoding="utf-8")


def _load_list(path: Path) -> list[dict]:
    _ensure_files()
    txt = path.read_text(encoding="utf-8").strip() or "[]"
    return json.loads(txt)


def _save_list(path: Path, data: list[dict]):
    _ensure_files()
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(path)


def _parse_languages(s: str) -> list[str]:
    s = (s or "").strip()
    if not s:
        return []
    parts = []
    for chunk in s.replace("|", ",").replace(";", ",").replace("/", ",").split(","):
        c = chunk.strip()
        if c:
            parts.append(c)
    out = []
    seen = set()
    for p in parts:
        k = p.lower()
        if k in seen:
            continue
        seen.add(k)
        out.append(p)
    return out


_BAD_HOSTS = {"localhost", "127.0.0.1", "0.0.0.0"}


def _is_public_hostname(host: str) -> bool:
    if not host:
        return False
    h = host.lower().strip().strip(".")
    if h in _BAD_HOSTS:
        return False
    if re.fullmatch(r"\d{1,3}(\.\d{1,3}){3}", h):
        return False
    if "." not in h:
        return False
    if " " in h:
        return False
    return True


def _normalize_url(url: str) -> str:
    url = (url or "").strip().strip('"').strip()
    if not url:
        return ""
    if url.startswith("`") and url.endswith("`") and len(url) >= 2:
        url = url[1:-1].strip()
    return url


def _is_valid_url(url: str) -> bool:
    url = (url or "").strip()
    if not url.startswith("https://"):
        return False
    try:
        u = urlparse(url)
        return bool(u.scheme and u.netloc)
    except Exception:
        return False


def _url_reachable(url: str) -> bool:
    try:
        with httpx.Client(timeout=8.0, follow_redirects=True) as client:
            r = client.head(url)
            if r.status_code >= 400:
                r = client.get(url)
            return r.status_code < 400
    except Exception:
        return False


def _normalize_llm_tool(t: Tool) -> dict:
    url = _normalize_url(t.official_website_or_repository)

    if not _is_valid_url(url):
        raise ValueError("Invalid URL (must start with https:// and have a host)")

    host = urlparse(url).netloc
    if not _is_public_hostname(host):
        raise ValueError("URL host is not public/valid")

    if not _url_reachable(url):
        raise ValueError("URL not reachable")

    return {
        "id": str(uuid4()),
        "name": (t.tool_name or "").strip(),
        "category": t.category,
        "description": t.description,
        "main_features": t.main_features,
        "languages": _parse_languages(t.supported_languages_or_models),
        "license": t.license,
        "last_known_update_or_version": t.last_known_update_or_version,
        "url": url,
        "relevance_score": t.relevance_score,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat() + "Z",
    }


@router.post("/tools/pending")
async def add_pending(payload: dict):
    """
    Accepta:
      { "tools": [ {Tool fields...}, ... ] }
    sau:
      { "tool": {Tool fields...} }
    """
    tools_in = payload.get("tools")
    if tools_in is None:
        one = payload.get("tool")
        tools_in = [one] if one else []

    if not tools_in:
        raise HTTPException(status_code=400, detail="No tools provided.")

    normalized: list[dict] = []
    rejected = 0

    for item in tools_in:
        try:
            t = Tool(**item)
            normalized.append(_normalize_llm_tool(t))
        except Exception:
            rejected += 1

    if not normalized:
        raise HTTPException(
            status_code=400,
            detail="All tools were invalid (failed URL validation/reachability or schema).",
        )

    with _lock:
        pending = _load_list(PENDING_PATH)
        approved = _load_list(APPROVED_PATH)
        denied = _load_list(DENIED_PATH)

        existing_urls = {
            (x.get("url") or "").strip().lower()
            for x in (pending + approved + denied)
            if (x.get("url") or "").strip()
        }

        new_items = []
        for x in normalized:
            u = (x.get("url") or "").strip().lower()
            if not u:
                rejected += 1
                continue
            if u in existing_urls:
                rejected += 1
                continue
            existing_urls.add(u)
            new_items.append(x)

        if not new_items:
            raise HTTPException(status_code=400, detail="All tools were duplicates or invalid.")

        pending.extend(new_items)
        _save_list(PENDING_PATH, pending)

    return {
        "saved": len(new_items),
        "rejected": rejected,
        "ids": [x["id"] for x in new_items],
    }


@router.get("/tools/pending")
async def get_pending():
    with _lock:
        return _load_list(PENDING_PATH)


@router.post("/tools/{tool_id}/approve")
async def approve(tool_id: str):
    with _lock:
        pending = _load_list(PENDING_PATH)
        approved = _load_list(APPROVED_PATH)

        idx = next((i for i, t in enumerate(pending) if t.get("id") == tool_id), None)
        if idx is None:
            raise HTTPException(status_code=404, detail="Tool not found in pending.")

        tool = pending.pop(idx)
        tool["status"] = "approved"
        approved.append(tool)

        _save_list(PENDING_PATH, pending)
        _save_list(APPROVED_PATH, approved)

    return {"ok": True}


@router.post("/tools/{tool_id}/deny")
async def deny(tool_id: str):
    with _lock:
        pending = _load_list(PENDING_PATH)
        denied = _load_list(DENIED_PATH)

        idx = next((i for i, t in enumerate(pending) if t.get("id") == tool_id), None)
        if idx is None:
            raise HTTPException(status_code=404, detail="Tool not found in pending.")

        tool = pending.pop(idx)
        tool["status"] = "denied"
        denied.append(tool)

        _save_list(PENDING_PATH, pending)
        _save_list(DENIED_PATH, denied)

    return {"ok": True}


@router.get("/tools/approved")
async def get_approved():
    with _lock:
        return _load_list(APPROVED_PATH)
