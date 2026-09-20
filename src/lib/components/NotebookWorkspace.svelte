<script>
	import { onMount } from 'svelte';
	import {
		createNode,
		duplicateFile,
		ensureStarterNotebook,
		ensureStarterDataFiles,
		getNode,
		hasPersistedWorkspace,
		listChildren,
		loadSnapshot,
		mkdir,
		rename,
		saveSnapshot,
		unlink,
		writeFile
	} from '$lib/vfs/indexedDbVfs.js';
	import { emptySnapshot } from '$lib/vfs/vfsTree.js';
	import { isNotebookFileName } from '$lib/vfs/vfsPaths.js';
	import { parseWorkspaceBundle, serializeWorkspaceBundle } from '$lib/vfs/workspaceBundle.js';
	import { parseNotebook, serializeNotebook } from '$lib/notebook/parseNotebook.js';
	import {
		applyCellOutputsToNotebook,
		cellOutputsFromNotebook
	} from '$lib/notebook/notebookRunState.js';
	import { shouldScrollOutput } from '$lib/notebook/nbformatOutputs.js';
	import {
		downloadTextFile,
		parseImportedNotebook,
		toJupyterNotebook
	} from '$lib/notebook/jupyterFormat.js';
	import { tableOfContentsFromNotebook } from '$lib/notebook/tableOfContents.js';
	import { sanitizeTrustedHtml } from '$lib/markdown/sanitizeHtml.js';
	import { workspaceFilesForKernel } from '$lib/vfs/workspaceFilesForKernel.js';
	import {
		exportKernelCheckpoint,
		importKernelCheckpoint,
		inspectPythonCompletions,
		inspectPythonSession,
		isPythonRuntimeReady,
		interruptPythonRun,
		mergeKernelCheckpoint,
		replayKernelJournal,
		resetPythonRuntime,
		runPythonSource
	} from '$lib/pyodide/runtime.js';
	import {
		appendKernelJournalEntry,
		clearKernelSession,
		emptyKernelSession,
		loadKernelSession,
		saveKernelSession
	} from '$lib/pyodide/kernelSessionStore.js';
	import {
		clearDynamicPythonCompletions,
		setDynamicPythonCompletions
	} from '$lib/editor/monacoCompletionState.js';
	import { syncNotebookCellsForAnalysis } from '$lib/editor/pyrightSync.js';
	import MonacoCodeCell from '$lib/components/MonacoCodeCell.svelte';
	import MarkdownCell from '$lib/components/MarkdownCell.svelte';
	import RawCell from '$lib/components/RawCell.svelte';
	import SessionPanel from '$lib/components/SessionPanel.svelte';
	import NotebookCellChrome from '$lib/components/NotebookCellChrome.svelte';
	import FileBrowser from '$lib/components/FileBrowser.svelte';
	import TextFileEditor from '$lib/components/TextFileEditor.svelte';
	import { attachNotebookKeymap } from '$lib/notebook/notebookKeymap.js';
	import { cellIndexById, nextCellId, prevCellId } from '$lib/notebook/notebookCellNavigation.js';
	import { focusNotebookCellEditor, insertIntoActiveEditor, subscribeActiveEditorKind } from '$lib/editor/notebookEditorRegistry.js';
	import { formatDuration, formatRunTimestamp } from '$lib/notebook/formatRunMeta.js';
	import { randomId } from '$lib/utils/randomId.js';
	import {
		clampPanelWidth,
		loadPanelLayout,
		RAIL_WIDTH_MAX,
		RAIL_WIDTH_MIN,
		savePanelLayout,
		SESSION_WIDTH_MAX,
		SESSION_WIDTH_MIN
	} from '$lib/layout/panelLayout.js';
	import {
		applyResolvedTheme,
		loadThemePreference,
		resolveTheme,
		saveThemePreference,
		watchSystemTheme
	} from '$lib/theme/themePreference.js';
	import MobileBottomNav from '$lib/components/MobileBottomNav.svelte';
	import MobileCodeAccessory from '$lib/components/MobileCodeAccessory.svelte';
	import { loadMobileTab, saveMobileTab } from '$lib/layout/mobileTabs.js';
	import {
		attachVisualViewportKeyboardOffset,
		shouldShowCodeAccessory
	} from '$lib/layout/useMobileShell.js';

	/**
	 * @typedef {Object} CellRunRecord
	 * @property {boolean} ok
	 * @property {string} text
	 * @property {number} startedAt
	 * @property {number} finishedAt
	 * @property {number} durationMs
	 * @property {number} executionCount
	 * @property {string[]} [figures]
	 * @property {string[]} [html]
	 * @property {string} [stdout]
	 * @property {string} [stderr]
	 */

	/** @type {import('$lib/vfs/types.js').VfsSnapshot | null} */
	let snapshot = $state(null);
	let activeFileId = $state('');
	/** @type {import('$lib/notebook/parseNotebook.js').NotebookDocument | null} */
	let notebook = $state(null);
	let running = $state(false);
	let pyodideStatus = $state('idle');
	/** @type {Record<string, CellRunRecord>} */
	let cellOutputs = $state({});
	/** @type {Record<string, string>} */
	let sessionGlobals = $state({});
	/** @type {Record<string, string>} */
	let sessionEnviron = $state({});
	let sessionLoading = $state(false);
	/** @type {import('$lib/pyodide/kernelSessionStore.js').KernelSessionRecord | null} */
	let kernelSession = $state(null);
	let showRestoreBanner = $state(false);
	let lastRestoreNote = $state(/** @type {string | null} */ (null));
	/** @type {HTMLInputElement | null} */
	let importInput = $state(null);
	let railWidth = $state(248);
	let sessionWidth = $state(304);
	let importSessionSourceId = $state('');
	let workspaceLoadError = $state(/** @type {string | null} */ (null));
	let railTab = $state(/** @type {'files' | 'running'} */ ('files'));
	let runningCellId = $state(/** @type {string | null} */ (null));
	let kernelRestarting = $state(false);
	let showToc = $state(false);
	let activeCellId = $state(/** @type {string | null} */ (null));
	/** @type {Record<string, boolean>} */
	let collapsedCells = $state({});
	/** @type {Record<string, 'edit' | 'preview'>} */
	let markdownModes = $state({});
	let showNotebookMenu = $state(false);
	/** @type {{ kind: 'code' | 'markdown' | 'raw', source: string, metadata?: Record<string, unknown> } | null} */
	let cellClipboard = $state(null);
	let currentDirId = $state('');
	let editorMode = $state(/** @type {'notebook' | 'text'} */ ('notebook'));
	let textFileSource = $state('');
	/** @type {Record<string, boolean>} */
	let savedSessionFiles = $state({});
	let themePreference = $state(/** @type {import('$lib/theme/themePreference.js').ThemePreference} */ ('dark'));
	/** @type {HTMLInputElement | null} */
	let workspaceImportInput = $state(null);
	let mobileTab = $state(/** @type {import('$lib/layout/mobileTabs.js').MobileTab} */ ('notebook'));
	let useMobileShell = $state(false);
	let useTabletShell = $state(false);
	let sessionDrawerOpen = $state(false);
	let activeEditorKind = $state(/** @type {'monaco' | 'textarea' | null} */ (null));

	const LAST_OPEN_FILE_KEY = 'nb-last-open-file-v1';
	const CURRENT_DIR_KEY = 'nb-current-dir-v1';

	/** @param {import('$lib/vfs/types.js').VfsSnapshot} snap */
	function bumpSnapshot(snap) {
		return { ...snap, nodes: [...snap.nodes] };
	}

	async function reloadKernelSessionMeta(fileId = activeFileId) {
		if (!fileId) {
			kernelSession = emptyKernelSession();
			showRestoreBanner = false;
			return;
		}
		kernelSession = await loadKernelSession(fileId);
		showRestoreBanner = Boolean(
			(pyodideStatus !== 'ready' || Object.keys(sessionGlobals).length === 0) &&
				(kernelSession.pickleCheckpoint || kernelSession.journal.length > 0)
		);
	}

	/** @param {string} fileId */
	async function flushKernelToFile(fileId) {
		if (!fileId || !isPythonRuntimeReady()) return;
		try {
			const exported = await exportKernelCheckpoint();
			if (!exported.checkpoint) return;
			await saveKernelSession(fileId, { pickleCheckpoint: exported.checkpoint });
		} catch {
			/* ignore flush errors */
		}
	}

	/** @param {string} fileId */
	async function switchKernelToFile(fileId) {
		resetPythonRuntime();
		clearDynamicPythonCompletions();
		pyodideStatus = 'idle';
		sessionGlobals = {};
		sessionEnviron = {};
		lastRestoreNote = null;

		await reloadKernelSessionMeta(fileId);
		const session = kernelSession;
		if (!session?.pickleCheckpoint && !session?.journal.length) {
			showRestoreBanner = false;
			return;
		}

		if (session.pickleCheckpoint) {
			sessionLoading = true;
			running = true;
			pyodideStatus = 'loading';
			try {
				const result = await importKernelCheckpoint(session.pickleCheckpoint);
				pyodideStatus = 'ready';
				lastRestoreNote = `Loaded this notebook's session (${result.restored.length} names)`;
				showRestoreBanner = false;
				await refreshSessionInspector();
			} finally {
				running = false;
				sessionLoading = false;
			}
		} else {
			showRestoreBanner = true;
		}
	}

	async function selectFile(fileId, rawContent) {
		if (fileId !== activeFileId) {
			if (activeFileId) {
				await flushKernelToFile(activeFileId);
			}
			activeFileId = fileId;
			editorMode = 'notebook';
			notebook = parseNotebook(rawContent);
			cellOutputs = cellOutputsFromNotebook(notebook.cells);
			importSessionSourceId = '';
			const node = snapshot ? getNode(snapshot, fileId) : null;
			if (node?.parentId) currentDirId = node.parentId;
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(LAST_OPEN_FILE_KEY, fileId);
			}
			await switchKernelToFile(fileId);
		} else {
			editorMode = 'notebook';
			notebook = parseNotebook(rawContent);
			cellOutputs = cellOutputsFromNotebook(notebook.cells);
		}
		if (notebook) {
			syncNotebookCellsForAnalysis(fileId, notebook.cells);
			if (!activeCellId && notebook.cells[0]) {
				activeCellId = notebook.cells[0].id;
			}
		}
	}

	/** @param {'rail' | 'session'} pane @param {PointerEvent} event */
	function startPaneResize(pane, event) {
		if (event.button !== 0) return;
		if (typeof window !== 'undefined' && window.innerWidth <= 960) return;
		event.preventDefault();
		const handle = /** @type {HTMLElement} */ (event.currentTarget);
		handle.setPointerCapture(event.pointerId);
		handle.classList.add('nb-pane-splitter--active');
		document.body.classList.add('nb-resize-active');

		const startX = event.clientX;
		const startRail = railWidth;
		const startSession = sessionWidth;

		/** @param {PointerEvent} moveEvent */
		const onMove = (moveEvent) => {
			const dx = moveEvent.clientX - startX;
			if (pane === 'rail') {
				railWidth = clampPanelWidth(startRail + dx, RAIL_WIDTH_MIN, RAIL_WIDTH_MAX);
			} else {
				sessionWidth = clampPanelWidth(startSession + dx, SESSION_WIDTH_MIN, SESSION_WIDTH_MAX);
			}
		};

		/** @param {PointerEvent} endEvent */
		const onEnd = (endEvent) => {
			handle.releasePointerCapture(endEvent.pointerId);
			handle.classList.remove('nb-pane-splitter--active');
			document.body.classList.remove('nb-resize-active');
			handle.removeEventListener('pointermove', onMove);
			handle.removeEventListener('pointerup', onEnd);
			handle.removeEventListener('pointercancel', onEnd);
			savePanelLayout(railWidth, sessionWidth);
		};

		handle.addEventListener('pointermove', onMove);
		handle.addEventListener('pointerup', onEnd);
		handle.addEventListener('pointercancel', onEnd);
	}

	onMount(() => {
		mobileTab = loadMobileTab();
		if (typeof window === 'undefined') return;
		const mobileMq = window.matchMedia('(max-width: 640px)');
		const tabletMq = window.matchMedia('(min-width: 641px) and (max-width: 960px)');
		const syncShell = () => {
			useMobileShell = mobileMq.matches;
			useTabletShell = tabletMq.matches;
			if (!useMobileShell) sessionDrawerOpen = false;
		};
		syncShell();
		mobileMq.addEventListener('change', syncShell);
		tabletMq.addEventListener('change', syncShell);
		const unsubEditorKind = subscribeActiveEditorKind((kind) => {
			activeEditorKind = kind;
		});
		const detachViewport = attachVisualViewportKeyboardOffset((px) => {
			document.documentElement.style.setProperty('--keyboard-offset', `${px}px`);
		});
		return () => {
			mobileMq.removeEventListener('change', syncShell);
			tabletMq.removeEventListener('change', syncShell);
			unsubEditorKind();
			detachViewport();
		};
	});

	onMount(async () => {
		const layout = loadPanelLayout();
		railWidth = layout.rail;
		sessionWidth = layout.session;
		try {
			const hadPersisted = await hasPersistedWorkspace();
			const loaded = await loadSnapshot();
			const nodeCountBefore = loaded.nodes.length;
			const starter = ensureStarterNotebook(loaded);
			ensureStarterDataFiles(loaded);
			await saveSnapshot(loaded);
			const createdStarter = loaded.nodes.length > nodeCountBefore;
			if (createdStarter || !hadPersisted) {
				await saveSnapshot(loaded);
			}
			snapshot = bumpSnapshot(loaded);
			currentDirId =
				(typeof sessionStorage !== 'undefined' && sessionStorage.getItem(CURRENT_DIR_KEY)) ||
				loaded.rootId;

			const notebooks = loaded.nodes.filter(
				(n) => n.type === 'file' && isNotebookFileName(n.name)
			);
			const lastOpenId =
				typeof localStorage !== 'undefined'
					? localStorage.getItem(LAST_OPEN_FILE_KEY)
					: null;
			const preferred =
				notebooks.find((n) => n.id === lastOpenId) ?? starter ?? notebooks[0] ?? null;
			if (preferred) {
				await selectFile(preferred.id, preferred.content ?? '');
			}
			await refreshSavedSessionHints();
		} catch (error) {
			workspaceLoadError =
				error instanceof Error ? error.message : 'Could not load workspace from IndexedDB.';
			const empty = emptySnapshot();
			snapshot = bumpSnapshot(empty);
			const starter = ensureStarterNotebook(empty);
			ensureStarterDataFiles(empty);
			await saveSnapshot(empty);
			if (starter) {
				await selectFile(starter.id, starter.content ?? '');
			}
			currentDirId = empty.rootId;
		}
	});

	onMount(() => {
		themePreference = loadThemePreference();
		applyResolvedTheme(resolveTheme(themePreference));
		const unwatchTheme = watchSystemTheme(themePreference, (resolved) => {
			applyResolvedTheme(resolved);
			void import('$lib/editor/monacoSetup.js').then(({ ensureMonacoReady, applyMonacoThemeFromDocument }) =>
				ensureMonacoReady().then((m) => m && applyMonacoThemeFromDocument(m))
			);
		});
		return unwatchTheme;
	});

	onMount(() => {
		return attachNotebookKeymap({
			insertAbove: (kind = 'code') => {
				const index = activeCellIndex();
				if (!notebook?.cells.length) return;
				if (index < 0) void addCell(kind, -1);
				else void addCell(kind, index - 1);
			},
			insertBelow: (kind = 'code') => {
				const index = activeCellIndex();
				if (!notebook?.cells.length) return;
				if (index < 0) void addCell(kind, notebook.cells.length - 1);
				else void addCell(kind, index);
			},
			deleteCell: () => {
				const index = activeCellIndex();
				if (index >= 0) void deleteCell(index);
			},
			toMarkdown: () => {
				const index = activeCellIndex();
				if (index >= 0) void changeCellKind(index, 'markdown');
			},
			toCode: () => {
				const index = activeCellIndex();
				if (index >= 0) void changeCellKind(index, 'code');
			},
			focusPrev: () => {
				if (!notebook || !activeCellId) return;
				const prev = prevCellId(notebook.cells, activeCellId);
				if (prev) focusCell(prev);
			},
			focusNext: () => {
				if (!notebook || !activeCellId) return;
				const next = nextCellId(notebook.cells, activeCellId);
				if (next) focusCell(next);
			},
			copyCell: copyActiveCell,
			pasteBelow: () => void pasteCellBelowActive()
		});
	});

	async function persistNotebook() {
		if (!snapshot || !activeFileId || !notebook) return;
		const doc = applyCellOutputsToNotebook(notebook, cellOutputs);
		notebook = doc;
		writeFile(snapshot, activeFileId, serializeNotebook(doc));
		await saveSnapshot(snapshot);
		snapshot = bumpSnapshot(snapshot);
	}

	async function persistWorkspaceTree() {
		if (!snapshot) return;
		await saveSnapshot(snapshot);
		snapshot = bumpSnapshot(snapshot);
	}

	async function refreshCompletionIndex() {
		if (!isPythonRuntimeReady()) {
			clearDynamicPythonCompletions();
			return;
		}
		try {
			const snapshot = await inspectPythonCompletions();
			setDynamicPythonCompletions(snapshot);
		} catch {
			clearDynamicPythonCompletions();
		}
	}

	async function persistKernelCheckpoint() {
		if (!activeFileId) return;
		try {
			const exported = await exportKernelCheckpoint();
			if (!exported.checkpoint) return;
			await saveKernelSession(activeFileId, {
				pickleCheckpoint: exported.checkpoint,
				lastRestoreNote: `Checkpoint saved (${exported.variableCount} pickle-able names)`
			});
			lastRestoreNote = `Checkpoint saved (${exported.variableCount} pickle-able names)`;
			await reloadKernelSessionMeta(activeFileId);
		} catch {
			/* kernel may not be ready yet */
		}
	}

	async function saveCheckpointNow() {
		sessionLoading = true;
		await persistKernelCheckpoint();
		sessionLoading = false;
	}

	async function restoreCheckpointNow() {
		if (!kernelSession?.pickleCheckpoint) return;
		sessionLoading = true;
		running = true;
		pyodideStatus = 'loading';
		try {
			const result = await importKernelCheckpoint(kernelSession.pickleCheckpoint);
			const note = `Restored ${result.restored.length} name(s)${
				result.failed.length ? `; ${result.failed.length} failed` : ''
			}${result.error ? ` — ${result.error}` : ''}`;
			lastRestoreNote = note;
			await saveKernelSession(activeFileId, { lastRestoreNote: note });
			pyodideStatus = 'ready';
			showRestoreBanner = false;
			await reloadKernelSessionMeta(activeFileId);
			await refreshSessionInspector();
		} finally {
			running = false;
			sessionLoading = false;
		}
	}

	async function replayJournalNow() {
		if (!kernelSession?.journal.length) return;
		sessionLoading = true;
		running = true;
		pyodideStatus = 'loading';
		try {
			const stats = await replayKernelJournal(kernelSession.journal);
			const note = `Replayed journal: ${stats.ok} ok, ${stats.failed} failed`;
			lastRestoreNote = note;
			await saveKernelSession(activeFileId, { lastRestoreNote: note });
			pyodideStatus = 'ready';
			showRestoreBanner = false;
			await reloadKernelSessionMeta(activeFileId);
			await refreshSessionInspector();
		} finally {
			running = false;
			sessionLoading = false;
		}
	}

	async function clearSavedSession() {
		if (!activeFileId) return;
		await clearKernelSession(activeFileId);
		lastRestoreNote = 'Cleared saved session for this notebook';
		showRestoreBanner = false;
		await reloadKernelSessionMeta(activeFileId);
	}

	async function importVariablesFromNotebook(overwriteExisting = false) {
		if (!activeFileId || !importSessionSourceId || importSessionSourceId === activeFileId) {
			return;
		}
		const other = await loadKernelSession(importSessionSourceId);
		if (!other.pickleCheckpoint) {
			lastRestoreNote = 'That notebook has no saved checkpoint yet — run code there first.';
			return;
		}

		sessionLoading = true;
		running = true;
		pyodideStatus = 'loading';
		try {
			const result = await mergeKernelCheckpoint(other.pickleCheckpoint, overwriteExisting);
			const sourceName =
				files.find((file) => file.id === importSessionSourceId)?.name ?? 'other notebook';
			lastRestoreNote = `Imported ${result.restored.length} name(s) from ${sourceName}${
				result.skipped.length ? `; kept ${result.skipped.length} existing` : ''
			}${result.failed.length ? `; ${result.failed.length} failed` : ''}${
				result.error ? ` — ${result.error}` : ''
			}`;
			pyodideStatus = 'ready';
			await persistKernelCheckpoint();
			await refreshSessionInspector();
		} finally {
			running = false;
			sessionLoading = false;
		}
	}

	async function refreshSessionInspector() {
		if (typeof window === 'undefined') return;
		if (!isPythonRuntimeReady()) {
			sessionGlobals = {};
			sessionEnviron = {};
			return;
		}
		sessionLoading = true;
		try {
			const snap = await inspectPythonSession();
			sessionGlobals = snap.globals;
			sessionEnviron = snap.environ;
		} catch {
			sessionGlobals = {};
			sessionEnviron = {};
		} finally {
			sessionLoading = false;
		}

		await refreshCompletionIndex();
	}

	async function restartKernel() {
		kernelRestarting = true;
		resetPythonRuntime();
		clearDynamicPythonCompletions();
		pyodideStatus = 'idle';
		cellOutputs = {};
		sessionGlobals = {};
		sessionEnviron = {};
		runningCellId = null;
		if (notebook) {
			notebook = applyCellOutputsToNotebook(notebook, {});
			await persistNotebook();
		}
		kernelRestarting = false;
	}

	async function clearAllOutputs() {
		cellOutputs = {};
		if (notebook) {
			notebook = applyCellOutputsToNotebook(notebook, {});
			await persistNotebook();
		}
	}

	async function trustNotebook() {
		if (!notebook) return;
		notebook = {
			...notebook,
			metadata: { ...notebook.metadata, trusted: true }
		};
		await persistNotebook();
	}

	async function toggleFullWidth() {
		if (!notebook) return;
		const next = !notebook.metadata?.fullWidth;
		notebook = {
			...notebook,
			metadata: { ...notebook.metadata, fullWidth: next }
		};
		await persistNotebook();
	}

	async function runCell(cellId) {
		const cell = notebook?.cells.find((item) => item.id === cellId);
		if (!cell || cell.kind !== 'code') return;

		running = true;
		runningCellId = cellId;
		pyodideStatus = 'loading';
		const startedAt = Date.now();
		const timerStart = performance.now();
		const result = await runPythonSource(
			cell.source,
			snapshot ? workspaceFilesForKernel(snapshot) : {}
		);
		const durationMs = performance.now() - timerStart;
		const finishedAt = Date.now();
		pyodideStatus = 'ready';
		running = false;
		runningCellId = null;

		const previousCount = cellOutputs[cellId]?.executionCount ?? 0;
		const textOutput =
			[result.stdout, result.stderr, result.error].filter(Boolean).join('\n') ||
			(result.ok && (result.figures?.length ?? 0) > 0 ? '' : result.ok ? '—' : 'Execution failed.');

		cellOutputs = {
			...cellOutputs,
			[cellId]: {
				ok: result.ok,
				text: textOutput,
				stdout: result.stdout,
				stderr: result.stderr,
				html: [],
				figures: result.figures ?? [],
				startedAt,
				finishedAt,
				durationMs,
				executionCount: previousCount + 1
			}
		};

		if (result.ok) {
			await appendKernelJournalEntry(activeFileId, cell.source);
			await persistKernelCheckpoint();
			await reloadKernelSessionMeta();
		}

		await refreshSessionInspector();
		await persistNotebook();
	}

	/** @param {string} cellId */
	async function runCellAndAdvance(cellId) {
		await runCell(cellId);
		if (!notebook) return;
		const next = nextCellId(notebook.cells, cellId);
		if (next) focusCell(next);
	}

	/**
	 * @param {'code' | 'markdown' | 'raw'} kind
	 * @param {number} [afterIndex]
	 */
	async function addCell(kind, afterIndex = notebook ? notebook.cells.length - 1 : 0) {
		if (!notebook) return;
		const cell = {
			id: randomId(),
			kind,
			source:
				kind === 'markdown'
					? '## Notes\n\n'
					: kind === 'raw'
						? ''
						: ''
		};
		const insertAt = Math.min(Math.max(afterIndex, -1) + 1, notebook.cells.length);
		notebook.cells.splice(insertAt, 0, cell);
		notebook = { ...notebook, cells: [...notebook.cells] };
		await persistNotebook();
	}

	async function runAllCells() {
		if (!notebook || running) return;
		for (const cell of notebook.cells) {
			if (cell.kind !== 'code') continue;
			await runCell(cell.id);
		}
	}

	async function interruptKernel() {
		interruptPythonRun();
		running = false;
		runningCellId = null;
		pyodideStatus = 'idle';
	}

	/** @param {number} index */
	async function duplicateCell(index) {
		if (!notebook) return;
		const src = notebook.cells[index];
		const copy = {
			id: randomId(),
			kind: src.kind,
			source: src.source,
			...(src.metadata ? { metadata: { ...src.metadata } } : {})
		};
		notebook.cells.splice(index + 1, 0, copy);
		notebook = { ...notebook, cells: [...notebook.cells] };
		await persistNotebook();
	}

	/** @param {number} index */
	async function deleteCell(index) {
		if (!notebook || notebook.cells.length <= 1) return;
		const removed = notebook.cells[index];
		notebook.cells.splice(index, 1);
		notebook = { ...notebook, cells: [...notebook.cells] };
		if (removed?.id && cellOutputs[removed.id]) {
			const { [removed.id]: _, ...rest } = cellOutputs;
			cellOutputs = rest;
		}
		await persistNotebook();
	}

	/** @param {number} index @param {-1 | 1} direction */
	async function moveCell(index, direction) {
		if (!notebook) return;
		const target = index + direction;
		if (target < 0 || target >= notebook.cells.length) return;
		const cells = [...notebook.cells];
		const [item] = cells.splice(index, 1);
		cells.splice(target, 0, item);
		notebook = { ...notebook, cells };
		await persistNotebook();
	}

	function activeCellIndex() {
		if (!notebook || !activeCellId) return -1;
		return cellIndexById(notebook.cells, activeCellId);
	}

	/** @param {string} cellId */
	function focusCell(cellId) {
		activeCellId = cellId;
		document.getElementById(`nb-cell-${cellId}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
		requestAnimationFrame(() => focusNotebookCellEditor(cellId));
	}

	/** @param {string} cellId */
	async function clearCellOutput(cellId) {
		if (!cellOutputs[cellId]) return;
		const { [cellId]: _, ...rest } = cellOutputs;
		cellOutputs = rest;
		if (notebook) {
			notebook = applyCellOutputsToNotebook(notebook, cellOutputs);
			await persistNotebook();
		}
	}

	/**
	 * @param {number} index
	 * @param {'code' | 'markdown' | 'raw'} kind
	 */
	async function changeCellKind(index, kind) {
		if (!notebook) return;
		const cell = notebook.cells[index];
		if (!cell || cell.kind === kind) return;
		notebook.cells[index] = { ...cell, kind };
		notebook = { ...notebook, cells: [...notebook.cells] };
		if (kind === 'markdown') {
			setMarkdownMode(cell.id, 'preview');
		}
		await persistNotebook();
	}

	/** @param {string} cellId */
	async function runCellAndInsertBelow(cellId) {
		const index = cellIndexById(notebook?.cells ?? [], cellId);
		await runCell(cellId);
		if (!notebook || index < 0) return;
		await addCell('code', index);
		const inserted = notebook.cells[index + 1];
		if (inserted) focusCell(inserted.id);
	}

	/** @param {string} cellId */
	async function runCellAndAllBelow(cellId) {
		if (!notebook || running) return;
		const start = cellIndexById(notebook.cells, cellId);
		if (start < 0) return;
		for (let i = start; i < notebook.cells.length; i++) {
			const cell = notebook.cells[i];
			if (cell.kind === 'code') await runCell(cell.id);
		}
	}

	/** @param {string} cellId */
	async function runNextCodeCellBelow(cellId) {
		if (!notebook || running) return;
		const index = cellIndexById(notebook.cells, cellId);
		for (let i = index + 1; i < notebook.cells.length; i++) {
			const cell = notebook.cells[i];
			if (cell.kind === 'code') {
				await runCell(cell.id);
				return;
			}
		}
	}

	function copyActiveCell() {
		const index = activeCellIndex();
		if (!notebook || index < 0) return;
		const cell = notebook.cells[index];
		cellClipboard = {
			kind: cell.kind,
			source: cell.source,
			...(cell.metadata ? { metadata: { ...cell.metadata } } : {})
		};
	}

	async function pasteCellBelowActive() {
		const index = activeCellIndex();
		if (!notebook || index < 0 || !cellClipboard) return;
		const cell = {
			id: randomId(),
			kind: cellClipboard.kind,
			source: cellClipboard.source,
			...(cellClipboard.metadata ? { metadata: { ...cellClipboard.metadata } } : {})
		};
		notebook.cells.splice(index + 1, 0, cell);
		notebook = { ...notebook, cells: [...notebook.cells] };
		await persistNotebook();
		focusCell(cell.id);
	}

	async function refreshSavedSessionHints() {
		if (!snapshot) return;
		/** @type {Record<string, boolean>} */
		const hints = {};
		for (const node of snapshot.nodes) {
			if (node.type !== 'file' || !isNotebookFileName(node.name)) continue;
			const session = await loadKernelSession(node.id);
			hints[node.id] = Boolean(session.pickleCheckpoint || session.journal.length);
		}
		savedSessionFiles = hints;
	}

	function runningForFile(fileId) {
		if (activeFileId === fileId && (pyodideStatus === 'ready' || running || pyodideStatus === 'loading')) {
			return 'active';
		}
		if (savedSessionFiles[fileId]) return 'saved';
		return null;
	}

	async function persistVfs() {
		if (!snapshot) return;
		await saveSnapshot(snapshot);
		snapshot = bumpSnapshot(snapshot);
		await refreshSavedSessionHints();
	}

	/** @param {import('$lib/vfs/types.js').VfsNode} node */
	function openVfsNode(node) {
		if (node.type === 'directory') {
			currentDirId = node.id;
			if (typeof sessionStorage !== 'undefined') {
				sessionStorage.setItem(CURRENT_DIR_KEY, node.id);
			}
			return;
		}
		if (useMobileShell) {
			mobileTab = 'notebook';
			saveMobileTab('notebook');
		}
		if (isNotebookFileName(node.name)) {
			void selectFile(node.id, node.content ?? '');
			return;
		}
		activeFileId = node.id;
		editorMode = 'text';
		textFileSource = node.content ?? '';
		notebook = null;
	}

	function closeTextEditor() {
		editorMode = 'notebook';
		const nb = snapshot ? findOpenNotebookNode() : null;
		if (nb) void selectFile(nb.id, nb.content ?? '');
	}

	/** @returns {import('$lib/vfs/types.js').VfsNode | null} */
	function findOpenNotebookNode() {
		if (!snapshot) return null;
		if (activeFileId && editorMode === 'notebook') {
			return getNode(snapshot, activeFileId);
		}
		return snapshot.nodes.find(
			(n) => n.type === 'file' && isNotebookFileName(n.name) && n.id === activeFileId
		) ?? findAnyNotebookNode();
	}

	function findAnyNotebookNode() {
		if (!snapshot) return null;
		const nodes = snapshot.nodes.filter((n) => n.type === 'file' && isNotebookFileName(n.name));
		return nodes[0] ?? null;
	}

	async function saveTextFileContent() {
		if (!snapshot || !activeFileId || editorMode !== 'text') return;
		writeFile(snapshot, activeFileId, textFileSource);
		await persistVfs();
	}

	async function handleNewNotebookInDir() {
		if (!snapshot) return;
		const parentId = currentDirId || snapshot.rootId;
		const file = createNode(
			snapshot,
			parentId,
			`untitled-${randomId().slice(0, 6)}.ipynb.json`,
			'file',
			serializeNotebook({
				version: 1,
				cells: [
					{ id: randomId(), kind: 'markdown', source: '# New notebook\n\n' },
					{ id: randomId(), kind: 'code', source: 'print("Hello from Pyodide")\n' }
				]
			})
		);
		await persistVfs();
		await selectFile(file.id, file.content ?? '');
	}

	async function handleNewFolder() {
		if (!snapshot) return;
		const name = window.prompt('Folder name', 'newfolder');
		if (!name) return;
		mkdir(snapshot, currentDirId || snapshot.rootId, name);
		await persistVfs();
	}

	/** @param {FileList} fileList */
	async function handleUpload(fileList) {
		if (!snapshot) return;
		const parentId = currentDirId || snapshot.rootId;
		for (const file of fileList) {
			const text = await file.text();
			const safe = file.name.replace(/[^\w.\-]+/g, '-');
			try {
				createNode(snapshot, parentId, safe, 'file', text);
			} catch {
				createNode(snapshot, parentId, `${randomId().slice(0, 4)}-${safe}`, 'file', text);
			}
		}
		await persistVfs();
	}

	/** @param {string} nodeId @param {string} name */
	async function handleRenameNode(nodeId, name) {
		if (!snapshot) return;
		rename(snapshot, nodeId, name);
		await persistVfs();
	}

	/** @param {string} nodeId */
	async function handleDeleteNode(nodeId) {
		if (!snapshot) return;
		const node = getNode(snapshot, nodeId);
		if (!node) return;
		if (!window.confirm(`Delete ${node.name}?`)) return;
		if (isNotebookFileName(node.name)) {
			await clearKernelSession(nodeId);
		}
		try {
			unlink(snapshot, nodeId, { recursive: true });
		} catch (error) {
			window.alert(error instanceof Error ? error.message : 'Delete failed.');
			return;
		}
		if (activeFileId === nodeId) {
			activeFileId = '';
			notebook = null;
			editorMode = 'notebook';
		}
		await persistVfs();
		const fallback = findAnyNotebookNode();
		if (fallback) await selectFile(fallback.id, fallback.content ?? '');
	}

	/** @param {string} nodeId */
	async function handleDuplicateNode(nodeId) {
		if (!snapshot) return;
		duplicateFile(snapshot, nodeId);
		await persistVfs();
	}

	/** @param {string} nodeId */
	function handleDownloadNode(nodeId) {
		if (!snapshot) return;
		const node = getNode(snapshot, nodeId);
		if (!node || node.type !== 'file') return;
		downloadTextFile(node.name, node.content ?? '');
	}

	function exportWorkspaceBundle() {
		if (!snapshot) return;
		downloadTextFile('workspace.bundle.json', serializeWorkspaceBundle(snapshot));
	}

	function triggerWorkspaceImport() {
		workspaceImportInput?.click();
	}

	/** @param {Event} event */
	async function handleWorkspaceImport(event) {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		const parsed = parseWorkspaceBundle(await file.text());
		if (!parsed) {
			window.alert('Invalid workspace bundle.');
			return;
		}
		if (!window.confirm('Replace entire workspace with imported bundle?')) return;
		snapshot = bumpSnapshot(parsed);
		await persistVfs();
		currentDirId = snapshot.rootId;
		const nb = findAnyNotebookNode();
		if (nb) await selectFile(nb.id, nb.content ?? '');
	}

	function setThemePreference(/** @type {import('$lib/theme/themePreference.js').ThemePreference} */ next) {
		themePreference = next;
		saveThemePreference(next);
		const resolved = resolveTheme(next);
		applyResolvedTheme(resolved);
		void (async () => {
			const { ensureMonacoReady, applyMonacoThemeFromDocument } = await import(
				'$lib/editor/monacoSetup.js'
			);
			const monaco = await ensureMonacoReady();
			if (monaco) applyMonacoThemeFromDocument(monaco);
		})();
	}

	async function addNotebook() {
		await handleNewNotebookInDir();
	}

	function triggerImport() {
		importInput?.click();
	}

	/** @param {Event} event */
	async function handleImportFile(event) {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		const file = input.files?.[0];
		input.value = '';
		if (!file || !snapshot) return;

		const raw = await file.text();
		const imported = parseImportedNotebook(raw);
		if (!imported || imported.cells.length === 0) {
			window.alert('Could not import notebook — expected .ipynb or .ipynb.json format.');
			return;
		}

		const safeName = file.name.replace(/[^\w.\-]+/g, '-').replace(/-+/g, '-');
		const node = createNode(
			snapshot,
			currentDirId || snapshot.rootId,
			safeName.endsWith('.json') ? safeName : `${safeName.replace(/\.ipynb$/i, '')}.ipynb.json`,
			'file',
			serializeNotebook(imported)
		);
		await persistVfs();
		await selectFile(node.id, node.content ?? '');
	}

	function exportNotebookJson() {
		if (!notebook) return;
		const base = activeName.replace(/\.ipynb\.json$/i, '');
		downloadTextFile(`${base}.ipynb.json`, serializeNotebook(notebook));
	}

	function exportNotebookJupyter() {
		if (!notebook) return;
		const base = activeName.replace(/\.ipynb\.json$/i, '').replace(/\.ipynb$/i, '');
		const jupyter = toJupyterNotebook(notebook);
		downloadTextFile(`${base}.ipynb`, JSON.stringify(jupyter, null, 2));
	}

	const files = $derived.by(() => {
		if (!snapshot) return [];
		return snapshot.nodes.filter((n) => n.type === 'file' && isNotebookFileName(n.name));
	});

	const activeName = $derived.by(() => {
		if (!snapshot) return 'notebook';
		if (activeFileId) {
			const node = snapshot.nodes.find((n) => n.id === activeFileId);
			if (node) {
				return node.name.endsWith('.ipynb.json')
					? node.name.replace(/\.ipynb\.json$/, '.ipynb')
					: node.name;
			}
		}
		return 'notebook';
	});

	const otherSessionSources = $derived.by(() => files.filter((file) => file.id !== activeFileId));

	const kernelLabel = $derived.by(() => {
		if (kernelRestarting) return 'Restarting kernel…';
		if (pyodideStatus === 'loading') return 'Starting kernel…';
		if (running) return 'Kernel busy…';
		if (pyodideStatus === 'ready') return 'Python · Pyodide';
		return 'Python · Pyodide (cold)';
	});

	const kernelDotClass = $derived.by(() => {
		if (kernelRestarting) return 'nb-kernel__dot nb-kernel__dot--busy';
		if (pyodideStatus === 'loading' || running) return 'nb-kernel__dot nb-kernel__dot--busy';
		if (pyodideStatus === 'ready') return 'nb-kernel__dot nb-kernel__dot--ready';
		return 'nb-kernel__dot';
	});

	const notebookTrusted = $derived.by(() => notebook?.metadata?.trusted !== false);
	const fullWidthNotebook = $derived.by(() => notebook?.metadata?.fullWidth === true);

	const runningCellLabel = $derived.by(() => {
		if (!runningCellId || !notebook) return null;
		const index = notebook.cells.findIndex((c) => c.id === runningCellId);
		return index >= 0 ? `Cell ${index + 1}` : null;
	});

	/** @param {string} cellId @param {'edit' | 'preview'} mode */
	function setMarkdownMode(cellId, mode) {
		markdownModes = { ...markdownModes, [cellId]: mode };
	}

	/** @param {string} cellId */
	function toggleCellCollapsed(cellId) {
		collapsedCells = { ...collapsedCells, [cellId]: !collapsedCells[cellId] };
	}

	const tocEntries = $derived.by(() =>
		notebook ? tableOfContentsFromNotebook(notebook.cells) : []
	);

	/** @param {import('$lib/layout/mobileTabs.js').MobileTab} tab */
	function selectMobileTab(tab) {
		mobileTab = tab;
		saveMobileTab(tab);
	}

	const showCodeAccessoryBar = $derived.by(() => {
		if (!shouldShowCodeAccessory(activeEditorKind)) return false;
		if (useMobileShell && mobileTab !== 'notebook') return false;
		return editorMode === 'notebook' || editorMode === 'text';
	});

	function handleAccessoryInsert(text, selectionOffset = 0) {
		void insertIntoActiveEditor(text, selectionOffset);
	}

	function handleAccessoryRun() {
		if (activeCellId) void runCell(activeCellId);
	}

	function handleAccessoryRunAdvance() {
		if (activeCellId) void runCellAndAdvance(activeCellId);
	}
</script>

<input
	bind:this={importInput}
	type="file"
	accept=".ipynb,.json,application/json"
	class="nb-sr-only"
	onchange={handleImportFile}
/>
<input
	bind:this={workspaceImportInput}
	type="file"
	accept=".json,application/json"
	class="nb-sr-only"
	onchange={handleWorkspaceImport}
/>

{#if !snapshot}
	<p class="nb-loading">mounting workspace…</p>
{:else}
	<div
		class="nb-app"
		class:nb-shell--mobile={useMobileShell}
		class:nb-shell--tablet={useTabletShell}
		class:nb-shell--tab-notebook={useMobileShell && mobileTab === 'notebook'}
		class:nb-shell--tab-files={useMobileShell && mobileTab === 'files'}
	>
		<header class="nb-topbar">
			<div class="nb-topbar__brand">
				<span class="nb-topbar__title">{activeName}</span>
				<span class="nb-topbar__path">~/workspace</span>
			</div>
			{#if useTabletShell}
				<button
					type="button"
					class="nb-toolbar-btn nb-topbar__session-btn"
					class:nb-toolbar-btn--active={sessionDrawerOpen}
					onclick={() => (sessionDrawerOpen = !sessionDrawerOpen)}
				>
					Session
				</button>
			{/if}
			<div class="nb-topbar__actions nb-notebook-toolbar">
				<div class="nb-notebook-toolbar__primary">
					<button type="button" class="nb-toolbar-btn" onclick={() => addCell('code')}>+ Code</button>
					<button type="button" class="nb-toolbar-btn" onclick={() => addCell('markdown')}>+ Markdown</button>
					<button type="button" class="nb-toolbar-btn" onclick={() => runAllCells()} disabled={running}>
						Run All
					</button>
					<button type="button" class="nb-toolbar-btn" onclick={() => clearAllOutputs()} disabled={running}>
						Clear All Outputs
					</button>
					<button
						type="button"
						class="nb-toolbar-btn"
						class:nb-toolbar-btn--active={showToc}
						onclick={() => (showToc = !showToc)}
					>
						Outline
					</button>
				</div>
				<details class="nb-notebook-menu" bind:open={showNotebookMenu}>
					<summary class="nb-toolbar-btn nb-notebook-menu__trigger">⋯</summary>
					<div class="nb-notebook-menu__panel">
						<button type="button" onclick={() => addCell('raw')}>+ Raw cell</button>
						<button type="button" onclick={() => interruptKernel()} disabled={!running}>Interrupt</button>
						<button type="button" onclick={triggerImport}>Import .ipynb</button>
						<button type="button" onclick={exportNotebookJson}>Export JSON</button>
						<button type="button" onclick={exportNotebookJupyter}>Export .ipynb</button>
						<button type="button" onclick={() => toggleFullWidth()}>
							{fullWidthNotebook ? 'Standard width' : 'Full width'}
						</button>
						<hr class="nb-menu-divider" />
						<span class="nb-menu-label">Theme</span>
						<button type="button" class:nb-menu-active={themePreference === 'dark'} onclick={() => setThemePreference('dark')}>Dark</button>
						<button type="button" class:nb-menu-active={themePreference === 'light'} onclick={() => setThemePreference('light')}>Light</button>
						<button type="button" class:nb-menu-active={themePreference === 'system'} onclick={() => setThemePreference('system')}>System</button>
						<hr class="nb-menu-divider" />
						<button type="button" onclick={exportWorkspaceBundle}>Export workspace</button>
						<button type="button" onclick={triggerWorkspaceImport}>Import workspace</button>
					</div>
				</details>
			</div>
			<div class="nb-kernel nb-kernel-picker" title="In-browser Pyodide kernel (WebAssembly)">
				<span class={kernelDotClass} aria-hidden="true"></span>
				<details class="nb-kernel-menu">
					<summary>{kernelLabel}</summary>
					<div class="nb-kernel-menu__panel">
						<button type="button" disabled={running} onclick={() => restartKernel()}>Restart kernel</button>
						<button type="button" disabled={!running} onclick={() => interruptKernel()}>Interrupt</button>
					</div>
				</details>
			</div>
		</header>

		{#if workspaceLoadError}
			<div class="nb-restore-banner" role="alert">
				<strong>Workspace storage error</strong>
				<span>{workspaceLoadError} Imported notebooks use IndexedDB on this origin only.</span>
			</div>
		{/if}

		<div
			class="nb-body"
			class:nb-body--mobile={useMobileShell}
			style="--rail-width: {railWidth}px; --session-width: {sessionWidth}px"
		>
			<aside
				class="nb-rail"
				class:nb-mobile-pane--active={!useMobileShell || mobileTab === 'files'}
				aria-label="Workspace files"
			>
				<div class="nb-rail__tabs" role="tablist">
					<button
						type="button"
						role="tab"
						aria-selected={railTab === 'files'}
						class:nb-rail__tab--active={railTab === 'files'}
						onclick={() => (railTab = 'files')}
					>
						Files
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={railTab === 'running'}
						class:nb-rail__tab--active={railTab === 'running'}
						onclick={() => (railTab = 'running')}
					>
						Running
					</button>
				</div>
				{#if railTab === 'files' && snapshot}
				<FileBrowser
					{snapshot}
					currentDirId={currentDirId || snapshot.rootId}
					{activeFileId}
					runningForFile={runningForFile}
					onnavigate={(dirId) => {
						currentDirId = dirId;
						if (typeof sessionStorage !== 'undefined') {
							sessionStorage.setItem(CURRENT_DIR_KEY, dirId);
						}
					}}
					onopen={openVfsNode}
					onnewnotebook={() => void handleNewNotebookInDir()}
					onnewfolder={() => void handleNewFolder()}
					onupload={(files) => void handleUpload(files)}
					onrefresh={() => void refreshSavedSessionHints()}
					onrename={(id, name) => void handleRenameNode(id, name)}
					ondelete={(id) => void handleDeleteNode(id)}
					onduplicate={(id) => void handleDuplicateNode(id)}
					ondownload={handleDownloadNode}
				/>
				{:else if railTab === 'files'}
				<p class="nb-rail__hint">Loading workspace…</p>
				{:else}
				<div class="nb-rail__head">
					<p class="nb-rail__label">running</p>
					<p class="nb-rail__hint">Kernel activity in this tab.</p>
				</div>
				<ul class="nb-running-list">
					<li>
						<span class="nb-running-list__status">{kernelLabel}</span>
					</li>
					{#if runningCellLabel}
						<li>Executing {runningCellLabel}</li>
					{:else if pyodideStatus === 'ready'}
						<li class="nb-running-list__idle">No cells running</li>
					{/if}
				</ul>
				{/if}
			</aside>

			<button
				type="button"
				class="nb-pane-splitter"
				aria-label="Resize file sidebar"
				onpointerdown={(event) => startPaneResize('rail', event)}
			></button>

			<div
				class="nb-canvas"
				class:nb-mobile-pane--active={!useMobileShell || mobileTab === 'notebook'}
			>
				{#if editorMode === 'text' && snapshot}
					{@const textNode = getNode(snapshot, activeFileId)}
					<TextFileEditor
						editorId={activeFileId || 'textfile'}
						fileName={textNode?.name ?? 'file'}
						bind:value={textFileSource}
						onchange={() => void saveTextFileContent()}
						onclose={closeTextEditor}
					/>
				{:else if notebook}
				{#if !notebookTrusted}
					<div class="nb-restore-banner nb-restore-banner--trust" role="status">
						<strong>Not trusted</strong>
						<span>Imported notebooks stay in sandboxed markdown until you trust this file.</span>
						<button type="button" class="nb-chip" onclick={() => trustNotebook()}>Trust notebook</button>
					</div>
				{/if}
				{#if showRestoreBanner && kernelSession}
					<div class="nb-restore-banner" role="status" aria-live="polite">
						<strong>Saved kernel session</strong>
						<span>
							After reload, restore pickle-able globals or replay
							{kernelSession.journal.length} journaled run(s).
						</span>
						<button
							type="button"
							class="nb-chip"
							disabled={running || sessionLoading || !kernelSession.pickleCheckpoint}
							onclick={() => restoreCheckpointNow()}
						>
							Restore checkpoint
						</button>
						<button
							type="button"
							class="nb-chip"
							disabled={running || sessionLoading || kernelSession.journal.length === 0}
							onclick={() => replayJournalNow()}
						>
							Replay journal
						</button>
						<button
							type="button"
							class="nb-chip"
							disabled={running || sessionLoading}
							onclick={() => (showRestoreBanner = false)}
						>
							Dismiss
						</button>
					</div>
				{/if}
				<div class="nb-canvas__inner" class:nb-canvas__inner--full={fullWidthNotebook}>
					{#if showToc && tocEntries.length > 0}
						<nav class="nb-toc" aria-label="Outline">
							<p class="nb-toc__title">Outline</p>
							<ol>
								{#each tocEntries as entry (entry.cellId + entry.title)}
									<li class="nb-toc__level-{entry.level}">
										<button
											type="button"
											onclick={() =>
												document
													.getElementById(`nb-cell-${entry.cellId}`)
													?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
										>
											{entry.title}
										</button>
									</li>
								{/each}
							</ol>
						</nav>
					{/if}
					{#each notebook.cells as cell, i (cell.id)}
						<div class="nb-cell-stack" id="nb-cell-{cell.id}">
							<NotebookCellChrome
								index={i}
								kind={cell.kind}
								focused={activeCellId === cell.id}
								collapsed={Boolean(collapsedCells[cell.id])}
								running={running}
								canDelete={notebook.cells.length > 1}
								canMoveUp={i > 0}
								canMoveDown={i < notebook.cells.length - 1}
								markdownMode={markdownModes[cell.id] ?? 'preview'}
								onfocus={() => (activeCellId = cell.id)}
								ontogglecollapse={() => toggleCellCollapsed(cell.id)}
								onrun={() => runCell(cell.id)}
								onrunadvance={() => runCellAndAdvance(cell.id)}
								onrunbelow={() => runNextCodeCellBelow(cell.id)}
								onclearoutput={() => clearCellOutput(cell.id)}
								onchangecode={() => changeCellKind(i, 'code')}
								onchangemarkdown={() => changeCellKind(i, 'markdown')}
								onrunallbelow={() => runCellAndAllBelow(cell.id)}
								ondelete={() => deleteCell(i)}
								onduplicate={() => duplicateCell(i)}
								onmoveup={() => moveCell(i, -1)}
								onmovedown={() => moveCell(i, 1)}
								oninsertcode={() => addCell('code', i - 1)}
								oninsertmarkdown={() => addCell('markdown', i - 1)}
								onmarkdownmode={(mode) => setMarkdownMode(cell.id, mode)}
							>
								{#snippet children()}
									{#if cell.kind === 'markdown'}
										<MarkdownCell
											cellId={cell.id}
											bind:value={cell.source}
											mode={markdownModes[cell.id] ?? 'preview'}
											label="Markdown cell {i + 1}"
											onchange={persistNotebook}
										/>
									{:else if cell.kind === 'raw'}
										<RawCell
											bind:value={cell.source}
											label="Raw cell {i + 1}"
											onchange={persistNotebook}
										/>
									{:else}
										<MonacoCodeCell
											cellId={cell.id}
											bind:value={cell.source}
											disabled={running}
											label="Code cell {i + 1}"
											onchange={persistNotebook}
											onrun={() => runCell(cell.id)}
											onrunadvance={() => runCellAndAdvance(cell.id)}
											onruninsertbelow={() => runCellAndInsertBelow(cell.id)}
											onfocus={() => (activeCellId = cell.id)}
										/>
										{#if cellOutputs[cell.id]}
											<div class="nb-run-meta" aria-live="polite">
												<span class="nb-run-meta__count">In [{cellOutputs[cell.id].executionCount}]</span>
												<span
													class="nb-run-meta__time"
													title="Started {formatRunTimestamp(cellOutputs[cell.id].startedAt)}"
												>
													{formatRunTimestamp(cellOutputs[cell.id].finishedAt)}
												</span>
												<span class="nb-run-meta__duration">{formatDuration(cellOutputs[cell.id].durationMs)}</span>
											</div>
											{#if cellOutputs[cell.id].figures?.length}
												<div class="nb-figure-output" aria-label="Figure output">
													{#each cellOutputs[cell.id].figures as figure, fi (fi)}
														<img
															src="data:image/png;base64,{figure}"
															alt="Matplotlib figure {fi + 1}"
															loading="lazy"
														/>
													{/each}
												</div>
											{/if}
											{#if notebookTrusted && cellOutputs[cell.id].html?.length}
												{#each cellOutputs[cell.id].html as fragment, hi (hi)}
													<div class="nb-html-output">
														{@html sanitizeTrustedHtml(fragment)}
													</div>
												{/each}
											{/if}
											{#if cellOutputs[cell.id].text}
												<pre
													class="nb-output"
													class:nb-output--err={!cellOutputs[cell.id].ok}
													class:nb-output--scroll={shouldScrollOutput(
														cellOutputs[cell.id].text,
														cell.metadata?.scrolled
													)}
												>{cellOutputs[cell.id].text}</pre>
											{/if}
										{/if}
									{/if}
								{/snippet}
							</NotebookCellChrome>
						</div>
					{/each}
				</div>
				{:else}
					<p class="nb-loading">Open a notebook from the file browser.</p>
				{/if}
			</div>

			<button
				type="button"
				class="nb-pane-splitter nb-pane-splitter--session"
				aria-label="Resize session panel"
				onpointerdown={(event) => startPaneResize('session', event)}
			></button>

			<SessionPanel
				mobilePaneActive={!useMobileShell || mobileTab === 'session'}
				drawerOpen={useTabletShell && sessionDrawerOpen}
				globals={sessionGlobals}
				environ={sessionEnviron}
				loading={sessionLoading || running}
				kernelReady={pyodideStatus === 'ready'}
				journalCount={kernelSession?.journal.length ?? 0}
				hasCheckpoint={Boolean(kernelSession?.pickleCheckpoint)}
				lastRestoreNote={lastRestoreNote}
				otherNotebooks={otherSessionSources}
				importSourceId={importSessionSourceId}
				onimportsourcechange={(id) => (importSessionSourceId = id)}
				onimportvariables={() => importVariablesFromNotebook(false)}
				onimportvariablesoverwrite={() => importVariablesFromNotebook(true)}
				onrefresh={refreshSessionInspector}
				onrestart={restartKernel}
				onsavecheckpoint={saveCheckpointNow}
				onrestorecheckpoint={restoreCheckpointNow}
				onreplayjournal={replayJournalNow}
				onclearsession={clearSavedSession}
			/>
			{#if useTabletShell && sessionDrawerOpen}
				<button
					type="button"
					class="nb-session-drawer-backdrop"
					aria-label="Close session panel"
					onclick={() => (sessionDrawerOpen = false)}
				></button>
			{/if}

			<div
				class="nb-mobile-more"
				class:nb-mobile-pane--active={useMobileShell && mobileTab === 'more'}
				aria-label="More workspace options"
			>
				<p class="nb-mobile-more__title">Workspace</p>
				<button type="button" class="nb-toolbar-btn" onclick={() => addCell('raw')}>+ Raw cell</button>
				<button type="button" class="nb-toolbar-btn" onclick={() => interruptKernel()} disabled={!running}>
					Interrupt
				</button>
				<button type="button" class="nb-toolbar-btn" onclick={triggerImport}>Import .ipynb</button>
				<button type="button" class="nb-toolbar-btn" onclick={exportNotebookJson}>Export JSON</button>
				<button type="button" class="nb-toolbar-btn" onclick={exportNotebookJupyter}>Export .ipynb</button>
				<button type="button" class="nb-toolbar-btn" onclick={() => toggleFullWidth()}>
					{fullWidthNotebook ? 'Standard width' : 'Full width'}
				</button>
				<button
					type="button"
					class="nb-toolbar-btn"
					class:nb-toolbar-btn--active={showToc}
					onclick={() => (showToc = !showToc)}
				>
					Outline
				</button>
				<p class="nb-mobile-more__title">Theme</p>
				<button type="button" class="nb-toolbar-btn" class:nb-toolbar-btn--active={themePreference === 'dark'} onclick={() => setThemePreference('dark')}>Dark</button>
				<button type="button" class="nb-toolbar-btn" class:nb-toolbar-btn--active={themePreference === 'light'} onclick={() => setThemePreference('light')}>Light</button>
				<button type="button" class="nb-toolbar-btn" class:nb-toolbar-btn--active={themePreference === 'system'} onclick={() => setThemePreference('system')}>System</button>
				<p class="nb-mobile-more__title">Bundle</p>
				<button type="button" class="nb-toolbar-btn" onclick={exportWorkspaceBundle}>Export workspace</button>
				<button type="button" class="nb-toolbar-btn" onclick={triggerWorkspaceImport}>Import workspace</button>
			</div>
		</div>

		<MobileCodeAccessory
			visible={showCodeAccessoryBar}
			disabled={running}
			oninsert={handleAccessoryInsert}
			onrun={handleAccessoryRun}
			onrunadvance={handleAccessoryRunAdvance}
		/>
		{#if useMobileShell}
			<MobileBottomNav
				active={mobileTab}
				kernelBusy={running || pyodideStatus === 'loading'}
				onselect={selectMobileTab}
			/>
		{/if}

		<footer class="nb-statusbar">
			<span>cells {notebook?.cells.length ?? 0}</span>
			<span>theme · {themePreference}</span>
			<span>wasm · pyodide 0.29</span>
		</footer>
	</div>
{/if}
