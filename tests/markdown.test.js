import assert from 'node:assert/strict';
import test from 'node:test';
import { renderMarkdown } from '../src/lib/markdown/renderMarkdown.js';

test('renderMarkdown escapes HTML and renders headings', () => {
	const html = renderMarkdown('# Hello\n\n<script>x</script>');
	assert.match(html, /<h1>Hello<\/h1>/);
	assert.doesNotMatch(html, /<script>/);
});
