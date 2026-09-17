const PYODIDE_VERSION = '0.29.4';
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

/** @type {Promise<any> | null} */
let runtimePromise = null;

function appendPyodideScript() {
	if (typeof window === 'undefined') {
		throw new Error('Pyodide can only load in a browser environment.');
	}

	if (window.loadPyodide) return Promise.resolve();

	return new Promise((resolve, reject) => {
		const existing = document.querySelector('script[data-pyodide-loader="true"]');
		if (existing) {
			existing.addEventListener('load', () => resolve(undefined), { once: true });
			existing.addEventListener(
				'error',
				() => reject(new Error('Failed to load the Pyodide runtime bundle.')),
				{ once: true }
			);
			return;
		}

		const script = document.createElement('script');
		script.src = `${PYODIDE_INDEX_URL}pyodide.js`;
		script.async = true;
		script.dataset.pyodideLoader = 'true';
		script.onload = () => resolve(undefined);
		script.onerror = () => reject(new Error('Failed to load the Pyodide runtime bundle.'));
		document.head.append(script);
	});
}

/**
 * Lazily load and cache a single Pyodide interpreter for the tab.
 * @returns {Promise<any>}
 */
export async function ensurePythonRuntime() {
	if (!runtimePromise) {
		runtimePromise = (async () => {
			await appendPyodideScript();
			const loadPyodide = window.loadPyodide;
			if (!loadPyodide) {
				throw new Error('Pyodide loader did not initialize.');
			}
			return loadPyodide({ indexURL: PYODIDE_INDEX_URL });
		})().catch((error) => {
			runtimePromise = null;
			throw error;
		});
	}
	return runtimePromise;
}

/**
 * @typedef {Object} PythonRunResult
 * @property {boolean} ok
 * @property {string} stdout
 * @property {string} stderr
 * @property {string} [error]
 */

/**
 * Execute Python source in the shared Pyodide runtime.
 * @param {string} source
 * @returns {Promise<PythonRunResult>}
 */
export async function runPythonSource(source) {
	const pyodide = await ensurePythonRuntime();
	/** @type {string[]} */
	const stdout = [];
	/** @type {string[]} */
	const stderr = [];

	pyodide.setStdout({ batched: (value) => stdout.push(value) });
	pyodide.setStderr({ batched: (value) => stderr.push(value) });

	try {
		await pyodide.runPythonAsync(source);
		return {
			ok: true,
			stdout: stdout.join('\n').trim(),
			stderr: stderr.join('\n').trim()
		};
	} catch (error) {
		return {
			ok: false,
			stdout: stdout.join('\n').trim(),
			stderr: stderr.join('\n').trim(),
			error: error instanceof Error ? error.message : 'Python execution failed.'
		};
	}
}
