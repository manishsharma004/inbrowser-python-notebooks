# AGENTS.md

## Package manager

Use **npm** for this repository (`package-lock.json` is committed). Node **≥ 20.19** required.

```bash
npm ci
npm run dev
npm run check
npm test
npm run build
```

## Project overview

Client-only Python notebooks: SvelteKit + Pyodide + IndexedDB virtual file system. Static export to `dist/` for GitHub Pages at base path `/inbrowser-python-notebooks`.

Notebook UI includes Monaco code cells, markdown edit/preview, cell add/delete/reorder, import/export (`.ipynb` + `.ipynb.json`), and a session panel for interpreter variables and `os.environ`.

The Pyodide kernel runs in a **Web Worker** (`pyodide-kernel.worker.js`) and preloads **numpy**, **matplotlib**, **scipy**, and **pillow**. Workspace files sync to `/workspace/...` before runs; `plt.show()` appears as inline PNG output under the code cell.

Kernel state across reload uses **pickle checkpoints + execution journal** in IndexedDB (not a full Pyodide snapshot). Optional **Pyright-class** diagnostics: `npm install monaco-pyright-lsp` and `VITE_ENABLE_PYRIGHT=true npm run dev`. See `docs/KERNEL_AND_INTELLISENSE.md`. Notebook UX parity: `docs/NOTEBOOK_V7_PARITY.md`.

## Architecture documentation (Archify)

Grounded architecture lives in **`archify.md`** (regenerate with `npm run archify` after `npm install`). Analysis cache is under `.archify/` (gitignored). Config: `archify.config.json`, ignore rules: `.archifyignore`.

## Cursor Cloud specific instructions

- **Dev server:** `npm run dev` (listens on `0.0.0.0:4174` per `package.json`)
- **Local URL:** `http://localhost:4174/inbrowser-python-notebooks/` (base path is always applied; Vite may pick the next free port if 4174 is busy)
- **LAN HTTP:** Opening via `http://192.168.x.x:…` is a non-secure context; the app uses `randomId()` instead of `crypto.randomUUID()` so the workspace still mounts.
- **Workspace persistence:** Notebooks imported via **Import** are stored in **IndexedDB** on the current browser origin (host + port). Use the same URL after restart (e.g. always `http://192.168.x.x:7502/...`, not switching between ports).
- **Build:** `npm run build` → output in `dist/`
- **Tests:** `npm test` (Node built-in test runner); `npm run check` for Svelte/TS; `npm run test:e2e` (Playwright smoke — uses `preview:e2e` on port **43174**, not dev port 4174)
- **Theme:** Dark / Light / System in notebook **⋯** menu (`nb-theme-preference-v1` in localStorage)
- **Files:** JupyterLab-style file browser in left rail (folders, upload, modified column)
- **Mobile (≤640px):** Bottom navigation replaces cramped rail strip; code accessory bar when editing on touch/narrow viewports

### Agent behavior (required)

- **Do not launch subagents** (no `Task` tool / `computerUse`, `explore`, `debug`, etc.). Do all work in the main agent session.
- **Verify in chat:** use the terminal only (`npm run check`, `npm test`, `npm run build`, `curl` against the dev URL). Do not use browser automation or computer-use for testing unless the user explicitly asks.
- **Minimize external API usage:** avoid GitHub REST/GraphQL and other MCP calls when git/CLI in the shell is enough. **Exception:** when the user asks to **update/create a PR**, or when the feature branch has commits ahead of `main` and needs review, use `gh` or the GitHub API to **open a PR if none exists** (see below). Do not call `cursor-cloud` diagnostics unless the user asks.
- **Rebase, push, and PR (required when the user mentions “PR”, “update pr”, “rebase and update”, or you finish feature work on a branch):**
  1. **Git:** `git fetch origin main` → `git rebase origin/main` (resolve conflicts) → run checks if code changed → `git push -u origin <branch>` (use `--force-with-lease` after rebase when needed).
  2. **Open PR if missing:** After push, check for an **open** PR whose head is the current branch (`gh pr list --head "$(git branch --show-current)"`, or GET `.../pulls?state=open&head=manishsharma004:<branch>`). If **no open PR** and `git log origin/main..HEAD` is non-empty, **create one** (`gh pr create --base main --head <branch> --fill`, or POST `/repos/.../pulls` with title/body summarizing commits and test plan). Do **not** stop at “branch updated” or only share a compare URL when the user wanted a PR.
  3. **If an open PR exists:** treat “update pr” as rebase + push so the existing PR’s diff refreshes; optionally edit title/body if the scope changed materially.
  4. **If the last PR for this branch was merged** but the branch has **new** commits on top of `main`, that is a **new** PR — create it; do not assume the old number still applies.
- **Pull request status (report before wrapping up):** confirm GitHub state for the **current** open PR (or the one you just created).
  1. **Git (local):** `git log --oneline origin/main..HEAD`, `git status` (clean, pushed).
  2. **GitHub (preferred if `gh` is authenticated):** `gh pr view <number> --json state,mergeable,statusCheckRollup,url,mergedAt`.
  3. **GitHub (no `gh`):** open PRs API for head branch; compare URL: `https://github.com/manishsharma004/inbrowser-python-notebooks/compare/main...<branch>`.
  4. **Report in the agent reply:** PR `#`, **open / merged / closed**, link, whether head is pushed, CI/check summary if available, commits ahead of `main`. Never say “PR updated” when there is no open PR.

### Pull requests (this repo)

| Item | Value |
|------|--------|
| Default feature branch | `cursor-agent/monaco-editor-intellisense-9cc7` |
| Compare (branch vs `main`) | https://github.com/manishsharma004/inbrowser-python-notebooks/compare/main...cursor-agent/monaco-editor-intellisense-9cc7 |
| Open PR | **#8** — https://github.com/manishsharma004/inbrowser-python-notebooks/pull/8 |
| Note | **#7** merged 2026-09-19 (theme + filesystem). **#8** adds mobile UX. **#6** merged earlier. Agents must **create** a new PR when the prior one merged and the branch still has commits (see Agent behavior). |

### UI / manual checks

- Prefer `curl` and build output over screenshots or screen recordings unless the user requests walkthrough artifacts.
- Code cells use **Monaco** (CDN via `@monaco-editor/loader`); Pyodide still loads from CDN on first run.

## Deploy

`.github/workflows/deploy.yml` validates, builds `dist/`, and pushes to **`gh-pages`** via `peaceiris/actions-gh-pages`. One-time: **Settings → Pages → Deploy from branch → `gh-pages` / root**.
