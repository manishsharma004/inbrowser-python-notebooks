<script>
	/** @type {{
	 *   active: import('$lib/layout/mobileTabs.js').MobileTab,
	 *   kernelBusy?: boolean,
	 *   onselect: (tab: import('$lib/layout/mobileTabs.js').MobileTab) => void
	 * }} */
	let { active, kernelBusy = false, onselect } = $props();

	/** @type {Array<{ id: import('$lib/layout/mobileTabs.js').MobileTab, label: string }>} */
	const items = [
		{ id: 'files', label: 'Files' },
		{ id: 'notebook', label: 'Notebook' },
		{ id: 'session', label: 'Session' },
		{ id: 'more', label: 'More' }
	];
</script>

<nav class="nb-mobile-nav" aria-label="Workspace sections">
	<div class="nb-mobile-nav__inner" role="tablist">
		{#each items as item (item.id)}
			<button
				type="button"
				role="tab"
				class="nb-mobile-nav__btn"
				class:nb-mobile-nav__btn--active={active === item.id}
				aria-selected={active === item.id}
				onclick={() => onselect(item.id)}
			>
				<span class="nb-mobile-nav__label">{item.label}</span>
				{#if item.id === 'notebook' && kernelBusy}
					<span class="nb-mobile-nav__dot" aria-hidden="true"></span>
				{/if}
			</button>
		{/each}
	</div>
</nav>
