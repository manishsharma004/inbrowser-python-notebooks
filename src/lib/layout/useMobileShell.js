export const BP_TABLET = 960;
export const BP_MOBILE = 640;

/** @returns {boolean} */
export function isTouchPrimary() {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(pointer: coarse)').matches;
}

/** @returns {boolean} */
export function isNarrowViewport() {
	if (typeof window === 'undefined') return false;
	return window.matchMedia(`(max-width: ${BP_MOBILE}px)`).matches;
}

/** @returns {boolean} */
export function isTabletViewport() {
	if (typeof window === 'undefined') return false;
	return window.matchMedia(
		`(min-width: ${BP_MOBILE + 1}px) and (max-width: ${BP_TABLET}px)`
	).matches;
}

/**
 * @param {'monaco' | 'textarea' | null} focusedKind
 * @returns {boolean}
 */
export function shouldShowCodeAccessory(focusedKind) {
	if (!focusedKind) return false;
	if (typeof window === 'undefined') return false;
	const coarse = isTouchPrimary();
	const narrow = isNarrowViewport();
	const phoneLike = window.matchMedia('(max-width: 768px)').matches;
	return (coarse || narrow || phoneLike) && Boolean(focusedKind);
}

/** @param {(offsetPx: number) => void} onOffset */
export function attachVisualViewportKeyboardOffset(onOffset) {
	if (typeof window === 'undefined' || !window.visualViewport) {
		onOffset(0);
		return () => {};
	}
	const vv = window.visualViewport;
	const update = () => {
		const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
		onOffset(offset);
	};
	update();
	vv.addEventListener('resize', update);
	vv.addEventListener('scroll', update);
	window.addEventListener('resize', update);
	return () => {
		vv.removeEventListener('resize', update);
		vv.removeEventListener('scroll', update);
		window.removeEventListener('resize', update);
	};
}
