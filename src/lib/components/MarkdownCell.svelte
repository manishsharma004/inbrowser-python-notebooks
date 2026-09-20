<script>
	import { renderMarkdown } from '$lib/markdown/renderMarkdown.js';
	import {
		clearActiveNotebookEditor,
		setActiveNotebookEditor
	} from '$lib/editor/notebookEditorRegistry.js';

	/** @type {{
	 *   cellId?: string,
	 *   value?: string,
	 *   mode?: 'edit' | 'preview',
	 *   label?: string,
	 *   onchange?: (value: string) => void
	 * }} */
	let {
		cellId = 'markdown',
		value = $bindable(''),
		mode = 'preview',
		label = 'Markdown cell',
		onchange
	} = $props();

	/** @type {HTMLTextAreaElement | undefined} */
	let textareaEl;

	const previewHtml = $derived.by(() => renderMarkdown(value));
</script>

<div class="nb-md-cell">
	{#if mode === 'edit'}
		<textarea
			class="nb-editor"
			bind:this={textareaEl}
			bind:value
			onchange={() => onchange?.(value)}
			onfocus={() => {
				if (textareaEl) {
					setActiveNotebookEditor({ kind: 'textarea', cellId, textarea: textareaEl });
				}
			}}
			onblur={() => clearActiveNotebookEditor(cellId)}
			aria-label={label}
			spellcheck="true"
		></textarea>
	{:else}
		<div class="nb-markdown-preview" aria-label="{label} preview">
			{@html previewHtml}
		</div>
	{/if}
</div>
