import { browser } from '$app/environment';

const DB_NAME = 'inbrowser-python-notebooks-vfs';
const STORE_NAME = 'snapshots';
const SESSION_KEY = 'kernel-session-v1';

/**
 * @typedef {Object} KernelJournalEntry
 * @property {string} source
 * @property {number} ranAt
 * @property {string} [notebookFileId]
 */

/**
 * @typedef {Object} KernelSessionRecord
 * @property {number} version
 * @property {number} updatedAt
 * @property {KernelJournalEntry[]} journal
 * @property {string | null} pickleCheckpoint
 * @property {string | null} lastRestoreNote
 */

/** @returns {KernelSessionRecord} */
export function emptyKernelSession() {
	return {
		version: 1,
		updatedAt: Date.now(),
		journal: [],
		pickleCheckpoint: null,
		lastRestoreNote: null
	};
}

/** @type {Promise<IDBDatabase | null> | null} */
let databasePromise = null;

function canUseIndexedDb() {
	return browser && typeof window !== 'undefined' && 'indexedDB' in window;
}

function openDatabase() {
	if (!canUseIndexedDb()) return Promise.resolve(null);
	if (databasePromise) return databasePromise;

	databasePromise = new Promise((resolve, reject) => {
		const request = window.indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME);
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
	}).catch((error) => {
		databasePromise = null;
		throw error;
	});

	return databasePromise;
}

/**
 * @returns {Promise<KernelSessionRecord>}
 */
export async function loadKernelSession() {
	try {
		const db = await openDatabase();
		if (!db) return emptyKernelSession();
		const stored = await new Promise((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, 'readonly');
			const req = tx.objectStore(STORE_NAME).get(SESSION_KEY);
			req.onsuccess = () => resolve(req.result ?? null);
			req.onerror = () => reject(req.error);
		});
		if (!stored || typeof stored !== 'object') return emptyKernelSession();
		return {
			version: 1,
			updatedAt: typeof stored.updatedAt === 'number' ? stored.updatedAt : Date.now(),
			journal: Array.isArray(stored.journal) ? stored.journal : [],
			pickleCheckpoint:
				typeof stored.pickleCheckpoint === 'string' ? stored.pickleCheckpoint : null,
			lastRestoreNote: typeof stored.lastRestoreNote === 'string' ? stored.lastRestoreNote : null
		};
	} catch {
		return emptyKernelSession();
	}
}

/**
 * @param {Partial<KernelSessionRecord>} patch
 */
export async function saveKernelSession(patch) {
	const current = await loadKernelSession();
	const next = {
		...current,
		...patch,
		version: 1,
		updatedAt: Date.now()
	};

	const db = await openDatabase();
	if (!db) return next;
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readwrite');
		const req = tx.objectStore(STORE_NAME).put(next, SESSION_KEY);
		req.onsuccess = () => resolve(undefined);
		req.onerror = () => reject(req.error);
	});
	return next;
}

/**
 * @param {string} source
 * @param {string} [notebookFileId]
 */
export async function appendKernelJournalEntry(source, notebookFileId) {
	const trimmed = source.trim();
	if (!trimmed) return loadKernelSession();
	const current = await loadKernelSession();
	const journal = [
		...current.journal,
		{ source, ranAt: Date.now(), notebookFileId: notebookFileId ?? undefined }
	];
	// Keep the most recent 200 successful executions to bound storage.
	const capped = journal.slice(-200);
	return saveKernelSession({ journal: capped });
}

export async function clearKernelSession() {
	return saveKernelSession(emptyKernelSession());
}
