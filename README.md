# inbrowser-python-notebooks

Client-only Python notebooks using **SvelteKit**, **Pyodide**, and an **IndexedDB** virtual file system. No backend: notebooks and files live in the browser.

## Features (Phase 0)

- Static SvelteKit app exportable to GitHub Pages
- IndexedDB workspace with notebook files (`.ipynb.json`)
- Run Python code cells via Pyodide (CDN, lazy-loaded)
- Implementation roadmap: [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md)

## Development

Requirements: Node **≥ 20.19**.

```bash
npm install
npm run dev
```

Open [http://localhost:4174/inbrowser-python-notebooks/](http://localhost:4174/inbrowser-python-notebooks/) (the app is served under the GitHub Pages base path).

```bash
npm run check   # svelte-check
npm test        # node:test unit tests
npm run build   # static export to dist/
```

## Deploy (GitHub Pages)

1. Enable **Pages → Build and deployment → GitHub Actions** for this repository.
2. Push to `main`; [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys `dist/`.

Published URL: `https://manishsharma004.github.io/inbrowser-python-notebooks/`

## Project layout

| Path | Purpose |
|------|---------|
| `src/lib/vfs/` | IndexedDB snapshot + tree helpers |
| `src/lib/pyodide/` | Pyodide loader and cell execution |
| `src/lib/notebook/` | Notebook JSON parse/serialize |
| `src/lib/components/` | Notebook UI shell |
| `docs/IMPLEMENTATION_PLAN.md` | Phased plan for full notebook server |

## License

MIT — see [LICENSE](LICENSE).
