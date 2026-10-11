import type { Page, Route } from '@playwright/test';
import type {
	ConfigView,
	GpuView,
	NotificationInboxCountView,
	SetupStatusPublic,
	SetupView,
	SystemResourcesResponse,
	SystemVersionResponse,
	TranscodeStatsView,
	UserView
} from '$lib/types/api.gen';
import { settingsSchema } from './_schema';

// Shared request mocks for the visual suite. The app shell (src/routes/+layout.*)
// touches the backend on every page: +layout.ts hydrates /api/config and runs
// the first-run guard against /api/setup/status, +layout.svelte starts the
// dashboard poll (a six-endpoint fan-out), the resource footer, the theme
// list, and the /ws live-updates socket. `mockShell` answers all of those so a
// spec only has to describe the endpoint(s) its own page reads, and it fails
// closed: any /api request nothing mocked gets a 404 and is recorded in the
// returned `unmocked` list so the spec can assert the page never touched the
// real backend (an unmocked request would otherwise hit the vite proxy,
// ECONNREFUSED, and render an error or empty state instead of the one the
// spec names).

/** Clock the pages render against, so relative times ("3 days ago") and the
 *  stamped fixtures below never drift between runs. */
export const FROZEN_NOW = new Date('2026-10-01T12:00:00Z');
const STAMP = '2026-09-28T09:30:00Z';

export function json(body: unknown, status = 200): Parameters<Route['fulfill']>[0] {
	return { status, contentType: 'application/json', body: JSON.stringify(body) };
}

export const mockConfig: ConfigView = {
	tmdb_api_key: '<hidden>',
	omdb_api_key: null,
	tvdb_api_key: '<hidden>',
	makemkv_key: '<hidden>',
	musicbrainz_user_agent: null,
	auto_transcode_on_idle: true,
	auto_rip_on_insert: true,
	block_on_miss: false,
	community_keydb_enabled: true,
	drive_scan_interval_seconds: 5,
	drive_detected_prune_days: 30,
	max_parallel_transcodes: 2,
	max_parallel_iso_rips: 1,
	transcode_enabled: true,
	transcode_capable: true,
	makemkv_sdf_enabled: true,
	thediscdb_enabled: true,
	thediscdb_refresh_days: 7,
	episode_sources: ['tmdb', 'tvdb', 'tvmaze'],
	disc_hint_sources: ['bd_title', 'label'],
	episode_match_tolerance_seconds: 90,
	episode_auto_apply: true,
	ripping_paused: false,
	hold_for_review: false,
	manual_wait_seconds: 60,
	default_retention_policy: 'keep_forever',
	notification_apprise_urls: [],
	notifications_enabled: true,
	metadata_provider: 'tmdb',
	makemkv_key_valid: true,
	makemkv_key_state: null,
	makemkv_key_checked_at: STAMP,
	makemkv_key_checked_by_drive_id: null,
	updated_by_user_id: null,
	updated_at: STAMP
};

export const mockInfra = {
	MEDIA_ROOT: '/home/arm/media',
	RAW_ROOT: '/home/arm/media/raw',
	ISO_INGRESS_ROOT: '/home/arm/media/iso',
	BIND_PORT: '8080',
	ARM_DOCKER_NETWORK: 'arm',
	ARM_GPUS: ''
};

export const mockResources: SystemResourcesResponse = {
	cpu_percent: 12,
	cpu_temp: 41,
	memory: { total_gb: 32, used_gb: 9.6, free_gb: 22.4, percent: 30 },
	storage: [
		{ name: 'MEDIA_ROOT', path: '/home/arm/media', total_gb: 2000, used_gb: 800, free_gb: 1200, percent: 40 },
		{ name: 'RAW_ROOT', path: '/home/arm/media/raw', total_gb: 500, used_gb: 125, free_gb: 375, percent: 25 }
	]
};

export const mockVersion: SystemVersionResponse = { version: '3.0.0-test' };

export const mockTranscodeStats: TranscodeStatsView = {
	tasks_by_status: {},
	total_tasks: 0,
	gpus_total: 0,
	gpus_available: 0,
	max_parallel: 2
};

export const mockInboxCount: NotificationInboxCountView = { unseen: 0, seen: 0, cleared: 0, total: 0 };

/** The two built-in accounts; the setup account step's guest-access switch
 *  only renders when a `guest` user exists. */
export const mockUsers: UserView[] = [
	{ id: 'user-admin', username: 'admin', role: 'admin', disabled: false, last_login_at: STAMP },
	{ id: 'user-guest', username: 'guest', role: 'guest', disabled: false, last_login_at: null }
];

export const mockGpus: GpuView[] = [
	{
		id: 'gpu-nvenc-0',
		vendor: 'nvenc',
		device_path: '/dev/nvidia0',
		encoder_kinds: ['h264_nvenc', 'hevc_nvenc', 'av1_nvenc'],
		status: 'available',
		enabled: true,
		claimed_by_task_id: null,
		last_seen_at: STAMP,
		probed_at: STAMP,
		probe_error: null
	},
	{
		id: 'gpu-vaapi-0',
		vendor: 'vaapi',
		device_path: '/dev/dri/renderD128',
		encoder_kinds: ['h264_vaapi', 'hevc_vaapi'],
		status: 'busy',
		enabled: true,
		claimed_by_task_id: 'task-01',
		last_seen_at: STAMP,
		probed_at: STAMP,
		probe_error: null
	},
	{
		id: 'gpu-qsv-0',
		vendor: 'qsv',
		device_path: '/dev/dri/renderD129',
		encoder_kinds: [],
		status: 'available',
		enabled: false,
		claimed_by_task_id: null,
		last_seen_at: STAMP,
		probed_at: null,
		probe_error: null
	}
];

/** A finished walkthrough: the dashboard's checklist card stays hidden. */
export const completedSetup: SetupView = {
	completed_at: STAMP,
	progress: Object.fromEntries(
		['account', 'system', 'drives', 'makemkv', 'metadata', 'discs', 'transcoding', 'notifications', 'finish'].map(
			(step) => [step, { state: 'done', at: STAMP }]
		)
	),
	current_step: 'finish',
	admin_default_password: false,
	checklist_dismissed: true
};

/** A box on its first boot: nothing recorded, admin still on the default password. */
export const firstRunSetup: SetupView = {
	completed_at: null,
	progress: {},
	current_step: 'account',
	admin_default_password: true,
	checklist_dismissed: false
};

export interface ShellMockOptions {
	/** Seed an admin session (JWT + role in localStorage) before the page loads. */
	admin?: boolean;
	/** What /api/setup/status reports; the admin is redirected to /setup when true. */
	firstRun?: boolean;
	config?: Partial<ConfigView>;
}

export interface ShellMocks {
	/** Every /api request no mock answered: "GET /api/foo". Specs assert it stays empty. */
	unmocked: string[];
}

/** Mount the shell-level mocks. Call before `page.goto`; register the spec's
 *  own `page.route`s after it so they take precedence (Playwright matches the
 *  most recently registered route first). */
export async function mockShell(page: Page, opts: ShellMockOptions = {}): Promise<ShellMocks> {
	const unmocked: string[] = [];
	const config: ConfigView = { ...mockConfig, ...opts.config };
	const status: SetupStatusPublic = { first_run: opts.firstRun === true, arm_version: mockVersion.version };

	await page.clock.setFixedTime(FROZEN_NOW);

	if (opts.admin) {
		await page.addInitScript(() => {
			localStorage.setItem('arm_token', 'visual-suite-token');
			localStorage.setItem('arm_role', 'admin');
		});
	}

	// Lowest priority: fail closed and record what slipped through.
	await page.route(
		(url) => url.pathname.startsWith('/api/'),
		(route) => {
			const req = route.request();
			unmocked.push(`${req.method()} ${new URL(req.url()).pathname}`);
			return route.fulfill(json({ detail: 'unmocked request in the visual suite' }, 404));
		}
	);

	const table: Array<[string, unknown]> = [
		['/api/setup/status', status],
		['/api/setup', opts.firstRun ? firstRunSetup : completedSetup],
		['/api/config', config],
		['/api/jobs', []],
		['/api/drives', []],
		// Settings rescans on mount (POST) before it starts its drive poll.
		['/api/drives/rescan', { online: 0, stale: 0 }],
		['/api/transcodes', []],
		['/api/transcodes/stats', mockTranscodeStats],
		['/api/transcodes/workers', []],
		['/api/notifications/inbox', []],
		['/api/notifications/inbox/count', mockInboxCount],
		['/api/notifications/channels', []],
		['/api/themes', []],
		['/api/system/resources', mockResources],
		['/api/system/version', mockVersion],
		['/api/settings/schema', settingsSchema],
		['/api/settings/infra', mockInfra],
		['/api/encoders', []],
		['/api/gpus', []],
		['/api/sessions', []],
		['/api/transcode-presets', []],
		['/api/rip-presets', []],
		['/api/users', mockUsers]
	];
	for (const [path, body] of table) {
		await page.route(
			(url) => url.pathname === path,
			(route) => route.fulfill(json(body))
		);
	}

	// The live-updates socket: answer the client's auth frame with the empty
	// ack it waits for, so wsStatus settles on 'online' instead of the
	// "Live updates unavailable" banner after two failed connects.
	await page.routeWebSocket(
		(url) => url.pathname === '/ws',
		(ws) => {
			ws.onMessage((message) => {
				const frame = JSON.parse(String(message)) as { op?: string; topic?: string };
				if (frame.op === 'auth') ws.send(JSON.stringify({ op: 'ack', topic: '' }));
				else if (frame.op === 'subscribe') ws.send(JSON.stringify({ op: 'ack', topic: frame.topic ?? '' }));
			});
		}
	);

	return { unmocked };
}

/** Hold a page's data request open so its loading skeleton stays on screen.
 *  Returns the release function. With `first: true` (the default) only the
 *  first matching request is held and later ones answer at once - the shell's
 *  dashboard poll shares `/api/jobs` and `/api/transcodes` with the Logs and
 *  Transcoder pages, and the page's own `onMount` request is issued first
 *  (Svelte mounts children before their parent), so the shell still settles
 *  on its live state behind the skeleton. */
export async function holdRequest(
	page: Page,
	path: string | RegExp,
	body: unknown,
	opts: { first?: boolean } = {}
): Promise<() => void> {
	const first = opts.first ?? true;
	let release: () => void = () => {};
	const held = new Promise<void>((resolve) => {
		release = resolve;
	});
	let seen = 0;
	await page.route(
		(url) => (typeof path === 'string' ? url.pathname === path : path.test(url.pathname)),
		async (route) => {
			seen += 1;
			if (!first || seen === 1) await held;
			await route.fulfill(json(body));
		}
	);
	return release;
}
