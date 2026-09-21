import { parseImportedNotebook } from './jupyterFormat.js';
import { serializeInternalNotebook } from './internalNotebook.js';

/**
 * @typedef {import('./nbformatOutputs.js').CellRunSnapshot} CellRunSnapshot
 */

/**
 * @typedef {Object} NotebookCellMetadata
 * @property {boolean | string} [scrolled]
 */

/**
 * @typedef {Object} NotebookCell
 * @property {string} id
 * @property {'code' | 'markdown' | 'raw'} kind
 * @property {string} source
 * @property {NotebookCellMetadata} [metadata]
 * @property {CellRunSnapshot} [lastRun]
 */

/**
 * @typedef {Object} NotebookDocumentMetadata
 * @property {boolean} [trusted]
 * @property {boolean} [fullWidth]
 */

/**
 * @typedef {Object} NotebookDocument
 * @property {number} version
 * @property {NotebookCell[]} cells
 * @property {NotebookDocumentMetadata} [metadata]
 */

/** @returns {NotebookDocument} */
function defaultNotebookDocument() {
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

/**
 * Load notebook for the workspace (Jupyter `.ipynb` or internal `.ipynb.json`).
 * @param {string} raw
 * @returns {NotebookDocument}
 */
export function parseNotebook(raw) {
	const imported = parseImportedNotebook(raw);
	if (imported && imported.cells.length > 0) {
		return imported;
	}
	return defaultNotebookDocument();
}

/**
 * @param {NotebookDocument} doc
 * @returns {string}
 */
export function serializeNotebook(doc) {
	return serializeInternalNotebook(doc);
}
