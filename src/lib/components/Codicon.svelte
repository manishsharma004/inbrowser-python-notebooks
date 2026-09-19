<script>
	/** @type {{ name: string, label?: string, class?: string }} */
	let { name, label = '', class: className = '' } = $props();
</script>

<i
	class="codicon codicon-{name} {className}"
	role={label ? 'img' : undefined}
	aria-label={label || undefined}
	aria-hidden={label ? undefined : 'true'}
></i>
