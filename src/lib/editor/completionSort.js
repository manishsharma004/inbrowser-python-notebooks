/** Completion ordering: members, methods, kernel globals, then general suggestions. */

export const COMPLETION_TIER = {
	MEMBER: 0,
	METHOD: 1,
	GLOBAL: 2,
	GENERAL: 3,
	PRIVATE: 4,
	DUNDER: 5
};

/**
 * @param {{ label: string | { label: string }, kind?: number, detail?: string }} item
 * @returns {number}
 */
export function completionTier(item) {
	const detail = String(item.detail ?? '');
	if (/\bmember\b/i.test(detail)) {
		return COMPLETION_TIER.MEMBER;
	}
	// Monaco CompletionItemKind.Method === 0
	if (item.kind === 0) {
		return COMPLETION_TIER.METHOD;
	}
	if (detail === 'kernel global') {
		return COMPLETION_TIER.GLOBAL;
	}
	const name = completionLabel(item);
	if (name.startsWith('__') && name.endsWith('__')) {
		return COMPLETION_TIER.DUNDER;
	}
	if (name.startsWith('_')) {
		return COMPLETION_TIER.PRIVATE;
	}
	return COMPLETION_TIER.GENERAL;
}

/**
 * @param {{ label: string | { label: string } }} item
 * @returns {string}
 */
export function completionLabel(item) {
	if (typeof item.label === 'string') return item.label;
	return item.label?.label ?? '';
}

/**
 * @typedef {Object} SortableCompletionItem
 * @property {string | { label: string }} label
 * @property {number} [kind]
 * @property {string} [detail]
 */

/**
 * @param {SortableCompletionItem[]} items
 * @param {{ typedPrefix?: string }} [options]
 * @returns {SortableCompletionItem[]}
 */
export function sortCompletionItems(items, options = {}) {
	const typedPrefix = (options.typedPrefix ?? '').toLowerCase();
	return [...items].sort((a, b) => {
		if (typedPrefix) {
			const aMatch = completionLabel(a).toLowerCase().startsWith(typedPrefix) ? 0 : 1;
			const bMatch = completionLabel(b).toLowerCase().startsWith(typedPrefix) ? 0 : 1;
			if (aMatch !== bMatch) return aMatch - bMatch;
		}
		const tierDelta = completionTier(a) - completionTier(b);
		if (tierDelta !== 0) return tierDelta;
		return completionLabel(a).localeCompare(completionLabel(b), undefined, {
			sensitivity: 'base'
		});
	});
}
