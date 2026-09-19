/**
 * Minimal markdown → HTML (headings, emphasis, code, links, lists).
 * @param {string} source
 * @param {{ collapsibleHeadings?: boolean }} [options]
 * @returns {string}
 */
export function renderMarkdown(source, options = {}) {
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

	const body = html || '<p class="nb-md-empty">Empty markdown cell.</p>';
	if (options.collapsibleHeadings === false) return body;
	return wrapCollapsibleSections(body);
}

/**
 * @param {string} html
 */
function wrapCollapsibleSections(html) {
	const parts = html.split(/(?=<h2>)/);
	if (parts.length <= 1) return html;
	return parts
		.map((part, index) => {
			if (index === 0 && !part.startsWith('<h2>')) return part;
			const titleMatch = /^<h2>([\s\S]*?)<\/h2>/.exec(part);
			if (!titleMatch) return part;
			const rest = part.slice(titleMatch[0].length);
			return `<details class="nb-md-fold" open><summary>${titleMatch[1]}</summary>${rest}</details>`;
		})
		.join('');
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
