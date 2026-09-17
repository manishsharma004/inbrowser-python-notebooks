<script>
	import { onMount } from 'svelte';
	import {
		createNode,
		ensureStarterNotebook,
		listChildren,
		loadSnapshot,
		saveSnapshot,
		writeFile
	} from '$lib/vfs/indexedDbVfs.js';
	import { parseNotebook, serializeNotebook } from '$lib/notebook/parseNotebook.js';
	import {
		downloadTextFile,
		parseImportedNotebook,
		toJupyterNotebook
	} from '$lib/notebook/jupyterFormat.js';
	import {
		inspectPythonCompletions,
		inspectPythonSession,
		isPythonRuntimeReady,
		resetPythonRuntime,
		runPythonSource
	} from '$lib/pyodide/runtime.js';
	import {
		clearDynamicPythonCompletions,
		setDynamicPythonCompletions
	} from '$lib/editor/monacoCompletionState.js';
	import MonacoCodeCell from '$lib/components/MonacoCodeCell.svelte';
	import MarkdownCell from '$lib/components/MarkdownCell.svelte';
	import SessionPanel from '$lib/components/SessionPanel.svelte';
	import { formatDuration, formatRunSummary, formatRunTimestamp } from '$lib/notebook/formatRunMeta.js';

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
	/** @type {HTMLInputElement | null} */
	let importInput = $state(null);

	onMount(async () => {
		const loaded = await loadSnapshot();
		const starter = ensureStarterNotebook(loaded);
		await saveSnapshot(loaded);
		snapshot = loaded;
		if (starter) {
			selectFile(starter.id, starter.content ?? '');
		}
	});

	function selectFile(fileId, rawContent) {
		activeFileId = fileId;
		notebook = parseNotebook(rawContent);
		cellOutputs = {};
	}

	async function persistNotebook() {
		if (!snapshot || !activeFileId || !notebook) return;
		writeFile(snapshot, activeFileId, serializeNotebook(notebook));
		await saveSnapshot(snapshot);
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

		await refreshSessionInspector();
	}

	/**
	 * @param {'code' | 'markdown'} kind
	 * @param {number} [afterIndex]
	 */
	async function addCell(kind, afterIndex = notebook ? notebook.cells.length - 1 : 0) {
		if (!notebook) return;
		const cell = {
			id: crypto.randomUUID(),
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
					{ id: crypto.randomUUID(), kind: 'markdown', source: '# New notebook\n\n' },
					{ id: crypto.randomUUID(), kind: 'code', source: 'print("Hello from Pyodide")\n' }
				]
			})
		);
		await saveSnapshot(snapshot);
		selectFile(file.id, file.content ?? '');
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
		await saveSnapshot(snapshot);
		selectFile(node.id, node.content ?? '');
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

		<div class="nb-body">
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
								onclick={() => selectFile(file.id, file.content ?? '')}
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

			<div class="nb-canvas">
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

			<SessionPanel
				globals={sessionGlobals}
				environ={sessionEnviron}
				loading={sessionLoading || running}
				kernelReady={pyodideStatus === 'ready'}
				onrefresh={refreshSessionInspector}
				onrestart={restartKernel}
			/>
		</div>

		<footer class="nb-statusbar">
			<span>cells {notebook.cells.length}</span>
			<span>wasm · pyodide 0.29</span>
		</footer>
	</div>
{/if}
