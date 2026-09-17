export const LEGACY_SESSION_KEY = 'kernel-session-v1';

/**
 * @param {string} notebookFileId
 */
export function sessionStorageKey(notebookFileId) {
	return `${LEGACY_SESSION_KEY}:${notebookFileId}`;
}
