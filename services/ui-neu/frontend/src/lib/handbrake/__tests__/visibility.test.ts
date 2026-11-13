import { describe, it, expect } from 'vitest';
import type { HandbrakeSchemaSlimView, SlimFamily, SlimKey } from '$lib/types/api.gen';
import fixture from './fixtures/slim-schema.json';
import { cardFamilies, cardShown, commonKeys, keyShown } from '../visibility';

const schema = fixture as unknown as HandbrakeSchemaSlimView;
const family = (name: string): SlimFamily => schema.families.find((f) => f.name === name)!;
const key = (name: string): SlimKey => schema.keys.find((k) => k.name === name)!;

describe('commonKeys reads the schema', () => {
	it('drops a key the schema calls ARM-owned', () => {
		const slim = { ...schema, arm_owned_keys: [...schema.arm_owned_keys, 'ChapterMarkers'] };
		expect(commonKeys(slim, 'chapters')).toEqual([]);
	});
});

describe('commonKeys', () => {
	it('leaves out ARM-owned and encoder-specific keys', () => {
		const video = commonKeys(schema, 'video').map((k) => k.name);
		expect(video).toContain('VideoQualityType');
		expect(video).not.toContain('VideoEncoder');
		expect(video).not.toContain('VideoHWDecode');
		expect(video).not.toContain('VideoPreset');
		expect(commonKeys(schema, 'summary').map((k) => k.name)).not.toContain('PresetName');
	});
});

describe('filtering', () => {
	const none = { text: '', changedOnly: false };

	it('shows a key matching the text, and only stored ones under Changed only', () => {
		expect(keyShown(key('VideoQualityType'), false, none)).toBe(true);
		expect(keyShown(key('VideoQualityType'), false, { text: 'rate control', changedOnly: false })).toBe(true);
		expect(keyShown(key('VideoQualityType'), false, { text: 'denoise', changedOnly: false })).toBe(false);
		expect(keyShown(key('VideoQualityType'), false, { text: '', changedOnly: true })).toBe(false);
		expect(keyShown(key('VideoQualityType'), true, { text: '', changedOnly: true })).toBe(true);
	});

	it('shows the audio track list when a track key matches', () => {
		expect(keyShown(key('AudioList'), false, { text: 'mixdown', changedOnly: false }, schema)).toBe(true);
		expect(keyShown(key('AudioList'), false, { text: 'zzz', changedOnly: false }, schema)).toBe(false);
		expect(keyShown(key('AudioList'), false, { text: 'mixdown', changedOnly: false })).toBe(false);
	});

	it('shows a card when a block field matches or, under Changed only, it stores something', () => {
		expect(cardShown(schema, family('x264'), {}, none)).toBe(true);
		expect(cardShown(schema, family('x264'), {}, { text: 'tune', changedOnly: false })).toBe(true);
		expect(cardShown(schema, family('x264'), {}, { text: 'bit depth', changedOnly: false })).toBe(true);
		expect(cardShown(schema, family('x264'), {}, { text: 'denoise', changedOnly: false })).toBe(false);
		expect(cardShown(schema, family('x264'), {}, { text: '', changedOnly: true })).toBe(false);
		expect(cardShown(schema, family('x264'), { VideoTune: 'film' }, { text: 'tune', changedOnly: true })).toBe(true);
		expect(cardShown(schema, family('x264'), { VideoTune: 'film' }, { text: '', changedOnly: true })).toBe(true);
	});
});

describe('cardFamilies', () => {
	it('pairs each card with its family and drops families the schema lacks', () => {
		const card = (family: string) => ({ family, label: family, state: 'open' as const, device: null });
		const pairs = cardFamilies([card('x264'), card('nope')], schema);
		expect(pairs).toEqual([{ card: card('x264'), family: family('x264') }]);
	});
});
