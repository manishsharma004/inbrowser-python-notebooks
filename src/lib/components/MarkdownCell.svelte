<script>
	import { renderMarkdown } from '$lib/markdown/renderMarkdown.js';

	/** @type {{
	 *   value?: string,
	 *   label?: string,
	 *   onchange?: (value: string) => void
	 * }} */
	let { value = $bindable(''), label = 'Markdown cell', onchange } = $props();

	let mode = $state(/** @type {'edit' | 'preview'} */ ('preview'));

	const previewHtml = $derived.by(() => renderMarkdown(value));
</script>

<div class="nb-md-cell">
	<div class="nb-cell-toolbar">
		<span class="nb-cell-toolbar__tag">markdown</span>
		<div class="nb-cell-toolbar__actions">
			<button
				type="button"
				class="nb-chip"
				class:nb-chip--active={mode === 'edit'}
				onclick={() => (mode = 'edit')}
			>
				Edit
			</button>
			<button
				type="button"
				class="nb-chip"
				class:nb-chip--active={mode === 'preview'}
				onclick={() => (mode = 'preview')}
			>
				Preview
			</button>
		</div>
	</div>

	{#if mode === 'edit'}
		<textarea
			class="nb-editor"
			bind:value
			onchange={() => onchange?.(value)}
			aria-label={label}
			spellcheck="true"
		></textarea>
	{:else}
		<div class="nb-markdown-preview" aria-label="{label} preview">
			{@html previewHtml}
		</div>
	{/if}
</div>
