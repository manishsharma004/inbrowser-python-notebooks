import assert from 'node:assert/strict';
import test from 'node:test';
import {
	COMPLETION_TIER,
	completionTier,
	sortCompletionItems
} from '../src/lib/editor/completionSort.js';

test('completionTier prefers members over methods and globals', () => {
	assert.equal(completionTier({ label: 'a', detail: 'math member' }), COMPLETION_TIER.MEMBER);
	assert.equal(completionTier({ label: 'split', kind: 0 }), COMPLETION_TIER.METHOD);
	assert.equal(completionTier({ label: 'x', detail: 'kernel global', kind: 4 }), COMPLETION_TIER.GLOBAL);
	assert.equal(completionTier({ label: 'if', kind: 1, detail: 'keyword' }), COMPLETION_TIER.GENERAL);
});

test('sortCompletionItems orders tiers then alphabetically', () => {
	const sorted = sortCompletionItems([
		{ label: 'zip', detail: 'builtin' },
		{ label: 'append', kind: 0 },
		{ label: 'beta', detail: 'numpy member' },
		{ label: 'alpha', detail: 'numpy member' },
		{ label: 'user_x', detail: 'kernel global', kind: 4 }
	]).map((item) => item.label);

	assert.deepEqual(sorted, ['alpha', 'beta', 'append', 'user_x', 'zip']);
});

test('sortCompletionItems prefers prefix match and deprioritizes dunders', () => {
	const sorted = sortCompletionItems(
		[
			{ label: '__dict__', detail: 'builtin' },
			{ label: 'date', detail: 'datetime member' },
			{ label: 'datetime', detail: 'datetime member' }
		],
		{ typedPrefix: 'd' }
	).map((item) => item.label);

	assert.deepEqual(sorted, ['date', 'datetime', '__dict__']);
});
