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

const MONACO_CDN_VERSION = '0.56.0';

/** @type {Promise<typeof import('monaco-editor')> | null} */
let monacoPromise = null;
/** @type {boolean} */
let featuresRegistered = false;

/**
 * @param {typeof import('monaco-editor')} monaco
 */
function registerNotebookTheme(monaco) {
	monaco.editor.defineTheme('notebook-py', {
		base: 'vs-dark',
		inherit: true,
		rules: [
			{ token: 'comment', foreground: '6a9955' },
			{ token: 'string', foreground: 'ce9178' },
			{ token: 'keyword', foreground: '569cd6' },
			{ token: 'number', foreground: 'b5cea8' },
			{ token: 'delimiter', foreground: 'd4d4d4' }
		],
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
			'editorSuggestWidget.selectedBackground': '#3d3830'
		}
	});
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
				kind: monaco.languages.CompletionItemKind.Function,
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
				kind: monaco.languages.CompletionItemKind.Method,
				insertText: member,
				detail: `${dotted} member`,
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

			return { suggestions };
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
		registerNotebookTheme(monaco);
		registerPythonFeatures(monaco);
		featuresRegistered = true;
	}

	monaco.editor.setTheme('notebook-py');
	return monaco;
}

/**
 * @param {HTMLElement} container
 * @param {string} initialValue
 * @param {{
 *   readOnly?: boolean,
 *   onChange?: (value: string) => void,
 *   onRunCell?: () => void
 * }} options
 */
export async function createMonacoEditor(container, initialValue, options = {}) {
	const monaco = await ensureMonacoReady();
	if (!monaco) throw new Error('Monaco unavailable');

	const editor = monaco.editor.create(container, {
		value: initialValue,
		language: 'python',
		theme: 'notebook-py',
		automaticLayout: true,
		minimap: { enabled: false },
		fontSize: 13,
		lineHeight: 20,
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
		ariaLabel: 'Python code cell'
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

	const runAction = editor.addAction({
		id: 'notebook.runCell',
		label: 'Run Cell',
		keybindings: [
			monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
			monaco.KeyMod.Shift | monaco.KeyCode.Enter
		],
		run: () => options.onRunCell?.()
	});

	return {
		editor,
		getValue: () => editor.getValue(),
		dispose: () => {
			sizeDisposable.dispose();
			changeDisposable.dispose();
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
