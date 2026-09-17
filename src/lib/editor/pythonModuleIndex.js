/** @type {Record<string, string[]>} */
export const pythonModuleMemberIndex = {
	math: [
		'pi',
		'e',
		'sqrt',
		'sin',
		'cos',
		'tan',
		'log',
		'log10',
		'exp',
		'floor',
		'ceil',
		'fabs',
		'pow',
		'hypot',
		'degrees',
		'radians'
	],
	json: ['dumps', 'loads', 'dump', 'load', 'JSONEncoder', 'JSONDecoder'],
	random: ['random', 'randint', 'choice', 'shuffle', 'sample', 'seed', 'uniform', 'gauss'],
	os: ['environ', 'getcwd', 'listdir', 'mkdir', 'path', 'name', 'getenv'],
	re: ['compile', 'search', 'match', 'findall', 'sub', 'split', 'escape', 'IGNORECASE', 'MULTILINE'],
	datetime: ['date', 'time', 'datetime', 'timedelta', 'timezone'],
	collections: ['Counter', 'defaultdict', 'deque', 'namedtuple', 'OrderedDict', 'ChainMap'],
	itertools: ['count', 'cycle', 'repeat', 'chain', 'combinations', 'permutations', 'product', 'zip_longest'],
	functools: ['reduce', 'partial', 'lru_cache', 'wraps', 'cached_property'],
	statistics: ['mean', 'median', 'mode', 'stdev', 'variance'],
	pathlib: ['Path', 'PurePath', 'PosixPath'],
	typing: ['List', 'Dict', 'Set', 'Tuple', 'Optional', 'Union', 'Any', 'Callable'],
	sys: ['argv', 'path', 'version', 'platform', 'modules', 'builtin_module_names'],
	micropip: ['install', 'list'],
	numpy: [
		'array',
		'ndarray',
		'zeros',
		'ones',
		'empty',
		'arange',
		'linspace',
		'random',
		'linalg',
		'pi',
		'e',
		'inf',
		'nan',
		'reshape',
		'concatenate',
		'stack',
		'mean',
		'std',
		'sum',
		'min',
		'max'
	],
	'matplotlib.pyplot': [
		'plot',
		'show',
		'figure',
		'subplot',
		'subplots',
		'xlabel',
		'ylabel',
		'title',
		'legend',
		'savefig',
		'scatter',
		'bar',
		'hist',
		'imshow',
		'close',
		'grid',
		'axis'
	]
};

/** @type {string[]} */
export const pythonImportableModules = [
	'math',
	'json',
	'random',
	'os',
	're',
	'datetime',
	'collections',
	'itertools',
	'functools',
	'statistics',
	'pathlib',
	'typing',
	'sys',
	'hashlib',
	'html',
	'urllib',
	'zipfile',
	'csv',
	'base64',
	'copy',
	'string',
	'textwrap',
	'decimal',
	'fractions',
	'heapq',
	'bisect',
	'array',
	'enum',
	'inspect',
	'traceback',
	'warnings',
	'micropip',
	'pyodide',
	'js',
	'numpy',
	'matplotlib'
];

/**
 * @param {string} linePrefix Text from line start to cursor.
 * @returns {string | null}
 */
export function dottedNameBeforeCursor(linePrefix) {
	if (!linePrefix.endsWith('.')) return null;
	const stem = linePrefix.slice(0, -1);
	const parts = stem.split(/[\s,=()+\-*/\[\]{}:;]+/);
	const candidate = parts[parts.length - 1] ?? '';
	if (!/^[A-Za-z_]\w*(\.[A-Za-z_]\w*)*$/.test(candidate)) return null;
	return candidate;
}

/**
 * @param {string} linePrefix
 * @returns {{ kind: 'import' | 'from-import', module?: string } | null}
 */
export function importContext(linePrefix) {
	const fromMatch = linePrefix.match(/(?:^|\s)from\s+([\w.]+)\s+import\s+[\w., ]*$/);
	if (fromMatch) return { kind: 'from-import', module: fromMatch[1] };

	if (/(?:^|\s)import\s+[\w.]*$/.test(linePrefix)) return { kind: 'import' };

	return null;
}

/**
 * @param {string} modulePath
 * @param {Record<string, string[]>} dynamicMembers
 * @returns {string[]}
 */
export function membersForModule(modulePath, dynamicMembers) {
	if (!modulePath) return [];
	if (dynamicMembers[modulePath]?.length) return dynamicMembers[modulePath];

	const staticMembers = pythonModuleMemberIndex[modulePath];
	if (staticMembers?.length) return staticMembers;

	const root = modulePath.split('.')[0];
	if (root !== modulePath) {
		return dynamicMembers[root] ?? pythonModuleMemberIndex[root] ?? [];
	}

	return dynamicMembers[root] ?? pythonModuleMemberIndex[root] ?? [];
}

/**
 * @param {Record<string, string[]>} dynamicMembers
 * @param {string[]} [dynamicModuleList]
 * @returns {string[]}
 */
export function importableModuleSuggestions(dynamicMembers, dynamicModuleList = []) {
	const fromMembers = Object.keys(dynamicMembers).map((key) => key.split('.')[0]);
	return [...new Set([...pythonImportableModules, ...dynamicModuleList, ...fromMembers])].sort(
		(a, b) => a.localeCompare(b)
	);
}
