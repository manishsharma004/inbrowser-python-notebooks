/**
 * @typedef {Object} DynamicPythonCompletionState
 * @property {string[]} modules
 * @property {Record<string, string[]>} members
 * @property {string[]} globals
 */

/** @type {DynamicPythonCompletionState} */
let state = {
	modules: [],
	members: {},
	globals: []
};

/**
 * @param {DynamicPythonCompletionState} next
 */
export function setDynamicPythonCompletions(next) {
	state = {
		modules: [...(next.modules ?? [])],
		members: { ...(next.members ?? {}) },
		globals: [...(next.globals ?? [])]
	};
}

export function clearDynamicPythonCompletions() {
	state = { modules: [], members: {}, globals: [] };
}

/** @returns {DynamicPythonCompletionState} */
export function getDynamicPythonCompletions() {
	return state;
}
