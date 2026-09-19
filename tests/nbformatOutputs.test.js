import assert from 'node:assert/strict';
import test from 'node:test';
import {
	jupyterOutputsFromRunSnapshot,
	runSnapshotFromJupyterOutputs,
	shouldScrollOutput
} from '../src/lib/notebook/nbformatOutputs.js';
import {
	applyCellOutputsToNotebook,
	cellOutputsFromNotebook
} from '../src/lib/notebook/notebookRunState.js';

test('runSnapshotFromJupyterOutputs reads stream and png display_data', () => {
	const snap = runSnapshotFromJupyterOutputs(
		[
			{ output_type: 'stream', name: 'stdout', text: ['hello\n'] },
			{ output_type: 'display_data', data: { 'image/png': 'abc123' }, metadata: {} }
		],
		3
	);
	assert.ok(snap);
	assert.equal(snap?.executionCount, 3);
	assert.equal(snap?.text, 'hello\n');
	assert.deepEqual(snap?.figures, ['abc123']);
});

test('jupyterOutputsFromRunSnapshot round-trips text and figures', () => {
	const outputs = jupyterOutputsFromRunSnapshot({
		ok: true,
		text: 'line\n',
		executionCount: 2,
		figures: ['pngb64']
	});
	assert.equal(outputs.length, 2);
	assert.equal(outputs[0].output_type, 'stream');
	assert.equal(outputs[1].output_type, 'display_data');
});

test('shouldScrollOutput respects metadata and line threshold', () => {
	assert.equal(shouldScrollOutput('a', true), true);
	assert.equal(shouldScrollOutput('a', false), false);
	const long = Array.from({ length: 101 }, (_, i) => `line ${i}`).join('\n');
	assert.equal(shouldScrollOutput(long, undefined), true);
});

test('cellOutputsFromNotebook hydrates from persisted lastRun', () => {
	const map = cellOutputsFromNotebook([
		{
			id: 'c1',
			kind: 'code',
			source: 'x=1',
			lastRun: { ok: true, text: 'ok', executionCount: 1, figures: [] }
		}
	]);
	assert.equal(map.c1.executionCount, 1);
	const doc = applyCellOutputsToNotebook(
		{ version: 1, cells: [{ id: 'c1', kind: 'code', source: 'x=1' }] },
		{
			c1: {
				ok: true,
				text: 'out',
				executionCount: 2,
				startedAt: 1,
				finishedAt: 2,
				durationMs: 1,
				figures: []
			}
		}
	);
	assert.equal(doc.cells[0].lastRun?.executionCount, 2);
});
