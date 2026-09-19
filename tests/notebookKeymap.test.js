import assert from 'node:assert/strict';
import test from 'node:test';
import { isTypingTarget, notebookKeymapActive } from '../src/lib/notebook/notebookKeymap.js';

test('isTypingTarget detects monaco and form controls', () => {
	const input = { tagName: 'INPUT', isContentEditable: false, closest: () => null };
	assert.equal(isTypingTarget(/** @type {any} */ ({ target: input })), true);

	const monacoHost = {
		tagName: 'DIV',
		isContentEditable: false,
		closest: (sel) => (sel === '.monaco-editor' ? {} : null)
	};
	assert.equal(isTypingTarget(/** @type {any} */ ({ target: monacoHost })), true);
});

test('notebookKeymapActive requires canvas focus without modifiers', () => {
	const canvas = {
		closest: (sel) => (sel === '.nb-canvas' ? canvas : null)
	};
	assert.equal(
		notebookKeymapActive(
			/** @type {any} */ ({
				defaultPrevented: false,
				metaKey: false,
				ctrlKey: false,
				altKey: false,
				target: canvas
			})
		),
		true
	);
});
