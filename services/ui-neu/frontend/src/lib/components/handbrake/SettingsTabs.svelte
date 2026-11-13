<script lang="ts">
	// The sidebar's tab strip: filter box and "Changed only" above it, a count
	// per tab, a warning glyph on tabs with an issue, dimmed tabs without a
	// match. The body renders through children, handed the current filter.
	import type { Snippet } from 'svelte';
	import type { HandbrakeSchemaSlimView, HandbrakeSettings, SettingIssue } from '$lib/types/api.gen';
	import Glyph from '$lib/components/Glyph.svelte';
	import { TABS, type TabId } from '$lib/handbrake/fields';
	import { firstTabWithMatch, tabMatchCounts } from '$lib/handbrake/filter';

	interface Props {
		schema: HandbrakeSchemaSlimView;
		settings: HandbrakeSettings;
		issues: SettingIssue[];
		tab: TabId;
		ontab: (t: TabId) => void;
		children: Snippet<[{ text: string; changedOnly: boolean }]>;
	}

	let { schema, settings, issues, tab, ontab, children }: Props = $props();

	let text = $state('');
	let changedOnly = $state(false);

	const filtering = $derived(text.trim() !== '');
	const counts = $derived(tabMatchCounts(schema, settings, text, changedOnly));
	const tabByKey = $derived(new Map([...schema.keys, ...schema.audio_item_keys].map((k) => [k.name, k.tab])));
	const issueTabs = $derived(new Set(issues.map((i) => tabByKey.get(i.key))));

	// Only while filtering: clearing the box leaves the user where they are.
	function jumpToMatch() {
		if (text.trim() === '') return;
		ontab(firstTabWithMatch(tabMatchCounts(schema, settings, text, changedOnly), tab));
	}
	function onfilter(e: Event) {
		text = (e.currentTarget as HTMLInputElement).value;
		jumpToMatch();
	}
</script>

<div class="settings-tabs">
	<div class="settings-tabs-toolbar">
		<input
			type="search"
			class="field-control"
			placeholder="Filter settings"
			aria-label="Filter settings"
			value={text}
			oninput={onfilter}
		/>
		<label class="settings-tabs-changed"
			><input type="checkbox" bind:checked={changedOnly} onchange={jumpToMatch} /> Changed only</label
		>
	</div>
	<div role="tablist" class="settings-tabs-strip">
		{#each TABS as t (t.id)}
			<button
				type="button"
				role="tab"
				class="settings-tab"
				aria-selected={tab === t.id}
				data-dim={filtering && counts[t.id] === 0}
				onclick={() => ontab(t.id)}
			>
				{String(t.label)}
				{#if counts[t.id] > 0}<span class="settings-tab-count">{counts[t.id]}</span>{/if}
				{#if issueTabs.has(t.id)}<Glyph name="warning" label="Has an issue" class="h-3 w-3" />{/if}
			</button>
		{/each}
	</div>
	<div role="tabpanel">{@render children({ text, changedOnly })}</div>
</div>

<style>
	.settings-tabs-toolbar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-bottom: 0.5rem;
		margin-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-border);
	}
	.settings-tabs-changed {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		white-space: nowrap;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}
	.settings-tabs-strip {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin-bottom: 0.75rem;
	}
	.settings-tab {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.625rem;
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}
	.settings-tab[aria-selected='true'] {
		background: var(--color-primary-tint-1);
		color: var(--color-primary);
	}
	.settings-tab[data-dim='true'] {
		opacity: 0.45;
	}
	.settings-tab-count {
		font-size: 0.75rem;
		font-variant-numeric: tabular-nums;
	}
	/* :global because the warning svg is rendered inside the Glyph component. */
	.settings-tab :global(svg) {
		color: var(--color-warning);
	}
</style>
