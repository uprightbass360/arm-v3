// The transcode preset sidebar's decisions: the editable draft, the request
// bodies it saves as, which fields and cards show, and how a failed save reads.
// Pure functions; the sidebar component does the I/O.

import { ApiError, saveErrorMessage } from '$lib/api/client';
import type {
	ContainerFormat,
	HandbrakeSchemaSlimView,
	HandbrakeSettings,
	MediaType,
	SettingIssue,
	SlimFamily,
	SlimKey,
	TranscodePresetCreateRequest,
	TranscodePresetUpdateRequest,
	TranscodePresetView,
	TranscodeTool
} from '$lib/types/api.gen';
import { blockFields, encoderCards, type EncoderCard } from './encoderCards';
import { keysForTab, type TabId } from './fields';
import { matchesFilter } from './filter';
import { pruneUnreachable, toPayload } from './settingsEdit';

export type SidebarMode = 'new' | 'edit' | 'view';
export type BaseValues = Record<string, unknown> | null;
export type FilterState = { text: string; changedOnly: boolean };
export type PresetField = 'name' | 'media_type' | 'tool' | 'preset_ref' | 'container' | 'encoder' | 'extra_args';

export interface Draft {
	name: string;
	media_type: MediaType;
	tool: TranscodeTool;
	preset_ref: string | null;
	container: ContainerFormat;
	encoder: string;
	extra_args: string;
	settings: HandbrakeSettings;
}

export const CPU_HERE_NOTE = 'Encodes on CPU on this host: no verified non-AMD GPU for this codec';
export const VAAPI_NOTE =
	'HandBrake settings do not apply to AMD VAAPI encoders. Only the container and extra args are used.';
export const AMD_NOTE = 'AMD devices run ffmpeg and cannot apply these settings, so a preset that has any skips them.';
export const MARKED_ISSUES_MESSAGE = 'Fix the marked settings and save again.';

const PRESET_ENCODER = 'preset';
const LOCKED_TOOLS: TranscodeTool[] = ['abcde', 'none'];
// HandBrake's VideoQualityType when neither the preset, the base nor the template names one: constant quality.
const CONSTANT_QUALITY = 2;
const DEFAULT_DEPTH = 8;
const TITLES: Record<SidebarMode, string> = {
	new: 'New transcode preset',
	edit: 'Edit transcode preset',
	view: 'View transcode preset'
};
// Mirrors arm_common.handbrake_schema.overlay: keys ARM sets itself, and keys
// that live in a per-encoder block. Neither is a common field.
const ARM_OWNED_KEYS = new Set([
	'PresetName',
	'PresetDescription',
	'Type',
	'Default',
	'Folder',
	'FolderOpen',
	'ChildrenArray',
	'PresetDisabled',
	'VideoEncoder',
	'FileFormat',
	'VideoHWDecode'
]);
const ENCODER_SPECIFIC_KEYS = new Set([
	'VideoPreset',
	'VideoTune',
	'VideoProfile',
	'VideoLevel',
	'VideoOptionExtra',
	'VideoQualitySlider',
	'VideoMultiPass',
	'VideoTurboMultiPass',
	'x264UseAdvancedOptions'
]);
const PRESET_FIELDS = new Set(['name', 'media_type', 'tool', 'preset_ref', 'container', 'encoder', 'extra_args']);

function settingsOf(s: HandbrakeSettings | null): Required<HandbrakeSettings> {
	return { common: s?.common ?? {}, encoders: s?.encoders ?? {} };
}

export function initialDraft(preset: TranscodePresetView | null): Draft {
	return {
		name: preset?.name ?? '',
		media_type: preset?.media_type ?? 'movie',
		tool: preset?.tool ?? 'handbrake',
		preset_ref: preset?.preset_ref ?? null,
		container: preset?.container ?? 'mkv',
		encoder: preset?.encoder ?? PRESET_ENCODER,
		extra_args: preset?.extra_args ?? '',
		settings: settingsOf(preset?.handbrake_settings ?? null)
	};
}

export function showTabs(d: Draft): boolean {
	return d.tool === 'handbrake' && !d.encoder.startsWith('vaapi_');
}

// Settings the tabs cannot show are not sent: the encoder would ignore them.
function settingsPayload(d: Draft): HandbrakeSettings | null {
	return showTabs(d) ? toPayload(d.settings) : null;
}

export function draftToUpdate(d: Draft): TranscodePresetUpdateRequest {
	return {
		name: d.name,
		tool: d.tool,
		preset_ref: d.preset_ref,
		container: d.container,
		encoder: d.encoder,
		extra_args: d.extra_args || null,
		handbrake_settings: settingsPayload(d)
	};
}

export function draftToCreate(d: Draft): TranscodePresetCreateRequest {
	return {
		...draftToUpdate(d),
		name: d.name,
		media_type: d.media_type,
		tool: d.tool,
		container: d.container,
		encoder: d.encoder
	};
}

// abcde and none run their own encoder, so a codec encoder would 422.
export function onToolChange(d: Draft, tool: TranscodeTool): Draft {
	return { ...d, tool, encoder: LOCKED_TOOLS.includes(tool) ? PRESET_ENCODER : d.encoder };
}

// Drops the blocks of families the new encoder can never reach (Review Focus 4).
export function onEncoderChange(
	d: Draft,
	encoderId: string,
	schema: HandbrakeSchemaSlimView,
	baseEncoder: string | null = null
): Draft {
	const reachable = encoderCards(encoderId, d.preset_ref, schema, [], baseEncoder).map((c) => c.family);
	return { ...d, encoder: encoderId, settings: pruneUnreachable(d.settings, reachable) };
}

// One preset-block edit. Without a schema the blocks cannot be pruned, so an encoder change only sets the id.
export function applyField(
	d: Draft,
	field: PresetField,
	value: string,
	schema: HandbrakeSchemaSlimView | null,
	baseEncoder: string | null
): Draft {
	if (field === 'tool') return onToolChange(d, value as TranscodeTool);
	if (field === 'encoder') return schema ? onEncoderChange(d, value, schema, baseEncoder) : { ...d, encoder: value };
	if (field === 'preset_ref') return { ...d, preset_ref: value || null };
	return { ...d, [field]: value };
}

export function footerNote(preset: TranscodePresetView | null): string | null {
	return preset?.host_notes?.includes('encodes_on_cpu_here') ? CPU_HERE_NOTE : null;
}

export function settingsCount(s: HandbrakeSettings | null): number {
	const n = settingsOf(s);
	return Object.keys(n.common).length + Object.values(n.encoders).reduce((sum, b) => sum + Object.keys(b).length, 0);
}

export interface RowFlags {
	settings: string | null;
	needsReview: boolean;
	cpuHere: boolean;
}

// What a Transcode presets list row adds to its attribute line; nothing for a rip preset (null).
export function rowFlags(preset: TranscodePresetView | null): RowFlags {
	const count = settingsCount(preset?.handbrake_settings ?? null);
	return {
		settings: count === 0 ? null : `${count} ${count === 1 ? 'setting' : 'settings'}`,
		needsReview: (preset?.issues ?? []).length > 0,
		cpuHere: footerNote(preset) !== null
	};
}

export function sidebarTitle(mode: SidebarMode): string {
	return TITLES[mode];
}

export function usageLabel(count: number): string {
	return `Used by ${count} ${count === 1 ? 'session' : 'sessions'}`;
}

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

// R2: the base's VideoEncoder depth when it is this family, else 8.
export function inheritedDepth(family: SlimFamily, base: BaseValues): { depth: number; source: 'base' | 'default' } {
	const encoder = baseVideoEncoder(base);
	const variant = family.variants.find((v) => v.encoder === encoder);
	return variant ? { depth: variant.depth, source: 'base' } : { depth: DEFAULT_DEPTH, source: 'default' };
}

function isCommonKey(name: string): boolean {
	return !ARM_OWNED_KEYS.has(name) && !ENCODER_SPECIFIC_KEYS.has(name);
}

export function commonKeys(schema: HandbrakeSchemaSlimView, tab: TabId): SlimKey[] {
	return keysForTab(schema, tab).filter((k) => isCommonKey(k.name));
}

function textMatch(key: SlimKey, text: string, schema?: HandbrakeSchemaSlimView): boolean {
	if (matchesFilter(key, text)) return true;
	return key.type === 'list_obj' && (schema?.audio_item_keys ?? []).some((k) => matchesFilter(k, text));
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

const BIT_DEPTH_KEY = { name: 'bit_depth', label: 'Bit depth' } as SlimKey;

export function cardShown(
	schema: HandbrakeSchemaSlimView,
	family: SlimFamily,
	block: Record<string, unknown>,
	f: FilterState
): boolean {
	if (f.changedOnly && Object.keys(block).length === 0) return false;
	if (f.text.trim() === '') return true;
	return [BIT_DEPTH_KEY, ...blockFields(schema, family)].some((k) => matchesFilter(k, f.text));
}

export function issuesFor(
	issues: SettingIssue[],
	key: string,
	encoder: string | null = null
): SettingIssue | undefined {
	return issues.find((i) => i.key === key && (i.encoder ?? null) === encoder);
}

function isPlaced(i: SettingIssue, rendered: Set<string>): boolean {
	if (i.encoder) return rendered.size > 0 && ENCODER_SPECIFIC_KEYS.has(i.key);
	return PRESET_FIELDS.has(i.key) || rendered.has(i.key);
}

// Issues no field shows (the whole settings object, unknown keys, bit depth):
// the sidebar lists these in its banner instead.
export function unplacedIssues(issues: SettingIssue[], schema: HandbrakeSchemaSlimView | null): SettingIssue[] {
	const keys = schema ? [...schema.keys, ...schema.audio_item_keys] : [];
	const rendered = new Set(keys.map((k) => k.name).filter(isCommonKey));
	return issues.filter((i) => !isPlaced(i, rendered));
}

// What LoadState shows while the schema store is unavailable; null otherwise.
export function schemaLoadError(state: string, message: string | null): Error | null {
	return state === 'unavailable' ? new Error(message ?? 'No HandBrake schema loaded yet') : null;
}

export interface SaveFailure {
	issues: SettingIssue[] | null;
	message: string;
	schemaMissing: boolean;
}

function issueList(body: unknown): SettingIssue[] | null {
	const detail = (body as { detail?: { issues?: unknown } } | null)?.detail;
	return Array.isArray(detail?.issues) ? (detail.issues as SettingIssue[]) : null;
}

export function saveFailure(e: unknown): SaveFailure {
	const issues = e instanceof ApiError && e.status === 422 ? issueList(e.body) : null;
	if (issues) return { issues, message: MARKED_ISSUES_MESSAGE, schemaMissing: false };
	const schemaMissing = e instanceof ApiError && e.status === 503;
	return { issues: null, message: saveErrorMessage(e), schemaMissing };
}
