/// <reference types="@sveltejs/kit" />

declare global {
	interface Window {
		loadPyodide?: (config?: { indexURL?: string }) => Promise<unknown>;
	}
}

export {};
