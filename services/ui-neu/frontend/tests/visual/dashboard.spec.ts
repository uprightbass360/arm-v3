import { test, expect } from '@playwright/test';
import { mockShell } from './_mocks';

test.describe('Dashboard visual regression', () => {
	test('empty state', async ({ page }) => {
		// The dashboard composes itself from the same six endpoints the shell
		// polls (config, jobs, drives, transcodes, transcode stats, inbox count),
		// so the shell mocks alone describe "everything online, nothing to do".
		const shell = await mockShell(page);

		await page.goto('/');
		await expect(page.getByText('No active rips or transcodes')).toBeVisible();
		await expect(page.getByText('No jobs found.')).toBeVisible();
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveScreenshot('dashboard-empty.png', { fullPage: true, animations: 'disabled' });
		expect(shell.unmocked).toEqual([]);
	});
});
