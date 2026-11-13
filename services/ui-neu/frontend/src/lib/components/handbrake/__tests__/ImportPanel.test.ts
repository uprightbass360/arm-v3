import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderComponent, screen, fireEvent, cleanup, waitFor } from '$lib/test-utils';
import type {
	EncoderAvailabilityView,
	HandbrakeSchemaSlimView,
	ImportParseResponse,
	ImportedPresetView
} from '$lib/types/api.gen';
import slim from '$lib/handbrake/__tests__/fixtures/slim-schema.json';
import plex from '$lib/handbrake/__tests__/fixtures/plex-import-response.json';
import { ApiError } from '$lib/api/client';
import { parseHandbrakeImport } from '$lib/api/transcodePresets';
import ImportPanel from '../ImportPanel.svelte';

vi.mock('$lib/api/transcodePresets', () => ({ parseHandbrakeImport: vi.fn() }));

const schema = slim as unknown as HandbrakeSchemaSlimView;
const PLEX = plex as unknown as ImportParseResponse;

function enc(id: string, label: string): EncoderAvailabilityView {
	return {
		id,
		label,
		group: 'any',
		engine: 'handbrake',
		kind: 'any',
		vendor: null,
		codec: null,
		available: true,
		reason: null
	};
}
const AVAILABILITY = [
	enc('any_h264', 'Any H.264'),
	enc('x264', 'CPU x264'),
	enc('qsv_h264', 'Intel QSV H.264'),
	enc('nvenc_h264', 'NVIDIA H.264')
];

function mount(loaded: HandbrakeSchemaSlimView | null = schema) {
	const oncancel = vi.fn();
	const onuse = vi.fn();
	renderComponent(ImportPanel, { props: { schema: loaded, availability: AVAILABILITY, oncancel, onuse } });
	return { oncancel, onuse };
}

async function paste(text: string) {
	await fireEvent.input(screen.getByLabelText('Or paste the export JSON'), { target: { value: text } });
}

async function readFile() {
	await fireEvent.click(screen.getByRole('button', { name: 'Read file' }));
}

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});

describe('step 1', () => {
	it('disables Read file while the text is empty', async () => {
		mount();
		const button = screen.getByRole('button', { name: 'Read file' });
		expect(button).toBeDisabled();
		await paste('{}');
		expect(button).toBeEnabled();
	});

	it('shows a parse error inline and stays on step 1', async () => {
		vi.mocked(parseHandbrakeImport).mockRejectedValue(new ApiError(422, 'This is not a HandBrake export', null));
		mount();
		await paste('nope');
		await readFile();
		expect(await screen.findByRole('alert')).toHaveTextContent('This is not a HandBrake export');
		expect(screen.getByLabelText('Or paste the export JSON')).toHaveValue('nope');
		expect(screen.queryByText('Review the import')).not.toBeInTheDocument();
	});

	it('shows a generic message for an error that is not an Error', async () => {
		vi.mocked(parseHandbrakeImport).mockRejectedValue('boom');
		mount();
		await paste('x');
		await readFile();
		expect(await screen.findByRole('alert')).toHaveTextContent('Could not read the file');
	});

	it('disables Read file while the request is in flight', async () => {
		vi.mocked(parseHandbrakeImport).mockReturnValue(new Promise(() => {}));
		mount();
		await paste('x');
		await readFile();
		expect(await screen.findByRole('button', { name: 'Reading...' })).toBeDisabled();
	});

	it('loads a chosen file into the text box', async () => {
		mount();
		const file = new File(['{"a":1}'], 'export.json', { type: 'application/json' });
		await fireEvent.change(screen.getByLabelText('HandBrake export file'), { target: { files: [file] } });
		await waitFor(() => expect(screen.getByLabelText('Or paste the export JSON')).toHaveValue('{"a":1}'));
	});

	it('ignores a file dialog that chose nothing', async () => {
		mount();
		await fireEvent.change(screen.getByLabelText('HandBrake export file'), { target: { files: [] } });
		expect(screen.getByLabelText('Or paste the export JSON')).toHaveValue('');
	});

	it('Cancel calls oncancel', async () => {
		const { oncancel } = mount();
		await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
		expect(oncancel).toHaveBeenCalledTimes(1);
	});
});

describe('step 2 with the Plex export', () => {
	async function review() {
		vi.mocked(parseHandbrakeImport).mockResolvedValue(PLEX);
		const handles = mount();
		await paste('{"PresetList":[]}');
		await readFile();
		await screen.findByText('Review the import');
		return handles;
	}

	it('sends the pasted text as the body', async () => {
		await review();
		expect(parseHandbrakeImport).toHaveBeenCalledWith('{"PresetList":[]}');
	});

	it('shows the labelled values, counts and notes', async () => {
		await review();
		expect(screen.getByText('Encoder in the file').nextElementSibling).toHaveTextContent('NVIDIA H.264');
		expect(screen.getByText('Codec and bit depth').nextElementSibling).toHaveTextContent('H.264, 8-bit');
		expect(screen.getByText('Encoder in ARM').nextElementSibling).toHaveTextContent('Any H.264');
		expect(screen.getByText('Container').nextElementSibling).toHaveTextContent('mkv');
		expect(screen.getByText('Stored for NVIDIA H.264')).toBeInTheDocument();
		expect(screen.getByText('Bit depth 8 also set for Intel QSV H.264, CPU x264')).toBeInTheDocument();
		expect(screen.getByText('Video').nextElementSibling).not.toHaveTextContent('0');
		expect(screen.getByText('Total')).toBeInTheDocument();
		expect(screen.getByText('Only bit depth is copied. Other encoders keep their defaults.')).toBeInTheDocument();
		expect(screen.getByText(/^Not used by NVIDIA H\.264, not imported: VideoMultiPass/)).toBeInTheDocument();
		expect(screen.getByText('1 key dropped (not in HandBrake 1.11.1): VideoColorMatrixCode')).toBeInTheDocument();
	});

	it('shows no pick list for one preset, and eight-bit-only families when present', async () => {
		const withEight = { ...PLEX, presets: [{ ...PLEX.presets[0], eight_bit_only: ['x264'], copied_depth_to: [] }] };
		vi.mocked(parseHandbrakeImport).mockResolvedValue(withEight);
		mount();
		await paste('x');
		await readFile();
		expect(await screen.findByText('CPU x264: 8-bit on this encoder')).toBeInTheDocument();
		expect(screen.queryByRole('radio')).not.toBeInTheDocument();
	});

	it('Back returns to step 1 with the text kept', async () => {
		await review();
		await fireEvent.click(screen.getByRole('button', { name: 'Back' }));
		expect(screen.getByLabelText('Or paste the export JSON')).toHaveValue('{"PresetList":[]}');
	});

	it('Use these settings hands the preset over', async () => {
		const { onuse } = await review();
		await fireEvent.click(screen.getByRole('button', { name: 'Use these settings' }));
		expect(onuse).toHaveBeenCalledWith(PLEX.presets[0]);
	});
});

describe('step 2 with several presets', () => {
	const base = PLEX.presets[0];
	const response: ImportParseResponse = {
		...PLEX,
		presets: [
			{ ...base, path: ['Plex'], name: 'Broken', proposal: null, importable: false, reason: 'No video encoder' },
			{ ...base, path: ['Plex', 'Movies'], name: 'Good' } as ImportedPresetView,
			{ ...base, path: [], name: 'Other', source_encoder: 'x264' } as ImportedPresetView
		]
	};

	async function review() {
		vi.mocked(parseHandbrakeImport).mockResolvedValue(response);
		const handles = mount();
		await paste('x');
		await readFile();
		return handles;
	}

	it('lists them with their path, disables the unimportable one with its reason, and preselects the first importable', async () => {
		await review();
		const radios = await screen.findAllByRole('radio');
		expect(radios).toHaveLength(3);
		expect(radios[0]).toBeDisabled();
		expect(screen.getByText('No video encoder')).toBeInTheDocument();
		expect(screen.getByText('Plex / Movies / Good')).toBeInTheDocument();
		expect(radios[1]).toBeChecked();
	});

	it('reviews the preset picked', async () => {
		const { onuse } = await review();
		await fireEvent.click((await screen.findAllByRole('radio'))[2]);
		expect(screen.getByText('Encoder in the file').nextElementSibling).toHaveTextContent('CPU x264');
		await fireEvent.click(screen.getByRole('button', { name: 'Use these settings' }));
		expect(onuse).toHaveBeenCalledWith(response.presets[2]);
	});
});

describe('a single unimportable preset', () => {
	it('shows its reason and disables Use these settings', async () => {
		const only = { ...PLEX.presets[0], proposal: null, importable: false, reason: 'No video encoder' };
		vi.mocked(parseHandbrakeImport).mockResolvedValue({ ...PLEX, presets: [only] });
		mount();
		await paste('x');
		await readFile();
		expect(await screen.findByText('No video encoder')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Use these settings' })).toBeDisabled();
	});

	it('copes with an empty list', async () => {
		vi.mocked(parseHandbrakeImport).mockResolvedValue({ ...PLEX, presets: [] });
		mount();
		await paste('x');
		await readFile();
		expect(await screen.findByRole('button', { name: 'Use these settings' })).toBeDisabled();
	});
});

describe('before the schema has loaded', () => {
	it('still offers the picked preset without a review', async () => {
		vi.mocked(parseHandbrakeImport).mockResolvedValue(PLEX);
		mount(null);
		await paste('x');
		await readFile();
		expect(await screen.findByText('Review the import')).toBeInTheDocument();
		expect(screen.queryByText('Encoder in the file')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Use these settings' })).toBeEnabled();
	});
});
