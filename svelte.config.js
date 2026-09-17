import adapter from '@sveltejs/adapter-static';

const basePath = '/inbrowser-python-notebooks';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'dist',
			assets: 'dist',
			fallback: '404.html'
		}),
		paths: {
			base: basePath,
			relative: false
		},
		serviceWorker: {
			register: false
		}
	}
};

export default config;
