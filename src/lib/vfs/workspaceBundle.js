/**
 * Export / import full workspace snapshot as JSON (no server; Phase D lite).
 */

/**
 * @param {import('./types.js').VfsSnapshot} snapshot
 */
export function serializeWorkspaceBundle(snapshot) {
	return JSON.stringify(
		{
			format: 'inbrowser-workspace-v1',
			exportedAt: new Date().toISOString(),
			snapshot
		},
		null,
		2
	);
}

/**
 * @param {string} raw
 * @returns {import('./types.js').VfsSnapshot | null}
 */
export function parseWorkspaceBundle(raw) {
	try {
		const data = JSON.parse(raw);
		if (data?.format === 'inbrowser-workspace-v1' && data.snapshot?.nodes) {
			return {
				rootId: data.snapshot.rootId,
				nodes: data.snapshot.nodes
			};
		}
		if (Array.isArray(data?.nodes) && data.rootId) {
			return { rootId: data.rootId, nodes: data.nodes };
		}
	} catch {
		return null;
	}
	return null;
}
