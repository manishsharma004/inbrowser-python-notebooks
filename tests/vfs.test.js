import assert from 'node:assert/strict';
import test from 'node:test';
import {
	createNode,
	emptySnapshot,
	listChildren,
	writeFile
} from '../src/lib/vfs/vfsTree.js';

test('emptySnapshot has a root directory', () => {
	const snap = emptySnapshot();
	assert.ok(snap.rootId);
	const root = snap.nodes.find((n) => n.id === snap.rootId);
	assert.equal(root?.type, 'directory');
});

test('createNode and listChildren maintain tree order', () => {
	const snap = emptySnapshot();
	createNode(snap, snap.rootId, 'notes', 'directory');
	const file = createNode(snap, snap.rootId, 'main.ipynb.json', 'file', '{}');
	writeFile(snap, file.id, '{"version":1,"cells":[]}');
	const kids = listChildren(snap, snap.rootId);
	assert.equal(kids[0].type, 'directory');
	assert.equal(kids[1].name, 'main.ipynb.json');
});
