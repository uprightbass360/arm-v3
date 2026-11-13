<script lang="ts">
	// One per-encoder settings card on the Video tab: a hardware badge, then the
	// family's bit depth and block fields. A card for a device the host cannot
	// verify stays collapsed until the user chooses to set values anyway.
	import type { HandbrakeSchemaSlimView, SettingIssue, SlimFamily, SlimKey, SlimVariant } from '$lib/types/api.gen';
	import { blockFields, type EncoderCard } from '$lib/handbrake/encoderCards';
	import TunableField from './TunableField.svelte';

	interface Props {
		schema: HandbrakeSchemaSlimView;
		family: SlimFamily;
		card: EncoderCard;
		block: Record<string, unknown>;
		inheritedDepth: number;
		depthSource: 'block' | 'base' | 'default';
		qualityType: number;
		issues: SettingIssue[];
		readonly: boolean;
		onchange: (key: string, value: unknown) => void;
		onreset: (key: string) => void;
	}

	let {
		schema,
		family,
		card,
		block,
		inheritedDepth,
		depthSource,
		qualityType,
		issues,
		readonly,
		onchange,
		onreset
	}: Props = $props();

	const AVERAGE_BITRATE = 2;
	const LISTS: Record<string, keyof SlimVariant> = {
		VideoPreset: 'presets',
		VideoTune: 'tunes',
		VideoProfile: 'profiles',
		VideoLevel: 'levels'
	};

	let expanded = $state(false);
	const prefix = $derived(`${family.name}-`);
	const depthId = $derived(`${family.name}-bit-depth`);
	const open = $derived(expanded || card.state !== 'collapsed' || Object.keys(block).length > 0);
	const depth = $derived(typeof block.bit_depth === 'number' ? block.bit_depth : inheritedDepth);
	const variant = $derived(family.variants.find((v) => v.depth === depth) ?? family.variants[0]);
	const depthText = (d: number) => `${d}-bit`;
	const defaultDepthLabel = $derived(
		depthSource === 'base' ? `${depthText(inheritedDepth)}, from base preset` : `${depthText(inheritedDepth)}, default`
	);
	const badge = $derived(
		card.state === 'verified'
			? `Verified on ${card.device}`
			: card.state === 'cpu-fallback'
				? 'Fallback when no GPU is free'
				: null
	);

	// Resolved eagerly: TunableField only reads the props its kind needs, which would leave these branches lazy.
	const rows = $derived(
		blockFields(schema, family).map((key) => ({
			name: key.name,
			shown: shownKey(key),
			options: options(key),
			range: rangeFor(key),
			multiPass: isMultiPass(key),
			issue: issueFor(key)
		}))
	);

	function options(key: SlimKey): string[] | null {
		const list = LISTS[key.name];
		if (!list) return null;
		return variant[list] as string[];
	}

	// The variant supplies these lists, so the key renders as a select though the schema names no source.
	function shownKey(key: SlimKey): SlimKey {
		if (key.name in LISTS) return { ...key, source: { kind: 'variant', ref: key.name } };
		if (key.name === 'VideoOptionExtra') return { ...key, label: 'Extra encoder options' };
		if (key.name !== 'VideoQualitySlider') return key;
		const q = variant.quality;
		return { ...key, label: `${q.name}, ${q.low} to ${q.high}` };
	}

	function rangeFor(key: SlimKey) {
		if (key.name !== 'VideoQualitySlider') return undefined;
		const q = variant.quality;
		return { min: q.low, max: q.high, step: q.step };
	}

	function isMultiPass(key: SlimKey): boolean {
		return key.name === 'VideoMultiPass';
	}

	function issueFor(key: SlimKey): SettingIssue | undefined {
		return issues.find((i) => i.encoder === family.name && i.key === key.name);
	}

	function onDepth(e: Event) {
		const raw = (e.currentTarget as HTMLSelectElement).value;
		const chosen = family.variants.find((v) => depthText(v.depth) === raw);
		if (chosen) onchange('bit_depth', chosen.depth);
		else onreset('bit_depth');
	}
</script>

<section class="encoder-card" data-state={card.state} aria-label={card.label}>
	<header class="encoder-card-head">
		<h4 class="encoder-card-title">{card.label}</h4>
		{#if badge}<span class="encoder-card-badge">{badge}</span>{/if}
	</header>
	{#if !open}
		<button type="button" class="btn-link" onclick={() => (expanded = true)}>Set values anyway</button>
	{:else}
		<div class="encoder-card-fields">
			<div class="tunable-field" data-stored={block.bit_depth !== undefined}>
				<div class="tunable-field-head">
					<label class="field-label" for={depthId}>Bit depth</label>
					{#if block.bit_depth !== undefined}
						<button type="button" class="btn-link" disabled={readonly} onclick={() => onreset('bit_depth')}
							>Reset</button
						>
					{/if}
				</div>
				<select id={depthId} class="field-control" disabled={readonly} onchange={onDepth}>
					<option selected={block.bit_depth === undefined}>{defaultDepthLabel}</option>
					{#each family.variants as v (v.depth)}
						<option selected={block.bit_depth === v.depth}>{depthText(v.depth)}</option>
					{/each}
				</select>
			</div>
			{#each rows as row (row.name)}
				{@const gated = row.multiPass && qualityType !== AVERAGE_BITRATE}
				<TunableField
					key={row.shown}
					value={block[row.name]}
					inherited={null}
					stored={block[row.name] !== undefined}
					options={row.options}
					issue={row.issue}
					disabled={readonly || gated}
					hint={gated ? 'Applies with average bitrate only' : undefined}
					idPrefix={prefix}
					range={row.range}
					onchange={(v) => onchange(row.name, v)}
					onreset={() => onreset(row.name)}
				/>
			{/each}
		</div>
	{/if}
</section>

<style>
	.encoder-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
	}
	.encoder-card-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.encoder-card-title {
		margin: 0;
		font-size: 0.9375rem;
	}
	.encoder-card-badge {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}
	.encoder-card-fields {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 0.75rem;
	}
	.tunable-field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}
	.tunable-field-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
	}
</style>
