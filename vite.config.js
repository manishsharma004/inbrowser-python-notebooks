import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const basePath = '/inbrowser-python-notebooks';

export default defineConfig({
	base: `${basePath}/`,
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: ['pyodide']
	}
});
