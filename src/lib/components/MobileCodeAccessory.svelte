<script>
	/** @type {{
	 *   visible?: boolean,
	 *   disabled?: boolean,
	 *   oninsert: (text: string, selectionOffset?: number) => void,
	 *   onrun?: () => void,
	 *   onrunadvance?: () => void
	 * }} */
	let {
		visible = false,
		disabled = false,
		oninsert,
		onrun,
		onrunadvance
	} = $props();

	/** @param {string} open @param {string} close */
	function insertPair(open, close) {
		oninsert(`${open}${close}`, -close.length);
	}
</script>

{#if visible}
	<div class="nb-code-accessory" role="toolbar" aria-label="Code keys">
		<div class="nb-code-accessory__scroll">
			<button type="button" class="nb-code-accessory__run" disabled={disabled} onclick={() => onrun?.()}>
				Run
			</button>
			<button
				type="button"
				class="nb-code-accessory__run"
				disabled={disabled}
				onclick={() => onrunadvance?.()}
			>
				Run ↓
			</button>
			<span class="nb-code-accessory__sep" aria-hidden="true"></span>
			<button type="button" disabled={disabled} aria-label="Insert four spaces" onclick={() => oninsert('    ')}>
				Tab
			</button>
			<button type="button" disabled={disabled} aria-label="Insert opening parenthesis" onclick={() => insertPair('(', ')')}>
				( )
			</button>
			<button type="button" disabled={disabled} aria-label="Insert square brackets" onclick={() => insertPair('[', ']')}>
				[ ]
			</button>
			<button type="button" disabled={disabled} aria-label="Insert curly braces" onclick={() => insertPair('{', '}')}>
				{'{ }'}
			</button>
			<button type="button" disabled={disabled} aria-label="Insert single quotes" onclick={() => insertPair("'", "'")}>
				' '
			</button>
			<button type="button" disabled={disabled} aria-label="Insert double quotes" onclick={() => insertPair('"', '"')}>
				" "
			</button>
			<button type="button" disabled={disabled} aria-label="Insert colon" onclick={() => oninsert(':')}>:</button>
			<button type="button" disabled={disabled} aria-label="Insert hash" onclick={() => oninsert('#')}>#</button>
			<button type="button" disabled={disabled} aria-label="Insert equals" onclick={() => oninsert('=')}>=</button>
			<button type="button" disabled={disabled} aria-label="Insert underscore" onclick={() => oninsert('_')}>_</button>
			<button type="button" disabled={disabled} aria-label="Insert period" onclick={() => oninsert('.')}>.</button>
			<button type="button" disabled={disabled} aria-label="Insert comma" onclick={() => oninsert(',')}>,</button>
			<button type="button" disabled={disabled} aria-label="Insert plus" onclick={() => oninsert('+')}>+</button>
			<button type="button" disabled={disabled} aria-label="Insert minus" onclick={() => oninsert('-')}>-</button>
			<button type="button" disabled={disabled} aria-label="Insert asterisk" onclick={() => oninsert('*')}>*</button>
			<button type="button" disabled={disabled} aria-label="Insert slash" onclick={() => oninsert('/')}>/</button>
			<button type="button" disabled={disabled} aria-label="Insert percent" onclick={() => oninsert('%')}>%</button>
		</div>
	</div>
{/if}
