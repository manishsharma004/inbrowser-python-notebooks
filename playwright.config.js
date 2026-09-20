import { defineConfig, devices } from '@playwright/test';

const e2ePort = 43174;
const basePath = '/inbrowser-python-notebooks';

export default defineConfig({
	testDir: 'e2e',
	timeout: 120_000,
	projects: [
		{
			name: 'desktop',
			use: {
				...devices['Desktop Chrome'],
				baseURL: `http://127.0.0.1:${e2ePort}${basePath}/`
			}
		},
		{
			name: 'mobile',
			use: {
				...devices['Pixel 5'],
				baseURL: `http://127.0.0.1:${e2ePort}${basePath}/`
			}
		}
	],
	use: {
		...devices['Desktop Chrome'],
		baseURL: `http://127.0.0.1:${e2ePort}${basePath}/`
	},
	webServer: {
		command: 'npm run build && npm run preview:e2e',
		port: e2ePort,
		reuseExistingServer: false,
		timeout: 180_000
	}
});
