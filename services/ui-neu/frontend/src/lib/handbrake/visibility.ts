// Which fields and encoder cards the sidebar shows under the search text and the changed-only filter.
// Pure functions.

import type { HandbrakeSchemaSlimView, SlimFamily, SlimKey } from '$lib/types/api.gen';
import { blockFields, type EncoderCard } from './encoder-cards';
import { keysForTab, type TabId } from './fields';
import { matchesKeyFilter } from './filter';

export type FilterState = { text: string; changedOnly: boolean };

const BIT_DEPTH_KEY = { name: 'bit_depth', label: 'Bit depth' } as SlimKey;

// Neither ARM-owned nor encoder-specific: a field of the preset's common settings.
export function isCommonKey(schema: HandbrakeSchemaSlimView, name: string): boolean {
	return !schema.arm_owned_keys.includes(name) && !schema.encoder_specific_keys.includes(name);
}

export function commonKeys(schema: HandbrakeSchemaSlimView, tab: TabId): SlimKey[] {
	return keysForTab(schema, tab).filter((k) => isCommonKey(schema, k.name));
}

function textMatch(key: SlimKey, text: string, schema?: HandbrakeSchemaSlimView): boolean {
	if (matchesKeyFilter(key, text)) return true;
	return key.type === 'list_obj' && (schema?.audio_item_keys ?? []).some((k) => matchesKeyFilter(k, text));
}

export function keyShown(key: SlimKey, stored: boolean, f: FilterState, schema?: HandbrakeSchemaSlimView): boolean {
	if (f.changedOnly && !stored) return false;
	return f.text.trim() === '' || textMatch(key, f.text, schema);
}

// Each card with its schema family; a card for a family this HandBrake build lacks has nothing to edit.
export function cardFamilies(
	cards: EncoderCard[],
	schema: HandbrakeSchemaSlimView
): Array<{ card: EncoderCard; family: SlimFamily }> {
	return cards.flatMap((card) => {
		const family = schema.families.find((f) => f.name === card.family);
		return family ? [{ card, family }] : [];
	});
}

export function cardShown(
	schema: HandbrakeSchemaSlimView,
	family: SlimFamily,
	block: Record<string, unknown>,
	f: FilterState
): boolean {
	if (f.changedOnly && Object.keys(block).length === 0) return false;
	if (f.text.trim() === '') return true;
	return [BIT_DEPTH_KEY, ...blockFields(schema, family)].some((k) => matchesKeyFilter(k, f.text));
}
