import {
	cleanupStrayMatplotlibWidgets,
	NOTEBOOK_PRELOAD_PACKAGES
} from './notebookPackages.js';
import {
	ensureKernelWorker,
	interruptKernelWorker,
	isKernelWorkerReady,
	kernelWorkerRpc,
	resetKernelWorker
} from './kernelWorkerClient.js';

export { NOTEBOOK_PRELOAD_PACKAGES };

/**
 * @typedef {Object} PythonRunResult
 * @property {boolean} ok
 * @property {string} stdout
 * @property {string} stderr
 * @property {string} [error]
 * @property {string[]} [figures]
 */

/**
 * Lazily start the Pyodide Web Worker kernel.
 */
export async function ensurePythonRuntime() {
	await ensureKernelWorker();
	return true;
}

export function resetPythonRuntime() {
	cleanupStrayMatplotlibWidgets();
	resetKernelWorker();
}

/** Terminate the worker immediately (interrupt running cell). */
export function interruptPythonRun() {
	cleanupStrayMatplotlibWidgets();
	interruptKernelWorker();
}

/**
 * @param {string} source
 * @param {Record<string, string>} [workspaceFiles]
 * @returns {Promise<PythonRunResult>}
 */
export async function runPythonSource(source, workspaceFiles = {}) {
	await ensureKernelWorker();
	const result = await kernelWorkerRpc('run', { source, files: workspaceFiles });
	cleanupStrayMatplotlibWidgets();
	return /** @type {PythonRunResult} */ (result);
}

/**
 * @param {Record<string, string>} files
 */
export async function syncWorkspaceToKernel(files) {
	if (Object.keys(files).length === 0) return;
	await ensureKernelWorker();
	await kernelWorkerRpc('syncFiles', files);
}

/**
 * @typedef {Object} PythonSessionSnapshot
 * @property {Record<string, string>} globals
 * @property {Record<string, string>} environ
 */

export async function inspectPythonSession() {
	const result = await kernelWorkerRpc('inspectSession');
	return /** @type {PythonSessionSnapshot} */ (result);
}

/**
 * @typedef {Object} PythonCompletionSnapshot
 * @property {string[]} modules
 * @property {Record<string, string[]>} members
 * @property {string[]} globals
 */

export async function inspectPythonCompletions() {
	const raw = await kernelWorkerRpc('inspectCompletions');
	return {
		modules: Array.isArray(raw.modules) ? raw.modules : [],
		members: raw.members && typeof raw.members === 'object' ? raw.members : {},
		globals: Array.isArray(raw.globals) ? raw.globals : []
	};
}

export function isPythonRuntimeReady() {
	return isKernelWorkerReady();
}

/**
 * @typedef {Object} KernelCheckpointResult
 * @property {string | null} checkpoint
 * @property {number} variableCount
 */

export async function exportKernelCheckpoint() {
	const raw = await kernelWorkerRpc('exportCheckpoint');
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

export async function importKernelCheckpoint(checkpoint) {
	const raw = await kernelWorkerRpc('importCheckpoint', { b64: checkpoint });
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

export async function mergeKernelCheckpoint(checkpoint, overwriteExisting = false) {
	const raw = await kernelWorkerRpc('mergeCheckpoint', {
		b64: checkpoint,
		overwrite: overwriteExisting
	});
	return {
		restored: Array.isArray(raw.restored) ? raw.restored : [],
		failed: Array.isArray(raw.failed) ? raw.failed : [],
		skipped: Array.isArray(raw.skipped) ? raw.skipped : [],
		error: raw.error ?? null
	};
}

/**
 * @param {{ source: string }[]} journal
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
