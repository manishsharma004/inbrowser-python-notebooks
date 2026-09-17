/**
 * @param {number} ms
 * @returns {string}
 */
export function formatDuration(ms) {
	if (!Number.isFinite(ms) || ms < 0) return '—';
	if (ms < 1) return '<1 ms';
	if (ms < 1000) return `${Math.round(ms)} ms`;
	if (ms < 10_000) return `${(ms / 1000).toFixed(2)} s`;
	return `${(ms / 1000).toFixed(1)} s`;
}

/**
 * @param {number} epochMs
 * @returns {string}
 */
export function formatRunTimestamp(epochMs) {
	if (!Number.isFinite(epochMs)) return '—';
	return new Date(epochMs).toLocaleString(undefined, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});
}

/**
 * @param {number} startedMs
 * @param {number} finishedMs
 * @param {number} durationMs
 * @returns {string}
 */
export function formatRunSummary(startedMs, finishedMs, durationMs) {
	return `${formatRunTimestamp(finishedMs)} · ${formatDuration(durationMs)}`;
}
