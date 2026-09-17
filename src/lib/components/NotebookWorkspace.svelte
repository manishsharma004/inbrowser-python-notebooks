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
				text: chunks.join('\n') || (result.ok ? '(no output)' : 'Execution failed.')
			}
		};
	}

	async function addNotebook() {
		if (!snapshot) return;
		const file = createNode(
			snapshot,
			snapshot.rootId,
			`notebook-${Date.now()}.ipynb.json`,
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
</script>

{#if !snapshot || !notebook}
	<p class="muted" style="padding: 2rem">Loading workspace…</p>
{:else}
	<div class="app-shell">
		<aside class="sidebar">
			<p class="eyebrow">IndexedDB VFS</p>
			<h2 style="margin: 0; font-size: 1.1rem">Notebooks</h2>
			<p class="muted" style="font-size: 0.85rem; margin: 0.35rem 0 0">
				Files persist in your browser only.
			</p>
			<ul class="file-tree">
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
			<div class="toolbar">
				<button type="button" class="pill" onclick={addNotebook}>New notebook</button>
			</div>
			<p class="muted" style="font-size: 0.75rem; margin-top: 1.5rem">
				Pyodide: {pyodideStatus === 'loading' ? 'loading…' : 'on demand'}
			</p>
		</aside>

		<main class="main">
			<p class="eyebrow">Notebook server (client-only)</p>
			<h1 style="margin: 0 0 0.5rem; font-size: 1.5rem">In-browser Python</h1>
			<p class="muted" style="margin: 0 0 1rem">
				Phase 0 shell: IndexedDB-backed files + Pyodide cell execution. See
				<code>docs/IMPLEMENTATION_PLAN.md</code> for the full roadmap.
			</p>

			{#each notebook.cells as cell (cell.id)}
				<section class="cell panel" style="padding: 0.75rem">
					{#if cell.kind === 'markdown'}
						<p class="muted">Markdown cells — planned in phase 2.</p>
						<textarea
							bind:value={cell.source}
							onchange={persistNotebook}
							aria-label="Markdown cell"
						></textarea>
					{:else}
						<textarea bind:value={cell.source} onchange={persistNotebook} aria-label="Code cell"
						></textarea>
						<div class="toolbar">
							<button
								type="button"
								class="action-link"
								disabled={running}
								onclick={() => runCell(cell.id)}
							>
								{running ? 'Running…' : 'Run cell'}
							</button>
						</div>
						{#if cellOutputs[cell.id]}
							<pre
								class="output"
								class:output--error={!cellOutputs[cell.id].ok}
							>{cellOutputs[cell.id].text}</pre>
						{/if}
					{/if}
				</section>
			{/each}
		</main>
	</div>
{/if}
