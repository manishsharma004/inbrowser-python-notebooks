/** Pyodide wheels loaded for every notebook kernel (see pyodide-kernel.worker.js). */
export const NOTEBOOK_PRELOAD_PACKAGES = ['numpy', 'matplotlib', 'scipy', 'pillow'];

/**
 * Inline figures: Agg backend + patched plt.show() → PNG queue drained after each cell.
 * @param {any} pyodide
 */
export async function loadNotebookPackages(pyodide) {
	await pyodide.loadPackage(NOTEBOOK_PRELOAD_PACKAGES);
	await configureMatplotlibBackend(pyodide);
}

/**
 * @param {any} pyodide
 */
export async function configureMatplotlibBackend(pyodide) {
	await pyodide.runPythonAsync(`
import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt
import io
import base64

_NB_FIGURE_PNGS = []

def nb_hook_matplotlib_show():
    def show(*_args, **_kwargs):
        for num in list(plt.get_fignums()):
            fig = plt.figure(num)
            bio = io.BytesIO()
            fig.savefig(
                bio,
                format="png",
                bbox_inches="tight",
                dpi=120,
                facecolor=fig.get_facecolor(),
                edgecolor="none",
            )
            _NB_FIGURE_PNGS.append(base64.b64encode(bio.getvalue()).decode("ascii"))
            plt.close(fig)

    plt.show = show

def nb_drain_figure_pngs():
    import json
    out = list(_NB_FIGURE_PNGS)
    _NB_FIGURE_PNGS.clear()
    return json.dumps(out)

nb_hook_matplotlib_show()
`);
}

/**
 * Remove floating matplotlib_pyodide widgets from prior html_canvas runs.
 */
export function cleanupStrayMatplotlibWidgets() {
	if (typeof document === 'undefined') return;
	for (const el of document.querySelectorAll(
		'div.mpl-canvas, .matplotlib-figure, .mpl-toolbar, [id^="matplotlib_"]'
	)) {
		el.remove();
	}
}
