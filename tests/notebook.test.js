import assert from 'node:assert/strict';
import test from 'node:test';
import { parseNotebook, serializeNotebook } from '../src/lib/notebook/parseNotebook.js';

test('parseNotebook returns defaults for invalid JSON', () => {
	const doc = parseNotebook('not-json');
	assert.equal(doc.version, 1);
	assert.equal(doc.cells.length, 1);
	assert.equal(doc.cells[0].kind, 'code');
});

test('serializeNotebook round-trips cells', () => {
	const doc = {
		version: 1,
		cells: [{ id: 'a', kind: /** @type {'code'} */ ('code'), source: '1+1\n' }]
	};
	const raw = serializeNotebook(doc);
	const again = parseNotebook(raw);
	assert.equal(again.cells[0].source, '1+1\n');
});
