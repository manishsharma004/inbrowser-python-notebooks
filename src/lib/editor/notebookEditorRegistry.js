/** @typedef {{ kind: 'monaco', cellId: string, editor: import('monaco-editor').editor.IStandaloneCodeEditor, getMonaco: () => Promise<typeof import('monaco-editor')> } | { kind: 'textarea', cellId: string, textarea: HTMLTextAreaElement }} ActiveEditorTarget */

/** @type {Map<string, () => void>} */
const focusHandlers = new Map();

/** @type {ActiveEditorTarget | null} */
let activeEditorTarget = null;

/** @type {'monaco' | 'textarea' | null} */
let activeEditorKind = null;

/** @type {Set<(kind: 'monaco' | 'textarea' | null) => void>} */
const kindListeners = new Set();

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

/** @param {ActiveEditorTarget | null} target */
export function setActiveNotebookEditor(target) {
	activeEditorTarget = target;
	activeEditorKind = target?.kind ?? null;
	for (const listener of kindListeners) {
		listener(activeEditorKind);
	}
}

/** @param {string} cellId */
export function clearActiveNotebookEditor(cellId) {
	if (activeEditorTarget?.cellId === cellId) {
		setActiveNotebookEditor(null);
	}
}

/** @returns {'monaco' | 'textarea' | null} */
export function getActiveEditorKind() {
	return activeEditorKind;
}

/** @param {(kind: 'monaco' | 'textarea' | null) => void} listener */
export function subscribeActiveEditorKind(listener) {
	listener(activeEditorKind);
	kindListeners.add(listener);
	return () => {
		kindListeners.delete(listener);
	};
}

/**
 * @param {string} text
 * @param {number} [selectionOffset=0]
 */
export async function insertIntoActiveEditor(text, selectionOffset = 0) {
	if (!activeEditorTarget) return;
	if (activeEditorTarget.kind === 'monaco') {
		const monaco = await activeEditorTarget.getMonaco();
		const { insertAtMonacoEditor } = await import('./editorInsert.js');
		insertAtMonacoEditor(activeEditorTarget.editor, monaco, text, selectionOffset);
		return;
	}
	const { insertAtTextarea } = await import('./editorInsert.js');
	insertAtTextarea(activeEditorTarget.textarea, text, selectionOffset);
}
