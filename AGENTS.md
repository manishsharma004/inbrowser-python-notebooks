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

## Cursor Cloud specific instructions

- **Dev server:** `npm run dev` (listens on `0.0.0.0:4174` per `package.json`)
- **Local URL:** `http://localhost:4174/inbrowser-python-notebooks/` (base path is always applied; Vite may pick the next free port if 4174 is busy)
- **Build:** `npm run build` → output in `dist/`
- **Tests:** `npm test` (Node built-in test runner); `npm run check` for Svelte/TS

### Agent behavior (required)

- **Do not launch subagents** (no `Task` tool / `computerUse`, `explore`, `debug`, etc.). Do all work in the main agent session.
- **Verify in chat:** use the terminal only (`npm run check`, `npm test`, `npm run build`, `curl` against the dev URL). Do not use browser automation or computer-use for testing unless the user explicitly asks.
- **Minimize external API usage:** avoid GitHub REST/GraphQL and other MCP calls when git/CLI in the shell is enough (e.g. prefer `git push` + user-opened PR links over creating PRs via API). Do not call `cursor-cloud` diagnostics unless the user asks.

### UI / manual checks

- Prefer `curl` and build output over screenshots or screen recordings unless the user requests walkthrough artifacts.
- Code cells use **Monaco** (CDN via `@monaco-editor/loader`); Pyodide still loads from CDN on first run.

## Deploy

`.github/workflows/deploy.yml` validates, builds `dist/`, and pushes to **`gh-pages`** via `peaceiris/actions-gh-pages`. One-time: **Settings → Pages → Deploy from branch → `gh-pages` / root**.
