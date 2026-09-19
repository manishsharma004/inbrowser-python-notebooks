<script>
	/** @type {{ value?: string, label?: string, onchange?: (value: string) => void }} */
	let { value = $bindable(''), label = 'Raw cell', onchange } = $props();
</script>

<div class="nb-raw-cell">
	<textarea
		class="nb-editor nb-editor--raw"
		bind:value
		onchange={() => onchange?.(value)}
		aria-label={label}
		spellcheck="false"
	></textarea>
</div>
