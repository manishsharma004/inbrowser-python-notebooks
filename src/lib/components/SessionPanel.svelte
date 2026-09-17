<script>
	/**
	 * @typedef {Object} Props
	 * @property {Record<string, string>} globals
	 * @property {Record<string, string>} environ
	 * @property {boolean} [loading]
	 * @property {boolean} [kernelReady]
	 * @property {() => void} [onrefresh]
	 * @property {() => void | Promise<void>} [onrestart]
	 */

	/** @type {Props} */
	let {
		globals = {},
		environ = {},
		loading = false,
		kernelReady = false,
		onrefresh,
		onrestart
	} = $props();

	let tab = $state(/** @type {'globals' | 'environ'} */ ('globals'));

	const globalEntries = $derived.by(() =>
		Object.entries(globals).sort(([a], [b]) => a.localeCompare(b))
	);
	const environEntries = $derived.by(() =>
		Object.entries(environ).sort(([a], [b]) => a.localeCompare(b))
	);
</script>

<aside class="nb-session" aria-label="Python session inspector">
	<div class="nb-session__head">
		<h2>Session</h2>
		<p class="nb-session__hint">
			One Pyodide kernel per tab — variables persist until you restart the kernel or reload the page.
		</p>
		<div class="nb-session__actions">
			<button type="button" class="nb-chip" disabled={loading} onclick={() => onrefresh?.()}>
				Refresh
			</button>
			<button type="button" class="nb-chip nb-chip--warn" disabled={loading} onclick={() => onrestart?.()}>
				Restart kernel
			</button>
		</div>
		<p class="nb-session__status">
			{#if loading}
				Kernel busy…
			{:else if kernelReady}
				Kernel ready
			{:else}
				Kernel not started — run a code cell
			{/if}
		</p>
	</div>

	<div class="nb-session__tabs" role="tablist">
		<button
			type="button"
			role="tab"
			class="nb-chip"
			class:nb-chip--active={tab === 'globals'}
			aria-selected={tab === 'globals'}
			onclick={() => (tab = 'globals')}
		>
			Variables ({globalEntries.length})
		</button>
		<button
			type="button"
			role="tab"
			class="nb-chip"
			class:nb-chip--active={tab === 'environ'}
			aria-selected={tab === 'environ'}
			onclick={() => (tab = 'environ')}
		>
			Environment ({environEntries.length})
		</button>
	</div>

	<div class="nb-session__panel">
		{#if tab === 'globals'}
			{#if globalEntries.length === 0}
				<p class="nb-session__empty">No user-defined globals yet.</p>
			{:else}
				<table class="nb-kv-table">
					<thead>
						<tr><th>Name</th><th>Value</th></tr>
					</thead>
					<tbody>
						{#each globalEntries as [name, repr] (name)}
							<tr>
								<td><code>{name}</code></td>
								<td><code>{repr}</code></td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		{:else if environEntries.length === 0}
			<p class="nb-session__empty">No environment variables exposed by Pyodide.</p>
		{:else}
			<table class="nb-kv-table">
				<thead>
					<tr><th>Name</th><th>Value</th></tr>
				</thead>
				<tbody>
					{#each environEntries as [name, val] (name)}
						<tr>
							<td><code>{name}</code></td>
							<td><code>{val}</code></td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</aside>
