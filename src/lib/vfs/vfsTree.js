import { buildStarterNotebookJson, STARTER_IRIS_CSV } from '../notebook/starterNotebook.js';
import { randomId } from '../utils/randomId.js';
import { filePathForNode, isNotebookFileName } from './vfsPaths.js';

/**
 * Pure in-memory VFS tree helpers (no IndexedDB / SvelteKit imports).
 */

/**
 * @returns {import('./types.js').VfsSnapshot}
 */
export function emptySnapshot() {
	const rootId = randomId();
	const now = Date.now();
	return {
		rootId,
		nodes: [
			{
				id: rootId,
				name: 'workspace',
				type: 'directory',
				parentId: null,
				updatedAt: now
			}
		]
	};
}

/**
 * @param {string} name
 */
export function assertValidNodeName(name) {
	const trimmed = name.trim();
	if (!trimmed || trimmed.includes('/') || trimmed.includes('\\')) {
		throw new Error('Invalid name.');
	}
	return trimmed;
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string | null} parentId
 * @param {string} name
 */
export function findSibling(snapshot, parentId, name) {
	return snapshot.nodes.find((n) => n.parentId === parentId && n.name === name) ?? null;
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string | null} dirId
 */
function touchDir(snapshot, dirId) {
	if (!dirId) return;
	const dir = getNode(snapshot, dirId);
	if (dir) dir.updatedAt = Date.now();
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string | null} parentId
 * @param {string} name
 * @param {'file' | 'directory'} type
 * @param {string} [content]
 * @returns {import('./types.js').VfsNode}
 */
export function createNode(snapshot, parentId, name, type, content = '') {
	const safeName = assertValidNodeName(name);
	if (findSibling(snapshot, parentId, safeName)) {
		throw new Error(`Already exists: ${safeName}`);
	}
	const parent = parentId ? getNode(snapshot, parentId) : null;
	if (parentId && (!parent || parent.type !== 'directory')) {
		throw new Error('Parent is not a directory.');
	}
	const node = {
		id: randomId(),
		name: safeName,
		type,
		parentId,
		updatedAt: Date.now(),
		...(type === 'file' ? { content, mimeType: guessMimeType(safeName) } : {})
	};
	snapshot.nodes.push(node);
	touchDir(snapshot, parentId);
	return node;
}

/** @param {string} name */
function guessMimeType(name) {
	if (name.endsWith('.ipynb.json') || name.endsWith('.json')) return 'application/json';
	if (name.endsWith('.csv')) return 'text/csv';
	if (name.endsWith('.md')) return 'text/markdown';
	if (name.endsWith('.py')) return 'text/x-python';
	return 'text/plain';
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string} nodeId
 */
export function getNode(snapshot, nodeId) {
	return snapshot.nodes.find((node) => node.id === nodeId) ?? null;
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string | null} parentId
 * @returns {import('./types.js').VfsNode[]}
 */
export function listChildren(snapshot, parentId) {
	return snapshot.nodes
		.filter((node) => node.parentId === parentId)
		.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === 'directory' ? -1 : 1;
			}
			return a.name.localeCompare(b.name);
		});
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string} nodeId
 */
export function stat(snapshot, nodeId) {
	const node = getNode(snapshot, nodeId);
	if (!node) return null;
	return {
		id: node.id,
		name: node.name,
		type: node.type,
		parentId: node.parentId,
		updatedAt: node.updatedAt,
		path: filePathForNode(snapshot, node),
		size: node.type === 'file' ? (node.content?.length ?? 0) : 0
	};
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string | null} parentId
 * @param {string} name
 */
export function mkdir(snapshot, parentId, name) {
	return createNode(snapshot, parentId, name, 'directory');
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string} nodeId
 */
export function readFile(snapshot, nodeId) {
	const node = getNode(snapshot, nodeId);
	if (!node || node.type !== 'file') {
		throw new Error('Not a file.');
	}
	return node.content ?? '';
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string} nodeId
 * @param {string} content
 */
export function writeFile(snapshot, nodeId, content) {
	const node = getNode(snapshot, nodeId);
	if (!node || node.type !== 'file') {
		throw new Error('Cannot write: node is not a file.');
	}
	node.content = content;
	node.updatedAt = Date.now();
	touchDir(snapshot, node.parentId);
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string} nodeId
 * @param {string} newName
 */
export function rename(snapshot, nodeId, newName) {
	const node = getNode(snapshot, nodeId);
	if (!node || node.parentId === null) {
		throw new Error('Cannot rename root.');
	}
	const safeName = assertValidNodeName(newName);
	if (findSibling(snapshot, node.parentId, safeName) && findSibling(snapshot, node.parentId, safeName)?.id !== nodeId) {
		throw new Error(`Already exists: ${safeName}`);
	}
	node.name = safeName;
	node.updatedAt = Date.now();
	touchDir(snapshot, node.parentId);
	return node;
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string} nodeId
 * @param {string | null} newParentId
 */
export function move(snapshot, nodeId, newParentId) {
	const node = getNode(snapshot, nodeId);
	if (!node || node.parentId === null) {
		throw new Error('Cannot move root.');
	}
	if (newParentId === node.id) throw new Error('Cannot move into self.');
	if (newParentId) {
		let walk = getNode(snapshot, newParentId);
		while (walk) {
			if (walk.id === node.id) throw new Error('Cannot move into descendant.');
			walk = walk.parentId ? getNode(snapshot, walk.parentId) : null;
		}
	}
	const dest = newParentId ? getNode(snapshot, newParentId) : null;
	if (newParentId && (!dest || dest.type !== 'directory')) {
		throw new Error('Destination is not a directory.');
	}
	const conflict = findSibling(snapshot, newParentId, node.name);
	if (conflict && conflict.id !== nodeId) {
		throw new Error(`Already exists: ${node.name}`);
	}
	const oldParent = node.parentId;
	node.parentId = newParentId;
	node.updatedAt = Date.now();
	touchDir(snapshot, oldParent);
	touchDir(snapshot, newParentId);
	return node;
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string} dirId
 */
function isDirectoryEmpty(snapshot, dirId) {
	return !snapshot.nodes.some((n) => n.parentId === dirId);
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string} nodeId
 * @param {{ recursive?: boolean }} [options]
 */
export function unlink(snapshot, nodeId, options = {}) {
	const node = getNode(snapshot, nodeId);
	if (!node || node.parentId === null) {
		throw new Error('Cannot delete root.');
	}
	if (node.type === 'directory') {
		const children = listChildren(snapshot, nodeId);
		if (children.length && !options.recursive) {
			throw new Error('Directory not empty.');
		}
		for (const child of [...children]) {
			unlink(snapshot, child.id, { recursive: true });
		}
	}
	const parentId = node.parentId;
	snapshot.nodes = snapshot.nodes.filter((n) => n.id !== nodeId);
	touchDir(snapshot, parentId);
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string} nodeId
 */
export function duplicateFile(snapshot, nodeId) {
	const node = getNode(snapshot, nodeId);
	if (!node || node.type !== 'file') throw new Error('Not a file.');
	const base = node.name.replace(/(\.ipynb\.json|\.ipynb|\.[^.]+)?$/, '');
	const ext = node.name.includes('.') ? node.name.slice(node.name.lastIndexOf('.')) : '';
	let attempt = `${base}-copy${ext}`;
	let i = 2;
	while (findSibling(snapshot, node.parentId, attempt)) {
		attempt = `${base}-copy-${i}${ext}`;
		i += 1;
	}
	return createNode(snapshot, node.parentId, attempt, 'file', node.content ?? '');
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @returns {import('./types.js').VfsNode | null}
 */
export function findAnyNotebook(snapshot) {
	const notebooks = snapshot.nodes.filter(
		(n) => n.type === 'file' && isNotebookFileName(n.name)
	);
	if (!notebooks.length) return null;
	return [...notebooks].sort(
		(a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0) || a.name.localeCompare(b.name)
	)[0];
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @returns {import('./types.js').VfsNode | null}
 */
export function ensureStarterNotebook(snapshot) {
	const existing = findAnyNotebook(snapshot);
	if (existing) return existing;

	return createNode(
		snapshot,
		snapshot.rootId,
		'welcome.ipynb.json',
		'file',
		buildStarterNotebookJson()
	);
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 */
export function ensureStarterDataFiles(snapshot) {
	const dataDir = listChildren(snapshot, snapshot.rootId).find(
		(n) => n.type === 'directory' && n.name === 'data'
	);
	const dir = dataDir ?? createNode(snapshot, snapshot.rootId, 'data', 'directory');
	const hasIris = listChildren(snapshot, dir.id).some((n) => n.name === 'iris.csv');
	if (!hasIris) {
		createNode(snapshot, dir.id, 'iris.csv', 'file', STARTER_IRIS_CSV);
	}
}

export { isDirectoryEmpty };
