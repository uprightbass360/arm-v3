import { test, expect } from '@playwright/test';
import { mockShell, holdRequest, json } from './_mocks';

test.describe('Files visual', () => {
	test('loading state', async ({ page }) => {
		const shell = await mockShell(page);
		// Provide roots immediately so the page sets currentPath and starts navigating
		await page.route(
			(url) => url.pathname === '/api/files/roots',
			(route) => route.fulfill(json([{ key: 'raw', label: 'Raw', path: '/home/arm/media/raw' }]))
		);
		// Stall the directory listing so the skeleton is visible
		const release = await holdRequest(page, '/api/files/list', {
			path: '/home/arm/media/raw',
			parent: null,
			readonly: false,
			entries: []
		});

		await page.goto('/files');
		await page.waitForSelector('[aria-busy="true"]', { timeout: 3000 });
		await expect(page).toHaveScreenshot('files-loading.png', { fullPage: true, animations: 'disabled' });
		release();
		expect(shell.unmocked).toEqual([]);
	});
});
