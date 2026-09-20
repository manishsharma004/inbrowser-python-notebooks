<script>
	import { onDestroy, onMount } from 'svelte';
	import {
		clearActiveNotebookEditor,
		registerNotebookCellEditor,
		setActiveNotebookEditor
	} from '$lib/editor/notebookEditorRegistry.js';

	/** @type {{
	 *   cellId: string,
	 *   value?: string,
	 *   disabled?: boolean,
	 *   label?: string,
	 *   onchange?: (value: string) => void,
	 *   onrun?: () => void,
	 *   onrunadvance?: () => void,
	 *   onruninsertbelow?: () => void,
	 *   onfocus?: () => void
	 * }} */
	let {
		cellId,
		value = $bindable(''),
		disabled = false,
		label = 'Code cell',
		onchange,
		onrun,
		onrunadvance,
		onruninsertbelow,
		onfocus
	} = $props();

	/** @type {HTMLDivElement | undefined} */
	let container;
	/** @type {Awaited<ReturnType<typeof import('$lib/editor/monacoSetup.js').createMonacoEditor>> | null} */
	let editorHandle = $state(null);
	let syncing = false;
	/** @type {(() => void) | undefined} */
	let unregisterFocus;
	/** @type {import('monaco-editor').IDisposable | undefined} */
	let blurDisposable;

	onMount(() => {
		void (async () => {
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
				onRunCellAndInsertBelow: () => (onruninsertbelow ?? onrunadvance ?? onrun)?.(),
				onFocus: () => {
					onfocus?.();
					if (!editorHandle) return;
					setActiveNotebookEditor({
						kind: 'monaco',
						cellId,
						editor: editorHandle.editor,
						getMonaco: () =>
							import('$lib/editor/monacoSetup.js').then(async (mod) => {
								const monaco = await mod.ensureMonacoReady();
								if (!monaco) throw new Error('Monaco unavailable');
								return monaco;
							})
					});
				}
			});
			unregisterFocus = registerNotebookCellEditor(cellId, () => editorHandle?.editor.focus());
			blurDisposable = editorHandle.editor.onDidBlurEditorWidget(() => {
				clearActiveNotebookEditor(cellId);
			});
		})();
	});

	onDestroy(() => {
		clearActiveNotebookEditor(cellId);
		blurDisposable?.dispose();
		unregisterFocus?.();
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
