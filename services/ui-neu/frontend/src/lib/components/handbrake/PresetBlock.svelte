<script lang="ts">
	// The preset sidebar's always-visible block: name, media type, tool,
	// container, encoder, base preset and extra args. Controlled: each change
	// goes to onfield and the sidebar applies it to its draft. media_type is
	// immutable on edit. `encoder` is one arm_common.encoders catalog id.
	import { onMount } from 'svelte';
	import { encodersStore, PRESET_ENCODER_ID } from '$lib/stores/encoders.svelte';
	import { encoderGroups } from '$lib/utils/encoder-groups';
	import {
		CLEARED_NOTE,
		clearsSettings,
		isVaapiEncoder,
		issuesFor,
		showTabs,
		type Draft,
		type PresetField
	} from '$lib/handbrake/sidebarModel';
	import type { SettingIssue } from '$lib/types/api.gen';

	// A HandBrake preset name that names a hardware encoder (a common
	// convention in preset libraries) does nothing on its own. HandBrake
	// only attaches a GPU when the Encoder field asks for one.
	const HARDWARE_HINT_PATTERN = /QSV|NVENC|VCN|VCE/i;

	interface Props {
		draft: Draft;
		readonly: boolean;
		editing: boolean;
		/** HandBrake's built-in preset names, or null while no schema is loaded. */
		builtinNames: string[] | null;
		issues: SettingIssue[];
		onfield: (field: PresetField, value: string) => void;
	}

	let { draft, readonly, editing, builtinNames, issues, onfield }: Props = $props();

	// Availability-aware encoder catalog (GET /api/encoders, cached by the
	// shared store), in catalog order. Refreshed on open: availability moves
	// with GPU probes and the enabled switches.
	onMount(() => {
		encodersStore.refresh();
	});
	const encoders = $derived(encodersStore.list);
	const optgroups = $derived(encoderGroups(encoders));

	// abcde/none presets can't carry a codec encoder (only handbrake presets can).
	const encoderLocked = $derived(draft.tool === 'abcde' || draft.tool === 'none');
	// vaapi_* encoders run over ffmpeg directly; the HandBrake base preset plays
	// no part, and extra args are ffmpeg CLI flags, not HandBrake ones.
	const usesFfmpegVaapi = $derived(isVaapiEncoder(draft.encoder));
	const encoderHint = $derived(
		draft.encoder === PRESET_ENCODER_ID && HARDWARE_HINT_PATTERN.test(draft.preset_ref ?? '')
			? 'This HandBrake preset uses a hardware encoder; choose the matching encoder above or ARM will not attach a GPU.'
			: null
	);
	const refIssue = $derived(issuesFor(issues, 'preset_ref'));

	// A stored name this HandBrake build does not have stays listed, so it is not lost on save.
	function withStoredName(names: string[], stored: string | null): string[] {
		return stored && !names.includes(stored) ? [stored, ...names] : names;
	}

	function value(e: Event): string {
		return (e.currentTarget as HTMLInputElement | HTMLSelectElement).value;
	}

	// The ffmpeg path copies the source audio, which WebM cannot carry, so it
	// writes MKV or MP4 only (the API refuses the pairing with a 422).
	function onEncoder(e: Event) {
		const id = value(e);
		onfield('encoder', id);
		if (isVaapiEncoder(id) && draft.container === 'webm') onfield('container', 'mkv');
	}
</script>

<div class="preset-block">
	<label class="field preset-block-wide">
		<span class="field-label">Name</span>
		<input
			data-testid="tp-name"
			type="text"
			required
			value={draft.name}
			disabled={readonly}
			oninput={(e) => onfield('name', value(e))}
		/>
	</label>

	<label class="field">
		<span class="field-label">Media type</span>
		<select
			data-testid="tp-media-type"
			value={draft.media_type}
			disabled={readonly || editing}
			onchange={(e) => onfield('media_type', value(e))}
		>
			<option value="movie">Movie</option>
			<option value="tv">TV</option>
			<option value="music">Music</option>
			<option value="data">Data</option>
			<option value="iso">ISO</option>
		</select>
	</label>

	<label class="field">
		<span class="field-label">Tool</span>
		<select data-testid="tp-tool" value={draft.tool} disabled={readonly} onchange={(e) => onfield('tool', value(e))}>
			<option value="handbrake">HandBrake</option>
			<option value="abcde">abcde</option>
			<option value="none">None</option>
		</select>
	</label>

	<label class="field">
		<span class="field-label">Container</span>
		<select
			data-testid="tp-container"
			value={draft.container}
			disabled={readonly}
			onchange={(e) => onfield('container', value(e))}
		>
			<option value="mkv">MKV</option>
			<option value="mp4">MP4</option>
			<option value="webm" disabled={usesFfmpegVaapi}>WebM</option>
			<option value="flac">FLAC</option>
			<option value="mp3">MP3</option>
			<option value="ogg">OGG</option>
			<option value="iso">ISO</option>
			<option value="none">None</option>
		</select>
		{#if usesFfmpegVaapi}
			<p class="field-help" data-testid="tp-container-vaapi-note">AMD VAAPI encoders write MKV or MP4.</p>
		{/if}
	</label>

	<label class="field">
		<span class="field-label">Encoder</span>
		<select
			data-testid="tp-encoder"
			value={draft.encoder}
			disabled={readonly || encoderLocked || encodersStore.loading}
			onchange={onEncoder}
		>
			{#if encodersStore.loading}
				<option value={draft.encoder} disabled>Loading encoders...</option>
			{:else if encoders.length === 0}
				<option value={draft.encoder}>{draft.encoder}</option>
			{:else}
				{#each optgroups as grp (grp.group)}
					<optgroup label={grp.label}>
						{#each grp.encoders as enc (enc.id)}
							<option value={enc.id} disabled={!enc.available} title={enc.reason ?? undefined}>
								{enc.label}{enc.reason ? ` (${enc.reason})` : ''}
							</option>
						{/each}
					</optgroup>
				{/each}
			{/if}
		</select>
		{#if encodersStore.error}
			<p class="field-error" data-testid="tp-encoder-error">Could not load encoders; the current encoder is kept.</p>
		{/if}
		{#if encoderHint}
			<p class="field-help" data-testid="tp-encoder-hint">{encoderHint}</p>
		{/if}
	</label>

	<!-- The base preset is a select of HandBrake's built-ins once a schema is loaded; free text otherwise. -->
	{#if draft.tool === 'handbrake' && builtinNames}
		<label class="field">
			<span class="field-label">Base preset</span>
			<select
				data-testid="tp-preset-ref"
				value={draft.preset_ref ?? ''}
				disabled={readonly}
				onchange={(e) => onfield('preset_ref', value(e))}
			>
				<option value="">None (HandBrake defaults)</option>
				{#each withStoredName(builtinNames, draft.preset_ref) as name (name)}
					<option value={name}>{name}</option>
				{/each}
			</select>
			{@render refNotes()}
		</label>
	{:else}
		<label class="field">
			<span class="field-label">Preset ref</span>
			<input
				data-testid="tp-preset-ref"
				type="text"
				value={draft.preset_ref ?? ''}
				disabled={readonly}
				onchange={(e) => onfield('preset_ref', value(e))}
			/>
			{@render refNotes()}
		</label>
	{/if}

	<label class="field">
		<span class="field-label">{usesFfmpegVaapi ? 'ffmpeg arguments' : 'Extra args'}</span>
		<input
			data-testid="tp-extra-args"
			type="text"
			value={draft.extra_args}
			disabled={readonly}
			oninput={(e) => onfield('extra_args', value(e))}
		/>
		{#if showTabs(draft)}
			<p class="field-help">Flags here are added last and override the settings below.</p>
		{/if}
	</label>

	{#if clearsSettings(draft)}
		<p class="alert alert-warning preset-block-wide" role="status">{CLEARED_NOTE}</p>
	{/if}
</div>

{#snippet refNotes()}
	{#if usesFfmpegVaapi}
		<p class="field-help" data-testid="tp-preset-ref-note">Not used by this encoder.</p>
	{/if}
	{#if refIssue}<p class="field-error" role="alert">{refIssue.message}</p>{/if}
{/snippet}

<style>
	.preset-block {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem 1rem;
	}
	.preset-block-wide {
		grid-column: 1 / -1;
	}
</style>
