<script lang="ts">
	// One schema-rendered field: the control for the key's kind, its issue, and
	// a Reset link once the preset stores a value. No "set here" labelling.
	import type { SettingIssue, SlimKey } from '$lib/types/api.gen';
	import { fieldKind, numberLimits } from '$lib/handbrake/fields';

	interface Props {
		key: SlimKey;
		value: unknown;
		inherited: unknown;
		stored: boolean;
		options: Array<string | number> | null;
		issue?: SettingIssue;
		disabled?: boolean;
		hint?: string;
		onchange: (v: unknown) => void;
		onreset: () => void;
	}

	let { key, value, inherited, stored, options, issue, disabled = false, hint, onchange, onreset }: Props = $props();

	const kind = $derived(fieldKind(key));
	const limits = $derived(numberLimits(key));
	const choices = $derived(options ?? []);
	const shown = $derived(stored ? value : inherited);
	const id = $derived(`tunable-${key.name}`);
	const text = $derived(shown == null ? '' : Array.isArray(shown) ? shown.join(', ') : String(shown));

	function onSelect(e: Event) {
		const raw = (e.currentTarget as HTMLSelectElement).value;
		onchange(choices.find((o) => String(o) === raw) ?? raw);
	}
	function onNumber(e: Event) {
		const raw = (e.currentTarget as HTMLInputElement).value;
		if (raw !== '' && Number.isFinite(Number(raw))) onchange(Number(raw));
	}
	function onChips(e: Event) {
		const raw = (e.currentTarget as HTMLInputElement).value;
		onchange(
			raw
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean)
		);
	}
</script>

<div class="tunable-field" data-stored={stored}>
	<div class="tunable-field-head">
		<label class="field-label" for={id}>{key.label}</label>
		{#if stored}
			<button type="button" class="btn-link tunable-field-reset" {disabled} onclick={onreset}>Reset</button>
		{/if}
	</div>
	{#if kind === 'checkbox'}
		<input
			{id}
			type="checkbox"
			checked={shown === true}
			{disabled}
			onchange={(e) => onchange(e.currentTarget.checked)}
		/>
	{:else if kind === 'select'}
		<select {id} class="field-control" {disabled} onchange={onSelect}>
			{#each choices as option (option)}
				<option selected={String(option) === String(shown)}>{String(option)}</option>
			{/each}
		</select>
	{:else if kind === 'number'}
		<input
			{id}
			type="number"
			class="field-control"
			value={text}
			min={limits?.min}
			max={limits?.max}
			{disabled}
			onchange={onNumber}
		/>
	{:else if kind === 'chips'}
		<input {id} type="text" class="field-control" value={text} {disabled} onchange={onChips} />
	{:else if kind === 'text'}
		<input
			{id}
			type="text"
			class="field-control"
			value={text}
			{disabled}
			onchange={(e) => onchange(e.currentTarget.value)}
		/>
	{/if}
	{#if issue}<p class="field-error" role="alert">{issue.message}</p>{/if}
	{#if hint}<p class="field-help">{hint}</p>{/if}
</div>

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
	.tunable-field[data-stored='true'] :global(.field-control) {
		border-color: var(--color-border-strong);
	}
	.tunable-field-reset {
		font-size: 0.75rem;
	}
</style>
