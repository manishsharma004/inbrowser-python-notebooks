/**
 * @typedef {Object} NotebookCell
 * @property {string} id
 * @property {'code' | 'markdown'} kind
 * @property {string} source
 */

/**
 * @typedef {Object} NotebookDocument
 * @property {number} version
 * @property {NotebookCell[]} cells
 */

/**
 * @param {string} raw
 * @returns {NotebookDocument}
 */
export function parseNotebook(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.cells)) {
			throw new Error('Invalid notebook shape');
		}
		return {
			version: typeof parsed.version === 'number' ? parsed.version : 1,
			cells: parsed.cells.map((cell, index) => ({
				id: typeof cell.id === 'string' ? cell.id : `cell-${index}`,
				kind: cell.kind === 'markdown' ? 'markdown' : 'code',
				source: typeof cell.source === 'string' ? cell.source : ''
			}))
		};
	} catch {
		return {
			version: 1,
			cells: [
				{
					id: 'cell-0',
					kind: 'code',
					source: 'print("Hello from Pyodide")\n'
				}
			]
		};
	}
}

/**
 * @param {NotebookDocument} doc
 * @returns {string}
 */
export function serializeNotebook(doc) {
	return JSON.stringify(doc, null, 2);
}
