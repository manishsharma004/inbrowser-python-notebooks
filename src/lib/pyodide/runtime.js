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
    "builtins", "json", "os", "pickle", "base64", "_NB_SKIP_GLOBALS",
    "nb_list_user_globals", "nb_list_environ", "nb_completion_snapshot",
    "nb_export_pickle_checkpoint", "nb_import_pickle_checkpoint",
    "nb_merge_pickle_checkpoint"
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

def nb_export_pickle_checkpoint():
    import pickle
    import base64

    payload = {}
    for name, value in list(globals().items()):
        if name.startswith("_") or name in _NB_SKIP_GLOBALS:
            continue
        try:
            payload[name] = pickle.dumps(value)
        except Exception:
            continue
    b64 = base64.b64encode(pickle.dumps(payload)).decode("ascii")
    return json.dumps({"b64": b64, "count": len(payload)})

def nb_import_pickle_checkpoint(b64_text):
    import pickle
    import base64

    restored = []
    failed = []
    try:
        payload = pickle.loads(base64.b64decode(b64_text))
    except Exception as exc:
        return json.dumps({"restored": restored, "failed": failed, "error": str(exc)})

    for name, blob in payload.items():
        try:
            globals()[name] = pickle.loads(blob)
            restored.append(name)
        except Exception:
            failed.append(name)
    return json.dumps({"restored": restored, "failed": failed, "error": None})

def nb_merge_pickle_checkpoint(b64_text, overwrite_names="0"):
    import pickle
    import base64

    overwrite = str(overwrite_names).lower() in ("1", "true", "yes")
    restored = []
    failed = []
    skipped = []
    try:
        payload = pickle.loads(base64.b64decode(b64_text))
    except Exception as exc:
        return json.dumps({"restored": restored, "failed": failed, "skipped": skipped, "error": str(exc)})

    user_globals = set(nb_list_user_globals().keys())

    for name, blob in payload.items():
        if name.startswith("_") or name in _NB_SKIP_GLOBALS:
            continue
        if not overwrite and name in user_globals:
            skipped.append(name)
            continue
        try:
            globals()[name] = pickle.loads(blob)
            restored.append(name)
        except Exception:
            failed.append(name)
    return json.dumps({"restored": restored, "failed": failed, "skipped": skipped, "error": None})
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

/**
 * @typedef {Object} KernelCheckpointResult
 * @property {string | null} checkpoint
 * @property {number} variableCount
 */

/**
 * Serialize pickle-able user globals to a base64 blob for IndexedDB.
 * @returns {Promise<KernelCheckpointResult>}
 */
export async function exportKernelCheckpoint() {
	const pyodide = await ensurePythonRuntime();
	await installSessionHelpers(pyodide);
	const jsonText = /** @type {string} */ (pyodide.runPython('nb_export_pickle_checkpoint()'));
	const raw = /** @type {{ b64?: string; count?: number }} } */ (JSON.parse(jsonText));
	return {
		checkpoint: typeof raw.b64 === 'string' && raw.b64.length > 0 ? raw.b64 : null,
		variableCount: typeof raw.count === 'number' ? raw.count : 0
	};
}

/**
 * @typedef {Object} KernelRestoreResult
 * @property {string[]} restored
 * @property {string[]} failed
 * @property {string | null} error
 */

/**
 * @param {string} checkpoint
 * @returns {Promise<KernelRestoreResult>}
 */
export async function importKernelCheckpoint(checkpoint) {
	const pyodide = await ensurePythonRuntime();
	await installSessionHelpers(pyodide);
	pyodide.globals.set('_nb_checkpoint_b64', checkpoint);
	const jsonText = /** @type {string} */ (
		pyodide.runPython('nb_import_pickle_checkpoint(_nb_checkpoint_b64)')
	);
	pyodide.runPython('del _nb_checkpoint_b64');
	const raw = /** @type {{ restored?: string[]; failed?: string[]; error?: string | null }} } */ (
		JSON.parse(jsonText)
	);
	return {
		restored: Array.isArray(raw.restored) ? raw.restored : [],
		failed: Array.isArray(raw.failed) ? raw.failed : [],
		error: raw.error ?? null
	};
}

/**
 * @typedef {Object} KernelMergeResult
 * @property {string[]} restored
 * @property {string[]} failed
 * @property {string[]} skipped
 * @property {string | null} error
 */

/**
 * Merge another notebook's pickle checkpoint into the live kernel.
 * @param {string} checkpoint
 * @param {boolean} [overwriteExisting]
 * @returns {Promise<KernelMergeResult>}
 */
export async function mergeKernelCheckpoint(checkpoint, overwriteExisting = false) {
	const pyodide = await ensurePythonRuntime();
	await installSessionHelpers(pyodide);
	pyodide.globals.set('_nb_checkpoint_b64', checkpoint);
	pyodide.globals.set('_nb_merge_overwrite', overwriteExisting ? '1' : '0');
	const jsonText = /** @type {string} */ (
		pyodide.runPython(
			'nb_merge_pickle_checkpoint(_nb_checkpoint_b64, _nb_merge_overwrite)'
		)
	);
	pyodide.runPython('del _nb_checkpoint_b64, _nb_merge_overwrite');
	const raw = /** @type {{
		restored?: string[];
		failed?: string[];
		skipped?: string[];
		error?: string | null;
	}} } */ (JSON.parse(jsonText));
	return {
		restored: Array.isArray(raw.restored) ? raw.restored : [],
		failed: Array.isArray(raw.failed) ? raw.failed : [],
		skipped: Array.isArray(raw.skipped) ? raw.skipped : [],
		error: raw.error ?? null
	};
}

/**
 * Re-run stored cell sources in order (fallback when pickle restore is incomplete).
 * @param {{ source: string }[]} journal
 * @returns {Promise<{ ok: number; failed: number }>}
 */
export async function replayKernelJournal(journal) {
	let ok = 0;
	let failed = 0;
	for (const entry of journal) {
		const result = await runPythonSource(entry.source);
		if (result.ok) ok += 1;
		else failed += 1;
	}
	return { ok, failed };
}
