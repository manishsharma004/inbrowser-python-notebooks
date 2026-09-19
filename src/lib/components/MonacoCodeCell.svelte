<script>
	import { onDestroy, onMount } from 'svelte';

	/** @type {{
	 *   value?: string,
	 *   disabled?: boolean,
	 *   label?: string,
	 *   onchange?: (value: string) => void,
	 *   onrun?: () => void,
	 *   onrunadvance?: () => void,
	 *   onfocus?: () => void
	 * }} */
	let {
		value = $bindable(''),
		disabled = false,
		label = 'Code cell',
		onchange,
		onrun,
		onrunadvance,
		onfocus
	} = $props();

	/** @type {HTMLDivElement | undefined} */
	let container;
	/** @type {Awaited<ReturnType<typeof import('$lib/editor/monacoSetup.js').createMonacoEditor>> | null} */
	let editorHandle = $state(null);
	let syncing = false;

	onMount(async () => {
		if (!container) return;
		const { createMonacoEditor } = await import('$lib/editor/monacoSetup.js');
		editorHandle = await createMonacoEditor(container, value, {
			readOnly: disabled,
			onChange: (next) => {
				if (syncing) return;
				value = next;
				onchange?.(next);
			},
			onRunCell: () => onrun?.(),
			onRunCellAdvance: () => (onrunadvance ?? onrun)?.(),
			onFocus: () => onfocus?.()
		});
	});

	onDestroy(() => {
		editorHandle?.dispose();
		editorHandle = null;
	});

	$effect(() => {
		if (!editorHandle) return;
		editorHandle.setReadOnly(disabled);
	});

	$effect(() => {
		if (!editorHandle) return;
		if (editorHandle.getValue() === value) return;
		syncing = true;
		editorHandle.setValue(value);
		syncing = false;
	});
</script>

<div class="nb-monaco-wrap">
	<div class="nb-monaco" bind:this={container} role="textbox" aria-label={label}></div>
</div>
