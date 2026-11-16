import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderComponent, screen, waitFor, cleanup } from '$lib/test-utils';

vi.mock('$lib/stores/resources.svelte', async () => {
	const { writable } = await import('svelte/store');
	const store = writable({
		cpu_percent: 10,
		cpu_temp: 55,
		memory: { used_gb: 1, total_gb: 8, percent: 12 },
		storage: [{ path: '/a', name: 'media', free_gb: 5, percent: 40 }]
	});
	return { resources: store, __setResources: store.set };
});

let respond: () => Promise<unknown> = () => Promise.resolve({ version: '0' });
let calls = 0;
vi.mock('$lib/api/system', () => ({
	fetchSystemVersion: () => {
		calls += 1;
		return respond();
	}
}));

import { DEFAULT_REPO_URL } from '$lib/utils/versionChip';
import SidebarStats from '../SidebarStats.svelte';

import * as resourcesModule from '$lib/stores/resources.svelte';

const setResources = (resourcesModule as unknown as { __setResources: (v: unknown) => void }).__setResources;

describe('SidebarStats', () => {
	afterEach(cleanup);

	it('renders cpu temperature and storage rows', async () => {
		respond = () => Promise.resolve({ version: '1' });
		renderComponent(SidebarStats);
		expect(await screen.findByText('5 GB free')).toBeTruthy();
		expect(screen.getByText(/55/)).toBeTruthy();
	});

	it('omits the temperature and storage when there are none', async () => {
		respond = () => Promise.resolve({ version: '1' });
		setResources({
			cpu_percent: 10,
			cpu_temp: null,
			memory: { used_gb: 1, total_gb: 8, percent: 12 },
			storage: []
		});
		renderComponent(SidebarStats);
		await screen.findByText('v1');
		expect(screen.queryByText('Storage')).toBeNull();
		expect(screen.queryByText(/°C/)).toBeNull();
	});
});

describe('SidebarStats version chip', () => {
	beforeEach(() => {
		calls = 0;
	});
	afterEach(cleanup);

	it('shows the green status when up to date', async () => {
		respond = () => Promise.resolve({ version: '2.10.1', latest_version: '2.10.1', update_available: false });
		renderComponent(SidebarStats);
		expect(await screen.findByText('v2.10.1')).toBeTruthy();
		expect(screen.getByText('Up to date')).toBeTruthy();
		expect(screen.queryByRole('link', { name: /Update available/ })).toBeNull();
		const link = screen.getByRole('link', { name: 'ARM v2.10.1 on GitHub (opens in a new tab)' });
		expect(link.getAttribute('href')).toBe(DEFAULT_REPO_URL);
		expect(link.getAttribute('target')).toBe('_blank');
		expect(link.getAttribute('rel')).toBe('noopener noreferrer');
	});

	it('links to the repo_url the backend reports', async () => {
		respond = () => Promise.resolve({ version: '2.10.1', repo_url: 'https://github.com/me/fork' });
		renderComponent(SidebarStats);
		const link = await screen.findByRole('link', { name: 'ARM v2.10.1 on GitHub (opens in a new tab)' });
		expect(link.getAttribute('href')).toBe('https://github.com/me/fork');
	});

	it('does not double a leading v', async () => {
		respond = () => Promise.resolve({ version: 'v2.10.1' });
		renderComponent(SidebarStats);
		expect(await screen.findByText('v2.10.1')).toBeTruthy();
	});

	it('links to the release when an update is available', async () => {
		respond = () =>
			Promise.resolve({
				version: '2.10.1',
				latest_version: '2.11.0',
				update_available: true,
				release_url: 'https://github.com/o/r/releases/tag/v2.11.0'
			});
		renderComponent(SidebarStats);
		const link = await screen.findByRole('link', { name: 'Update available: v2.11.0 (opens in a new tab)' });
		expect(link.getAttribute('href')).toBe('https://github.com/o/r/releases/tag/v2.11.0');
		expect(link.getAttribute('target')).toBe('_blank');
		expect(link.getAttribute('rel')).toBe('noopener noreferrer');
		expect(screen.queryByText('Up to date')).toBeNull();
		expect(link.textContent).toContain('Update available');
		expect(link.querySelectorAll('a')).toHaveLength(0);
	});

	it('shows the version alone when nothing was checked', async () => {
		respond = () => Promise.resolve({ version: '2.10.1', latest_version: null, update_available: null });
		renderComponent(SidebarStats);
		expect(await screen.findByText('v2.10.1')).toBeTruthy();
		expect(screen.queryByText('Up to date')).toBeNull();
		expect(screen.queryByRole('link', { name: /Update available/ })).toBeNull();
		expect(screen.getByRole('link', { name: /on GitHub/ }).getAttribute('href')).toBe(DEFAULT_REPO_URL);
	});

	it('renders no chip when the fetch fails', async () => {
		respond = () => Promise.reject(new Error('boom'));
		const { container } = renderComponent(SidebarStats);
		await waitFor(() => expect(calls).toBe(1));
		await Promise.resolve();
		expect(container.querySelector('[data-version-chip]')).toBeNull();
	});

	it('fetches once on mount', async () => {
		respond = () => Promise.resolve({ version: '2.10.1' });
		renderComponent(SidebarStats);
		await screen.findByText('v2.10.1');
		expect(calls).toBe(1);
	});
});
