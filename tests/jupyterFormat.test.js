import assert from 'node:assert/strict';
import test from 'node:test';
import {
	fromJupyterNotebook,
	isJupyterNotebook,
	looksLikeJupyterCells,
	parseImportedNotebook,
	toJupyterNotebook,
	toJupyterSourceLines,
	vfsNotebookNameFromImport
} from '../src/lib/notebook/jupyterFormat.js';
import { parseNotebook } from '../src/lib/notebook/parseNotebook.js';

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

test('isJupyterNotebook accepts nbformat as string and cell-only exports', () => {
	assert.equal(isJupyterNotebook({ nbformat: '4', cells: [] }), true);
	assert.equal(
		isJupyterNotebook({
			cells: [{ cell_type: 'code', source: 'x\n', metadata: {}, outputs: [] }]
		}),
		true
	);
	assert.equal(looksLikeJupyterCells([{ cell_type: 'markdown', source: '' }]), true);
});

test('toJupyterNotebook round-trip shape', () => {
	const doc = {
		version: 1,
		cells: [
			{
				id: 'a',
				kind: /** @type {'code'} */ ('code'),
				source: 'x = 1\n',
				lastRun: { ok: true, text: '1\n', executionCount: 1, figures: [] }
			}
		]
	};
	const jupyter = toJupyterNotebook(doc);
	assert.equal(jupyter.nbformat, 4);
	assert.equal(isJupyterNotebook(jupyter), true);
	const cells = /** @type {{ outputs: unknown[]; execution_count: number | null; id: string }[]} */ (
		jupyter.cells
	);
	assert.equal(cells[0].execution_count, 1);
	assert.equal(cells[0].id, 'a');
	assert.ok(cells[0].outputs.length >= 1);
	const raw = JSON.stringify(jupyter);
	const imported = parseImportedNotebook(raw);
	assert.ok(imported);
	assert.equal(imported?.cells[0].source, 'x = 1\n');
	assert.equal(imported?.cells[0].lastRun?.executionCount, 1);
});

test('parseNotebook loads Jupyter nbformat from VFS-style raw string', () => {
	const jupyter = {
		nbformat: 4,
		nbformat_minor: 5,
		metadata: {},
		cells: [{ cell_type: 'code', source: ['print("hi")\n'], outputs: [], execution_count: null }]
	};
	const doc = parseNotebook(JSON.stringify(jupyter));
	assert.equal(doc.cells[0].source, 'print("hi")\n');
});

test('vfsNotebookNameFromImport normalizes extensions', () => {
	assert.equal(vfsNotebookNameFromImport('demo.ipynb'), 'demo.ipynb.json');
	assert.equal(vfsNotebookNameFromImport('demo.ipynb.json'), 'demo.ipynb.json');
	assert.equal(vfsNotebookNameFromImport('demo.json'), 'demo.ipynb.json');
});
