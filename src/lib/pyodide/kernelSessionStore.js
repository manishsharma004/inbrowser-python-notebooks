import { browser } from '$app/environment';
import { LEGACY_SESSION_KEY, sessionStorageKey } from './kernelSessionKeys.js';

const DB_NAME = 'inbrowser-python-notebooks-vfs';
const STORE_NAME = 'snapshots';

export { sessionStorageKey } from './kernelSessionKeys.js';

/**
 * @typedef {Object} KernelJournalEntry
 * @property {string} source
 * @property {number} ranAt
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
 * @param {IDBDatabase} db
 * @param {string} key
 */
async function idbGet(db, key) {
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readonly');
		const req = tx.objectStore(STORE_NAME).get(key);
		req.onsuccess = () => resolve(req.result ?? null);
		req.onerror = () => reject(req.error);
	});
}

/**
 * @param {IDBDatabase} db
 * @param {string} key
 * @param {unknown} value
 */
async function idbPut(db, key, value) {
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readwrite');
		const req = tx.objectStore(STORE_NAME).put(value, key);
		req.onsuccess = () => resolve(undefined);
		req.onerror = () => reject(req.error);
	});
}

/**
 * @param {unknown} stored
 * @returns {KernelSessionRecord}
 */
function normalizeRecord(stored) {
	if (!stored || typeof stored !== 'object') return emptyKernelSession();
	const record = /** @type {Record<string, unknown>} */ (stored);
	return {
		version: 1,
		updatedAt: typeof record.updatedAt === 'number' ? record.updatedAt : Date.now(),
		journal: Array.isArray(record.journal) ? record.journal : [],
		pickleCheckpoint:
			typeof record.pickleCheckpoint === 'string' ? record.pickleCheckpoint : null,
		lastRestoreNote: typeof record.lastRestoreNote === 'string' ? record.lastRestoreNote : null
	};
}

/**
 * @param {string} notebookFileId
 * @returns {Promise<KernelSessionRecord>}
 */
export async function loadKernelSession(notebookFileId) {
	if (!notebookFileId) return emptyKernelSession();
	try {
		const db = await openDatabase();
		if (!db) return emptyKernelSession();
		const key = sessionStorageKey(notebookFileId);
		let stored = await idbGet(db, key);
		if (!stored) {
			const legacy = await idbGet(db, LEGACY_SESSION_KEY);
			if (legacy) {
				stored = legacy;
				await idbPut(db, key, legacy);
			}
		}
		return normalizeRecord(stored);
	} catch {
		return emptyKernelSession();
	}
}

/**
 * @param {string} notebookFileId
 * @param {Partial<KernelSessionRecord>} patch
 */
export async function saveKernelSession(notebookFileId, patch) {
	if (!notebookFileId) return emptyKernelSession();
	const current = await loadKernelSession(notebookFileId);
	const next = {
		...current,
		...patch,
		version: 1,
		updatedAt: Date.now()
	};

	const db = await openDatabase();
	if (!db) return next;
	await idbPut(db, sessionStorageKey(notebookFileId), next);
	return next;
}

/**
 * @param {string} notebookFileId
 * @param {string} source
 */
export async function appendKernelJournalEntry(notebookFileId, source) {
	const trimmed = source.trim();
	if (!trimmed || !notebookFileId) return loadKernelSession(notebookFileId);
	const current = await loadKernelSession(notebookFileId);
	const journal = [...current.journal, { source, ranAt: Date.now() }];
	const capped = journal.slice(-200);
	return saveKernelSession(notebookFileId, { journal: capped });
}

/**
 * @param {string} notebookFileId
 */
export async function clearKernelSession(notebookFileId) {
	if (!notebookFileId) return emptyKernelSession();
	return saveKernelSession(notebookFileId, emptyKernelSession());
}
