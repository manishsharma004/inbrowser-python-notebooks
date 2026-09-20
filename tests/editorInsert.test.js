import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { pairInsertSpec } from '../src/lib/editor/editorInsert.js';

describe('editorInsert', () => {
	it('pairInsertSpec places cursor inside pair', () => {
		const spec = pairInsertSpec('(', ')');
		assert.equal(spec.text, '()');
		assert.equal(spec.selectionOffset, -1);
	});

	it('pairInsertSpec works for quotes', () => {
		const spec = pairInsertSpec('"', '"');
		assert.equal(spec.text, '""');
		assert.equal(spec.selectionOffset, -1);
	});
});
