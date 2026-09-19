<script>
	/** @type {{
	 *   fileName?: string,
	 *   value?: string,
	 *   onchange?: (value: string) => void,
	 *   onclose?: () => void
	 * }} */
	let { fileName = 'file', value = $bindable(''), onchange, onclose } = $props();
</script>

<div class="nb-textfile">
	<header class="nb-textfile__head">
		<span class="nb-textfile__name">{fileName}</span>
		<button type="button" class="nb-chip" onclick={() => onclose?.()}>Close</button>
	</header>
	<textarea
		class="nb-editor nb-textfile__editor"
		bind:value
		onchange={() => onchange?.(value)}
		spellcheck="false"
		aria-label="Edit {fileName}"
	></textarea>
</div>
