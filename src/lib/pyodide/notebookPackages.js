/** Pyodide wheels loaded for every notebook kernel (see runtime.js). */
export const NOTEBOOK_PRELOAD_PACKAGES = ['numpy', 'matplotlib'];

/**
 * Configure matplotlib for in-browser display after packages load.
 * @param {any} pyodide
 */
export async function configureMatplotlibBackend(pyodide) {
	await pyodide.runPythonAsync(`
import matplotlib
# Pyodide HTML canvas backend — plt.show() renders in the page.
matplotlib.use("module://matplotlib_pyodide.html_canvas")
`);
}
