import assert from 'node:assert/strict';
import test from 'node:test';
import {
	fromJupyterNotebook,
	isJupyterNotebook,
	parseImportedNotebook,
	toJupyterNotebook,
	toJupyterSourceLines
} from '../src/lib/notebook/jupyterFormat.js';

test('toJupyterSourceLines preserves trailing newline segments', () => {
	assert.deepEqual(toJupyterSourceLines('a\nb'), ['a\n', 'b']);
});

test('fromJupyterNotebook maps markdown and code cells', () => {
	const doc = fromJupyterNotebook(
		{
			nbformat: 4,
			cells: [
				{ cell_type: 'markdown', source: '# Title\n' },
				{ cell_type: 'code', source: ['print(1)\n'] }
			]
		},
		{ createId: () => 'id-fixed' }
	);
	assert.equal(doc.cells.length, 2);
	assert.equal(doc.cells[0].kind, 'markdown');
	assert.equal(doc.cells[1].source, 'print(1)\n');
});

test('toJupyterNotebook round-trip shape', () => {
	const doc = {
		version: 1,
		cells: [{ id: 'a', kind: /** @type {'code'} */ ('code'), source: 'x = 1\n' }]
	};
	const jupyter = toJupyterNotebook(doc);
	assert.equal(jupyter.nbformat, 4);
	assert.equal(isJupyterNotebook(jupyter), true);
	const raw = JSON.stringify(jupyter);
	const imported = parseImportedNotebook(raw);
	assert.ok(imported);
	assert.equal(imported?.cells[0].source, 'x = 1\n');
});
