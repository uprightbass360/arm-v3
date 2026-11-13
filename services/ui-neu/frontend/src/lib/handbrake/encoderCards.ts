// Which per-encoder cards a preset shows on the Video tab, in which state, and
// which fields each card holds. Mirrors the backend's reachable_families so the
// card order is the claim order. Pure functions; no I/O.

import type { EncoderAvailabilityView, HandbrakeSchemaSlimView, SlimFamily, SlimKey } from '$lib/types/api.gen';

// 'open' is a card with no hardware state to report: a pinned or base-preset family.
export type CardState = 'verified' | 'cpu-fallback' | 'collapsed' | 'open';
export interface EncoderCard {
	family: string;
	label: string;
	state: CardState;
	device: string | null;
}

// HandBrake GPU families by vendor rank (the backend's VENDOR_RANK). VAAPI runs ffmpeg, so it has none.
const GPU_FAMILY_PREFIXES = ['nvenc', 'qsv'];
// The catalog's cpu_<codec> ids run these HandBrake families (arm_common encoders _CPU_ENGINE_ENCODER).
const CPU_FAMILY: Record<string, string> = { h264: 'x264', h265: 'x265', av1: 'svt_av1' };
const CATALOG_ID = /^(any|cpu|nvenc|qsv|vaapi)_(h264|h265|av1)$/;

function parseId(encoderId: string): { kind: string; codec: string } | null {
	const match = CATALOG_ID.exec(encoderId);
	return match ? { kind: match[1], codec: match[2] } : null;
}

function hasFamily(schema: HandbrakeSchemaSlimView, name: string): boolean {
	return schema.families.some((f) => f.name === name);
}

function familyOfVariant(schema: HandbrakeSchemaSlimView, encoder: string): string[] {
	return schema.families.filter((f) => f.variants.some((v) => v.encoder === encoder)).map((f) => f.name);
}

function reachableFamilies(
	encoderId: string,
	presetRef: string | null,
	schema: HandbrakeSchemaSlimView,
	baseVideoEncoder: string | null
): string[] {
	if (encoderId === 'preset') {
		return presetRef === null || baseVideoEncoder === null ? [] : familyOfVariant(schema, baseVideoEncoder);
	}
	const id = parseId(encoderId);
	if (id === null || id.kind === 'vaapi') return [];
	if (id.kind === 'any') {
		const gpu = GPU_FAMILY_PREFIXES.map((p) => `${p}_${id.codec}`).filter((f) => hasFamily(schema, f));
		return [...gpu, CPU_FAMILY[id.codec]];
	}
	return [id.kind === 'cpu' ? CPU_FAMILY[id.codec] : encoderId];
}

function cardFor(family: string, anyCodec: boolean, availability: EncoderAvailabilityView[]): EncoderCard {
	const entry = availability.find((a) => a.id === family);
	const label = entry?.label ?? family;
	if (entry?.available) return { family, label, state: 'verified', device: entry.label };
	if (!anyCodec) return { family, label, state: 'open', device: null };
	const isCpu = Object.values(CPU_FAMILY).includes(family);
	return { family, label, state: isCpu ? 'cpu-fallback' : 'collapsed', device: null };
}

export function encoderCards(
	encoderId: string,
	presetRef: string | null,
	schema: HandbrakeSchemaSlimView,
	availability: EncoderAvailabilityView[],
	baseVideoEncoder: string | null
): EncoderCard[] {
	const anyCodec = parseId(encoderId)?.kind === 'any';
	const families = reachableFamilies(encoderId, presetRef, schema, baseVideoEncoder);
	return families.map((family) => cardFor(family, anyCodec, availability));
}

// Block keys in display order. Multi-pass and turbo only where the family has them; advanced options on x264 only.
export function blockFields(schema: HandbrakeSchemaSlimView, family: SlimFamily): SlimKey[] {
	const wanted = ['VideoPreset', 'VideoTune', 'VideoProfile', 'VideoLevel', 'VideoQualitySlider'];
	if (family.multipass) wanted.push('VideoMultiPass');
	if (family.turbo) wanted.push('VideoTurboMultiPass');
	if (family.name === 'x264') wanted.push('x264UseAdvancedOptions');
	wanted.push('VideoOptionExtra');
	return wanted.map((name) => schema.keys.find((k) => k.name === name)).filter((k): k is SlimKey => k !== undefined);
}

export function showsAmdNote(encoderId: string, availability: EncoderAvailabilityView[]): boolean {
	return parseId(encoderId)?.kind === 'any' && availability.some((a) => a.vendor === 'vaapi' && a.available);
}
