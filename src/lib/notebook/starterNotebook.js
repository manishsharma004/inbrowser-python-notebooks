import { randomId } from '../utils/randomId.js';

/**
 * @returns {string}
 */
export function buildStarterNotebookJson() {
	return JSON.stringify(
		{
			version: 1,
			metadata: { trusted: true },
			cells: [
				{
					id: randomId(),
					kind: 'markdown',
					source:
						'# Welcome\n\nIn-browser Python notebooks with **Pyodide WebAssembly**.\n\n## Quick start\n\n- Run the code cells below (`Ctrl+Enter` or ▶)\n- `Shift+Enter` runs and jumps to the next cell\n- Workspace files (e.g. `data/iris.csv`) sync into `/workspace` before each run\n'
				},
				{
					id: randomId(),
					kind: 'code',
					source: 'import numpy as np\nprint("Pyodide", np.__version__)\n'
				},
				{
					id: randomId(),
					kind: 'code',
					source:
						'import csv\nfrom pathlib import Path\npath = Path("/workspace/data/iris.csv")\nrows = list(csv.reader(path.open())) if path.exists() else []\nprint("Iris rows:", max(0, len(rows) - 1))\n'
				},
				{
					id: randomId(),
					kind: 'code',
					source:
						'import matplotlib.pyplot as plt\nimport numpy as np\nx = np.linspace(0, 6.28, 200)\nplt.plot(x, np.sin(x))\nplt.title("Inline figure")\nplt.show()\n'
				}
			]
		},
		null,
		2
	);
}

/** Minimal iris sample for tutorials. */
export const STARTER_IRIS_CSV = `sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,setosa
4.9,3.0,1.4,0.2,setosa
7.0,3.2,4.7,1.4,versicolor
6.4,3.2,4.5,1.5,versicolor
6.3,3.3,6.0,2.5,virginica
`;
