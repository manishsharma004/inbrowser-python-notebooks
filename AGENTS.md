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

The Pyodide kernel preloads **numpy** and **matplotlib**. `plt.show()` appears as inline PNG output under the code cell (restart kernel after upgrading).

Kernel state across reload uses **pickle checkpoints + execution journal** in IndexedDB (not a full Pyodide snapshot). Optional **Pyright-class** diagnostics: `npm install monaco-pyright-lsp` and `VITE_ENABLE_PYRIGHT=true npm run dev`. See `docs/KERNEL_AND_INTELLISENSE.md`.

## Architecture documentation (Archify)

Grounded architecture lives in **`archify.md`** (regenerate with `npm run archify` after `npm install`). Analysis cache is under `.archify/` (gitignored). Config: `archify.config.json`, ignore rules: `.archifyignore`.

## Cursor Cloud specific instructions

- **Dev server:** `npm run dev` (listens on `0.0.0.0:4174` per `package.json`)
- **Local URL:** `http://localhost:4174/inbrowser-python-notebooks/` (base path is always applied; Vite may pick the next free port if 4174 is busy)
- **LAN HTTP:** Opening via `http://192.168.x.x:…` is a non-secure context; the app uses `randomId()` instead of `crypto.randomUUID()` so the workspace still mounts.
- **Workspace persistence:** Notebooks imported via **Import** are stored in **IndexedDB** on the current browser origin (host + port). Use the same URL after restart (e.g. always `http://192.168.x.x:7502/...`, not switching between ports).
- **Build:** `npm run build` → output in `dist/`
- **Tests:** `npm test` (Node built-in test runner); `npm run check` for Svelte/TS

### Agent behavior (required)

- **Do not launch subagents** (no `Task` tool / `computerUse`, `explore`, `debug`, etc.). Do all work in the main agent session.
- **Verify in chat:** use the terminal only (`npm run check`, `npm test`, `npm run build`, `curl` against the dev URL). Do not use browser automation or computer-use for testing unless the user explicitly asks.
- **Minimize external API usage:** avoid GitHub REST/GraphQL and other MCP calls when git/CLI in the shell is enough (e.g. prefer `git push` + user-opened PR links over creating PRs via API). Do not call `cursor-cloud` diagnostics unless the user asks.
- **Pull request status (required when working on a feature branch or when the user mentions “PR” / “update pr”):** before wrapping up and after pushing, confirm GitHub state for the **current** PR — do not assume an old PR number still applies after merge.
  1. **Git (local):** `git fetch origin main <branch>` then `git log --oneline origin/main..HEAD` (commits not on `main`) and `git status` (clean, pushed).
  2. **GitHub (preferred if `gh` is authenticated):** `gh pr list --head "$(git branch --show-current)"` and `gh pr view <number> --json state,mergeable,statusCheckRollup,url,mergedAt`.
  3. **GitHub (no `gh`):** public API or compare URL — e.g. open PRs for head branch: `https://api.github.com/repos/manishsharma004/inbrowser-python-notebooks/pulls?state=open&head=manishsharma004:<branch>`; compare: `https://github.com/manishsharma004/inbrowser-python-notebooks/compare/main...<branch>`.
  4. **Report in the agent reply:** PR `#`, **open / merged / closed**, link, whether head is pushed, CI/check summary if available, and commits ahead of `main`. If the previous PR was **merged** and the branch still has new commits, say clearly that a **new PR** is needed (link the compare URL); do not tell the user “PR updated” when there is no open PR.

### Pull requests (this repo)

| Item | Value |
|------|--------|
| Default feature branch | `cursor-agent/monaco-editor-intellisense-9cc7` |
| Compare (branch vs `main`) | https://github.com/manishsharma004/inbrowser-python-notebooks/compare/main...cursor-agent/monaco-editor-intellisense-9cc7 |
| Note | **#3** merged at `e9ebb02`. **#4** merged 2026-09-17. Open follow-up: **#5** ← Archify + completion sort on this branch. |

### UI / manual checks

- Prefer `curl` and build output over screenshots or screen recordings unless the user requests walkthrough artifacts.
- Code cells use **Monaco** (CDN via `@monaco-editor/loader`); Pyodide still loads from CDN on first run.

## Deploy

`.github/workflows/deploy.yml` validates, builds `dist/`, and pushes to **`gh-pages`** via `peaceiris/actions-gh-pages`. One-time: **Settings → Pages → Deploy from branch → `gh-pages` / root**.
