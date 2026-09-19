/**
 * Strip scripts and dangerous URLs from trusted HTML outputs.
 * @param {string} html
 * @returns {string}
 */
export function sanitizeTrustedHtml(html) {
	return html
		.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
		.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
		.replace(/javascript:/gi, 'blocked:');
}
