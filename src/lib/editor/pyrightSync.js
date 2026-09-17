/**
 * Notebook → Pyright workspace hook (no optional deps). Safe to import everywhere.
 *
 * @param {string} notebookName
 * @param {{ id: string; kind: string; source: string }[]} cells
 */
export function syncNotebookCellsForAnalysis(notebookName, cells) {
	if (import.meta.env.VITE_ENABLE_PYRIGHT !== 'true') return;
	void notebookName;
	void cells;
}
