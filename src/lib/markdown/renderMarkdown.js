/**
 * Minimal markdown → HTML (headings, emphasis, code, links, lists). No raw HTML pass-through.
 * @param {string} source
 * @returns {string}
 */
export function renderMarkdown(source) {
	const escaped = source
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');

	const blocks = escaped.split(/\n\n+/);
	const html = blocks
		.map((block) => {
			const trimmed = block.trim();
			if (!trimmed) return '';

			if (/^#{1,6}\s/.test(trimmed)) {
				const level = trimmed.match(/^#+/)?.[0].length ?? 1;
				const text = trimmed.replace(/^#{1,6}\s*/, '');
				return `<h${level}>${inlineMarkdown(text)}</h${level}>`;
			}

			if (/^[-*]\s/.test(trimmed)) {
				const items = trimmed
					.split('\n')
					.filter((line) => /^[-*]\s/.test(line))
					.map((line) => `<li>${inlineMarkdown(line.replace(/^[-*]\s*/, ''))}</li>`)
					.join('');
				return `<ul>${items}</ul>`;
			}

			return `<p>${trimmed.split('\n').map(inlineMarkdown).join('<br />')}</p>`;
		})
		.filter(Boolean)
		.join('\n');

	return html || '<p class="nb-md-empty">Empty markdown cell.</p>';
}

/**
 * @param {string} text
 */
function inlineMarkdown(text) {
	return text
		.replace(/`([^`]+)`/g, '<code>$1</code>')
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/\*([^*]+)\*/g, '<em>$1</em>')
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}
