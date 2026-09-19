import { browser } from '$app/environment';
import { emptySnapshot } from './vfsTree.js';

const DB_NAME = 'inbrowser-python-notebooks-vfs';
const STORE_NAME = 'snapshots';
const DB_VERSION = 1;

const DEFAULT_WORKSPACE_ID = 'default';

/** @type {Promise<IDBDatabase | null> | null} */
let databasePromise = null;

export {
	createNode,
	ensureStarterDataFiles,
	ensureStarterNotebook,
	getNode,
	listChildren,
	writeFile
} from './vfsTree.js';
export { emptySnapshot } from './vfsTree.js';

function canUseIndexedDb() {
	return browser && typeof window !== 'undefined' && 'indexedDB' in window;
}

function openDatabase() {
	if (!canUseIndexedDb()) {
		return Promise.resolve(null);
	}
	if (databasePromise) {
		return databasePromise;
	}

	databasePromise = new Promise((resolve, reject) => {
		const request = window.indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME);
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () =>
			reject(request.error ?? new Error('Unable to open IndexedDB virtual file store.'));
	}).catch((error) => {
		databasePromise = null;
		throw error;
	});

	return databasePromise;
}

/**
 * @param {IDBTransactionMode} mode
 * @param {(store: IDBObjectStore) => IDBRequest} handler
 */
function runTransaction(mode, handler) {
	return openDatabase().then((db) => {
		if (!db) {
			return null;
		}
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(STORE_NAME, mode);
			const store = transaction.objectStore(STORE_NAME);
			const request = handler(store);
			request.onsuccess = () => resolve(request.result ?? null);
			request.onerror = () =>
				reject(request.error ?? new Error('IndexedDB virtual file store transaction failed.'));
		});
	});
}

/**
 * @param {string} [workspaceId]
 * @returns {Promise<boolean>}
 */
export async function hasPersistedWorkspace(workspaceId = DEFAULT_WORKSPACE_ID) {
	try {
		const stored = await runTransaction('readonly', (store) => store.get(workspaceId));
		return stored != null && typeof stored === 'object';
	} catch {
		return false;
	}
}

/**
 * @param {string} [workspaceId]
 * @returns {Promise<import('./types.js').VfsSnapshot>}
 */
export async function loadSnapshot(workspaceId = DEFAULT_WORKSPACE_ID) {
	const stored = await runTransaction('readonly', (store) => store.get(workspaceId));
	if (!stored || typeof stored !== 'object' || !Array.isArray(stored.nodes)) {
		return emptySnapshot();
	}
	return {
		rootId: typeof stored.rootId === 'string' ? stored.rootId : emptySnapshot().rootId,
		nodes: stored.nodes
	};
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string} [workspaceId]
 */
export async function saveSnapshot(snapshot, workspaceId = DEFAULT_WORKSPACE_ID) {
	await runTransaction('readwrite', (store) => store.put(snapshot, workspaceId));
}
