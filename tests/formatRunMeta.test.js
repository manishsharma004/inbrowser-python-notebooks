import assert from 'node:assert/strict';
import test from 'node:test';
import { formatDuration, formatRunTimestamp } from '../src/lib/notebook/formatRunMeta.js';

test('formatDuration scales units', () => {
	assert.equal(formatDuration(0.4), '<1 ms');
	assert.equal(formatDuration(42.2), '42 ms');
	assert.equal(formatDuration(1500), '1.50 s');
});

test('formatRunTimestamp returns a non-empty label', () => {
	const label = formatRunTimestamp(Date.UTC(2026, 8, 17, 14, 30, 5));
	assert.match(label, /2026/);
	assert.match(label, /14/);
});
