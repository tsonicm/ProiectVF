import os
import io
import csv
import datetime as dt
from pathlib import Path
from urllib.parse import urlparse
import re


import ollama
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
from jinja2 import Template

from models import ToolsSuggestRequest, ToolsSuggestResponse, Tool


load_dotenv()

router = APIRouter(prefix="/api/tools", tags=["tools"])

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma3:latest")


def _read_prompt() -> str:
    base_dir = Path(__file__).resolve()
    for parent in [base_dir.parent, *base_dir.parents]:
        prompts_dir = parent / "prompts"
        if prompts_dir.exists():
            path = prompts_dir / "prompt_dynamic.txt"
            if not path.exists():
                raise FileNotFoundError(f"Prompt file not found: {path}")
            return path.read_text(encoding="utf-8")
    raise FileNotFoundError("Could not locate 'prompts' directory.")

def _render_prompt(prompt_text: str, date: str, max_tools: int) -> str:
    t = Template(prompt_text)
    return t.render(date=date, max_tools=max_tools)


def _extract_csv(text: str) -> str:
    text = (text or "").strip()
    if text.startswith("```"):
        text = text.strip("`").strip()
        if text.lower().startswith("csv"):
            text = text[3:].lstrip()

    header = "tool_name,category,description,main_features,supported_languages_or_models,license,last_known_update_or_version,official_website_or_repository,relevance_score"
    idx = text.find(header)
    if idx >= 0:
        return text[idx:].strip()
    return text

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
    url = _normalize_url(url)
    if not url.startswith("https://"):
        return False
    try:
        u = urlparse(url)
    except Exception:
        return False
    if u.scheme != "https":
        return False
    if not _is_public_hostname(u.hostname or ""):
        return False
    return True


def _clean_cell(s: str) -> str:
    s = (s or "").strip()
    if s.startswith("`") and s.endswith("`") and len(s) >= 2:
        s = s[1:-1].strip()
    if s.startswith('"') and s.endswith('"') and len(s) >= 2:
        s = s[1:-1].strip()
    return s


def _map_category(cat: str) -> str:
    cat = (cat or "").strip()
    mapping = {
        "1": "Functional correctness",
        "2": "Termination analysis",
        "3": "Complexity bound analysis",
        "4": "Neural network verification",
        "5": "QBF solvers / evaluators",
    }
    return mapping.get(cat, cat)


def _parse_csv(csv_text: str) -> list[dict]:
    csv_text = (csv_text or "").lstrip("\ufeff").strip()
    if not csv_text:
        return []

    required_cols = [
        "tool_name",
        "category",
        "description",
        "main_features",
        "supported_languages_or_models",
        "license",
        "last_known_update_or_version",
        "official_website_or_repository",
        "relevance_score",
    ]

    lines = [ln.strip() for ln in csv_text.splitlines() if ln.strip()]
    if not lines:
        return []

    header = required_cols
    header_idx = None
    for i, ln in enumerate(lines):
        if ln.lower().startswith("tool_name,category,description"):
            header_idx = i
            break
    if header_idx is None:
        return []

    data_lines = lines[header_idx + 1 :]

    rows: list[dict] = []
    for ln in data_lines:
        try:
            parsed = next(csv.reader([ln]))
        except Exception:
            parsed = []

        if len(parsed) != 9:
            parts = [p.strip() for p in ln.split(",")]
            if len(parts) < 9:
                continue

            tool_name = parts[0]
            category = parts[1]
            relevance_score = parts[-1]
            official = parts[-2]
            last_update = parts[-3]
            license_ = parts[-4]
            supported = parts[-5]
            main_features = parts[-6]
            description = ",".join(parts[2:-6]).strip()

            parsed = [
                tool_name,
                category,
                description,
                main_features,
                supported,
                license_,
                last_update,
                official,
                relevance_score,
            ]

        d = dict(zip(required_cols, parsed))

        d["tool_name"] = _clean_cell(d["tool_name"])
        d["category"] = _map_category(_clean_cell(d["category"]))
        d["description"] = _clean_cell(d["description"])
        d["main_features"] = _clean_cell(d["main_features"])
        d["supported_languages_or_models"] = _clean_cell(d["supported_languages_or_models"])
        d["license"] = _clean_cell(d["license"])
        d["last_known_update_or_version"] = _clean_cell(d["last_known_update_or_version"])
        d["official_website_or_repository"] = _clean_cell(d["official_website_or_repository"])
        if not _is_valid_url(d["official_website_or_repository"]):
            d["official_website_or_repository"] = ""

        rs = _clean_cell(d["relevance_score"])
        try:
            d["relevance_score"] = int(float(rs))
        except Exception:
            d["relevance_score"] = None

        rows.append(d)

    return rows

@router.post("/suggest", response_model=ToolsSuggestResponse)
async def suggest_tools(req: ToolsSuggestRequest):
    date = req.date or dt.date.today().isoformat()

    try:
        prompt_text = _read_prompt()
        prompt = _render_prompt(prompt_text, date=date, max_tools=req.max_tools)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prompt error: {e}")

    try:
        response: ollama.ChatResponse = ollama.chat(
            model=OLLAMA_MODEL,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.message.content
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Ollama call failed: {e}")

    csv_text = _extract_csv(raw)

    tools_dicts = _parse_csv(csv_text)

    tools: list[Tool] = []
    for t in tools_dicts:
        if not (t.get("tool_name") and t.get    ("official_website_or_repository")):
            continue
        try:
            tools.append(Tool(**t))
        except Exception:
            pass

    return {
        "provider": "ollama",
        "model": OLLAMA_MODEL,
        "csv": csv_text,
        "tools": tools,
    }
