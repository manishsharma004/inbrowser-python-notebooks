import { expect, test } from '@playwright/test';

test('file browser shows notebooks breadcrumb', async ({ page }) => {
	await page.goto('./');
	await expect(page.getByText(/mounting workspace/i)).toBeHidden({ timeout: 60_000 });
	await expect(page.locator('.nb-filebrowser__crumb')).toContainText('notebooks');
	await expect(page.locator('.nb-filebrowser__table')).toBeVisible();
});
