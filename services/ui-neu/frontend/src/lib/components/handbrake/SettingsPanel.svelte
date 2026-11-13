<script lang="ts">
	// The preset sidebar's HandBrake settings: the tab strip and each tab's
	// schema-rendered fields. The Video tab holds the common keys under "All
	// encoders", then one card per reachable encoder family.
	import type {
		EncoderAvailabilityView,
		HandbrakeSchemaSlimView,
		HandbrakeSettings,
		SettingIssue,
		SlimKey
	} from '$lib/types/api.gen';
	import { fieldKind, fieldOptions, type TabId } from '$lib/handbrake/fields';
	import { encoderCards, showsAmdNote } from '$lib/handbrake/encoderCards';
	import { resetBlock, resetCommon, setBlock, setCommon } from '$lib/handbrake/settingsEdit';
	import {
		AMD_NOTE,
		audioListValue,
		baseVideoEncoder,
		blockOf,
		cardFamilies,
		cardShown,
		commonKeys,
		commonOf,
		effectiveQualityType,
		inheritedDepth,
		inheritedValue,
		issuesFor,
		keyShown,
		type BaseValues,
		type FilterState
	} from '$lib/handbrake/sidebarModel';
	import SettingsTabs from './SettingsTabs.svelte';
	import TunableField from './TunableField.svelte';
	import EncoderBlockCard from './EncoderBlockCard.svelte';
	import AudioTrackList from './AudioTrackList.svelte';

	interface Props {
		schema: HandbrakeSchemaSlimView;
		settings: HandbrakeSettings;
		base: BaseValues;
		issues: SettingIssue[];
		readonly: boolean;
		encoder: string;
		presetRef: string | null;
		availability: EncoderAvailabilityView[];
		onsettings: (s: HandbrakeSettings) => void;
	}

	let { schema, settings, base, issues, readonly, encoder, presetRef, availability, onsettings }: Props = $props();

	let tab = $state<TabId>('summary');

	const common = $derived(commonOf(settings));
	// Selects whose options hang off another key (a filter's presets) read the value in effect.
	const context = $derived({ ...base, ...common });
	const qualityType = $derived(effectiveQualityType(settings, base, schema));
	const cards = $derived(
		cardFamilies(encoderCards(encoder, presetRef, schema, availability, baseVideoEncoder(base)), schema)
	);
</script>

<SettingsTabs {schema} {settings} {issues} {tab} ontab={(t) => (tab = t)}>
	{#snippet children(f: FilterState)}
		{#if tab === 'video'}
			<h4 class="settings-panel-heading">All encoders</h4>
			{@render fields(commonKeys(schema, 'video'), f)}
			<h4 class="settings-panel-heading">Per encoder</h4>
			{#if showsAmdNote(encoder, availability)}<p class="field-help">{AMD_NOTE}</p>{/if}
			<div class="settings-panel-cards">
				{#each cards as { card, family } (card.family)}
					{@const block = blockOf(settings, family.name)}
					{@const depth = inheritedDepth(family, base)}
					{#if cardShown(schema, family, block, f)}
						<EncoderBlockCard
							{schema}
							{family}
							{card}
							{block}
							inheritedDepth={depth.depth}
							depthSource={depth.source}
							{qualityType}
							{issues}
							{readonly}
							onchange={(k, v) => onsettings(setBlock(settings, family.name, k, v))}
							onreset={(k) => onsettings(resetBlock(settings, family.name, k))}
						/>
					{/if}
				{/each}
			</div>
		{:else}
			{@render fields(commonKeys(schema, tab), f)}
		{/if}
	{/snippet}
</SettingsTabs>

{#snippet fields(keys: SlimKey[], f: FilterState)}
	<div class="settings-panel-grid">
		{#each keys as key (key.name)}
			{@const stored = key.name in common}
			{#if keyShown(key, stored, f, schema)}
				{#if fieldKind(key) === 'audio-list'}
					<div class="settings-panel-wide">
						<AudioTrackList
							value={audioListValue(key, settings, base)}
							{schema}
							{issues}
							{readonly}
							onchange={(v) => onsettings(setCommon(settings, key.name, v))}
						/>
					</div>
				{:else}
					<TunableField
						{key}
						value={common[key.name]}
						inherited={inheritedValue(key, base)}
						{stored}
						options={fieldOptions(key, schema, context)}
						issue={issuesFor(issues, key.name)}
						disabled={readonly}
						onchange={(v) => onsettings(setCommon(settings, key.name, v))}
						onreset={() => onsettings(resetCommon(settings, key.name))}
					/>
				{/if}
			{/if}
		{/each}
	</div>
{/snippet}

<style>
	.settings-panel-heading {
		margin: 0.75rem 0 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text);
	}
	.settings-panel-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem 1rem;
	}
	.settings-panel-wide {
		grid-column: 1 / -1;
	}
	.settings-panel-cards {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
</style>
