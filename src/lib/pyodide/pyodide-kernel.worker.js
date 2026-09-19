// @ts-nocheck
/* global loadPyodide, importScripts */

const PYODIDE_VERSION = '0.29.4';
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PRELOAD_PACKAGES = ['numpy', 'matplotlib', 'scipy', 'pillow'];

/** @type {string} */
let SESSION_HELPERS_PYTHON = '';
/** @type {string} */
let MATPLOTLIB_SETUP_PYTHON = '';

/** @type {any} */
let pyodide = null;
/** @type {Promise<any> | null} */
let initPromise = null;

/**
 * @param {MessageEvent} event
 */
self.onmessage = (event) => {
	const { requestId, op, payload } = event.data;
	handleOp(op, payload)
		.then((result) => {
			self.postMessage({ requestId, ok: true, result });
		})
		.catch((error) => {
			self.postMessage({
				requestId,
				ok: false,
				error: error instanceof Error ? error.message : String(error)
			});
		});
};

/**
 * @param {string} op
 * @param {unknown} payload
 */
async function handleOp(op, payload) {
	switch (op) {
		case 'configure':
			SESSION_HELPERS_PYTHON = /** @type {{ sessionPython: string; matplotlibPython: string }} */ (
				payload
			).sessionPython;
			MATPLOTLIB_SETUP_PYTHON = /** @type {{ sessionPython: string; matplotlibPython: string }} */ (
				payload
			).matplotlibPython;
			importScripts(`${PYODIDE_INDEX_URL}pyodide.js`);
			return { ready: true };
		case 'init':
			await ensurePyodide();
			return { ready: true };
		case 'reset':
			pyodide = null;
			initPromise = null;
			return { ready: true };
		case 'run': {
			const p = /** @type {{ source: string; files?: Record<string, string> }} } */ (payload);
			return runSource(p.source, p.files ?? {});
		}
		case 'syncFiles': {
			const files = /** @type {Record<string, string>} } */ (payload);
			await ensurePyodide();
			pyodide.globals.set('_nb_files_json', JSON.stringify(files));
			pyodide.runPython('nb_sync_workspace(_nb_files_json)');
			pyodide.runPython('del _nb_files_json');
			return { ok: true };
		}
		case 'inspectSession':
			return inspectSession();
		case 'inspectCompletions':
			return inspectCompletions();
		case 'exportCheckpoint':
			return exportCheckpoint();
		case 'importCheckpoint':
			return importCheckpoint(/** @type {{ b64: string }} } */ (payload).b64);
		case 'mergeCheckpoint':
			return mergeCheckpoint(
				/** @type {{ b64: string; overwrite: boolean }} } */ (payload).b64,
				/** @type {{ b64: string; overwrite: boolean }} } */ (payload).overwrite
			);
		default:
			throw new Error(`Unknown worker op: ${op}`);
	}
}

async function ensurePyodide() {
	if (pyodide) return pyodide;
	if (!initPromise) {
		initPromise = (async () => {
			if (typeof loadPyodide !== 'function') {
				throw new Error('Pyodide loader missing in worker.');
			}
			const instance = await loadPyodide({ indexURL: PYODIDE_INDEX_URL });
			await instance.loadPackage(PRELOAD_PACKAGES);
			await instance.runPythonAsync(MATPLOTLIB_SETUP_PYTHON);
			await instance.runPythonAsync(SESSION_HELPERS_PYTHON);
			pyodide = instance;
			return instance;
		})().catch((error) => {
			initPromise = null;
			throw error;
		});
	}
	return initPromise;
}

/**
 * @param {string} source
 * @param {Record<string, string>} files
 */
async function runSource(source, files) {
	await ensurePyodide();
	if (Object.keys(files).length > 0) {
		pyodide.globals.set('_nb_files_json', JSON.stringify(files));
		pyodide.runPython('nb_sync_workspace(_nb_files_json)');
		pyodide.runPython('del _nb_files_json');
	}

	/** @type {string[]} */
	const stdout = [];
	/** @type {string[]} */
	const stderr = [];

	pyodide.setStdout({ batched: (value) => stdout.push(value) });
	pyodide.setStderr({ batched: (value) => stderr.push(value) });

	try {
		pyodide.runPython('nb_drain_figure_pngs()');
		await pyodide.runPythonAsync(source);
		const figures = drainFigures();
		return {
			ok: true,
			stdout: stdout.join('\n').trim(),
			stderr: stderr.join('\n').trim(),
			figures
		};
	} catch (error) {
		const figures = drainFigures();
		return {
			ok: false,
			stdout: stdout.join('\n').trim(),
			stderr: stderr.join('\n').trim(),
			error: error instanceof Error ? error.message : 'Python execution failed.',
			figures
		};
	}
}

function drainFigures() {
	try {
		pyodide.runPython(`
import matplotlib.pyplot as plt
if plt.get_fignums():
    plt.show()
`);
		const jsonText = pyodide.runPython('nb_drain_figure_pngs()');
		const parsed = JSON.parse(jsonText);
		return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string' && item.length > 0) : [];
	} catch {
		return [];
	}
}

async function inspectSession() {
	await ensurePyodide();
	const globalsProxy = pyodide.runPython('nb_list_user_globals()');
	const environProxy = pyodide.runPython('nb_list_environ()');
	const globals = globalsProxy.toJs({ dict_converter: Object.fromEntries });
	const environ = environProxy.toJs({ dict_converter: Object.fromEntries });
	globalsProxy.destroy();
	environProxy.destroy();
	return { globals, environ };
}

async function inspectCompletions() {
	await ensurePyodide();
	const jsonText = pyodide.runPython('nb_completion_snapshot()');
	return JSON.parse(jsonText);
}

async function exportCheckpoint() {
	await ensurePyodide();
	const jsonText = pyodide.runPython('nb_export_pickle_checkpoint()');
	return JSON.parse(jsonText);
}

/**
 * @param {string} b64
 */
async function importCheckpoint(b64) {
	await ensurePyodide();
	pyodide.globals.set('_nb_checkpoint_b64', b64);
	const jsonText = pyodide.runPython('nb_import_pickle_checkpoint(_nb_checkpoint_b64)');
	pyodide.runPython('del _nb_checkpoint_b64');
	return JSON.parse(jsonText);
}

/**
 * @param {string} b64
 * @param {boolean} overwrite
 */
async function mergeCheckpoint(b64, overwrite) {
	await ensurePyodide();
	pyodide.globals.set('_nb_checkpoint_b64', b64);
	pyodide.globals.set('_nb_merge_overwrite', overwrite ? '1' : '0');
	const jsonText = pyodide.runPython(
		'nb_merge_pickle_checkpoint(_nb_checkpoint_b64, _nb_merge_overwrite)'
	);
	pyodide.runPython('del _nb_checkpoint_b64, _nb_merge_overwrite');
	return JSON.parse(jsonText);
}
