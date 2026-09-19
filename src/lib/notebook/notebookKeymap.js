/**
 * Jupyter / VS Code–style notebook shortcuts (client-only).
 * See microsoft/vscode-jupyter command IDs for parity naming.
 */

/** @param {KeyboardEvent} event */
export function isTypingTarget(event) {
	const target = /** @type {HTMLElement | null} */ (event.target);
	if (!target) return false;
	const tag = target.tagName;
	if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
	if (target.isContentEditable) return true;
	if (target.closest('.monaco-editor')) return true;
	return false;
}

/** @param {KeyboardEvent} event */
export function notebookKeymapActive(event) {
	if (event.defaultPrevented) return false;
	if (event.metaKey || event.ctrlKey || event.altKey) return false;
	if (isTypingTarget(event)) return false;
	const target = /** @type {{ closest?: (selector: string) => unknown } | null} */ (event.target);
	if (!target || typeof target.closest !== 'function') return false;
	return Boolean(target.closest('.nb-canvas'));
}

/**
 * @typedef {Object} NotebookKeymapActions
 * @property {(kind?: 'code' | 'markdown') => void} insertAbove
 * @property {(kind?: 'code' | 'markdown') => void} insertBelow
 * @property {() => void} deleteCell
 * @property {() => void} toMarkdown
 * @property {() => void} toCode
 * @property {() => void} focusPrev
 * @property {() => void} focusNext
 * @property {() => void} copyCell
 * @property {() => void} pasteBelow
 */

/**
 * @param {NotebookKeymapActions} actions
 */
export function attachNotebookKeymap(actions) {
	/** @type {string | null} */
	let pending = null;
	/** @type {ReturnType<typeof setTimeout> | null} */
	let pendingTimer = null;

	/** @param {KeyboardEvent} event */
	function onKeyDown(event) {
		if (!notebookKeymapActive(event)) return;

		const key = event.key.toLowerCase();

		if (key === 'd') {
			if (pending === 'd') {
				pending = null;
				if (pendingTimer) clearTimeout(pendingTimer);
				event.preventDefault();
				actions.deleteCell();
				return;
			}
			pending = 'd';
			if (pendingTimer) clearTimeout(pendingTimer);
			pendingTimer = setTimeout(() => {
				pending = null;
			}, 400);
			return;
		}

		pending = null;
		if (pendingTimer) clearTimeout(pendingTimer);

		switch (key) {
			case 'a':
				event.preventDefault();
				actions.insertAbove('code');
				break;
			case 'b':
				event.preventDefault();
				actions.insertBelow('code');
				break;
			case 'm':
				event.preventDefault();
				actions.toMarkdown();
				break;
			case 'y':
				event.preventDefault();
				actions.toCode();
				break;
			case 'c':
				event.preventDefault();
				actions.copyCell();
				break;
			case 'v':
				event.preventDefault();
				actions.pasteBelow();
				break;
			default:
				break;
		}
	}

	window.addEventListener('keydown', onKeyDown);
	return () => {
		window.removeEventListener('keydown', onKeyDown);
		if (pendingTimer) clearTimeout(pendingTimer);
	};
}
