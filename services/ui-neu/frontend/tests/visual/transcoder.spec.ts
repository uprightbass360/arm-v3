import { test, expect } from '@playwright/test';
import { mockShell, holdRequest } from './_mocks';

test.describe('Transcoder visual', () => {
	test('loading state', async ({ page }) => {
		const shell = await mockShell(page);
		// The "All" tab lists tasks with GET /api/transcodes; stats, workers and
		// the GPU inventory are answered by the shell mocks.
		const release = await holdRequest(page, '/api/transcodes', []);

		await page.goto('/transcoder');
		await page.waitForSelector('[aria-busy="true"]', { timeout: 3000 });
		await expect(page).toHaveScreenshot('transcoder-loading.png', { fullPage: true, animations: 'disabled' });
		release();
		expect(shell.unmocked).toEqual([]);
	});
});
