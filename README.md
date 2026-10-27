# The Fluency Workbook

A research-first, teach-first workbook for becoming a researcher in multi-agent systems, robotics and reinforcement learning: 56 chapters and 440 exercises covering C++ and Python fluency, data structures and algorithms, machine learning, deep learning, RL, multi-agent coordination, robotics, competition AI (AIWolf, Halite, Pommerman, MineRL) and a NeurIPS 2027 paper sprint.

## Where to read it

- **Public copy (GitHub Pages):** <https://abusumon.github.io/fluency-workbook/>, readable by anyone without an account. It shows every committed solution, and you can commit new ones from it.
- **Claude version (claude.ai artifact):** the same workbook with progress synced across devices and an optional place to save drafts.

## Repository layout

| Path | What it is |
| --- | --- |
| `index.html`, `*.js` | The workbook itself (static site, no build step) |
| `submissions/` | Solutions, one file per exercise, grouped by chapter |
| `submissions/README.md` | How to add a solution and how files are named |

## How submissions get here

Manually. Under any exercise, **Submit code → Commit to GitHub** opens GitHub's new-file page with the right path and your code filled in; press **Commit changes**. The public copy reads the `submissions/` folder through the GitHub API, so no build step or scheduled job is needed.

## Run locally

Open `index.html` through any static server, for example:

```sh
python3 -m http.server 8000
```

then visit <http://localhost:8000>.
