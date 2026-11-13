// The columns of the Rip presets and Transcode presets tables, and the
// action rules their action cell shares. Each column turns one preset into
// the text, sub line and badges its cell shows; DataTable only draws them.
import type { MediaType, RipPresetView, TranscodePresetView } from '$lib/types/api.gen';
import {
	humanizeContainer,
	humanizeMediaType,
	humanizeOutputMode,
	humanizeTool,
	humanizeTrackSelection
} from '$lib/utils/preset-labels';
import { encoderLabel } from '$lib/stores/encoders.svelte';
import { settingsCount } from '$lib/handbrake/sidebarModel';

export type BadgeTone = 'warn' | 'info' | 'neutral';

export type PillTone = MediaType | 'custom' | 'builtin';

export type CellContent = {
	text: string;
	/** Draw the cell as an uppercase pill: a media-type pill, or the Custom / Built-in tag. */
	pill?: { tone: PillTone };
	sub?: string;
	muted?: boolean;
	badges?: Array<{ text: string; tone: BadgeTone }>;
};

export interface TableColumn<R> {
	id: string;
	header: string;
	align?: 'start' | 'end';
	cell: (row: R) => CellContent;
}

const NOT_USED: CellContent = { text: 'Not used', muted: true };
const CPU_HERE = 'Encodes on CPU on this host';
const NONE: CellContent = { text: 'None', muted: true };

const IDENTIFICATION_LABELS: Record<string, string> = {
	required: 'Required',
	skip: 'Skipped',
	deferred_placeholder: 'Deferred'
};

function typeCell(preset: { is_builtin: boolean }): CellContent {
	return preset.is_builtin
		? { text: 'Built-in', pill: { tone: 'builtin' } }
		: { text: 'Custom', pill: { tone: 'custom' } };
}

function mediaCell(preset: { media_type: MediaType }): CellContent {
	return { text: humanizeMediaType(preset.media_type), pill: { tone: preset.media_type } };
}

function usedByCell(usage: Record<string, number>, id: string): CellContent {
	const count = usage[id] ?? 0;
	return { text: String(count), muted: count === 0 };
}

function identificationCell(p: RipPresetView): CellContent {
	return {
		text: IDENTIFICATION_LABELS[p.identification_mode] ?? p.identification_mode,
		muted: p.identification_mode === 'skip'
	};
}

function trackFiltersCell(p: RipPresetView): CellContent {
	const count = Object.keys(p.track_filters_json ?? {}).length;
	if (count === 0) return NONE;
	return { text: `${count} ${count === 1 ? 'filter' : 'filters'}` };
}

/** The Rip presets table's columns. `usage` maps a preset id to the number of sessions that use it. */
export function ripPresetColumns(usage: Record<string, number>): TableColumn<RipPresetView>[] {
	return [
		{ id: 'name', header: 'Preset', cell: (p) => ({ text: p.name }) },
		{ id: 'media', header: 'Media', cell: mediaCell },
		{ id: 'type', header: 'Type', cell: typeCell },
		{ id: 'tracks', header: 'Tracks', cell: (p) => ({ text: humanizeTrackSelection(p.track_selection) }) },
		{ id: 'identification', header: 'Identification', cell: identificationCell },
		{ id: 'output', header: 'Output', cell: (p) => ({ text: humanizeOutputMode(p.output_mode) }) },
		{ id: 'filters', header: 'Track filters', cell: trackFiltersCell },
		{ id: 'usedBy', header: 'Used by', align: 'end', cell: (p) => usedByCell(usage, p.id) }
	];
}

const usesHandbrake = (p: TranscodePresetView): boolean => p.tool === 'handbrake';

function nameCell(p: TranscodePresetView): CellContent {
	const needsReview = (p.issues ?? []).length > 0;
	return needsReview ? { text: p.name, badges: [{ text: 'Needs review', tone: 'warn' }] } : { text: p.name };
}

function encoderCell(p: TranscodePresetView): CellContent {
	if (!usesHandbrake(p)) return NOT_USED;
	const text = encoderLabel(p.encoder) || 'Preset default';
	return p.host_notes?.includes('encodes_on_cpu_here') ? { text, sub: CPU_HERE } : { text };
}

function basePresetCell(p: TranscodePresetView): CellContent {
	if (!usesHandbrake(p)) return NOT_USED;
	return p.preset_ref ? { text: p.preset_ref } : NONE;
}

function settingsCell(p: TranscodePresetView): CellContent {
	if (!usesHandbrake(p)) return NOT_USED;
	const count = settingsCount(p.handbrake_settings);
	return { text: String(count), muted: count === 0 };
}

/** The Transcode presets table's columns. `usage` maps a preset id to the number of sessions that use it. */
export function transcodePresetColumns(usage: Record<string, number>): TableColumn<TranscodePresetView>[] {
	return [
		{ id: 'name', header: 'Preset', cell: nameCell },
		{ id: 'media', header: 'Media', cell: mediaCell },
		{ id: 'type', header: 'Type', cell: typeCell },
		{ id: 'tool', header: 'Tool', cell: (p) => ({ text: humanizeTool(p.tool) }) },
		{ id: 'container', header: 'Container', cell: (p) => ({ text: humanizeContainer(p.container) }) },
		{ id: 'encoder', header: 'Encoder', cell: encoderCell },
		{ id: 'base', header: 'Base preset', cell: basePresetCell },
		{ id: 'settings', header: 'Settings', align: 'end', cell: settingsCell },
		{ id: 'usedBy', header: 'Used by', align: 'end', cell: (p) => usedByCell(usage, p.id) }
	];
}

/** The label of a preset's Edit action: built-ins are read-only, so they open for viewing. */
export function openLabel(preset: { is_builtin: boolean }): 'Edit' | 'View' {
	return preset.is_builtin ? 'View' : 'Edit';
}

/** Whether a preset's Delete is off, and the title that says why. */
export function deleteGuard(preset: { is_builtin: boolean }, usedBy: number): { disabled: boolean; title?: string } {
	if (preset.is_builtin) return { disabled: true, title: 'Built-in preset: clone to edit or remove' };
	if (usedBy > 0) return { disabled: true, title: `Used by ${usedBy} session(s): repoint them first` };
	return { disabled: false };
}
