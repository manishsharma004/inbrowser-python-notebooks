# Kernel persistence & Pyright-class IntelliSense

This document describes how this project addresses two hard limits of in-browser notebooks, and how to turn on the advanced paths.

## 1. Kernel state across page reload

Pyodide cannot snapshot the entire WASM interpreter cheaply. We use a **two-layer** approach instead:

### A. Pickle checkpoint (IndexedDB)

After each successful code cell run, the app attempts to serialize **pickle-able user globals** into a base64 blob stored under `kernel-session-v1` in the same IndexedDB database as the workspace.

- **Restore checkpoint** loads those names back into a fresh kernel after reload.
- **Limitations:** modules, open files, lambdas/closures tied to old globals, C extensions, and some Pyodide objects may fail to pickle. Failed names are listed in the restore result.

### B. Execution journal (replay)

Every successful run appends `{ source, ranAt }` to a capped journal (200 entries) in IndexedDB.

- **Replay journal** re-executes those sources in order on a fresh kernel when pickle restore is incomplete or unavailable.
- **Limitations:** side effects run twice if you use both checkpoint and replay; non-deterministic code (random, time, network) may differ.

### UI (Session panel)

| Action | Effect |
|--------|--------|
| **Save checkpoint** | Manual pickle snapshot now |
| **Restore checkpoint** | Import last saved blob |
| **Replay journal** | Re-run stored cell sources |
| **Clear saved session** | Remove blob + journal from IndexedDB |

On load, if a saved session exists, a banner offers restore/replay.

### Future: IDBFS / native FS

Pyodide’s **IDBFS** mount + `FS.syncfs()` persists **files**, not live Python heap. Mounting `/session` to IDBFS is the right path for large artifacts (CSVs, wheels), not for arbitrary variables. See [Pyodide file system docs](https://pyodide.org/en/stable/usage/file-system.html).

---

## 2. VS Code / Pylance-grade IntelliSense

Default builds use Monaco + curated hints + live `dir()` from the running kernel (good for notebooks, not full type checking).

### Optional: in-browser Pyright

We integrate [`monaco-pyright-lsp`](https://github.com/SardineFish/monaco-pyright-lsp) behind a feature flag:

```bash
VITE_ENABLE_PYRIGHT=true npm run dev
```

Install the optional dependency first:

```bash
npm install monaco-pyright-lsp
```

When enabled, each Monaco code cell attaches Pyright diagnostics (types, imports, undefined names) similar to Pylance.

**Caveats:**

- Bundle size increases significantly (Pyright worker + stubs).
- Pyright’s virtual FS does not automatically see Pyodide-installed packages; sync `.pyi` stubs or virtual files for micropip packages as a follow-up.
- CDN-loaded Monaco must match versions expected by `monaco-pyright-lsp` (see package peer range).

### Practical middle ground (always on)

- Live **`nb_completion_snapshot()`** after runs (imported packages + `dir()` members).
- Static **stdlib index** before the kernel starts.
- Execution journal + checkpoint for **value** persistence, not static analysis.

---

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_ENABLE_PYRIGHT` | unset / false | Load `monaco-pyright-lsp` in Monaco cells |
