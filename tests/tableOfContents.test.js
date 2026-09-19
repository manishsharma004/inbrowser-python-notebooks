import assert from 'node:assert/strict';
import test from 'node:test';
import { tableOfContentsFromNotebook } from '../src/lib/notebook/tableOfContents.js';

test('tableOfContentsFromNotebook extracts markdown headings', () => {
	const entries = tableOfContentsFromNotebook([
		{ id: 'a', kind: 'markdown', source: '# Title\n\n## Section\n' },
		{ id: 'b', kind: 'code', source: 'x=1' }
	]);
	assert.equal(entries.length, 2);
	assert.equal(entries[0].title, 'Title');
	assert.equal(entries[1].level, 2);
});
