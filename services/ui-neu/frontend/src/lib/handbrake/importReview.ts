// What the import review step shows for one parsed export entry, and how an
// accepted entry fills the sidebar draft. Pure functions; no I/O.

import type {
	EncoderAvailabilityView,
	HandbrakeSchemaSlimView,
	HandbrakeSettings,
	ImportedPresetView
} from '$lib/types/api.gen';
import { TABS, type TabId } from './fields';
import { storedCount } from './settingsEdit';
import type { Draft } from './sidebarModel';

export interface ImportReview {
	encoderInFile: string;
	codecDepth: string;
	encoderInArm: string;
	container: string;
	storedFor: string;
	values: [string, string][];
	copiedLine: string | null;
	copiedTo: string[];
	eightBitOnly: string[];
	tabCounts: Record<TabId, number>;
	total: number;
	notes: string[];
}

export const COPIED_NOTE = 'Only bit depth is copied. Other encoders keep their defaults.';

// The codec a HandBrake family encodes: the catalog suffix (nvenc_h264) or the CPU family name.
const CODEC_LABELS: Record<string, string> = {
	h264: 'H.264',
	x264: 'H.264',
	h265: 'H.265',
	x265: 'H.265',
	av1: 'AV1',
	svt_av1: 'AV1'
};
const BIT_DEPTH_KEY = 'bit_depth';

type Block = Record<string, unknown>;

// The availability label of the catalog id that matches the family, else the family id.
export function familyLabel(family: string, availability: EncoderAvailabilityView[]): string {
	return availability.find((a) => a.id === family)?.label ?? family;
}

function codecOf(family: string): string | null {
	const suffix = family.split('_').slice(-1)[0];
	return CODEC_LABELS[family] ?? CODEC_LABELS[suffix] ?? null;
}

function keyLabel(name: string, schema: HandbrakeSchemaSlimView): string {
	if (name === BIT_DEPTH_KEY) return 'Bit depth';
	return schema.keys.find((k) => k.name === name)?.label ?? name;
}

function blockValues(block: Block, schema: HandbrakeSchemaSlimView): [string, string][] {
	return Object.entries(block).map(([name, value]) => [keyLabel(name, schema), String(value)]);
}

function codecDepth(family: string, block: Block): string {
	const parts = [codecOf(family), block[BIT_DEPTH_KEY] === undefined ? null : `${block[BIT_DEPTH_KEY]}-bit`];
	return parts.filter((part) => part !== null).join(', ');
}

function tabCounts(settings: HandbrakeSettings, schema: HandbrakeSchemaSlimView): Record<TabId, number> {
	const counts = {} as Record<TabId, number>;
	for (const tab of TABS) counts[tab.id] = storedCount(settings, tab.id, schema);
	return counts;
}

function plural(n: number): string {
	return n === 1 ? 'key' : 'keys';
}

function notesFor(
	p: ImportedPresetView,
	schema: HandbrakeSchemaSlimView,
	sourceLabel: string,
	copiedTo: string[]
): string[] {
	const notes: string[] = [];
	if (copiedTo.length > 0) notes.push(COPIED_NOTE);
	if (p.not_imported.length > 0) {
		notes.push(`Not used by ${sourceLabel}, not imported: ${p.not_imported.join(', ')}`);
	}
	if (p.dropped_keys.length > 0) {
		const n = p.dropped_keys.length;
		notes.push(`${n} ${plural(n)} dropped (not in HandBrake ${schema.handbrake_tag}): ${p.dropped_keys.join(', ')}`);
	}
	return [...notes, ...messagesOf(p)];
}

function messagesOf(p: ImportedPresetView): string[] {
	return [...p.warnings, ...p.issues.map((issue) => issue.message)];
}

function emptyReview(p: ImportedPresetView, availability: EncoderAvailabilityView[]): ImportReview {
	const empty = {} as Record<TabId, number>;
	for (const tab of TABS) empty[tab.id] = 0;
	return {
		encoderInFile: familyLabel(p.source_encoder, availability),
		codecDepth: '',
		encoderInArm: '',
		container: '',
		storedFor: '',
		values: [],
		copiedLine: null,
		copiedTo: [],
		eightBitOnly: [],
		tabCounts: empty,
		total: 0,
		notes: messagesOf(p)
	};
}

export function reviewRows(
	p: ImportedPresetView,
	schema: HandbrakeSchemaSlimView,
	availability: EncoderAvailabilityView[] = []
): ImportReview {
	const proposal = p.proposal;
	if (proposal === null) return emptyReview(p, availability);
	const block: Block = proposal.handbrake_settings.encoders?.[p.source_encoder] ?? {};
	const sourceLabel = familyLabel(p.source_encoder, availability);
	const copiedTo = p.copied_depth_to.map((family) => familyLabel(family, availability));
	const counts = tabCounts(proposal.handbrake_settings, schema);
	return {
		encoderInFile: sourceLabel,
		codecDepth: codecDepth(p.source_encoder, block),
		encoderInArm: familyLabel(proposal.encoder, availability),
		container: proposal.container,
		storedFor: sourceLabel,
		values: blockValues(block, schema),
		copiedLine: copiedTo.length > 0 ? `Bit depth ${block[BIT_DEPTH_KEY]} also set for ${copiedTo.join(', ')}` : null,
		copiedTo,
		eightBitOnly: p.eight_bit_only.map((family) => `${familyLabel(family, availability)}: 8-bit on this encoder`),
		tabCounts: counts,
		total: Object.values(counts).reduce((sum, n) => sum + n, 0),
		notes: notesFor(p, schema, sourceLabel, copiedTo)
	};
}

// The preset to preselect: the only one, else the first that can be imported.
export function defaultPick(presets: ImportedPresetView[]): number | null {
	const at = presets.findIndex((p) => p.importable);
	return at === -1 ? null : at;
}

// Fills the draft from a proposal; an existing name is kept. Nothing is saved.
export function applyProposal(d: Draft, p: ImportedPresetView): Draft {
	const proposal = p.proposal;
	if (proposal === null) return d;
	return {
		...d,
		name: d.name.trim() === '' ? proposal.name : d.name,
		container: proposal.container,
		encoder: proposal.encoder,
		settings: proposal.handbrake_settings
	};
}
