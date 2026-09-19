import { expect, test } from '@playwright/test';

test('workspace mounts and shows kernel status', async ({ page }) => {
	await page.goto('./');
	await expect(page.getByText(/mounting workspace/i)).toBeHidden({ timeout: 60_000 });
	await expect(page.locator('.nb-kernel')).toContainText('Kernel');
	await expect(page.getByRole('button', { name: 'Run all' })).toBeVisible();
});
