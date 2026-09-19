<script>
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
		<button type="button" class="nb-cell-insert__btn" onclick={() => oninsertcode?.()}>+ Code</button>
		<button type="button" class="nb-cell-insert__btn" onclick={() => oninsertmarkdown?.()}>+ Markdown</button>
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
			<span class="nb-cell-frame__chevron" aria-hidden="true"></span>
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
					▶
				</button>
				<button
					type="button"
					class="nb-icon-btn"
					title="Run and select next (Shift+Enter)"
					aria-label="Run cell {index + 1} and advance"
					disabled={running}
					onclick={() => onrunadvance?.()}
				>
					⏷
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
				<summary class="nb-icon-btn nb-cell-menu__trigger" title="More actions">⋯</summary>
				<div class="nb-cell-menu__panel">
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
				⌫
			</button>
		</div>
		<span class="nb-cell-frame__index">{index + 1}</span>
	</div>
	{#if !collapsed}
		<div class="nb-cell-frame__body">
			{@render children?.()}
			{#if kind === 'code'}
				<span class="nb-cell-frame__lang">Python</span>
			{/if}
		</div>
	{/if}
</article>
