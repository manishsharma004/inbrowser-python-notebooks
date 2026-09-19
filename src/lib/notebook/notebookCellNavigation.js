/**
 * @param {{ id: string }[]} cells
 * @param {string} cellId
 */
export function cellIndexById(cells, cellId) {
	return cells.findIndex((c) => c.id === cellId);
}

/**
 * @param {{ id: string }[]} cells
 * @param {string} cellId
 */
export function nextCellId(cells, cellId) {
	const index = cellIndexById(cells, cellId);
	if (index < 0 || index >= cells.length - 1) return null;
	return cells[index + 1].id;
}

/**
 * @param {{ id: string }[]} cells
 * @param {string} cellId
 */
export function prevCellId(cells, cellId) {
	const index = cellIndexById(cells, cellId);
	if (index <= 0) return null;
	return cells[index - 1].id;
}
