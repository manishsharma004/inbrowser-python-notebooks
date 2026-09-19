/**
 * Sync run output between in-memory maps and persisted notebook cells.
 */

/**
 * @typedef {import('./parseNotebook.js').NotebookDocument} NotebookDocument
 * @typedef {import('./parseNotebook.js').NotebookCell} NotebookCell
 * @typedef {import('./nbformatOutputs.js').CellRunSnapshot} CellRunSnapshot
 */

/**
 * @typedef {CellRunSnapshot & { startedAt: number, finishedAt: number, durationMs: number }} CellRunRecord
 */

/**
 * @param {NotebookCell[]} cells
 * @returns {Record<string, CellRunRecord>}
 */
export function cellOutputsFromNotebook(cells) {
	/** @type {Record<string, CellRunRecord>} */
	const map = {};
	for (const cell of cells) {
		if (cell.kind !== 'code' || !cell.lastRun) continue;
		map[cell.id] = {
			...cell.lastRun,
			startedAt: cell.lastRun.startedAt ?? 0,
			finishedAt: cell.lastRun.finishedAt ?? 0,
			durationMs: cell.lastRun.durationMs ?? 0,
			figures: cell.lastRun.figures ?? []
		};
	}
	return map;
}

/**
 * @param {NotebookDocument} doc
 * @param {Record<string, CellRunRecord>} outputs
 * @returns {NotebookDocument}
 */
export function applyCellOutputsToNotebook(doc, outputs) {
	return {
		...doc,
		cells: doc.cells.map((cell) => {
			if (cell.kind !== 'code') return cell;
			const run = outputs[cell.id];
			if (!run) {
				const { lastRun: _, ...rest } = cell;
				return /** @type {NotebookCell} */ (rest);
			}
			return {
				...cell,
				lastRun: {
					ok: run.ok,
					text: run.text,
					executionCount: run.executionCount,
					figures: run.figures ?? [],
					startedAt: run.startedAt,
					finishedAt: run.finishedAt,
					durationMs: run.durationMs
				}
			};
		})
	};
}
