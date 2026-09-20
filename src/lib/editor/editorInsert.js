/**
 * @param {string} open
 * @param {string} close
 * @returns {{ text: string, selectionOffset: number }}
 */
export function pairInsertSpec(open, close) {
	return { text: `${open}${close}`, selectionOffset: -close.length };
}

/**
 * @param {import('monaco-editor').editor.IStandaloneCodeEditor} editor
 * @param {typeof import('monaco-editor')} monaco
 * @param {string} text
 * @param {number} [selectionOffset=0]
 */
export function insertAtMonacoEditor(editor, monaco, text, selectionOffset = 0) {
	const selection = editor.getSelection();
	if (!selection) return;
	const model = editor.getModel();
	if (!model) return;
	const startOffset = model.getOffsetAt(selection.getStartPosition());
	editor.executeEdits('mobile-accessory', [{ range: selection, text, forceMoveMarkers: true }]);
	const caret = Math.max(0, startOffset + text.length + selectionOffset);
	const pos = model.getPositionAt(Math.min(caret, model.getValueLength()));
	editor.setSelection(new monaco.Selection(pos.lineNumber, pos.column, pos.lineNumber, pos.column));
	editor.focus();
}

/**
 * @param {HTMLTextAreaElement} textarea
 * @param {string} text
 * @param {number} [selectionOffset=0]
 */
export function insertAtTextarea(textarea, text, selectionOffset = 0) {
	const start = textarea.selectionStart ?? textarea.value.length;
	const end = textarea.selectionEnd ?? start;
	const before = textarea.value.slice(0, start);
	const after = textarea.value.slice(end);
	textarea.value = before + text + after;
	const caret = start + text.length + selectionOffset;
	const pos = Math.max(0, Math.min(caret, textarea.value.length));
	textarea.selectionStart = pos;
	textarea.selectionEnd = pos;
	textarea.dispatchEvent(new Event('input', { bubbles: true }));
	textarea.focus();
}
