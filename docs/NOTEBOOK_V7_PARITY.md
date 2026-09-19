# Notebook UX parity (Svelte + Pyodide)

We stay **client-only** (SvelteKit, IndexedDB VFS, Pyodide WASM). This checklist tracks behaviors inspired by [Notebook v7](https://jupyter.org/enhancement-proposals/notebook-v7/), [`jupyter/notebook`](https://github.com/jupyter/notebook), and [`try-jupyter`](https://github.com/jupyter/try-jupyter)—implemented in our stack, not via Jupyter Server or JupyterLite.

## Shipped in this repo

| Area | Behavior |
|------|----------|
| **nbformat export** | `.ipynb` includes `stream` / `display_data` (PNG) / errors from cell runs; `execution_count` preserved |
| **nbformat import** | Restores outputs into persisted `lastRun`; `metadata.scrolled`; notebook `trusted` from cell trust flags |
| **Persisted outputs** | `.ipynb.json` stores `lastRun` per code cell; reload restores display without re-executing |
| **Kernel status** | Cold / busy / idle / restarting labels (Notebook-style wording) |
| **Running panel** | File rail **Running** tab shows kernel state and active cell |
| **Output scroll** | Long stdout uses scrolled output (~100 lines), honors cell `metadata.scrolled` |
| **Trust** | Imported notebooks default **Not trusted**; user can trust (export marks cells trusted) |
| **Full width** | Toggle widens notebook canvas; stored in document metadata |
| **Shortcuts** | Ctrl/Cmd+Enter run cell; Shift+Enter run and scroll to next cell |

## Planned / not in scope (browser limits)

- Jupyter Server checkpoints, multi-tab document opener, terminals, ipywidgets, debugger, real-time collaboration
- Full HTML `display_data` rendering (markdown remains sanitized)

## Key modules

- `src/lib/notebook/nbformatOutputs.js` — Jupyter output ↔ run snapshot
- `src/lib/notebook/notebookRunState.js` — persist runs on cells
- `src/lib/notebook/jupyterFormat.js` — `.ipynb` import/export

Regenerate architecture docs: `npm run archify`.
