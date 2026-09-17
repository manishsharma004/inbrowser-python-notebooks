import assert from 'node:assert/strict';
import test from 'node:test';
import { sessionStorageKey } from '../src/lib/pyodide/kernelSessionKeys.js';

test('sessionStorageKey scopes sessions per notebook file', () => {
	const key = sessionStorageKey('abc-123');
	assert.match(key, /^kernel-session-v1:abc-123$/);
	assert.notEqual(sessionStorageKey('a'), sessionStorageKey('b'));
});
