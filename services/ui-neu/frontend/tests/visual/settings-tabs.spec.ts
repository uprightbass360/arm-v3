import { test, expect } from '@playwright/test';
import { mockShell, mockGpus, json } from './_mocks';

// The schema-driven settings tabs. The tab strip is hash-routed
// (/settings#<tab>); the config-group tabs are named after their backend
// group ("Metadata", "Ripping") and the screen-tabs by id ("transcoding").
test.describe('Settings tabs visual', () => {
	// The settings body scrolls inside the shell's main column rather than the
	// document, so a fullPage capture would clip at the fold; a tall viewport
	// shows the whole tab in one frame instead.
	test.use({ viewport: { width: 1280, height: 2200 } });

	test('transcoding tab with the GPUs card', async ({ page }) => {
		const shell = await mockShell(page, { admin: true });
		await page.route(
			(url) => url.pathname === '/api/gpus',
			(route) => route.fulfill(json(mockGpus))
		);

		await page.goto('/settings#transcoding');
		await expect(page.getByRole('heading', { name: 'Transcode GPUs' })).toBeVisible();
		for (const gpu of mockGpus) {
			await expect(page.getByTestId(`gpu-row-${gpu.id}`)).toBeVisible();
		}
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveScreenshot('settings-transcoding.png', { animations: 'disabled' });
		expect(shell.unmocked).toEqual([]);
	});

	test('ripping tab with disc handling', async ({ page }) => {
		const shell = await mockShell(page, { admin: true });

		await page.goto('/settings#Ripping');
		await expect(page.getByRole('heading', { level: 2, name: 'Ripping' })).toBeVisible();
		// The sections settings-sections.ts lays the Ripping group out in; the
		// unmapped fields land in a trailing card titled after the group itself.
		for (const section of ['On insert', 'Review gate', 'Decryption data']) {
			await expect(page.getByRole('heading', { name: section })).toBeVisible();
		}
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveScreenshot('settings-ripping.png', { animations: 'disabled' });
		expect(shell.unmocked).toEqual([]);
	});

	test('metadata tab with API keys', async ({ page }) => {
		const shell = await mockShell(page, { admin: true });

		await page.goto('/settings#Metadata');
		await expect(page.getByRole('heading', { level: 2, name: 'Metadata' })).toBeVisible();
		for (const section of ['Lookup', 'TV episodes', 'API keys']) {
			await expect(page.getByRole('heading', { name: section })).toBeVisible();
		}
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveScreenshot('settings-metadata.png', { animations: 'disabled' });
		expect(shell.unmocked).toEqual([]);
	});
});
