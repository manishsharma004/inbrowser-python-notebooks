const PYODIDE_VERSION = '0.29.4';
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

/** @type {Promise<any> | null} */
let runtimePromise = null;

/** @type {Promise<void> | null} */
let sessionHelpersPromise = null;

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
			const pyodide = await loadPyodide({ indexURL: PYODIDE_INDEX_URL });
			await installSessionHelpers(pyodide);
			return pyodide;
		})().catch((error) => {
			runtimePromise = null;
			sessionHelpersPromise = null;
			throw error;
		});
	}
	return runtimePromise;
}

/**
 * @param {any} pyodide
 */
async function installSessionHelpers(pyodide) {
	if (sessionHelpersPromise) return sessionHelpersPromise;

	sessionHelpersPromise = pyodide.runPythonAsync(`
import builtins
import json
import os

_NB_SKIP_GLOBALS = set(dir(builtins)) | {
    "builtins", "json", "os", "_NB_SKIP_GLOBALS",
    "nb_list_user_globals", "nb_list_environ", "nb_completion_snapshot"
}

def nb_list_user_globals():
    out = {}
    for name, value in globals().items():
        if name.startswith("_") or name in _NB_SKIP_GLOBALS:
            continue
        try:
            text = repr(value)
        except Exception as exc:
            text = f"<{type(value).__name__}: {exc}>"
        if len(text) > 240:
            text = text[:237] + "..."
        out[name] = text
    return out

def nb_list_environ():
    return {str(k): str(v) for k, v in os.environ.items()}

def nb_completion_snapshot():
    import sys
    import types

    modules = sorted(
        set(getattr(sys, "builtin_module_names", ()))
        | {k.split(".")[0] for k in sys.modules.keys() if not k.startswith("_")}
    )

    members = {}
    for name, mod in list(sys.modules.items()):
        if name.startswith("_"):
            continue
        try:
            members[name] = [x for x in dir(mod) if not x.startswith("_")][:120]
        except Exception:
            continue

    for name, value in globals().items():
        if name.startswith("_") or name in _NB_SKIP_GLOBALS:
            continue
        try:
            if isinstance(value, types.ModuleType):
                members[name] = [x for x in dir(value) if not x.startswith("_")][:120]
        except Exception:
            continue

    return json.dumps({"modules": modules, "members": members})
`);

	return sessionHelpersPromise;
}

/**
 * Drop the cached interpreter (next run loads a fresh kernel).
 */
export function resetPythonRuntime() {
	runtimePromise = null;
	sessionHelpersPromise = null;
}

/**
 * @typedef {Object} PythonRunResult
 * @property {boolean} ok
 * @property {string} stdout
 * @property {string} stderr
 * @property {string} [error]
 */

/**
 * Execute Python source in the shared Pyodide runtime (globals persist between calls).
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

/**
 * @typedef {Object} PythonSessionSnapshot
 * @property {Record<string, string>} globals
 * @property {Record<string, string>} environ
 */

/**
 * Inspect user-defined globals and process environment in the live kernel.
 * @returns {Promise<PythonSessionSnapshot>}
 */
export async function inspectPythonSession() {
	const pyodide = await ensurePythonRuntime();
	await installSessionHelpers(pyodide);

	const globalsProxy = pyodide.runPython('nb_list_user_globals()');
	const environProxy = pyodide.runPython('nb_list_environ()');
	const globals = /** @type {Record<string, string>} */ (
		globalsProxy.toJs({ dict_converter: Object.fromEntries })
	);
	const environ = /** @type {Record<string, string>} */ (
		environProxy.toJs({ dict_converter: Object.fromEntries })
	);
	globalsProxy.destroy();
	environProxy.destroy();

	return { globals, environ };
}

/**
 * @typedef {Object} PythonCompletionSnapshot
 * @property {string[]} modules
 * @property {Record<string, string[]>} members
 */

/**
 * @returns {Promise<PythonCompletionSnapshot>}
 */
export async function inspectPythonCompletions() {
	const pyodide = await ensurePythonRuntime();
	await installSessionHelpers(pyodide);

	const jsonText = /** @type {string} */ (pyodide.runPython('nb_completion_snapshot()'));
	const raw = /** @type {{ modules?: string[]; members?: Record<string, string[]> }} } */ (
		JSON.parse(jsonText)
	);

	return {
		modules: Array.isArray(raw.modules) ? raw.modules : [],
		members: raw.members && typeof raw.members === 'object' ? raw.members : {}
	};
}

/**
 * @returns {boolean}
 */
export function isPythonRuntimeReady() {
	return runtimePromise !== null;
}
