/** @typedef {'files' | 'notebook' | 'session' | 'more'} MobileTab */

export const MOBILE_TAB_STORAGE_KEY = 'nb-mobile-tab-v1';

/** @type {MobileTab[]} */
export const MOBILE_TABS = ['files', 'notebook', 'session', 'more'];

/** @param {string | null | undefined} raw @returns {MobileTab} */
export function parseMobileTab(raw) {
	if (raw === 'files' || raw === 'notebook' || raw === 'session' || raw === 'more') {
		return raw;
	}
	return 'notebook';
}

/** @param {MobileTab} tab */
export function saveMobileTab(tab) {
	if (typeof sessionStorage === 'undefined') return;
	sessionStorage.setItem(MOBILE_TAB_STORAGE_KEY, tab);
}

/** @returns {MobileTab} */
export function loadMobileTab() {
	if (typeof sessionStorage === 'undefined') return 'notebook';
	return parseMobileTab(sessionStorage.getItem(MOBILE_TAB_STORAGE_KEY));
}
