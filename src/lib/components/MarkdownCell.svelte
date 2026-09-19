<script>
	import { renderMarkdown } from '$lib/markdown/renderMarkdown.js';

	/** @type {{
	 *   value?: string,
	 *   mode?: 'edit' | 'preview',
	 *   label?: string,
	 *   onchange?: (value: string) => void
	 * }} */
	let {
		value = $bindable(''),
		mode = 'preview',
		label = 'Markdown cell',
		onchange
	} = $props();

	const previewHtml = $derived.by(() => renderMarkdown(value));
</script>

<div class="nb-md-cell">
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
