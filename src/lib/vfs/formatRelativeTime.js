/**
 * JupyterLab-style relative modified time.
 * @param {number} updatedAtMs
 * @param {number} [nowMs]
 */
export function formatRelativeTime(updatedAtMs, nowMs = Date.now()) {
	const delta = Math.max(0, nowMs - updatedAtMs);
	const sec = Math.floor(delta / 1000);
	if (sec < 10) return 'now';
	if (sec < 60) return `${sec} sec. ago`;
	const min = Math.floor(sec / 60);
	if (min < 60) return min === 1 ? '1 min. ago' : `${min} min. ago`;
	const hours = Math.floor(min / 60);
	if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
	const days = Math.floor(hours / 24);
	if (days === 1) return 'yesterday';
	if (days < 7) return `${days} days ago`;
	return new Date(updatedAtMs).toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
		year: updatedAtMs < nowMs - 365 * 86400000 ? 'numeric' : undefined
	});
}
