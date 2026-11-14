// What a setting reads as when the preset does not store it: the base preset's value, else the schema default.
// Pure functions.

import type { HandbrakeSchemaSlimView, HandbrakeSettings, SlimFamily, SlimKey } from '$lib/types/api.gen';
import { settingsOf } from './draft';

export type BaseValues = Record<string, unknown> | null;

// HandBrake's VideoQualityType when neither the preset, the base nor the template names one: constant quality.
const CONSTANT_QUALITY = 2;
const DEFAULT_DEPTH = 8;

export function commonOf(s: HandbrakeSettings): Record<string, unknown> {
	return s.common ?? {};
}

export function blockOf(s: HandbrakeSettings, family: string): Record<string, unknown> {
	return s.encoders?.[family] ?? {};
}

// The audio output tracks in effect: the preset's own list, else the base's, else none.
export function audioListValue(key: SlimKey, s: HandbrakeSettings, base: BaseValues): Record<string, unknown>[] {
	const common = commonOf(s);
	const list = key.name in common ? common[key.name] : inheritedValue(key, base);
	return Array.isArray(list) ? list : [];
}

export function inheritedValue(key: SlimKey, base: BaseValues): unknown {
	return base && key.name in base ? base[key.name] : key.default;
}

export function effectiveQualityType(s: HandbrakeSettings, base: BaseValues, schema: HandbrakeSchemaSlimView): number {
	const stored = settingsOf(s).common.VideoQualityType;
	if (typeof stored === 'number') return stored;
	const template = schema.keys.find((k) => k.name === 'VideoQualityType');
	const inherited = template ? inheritedValue(template, base) : base?.VideoQualityType;
	return typeof inherited === 'number' ? inherited : CONSTANT_QUALITY;
}

export function baseVideoEncoder(base: BaseValues): string | null {
	return typeof base?.VideoEncoder === 'string' ? base.VideoEncoder : null;
}

// The base's VideoEncoder depth when it is this family, else 8.
export function inheritedDepth(family: SlimFamily, base: BaseValues): { depth: number; source: 'base' | 'default' } {
	const encoder = baseVideoEncoder(base);
	const variant = family.variants.find((v) => v.encoder === encoder);
	return variant ? { depth: variant.depth, source: 'base' } : { depth: DEFAULT_DEPTH, source: 'default' };
}
