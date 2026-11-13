import { describe, it, expect } from 'vitest';
import type { EncoderAvailabilityView, HandbrakeSchemaSlimView, SlimFamily } from '$lib/types/api.gen';
import fixture from './fixtures/slim-schema.json';
import { blockFields, encoderCards, showsAmdNote } from '../encoderCards';

const schema = fixture as unknown as HandbrakeSchemaSlimView;
const family = (name: string): SlimFamily => schema.families.find((f) => f.name === name)!;

function entry(id: string, over: Partial<EncoderAvailabilityView> = {}): EncoderAvailabilityView {
	return {
		id,
		label: id,
		group: 'any',
		engine: 'handbrake',
		kind: 'gpu',
		vendor: null,
		codec: 'h264',
		available: false,
		reason: null,
		...over
	};
}
const nvidia = entry('nvenc_h264', { label: 'NVIDIA H.264', group: 'nvenc', vendor: 'nvenc', available: true });
const amd = entry('vaapi_h264', { label: 'AMD H.264', group: 'vaapi', vendor: 'vaapi', available: true });

describe('encoderCards', () => {
	it('orders any_h264 by vendor rank then CPU, with states', () => {
		const cards = encoderCards('any_h264', null, schema, [nvidia, amd], null);
		expect(cards.map((c) => [c.family, c.state])).toEqual([
			['nvenc_h264', 'verified'],
			['qsv_h264', 'collapsed'],
			['x264', 'cpu-fallback']
		]);
		expect(cards[0].device).toBe('NVIDIA H.264');
		expect(cards[1].device).toBeNull();
	});

	it('skips a GPU family the schema lacks', () => {
		const slim = { ...schema, families: schema.families.filter((f) => f.name !== 'qsv_h264') };
		expect(encoderCards('any_h264', null, slim, [], null).map((c) => c.family)).toEqual(['nvenc_h264', 'x264']);
	});

	it('pins a cpu id to its one open family', () => {
		expect(encoderCards('cpu_h265', null, schema, [], null)).toEqual([
			{ family: 'x265', label: 'x265', state: 'open', device: null }
		]);
	});

	it('pins a GPU id, verified when available', () => {
		expect(encoderCards('nvenc_h264', null, schema, [nvidia], null)[0].state).toBe('verified');
		expect(encoderCards('qsv_h264', null, schema, [], null)[0].state).toBe('open');
	});

	it('maps the base preset encoder variant to its family', () => {
		const cards = encoderCards('preset', 'H.265 MKV 1080p30', schema, [], 'x265_10bit');
		expect(cards.map((c) => [c.family, c.state])).toEqual([['x265', 'open']]);
	});

	it('has no card for a preset without a base, or for vaapi or unknown ids', () => {
		expect(encoderCards('preset', null, schema, [], 'x265')).toEqual([]);
		expect(encoderCards('preset', 'Base', schema, [], null)).toEqual([]);
		expect(encoderCards('vaapi_h264', null, schema, [amd], null)).toEqual([]);
		expect(encoderCards('bogus', null, schema, [], null)).toEqual([]);
	});

	it('uses svt_av1 for cpu av1', () => {
		expect(encoderCards('any_av1', null, schema, [], null).at(-1)?.family).toBe('svt_av1');
	});
});

describe('blockFields', () => {
	const names = (f: string) => blockFields(schema, family(f)).map((k) => k.name);

	it('gives x264 multi-pass, turbo and advanced options', () => {
		expect(names('x264')).toEqual([
			'VideoPreset',
			'VideoTune',
			'VideoProfile',
			'VideoLevel',
			'VideoQualitySlider',
			'VideoMultiPass',
			'VideoTurboMultiPass',
			'x264UseAdvancedOptions',
			'VideoOptionExtra'
		]);
	});

	it('gives NVENC neither multi-pass nor turbo nor advanced options', () => {
		expect(names('nvenc_h264')).toEqual([
			'VideoPreset',
			'VideoTune',
			'VideoProfile',
			'VideoLevel',
			'VideoQualitySlider',
			'VideoOptionExtra'
		]);
	});

	it('gives x265 turbo but no advanced options', () => {
		expect(names('x265')).toContain('VideoTurboMultiPass');
		expect(names('x265')).not.toContain('x264UseAdvancedOptions');
	});

	it('skips a key the schema lacks', () => {
		const slim = { ...schema, keys: schema.keys.filter((k) => k.name !== 'VideoTune') };
		expect(blockFields(slim, family('x264')).map((k) => k.name)).not.toContain('VideoTune');
	});
});

describe('blockFields reads its keys from the schema', () => {
	it('leaves out a key the schema does not call encoder-specific', () => {
		const slim = { ...schema, encoder_specific_keys: schema.encoder_specific_keys.filter((n) => n !== 'VideoLevel') };
		expect(blockFields(slim, family('x264')).map((k) => k.name)).not.toContain('VideoLevel');
	});

	it('puts a block key it has no display rank for last', () => {
		const slim = { ...schema, encoder_specific_keys: ['VideoFramerate', ...schema.encoder_specific_keys] };
		expect(
			blockFields(slim, family('x265'))
				.map((k) => k.name)
				.at(-1)
		).toBe('VideoFramerate');
	});
});

describe('showsAmdNote', () => {
	it('shows for any_* with an AMD device', () => {
		expect(showsAmdNote('any_h264', [nvidia, amd])).toBe(true);
	});
	it('hides without an AMD device or for pinned ids', () => {
		expect(showsAmdNote('any_h264', [nvidia])).toBe(false);
		expect(showsAmdNote('cpu_h264', [amd])).toBe(false);
	});
});
