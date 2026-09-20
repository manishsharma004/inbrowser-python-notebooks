import loader from '@monaco-editor/loader';
import { getDynamicPythonCompletions } from './monacoCompletionState.js';
import {
	dottedNameBeforeCursor,
	importContext,
	importableModuleSuggestions,
	membersForModule
} from './pythonModuleIndex.js';
import {
	pythonBuiltinCompletions,
	pythonBuiltinSignatures,
	pythonKeywordCompletions,
	pythonStdlibModules
} from './pythonBuiltins.js';
import { sortCompletionItems } from './completionSort.js';

const MONACO_CDN_VERSION = '0.56.0';

/** @type {Promise<typeof import('monaco-editor')> | null} */
let monacoPromise = null;
/** @type {boolean} */
let featuresRegistered = false;

/**
 * @param {typeof import('monaco-editor')} monaco
 */
function registerNotebookThemes(monaco) {
	const darkRules = [
		{ token: 'comment', foreground: '6a9955' },
		{ token: 'string', foreground: 'ce9178' },
		{ token: 'keyword', foreground: '569cd6' },
		{ token: 'number', foreground: 'b5cea8' },
		{ token: 'delimiter', foreground: 'd4d4d4' }
	];
	monaco.editor.defineTheme('notebook-py-dark', {
		base: 'vs-dark',
		inherit: true,
		rules: darkRules,
		colors: {
			'editor.background': '#181715',
			'editor.foreground': '#e8e2d6',
			'editorLineNumber.foreground': '#5c564c',
			'editorLineNumber.activeForeground': '#8f887a',
			'editor.selectionBackground': '#3d383066',
			'editor.lineHighlightBackground': '#1e1d1a',
			'editorCursor.foreground': '#d4a017',
			'editorWidget.background': '#141311',
			'editorWidget.border': '#2c2924',
			'editorSuggestWidget.background': '#141311',
			'editorSuggestWidget.border': '#2c2924',
			'editorSuggestWidget.selectedBackground': '#04395e',
			'editorSuggestWidget.highlightForeground': '#18a3ff',
			'editorSuggestWidget.foreground': '#cccccc'
		}
	});
	monaco.editor.defineTheme('notebook-py-light', {
		base: 'vs',
		inherit: true,
		rules: darkRules,
		colors: {
			'editor.background': '#ffffff',
			'editor.foreground': '#3b3b3b',
			'editorLineNumber.foreground': '#9d9d9d',
			'editorLineNumber.activeForeground': '#6e6e6e',
			'editor.selectionBackground': '#add6ff80',
			'editor.lineHighlightBackground': '#f5f5f5',
			'editorCursor.foreground': '#b8860b',
			'editorWidget.background': '#f3f3f3',
			'editorWidget.border': '#e5e5e5',
			'editorSuggestWidget.background': '#f3f3f3',
			'editorSuggestWidget.border': '#e5e5e5',
			'editorSuggestWidget.selectedBackground': '#0060c0',
			'editorSuggestWidget.highlightForeground': '#0066bf',
			'editorSuggestWidget.foreground': '#333333'
		}
	});
}

/** @returns {'notebook-py-dark' | 'notebook-py-light'} */
export function monacoThemeIdForResolved(resolved) {
	return resolved === 'light' ? 'notebook-py-light' : 'notebook-py-dark';
}

/** @param {typeof import('monaco-editor')} monaco */
export function applyMonacoTheme(monaco, resolved = 'dark') {
	const id = monacoThemeIdForResolved(/** @type {'dark'|'light'} */ (resolved));
	monaco.editor.setTheme(id);
}

/** @param {typeof import('monaco-editor')} monaco */
export function applyMonacoThemeFromDocument(monaco) {
	if (typeof document === 'undefined') {
		applyMonacoTheme(monaco, 'dark');
		return;
	}
	const resolved = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
	applyMonacoTheme(monaco, resolved);
}

/**
 * @param {typeof import('monaco-editor')} monaco
 */
function registerPythonLanguageConfiguration(monaco) {
	monaco.languages.setLanguageConfiguration('python', {
		comments: {
			lineComment: '#',
			blockComment: ['"""', '"""']
		},
		brackets: [
			['{', '}'],
			['[', ']'],
			['(', ')']
		],
		autoClosingPairs: [
			{ open: '{', close: '}' },
			{ open: '[', close: ']' },
			{ open: '(', close: ')' },
			{ open: '"', close: '"', notIn: ['string'] },
			{ open: "'", close: "'", notIn: ['string', 'comment'] }
		],
		surroundingPairs: [
			{ open: '{', close: '}' },
			{ open: '[', close: ']' },
			{ open: '(', close: ')' },
			{ open: '"', close: '"' },
			{ open: "'", close: "'" }
		],
		indentationRules: {
			increaseIndentPattern: /^.*:\s*$/,
			decreaseIndentPattern: /^\s*(break|continue|pass|raise|return)\b.*$/
		},
		onEnterRules: [
			{
				beforeText: /^\s*(?:def|class|for|while|if|elif|else|try|except|finally|with)\b.*:\s*$/,
				action: { indentAction: monaco.languages.IndentAction.Indent }
			}
		]
	});
}

/**
 * @param {import('monaco-editor').IRange} range
 * @param {string} linePrefix
 * @param {typeof import('monaco-editor')} monaco
 * @returns {import('monaco-editor').languages.CompletionItem[]}
 */
function buildContextualSuggestions(range, linePrefix, monaco) {
	const dynamic = getDynamicPythonCompletions();
	/** @type {import('monaco-editor').languages.CompletionItem[]} */
	const extra = [];

	const importCtx = importContext(linePrefix);
	if (importCtx?.kind === 'import') {
		for (const mod of importableModuleSuggestions(dynamic.members, dynamic.modules)) {
			extra.push({
				label: mod,
				kind: monaco.languages.CompletionItemKind.Module,
				insertText: mod,
				detail: 'module',
				range
			});
		}
	}

	if (importCtx?.kind === 'from-import' && importCtx.module) {
		for (const member of membersForModule(importCtx.module, dynamic.members)) {
			extra.push({
				label: member,
				kind: monaco.languages.CompletionItemKind.Field,
				insertText: member,
				detail: `${importCtx.module} member`,
				range
			});
		}
	}

	const dotted = dottedNameBeforeCursor(linePrefix);
	if (dotted) {
		for (const member of membersForModule(dotted, dynamic.members)) {
			extra.push({
				label: member,
				kind: monaco.languages.CompletionItemKind.Field,
				insertText: member,
				detail: `${dotted} member`,
				range
			});
		}
	}

	const onImportLine =
		importCtx?.kind === 'import' ||
		importCtx?.kind === 'from-import' ||
		linePrefix.trim().endsWith('.');
	if (!onImportLine && !dotted) {
		for (const name of dynamic.globals) {
			extra.push({
				label: name,
				kind: monaco.languages.CompletionItemKind.Variable,
				insertText: name,
				detail: 'kernel global',
				range
			});
		}
	}

	return extra;
}

/**
 * @param {typeof import('monaco-editor')} monaco
 */
function registerPythonFeatures(monaco) {
	registerPythonLanguageConfiguration(monaco);

	const allCompletions = [
		...pythonKeywordCompletions,
		...pythonBuiltinCompletions,
		...pythonStdlibModules
	];

	monaco.languages.registerCompletionItemProvider('python', {
		triggerCharacters: ['.', '(', '[', '"', "'", ' '],
		provideCompletionItems(model, position) {
			const word = model.getWordUntilPosition(position);
			const range = {
				startLineNumber: position.lineNumber,
				endLineNumber: position.lineNumber,
				startColumn: word.startColumn,
				endColumn: word.endColumn
			};

			const linePrefix = model.getValueInRange({
				startLineNumber: position.lineNumber,
				startColumn: 1,
				endLineNumber: position.lineNumber,
				endColumn: position.column
			});

			/** @type {import('monaco-editor').languages.CompletionItem[]} */
			const suggestions = allCompletions.map((item) => ({
				label: item.label,
				kind: monaco.languages.CompletionItemKind[item.kind ?? 'Function'],
				insertText: item.insertText ?? item.label,
				insertTextRules: item.insertText?.includes('${')
					? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
					: undefined,
				range,
				detail: item.detail,
				documentation: item.documentation
					? { value: item.documentation, isTrusted: true }
					: undefined
			}));

			suggestions.push(...buildContextualSuggestions(range, linePrefix, monaco));

			if (linePrefix.endsWith('.')) {
				const objectName = linePrefix.slice(0, -1).trim().split(/\s+/).pop() ?? '';
				const attrSuggestions = attributeHintsForObject(objectName.split('.')[0]).map((label) => ({
					label,
					kind: monaco.languages.CompletionItemKind.Method,
					insertText: label,
					range
				}));
				suggestions.push(...attrSuggestions);
			}

			const typedPrefix = word.word ?? '';
			return { suggestions: /** @type {import('monaco-editor').languages.CompletionItem[]} */ (
				sortCompletionItems(suggestions, { typedPrefix })
			) };
		}
	});

	monaco.languages.registerHoverProvider('python', {
		provideHover(model, position) {
			const word = model.getWordAtPosition(position);
			if (!word) return null;
			const info = pythonBuiltinSignatures[word.word];
			if (!info) return null;
			return {
				range: new monaco.Range(
					position.lineNumber,
					word.startColumn,
					position.lineNumber,
					word.endColumn
				),
				contents: [
					{ value: `\`\`\`python\n${info.signature}\n\`\`\`` },
					{ value: info.documentation }
				]
			};
		}
	});

	monaco.languages.registerSignatureHelpProvider('python', {
		signatureHelpTriggerCharacters: ['(', ','],
		provideSignatureHelp(model, position) {
			const textUntil = model.getValueInRange({
				startLineNumber: position.lineNumber,
				startColumn: 1,
				endLineNumber: position.lineNumber,
				endColumn: position.column
			});
			const match = /(\w+)\($/.exec(textUntil);
			if (!match) return null;
			const info = pythonBuiltinSignatures[match[1]];
			if (!info) return null;
			return {
				value: {
					signatures: [
						{
							label: info.signature,
							documentation: info.documentation,
							parameters: []
						}
					],
					activeSignature: 0,
					activeParameter: 0
				},
				dispose() {}
			};
		}
	});
}

/** @param {string} objectName */
function attributeHintsForObject(objectName) {
	const hints = {
		str: ['split', 'join', 'strip', 'replace', 'format', 'startswith', 'endswith', 'lower', 'upper'],
		list: ['append', 'extend', 'pop', 'insert', 'sort', 'reverse', 'index', 'count'],
		dict: ['keys', 'values', 'items', 'get', 'update', 'pop'],
		set: ['add', 'remove', 'union', 'intersection', 'difference'],
		Path: ['read_text', 'write_text', 'exists', 'mkdir', 'glob']
	};
	return hints[/** @type {keyof typeof hints} */ (objectName)] ?? [];
}

export async function ensureMonacoReady() {
	if (typeof window === 'undefined') return null;

	if (!monacoPromise) {
		loader.config({
			paths: {
				vs: `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_CDN_VERSION}/min/vs`
			}
		});
		monacoPromise = loader.init();
	}

	const monaco = await monacoPromise;

	if (!featuresRegistered) {
		registerNotebookThemes(monaco);
		registerPythonFeatures(monaco);
		featuresRegistered = true;
	}

	applyMonacoThemeFromDocument(monaco);
	return monaco;
}

/**
 * @param {HTMLElement} container
 * @param {string} initialValue
 * @param {{
 *   readOnly?: boolean,
 *   onChange?: (value: string) => void,
 *   onRunCell?: () => void,
 *   onRunCellAdvance?: () => void,
 *   onRunCellAndInsertBelow?: () => void,
 *   onFocus?: () => void
 * }} options
 */
export async function createMonacoEditor(container, initialValue, options = {}) {
	const monaco = await ensureMonacoReady();
	if (!monaco) throw new Error('Monaco unavailable');

	const resolved =
		typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light'
			? 'light'
			: 'dark';
	const themeId = monacoThemeIdForResolved(resolved);

	const compactEditor =
		typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;

	const editor = monaco.editor.create(container, {
		value: initialValue,
		language: 'python',
		theme: themeId,
		automaticLayout: true,
		minimap: { enabled: false },
		fontSize: compactEditor ? 15 : 13,
		lineHeight: compactEditor ? 22 : 20,
		fontFamily: "'IBM Plex Mono', 'SF Mono', ui-monospace, Menlo, Consolas, monospace",
		padding: { top: 8, bottom: 8 },
		scrollBeyondLastLine: false,
		wordWrap: 'on',
		lineNumbers: 'on',
		glyphMargin: false,
		folding: true,
		renderLineHighlight: 'line',
		scrollbar: { vertical: 'auto', horizontal: 'hidden', useShadows: false },
		overviewRulerLanes: 0,
		hideCursorInOverviewRuler: true,
		quickSuggestions: { other: true, comments: false, strings: true },
		suggestOnTriggerCharacters: true,
		tabCompletion: 'on',
		formatOnType: true,
		autoClosingBrackets: 'always',
		autoClosingQuotes: 'always',
		autoIndent: 'full',
		bracketPairColorization: { enabled: true },
		guides: { indentation: true, bracketPairs: true },
		cursorBlinking: 'smooth',
		cursorSmoothCaretAnimation: 'on',
		smoothScrolling: true,
		readOnly: options.readOnly ?? false,
		ariaLabel: 'Python code cell',
		fixedOverflowWidgets: true
	});

	const resize = () => {
		const height = Math.min(420, Math.max(72, editor.getContentHeight()));
		container.style.height = `${height}px`;
		editor.layout();
	};
	resize();
	const sizeDisposable = editor.onDidContentSizeChange(resize);

	const changeDisposable = editor.onDidChangeModelContent(() => {
		options.onChange?.(editor.getValue());
	});

	const focusDisposable = editor.onDidFocusEditorWidget(() => {
		options.onFocus?.();
	});

	const runAction = editor.addAction({
		id: 'notebook.runCell',
		label: 'Run Cell',
		keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
		run: () => options.onRunCell?.()
	});

	editor.addAction({
		id: 'notebook.runCellAdvance',
		label: 'Run Cell and Select Next',
		keybindings: [monaco.KeyMod.Shift | monaco.KeyCode.Enter],
		run: () => (options.onRunCellAdvance ?? options.onRunCell)?.()
	});

	editor.addAction({
		id: 'notebook.runCellAndInsertBelow',
		label: 'Run Cell and Insert Below',
		keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.Enter],
		run: () => (options.onRunCellAndInsertBelow ?? options.onRunCellAdvance ?? options.onRunCell)?.()
	});

	if (import.meta.env.VITE_ENABLE_PYRIGHT === 'true') {
		const { attachPyrightToEditor } = await import('./pyrightBridge.js');
		await attachPyrightToEditor(editor, monaco);
	}

	return {
		editor,
		getValue: () => editor.getValue(),
		dispose: () => {
			sizeDisposable.dispose();
			changeDisposable.dispose();
			focusDisposable.dispose();
			runAction.dispose();
			editor.dispose();
		},
		setValue(value) {
			if (editor.getValue() !== value) {
				editor.setValue(value);
			}
		},
		setReadOnly(readOnly) {
			editor.updateOptions({ readOnly });
		}
	};
}
