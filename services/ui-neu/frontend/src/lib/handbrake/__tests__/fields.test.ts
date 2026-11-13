import { describe, it, expect } from 'vitest';
import type { HandbrakeSchemaSlimView, SlimKey } from '$lib/types/api.gen';
import fixture from './fixtures/slim-schema.json';
import { TABS, fieldKind, fieldOptions, keysForTab, numberLimits, optionLabel } from '../fields';

const schema = fixture as unknown as HandbrakeSchemaSlimView;
const key = (name: string): SlimKey => {
	const found = [...schema.keys, ...schema.audio_item_keys].find((k) => k.name === name);
	if (!found) throw new Error(name);
	return found;
};

describe('fieldKind', () => {
	it.each([
		['ChapterMarkers', 'checkbox'],
		['VideoFramerateMode', 'select'],
		['AudioBitrate', 'select'],
		['PictureWidth', 'number'],
		['AudioLanguageList', 'chips'],
		['AudioCopyMask', 'chips'],
		['AudioList', 'audio-list'],
		['PresetName', 'text']
	])('%s is %s', (name, kind) => {
		expect(fieldKind(key(name))).toBe(kind);
	});

	it('maps a float without a source to number', () => {
		expect(fieldKind({ ...key('PictureWidth'), type: 'float' })).toBe('number');
	});
});

describe('fieldOptions', () => {
	it('is null for a key without a source', () => {
		expect(fieldOptions(key('PictureWidth'), schema, {})).toBeNull();
	});

	it('reads a static enum from the schema', () => {
		expect(fieldOptions(key('VideoFramerateMode'), schema, {})).toEqual(schema.static_enums['VideoFramerateMode']);
	});

	it('reads a schema list and appends the extras once', () => {
		const opts = fieldOptions(key('AudioSamplerate'), schema, {})!;
		expect(opts).toContain('auto');
		expect(opts.filter((v) => v === 'auto')).toHaveLength(1);
	});

	it('does not repeat an extra the list already has', () => {
		const k = key('AudioBitrate');
		const patched = { ...schema, lists: { ...schema.lists, audio_bitrates: [-1, 128] } };
		expect(fieldOptions(k, patched, {})).toEqual([-1, 128]);
	});

	it('uses the filter named by the ref', () => {
		expect(fieldOptions(key('PictureChromaSmoothPreset'), schema, {})).toEqual(schema.filters['chroma_smooth'].presets);
		expect(fieldOptions(key('PictureChromaSmoothTune'), schema, {})).toEqual(schema.filters['chroma_smooth'].tunes);
	});

	it('follows the selector key chosen in context', () => {
		expect(fieldOptions(key('PictureDenoisePreset'), schema, { PictureDenoiseFilter: 'nlmeans' })).toEqual(
			schema.filters['nlmeans'].presets
		);
		expect(fieldOptions(key('PictureDenoiseTune'), schema, { PictureDenoiseFilter: 'hqdn3d' })).toEqual(
			schema.filters['hqdn3d'].tunes
		);
	});

	it('resolves a selector value through the alias table', () => {
		expect(fieldOptions(key('PictureDeinterlacePreset'), schema, { PictureDeinterlaceFilter: 'deinterlace' })).toEqual(
			schema.filters['yadif'].presets
		);
	});

	it('is empty when the selector is off or unset', () => {
		expect(fieldOptions(key('PictureDenoisePreset'), schema, { PictureDenoiseFilter: 'off' })).toEqual([]);
		expect(fieldOptions(key('PictureDenoisePreset'), schema, {})).toEqual([]);
		expect(fieldOptions(key('PictureDenoiseTune'), schema, { PictureDenoiseFilter: 'off' })).toEqual([]);
	});

	it('lists mixdowns for the chosen audio encoder', () => {
		expect(fieldOptions(key('AudioMixdown'), schema, { AudioEncoder: 'av_aac' })).toEqual(
			schema.audio_mixdowns_by_encoder['av_aac']
		);
		expect(fieldOptions(key('AudioMixdown'), schema, { AudioEncoder: 'nope' })).toEqual([]);
		expect(fieldOptions(key('AudioMixdown'), schema, {})).toEqual([]);
	});

	it('is empty for an unknown static enum, list or source kind', () => {
		const src = (kind: string, ref: string): SlimKey => ({ ...key('PictureWidth'), source: { kind, ref } });
		expect(fieldOptions(src('static', 'nope'), schema, {})).toEqual([]);
		expect(fieldOptions(src('schema_list', 'nope'), schema, {})).toEqual([]);
		expect(fieldOptions(src('other', 'x'), schema, {})).toEqual([]);
	});
});

describe('numberLimits', () => {
	it('is null when the key has none', () => {
		expect(numberLimits(key('PictureWidth'))).toBeNull();
	});

	it('maps the limits tuple', () => {
		expect(numberLimits({ ...key('PictureWidth'), limits: [1, 9] })).toEqual({ min: 1, max: 9 });
	});
});

describe('tabs', () => {
	it('lists the seven tabs in order', () => {
		expect(TABS.map((t) => t.id)).toEqual([
			'summary',
			'dimensions',
			'filters',
			'video',
			'audio',
			'subtitles',
			'chapters'
		]);
		expect(TABS.map((t) => t.label)).toEqual([
			'Summary',
			'Dimensions',
			'Filters',
			'Video',
			'Audio',
			'Subtitles',
			'Chapters'
		]);
	});

	it('picks the keys of one tab', () => {
		const names = keysForTab(schema, 'chapters').map((k) => k.name);
		expect(names).toEqual(['ChapterMarkers']);
		expect(keysForTab(schema, 'filters').every((k) => k.tab === 'filters')).toBe(true);
	});
});

describe('optionLabel', () => {
	const key = {
		name: 'VideoQualityType',
		option_labels: { '1': 'Average bitrate', '2': 'Constant quality' }
	} as unknown as SlimKey;

	it('returns the schema label for a value', () => {
		expect(optionLabel(key, 2)).toBe('Constant quality');
	});
	it('falls back to the value, with or without a label map', () => {
		expect(optionLabel(key, 7)).toBe('7');
		expect(optionLabel({ name: 'X' } as unknown as SlimKey, 'a')).toBe('a');
	});
});
