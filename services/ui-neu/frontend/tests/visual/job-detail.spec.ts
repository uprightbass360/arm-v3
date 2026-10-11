import { test, expect } from '@playwright/test';
import { mockShell, holdRequest, json } from './_mocks';

test.describe('Job detail visual', () => {
	test('loading state', async ({ page }) => {
		const shell = await mockShell(page);
		// Hold the job read itself; the body is only delivered after the
		// screenshot, so an empty object is enough to let the page settle.
		const release = await holdRequest(page, '/api/jobs/42', {});
		// Stub out secondary requests so they don't interfere
		await page.route(
			(url) => url.pathname === '/api/jobs/42/naming-preview',
			(route) => route.fulfill(json({ tracks: [] }))
		);

		await page.goto('/jobs/42');
		await page.waitForSelector('[aria-busy="true"]', { timeout: 3000 });
		await expect(page).toHaveScreenshot('job-detail-loading.png', { fullPage: true, animations: 'disabled' });
		release();
		expect(shell.unmocked).toEqual([]);
	});
});
