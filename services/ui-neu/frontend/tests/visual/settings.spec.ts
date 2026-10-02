import { test, expect } from '@playwright/test';
import { mockShell, holdRequest } from './_mocks';
import { settingsSchema } from './_schema';

test.describe('Settings visual', () => {
	test('loading state', async ({ page }) => {
		const shell = await mockShell(page, { admin: true });
		// fetchSettings() fans out to /api/config + /api/settings/schema +
		// /api/settings/infra; holding the schema read keeps the whole page in
		// its skeleton (the config read is shared with the shell and answers).
		const release = await holdRequest(page, '/api/settings/schema', settingsSchema);

		await page.goto('/settings');
		await page.waitForSelector('[aria-busy="true"]', { timeout: 3000 });
		await expect(page).toHaveScreenshot('settings-loading.png', { fullPage: true, animations: 'disabled' });
		release();
		expect(shell.unmocked).toEqual([]);
	});
});
