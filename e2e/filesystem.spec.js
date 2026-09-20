import { expect, test } from '@playwright/test';

/** @param {import('@playwright/test').Page} page */
async function openFilesPane(page) {
	const filesTab = page.getByRole('tab', { name: 'Files' });
	if (await filesTab.isVisible()) {
		await filesTab.click();
	}
}

test('file browser shows notebooks breadcrumb', async ({ page }) => {
	await page.goto('./');
	await expect(page.getByText(/mounting workspace/i)).toBeHidden({ timeout: 60_000 });
	await openFilesPane(page);
	await expect(page.locator('.nb-filebrowser__crumb')).toContainText('notebooks');
	await expect(page.locator('.nb-filebrowser__table')).toBeVisible();
});
