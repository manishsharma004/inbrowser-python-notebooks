export const PANEL_LAYOUT_STORAGE_KEY = 'nb-panel-layout-v1';

export const RAIL_WIDTH_DEFAULT = 248;
export const RAIL_WIDTH_MIN = 160;
export const RAIL_WIDTH_MAX = 420;

export const SESSION_WIDTH_DEFAULT = 304;
export const SESSION_WIDTH_MIN = 220;
export const SESSION_WIDTH_MAX = 640;

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function clampPanelWidth(value, min, max) {
	return Math.min(max, Math.max(min, value));
}

/**
 * @returns {{ rail: number; session: number }}
 */
export function loadPanelLayout() {
	const fallback = { rail: RAIL_WIDTH_DEFAULT, session: SESSION_WIDTH_DEFAULT };
	if (typeof localStorage === 'undefined') return fallback;
	try {
		const raw = JSON.parse(localStorage.getItem(PANEL_LAYOUT_STORAGE_KEY) ?? '{}');
		return {
			rail: clampPanelWidth(
				typeof raw.rail === 'number' ? raw.rail : RAIL_WIDTH_DEFAULT,
				RAIL_WIDTH_MIN,
				RAIL_WIDTH_MAX
			),
			session: clampPanelWidth(
				typeof raw.session === 'number' ? raw.session : SESSION_WIDTH_DEFAULT,
				SESSION_WIDTH_MIN,
				SESSION_WIDTH_MAX
			)
		};
	} catch {
		return fallback;
	}
}

/**
 * @param {number} rail
 * @param {number} session
 */
export function savePanelLayout(rail, session) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(
		PANEL_LAYOUT_STORAGE_KEY,
		JSON.stringify({
			rail: clampPanelWidth(rail, RAIL_WIDTH_MIN, RAIL_WIDTH_MAX),
			session: clampPanelWidth(session, SESSION_WIDTH_MIN, SESSION_WIDTH_MAX)
		})
	);
}
