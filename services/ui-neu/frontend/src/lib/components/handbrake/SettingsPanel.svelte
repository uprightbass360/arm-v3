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
	import { fieldOptions, type TabId } from '$lib/handbrake/fields';
	import { ALL_ENCODERS_LINE, encoderCards, perEncoderLine } from '$lib/handbrake/encoderCards';
	import { keyRow, settingsPanelView } from '$lib/handbrake/panelView';
	import { resetBlock, resetCommon, setBlock, setCommon } from '$lib/handbrake/settingsEdit';
	import { AMD_NOTE, issuesFor } from '$lib/handbrake/display';
	import {
		audioListValue,
		baseVideoEncoder,
		blockOf,
		commonOf,
		effectiveQualityType,
		inheritedDepth,
		inheritedValue,
		type BaseValues
	} from '$lib/handbrake/base-values';
	import { cardFamilies, cardShown, commonKeys, type FilterState } from '$lib/handbrake/visibility';
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
	const view = $derived(settingsPanelView({ tab, encoder, availability }));
	const cards = $derived(
		cardFamilies(encoderCards(encoder, presetRef, schema, availability, baseVideoEncoder(base)), schema)
	);
</script>

<SettingsTabs {schema} {settings} {issues} {tab} ontab={(t) => (tab = t)}>
	{#snippet children(f: FilterState)}
		{#if view.section === 'video'}
			<div class="settings-panel-section">
				<h4 class="settings-panel-heading">All encoders</h4>
				<p class="settings-panel-line">{ALL_ENCODERS_LINE}</p>
			</div>
			{@render fields(commonKeys(schema, 'video'), f)}
			<div class="settings-panel-section settings-panel-divided">
				<h4 class="settings-panel-heading">Per encoder</h4>
				<p class="settings-panel-line">{perEncoderLine(view.encoderLabel)}</p>
			</div>
			{#if view.showAmdNote}<p class="field-help">{AMD_NOTE}</p>{/if}
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
							{base}
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
			{@const row = keyRow(key, stored, f, schema)}
			{#if row === 'audio-list'}
				<div class="settings-panel-wide">
					<AudioTrackList
						value={audioListValue(key, settings, base)}
						{schema}
						{issues}
						{readonly}
						onchange={(v) => onsettings(setCommon(settings, key.name, v))}
					/>
				</div>
			{:else if row === 'field'}
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
		{/each}
	</div>
{/snippet}

<style>
	.settings-panel-section {
		margin-top: 0.75rem;
	}
	.settings-panel-divided {
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}
	.settings-panel-heading {
		margin: 0;
		font-size: 0.625rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}
	.settings-panel-line {
		margin: 0.1875rem 0 0.5rem;
		font-size: 0.8125rem;
		line-height: 1.45;
		color: var(--color-text-secondary);
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
