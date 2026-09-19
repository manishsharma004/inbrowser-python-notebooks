/**
 * Map between internal cell run records and Jupyter nbformat 4 outputs.
 */

/**
 * @typedef {Object} CellRunSnapshot
 * @property {boolean} ok
 * @property {string} text
 * @property {number} executionCount
 * @property {string[]} [figures]
 * @property {number} [startedAt]
 * @property {number} [finishedAt]
 * @property {number} [durationMs]
 */

/**
 * @param {string | string[]} data
 * @returns {string}
 */
function normalizeMultiline(data) {
	if (Array.isArray(data)) return data.join('');
	if (typeof data === 'string') return data;
	return '';
}

/**
 * @param {unknown[]} outputs
 * @param {number | null} [executionCount]
 * @returns {CellRunSnapshot | null}
 */
export function runSnapshotFromJupyterOutputs(outputs, executionCount = null) {
	if (!Array.isArray(outputs) || outputs.length === 0) {
		if (executionCount != null && executionCount > 0) {
			return {
				ok: true,
				text: '',
				executionCount,
				figures: []
			};
		}
		return null;
	}

	/** @type {string[]} */
	const chunks = [];
	/** @type {string[]} */
	const figures = [];
	let ok = true;

	for (const item of outputs) {
		if (!item || typeof item !== 'object') continue;
		const record = /** @type {Record<string, unknown>} */ (item);
		const outputType = record.output_type;

		if (outputType === 'stream') {
			const name = record.name === 'stderr' ? 'stderr' : 'stdout';
			const text = normalizeMultiline(/** @type {string | string[]} */ (record.text));
			if (text) chunks.push(name === 'stderr' ? text : text);
		} else if (outputType === 'error') {
			ok = false;
			const ename = String(record.ename ?? 'Error');
			const evalue = String(record.evalue ?? '');
			const traceback = Array.isArray(record.traceback)
				? record.traceback.map((line) => String(line).replace(/\u001b\[[0-9;]*m/g, '')).join('\n')
				: '';
			chunks.push([ename, evalue, traceback].filter(Boolean).join('\n'));
		} else if (outputType === 'execute_result' || outputType === 'display_data') {
			const data = record.data;
			if (data && typeof data === 'object') {
				const mime = /** @type {Record<string, unknown>} */ (data);
				if (typeof mime['image/png'] === 'string') {
					figures.push(String(mime['image/png']));
				}
				if (typeof mime['text/plain'] === 'string') {
					chunks.push(normalizeMultiline(mime['text/plain']));
				}
			}
		}
	}

	const count =
		typeof executionCount === 'number' && executionCount > 0
			? executionCount
			: ok
				? 1
				: 1;

	return {
		ok,
		text: chunks.join('\n'),
		executionCount: count,
		figures
	};
}

/**
 * @param {CellRunSnapshot | null | undefined} snapshot
 * @returns {Record<string, unknown>[]}
 */
export function jupyterOutputsFromRunSnapshot(snapshot) {
	if (!snapshot) return [];

	/** @type {Record<string, unknown>[]} */
	const outputs = [];

	if (snapshot.text) {
		const name = snapshot.ok ? 'stdout' : 'stderr';
		const lines = snapshot.text.split('\n');
		const text = lines.map((line, index) => (index < lines.length - 1 ? `${line}\n` : line));
		outputs.push({
			output_type: 'stream',
			name,
			text
		});
	}

	for (const png of snapshot.figures ?? []) {
		outputs.push({
			output_type: 'display_data',
			data: { 'image/png': png },
			metadata: {}
		});
	}

	if (!snapshot.ok && snapshot.text && outputs.length === 0) {
		outputs.push({
			output_type: 'error',
			ename: 'Error',
			evalue: snapshot.text.split('\n')[0] ?? 'Execution failed',
			traceback: snapshot.text.split('\n')
		});
	}

	return outputs;
}

/**
 * @param {boolean | string | undefined} scrolledMeta
 * @param {string} text
 * @param {number} [lineThreshold]
 * @returns {boolean}
 */
export function shouldScrollOutput(text, scrolledMeta, lineThreshold = 100) {
	if (scrolledMeta === true || scrolledMeta === 'true') return true;
	if (scrolledMeta === false || scrolledMeta === 'false') return false;
	if (!text) return false;
	const lines = text.split('\n').length;
	return lines > lineThreshold;
}
