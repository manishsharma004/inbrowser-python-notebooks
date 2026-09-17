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
	import { runPythonSource } from '$lib/pyodide/runtime.js';
	import MonacoCodeCell from '$lib/components/MonacoCodeCell.svelte';

	/** @type {import('$lib/vfs/types.js').VfsSnapshot | null} */
	let snapshot = $state(null);
	let activeFileId = $state('');
	/** @type {import('$lib/notebook/parseNotebook.js').NotebookDocument | null} */
	let notebook = $state(null);
	let running = $state(false);
	let pyodideStatus = $state('idle');
	/** @type {Record<string, { ok: boolean, text: string }>} */
	let cellOutputs = $state({});

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

	async function runCell(cellId) {
		const cell = notebook?.cells.find((item) => item.id === cellId);
		if (!cell || cell.kind !== 'code') return;

		running = true;
		pyodideStatus = 'loading';
		const result = await runPythonSource(cell.source);
		pyodideStatus = 'ready';
		running = false;

		const chunks = [];
		if (result.stdout) chunks.push(result.stdout);
		if (result.stderr) chunks.push(result.stderr);
		if (result.error) chunks.push(result.error);

		cellOutputs = {
			...cellOutputs,
			[cellId]: {
				ok: result.ok,
				text: chunks.join('\n') || (result.ok ? '—' : 'Execution failed.')
			}
		};
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
				cells: [{ id: crypto.randomUUID(), kind: 'code', source: '' }]
			})
		);
		await saveSnapshot(snapshot);
		selectFile(file.id, file.content ?? '');
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

{#if !snapshot || !notebook}
	<p class="nb-loading">mounting workspace…</p>
{:else}
	<div class="nb-app">
		<header class="nb-topbar">
			<div class="nb-topbar__brand">
				<span class="nb-topbar__title">{activeName}</span>
				<span class="nb-topbar__path">~/workspace</span>
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
							</div>
							<div class="nb-cell__body">
								{#if cell.kind === 'markdown'}
									<p class="nb-markdown-note">Markdown rendering not wired yet.</p>
									<textarea
										class="nb-editor"
										bind:value={cell.source}
										onchange={persistNotebook}
										aria-label="Markdown cell {i + 1}"
										spellcheck="false"
									></textarea>
								{:else}
									<MonacoCodeCell
										bind:value={cell.source}
										disabled={running}
										label="Code cell {i + 1}"
										onchange={persistNotebook}
										onrun={() => runCell(cell.id)}
									/>
									{#if cellOutputs[cell.id]}
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
		</div>

		<footer class="nb-statusbar">
			<span>cells {notebook.cells.length}</span>
			<span>wasm · pyodide 0.29</span>
		</footer>
	</div>
{/if}
