<script>
	import {
		clearActiveNotebookEditor,
		setActiveNotebookEditor
	} from '$lib/editor/notebookEditorRegistry.js';

	/** @type {{
	 *   editorId?: string,
	 *   fileName?: string,
	 *   value?: string,
	 *   onchange?: (value: string) => void,
	 *   onclose?: () => void
	 * }} */
	let {
		editorId = 'textfile',
		fileName = 'file',
		value = $bindable(''),
		onchange,
		onclose
	} = $props();

	/** @type {HTMLTextAreaElement | undefined} */
	let textareaEl;
</script>

<div class="nb-textfile">
	<header class="nb-textfile__head">
		<span class="nb-textfile__name">{fileName}</span>
		<button type="button" class="nb-chip" onclick={() => onclose?.()}>Close</button>
	</header>
	<textarea
		class="nb-editor nb-textfile__editor"
		bind:this={textareaEl}
		bind:value
		onchange={() => onchange?.(value)}
		onfocus={() => {
			if (textareaEl) {
				setActiveNotebookEditor({ kind: 'textarea', cellId: editorId, textarea: textareaEl });
			}
		}}
		onblur={() => clearActiveNotebookEditor(editorId)}
		spellcheck="false"
		aria-label="Edit {fileName}"
	></textarea>
</div>
