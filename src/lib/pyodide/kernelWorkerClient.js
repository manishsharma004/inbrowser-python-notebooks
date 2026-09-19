import { MATPLOTLIB_SETUP_PYTHON, SESSION_HELPERS_PYTHON } from './sessionHelpersPython.js';

/** @type {Worker | null} */
let worker = null;
/** @type {Promise<void> | null} */
let readyPromise = null;
let requestSeq = 0;

/** @type {Map<number, { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }>} */
const pending = new Map();

/**
 * @param {string} op
 * @param {unknown} [payload]
 * @returns {Promise<any>}
 */
function rpc(op, payload = undefined) {
	if (!worker) {
		throw new Error('Kernel worker is not started.');
	}
	const activeWorker = worker;
	return new Promise((resolve, reject) => {
		const requestId = ++requestSeq;
		pending.set(requestId, { resolve, reject });
		activeWorker.postMessage({ requestId, op, payload });
	});
}

function attachWorkerHandlers(w) {
	w.onmessage = (event) => {
		const { requestId, ok, result, error } = event.data;
		const handlers = pending.get(requestId);
		if (!handlers) return;
		pending.delete(requestId);
		if (ok) handlers.resolve(result);
		else handlers.reject(new Error(error ?? 'Kernel worker error'));
	};
	w.onerror = (event) => {
		for (const handlers of pending.values()) {
			handlers.reject(new Error(event.message ?? 'Kernel worker crashed'));
		}
		pending.clear();
	};
}

function spawnWorker() {
	if (typeof Worker === 'undefined') {
		throw new Error('Web Workers are not available.');
	}
	const w = new Worker(new URL('./pyodide-kernel.worker.js', import.meta.url), { type: 'classic' });
	attachWorkerHandlers(w);
	worker = w;
	readyPromise = null;
}

export async function ensureKernelWorker() {
	if (readyPromise) return readyPromise;

	readyPromise = (async () => {
		if (!worker) spawnWorker();
		await rpc('configure', {
			sessionPython: SESSION_HELPERS_PYTHON,
			matplotlibPython: MATPLOTLIB_SETUP_PYTHON
		});
		await rpc('init');
	})().catch((error) => {
		readyPromise = null;
		throw error;
	});

	return readyPromise;
}

export function isKernelWorkerReady() {
	return readyPromise !== null;
}

export function resetKernelWorker() {
	if (worker) {
		void rpc('reset').catch(() => {});
	}
	readyPromise = null;
}

/** Hard interrupt: terminate worker thread (Pyodide cannot cancel mid-cell otherwise). */
export function interruptKernelWorker() {
	if (worker) {
		worker.terminate();
		worker = null;
	}
	readyPromise = null;
	pending.clear();
}

/**
 * @param {string} op
 * @param {unknown} [payload]
 */
export async function kernelWorkerRpc(op, payload) {
	await ensureKernelWorker();
	return rpc(op, payload);
}
