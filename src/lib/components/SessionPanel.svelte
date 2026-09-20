<script>
	/**
	 * @typedef {Object} Props
	 * @property {Record<string, string>} globals
	 * @property {Record<string, string>} environ
	 * @property {boolean} [loading]
	 * @property {boolean} [kernelReady]
	 * @property {number} [journalCount]
	 * @property {boolean} [hasCheckpoint]
	 * @property {string | null} [lastRestoreNote]
	 * @property {() => void} [onrefresh]
	 * @property {() => void | Promise<void>} [onrestart]
	 * @property {() => void | Promise<void>} [onsavecheckpoint]
	 * @property {() => void | Promise<void>} [onrestorecheckpoint]
	 * @property {() => void | Promise<void>} [onreplayjournal]
	 * @property {() => void | Promise<void>} [onclearsession]
	 * @property {{ id: string; name: string }[]} [otherNotebooks]
	 * @property {string} [importSourceId]
	 * @property {(sourceId: string) => void} [onimportsourcechange]
	 * @property {() => void | Promise<void>} [onimportvariables]
	 * @property {() => void | Promise<void>} [onimportvariablesoverwrite]
	 * @property {boolean} [mobilePaneActive]
	 * @property {boolean} [drawerOpen]
	 */

	/** @type {Props} */
	let {
		globals = {},
		environ = {},
		loading = false,
		kernelReady = false,
		journalCount = 0,
		hasCheckpoint = false,
		lastRestoreNote = null,
		onrefresh,
		onrestart,
		onsavecheckpoint,
		onrestorecheckpoint,
		onreplayjournal,
		onclearsession,
		otherNotebooks = [],
		importSourceId = '',
		onimportsourcechange,
		onimportvariables,
		onimportvariablesoverwrite,
		mobilePaneActive = true,
		drawerOpen = false
	} = $props();

	let tab = $state(/** @type {'globals' | 'environ'} */ ('globals'));

	const globalEntries = $derived.by(() =>
		Object.entries(globals).sort(([a], [b]) => a.localeCompare(b))
	);
	const environEntries = $derived.by(() =>
		Object.entries(environ).sort(([a], [b]) => a.localeCompare(b))
	);
</script>

<aside
	class="nb-session"
	class:nb-mobile-pane--active={mobilePaneActive}
	class:nb-session--drawer-open={drawerOpen}
	aria-label="Python session inspector"
>
	<div class="nb-session__head">
		<h2>Session</h2>
		<p class="nb-session__hint">
			Each notebook file has its own saved session (checkpoint + journal). Switching files saves the
			current kernel and loads that notebook's variables when possible.
		</p>
		<div class="nb-session__actions">
			<button type="button" class="nb-chip" disabled={loading} onclick={() => onrefresh?.()}>
				Refresh
			</button>
			<button type="button" class="nb-chip nb-chip--warn" disabled={loading} onclick={() => onrestart?.()}>
				Restart kernel
			</button>
		</div>
		<div class="nb-session__actions">
			<button type="button" class="nb-chip" disabled={loading} onclick={() => onsavecheckpoint?.()}>
				Save checkpoint
			</button>
			<button
				type="button"
				class="nb-chip"
				disabled={loading || !hasCheckpoint}
				onclick={() => onrestorecheckpoint?.()}
			>
				Restore checkpoint
			</button>
			<button
				type="button"
				class="nb-chip"
				disabled={loading || journalCount === 0}
				onclick={() => onreplayjournal?.()}
			>
				Replay journal ({journalCount})
			</button>
			<button type="button" class="nb-chip nb-chip--warn" disabled={loading} onclick={() => onclearsession?.()}>
				Clear saved session
			</button>
		</div>
		{#if otherNotebooks.length > 0}
			<div class="nb-session__import">
				<label class="nb-session__import-label" for="nb-import-session-select">
					Import variables from
				</label>
				<select
					id="nb-import-session-select"
					class="nb-session__import-select"
					disabled={loading}
					value={importSourceId}
					onchange={(event) => onimportsourcechange?.(event.currentTarget.value)}
				>
					<option value="">Choose notebook…</option>
					{#each otherNotebooks as nb (nb.id)}
						<option value={nb.id}>{nb.name}</option>
					{/each}
				</select>
				<div class="nb-session__actions">
					<button
						type="button"
						class="nb-chip"
						disabled={loading || !importSourceId}
						onclick={() => onimportvariables?.()}
					>
						Import (keep existing)
					</button>
					<button
						type="button"
						class="nb-chip nb-chip--warn"
						disabled={loading || !importSourceId}
						onclick={() => onimportvariablesoverwrite?.()}
					>
						Import (overwrite)
					</button>
				</div>
			</div>
		{/if}
		<p class="nb-session__status">
			{#if loading}
				Kernel busy…
			{:else if kernelReady}
				Kernel ready
			{:else}
				Kernel not started — run a code cell
			{/if}
			{#if lastRestoreNote}
				<br /><span class="nb-session__note">{lastRestoreNote}</span>
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
