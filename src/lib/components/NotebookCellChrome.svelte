<script>
	import Codicon from '$lib/components/Codicon.svelte';

	/** @type {{
	 *   index: number,
	 *   kind: 'code' | 'markdown' | 'raw',
	 *   focused?: boolean,
	 *   collapsed?: boolean,
	 *   running?: boolean,
	 *   canDelete?: boolean,
	 *   canMoveUp?: boolean,
	 *   canMoveDown?: boolean,
	 *   markdownMode?: 'edit' | 'preview',
	 *   onfocus?: () => void,
	 *   ontogglecollapse?: () => void,
	 *   onrun?: () => void,
	 *   onrunadvance?: () => void,
	 *   onrunbelow?: () => void,
	 *   onclearoutput?: () => void,
	 *   onchangecode?: () => void,
	 *   onchangemarkdown?: () => void,
	 *   onrunallbelow?: () => void,
	 *   ondelete?: () => void,
	 *   onduplicate?: () => void,
	 *   onmoveup?: () => void,
	 *   onmovedown?: () => void,
	 *   oninsertcode?: () => void,
	 *   oninsertmarkdown?: () => void,
	 *   onmarkdownmode?: (mode: 'edit' | 'preview') => void,
	 *   children?: import('svelte').Snippet
	 * }} */
	let {
		index,
		kind,
		focused = false,
		collapsed = false,
		running = false,
		canDelete = true,
		canMoveUp = false,
		canMoveDown = false,
		markdownMode = 'edit',
		onfocus,
		ontogglecollapse,
		onrun,
		onrunadvance,
		onrunbelow,
		onclearoutput,
		onchangecode,
		onchangemarkdown,
		onrunallbelow,
		ondelete,
		onduplicate,
		onmoveup,
		onmovedown,
		oninsertcode,
		oninsertmarkdown,
		onmarkdownmode,
		children
	} = $props();
</script>

<div class="nb-cell-insert">
	<div class="nb-cell-insert__bar" role="group" aria-label="Insert cell above cell {index + 1}">
		<button type="button" class="nb-cell-insert__btn" onclick={() => oninsertcode?.()}>
			<Codicon name="add" /> Code
		</button>
		<button type="button" class="nb-cell-insert__btn" onclick={() => oninsertmarkdown?.()}>
			<Codicon name="markdown" /> Markdown
		</button>
	</div>
</div>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article
	class="nb-cell-frame"
	class:nb-cell-frame--focused={focused}
	class:nb-cell-frame--collapsed={collapsed}
	tabindex="-1"
	onfocusin={() => onfocus?.()}
>
	<div class="nb-cell-frame__head">
		<button
			type="button"
			class="nb-icon-btn nb-cell-frame__collapse"
			aria-expanded={!collapsed}
			aria-label={collapsed ? 'Expand cell' : 'Collapse cell'}
			onclick={() => ontogglecollapse?.()}
		>
			<Codicon name="chevron-down" class="nb-cell-frame__chevron-icon" />
		</button>
		<div class="nb-cell-frame__toolbar" role="toolbar" aria-label="Cell {index + 1} actions">
			{#if kind === 'code'}
				<button
					type="button"
					class="nb-icon-btn"
					title="Run cell (Ctrl+Enter)"
					aria-label="Run cell {index + 1}"
					disabled={running}
					onclick={() => onrun?.()}
				>
					<Codicon name="play" label="Run" />
				</button>
				<button
					type="button"
					class="nb-icon-btn"
					title="Run and select next (Shift+Enter)"
					aria-label="Run cell {index + 1} and advance"
					disabled={running}
					onclick={() => onrunadvance?.()}
				>
					<Codicon name="run-above" label="Run and advance" />
				</button>
				<button
					type="button"
					class="nb-icon-btn"
					title="Run cell and below"
					aria-label="Run cell {index + 1} and below"
					disabled={running}
					onclick={() => onrunallbelow?.()}
				>
					<Codicon name="run-all" label="Run below" />
				</button>
			{/if}
			{#if kind === 'markdown'}
				<button
					type="button"
					class="nb-icon-btn"
					class:nb-icon-btn--active={markdownMode === 'edit'}
					title="Edit markdown"
					onclick={() => onmarkdownmode?.('edit')}
				>
					Edit
				</button>
				<button
					type="button"
					class="nb-icon-btn"
					class:nb-icon-btn--active={markdownMode === 'preview'}
					title="Preview markdown"
					onclick={() => onmarkdownmode?.('preview')}
				>
					Preview
				</button>
			{/if}
			<details class="nb-cell-menu">
				<summary class="nb-icon-btn nb-cell-menu__trigger" title="More actions">
					<Codicon name="kebab-vertical" label="More" />
				</summary>
				<div class="nb-cell-menu__panel">
					{#if kind === 'code'}
						<button type="button" disabled={running} onclick={() => onrunbelow?.()}>Run cell below</button>
						<button type="button" onclick={() => onclearoutput?.()}>Clear outputs</button>
					{/if}
					<button type="button" onclick={() => onchangecode?.()}>Change to code</button>
					<button type="button" onclick={() => onchangemarkdown?.()}>Change to markdown</button>
					<button type="button" onclick={() => onduplicate?.()}>Duplicate cell</button>
					<button type="button" disabled={!canMoveUp} onclick={() => onmoveup?.()}>Move up</button>
					<button type="button" disabled={!canMoveDown} onclick={() => onmovedown?.()}>Move down</button>
				</div>
			</details>
			<button
				type="button"
				class="nb-icon-btn nb-icon-btn--danger"
				title="Delete cell"
				aria-label="Delete cell {index + 1}"
				disabled={!canDelete}
				onclick={() => ondelete?.()}
			>
				<Codicon name="trash" label="Delete" />
			</button>
		</div>
		<span class="nb-cell-frame__index">[{index + 1}]</span>
	</div>
	{#if !collapsed}
		<div class="nb-cell-frame__body">
			{@render children?.()}
			{#if kind === 'code'}
				<span class="nb-cell-frame__lang">Python</span>
			{:else if kind === 'markdown'}
				<span class="nb-cell-frame__lang">Markdown</span>
			{:else}
				<span class="nb-cell-frame__lang">Raw</span>
			{/if}
		</div>
	{/if}
</article>
