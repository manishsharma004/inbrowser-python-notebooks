/** Pyodide wheels loaded for every notebook kernel (see runtime.js). */
export const NOTEBOOK_PRELOAD_PACKAGES = ['numpy', 'matplotlib-pyodide', 'matplotlib'];

/**
 * @param {any} pyodide
 */
export async function loadNotebookPackages(pyodide) {
	await pyodide.loadPackage('numpy');
	try {
		await pyodide.loadPackage(['matplotlib-pyodide', 'matplotlib']);
	} catch {
		await pyodide.loadPackage('matplotlib');
	}
	await configureMatplotlibBackend(pyodide);
}

/**
 * Configure matplotlib for in-browser display after packages load.
 * @param {any} pyodide
 */
export async function configureMatplotlibBackend(pyodide) {
	await pyodide.runPythonAsync(`
import matplotlib
try:
    import matplotlib_pyodide  # noqa: F401
    matplotlib.use("module://matplotlib_pyodide.html_canvas")
except ImportError:
    import matplotlib.pyplot as _plt  # noqa: F401 — pyodide default backend when available
`);
}
