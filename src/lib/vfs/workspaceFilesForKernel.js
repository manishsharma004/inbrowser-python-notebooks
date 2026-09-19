import { filePathForNode } from './vfsPaths.js';

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
