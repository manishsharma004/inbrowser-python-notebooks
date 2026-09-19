/**
 * @typedef {import('./parseNotebook.js').NotebookDocument} NotebookDocument
 */

import { randomId } from '../utils/randomId.js';
import {
	jupyterOutputsFromRunSnapshot,
	runSnapshotFromJupyterOutputs
} from './nbformatOutputs.js';

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isJupyterNotebook(value) {
	if (!value || typeof value !== 'object') return false;
	const record = /** @type {Record<string, unknown>} */ (value);
	return record.nbformat === 4 && Array.isArray(record.cells);
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
				id: createId(),
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
	const trusted = doc.metadata?.trusted === true;
	return {
		nbformat: 4,
		nbformat_minor: 5,
		metadata: {
			kernelspec: {
				display_name: 'Python (Pyodide)',
				language: 'python',
				name: 'python3'
			},
			language_info: {
				name: 'python',
				pyodide: true
			}
		},
		cells: doc.cells.map((cell) => {
			const cellMetadata =
				cell.metadata?.scrolled !== undefined ? { scrolled: cell.metadata.scrolled } : {};
			const cell_type =
				cell.kind === 'markdown' ? 'markdown' : cell.kind === 'raw' ? 'raw' : 'code';
			const base = {
				cell_type,
				metadata: cellMetadata,
				source: toJupyterSourceLines(cell.source)
			};
			if (cell.kind === 'code') {
				const outputs = jupyterOutputsFromRunSnapshot(cell.lastRun);
				return {
					...base,
					outputs,
					execution_count: cell.lastRun?.executionCount ?? null,
					trusted: trusted && cell.lastRun != null ? true : trusted
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
		if (parsed && typeof parsed === 'object' && Array.isArray(parsed.cells)) {
			return /** @type {NotebookDocument} */ (parsed);
		}
	} catch {
		return null;
	}
	return null;
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
