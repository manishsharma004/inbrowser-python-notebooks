/**
 * @typedef {Object} DynamicPythonCompletionState
 * @property {string[]} modules
 * @property {Record<string, string[]>} members
 */

/** @type {DynamicPythonCompletionState} */
let state = {
	modules: [],
	members: {}
};

/**
 * @param {DynamicPythonCompletionState} next
 */
export function setDynamicPythonCompletions(next) {
	state = {
		modules: [...(next.modules ?? [])],
		members: { ...(next.members ?? {}) }
	};
}

export function clearDynamicPythonCompletions() {
	state = { modules: [], members: {} };
}

/** @returns {DynamicPythonCompletionState} */
export function getDynamicPythonCompletions() {
	return state;
}
