import { getNode } from './vfsTree.js';

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {import('./types.js').VfsNode} node
 * @returns {string}
 */
export function filePathForNode(snapshot, node) {
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
 * Breadcrumb labels for UI (`workspace` → `notebooks`).
 * @param {import('./types.js').VfsSnapshot} snapshot
 * @param {string} dirId
 */
export function breadcrumbForDir(snapshot, dirId) {
	/** @type {{ id: string, label: string }[]} */
	const segments = [];
	let current = getNode(snapshot, dirId);
	while (current) {
		const label = current.parentId === null ? 'notebooks' : current.name;
		segments.unshift({ id: current.id, label });
		if (!current.parentId) break;
		current = getNode(snapshot, current.parentId);
	}
	return segments;
}

/**
 * @param {string} name
 */
export function isNotebookFileName(name) {
	return name.endsWith('.ipynb.json') || name.endsWith('.ipynb');
}
