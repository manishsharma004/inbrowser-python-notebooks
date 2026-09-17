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
- **Local URL:** `http://localhost:4174/inbrowser-python-notebooks/` (base path is always applied)
- **Build:** `npm run build` → output in `dist/`
- **Tests:** `npm test` (Node built-in test runner); `npm run check` for Svelte/TS
- **UI verification:** use Playwright/curl against the dev URL above; Pyodide loads from CDN at runtime

## Deploy

`.github/workflows/deploy.yml` validates, builds `dist/`, and pushes to **`gh-pages`** via `peaceiris/actions-gh-pages`. One-time: **Settings → Pages → Deploy from branch → `gh-pages` / root**.
