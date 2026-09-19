# Notebook UX parity (Svelte + Pyodide WASM)

Client-only notebooks aligned with Jupyter Notebook v7 / try-jupyter **behavior**, implemented in Svelte + IndexedDB + a **Pyodide Web Worker** kernel (no Jupyter Server).

## Implemented

| Area | Behavior |
|------|----------|
| **Kernel** | Dedicated **Web Worker** + Pyodide 0.29; **Interrupt** terminates worker; **Restart** resets worker |
| **Packages** | Preload **numpy**, **matplotlib**, **scipy**, **pillow** in worker |
| **VFS → kernel** | Workspace files (except `.ipynb.json`) sync to `/workspace/...` before each cell run |
| **Starter content** | `welcome.ipynb.json` tutorial + `data/iris.csv` on empty workspace |
| **nbformat** | Import/export `.ipynb`: streams, PNG, HTML (stored), errors, `execution_count`, **raw** cells |
| **Persisted outputs** | `lastRun` on code cells in `.ipynb.json` |
| **Kernel UI** | Cold / busy / idle / restarting; **Running** rail tab |
| **Notebook UI** | Trust banner, trusted **HTML** outputs, full width, TOC, collapsible **h2** sections |
| **Cell ops** | Raw cells, duplicate, run all, clear outputs, run/advance shortcuts |
| **Output UX** | Scrolled long text (~100 lines), inline matplotlib PNG |
| **Tests** | Node unit tests + Playwright smoke (`npm run test:e2e`) |

## Explicitly out of scope

Server checkpoints, terminals, ipywidgets, debugger, collaboration, multi-tab document manager.

## Key modules

- `src/lib/pyodide/pyodide-kernel.worker.js` — WASM kernel
- `src/lib/pyodide/kernelWorkerClient.js` — RPC to worker
- `src/lib/pyodide/runtime.js` — public kernel API
- `src/lib/notebook/nbformatOutputs.js` — Jupyter I/O
- `src/lib/vfs/workspaceFilesForKernel.js` — file projection

Regenerate architecture: `npm run archify`.
