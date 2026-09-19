# Theme support plan (Svelte + Pyodide)

Plan for **light**, **dark**, and **system** appearance while keeping one codebase for GitHub Pages static export. Aligns with VS Code Jupyter UX (user preference) without requiring Jupyter Server.

## Status

**Implemented** (2026-09): dark/light/system via `data-theme`, `src/lib/theme/themePreference.js`, Monaco `notebook-py-dark` / `notebook-py-light`, notebook menu theme picker, FOUC bootstrap in `app.html`.

## Goals

| Goal | Notes |
|------|--------|
| User-selectable theme | **Dark** (current default), **Light**, **System** |
| Persist choice | `localStorage`, same pattern as `panelLayout.js` |
| No flash of wrong theme | Apply theme in `app.html` inline script before paint |
| Monaco in sync | Code cells use theme derived from CSS tokens |
| Static export safe | No server; works on `https://…/inbrowser-python-notebooks/` |

## Non-goals (v1)

- Per-notebook theme in `.ipynb.json` metadata (can be v2)
- High contrast / custom themes / theme marketplace
- Theming **matplotlib PNG** or arbitrary **HTML outputs** (stay as produced by kernel)
- Pyright LSP UI theming beyond Monaco (follow Monaco theme only)

## Current state

- **App shell:** semantic tokens on `:root` in `src/app.css` (warm dark “notebook” palette).
- **Monaco:** single theme `notebook-py` (`vs-dark` base), hardcoded hex in `monacoSetup.js` — not tied to CSS variables.
- **Codicons:** inherit `color` from parent; work for light/dark if tokens flip.
- **Oddity:** `app.css` has `#fff` on figure output background (intentional for PNG contrast); keep or gate with `--figure-bg`.

## Theme model

```text
ThemePreference = 'dark' | 'light' | 'system'
ResolvedTheme     = 'dark' | 'light'   // system → matchMedia('(prefers-color-scheme: dark)')
```

**Persistence key:** `nb-theme-preference-v1` (string enum).

**DOM contract:** set `data-theme="dark" | "light"` on `<html>` (or `document.documentElement`). CSS uses attribute selectors, not only `:root` defaults.

```css
:root,
[data-theme='dark'] { /* dark tokens */ }
[data-theme='light'] { /* light tokens */ }
```

Default when no storage: **`dark`** (matches shipped UX today). System resolves at runtime and updates on `prefers-color-scheme` change.

## Token architecture

### 1. Split token blocks in `app.css`

- **`tokens-dark.css`** or a marked section: move current `:root` values → `[data-theme='dark']`.
- **`tokens-light.css`:** VS Code **Light+**-inspired notebook shell (not pure white; subtle borders like VS Code editor group).

Keep **semantic names** only in components (`--bg`, `--ink`, `--focus-ring`, …). Avoid new hardcoded hex in Svelte.

### 2. Map Monaco to resolved theme

In `monacoSetup.js`:

- Define **`notebook-py-dark`** and **`notebook-py-light`** (or one function `defineNotebookThemes(monaco, tokens)`).
- **`setMonacoTheme(resolved: 'dark' | 'light')`** called:
  - After `ensureMonacoReady()`
  - On theme change (subscribe from theme store)
- Prefer reading computed CSS variables once when theme changes:

```js
const bg = getComputedStyle(document.documentElement).getPropertyValue('--cell-bg').trim();
// map to editor.background, etc.
```

Fallback hex table if `getComputedStyle` unavailable (SSR/build).

### 3. Theme module (pure + browser)

`src/lib/theme/themePreference.js`

- `loadThemePreference(): ThemePreference`
- `saveThemePreference(p: ThemePreference)`
- `resolveTheme(p: ThemePreference): ResolvedTheme`
- `applyTheme(resolved: ResolvedTheme)` → `document.documentElement.dataset.theme = resolved`
- `watchSystemTheme(onChange)` → `matchMedia` listener; only active when preference is `system`

Optional thin Svelte store: `src/lib/theme/themeStore.js` wrapping the above for UI binding.

### 4. Bootstrap (FOUC prevention)

In `src/app.html`, before `<body>`:

```html
<script>
  (function () {
    var k = 'nb-theme-preference-v1';
    var p = localStorage.getItem(k) || 'dark';
    var dark = p === 'dark' || (p === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  })();
</script>
```

Svelte layout reconciles on mount (system listener, Monaco sync).

### 5. UI control

**Placement (vscode-jupyter-like):** notebook toolbar `⋯` menu or kernel area — **Color theme: Dark | Light | System**.

- `NotebookWorkspace.svelte` or small `ThemePicker.svelte`
- On change: save → apply → `setMonacoTheme` → optional `meta name="color-scheme"` update

Add to status bar hint: `theme · dark` (optional, low noise).

## Light palette sketch (initial values)

Mirror VS Code light editor chrome, keep gold **run** accent for brand continuity:

| Token | Light (starting point) |
|-------|-------------------------|
| `--bg` | `#f3f3f3` |
| `--bg-elevated` | `#ffffff` |
| `--cell-bg` | `#ffffff` |
| `--cell-focus` | `#f8f8f8` |
| `--border` | `#e5e5e5` |
| `--ink` | `#3b3b3b` |
| `--focus-ring` | `#0078d4` |
| `--run` | `#b8860b` (slightly darker gold for contrast) |

Tune grid background on `body` (lighter grid or disable in light mode).

## Implementation phases

### Phase A — Foundation (1 PR)

1. Token split: `[data-theme='dark'|'light']` in `app.css`.
2. `themePreference.js` + `app.html` bootstrap script.
3. Unit tests: `resolveTheme`, preference load/save (mock `localStorage`).
4. No UI yet; default remains dark; system works via bootstrap.

### Phase B — Monaco + UI (1 PR)

1. Dual Monaco themes + `setMonacoTheme` on preference change.
2. Theme picker in notebook menu.
3. `watchSystemTheme` in root layout or `NotebookWorkspace` `onMount`.
4. E2E: smoke still passes; optional test `data-theme` on html after toggle.

### Phase C — Polish (follow-up)

1. `color-scheme: light dark` on `:root` per resolved theme.
2. Markdown preview link colors / code blocks audited for light contrast.
3. `--figure-bg` for matplotlib container (white vs subtle gray in light).
4. Document in `AGENTS.md` + `NOTEBOOK_V7_PARITY.md` one-liner.
5. (Optional) notebook `metadata.themePreference` override on export/import.

## Testing

| Layer | What |
|-------|------|
| Unit | `resolveTheme`, persistence round-trip, system mock via `matchMedia` stub |
| Visual | Manual: toolbar, cells, outline, session panel, suggest widget, trust banner |
| E2e | Existing smoke; add `getAttribute('data-theme')` after setting localStorage + reload |
| Regression | Grep for `#` in `src/` outside token files (allow list figure white) |

## Files to touch (expected)

| File | Change |
|------|--------|
| `src/app.html` | Inline theme bootstrap |
| `src/app.css` | Light/dark token blocks; grid background |
| `src/lib/theme/themePreference.js` | New |
| `src/lib/theme/themeStore.js` | Optional Svelte helper |
| `src/lib/editor/monacoSetup.js` | Dual themes + `setMonacoTheme` |
| `src/lib/components/NotebookWorkspace.svelte` | Picker + subscribe |
| `src/routes/+layout.svelte` | Init theme + system listener (if not in workspace) |
| `tests/themePreference.test.js` | New |
| `docs/THEME_SUPPORT.md` | This plan (update when done) |
| `AGENTS.md` | Theme key + manual check line |

## Reference

- VS Code workbench colors: [Theme Color](https://code.visualstudio.com/api/references/theme-color) (semantic mapping inspiration).
- vscode-jupyter inherits VS Code notebook UI; we approximate with CSS + Monaco only.
- Existing roadmap mention: `docs/IMPLEMENTATION_PLAN.md` Phase 5 settings.

## Success criteria

- User can set Dark / Light / System; choice survives reload on same origin.
- No visible wrong-theme flash on cold load.
- Monaco editor and suggest widget match shell in both themes.
- `npm run check`, `npm test`, `npm run test:e2e` green.
