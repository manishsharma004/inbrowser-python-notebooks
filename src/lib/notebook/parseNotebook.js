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
 * @property {'code' | 'markdown'} kind
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

/**
 * @param {unknown} value
 * @returns {NotebookCellMetadata | undefined}
 */
function parseCellMetadata(value) {
	if (!value || typeof value !== 'object') return undefined;
	const record = /** @type {Record<string, unknown>} */ (value);
	if (record.scrolled === undefined) return undefined;
	return { scrolled: /** @type {boolean | string} */ (record.scrolled) };
}

/**
 * @param {unknown} value
 * @returns {CellRunSnapshot | undefined}
 */
function parseLastRun(value) {
	if (!value || typeof value !== 'object') return undefined;
	const record = /** @type {Record<string, unknown>} */ (value);
	if (typeof record.executionCount !== 'number') return undefined;
	return {
		ok: record.ok !== false,
		text: typeof record.text === 'string' ? record.text : '',
		executionCount: record.executionCount,
		figures: Array.isArray(record.figures)
			? record.figures.filter((f) => typeof f === 'string')
			: [],
		startedAt: typeof record.startedAt === 'number' ? record.startedAt : undefined,
		finishedAt: typeof record.finishedAt === 'number' ? record.finishedAt : undefined,
		durationMs: typeof record.durationMs === 'number' ? record.durationMs : undefined
	};
}

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
		const metaRaw = /** @type {Record<string, unknown>} */ (parsed).metadata;
		/** @type {NotebookDocumentMetadata | undefined} */
		let metadata;
		if (metaRaw && typeof metaRaw === 'object') {
			const meta = /** @type {Record<string, unknown>} */ (metaRaw);
			metadata = {};
			if (typeof meta.trusted === 'boolean') metadata.trusted = meta.trusted;
			if (typeof meta.fullWidth === 'boolean') metadata.fullWidth = meta.fullWidth;
			if (Object.keys(metadata).length === 0) metadata = undefined;
		}

		return {
			version: typeof parsed.version === 'number' ? parsed.version : 1,
			metadata,
			cells: parsed.cells.map((cell, index) => {
				/** @type {Record<string, unknown>} */
				const c = cell && typeof cell === 'object' ? cell : {};
				const lastRun = parseLastRun(c.lastRun);
				const cellMeta = parseCellMetadata(c.metadata);
				return {
					id: typeof c.id === 'string' ? c.id : `cell-${index}`,
					kind: c.kind === 'markdown' ? 'markdown' : 'code',
					source: typeof c.source === 'string' ? c.source : '',
					...(cellMeta ? { metadata: cellMeta } : {}),
					...(lastRun ? { lastRun } : {})
				};
			})
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
