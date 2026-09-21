/**
 * @typedef {import('./parseNotebook.js').NotebookDocument} NotebookDocument
 */

import { randomId } from '../utils/randomId.js';
import { normalizeInternalNotebook } from './internalNotebook.js';
import {
	jupyterOutputsFromRunSnapshot,
	runSnapshotFromJupyterOutputs
} from './nbformatOutputs.js';

/**
 * @param {unknown} nbformat
 * @returns {boolean}
 */
function nbformatIs4(nbformat) {
	return nbformat === 4 || nbformat === '4' || Number(nbformat) === 4;
}

/**
 * @param {unknown} cells
 * @returns {boolean}
 */
export function looksLikeJupyterCells(cells) {
	if (!Array.isArray(cells) || cells.length === 0) return false;
	return cells.every(
		(cell) =>
			cell &&
			typeof cell === 'object' &&
			typeof /** @type {Record<string, unknown>} */ (cell).cell_type === 'string'
	);
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isJupyterNotebook(value) {
	if (!value || typeof value !== 'object') return false;
	const record = /** @type {Record<string, unknown>} */ (value);
	if (!Array.isArray(record.cells)) return false;
	if (nbformatIs4(record.nbformat)) return true;
	return looksLikeJupyterCells(record.cells);
}

/**
 * @param {string | string[]} source
 * @returns {string}
 */
function normalizeJupyterSource(source) {
	if (Array.isArray(source)) return source.join('');
	if (typeof source === 'string') return source;
	return '';
}

/**
 * @param {Record<string, unknown>} raw
 * @param {{ createId?: () => string }} [options]
 * @returns {NotebookDocument}
 */
export function fromJupyterNotebook(raw, options = {}) {
	const createId = options.createId ?? (() => randomId());
	/** @type {Record<string, unknown>[]} */
	const cells = Array.isArray(raw.cells) ? raw.cells : [];

	const mapped = cells
		.map((cell) => {
			const cellType = String(cell.cell_type ?? '');
			if (cellType !== 'markdown' && cellType !== 'code' && cellType !== 'raw') {
				return null;
			}
			const kind =
				cellType === 'markdown'
					? /** @type {'markdown'} */ ('markdown')
					: cellType === 'raw'
						? /** @type {'raw'} */ ('raw')
						: /** @type {'code'} */ ('code');
			/** @type {import('./parseNotebook.js').NotebookCell} */
			const mappedCell = {
				id: typeof cell.id === 'string' && cell.id ? cell.id : createId(),
				kind,
				source: normalizeJupyterSource(/** @type {string | string[]} */ (cell.source ?? ''))
			};

			const cellMeta = cell.metadata;
			if (cellMeta && typeof cellMeta === 'object') {
				const meta = /** @type {Record<string, unknown>} */ (cellMeta);
				if (meta.scrolled !== undefined) {
					mappedCell.metadata = { scrolled: /** @type {boolean | string} */ (meta.scrolled) };
				}
			}

			if (kind === 'code') {
				const executionCount =
					typeof cell.execution_count === 'number' ? cell.execution_count : null;
				const snapshot = runSnapshotFromJupyterOutputs(
					Array.isArray(cell.outputs) ? cell.outputs : [],
					executionCount
				);
				if (snapshot) mappedCell.lastRun = snapshot;
			}

			return mappedCell;
		})
		.filter((cell) => cell !== null);

	return {
		version: 1,
		metadata: { trusted: false },
		cells: /** @type {import('./parseNotebook.js').NotebookCell[]} */ (mapped)
	};
}

/**
 * Split notebook source into Jupyter's line array (lines except last keep `\n`).
 * @param {string} source
 * @returns {string[]}
 */
export function toJupyterSourceLines(source) {
	if (!source) return [];
	const lines = source.split('\n');
	return lines.map((line, index) => (index < lines.length - 1 ? `${line}\n` : line));
}

/**
 * @param {NotebookDocument} doc
 * @returns {Record<string, unknown>}
 */
export function toJupyterNotebook(doc) {
	return {
		nbformat: 4,
		nbformat_minor: 5,
		metadata: {
			kernelspec: {
				display_name: 'Python 3',
				language: 'python',
				name: 'python3'
			},
			language_info: {
				name: 'python',
				pygments_lexer: 'ipython3',
				mimetype: 'text/x-python',
				file_extension: '.py'
			}
		},
		cells: doc.cells.map((cell) => {
			const cellMetadata =
				cell.metadata?.scrolled !== undefined ? { scrolled: cell.metadata.scrolled } : {};
			const cell_type =
				cell.kind === 'markdown' ? 'markdown' : cell.kind === 'raw' ? 'raw' : 'code';
			const base = {
				id: cell.id,
				cell_type,
				metadata: cellMetadata,
				source: toJupyterSourceLines(cell.source)
			};
			if (cell.kind === 'code') {
				const outputs = jupyterOutputsFromRunSnapshot(cell.lastRun);
				return {
					...base,
					outputs,
					execution_count: cell.lastRun?.executionCount ?? null
				};
			}
			return base;
		})
	};
}

/**
 * @param {string} raw
 * @returns {NotebookDocument | null}
 */
export function parseImportedNotebook(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (isJupyterNotebook(parsed)) {
			return fromJupyterNotebook(/** @type {Record<string, unknown>} */ (parsed));
		}
		return normalizeInternalNotebook(parsed);
	} catch {
		return null;
	}
}

/**
 * @param {string} fileName
 * @returns {string}
 */
export function vfsNotebookNameFromImport(fileName) {
	const safe = fileName.replace(/[^\w.\-]+/g, '-').replace(/-+/g, '-').trim();
	if (!safe) return 'imported.ipynb.json';
	if (safe.endsWith('.ipynb.json')) return safe;
	if (safe.endsWith('.ipynb')) return `${safe.slice(0, -6)}.ipynb.json`;
	if (safe.endsWith('.json')) {
		return safe.endsWith('.ipynb.json') ? safe : `${safe.replace(/\.json$/i, '')}.ipynb.json`;
	}
	return `${safe}.ipynb.json`;
}

/**
 * @param {NotebookDocument} doc
 * @returns {string}
 */
export function serializeJupyterNotebookJson(doc) {
	return JSON.stringify(toJupyterNotebook(doc), null, 2);
}

/**
 * @param {string} filename
 * @param {string} contents
 * @param {string} [mimeType]
 */
export function downloadTextFile(filename, contents, mimeType = 'application/json') {
	const blob = new Blob([contents], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	URL.revokeObjectURL(url);
}

/**
 * @param {string} baseName
 * @param {NotebookDocument} doc
 */
export function downloadJupyterNotebook(baseName, doc) {
	const base = baseName.replace(/\.ipynb\.json$/i, '').replace(/\.ipynb$/i, '');
	downloadTextFile(`${base}.ipynb`, serializeJupyterNotebookJson(doc));
}
