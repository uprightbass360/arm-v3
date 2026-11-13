<script lang="ts">
	// One schema-rendered field: label row with Reset (once the preset stores a
	// value), the control for the key's kind, the key name, and its issue. An
	// unstored text or number field shows the inherited value as a placeholder.
	import type { SettingIssue, SlimKey } from '$lib/types/api.gen';
	import ChipPicker from './ChipPicker.svelte';
	import { fieldKind, numberLimits, optionLabel } from '$lib/handbrake/fields';

	interface Props {
		key: SlimKey;
		value: unknown;
		inherited: unknown;
		stored: boolean;
		options: Array<string | number> | null;
		issue?: SettingIssue;
		disabled?: boolean;
		hint?: string;
		// Prefixes the control id so one key in two cards stays unique.
		idPrefix?: string;
		// A range and step the schema key does not carry (a quality scale).
		range?: { min: number; max: number; step: number };
		onchange: (v: unknown) => void;
		onreset: () => void;
	}

	let {
		key,
		value,
		inherited,
		stored,
		options,
		issue,
		disabled = false,
		hint,
		idPrefix = '',
		range,
		onchange,
		onreset
	}: Props = $props();

	const kind = $derived(fieldKind(key));
	const limits = $derived(numberLimits(key));
	const choices = $derived(options ?? []);
	const shown = $derived(stored ? value : inherited);
	const id = $derived(`${idPrefix}tunable-${key.name}`);
	const text = $derived(shown == null ? '' : String(shown));

	function onSelect(e: Event) {
		const raw = (e.currentTarget as HTMLSelectElement).value;
		onchange(choices.find((o) => String(o) === raw) ?? raw);
	}
	function onNumber(e: Event) {
		const raw = (e.currentTarget as HTMLInputElement).value;
		if (raw !== '' && Number.isFinite(Number(raw))) onchange(Number(raw));
	}
</script>

<!-- The audio track list has its own editor (AudioTrackList); this field draws nothing for it. -->
{#if kind !== 'audio-list'}
	<div class={stored ? 'tunable-field tunable-field-stored' : 'tunable-field'}>
		{#if kind === 'checkbox'}
			<div class="tunable-field-head">
				<span class="tunable-field-inline">
					<input
						{id}
						type="checkbox"
						checked={shown === true}
						{disabled}
						onchange={(e) => onchange(e.currentTarget.checked)}
					/>
					<label class="field-label" for={id}>{key.label}</label>
				</span>
				{@render resetLink()}
			</div>
		{:else}
			<div class="tunable-field-head">
				<label class="field-label" for={id}>{key.label}</label>
				{@render resetLink()}
			</div>
			{#if kind === 'select'}
				{@render selectControl()}
			{:else if kind === 'number'}
				{@render numberControl()}
			{:else if kind === 'chips'}
				<ChipPicker
					{id}
					values={Array.isArray(shown) ? shown.map(String) : []}
					{options}
					{disabled}
					onchange={(v) => onchange(v)}
				/>
			{:else}
				{@render textControl()}
			{/if}
		{/if}
		<p class="tunable-field-key">{key.name}</p>
		{#if issue}<p class="field-error" role="alert">{issue.message}</p>{/if}
		{#if hint}<p class="field-help">{hint}</p>{/if}
	</div>
{/if}

{#snippet resetLink()}
	{#if stored}
		<button type="button" class="btn-link tunable-field-reset" {disabled} onclick={onreset}>Reset</button>
	{/if}
{/snippet}

{#snippet selectControl()}
	<select {id} class="field-control" {disabled} onchange={onSelect}>
		{#if shown == null}<option value="" selected></option>{/if}
		{#each choices as option (option)}
			<option value={String(option)} selected={String(option) === String(shown)}>{optionLabel(key, option)}</option>
		{/each}
	</select>
{/snippet}

<!-- Unstored: the control is empty and the inherited value is its placeholder. -->
{#snippet numberControl()}
	<input
		{id}
		type="number"
		class="field-control"
		value={stored ? text : ''}
		placeholder={stored ? undefined : text}
		min={range?.min ?? limits?.min}
		max={range?.max ?? limits?.max}
		step={range?.step}
		{disabled}
		onchange={onNumber}
	/>
{/snippet}

{#snippet textControl()}
	<input
		{id}
		type="text"
		class="field-control"
		value={stored ? text : ''}
		placeholder={stored ? undefined : text}
		{disabled}
		onchange={(e) => onchange(e.currentTarget.value)}
	/>
{/snippet}

<style>
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
	/* :global because the stored border must beat the shared .field-control border. */
	.tunable-field-stored :global(.field-control) {
		border-color: var(--color-border-strong);
	}
	.tunable-field-inline {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.tunable-field-key {
		font-size: 0.6875rem;
		color: var(--color-text-faint);
		overflow-wrap: anywhere;
	}
	.tunable-field-reset {
		font-size: 0.75rem;
	}
</style>
