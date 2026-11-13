import { describe, it, expect } from 'vitest';
import type { HandbrakeSchemaSlimView, SlimKey } from '$lib/types/api.gen';
import fixture from './fixtures/slim-schema.json';
import { firstTabWithMatch, matchesKeyFilter, tabMatchCounts } from '../filter';
import { storedCount } from '../settingsEdit';
import { TABS, type TabId } from '../fields';

const schema = fixture as unknown as HandbrakeSchemaSlimView;
const key = (name: string): SlimKey => schema.keys.find((k) => k.name === name)!;
const zero = (over: Partial<Record<TabId, number>> = {}) =>
	({ ...Object.fromEntries(TABS.map((t) => [t.id, 0])), ...over }) as Record<TabId, number>;

const settings = {
	common: { PictureWidth: 1280, VideoEncoder: 'x264', AudioList: [{ AudioBitrate: 128 }, 'junk', null] },
	encoders: { x264: { VideoPreset: 'slow', bit_depth: 10 } }
};

describe('matchesKeyFilter', () => {
	it('matches the label, case-insensitively', () => {
		expect(matchesKeyFilter(key('AlignAVStart'), 'ALIGN AUDIO')).toBe(true);
	});
	it('matches the key name', () => {
		expect(matchesKeyFilter(key('AlignAVStart'), 'avstart')).toBe(true);
	});
	it('does not match something else', () => {
		expect(matchesKeyFilter(key('AlignAVStart'), 'zzz')).toBe(false);
	});
});

describe('tabMatchCounts', () => {
	it('without text equals the stored counts', () => {
		const counts = tabMatchCounts(schema, settings, '', false);
		for (const t of TABS) expect(counts[t.id]).toBe(storedCount(settings, t.id, schema));
		expect(tabMatchCounts(schema, settings, '  ', true)).toEqual(counts);
	});

	it('with text counts the matching keys per tab, zero included', () => {
		const counts = tabMatchCounts(schema, {}, 'PictureWidth', false);
		expect(counts.dimensions).toBe(1);
		expect(counts.video).toBe(0);
		expect(Object.keys(counts)).toHaveLength(TABS.length);
	});

	it('matches a label as well as a name', () => {
		expect(tabMatchCounts(schema, {}, key('AlignAVStart').label, false).summary).toBeGreaterThan(0);
	});

	it('counts audio output track keys on the audio tab', () => {
		expect(tabMatchCounts(schema, {}, 'AudioMixdown', false).audio).toBeGreaterThan(0);
	});

	it('Changed only restricts to stored keys, in common, blocks and audio items', () => {
		expect(tabMatchCounts(schema, settings, 'Picture', true).dimensions).toBe(1);
		expect(tabMatchCounts(schema, settings, 'Picture', false).dimensions).toBeGreaterThan(1);
		expect(tabMatchCounts(schema, settings, 'VideoPreset', true).video).toBe(1);
		expect(tabMatchCounts(schema, settings, 'AudioBitrate', true).audio).toBe(1);
		expect(tabMatchCounts(schema, settings, 'AudioMixdown', true).audio).toBe(0);
	});

	it('counts encoder block keys the schema does not list', () => {
		expect(tabMatchCounts(schema, settings, 'bit_depth', true).video).toBe(1);
		expect(tabMatchCounts(schema, settings, 'bit_depth', false).video).toBe(1);
	});

	it('has no stored audio items when AudioList is not a list', () => {
		const s = { common: { AudioList: 'x' } };
		expect(tabMatchCounts(schema, s, 'AudioBitrate', true).audio).toBe(0);
	});
});

describe('firstTabWithMatch', () => {
	it('stays on the current tab when it matches', () => {
		expect(firstTabWithMatch(zero({ video: 2, audio: 1 }), 'audio')).toBe('audio');
	});
	it('moves to the first tab with a match', () => {
		expect(firstTabWithMatch(zero({ video: 2, audio: 1 }), 'summary')).toBe('video');
	});
	it('stays put when nothing matches', () => {
		expect(firstTabWithMatch(zero(), 'filters')).toBe('filters');
	});
});
