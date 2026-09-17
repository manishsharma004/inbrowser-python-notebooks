<script>
	import { onMount } from 'svelte';
	import {
		createNode,
		ensureStarterNotebook,
		hasPersistedWorkspace,
		listChildren,
		loadSnapshot,
		saveSnapshot,
		writeFile
	} from '$lib/vfs/indexedDbVfs.js';
	import { emptySnapshot } from '$lib/vfs/vfsTree.js';
	import { parseNotebook, serializeNotebook } from '$lib/notebook/parseNotebook.js';
	import {
		downloadTextFile,
		parseImportedNotebook,
		toJupyterNotebook
	} from '$lib/notebook/jupyterFormat.js';
	import {
		exportKernelCheckpoint,
		importKernelCheckpoint,
		inspectPythonCompletions,
		inspectPythonSession,
		isPythonRuntimeReady,
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
	import SessionPanel from '$lib/components/SessionPanel.svelte';
	import { formatDuration, formatRunSummary, formatRunTimestamp } from '$lib/notebook/formatRunMeta.js';
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

	/**
	 * @typedef {Object} CellRunRecord
	 * @property {boolean} ok
	 * @property {string} text
	 * @property {number} startedAt
	 * @property {number} finishedAt
	 * @property {number} durationMs
	 * @property {number} executionCount
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

	const LAST_OPEN_FILE_KEY = 'nb-last-open-file-v1';

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
			notebook = parseNotebook(rawContent);
			cellOutputs = {};
			importSessionSourceId = '';
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(LAST_OPEN_FILE_KEY, fileId);
			}
			await switchKernelToFile(fileId);
		} else {
			notebook = parseNotebook(rawContent);
		}
		if (notebook) {
			syncNotebookCellsForAnalysis(fileId, notebook.cells);
		}
	}

	/** @param {'rail' | 'session'} pane @param {PointerEvent} event */
	function startPaneResize(pane, event) {
		if (event.button !== 0) return;
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

	onMount(async () => {
		const layout = loadPanelLayout();
		railWidth = layout.rail;
		sessionWidth = layout.session;
		try {
			const hadPersisted = await hasPersistedWorkspace();
			const loaded = await loadSnapshot();
			const nodeCountBefore = loaded.nodes.length;
			const starter = ensureStarterNotebook(loaded);
			const createdStarter = loaded.nodes.length > nodeCountBefore;
			if (createdStarter || !hadPersisted) {
				await saveSnapshot(loaded);
			}
			snapshot = bumpSnapshot(loaded);

			const notebooks = listChildren(loaded, loaded.rootId).filter(
				(n) => n.type === 'file' && n.name.endsWith('.ipynb.json')
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
		} catch (error) {
			workspaceLoadError =
				error instanceof Error ? error.message : 'Could not load workspace from IndexedDB.';
			const empty = emptySnapshot();
			snapshot = bumpSnapshot(empty);
			const starter = ensureStarterNotebook(empty);
			if (starter) {
				await selectFile(starter.id, starter.content ?? '');
			}
		}
	});

	async function persistNotebook() {
		if (!snapshot || !activeFileId || !notebook) return;
		writeFile(snapshot, activeFileId, serializeNotebook(notebook));
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
		resetPythonRuntime();
		clearDynamicPythonCompletions();
		pyodideStatus = 'idle';
		cellOutputs = {};
		sessionGlobals = {};
		sessionEnviron = {};
	}

	async function runCell(cellId) {
		const cell = notebook?.cells.find((item) => item.id === cellId);
		if (!cell || cell.kind !== 'code') return;

		running = true;
		pyodideStatus = 'loading';
		const startedAt = Date.now();
		const timerStart = performance.now();
		const result = await runPythonSource(cell.source);
		const durationMs = performance.now() - timerStart;
		const finishedAt = Date.now();
		pyodideStatus = 'ready';
		running = false;

		const chunks = [];
		if (result.stdout) chunks.push(result.stdout);
		if (result.stderr) chunks.push(result.stderr);
		if (result.error) chunks.push(result.error);

		const previousCount = cellOutputs[cellId]?.executionCount ?? 0;

		cellOutputs = {
			...cellOutputs,
			[cellId]: {
				ok: result.ok,
				text: chunks.join('\n') || (result.ok ? '—' : 'Execution failed.'),
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
	}

	/**
	 * @param {'code' | 'markdown'} kind
	 * @param {number} [afterIndex]
	 */
	async function addCell(kind, afterIndex = notebook ? notebook.cells.length - 1 : 0) {
		if (!notebook) return;
		const cell = {
			id: randomId(),
			kind,
			source: kind === 'markdown' ? '## Notes\n\n' : ''
		};
		const insertAt = Math.min(Math.max(afterIndex, -1) + 1, notebook.cells.length);
		notebook.cells.splice(insertAt, 0, cell);
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

	async function addNotebook() {
		if (!snapshot) return;
		const file = createNode(
			snapshot,
			snapshot.rootId,
			`untitled-${files.length + 1}.ipynb.json`,
			'file',
			serializeNotebook({
				version: 1,
				cells: [
					{ id: randomId(), kind: 'markdown', source: '# New notebook\n\n' },
					{ id: randomId(), kind: 'code', source: 'print("Hello from Pyodide")\n' }
				]
			})
		);
		await persistWorkspaceTree();
		await selectFile(file.id, file.content ?? '');
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
			snapshot.rootId,
			safeName.endsWith('.json') ? safeName : `${safeName}.ipynb.json`,
			'file',
			serializeNotebook(imported)
		);
		await persistWorkspaceTree();
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
		return listChildren(snapshot, snapshot.rootId).filter((n) => n.type === 'file');
	});

	const activeName = $derived.by(() => {
		const file = files.find((f) => f.id === activeFileId);
		return file?.name ?? 'notebook';
	});

	const otherSessionSources = $derived.by(() => files.filter((file) => file.id !== activeFileId));

	const kernelLabel = $derived.by(() => {
		if (pyodideStatus === 'loading' || running) return 'Python · starting';
		if (pyodideStatus === 'ready') return 'Python · idle';
		return 'Python · cold';
	});

	const kernelDotClass = $derived.by(() => {
		if (pyodideStatus === 'loading' || running) return 'nb-kernel__dot nb-kernel__dot--busy';
		if (pyodideStatus === 'ready') return 'nb-kernel__dot nb-kernel__dot--ready';
		return 'nb-kernel__dot';
	});
</script>

<input
	bind:this={importInput}
	type="file"
	accept=".ipynb,.json,application/json"
	class="nb-sr-only"
	onchange={handleImportFile}
/>

{#if !snapshot || !notebook}
	<p class="nb-loading">mounting workspace…</p>
{:else}
	<div class="nb-app">
		<header class="nb-topbar">
			<div class="nb-topbar__brand">
				<span class="nb-topbar__title">{activeName}</span>
				<span class="nb-topbar__path">~/workspace</span>
			</div>
			<div class="nb-topbar__actions">
				<button type="button" class="nb-chip" onclick={() => addCell('code')}>+ Code</button>
				<button type="button" class="nb-chip" onclick={() => addCell('markdown')}>+ Markdown</button>
				<button type="button" class="nb-chip" onclick={triggerImport}>Import</button>
				<button type="button" class="nb-chip" onclick={exportNotebookJson}>Export JSON</button>
				<button type="button" class="nb-chip" onclick={exportNotebookJupyter}>Export .ipynb</button>
			</div>
			<div class="nb-kernel" title="Pyodide loads from CDN on first run">
				<span class={kernelDotClass} aria-hidden="true"></span>
				<span>{kernelLabel}</span>
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
			style="--rail-width: {railWidth}px; --session-width: {sessionWidth}px"
		>
			<aside class="nb-rail" aria-label="Workspace files">
				<div class="nb-rail__head">
					<p class="nb-rail__label">local store</p>
					<p class="nb-rail__hint">Notebooks live in IndexedDB on this device.</p>
				</div>
				<ul class="nb-filelist">
					{#each files as file (file.id)}
						<li>
							<button
								type="button"
								aria-current={file.id === activeFileId ? 'page' : undefined}
								onclick={() => void selectFile(file.id, file.content ?? '')}
							>
								{file.name}
							</button>
						</li>
					{/each}
				</ul>
				<div class="nb-rail__foot">
					<button type="button" class="nb-new-btn" onclick={addNotebook}>+ new notebook</button>
				</div>
			</aside>

			<button
				type="button"
				class="nb-pane-splitter"
				aria-label="Resize file sidebar"
				onpointerdown={(event) => startPaneResize('rail', event)}
			></button>

			<div class="nb-canvas">
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
				<div class="nb-canvas__inner">
					{#each notebook.cells as cell, i (cell.id)}
						<article class="nb-cell">
							<div class="nb-cell__gutter">
								{#if cell.kind === 'code'}
									<button
										type="button"
										class="nb-run"
										disabled={running}
										title="Run cell"
										aria-label="Run cell {i + 1}"
										onclick={() => runCell(cell.id)}
									>
										▶
									</button>
								{/if}
								<span class="nb-cell__index">{i + 1}</span>
								{#if cell.kind === 'code' && cellOutputs[cell.id]}
									<span class="nb-cell__exec" title={formatRunSummary(
										cellOutputs[cell.id].startedAt,
										cellOutputs[cell.id].finishedAt,
										cellOutputs[cell.id].durationMs
									)}>
										In [{cellOutputs[cell.id].executionCount}]
									</span>
								{/if}
							</div>
							<div class="nb-cell__body">
								<div class="nb-cell-toolbar">
									<span class="nb-cell-toolbar__tag">{cell.kind}</span>
									<div class="nb-cell-toolbar__actions">
										<button type="button" class="nb-chip" onclick={() => addCell('code', i)}>+ code</button>
										<button type="button" class="nb-chip" onclick={() => addCell('markdown', i)}>+ md</button>
										<button type="button" class="nb-chip" onclick={() => moveCell(i, -1)} disabled={i === 0}>↑</button>
										<button
											type="button"
											class="nb-chip"
											onclick={() => moveCell(i, 1)}
											disabled={i === notebook.cells.length - 1}>↓</button
										>
										<button
											type="button"
											class="nb-chip nb-chip--warn"
											onclick={() => deleteCell(i)}
											disabled={notebook.cells.length <= 1}>Delete</button
										>
									</div>
								</div>

								{#if cell.kind === 'markdown'}
									<MarkdownCell
										bind:value={cell.source}
										label="Markdown cell {i + 1}"
										onchange={persistNotebook}
									/>
								{:else}
									<MonacoCodeCell
										bind:value={cell.source}
										disabled={running}
										label="Code cell {i + 1}"
										onchange={persistNotebook}
										onrun={() => runCell(cell.id)}
									/>
									{#if cellOutputs[cell.id]}
										<div class="nb-run-meta" aria-live="polite">
											<span class="nb-run-meta__count">In [{cellOutputs[cell.id].executionCount}]</span>
											<span class="nb-run-meta__time" title="Started {formatRunTimestamp(cellOutputs[cell.id].startedAt)}">
												{formatRunTimestamp(cellOutputs[cell.id].finishedAt)}
											</span>
											<span class="nb-run-meta__duration">{formatDuration(cellOutputs[cell.id].durationMs)}</span>
										</div>
										<pre
											class="nb-output"
											class:nb-output--err={!cellOutputs[cell.id].ok}
										>{cellOutputs[cell.id].text}</pre>
									{/if}
								{/if}
							</div>
						</article>
					{/each}
				</div>
			</div>

			<button
				type="button"
				class="nb-pane-splitter nb-pane-splitter--session"
				aria-label="Resize session panel"
				onpointerdown={(event) => startPaneResize('session', event)}
			></button>

			<SessionPanel
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
		</div>

		<footer class="nb-statusbar">
			<span>cells {notebook.cells.length}</span>
			<span>wasm · pyodide 0.29</span>
		</footer>
	</div>
{/if}
