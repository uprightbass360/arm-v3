import { test, expect } from '@playwright/test';
import { mockShell, holdRequest } from './_mocks';

test.describe('Logs list visual', () => {
	test('loading state', async ({ page }) => {
		const shell = await mockShell(page);
		// The page lists jobs (GET /api/jobs); hold its request so the skeleton stays up.
		const release = await holdRequest(page, '/api/jobs', []);

		await page.goto('/logs');
		// This page's loading slot is a plain "Loading jobs..." line, not a skeleton card.
		await expect(page.getByText('Loading jobs...')).toBeVisible({ timeout: 3000 });
		await expect(page).toHaveScreenshot('logs-loading.png', { fullPage: true, animations: 'disabled' });
		release();
		expect(shell.unmocked).toEqual([]);
	});
});
