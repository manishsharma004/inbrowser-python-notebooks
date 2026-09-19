# JupyterLab-style filesystem plan (IndexedDB VFS)

Plan for a **File Browser** and **VFS API** comparable to [JupyterLab](https://github.com/jupyterlab/jupyterlab) / Try Jupyter (Pyodide), while staying **client-only** (IndexedDB + Pyodide `/workspace` sync). No Jupyter Server, no real OS paths.

Reference UI (Try Jupyter): toolbar (+ launcher, new folder, upload, refresh, filter), breadcrumb (`/ notebooks /`), sortable **Name** / **Modified** columns, folder vs notebook icons, **green dot** for notebooks with an active kernel session, single-row selection.

---

## Status

**Implemented** (2026-09): VFS CRUD, `FileBrowser.svelte`, text file editor, workspace JSON bundle import/export, running dots, breadcrumbs, upload/filter/sort.

## Goals

| Goal | Notes |
|------|--------|
| **Browse folders** | Navigate tree; breadcrumb + double-click / enter on directories |
| **CRUD** | New notebook, new text file, new folder, rename, move, delete |
| **Upload / download** | Browser `input[type=file]` upload; download single file or folder zip (later) |
| **Modified column** | Relative time from `node.updatedAt` (like JupyterLab) |
| **Running indicator** | Dot on `.ipynb.json` when that file’s kernel session is warm / busy in this tab |
| **Kernel FS sync** | Keep `workspaceFilesForKernel()` path layout for Pyodide (already path-aware) |
| **Persistence** | IndexedDB snapshot; survive reload on same origin |

## Non-goals (v1)

- Multiple open editor tabs (still **one active notebook** in main canvas)
- Shared kernels across browser tabs
- Server-side `contents` API, Git, real-time collaboration
- Full JupyterLab **Launcher** grid (optional simplified “+” menu instead)
- Arbitrary binary editor (images/PDF: store + download only)
- `jupyter-server` `/api/contents` compatibility layer

---

## Current state (gap analysis)

### Data layer (`src/lib/vfs/`)

| Exists | Missing |
|--------|---------|
| Tree: `VfsNode` + `parentId`, `updatedAt`, file `content` | `deleteNode`, `renameNode`, `moveNode`, path-based `readdir` |
| `createNode`, `listChildren`, `writeFile`, `getNode` | Unique sibling names, safe path normalization |
| IndexedDB v1: single JSON **snapshot** blob | Blob store for large files; schema migration |
| `workspaceFilesForKernel` → `/workspace/...` paths | Pull files **from** Pyodide FS after run (optional) |
| Starter `data/` dir + `iris.csv` | — |

### UI (`NotebookWorkspace.svelte` rail)

| Exists | Missing |
|--------|---------|
| Flat list of **root-level files** only | Current directory, folders in list, breadcrumbs |
| “+ new notebook” | New folder, upload, refresh, filter |
| Files / Running tabs | Running dots on file rows |
| Import via toolbar (single `.ipynb`) | Upload into **current folder** |

### Kernel / sessions

- One **active** notebook drives Pyodide worker; `kernelSessionStore` is **per file id** → can drive “running” dots per notebook file when session checkpoint/journal exists or kernel is bound to that file after open.

---

## Target architecture

```text
┌─────────────────────────────────────────────────────────┐
│  FileBrowser.svelte (JupyterLab-like UI)                 │
│  - toolbar, breadcrumb, table, context menu              │
└───────────────────────┬─────────────────────────────────┘
                        │ browseDirId, selection, actions
┌───────────────────────▼─────────────────────────────────┐
│  vfsClient.js (browser) + vfsTree.js (pure)              │
│  readdir · stat · mkdir · rename · unlink · move · write │
└───────────────────────┬─────────────────────────────────┘
                        │ loadSnapshot / saveSnapshot
┌───────────────────────▼─────────────────────────────────┐
│  IndexedDB (v1 snapshot → v2 nodes + blobs optional)     │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
              workspaceFilesForKernel(snapshot)
                        │
                        ▼
              Pyodide worker `/workspace/...`
```

### Path model

- **Logical root** display name: `/` or `/notebooks/` (breadcrumb label only; internal root remains `workspace` node).
- **Paths** built by walking `parentId` chain (`workspaceFilesForKernel` already does this).
- **Notebooks** stored as `*.ipynb.json` internally; UI shows `.ipynb` label or dual support for import as `name.ipynb` → stored as `.ipynb.json` (document choice in Phase B).

### Running indicator rules (v1)

| State | Dot |
|-------|-----|
| `activeFileId === file.id` and (`pyodideStatus === 'ready'` or `running`) | Green (active kernel) |
| Other file with non-empty `kernelSession` (checkpoint or journal) in IndexedDB | Dim green (“session saved”) |
| Else | No dot |

Align with JupyterLab: dot ≈ “kernel associated / recently run”, not multi-kernel cluster.

---

## VFS API (pure + tests)

Add to `src/lib/vfs/vfsTree.js` (all pure, snapshot mutated in place):

| Function | Behavior |
|----------|----------|
| `resolvePath(snapshot, segments)` | `string[]` → node or null |
| `readdir(snapshot, dirId)` | Alias of `listChildren` + optional `stat` shape |
| `stat(snapshot, nodeId)` | `{ name, type, updatedAt, size, path }` |
| `mkdir(snapshot, parentId, name)` | Create directory; throw if sibling exists |
| `unlink(snapshot, nodeId)` | Remove file or **empty** directory recursively |
| `rename(snapshot, nodeId, newName)` | Same parent; validate sibling |
| `move(snapshot, nodeId, newParentId)` | No cycles; validate sibling name |
| `readFile` / `writeFile` | Already have write; add read helper |
| `duplicateFile(snapshot, nodeId)` | Copy file node + content |

Invariants (unit tested):

- Unique `(parentId, name)` among siblings.
- No orphan `parentId`.
- Directory delete only if empty (or explicit recursive delete with confirm in UI).

### IndexedDB evolution

**Phase 1 (minimal):** Keep single snapshot JSON; call `saveSnapshot` after each VFS mutation (same as today).

**Phase 2 (optional, from `IMPLEMENTATION_PLAN.md`):**

- DB version 2: `nodes` + `blobs` stores, journal for recovery.
- Migrate v1 snapshot → v2 on `onupgradeneeded`.

Defer blobs until upload size or CSV/binary volume requires it; until then UTF-8 `content` on node is enough for `.py`, `.csv`, `.md`, `.ipynb.json`.

---

## File Browser UI (JupyterLab parity)

New component: **`src/lib/components/FileBrowser.svelte`**

### Toolbar (codicons)

| Control | Action |
|---------|--------|
| **+** (primary) | Menu: New notebook, New file, New folder |
| New folder | `mkdir(currentDirId, prompt name)` |
| Upload | Hidden `<input multiple>` → create files under `currentDirId` |
| Refresh | Re-load snapshot from IndexedDB (or noop + re-render) |
| Filter | Client-side filter on current listing (`name.includes`) |

### Breadcrumb

- Segments from root → `currentDirId`; click segment changes directory.
- Display: `/ notebooks / data /` (map internal `workspace` → `notebooks`).

### Table

| Column | Content |
|--------|---------|
| **Name** | Icon by type (folder, notebook, generic file); sort A→Z / Z→A |
| **Modified** | `formatRelativeTime(updatedAt)` — “now”, “1 min. ago”, “yesterday” |

Interactions:

- Click row: select; double-click folder → enter; double-click notebook → open in canvas.
- Context menu (right-click): Open, Rename, Duplicate, Download, Delete.
- Keyboard: Delete key on selection (with confirm).

Replace flat `nb-filelist` in `NotebookWorkspace` with `<FileBrowser />` bound to `snapshot`, `activeFileId`, `currentDirId`, callbacks.

### Opening non-notebook files (practical v1)

| Extension | v1 behavior |
|-----------|----------------|
| `.ipynb.json` / `.ipynb` | Open notebook canvas |
| `.py`, `.txt`, `.csv`, `.md` | **Simple text panel** (Monaco read-only or editable) in secondary view, or modal — saves via `writeFile` |
| Binary | Upload/store metadata; Download only |

Avoid building full JupyterLab file editor v1; prioritize list + notebook + data files for Pyodide labs.

---

## Integration points

### `NotebookWorkspace.svelte`

- State: `currentDirId` (default `snapshot.rootId`), persist optional in `sessionStorage`.
- `selectFile` unchanged; set `currentDirId` to file’s parent when opening from tree.
- `addNotebook` → create under `currentDirId`, not only root.
- Import `.ipynb` → target `currentDirId`.
- After VFS change → `saveSnapshot` + refresh `snapshot` reference.

### Pyodide

- No change to sync contract: full workspace projection on each run.
- Optional Phase C: after cell run, list `/workspace` in worker and import new/changed files back into VFS.

### Kernel sessions

- On `unlink` notebook file → `clearKernelSession(fileId)`.
- On rename/move → migrate session key if keyed by file id (id stable) — no change; if keyed by path in future, update mapping.

---

## Implementation phases

### Phase A — VFS core (1 PR)

- Implement `mkdir`, `rename`, `unlink`, `move`, `stat`, path helpers in `vfsTree.js`.
- Tests: `tests/vfsTree.test.js` (extend existing emptySnapshot test file).
- Fix `ensureStarterDataFiles` check (use tree path, not flat `data/iris.csv` name).

### Phase B — File Browser UI (1 PR)

- `FileBrowser.svelte` + `formatRelativeTime.js`.
- Wire into rail; breadcrumb + folder navigation.
- Toolbar: new notebook/folder, upload, filter, refresh.
- CSS: JupyterLab-like table (Name / Modified), selection, icons.

### Phase C — Polish & JupyterLab cues (1 PR)

- Running dots + sort columns.
- Context menu: rename, delete, download.
- Open `.py`/`.csv` in lightweight editor pane (optional split view).
- E2E: create folder → upload csv → open notebook → `open('data/x.csv')` in Pyodide.

### Phase D — Scale (follow-up, aligns with `IMPLEMENTATION_PLAN.md` Phase 1.1)

- IndexedDB v2 blobs + export/import workspace zip.
- Storage quota UI.
- Pull generated files from Pyodide FS into VFS.

---

## Testing

| Layer | Cases |
|-------|--------|
| Unit | mkdir/rename/move/unlink; duplicate names; delete non-empty dir fails |
| Unit | `filePathForNode` / `resolvePath` with nested dirs |
| E2E | Navigate folder, create notebook, reload, file still there |
| E2E | Upload file, run cell reading path under `/workspace/` |
| Manual | Match Try Jupyter: breadcrumb, modified strings, selection color |

---

## Files to add / change (expected)

| Path | Purpose |
|------|---------|
| `src/lib/vfs/vfsTree.js` | CRUD + path API |
| `src/lib/vfs/vfsPaths.js` | Optional path segment helpers |
| `src/lib/vfs/formatRelativeTime.js` | Modified column |
| `src/lib/components/FileBrowser.svelte` | JupyterLab file browser |
| `src/lib/components/FileBrowserRow.svelte` | Optional row subcomponent |
| `src/lib/components/NotebookWorkspace.svelte` | Replace flat list; `currentDirId` |
| `src/app.css` | `.nb-filebrowser-*` styles |
| `tests/vfsTree.test.js` | Tree mutations |
| `e2e/filesystem.spec.js` | Navigate + persist |
| `docs/FILESYSTEM_JUPYTERLAB_PLAN.md` | This document |
| `docs/IMPLEMENTATION_PLAN.md` | Cross-link Phase 1 when started |

---

## Success criteria

- User can create folders, upload files, and navigate a nested tree like Try Jupyter.
- Notebooks and data files sync to Pyodide under consistent `/workspace/...` paths.
- Modified times and running dots match expectations on the file list.
- No regression: existing welcome notebook + iris CSV + kernel sessions.
- `npm test`, `npm run check`, `npm run test:e2e` pass.

---

## Relation to other plans

- **Theme:** File browser uses same CSS tokens (`docs/THEME_SUPPORT.md`).
- **Notebook UX:** Opening `.ipynb` still uses notebook canvas (`docs/NOTEBOOK_V7_PARITY.md`).
- **Broader VFS:** `docs/IMPLEMENTATION_PLAN.md` Phase 1.1–1.4 is the long-term storage evolution; this plan delivers **user-visible JupyterLab filesystem UX** on the current snapshot model first.
