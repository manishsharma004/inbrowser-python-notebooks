/**
 * @typedef {import('./parseNotebook.js').NotebookDocument} NotebookDocument
 */

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
	const createId = options.createId ?? (() => crypto.randomUUID());
	/** @type {{ cell_type?: string; source?: string | string[] }[]} */
	const cells = Array.isArray(raw.cells) ? raw.cells : [];

	return {
		version: 1,
		cells: cells.map((cell) => {
			const kind = cell.cell_type === 'markdown' ? /** @type {'markdown'} */ ('markdown') : /** @type {'code'} */ ('code');
			return {
				id: createId(),
				kind,
				source: normalizeJupyterSource(cell.source ?? '')
			};
		}).filter((cell) => cell.kind === 'markdown' || cell.kind === 'code')
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
			const base = {
				cell_type: cell.kind === 'markdown' ? 'markdown' : 'code',
				metadata: {},
				source: toJupyterSourceLines(cell.source)
			};
			if (cell.kind === 'code') {
				return { ...base, outputs: [], execution_count: null };
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
			return /** @type {NotebookDocument} */ ({
				version: typeof parsed.version === 'number' ? parsed.version : 1,
				cells: parsed.cells.map((cell, index) => ({
					id: typeof cell.id === 'string' ? cell.id : `cell-${index}`,
					kind: cell.kind === 'markdown' ? 'markdown' : 'code',
					source: typeof cell.source === 'string' ? cell.source : ''
				}))
			});
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
