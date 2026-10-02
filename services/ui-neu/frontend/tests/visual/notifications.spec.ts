import { test, expect } from '@playwright/test';
import { mockShell, holdRequest } from './_mocks';

test.describe('Notifications visual', () => {
	test('loading state', async ({ page }) => {
		const shell = await mockShell(page);
		// The inbox read (GET /api/notifications/inbox) is the page's own; the
		// shell only polls the /count sibling, which stays answered.
		const release = await holdRequest(page, '/api/notifications/inbox', []);

		await page.goto('/notifications');
		await page.waitForSelector('[aria-busy="true"]', { timeout: 3000 });
		await expect(page).toHaveScreenshot('notifications-loading.png', { fullPage: true, animations: 'disabled' });
		release();
		expect(shell.unmocked).toEqual([]);
	});
});
