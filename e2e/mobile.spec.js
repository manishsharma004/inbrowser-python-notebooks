import { expect, test } from '@playwright/test';

/** @param {import('@playwright/test').Page} page */
async function openNotebookPane(page) {
	const notebookTab = page.getByRole('tab', { name: 'Notebook' });
	if (await notebookTab.isVisible()) {
		await notebookTab.click();
	}
}

/** @param {import('@playwright/test').Page} page */
async function openFilesPane(page) {
	const filesTab = page.getByRole('tab', { name: 'Files' });
	if (await filesTab.isVisible()) {
		await filesTab.click();
	}
}

test.describe('mobile shell', () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test('bottom nav switches Files and Notebook', async ({ page }) => {
		await page.goto('./');
		await expect(page.getByText(/mounting workspace/i)).toBeHidden({ timeout: 60_000 });
		await expect(page.getByRole('tab', { name: 'Files' })).toBeVisible();
		await openNotebookPane(page);
		await expect(page.getByRole('button', { name: 'Run All' })).toBeVisible();
		await openFilesPane(page);
		await expect(page.locator('.nb-filebrowser')).toBeVisible();
	});
});
