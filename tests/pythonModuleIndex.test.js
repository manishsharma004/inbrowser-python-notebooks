import assert from 'node:assert/strict';
import test from 'node:test';
import {
	dottedNameBeforeCursor,
	importContext,
	membersForModule
} from '../src/lib/editor/pythonModuleIndex.js';

test('dottedNameBeforeCursor parses attribute chains', () => {
	assert.equal(dottedNameBeforeCursor('x = math.'), 'math');
	assert.equal(dottedNameBeforeCursor('json.'), 'json');
});

test('importContext detects import and from-import lines', () => {
	assert.deepEqual(importContext('import '), { kind: 'import' });
	assert.deepEqual(importContext('from math import '), {
		kind: 'from-import',
		module: 'math'
	});
});

test('membersForModule merges static index', () => {
	assert.ok(membersForModule('math', {}).includes('sqrt'));
});
