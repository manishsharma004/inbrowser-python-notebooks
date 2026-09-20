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

test('workspace mounts and shows kernel status', async ({ page }) => {
	await page.goto('./');
	await expect(page.getByText(/mounting workspace/i)).toBeHidden({ timeout: 60_000 });
	await expect(page.locator('.nb-kernel')).toContainText(/Python · Pyodide/);
	await openNotebookPane(page);
	await expect(page.getByRole('button', { name: 'Run All' })).toBeVisible();
});
