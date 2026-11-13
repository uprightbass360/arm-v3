import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderComponent, screen, fireEvent, cleanup, waitFor } from '$lib/test-utils';
import PresetRow from '../PresetRow.svelte';

// PresetRow labels a transcode preset's encoder id via the shared
// encoders store (GET /api/encoders, cached); stub the fetch it triggers
// on mount so the "Any GPU H.265" label resolves deterministically.
vi.mock('$lib/api/encoders', () => ({
	fetchEncoders: () =>
		Promise.resolve([
			{
				id: 'any_h265',
				label: 'Any GPU H.265',
				group: 'any',
				engine: 'handbrake',
				kind: 'any',
				vendor: null,
				codec: 'h265',
				available: true,
				reason: null
			}
		])
}));

const ripPreset = (over = {}) => ({
	id: 'r1',
	name: 'Movie: Main Feature',
	media_type: 'movie' as const,
	is_builtin: false,
	track_selection: 'main_feature' as const,
	identification_mode: 'required' as const,
	output_mode: 'tracks' as const,
	track_filters_json: null,
	created_by_user_id: null,
	created_at: null,
	updated_at: null,
	...over
});

const transcodePreset = (over = {}) => ({
	id: 't1',
	name: 'H.265 MKV',
	media_type: 'movie' as const,
	is_builtin: false,
	tool: 'handbrake' as const,
	preset_ref: null,
	handbrake_settings: null,
	container: 'mkv' as const,
	encoder: 'any_h265',
	extra_args: null,
	created_by_user_id: null,
	created_at: null,
	updated_at: null,
	...over
});

afterEach(cleanup);

describe('PresetRow — rip preset (custom)', () => {
	it('renders name, id, and summary', () => {
		renderComponent(PresetRow, {
			kind: 'rip',
			preset: ripPreset(),
			usedBy: 0,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		expect(screen.getByText('Movie: Main Feature')).toBeInTheDocument();
		expect(screen.getByText('r1')).toBeInTheDocument();
		// Summary: track_selection · identification_mode · output_mode
		expect(screen.getByText(/main feature.*id required.*tracks/i)).toBeInTheDocument();
	});

	it('shows Used by 0 chip', () => {
		renderComponent(PresetRow, {
			kind: 'rip',
			preset: ripPreset(),
			usedBy: 0,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		expect(screen.getByText(/used by 0/i)).toBeInTheDocument();
	});

	it('shows media type pill', () => {
		renderComponent(PresetRow, {
			kind: 'rip',
			preset: ripPreset(),
			usedBy: 0,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		// The pill span contains "Movie" (exact, not partial match on the name)
		expect(screen.getAllByText(/movie/i).length).toBeGreaterThan(0);
	});

	it('custom preset shows Edit (not View)', () => {
		renderComponent(PresetRow, {
			kind: 'rip',
			preset: ripPreset({ is_builtin: false }),
			usedBy: 0,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /^view$/i })).not.toBeInTheDocument();
	});

	it('custom preset with usedBy=0 has enabled Delete', () => {
		renderComponent(PresetRow, {
			kind: 'rip',
			preset: ripPreset({ is_builtin: false }),
			usedBy: 0,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		const del = screen.getByRole('button', { name: /delete/i }) as HTMLButtonElement;
		expect(del.disabled).toBe(false);
	});

	it('calls onedit when Edit clicked', async () => {
		const onedit = vi.fn();
		renderComponent(PresetRow, {
			kind: 'rip',
			preset: ripPreset({ is_builtin: false }),
			usedBy: 0,
			onview: vi.fn(),
			onedit,
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		await fireEvent.click(screen.getByRole('button', { name: /edit/i }));
		expect(onedit).toHaveBeenCalled();
	});

	it('calls onclone when Clone clicked', async () => {
		const onclone = vi.fn();
		renderComponent(PresetRow, {
			kind: 'rip',
			preset: ripPreset(),
			usedBy: 0,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone,
			ondelete: vi.fn()
		});
		await fireEvent.click(screen.getByRole('button', { name: /clone/i }));
		expect(onclone).toHaveBeenCalled();
	});

	it('calls ondelete when Delete clicked (custom, usedBy=0)', async () => {
		const ondelete = vi.fn();
		renderComponent(PresetRow, {
			kind: 'rip',
			preset: ripPreset({ is_builtin: false }),
			usedBy: 0,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete
		});
		await fireEvent.click(screen.getByRole('button', { name: /delete/i }));
		expect(ondelete).toHaveBeenCalled();
	});

	it('disables delete for in-use preset with reason', () => {
		renderComponent(PresetRow, {
			kind: 'rip',
			preset: {
				id: 'r1',
				name: 'Rip',
				media_type: 'movie',
				is_builtin: false,
				track_selection: 'main_feature',
				identification_mode: 'required',
				output_mode: 'tracks'
			},
			usedBy: 2,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		const del = screen.getByRole('button', { name: /delete/i }) as HTMLButtonElement;
		expect(del.disabled).toBe(true);
		expect(del.getAttribute('title')).toMatch(/used by 2|repoint/i);
	});
});

describe('PresetRow — rip preset (builtin)', () => {
	it('shows BUILT-IN badge', () => {
		renderComponent(PresetRow, {
			kind: 'rip',
			preset: ripPreset({ is_builtin: true }),
			usedBy: 0,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		expect(screen.getByText('BUILT-IN')).toBeInTheDocument();
	});

	it('builtin shows View label (no Edit button)', () => {
		renderComponent(PresetRow, {
			kind: 'rip',
			preset: ripPreset({ is_builtin: true }),
			usedBy: 0,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		expect(screen.getByRole('button', { name: /^view$/i })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /^edit$/i })).not.toBeInTheDocument();
	});

	it('builtin View opens read-only via onview, not onedit', async () => {
		const onview = vi.fn();
		const onedit = vi.fn();
		renderComponent(PresetRow, {
			kind: 'rip',
			preset: ripPreset({ is_builtin: true }),
			usedBy: 0,
			onview,
			onedit,
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		await fireEvent.click(screen.getByRole('button', { name: /^view$/i }));
		expect(onview).toHaveBeenCalled();
		expect(onedit).not.toHaveBeenCalled();
	});

	it('builtin delete is disabled with builtin reason', () => {
		renderComponent(PresetRow, {
			kind: 'rip',
			preset: ripPreset({ is_builtin: true }),
			usedBy: 0,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		const del = screen.getByRole('button', { name: /delete/i }) as HTMLButtonElement;
		expect(del.disabled).toBe(true);
		expect(del.getAttribute('title')).toMatch(/built-in|clone to edit/i);
	});
});

describe('PresetRow — transcode preset', () => {
	it('renders transcode name and id', () => {
		renderComponent(PresetRow, {
			kind: 'transcode',
			preset: transcodePreset(),
			usedBy: 0,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		expect(screen.getByText('H.265 MKV')).toBeInTheDocument();
		expect(screen.getByText('t1')).toBeInTheDocument();
	});

	it('renders transcode summary: tool · container · encoder', async () => {
		renderComponent(PresetRow, {
			kind: 'transcode',
			preset: transcodePreset({ tool: 'handbrake', container: 'mkv', encoder: 'any_h265' }),
			usedBy: 0,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		await waitFor(() => expect(screen.getByText(/handbrake.*mkv.*any gpu h\.265/i)).toBeInTheDocument());
	});

	it("omits the encoder part when the preset uses the tool's own encoder", () => {
		renderComponent(PresetRow, {
			kind: 'transcode',
			preset: transcodePreset({ encoder: 'preset' }),
			usedBy: 0,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		// A passthrough preset reads as tool and container only: no dangling separators.
		expect(screen.queryByText(/\| - \|/)).toBeNull();
		expect(screen.queryByText(/\|\s*$/)).toBeNull();
		// and the two set parts are still there, joined once
		expect(screen.getByText(/^[\w ]+ \| [\w ]+$/)).toBeInTheDocument();
	});

	it('shows Used by N chip for transcode', () => {
		renderComponent(PresetRow, {
			kind: 'transcode',
			preset: transcodePreset(),
			usedBy: 3,
			onview: vi.fn(),
			onedit: vi.fn(),
			onclone: vi.fn(),
			ondelete: vi.fn()
		});
		expect(screen.getByText(/used by 3/i)).toBeInTheDocument();
	});
});

describe('PresetRow — transcode preset HandBrake settings', () => {
	const props = (over = {}) => ({
		kind: 'transcode' as const,
		preset: transcodePreset(over),
		usedBy: 0,
		onview: vi.fn(),
		onedit: vi.fn(),
		onclone: vi.fn(),
		ondelete: vi.fn()
	});

	it('shows the count of stored settings, common and per encoder', () => {
		renderComponent(
			PresetRow,
			props({ handbrake_settings: { common: { A: 1, B: 2 }, encoders: { x265: { VideoTune: 'grain' } } } })
		);
		expect(screen.getByText('3 settings')).toBeInTheDocument();
	});

	it('says "1 setting" for one', () => {
		renderComponent(PresetRow, props({ handbrake_settings: { common: { A: 1 }, encoders: {} } }));
		expect(screen.getByText('1 setting')).toBeInTheDocument();
	});

	it('shows no count, badge or host note for a plain preset', () => {
		renderComponent(PresetRow, props());
		expect(screen.queryByText(/\d+ settings?$/)).not.toBeInTheDocument();
		expect(screen.queryByText('Needs review')).not.toBeInTheDocument();
		expect(screen.queryByText('Encodes on CPU on this host')).not.toBeInTheDocument();
	});

	it('shows "Needs review" when the preset has issues', () => {
		renderComponent(
			PresetRow,
			props({ issues: [{ key: 'preset_ref', encoder: null, code: 'not_in_list', message: 'gone' }] })
		);
		expect(screen.getByText('Needs review')).toBeInTheDocument();
	});

	it('shows the CPU host note', () => {
		renderComponent(PresetRow, props({ host_notes: ['encodes_on_cpu_here'] }));
		expect(screen.getByText('Encodes on CPU on this host')).toBeInTheDocument();
	});

	it('shows none of these on a rip preset', () => {
		renderComponent(PresetRow, { ...props(), kind: 'rip' as const, preset: ripPreset() });
		expect(screen.queryByText('Needs review')).not.toBeInTheDocument();
		expect(screen.queryByText(/settings?$/)).not.toBeInTheDocument();
	});
});
