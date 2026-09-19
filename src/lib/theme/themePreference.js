/** @typedef {'dark' | 'light' | 'system'} ThemePreference */
/** @typedef {'dark' | 'light'} ResolvedTheme */

export const THEME_STORAGE_KEY = 'nb-theme-preference-v1';

/** @returns {ThemePreference} */
export function loadThemePreference() {
	if (typeof localStorage === 'undefined') return 'dark';
	const raw = localStorage.getItem(THEME_STORAGE_KEY);
	if (raw === 'light' || raw === 'system' || raw === 'dark') return raw;
	return 'dark';
}

/** @param {ThemePreference} preference */
export function saveThemePreference(preference) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(THEME_STORAGE_KEY, preference);
}

/**
 * @param {ThemePreference} preference
 * @returns {ResolvedTheme}
 */
export function resolveTheme(preference) {
	if (preference === 'light') return 'light';
	if (preference === 'dark') return 'dark';
	if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** @param {ResolvedTheme} resolved */
export function applyResolvedTheme(resolved) {
	if (typeof document === 'undefined') return;
	document.documentElement.dataset.theme = resolved;
	document.documentElement.style.colorScheme = resolved;
}

/**
 * @param {ThemePreference} preference
 * @param {(resolved: ResolvedTheme) => void} onChange
 */
export function watchSystemTheme(preference, onChange) {
	if (typeof window === 'undefined' || !window.matchMedia) return () => {};
	const media = window.matchMedia('(prefers-color-scheme: dark)');
	/** @param {MediaQueryListEvent | MediaQueryList} event */
	const handler = (event) => {
		if (loadThemePreference() !== 'system') return;
		const matches = 'matches' in event ? event.matches : media.matches;
		onChange(matches ? 'dark' : 'light');
	};
	media.addEventListener('change', handler);
	return () => media.removeEventListener('change', handler);
}

/** @param {ThemePreference} preference */
export function bootstrapTheme(preference = loadThemePreference()) {
	const resolved = resolveTheme(preference);
	applyResolvedTheme(resolved);
	return resolved;
}
