<script>
	import Codicon from '$lib/components/Codicon.svelte';
	import { formatRelativeTime } from '$lib/vfs/formatRelativeTime.js';
	import { breadcrumbForDir, isNotebookFileName } from '$lib/vfs/vfsPaths.js';
	import { listChildren, stat } from '$lib/vfs/vfsTree.js';

	/** @typedef {'active' | 'saved'} RunningState */

	/** @type {{
	 *   snapshot: import('$lib/vfs/types.js').VfsSnapshot,
	 *   currentDirId: string,
	 *   activeFileId?: string,
	 *   runningForFile?: (fileId: string) => RunningState | null,
	 *   onnavigate?: (dirId: string) => void,
	 *   onopen?: (node: import('$lib/vfs/types.js').VfsNode) => void,
	 *   onnewnotebook?: () => void,
	 *   onnewfolder?: () => void,
	 *   onupload?: (files: FileList) => void,
	 *   onrefresh?: () => void,
	 *   onrename?: (nodeId: string, name: string) => void,
	 *   ondelete?: (nodeId: string) => void,
	 *   onduplicate?: (nodeId: string) => void,
	 *   ondownload?: (nodeId: string) => void
	 * }} */
	let {
		snapshot,
		currentDirId,
		activeFileId = '',
		runningForFile = () => null,
		onnavigate,
		onopen,
		onnewnotebook,
		onnewfolder,
		onupload,
		onrefresh,
		onrename,
		ondelete,
		onduplicate,
		ondownload
	} = $props();

	let filter = $state('');
	let sortKey = $state(/** @type {'name' | 'modified'} */ ('name'));
	let sortAsc = $state(true);
	let selectedId = $state('');
	/** @type {HTMLInputElement | undefined} */
	let uploadInput;

	const breadcrumbs = $derived.by(() => breadcrumbForDir(snapshot, currentDirId));

	const entries = $derived.by(() => {
		let rows = listChildren(snapshot, currentDirId).map((node) => ({
			node,
			stat: stat(snapshot, node.id)
		}));
		const q = filter.trim().toLowerCase();
		if (q) {
			rows = rows.filter(({ node }) => node.name.toLowerCase().includes(q));
		}
		rows.sort((a, b) => {
			let cmp = 0;
			if (sortKey === 'name') {
				if (a.node.type !== b.node.type) {
					cmp = a.node.type === 'directory' ? -1 : 1;
				} else {
					cmp = a.node.name.localeCompare(b.node.name);
				}
			} else {
				cmp = (a.node.updatedAt ?? 0) - (b.node.updatedAt ?? 0);
			}
			return sortAsc ? cmp : -cmp;
		});
		return rows;
	});

	function toggleSort(key) {
		if (sortKey === key) sortAsc = !sortAsc;
		else {
			sortKey = key;
			sortAsc = true;
		}
	}

	/** @param {import('$lib/vfs/types.js').VfsNode} node */
	function openNode(node) {
		selectedId = node.id;
		if (node.type === 'directory') {
			onnavigate?.(node.id);
			return;
		}
		onopen?.(node);
	}

	/** @param {import('$lib/vfs/types.js').VfsNode} node */
	function displayName(node) {
		if (node.name.endsWith('.ipynb.json')) {
			return node.name.replace(/\.ipynb\.json$/, '.ipynb');
		}
		return node.name;
	}

	function triggerUpload() {
		uploadInput?.click();
	}

	/** @param {Event} e */
	function onUploadChange(e) {
		const input = /** @type {HTMLInputElement} */ (e.currentTarget);
		if (input.files?.length) onupload?.(input.files);
		input.value = '';
	}

	function promptRename() {
		if (!selectedId) return;
		const node = snapshot.nodes.find((n) => n.id === selectedId);
		if (!node || node.parentId === null) return;
		const next = window.prompt('Rename', node.name);
		if (next && next !== node.name) onrename?.(node.id, next);
	}
</script>

<input bind:this={uploadInput} type="file" multiple class="nb-sr-only" onchange={onUploadChange} />

<div class="nb-filebrowser">
	<div class="nb-filebrowser__toolbar">
		<button type="button" class="nb-filebrowser__btn nb-filebrowser__btn--primary" title="New notebook" onclick={() => onnewnotebook?.()}>
			<Codicon name="add" label="New" />
		</button>
		<button type="button" class="nb-filebrowser__btn" title="New folder" onclick={() => onnewfolder?.()}>
			<Codicon name="new-folder" label="New folder" />
		</button>
		<button type="button" class="nb-filebrowser__btn" title="Upload" onclick={triggerUpload}>
			<Codicon name="cloud-upload" label="Upload" />
		</button>
		<button type="button" class="nb-filebrowser__btn" title="Refresh" onclick={() => onrefresh?.()}>
			<Codicon name="refresh" label="Refresh" />
		</button>
	</div>

	<nav class="nb-filebrowser__crumb" aria-label="Current folder">
		{#each breadcrumbs as crumb, i (crumb.id)}
			{#if i > 0}<span class="nb-filebrowser__crumb-sep">/</span>{/if}
			<button type="button" onclick={() => onnavigate?.(crumb.id)}>{crumb.label}</button>
		{/each}
	</nav>

	<label class="nb-filebrowser__filter">
		<Codicon name="filter" />
		<input type="search" placeholder="Filter files" bind:value={filter} />
	</label>

	<div class="nb-filebrowser__table" role="grid">
		<div class="nb-filebrowser__head" role="row">
			<button type="button" class="nb-filebrowser__col-name" role="columnheader" onclick={() => toggleSort('name')}>
				Name {#if sortKey === 'name'}{sortAsc ? '↑' : '↓'}{/if}
			</button>
			<button type="button" class="nb-filebrowser__col-mod" role="columnheader" onclick={() => toggleSort('modified')}>
				Modified {#if sortKey === 'modified'}{sortAsc ? '↑' : '↓'}{/if}
			</button>
		</div>
		{#each entries as { node } (node.id)}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				role="row"
				class="nb-filebrowser__row"
				class:nb-filebrowser__row--selected={selectedId === node.id || activeFileId === node.id}
				onclick={() => (selectedId = node.id)}
				ondblclick={() => openNode(node)}
				onkeydown={(e) => e.key === 'Enter' && openNode(node)}
				tabindex="0"
			>
				<span class="nb-filebrowser__col-name" role="gridcell">
					{#if runningForFile(node.id)}
						<span
							class="nb-filebrowser__running"
							class:nb-filebrowser__running--active={runningForFile(node.id) === 'active'}
							title="Kernel session"
						></span>
					{/if}
					{#if node.type === 'directory'}
						<Codicon name="folder" />
					{:else if isNotebookFileName(node.name)}
						<Codicon name="notebook" />
					{:else}
						<Codicon name="file" />
					{/if}
					{displayName(node)}
				</span>
				<span class="nb-filebrowser__col-mod" role="gridcell">{formatRelativeTime(node.updatedAt)}</span>
			</div>
		{/each}
	</div>

	{#if selectedId}
		<div class="nb-filebrowser__actions">
			<button type="button" class="nb-chip" onclick={() => {
				const n = snapshot.nodes.find((x) => x.id === selectedId);
				if (n) openNode(n);
			}}>Open</button>
			<button type="button" class="nb-chip" onclick={promptRename}>Rename</button>
			<button type="button" class="nb-chip" onclick={() => onduplicate?.(selectedId)}>Duplicate</button>
			<button type="button" class="nb-chip" onclick={() => ondownload?.(selectedId)}>Download</button>
			<button type="button" class="nb-chip nb-chip--warn" onclick={() => ondelete?.(selectedId)}>Delete</button>
		</div>
	{/if}
</div>
