import { getNode } from './vfsTree.js';

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {import('./types.js').VfsNode} node
 * @returns {string}
 */
function filePathForNode(snapshot, node) {
	/** @type {string[]} */
	const parts = [node.name];
	let parentId = node.parentId;
	while (parentId) {
		const parent = getNode(snapshot, parentId);
		if (!parent || parent.parentId === null) break;
		parts.unshift(parent.name);
		parentId = parent.parentId;
	}
	return parts.join('/');
}

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @returns {Record<string, string>}
 */
export function workspaceFilesForKernel(snapshot) {
	/** @type {Record<string, string>} */
	const files = {};
	for (const node of snapshot.nodes) {
		if (node.type !== 'file' || typeof node.content !== 'string') continue;
		if (node.name.endsWith('.ipynb.json')) continue;
		files[filePathForNode(snapshot, node)] = node.content;
	}
	return files;
}
