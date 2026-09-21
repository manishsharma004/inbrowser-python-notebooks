/**
 * In-app notebook document (`.ipynb.json` storage), distinct from Jupyter `.ipynb`.
 */

/**
 * @typedef {import('./parseNotebook.js').NotebookDocument} NotebookDocument
 * @typedef {import('./parseNotebook.js').NotebookCell} NotebookCell
 */

/**
 * @param {unknown} value
 * @returns {import('./parseNotebook.js').NotebookCellMetadata | undefined}
 */
function parseCellMetadata(value) {
	if (!value || typeof value !== 'object') return undefined;
	const record = /** @type {Record<string, unknown>} */ (value);
	if (record.scrolled === undefined) return undefined;
	return { scrolled: /** @type {boolean | string} */ (record.scrolled) };
}

/**
 * @param {unknown} value
 * @returns {import('./nbformatOutputs.js').CellRunSnapshot | undefined}
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
		html: Array.isArray(record.html) ? record.html.filter((h) => typeof h === 'string') : undefined,
		stdout: typeof record.stdout === 'string' ? record.stdout : undefined,
		stderr: typeof record.stderr === 'string' ? record.stderr : undefined,
		startedAt: typeof record.startedAt === 'number' ? record.startedAt : undefined,
		finishedAt: typeof record.finishedAt === 'number' ? record.finishedAt : undefined,
		durationMs: typeof record.durationMs === 'number' ? record.durationMs : undefined
	};
}

/**
 * @param {unknown} parsed
 * @returns {NotebookDocument | null}
 */
export function normalizeInternalNotebook(parsed) {
	if (!parsed || typeof parsed !== 'object') {
		return null;
	}
	const record = /** @type {Record<string, unknown>} */ (parsed);
	if (!Array.isArray(record.cells)) {
		return null;
	}
	const metaRaw = record.metadata;
	/** @type {import('./parseNotebook.js').NotebookDocumentMetadata | undefined} */
	let metadata;
	if (metaRaw && typeof metaRaw === 'object') {
		const meta = /** @type {Record<string, unknown>} */ (metaRaw);
		metadata = {};
		if (typeof meta.trusted === 'boolean') metadata.trusted = meta.trusted;
		if (typeof meta.fullWidth === 'boolean') metadata.fullWidth = meta.fullWidth;
		if (Object.keys(metadata).length === 0) metadata = undefined;
	}

	/** @type {NotebookCell[]} */
	const cells = /** @type {unknown[]} */ (record.cells).map((cell, index) => {
		const c =
			cell && typeof cell === 'object'
				? /** @type {Record<string, unknown>} */ (cell)
				: /** @type {Record<string, unknown>} */ ({});
		const lastRun = parseLastRun(c.lastRun);
		const cellMeta = parseCellMetadata(c.metadata);
		return {
			id: typeof c.id === 'string' ? c.id : `cell-${index}`,
			kind:
				c.kind === 'markdown' ? 'markdown' : c.kind === 'raw' ? 'raw' : /** @type {'code'} */ ('code'),
			source: typeof c.source === 'string' ? c.source : '',
			...(cellMeta ? { metadata: cellMeta } : {}),
			...(lastRun ? { lastRun } : {})
		};
	});

	if (cells.length === 0) return null;

	return {
		version: typeof record.version === 'number' ? record.version : 1,
		metadata,
		cells
	};
}

/**
 * @param {NotebookDocument} doc
 * @returns {string}
 */
export function serializeInternalNotebook(doc) {
	return JSON.stringify(doc, null, 2);
}
