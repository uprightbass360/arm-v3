import { describe, it, expect } from 'vitest';
import type { HandbrakeSchemaSlimView, SlimFamily, SlimKey } from '$lib/types/api.gen';
import fixture from './fixtures/slim-schema.json';
import {
	audioListValue,
	baseVideoEncoder,
	blockOf,
	commonOf,
	effectiveQualityType,
	inheritedDepth,
	inheritedValue
} from '../base-values';

const schema = fixture as unknown as HandbrakeSchemaSlimView;
const family = (name: string): SlimFamily => schema.families.find((f) => f.name === name)!;
const key = (name: string): SlimKey => schema.keys.find((k) => k.name === name)!;
describe('inherited values', () => {
	it('reads the base, then the schema default', () => {
		expect(inheritedValue(key('VideoQualityType'), { VideoQualityType: 1 })).toBe(1);
		expect(inheritedValue(key('VideoQualityType'), {})).toBe(2);
		expect(inheritedValue(key('VideoQualityType'), null)).toBe(2);
	});

	it('takes the quality type from the preset, the base, then the template', () => {
		const vqt = (common: Record<string, unknown>, base: Record<string, unknown> | null) =>
			effectiveQualityType({ common, encoders: {} }, base, schema);
		expect(vqt({ VideoQualityType: 1 }, { VideoQualityType: 2 })).toBe(1);
		expect(vqt({}, { VideoQualityType: 1 })).toBe(1);
		expect(vqt({}, null)).toBe(2);
		expect(effectiveQualityType({}, null, { ...schema, keys: [] })).toBe(2);
	});

	it('reads the base video encoder only when it is text', () => {
		expect(baseVideoEncoder({ VideoEncoder: 'x264' })).toBe('x264');
		expect(baseVideoEncoder({ VideoEncoder: 3 })).toBeNull();
		expect(baseVideoEncoder(null)).toBeNull();
	});

	it('inherits bit depth from a same-family base encoder, else 8', () => {
		expect(inheritedDepth(family('x265'), { VideoEncoder: 'x265_10bit' })).toEqual({ depth: 10, source: 'base' });
		expect(inheritedDepth(family('x265'), { VideoEncoder: 'x264' })).toEqual({ depth: 8, source: 'default' });
		expect(inheritedDepth(family('x265'), null)).toEqual({ depth: 8, source: 'default' });
	});
});

describe('settings access', () => {
	it('reads sections that may be missing', () => {
		expect(commonOf({})).toEqual({});
		expect(commonOf({ common: { A: 1 } })).toEqual({ A: 1 });
		expect(blockOf({}, 'x264')).toEqual({});
		expect(blockOf({ encoders: { x264: { B: 2 } } }, 'x264')).toEqual({ B: 2 });
	});

	it('takes the audio tracks from the preset, then the base, else none', () => {
		const tracks = [{ AudioEncoder: 'av_aac' }];
		expect(audioListValue(key('AudioList'), { common: { AudioList: tracks } }, null)).toEqual(tracks);
		expect(audioListValue(key('AudioList'), {}, { AudioList: tracks })).toEqual(tracks);
		expect(audioListValue(key('AudioList'), {}, { AudioList: 'junk' })).toEqual([]);
	});
});
