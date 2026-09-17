/**
 * Optional in-browser Pyright (Pylance-class analysis) via monaco-pyright-lsp.
 *
 * Enable with `VITE_ENABLE_PYRIGHT=true` at build/dev time. The dependency is
 * loaded dynamically so default builds stay lightweight.
 */

/** @type {Promise<any | null> | null} */
let providerPromise = null;

/**
 * @param {typeof import('monaco-editor')} monaco
 */
export async function getPyrightProvider(monaco) {
	if (import.meta.env.VITE_ENABLE_PYRIGHT !== 'true') return null;
	if (!providerPromise) {
		providerPromise = (async () => {
			try {
				// @ts-ignore optional peer — install when VITE_ENABLE_PYRIGHT=true
				const { MonacoPyrightProvider } = await import('monaco-pyright-lsp');
				const provider = new MonacoPyrightProvider();
				await provider.init(monaco);
				return provider;
			} catch (error) {
				console.warn('Pyright provider failed to initialize', error);
				return null;
			}
		})();
	}
	return providerPromise;
}

/**
 * @param {import('monaco-editor').editor.IStandaloneCodeEditor} editor
 * @param {typeof import('monaco-editor')} monaco
 */
export async function attachPyrightToEditor(editor, monaco) {
	const provider = await getPyrightProvider(monaco);
	if (!provider) return;
	await provider.setupDiagnostics(editor);
}

/**
 * Sync notebook cells into Pyright's virtual workspace (one module per notebook).
 * Full multi-file analysis requires the language server to see open documents;
 * this prepares cell paths for a future LSP workspace sync layer.
 *
 * @param {string} notebookName
 * @param {{ id: string; kind: string; source: string }[]} cells
 */
export function syncNotebookCellsForAnalysis(notebookName, cells) {
	if (import.meta.env.VITE_ENABLE_PYRIGHT !== 'true') return;
	void notebookName;
	void cells;
}
