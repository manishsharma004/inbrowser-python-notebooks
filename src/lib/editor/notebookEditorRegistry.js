/** @type {Map<string, () => void>} */
const focusHandlers = new Map();

/**
 * @param {string} cellId
 * @param {() => void} focus
 */
export function registerNotebookCellEditor(cellId, focus) {
	focusHandlers.set(cellId, focus);
	return () => {
		focusHandlers.delete(cellId);
	};
}

/** @param {string} cellId */
export function focusNotebookCellEditor(cellId) {
	focusHandlers.get(cellId)?.();
}
