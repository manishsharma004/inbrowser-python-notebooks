# Mobile UX plan — responsive shell + on-screen code keys

Plan for a **mobile-friendly** in-browser notebook (Svelte + Pyodide) and an **on-screen accessory bar** for Python editing when the OS keyboard lacks `{ } [ ] : ' " Tab` and related keys. No native app; static GitHub Pages + IndexedDB unchanged.

Reference patterns: JupyterLab mobile (single-column + drawer), VS Code web (compact activity bar), iOS **input accessory view** / Android **IME action row**.

---

## Problem statement (current)

| Area | Today | Mobile pain |
|------|--------|-------------|
| **Layout** | 3-column grid: rail \| notebook \| session | At ≤720px rail stacks with **`max-height: 11rem`** — file browser table clipped; session hidden at ≤960px with **no substitute** |
| **Top bar** | Many toolbar chips + kernel menu | Wraps awkwardly; small tap targets; title path wastes width |
| **Cell chrome** | Dense icon row (~1.65rem buttons) | Below **44×44px** touch guideline |
| **Monaco** | Full desktop editor | Virtual keyboard **covers** cursor; no Tab/colon/bracket keys on phone keyboard |
| **Keymap** | Jupyter `A`/`B`/`M`/`DD` in command mode | Irrelevant without hardware keyboard; **Shift+Enter** still needed via bar or OS |
| **Splitters** | Drag resize rail/session | Hidden on small screens but layout logic still assumes desktop widths |
| **Safe area** | None | Notch / home indicator overlap possible |
| **`100vh`** | `max-height: 100vh` on `.nb-app` | Mobile browser chrome makes viewport jump when URL bar shows/hides |

Existing CSS: `@media (max-width: 960px)` hides session; `@media (max-width: 720px)` single column + short rail (`app.css`). **Insufficient** for usable Files + notebook + kernel on phone.

---

## Goals

1. **Usable phone layout** (320–428px width): open files, edit/run cells, see outputs, restart kernel without horizontal scroll.
2. **Usable tablet** (768–960px): optional session access; rail as collapsible panel.
3. **Code accessory bar** when a **code cell** (Monaco) or **code-ish textarea** is focused on touch devices: insert common Python tokens + **Run** / **Run ▼**.
4. **No regression** on desktop: accessory bar hidden when `(pointer: fine)` and wide viewport.
5. **Testable**: Playwright mobile viewports + unit tests for insert helpers.

## Non-goals (v1)

- Native mobile app or PWA install prompt focus
- Full soft keyboard replacement (custom QWERTY)
- Debugger, multi-window, split notebook
- Haptic feedback
- Speech-to-code

---

## Design principles

- **One primary column** on mobile: notebook canvas full width.
- **Overlays, not squeeze**: Files and Session as **full-screen sheets** or **bottom tabs**, not 11rem rail strip.
- **Touch targets**: minimum **44×44 CSS px** for interactive controls (WCAG 2.5.5 advisory).
- **Progressive enhancement**: desktop layout unchanged; mobile rules gated by `@media (max-width: …)` and optional `.nb-shell--mobile` class from JS for tests.
- **Editor-first**: accessory bar docks **above** OS keyboard using `visualViewport` when available, else fixed bottom of screen.

---

## Breakpoints & shell modes

| Mode | Width | Shell |
|------|-------|--------|
| **Desktop** | >960px | Current grid: rail \| notebook \| session |
| **Tablet** | 721–960px | Notebook full width; session in **drawer** (right); rail **overlay** from left |
| **Mobile** | ≤720px (tune to **640px** for phone) | **Bottom nav** 4 tabs + single content pane |

Suggested CSS variables:

```css
--bp-tablet: 960px;
--bp-mobile: 640px;
--touch-target: 44px;
--mobile-nav-height: 3.25rem;
--safe-bottom: env(safe-area-inset-bottom, 0px);
```

Detect **touch-primary** for accessory bar (not width alone):

```js
window.matchMedia('(pointer: coarse)').matches
```

Optional combine: show bar only if `coarse && width <= 768`.

---

## Mobile information architecture

### Bottom navigation (mobile only)

| Tab | Content | Badge |
|-----|---------|--------|
| **Files** | Full-height `FileBrowser` | — |
| **Notebook** | Canvas (cells or text editor) | Running dot if kernel busy |
| **Session** | `SessionPanel` (globals, environ, checkpoint) | — |
| **More** | Theme, import/export, workspace bundle, outline toggle | — |

Implementation sketch:

- `src/lib/layout/mobileShell.js` — `MobileTab = 'files' | 'notebook' | 'session' | 'more'`
- `NotebookWorkspace.svelte`: `mobileTab` state; hide desktop grid when `@media`; show `.nb-mobile-nav` + one `.nb-mobile-pane`.
- Persist last tab in `sessionStorage` (`nb-mobile-tab-v1`), default **Notebook** after opening a file.

### Desktop / tablet

- Keep existing rail + splitters; at tablet hide session column but add **toolbar button** “Session” opening same panel as drawer (`<dialog>` or slide-over).

### Top bar (mobile compaction)

- **Row 1:** notebook title (truncate) + kernel status (dot + short label).
- **Row 2 (notebook tab only):** **Run All**, **+ Code**, overflow **⋯** (rest of current menu).
- Hide: full path `~/workspace`, duplicate export buttons (move to More tab).

---

## Component changes (by area)

### `NotebookWorkspace.svelte`

- Add `mobileTab`, `sessionDrawerOpen` (tablet).
- Conditional render: desktop `.nb-body` grid vs mobile `.nb-mobile-shell`.
- Wire bottom nav `onclick` → switch panes; Files tab does not unmount notebook state.
- On file open from browser → auto-switch to **Notebook** tab.

### `FileBrowser.svelte`

- Mobile: full viewport height inside Files pane; sticky toolbar; **larger row min-height** (48px).
- Hide secondary action row behind **⋯** on narrow width or always use context menu on long-press (v2); v1: keep action chips but wrap.

### `NotebookCellChrome.svelte`

- `@media (max-width: 640px)`: collapse cell menu into single **⋯**; enlarge play/delete icons to `--touch-target`.
- Optional: hide “Run below” / “Run all below” inside menu on mobile to save space.

### `SessionPanel.svelte`

- Reuse as-is inside Session tab / drawer; ensure scroll `overflow-y: auto` and padding-bottom for safe area.

### `MonacoCodeCell.svelte` + `monacoSetup.js`

- On mobile: `fontSize: 15`, `lineHeight: 22`, consider `scrollbar.vertical: 'auto'` with larger hit area.
- Register **focused cell id** in `notebookEditorRegistry.js` (extend beyond focus fn): `setActiveEditorCellId(cellId | null)`.
- Emit focus/blur to drive accessory bar visibility.

### New: `MobileCodeAccessory.svelte`

Sticky bar; props:

- `visible: boolean`
- `onInsert: (text: string) => void`
- `onRun`, `onRunAdvance`
- `disabled` when kernel busy

**Key groups (horizontal scroll):**

| Group | Keys | Notes |
|-------|------|--------|
| **Run** | ▶ Run, ⏷ Run+next | Primary actions |
| **Indent** | Tab → 4 spaces | Critical for Python |
| **Pairs** | `( )` `[ ]` `{ }` `' '` `" "` | Insert pair with cursor inside (Monaco snippet) |
| **Syntax** | `:` `#` `=` `_` `.` `,` | Common Python |
| **Operators** | `+` `-` `*` `/` `%` | Optional second row or scroll |
| **Nav** | ← → | `editor.trigger('cursorLeft')` — optional v1.1 |

Insert implementation (`src/lib/editor/editorInsert.js`):

```js
export function insertAtCursor(editor, text, monaco) {
  const sel = editor.getSelection();
  const op = { range: sel, text, forceMoveMarkers: true };
  editor.executeEdits('mobile-accessory', [op]);
  editor.focus();
}
```

Pair insert: e.g. `()` with selection collapsed inside — use Monaco `InsertAsSnippet` or manual cursor offset.

For **Markdown/Textarea** (`MarkdownCell` edit mode, `TextFileEditor`): same bar; `insert` via `setRangeText` on textarea + preserve selection.

### New: `src/lib/layout/useMobileShell.js`

- `export function isTouchPrimary()`
- `export function isNarrowViewport()`
- `export function shouldShowCodeAccessory(focusedKind: 'monaco' | 'textarea' | null)`

Subscribe `visualViewport` resize to set `--keyboard-offset` CSS var for accessory bar position:

```js
const offset = window.innerHeight - visualViewport.height - visualViewport.offsetTop;
document.documentElement.style.setProperty('--keyboard-offset', `${Math.max(0, offset)}px`);
```

Bar CSS: `bottom: calc(var(--keyboard-offset, 0px) + var(--safe-bottom));`

---

## CSS work (`app.css`)

1. Replace weak 720px rail rule with **mobile shell** (hide `.nb-body` grid children’s rail/session from flow; show tab panes).
2. Add `.nb-mobile-nav`, `.nb-mobile-pane`, `.nb-mobile-pane--active`.
3. `.nb-code-accessory` horizontal scroll, `flex-shrink: 0`, keys min-width 2.5rem min-height 44px.
4. `padding-bottom: calc(var(--mobile-nav-height) + var(--safe-bottom))` on mobile main scroll region when nav visible.
5. Use **`100dvh`** fallback `@supports (height: 100dvh)` for `.nb-app` min/max height.
6. `safe-area-inset-*` on top bar and bottom nav.
7. Reduce body grid background noise on mobile (optional lighter grid or disable).

---

## Interaction & accessibility

- Bottom nav: `role="tablist"` / `role="tab"` / `aria-selected`.
- Accessory keys: `aria-label` per button (“Insert opening parenthesis”).
- Ensure focus returns to editor after insert (Monaco `focus()`).
- Do not trap focus in accessory bar (user can tap editor).
- **Reduced motion**: respect `prefers-reduced-motion` for drawer animations.

---

## Jupyter / vscode-jupyter parity (mobile scope)

| Feature | Mobile approach |
|---------|-----------------|
| Run cell | Accessory **Run** + cell toolbar (large) |
| Run all | Top bar when on Notebook tab |
| Files | Dedicated tab (JupyterLab file browser) |
| Kernel restart | Session tab or kernel summary menu |
| Outline | More tab or notebook menu |
| Command mode A/B/M | **Not** on accessory bar v1; optional “Cell ops” sheet later |

---

## Implementation phases

### Phase 1 — Mobile shell (layout only)

1. `useMobileShell.js` + bottom nav + tab panes in `NotebookWorkspace`.
2. CSS: 640px breakpoint, safe areas, `100dvh`, hide desktop grid on mobile.
3. Compact top bar on mobile.
4. Tablet session drawer (button in top bar).
5. Playwright: `projects: [{ name: 'mobile', use: { viewport: { width: 390, height: 844 }}}]` — smoke: nav tabs visible, switch Files → Notebook.

**Exit criteria:** No horizontal scroll on iPhone 14 viewport; Files list usable full height; session reachable via tab.

### Phase 2 — Touch targets & cell chrome

1. Enlarge cell toolbar controls on mobile.
2. File browser row height + tap targets.
3. Disable pane drag resize when `max-width: 960px` (already hidden; guard JS resize handlers).

**Exit criteria:** Manual tap test checklist pass (44px targets on primary actions).

### Phase 3 — Code accessory bar

1. `editorInsert.js` + extend editor registry for active cell/focus kind.
2. `MobileCodeAccessory.svelte` + wire in `NotebookWorkspace` or `MonacoCodeCell` wrapper.
3. `visualViewport` keyboard offset (feature detect).
4. Textarea path for markdown edit + text file editor.
5. Unit tests: pair insert logic (pure string helpers where possible).

**Exit criteria:** On mobile viewport + emulated touch, focus code cell → bar visible; Tap `:` inserts colon; Run executes cell; bar hides on blur.

### Phase 4 — Polish

1. Long-press on file row → context menu (rename/delete) if hover-less UX needs it.
2. “Pin accessory bar” user pref in localStorage (always show when notebook tab open).
3. Update `AGENTS.md`, `docs/NOTEBOOK_V7_PARITY.md` mobile section.
4. Optional: disable Jupyter `attachNotebookKeymap` when `pointer: coarse`.

---

## Testing plan

| Layer | Cases |
|-------|--------|
| **Unit** | `insertPair('()', cursor)`; `isTouchPrimary` mock; mobile tab state helpers |
| **Playwright mobile** | Tab switch; file browser visible height; accessory bar visible when focusing `.nb-monaco` |
| **Manual** | Real iOS Safari + Android Chrome: keyboard open, bar above keys, run cell, scroll outputs |
| **Regression** | Desktop Playwright smoke unchanged at 1280×720 |

Add `e2e/mobile.spec.js` in Phase 1; extend in Phase 3.

---

## Files to add / modify (expected)

| Path | Phase |
|------|-------|
| `docs/MOBILE_UX_PLAN.md` | This document |
| `src/lib/layout/useMobileShell.js` | 1 |
| `src/lib/layout/mobileTabs.js` | 1 |
| `src/lib/editor/editorInsert.js` | 3 |
| `src/lib/components/MobileCodeAccessory.svelte` | 3 |
| `src/lib/components/MobileBottomNav.svelte` | 1 |
| `src/lib/components/NotebookWorkspace.svelte` | 1–3 |
| `src/lib/editor/notebookEditorRegistry.js` | 3 |
| `src/lib/components/MonacoCodeCell.svelte` | 3 |
| `src/app.css` | 1–3 |
| `playwright.config.js` | 1 (mobile project) |
| `e2e/mobile.spec.js` | 1, 3 |
| `tests/editorInsert.test.js` | 3 |
| `AGENTS.md` | 4 |

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Monaco + virtual keyboard bugs on iOS | Test early on real Safari; fallback font size / scrollIntoView on focus |
| `visualViewport` unsupported | Fixed bottom bar above nav (may be covered by keyboard — document limitation) |
| Accessory bar + bottom nav stack | Offset bar with `--keyboard-offset`; hide nav when accessory visible (optional) |
| Performance (many cells) | Accessory bar single instance at workspace root, not per cell |

---

## Success criteria

- Phone (390×844): user can open **Files**, open notebook, edit `import datetime`, insert `.` and `:` from accessory bar, **Run** cell, read output without zooming or horizontal scroll.
- Session and theme reachable without desktop session column.
- Desktop layout and tests remain green.
- Documented in `AGENTS.md` for future agents.

---

## Relation to other docs

- **Theme:** accessory bar uses CSS tokens (`docs/THEME_SUPPORT.md`).
- **Filesystem:** Files tab hosts `FileBrowser` (`docs/FILESYSTEM_JUPYTERLAB_PLAN.md`).
- **Notebook parity:** mobile does not require Jupyter Server (`docs/NOTEBOOK_V7_PARITY.md`).

When implementation starts, follow **Phase 1 → 2 → 3** in separate commits/PR slices for reviewability.
