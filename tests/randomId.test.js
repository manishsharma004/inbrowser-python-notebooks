import assert from 'node:assert/strict';
import test from 'node:test';
import { randomId } from '../src/lib/utils/randomId.js';

test('randomId returns UUID-shaped strings', () => {
	const id = randomId();
	assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});

test('randomId generates distinct values', () => {
	const a = randomId();
	const b = randomId();
	assert.notEqual(a, b);
});
