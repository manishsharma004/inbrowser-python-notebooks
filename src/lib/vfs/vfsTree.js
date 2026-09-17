import { randomId } from '../utils/randomId.js';

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
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string | null} parentId
 * @param {string} name
 * @param {'file' | 'directory'} type
 * @param {string} [content]
 * @returns {import('./types.js').VfsNode}
 */
export function createNode(snapshot, parentId, name, type, content = '') {
	const node = {
		id: randomId(),
		name,
		type,
		parentId,
		updatedAt: Date.now(),
		...(type === 'file' ? { content, mimeType: 'text/x-python' } : {})
	};
	snapshot.nodes.push(node);
	return node;
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
 * @param {string} content
 */
export function writeFile(snapshot, nodeId, content) {
	const node = getNode(snapshot, nodeId);
	if (!node || node.type !== 'file') {
		throw new Error('Cannot write: node is not a file.');
	}
	node.content = content;
	node.updatedAt = Date.now();
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 */
export function ensureStarterNotebook(snapshot) {
	const children = listChildren(snapshot, snapshot.rootId);
	const hasNotebook = children.some(
		(node) => node.type === 'file' && node.name.endsWith('.ipynb.json')
	);
	if (hasNotebook) {
		return children.find((node) => node.type === 'file') ?? null;
	}

	return createNode(
		snapshot,
		snapshot.rootId,
		'welcome.ipynb.json',
		'file',
		JSON.stringify(
			{
				version: 1,
				cells: [
					{
						id: randomId(),
						kind: 'code',
						source: 'print("Hello from Pyodide in your browser!")\n'
					}
				]
			},
			null,
			2
		)
	);
}
