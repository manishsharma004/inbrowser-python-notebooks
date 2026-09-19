/**
 * @typedef {Object} TocEntry
 * @property {string} cellId
 * @property {number} cellIndex
 * @property {number} level
 * @property {string} title
 */

/**
 * @param {{ id: string; kind: string; source: string }[]} cells
 * @returns {TocEntry[]}
 */
export function tableOfContentsFromNotebook(cells) {
	/** @type {TocEntry[]} */
	const entries = [];
	cells.forEach((cell, cellIndex) => {
		if (cell.kind !== 'markdown') return;
		for (const line of cell.source.split('\n')) {
			const match = /^(#{1,6})\s+(.+)$/.exec(line.trim());
			if (!match) continue;
			entries.push({
				cellId: cell.id,
				cellIndex,
				level: match[1].length,
				title: match[2].trim()
			});
		}
	});
	return entries;
}
