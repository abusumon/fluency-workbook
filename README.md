# The Fluency Workbook

A research-first, teach-first workbook for becoming a researcher in multi-agent systems, robotics and reinforcement learning: 56 chapters and 440 exercises covering C++ and Python fluency, data structures and algorithms, machine learning, deep learning, RL, multi-agent coordination, robotics, competition AI (AIWolf, Halite, Pommerman, MineRL) and a NeurIPS 2027 paper sprint.

## Where to read it

- **Main workbook (claude.ai artifact):** the interactive version. Code is submitted there under each exercise, and progress syncs across devices.
- **Public copy (GitHub Pages):** this repository served as a website, readable by anyone without an account. It shows every submitted solution read-only.

## Repository layout

| Path | What it is |
| --- | --- |
| `index.html`, `*.js` | The workbook itself (static site, no build step) |
| `submissions/` | Solutions submitted from the workbook, one file per exercise, grouped by chapter |
| `submissions/README.md` | Index of all submitted solutions |
| `submissions/index.json` | Data the public copy uses to show solutions |
| `tools/sync_submissions.py` | Writes exported submissions into `submissions/` |

## How submissions get here

A scheduled task runs every hour. It reads new or edited submissions from the workbook, writes them into `submissions/`, commits and pushes, then marks them as synced so the workbook shows an "On GitHub" link.

## Run locally

Open `index.html` through any static server, for example:

```sh
python3 -m http.server 8000
```

then visit <http://localhost:8000>.
