#!/usr/bin/env python3
"""Write workbook submissions (exported from the artifact database) into this repo.

Usage:
    python3 tools/sync_submissions.py EXPORT_DIR REPO_DIR DEFAULT_REPO [BRANCH]

EXPORT_DIR holds one JSON file per submission document (as written by the
ArtifactData tool's `out_dir` option, searched recursively). Only submissions
whose target repository is DEFAULT_REPO (or that name no repository) are
written. Prints a JSON summary: written ids, skipped ids, ids for other repos.
"""
import json
import sys
from pathlib import Path


def load_docs(export_dir: Path) -> dict:
    docs = {}
    for f in sorted(export_dir.rglob("*.json")):
        try:
            raw = json.loads(f.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as e:
            print(f"warning: skipping {f}: {e}", file=sys.stderr)
            continue
        body = raw.get("data", raw) if isinstance(raw, dict) else None
        if not isinstance(body, dict) or "code" not in body or "path" not in body:
            continue
        doc_id = raw.get("id") or f.stem
        docs[doc_id] = {"body": body, "version": raw.get("version")}
    return docs


def safe_relpath(path: str) -> Path:
    p = Path(path)
    if p.is_absolute() or any(part in ("..", "") for part in p.parts):
        raise ValueError(f"unsafe path: {path!r}")
    return p


def main() -> int:
    if len(sys.argv) < 4:
        print(__doc__)
        return 2
    export_dir, repo_dir, default_repo = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3].strip()
    branch = sys.argv[4] if len(sys.argv) > 4 else "main"

    docs = load_docs(export_dir)
    out_root = repo_dir / "submissions"
    out_root.mkdir(parents=True, exist_ok=True)

    index, written, other_repo, skipped = {}, [], {}, []
    for doc_id, d in docs.items():
        b = d["body"]
        target = (b.get("repo") or default_repo).strip()
        if target != default_repo:
            other_repo.setdefault(target, []).append(doc_id)
            continue
        try:
            rel = safe_relpath(b["path"])
        except ValueError as e:
            print(f"warning: {doc_id}: {e}", file=sys.stderr)
            skipped.append(doc_id)
            continue
        dest = out_root / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        code = b.get("code", "")
        if not code.endswith("\n"):
            code += "\n"
        dest.write_text(code, encoding="utf-8")
        written.append(doc_id)
        entry = {k: b.get(k) for k in ("chapter", "chapterN", "chapterTitle", "label", "title", "lang", "notes", "updatedAt", "code")}
        entry.update(path=str(rel), repo=default_repo, synced=True)
        index[doc_id] = entry

    (out_root / "index.json").write_text(
        json.dumps({"repo": default_repo, "branch": branch, "submissions": index}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    lines = ["# Submissions", "", f"{len(index)} exercises solved and submitted from the Fluency Workbook.", ""]
    by_chapter = {}
    for doc_id, e in index.items():
        by_chapter.setdefault((e.get("chapterN") or "", e.get("chapterTitle") or ""), []).append(e)
    for (n, title), items in sorted(by_chapter.items(), key=lambda kv: str(kv[0][0])):
        lines.append(f"## {n}. {title}")
        lines.append("")
        for e in sorted(items, key=lambda e: str(e.get("label"))):
            lang = {"py": "Python", "cpp": "C++"}.get(e.get("lang"), "Text")
            note = f" — {e['notes']}" if e.get("notes") else ""
            lines.append(f"- [{e.get('label')} {e.get('title')}]({e['path']}) · {lang}{note}")
        lines.append("")
    (out_root / "README.md").write_text("\n".join(lines), encoding="utf-8")

    print(json.dumps({"written": written, "skipped": skipped, "other_repos": other_repo}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
