import assert from 'node:assert/strict';
import test from 'node:test';
import { cellIndexById, nextCellId, prevCellId } from '../src/lib/notebook/notebookCellNavigation.js';

test('cell navigation helpers', () => {
	const cells = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
	assert.equal(cellIndexById(cells, 'b'), 1);
	assert.equal(nextCellId(cells, 'b'), 'c');
	assert.equal(prevCellId(cells, 'b'), 'a');
	assert.equal(nextCellId(cells, 'c'), null);
	assert.equal(prevCellId(cells, 'a'), null);
});
