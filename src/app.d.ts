/// <reference types="@sveltejs/kit" />

declare module 'monaco-pyright-lsp' {
	export class MonacoPyrightProvider {
		init(monaco: unknown): Promise<void>;
		setupDiagnostics(editor: unknown): Promise<void>;
	}
}

declare global {
	interface Window {
		loadPyodide?: (config?: { indexURL?: string }) => Promise<unknown>;
	}
}

export {};
