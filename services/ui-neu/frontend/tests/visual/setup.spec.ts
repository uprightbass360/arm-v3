import { test, expect } from '@playwright/test';
import { mockShell } from './_mocks';

// First-run walkthrough (src/routes/setup). The root layout's guard only
// consults /api/setup/status for an admin session (a JWT plus arm_role=admin
// in localStorage, see isAdminSession in src/routes/+layout.ts); with
// first_run=true it redirects to /setup, which resumes at the step
// GET /api/setup reports - "account" on a fresh box.
test.describe('Setup walkthrough visual', () => {
	// The step body scrolls under the walkthrough's sticky footer; a taller
	// viewport keeps the whole account step above it.
	test.use({ viewport: { width: 1280, height: 1000 } });

	test('first step and stepper', async ({ page }) => {
		const shell = await mockShell(page, { admin: true, firstRun: true });

		await page.goto('/');
		await expect(page).toHaveURL(/\/setup\/account$/);
		// The welcome line carries the version from /api/system/version, so it
		// is the last of the step's reads to land.
		await expect(page.getByText('Welcome to ARM 3.0.0-test.')).toBeVisible();
		await expect(page.locator('nav[aria-label="Setup steps"] [aria-current="step"]')).toContainText(
			'Secure your account'
		);
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveScreenshot('setup-account-step.png', { animations: 'disabled' });
		await expect(page.locator('nav[aria-label="Setup steps"]')).toHaveScreenshot('setup-stepper.png', {
			animations: 'disabled'
		});
		expect(shell.unmocked).toEqual([]);
	});
});
