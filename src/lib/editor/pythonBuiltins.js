/** @typedef {{ label: string, detail?: string, documentation?: string, insertText?: string, kind?: 'function' | 'class' | 'module' | 'keyword' | 'snippet' | 'variable' }} PythonCompletion */

/** @type {PythonCompletion[]} */
export const pythonKeywordCompletions = [
	{ label: 'False', kind: 'keyword' },
	{ label: 'True', kind: 'keyword' },
	{ label: 'None', kind: 'keyword' },
	{ label: 'and', kind: 'keyword' },
	{ label: 'as', kind: 'keyword' },
	{ label: 'assert', kind: 'keyword' },
	{ label: 'async', kind: 'keyword' },
	{ label: 'await', kind: 'keyword' },
	{ label: 'break', kind: 'keyword' },
	{ label: 'class', kind: 'keyword', insertText: 'class ${1:Name}:\n\t$0' },
	{ label: 'continue', kind: 'keyword' },
	{ label: 'def', kind: 'keyword', insertText: 'def ${1:name}(${2:args}):\n\t$0' },
	{ label: 'del', kind: 'keyword' },
	{ label: 'elif', kind: 'keyword', insertText: 'elif ${1:condition}:\n\t$0' },
	{ label: 'else', kind: 'keyword', insertText: 'else:\n\t$0' },
	{ label: 'except', kind: 'keyword', insertText: 'except ${1:Exception}:\n\t$0' },
	{ label: 'finally', kind: 'keyword', insertText: 'finally:\n\t$0' },
	{ label: 'for', kind: 'keyword', insertText: 'for ${1:item} in ${2:iterable}:\n\t$0' },
	{ label: 'from', kind: 'keyword', insertText: 'from ${1:module} import ${2:name}' },
	{ label: 'global', kind: 'keyword' },
	{ label: 'if', kind: 'keyword', insertText: 'if ${1:condition}:\n\t$0' },
	{ label: 'import', kind: 'keyword', insertText: 'import ${1:module}' },
	{ label: 'in', kind: 'keyword' },
	{ label: 'is', kind: 'keyword' },
	{ label: 'lambda', kind: 'keyword', insertText: 'lambda ${1:args}: ${0:expr}' },
	{ label: 'nonlocal', kind: 'keyword' },
	{ label: 'not', kind: 'keyword' },
	{ label: 'or', kind: 'keyword' },
	{ label: 'pass', kind: 'keyword' },
	{ label: 'raise', kind: 'keyword', insertText: 'raise ${1:Exception}(${2:"message"})' },
	{ label: 'return', kind: 'keyword', insertText: 'return ${0}' },
	{ label: 'try', kind: 'keyword', insertText: 'try:\n\t$1\nexcept ${2:Exception}:\n\t$0' },
	{ label: 'while', kind: 'keyword', insertText: 'while ${1:condition}:\n\t$0' },
	{ label: 'with', kind: 'keyword', insertText: 'with ${1:expr} as ${2:var}:\n\t$0' },
	{ label: 'yield', kind: 'keyword' }
];

/** @type {PythonCompletion[]} */
export const pythonBuiltinCompletions = [
	{
		label: 'print',
		kind: 'function',
		detail: '(…objects, sep=" ", end="\\n", …)',
		documentation: 'Print objects to the text stream.',
		insertText: 'print(${1})'
	},
	{
		label: 'len',
		kind: 'function',
		detail: '(obj)',
		documentation: 'Return the number of items in a container.',
		insertText: 'len(${1})'
	},
	{
		label: 'range',
		kind: 'function',
		detail: '(start, stop=None, step=1)',
		documentation: 'Create an immutable sequence of numbers.',
		insertText: 'range(${1:stop})'
	},
	{
		label: 'enumerate',
		kind: 'function',
		detail: '(iterable, start=0)',
		insertText: 'enumerate(${1})'
	},
	{
		label: 'zip',
		kind: 'function',
		detail: '(*iterables, strict=False)',
		insertText: 'zip(${1})'
	},
	{
		label: 'map',
		kind: 'function',
		detail: '(function, iterable, …)',
		insertText: 'map(${1:func}, ${2:iterable})'
	},
	{
		label: 'filter',
		kind: 'function',
		detail: '(function, iterable)',
		insertText: 'filter(${1:func}, ${2:iterable})'
	},
	{
		label: 'sorted',
		kind: 'function',
		detail: '(iterable, …)',
		insertText: 'sorted(${1})'
	},
	{
		label: 'sum',
		kind: 'function',
		insertText: 'sum(${1})'
	},
	{
		label: 'min',
		kind: 'function',
		insertText: 'min(${1})'
	},
	{
		label: 'max',
		kind: 'function',
		insertText: 'max(${1})'
	},
	{
		label: 'abs',
		kind: 'function',
		insertText: 'abs(${1})'
	},
	{
		label: 'round',
		kind: 'function',
		insertText: 'round(${1}${2:, ${3:ndigits}})'
	},
	{
		label: 'isinstance',
		kind: 'function',
		insertText: 'isinstance(${1:obj}, ${2:type})'
	},
	{
		label: 'type',
		kind: 'function',
		insertText: 'type(${1})'
	},
	{
		label: 'open',
		kind: 'function',
		detail: '(file, mode="r", …)',
		insertText: 'open(${1:path}${2:, mode="${3:r}"})'
	},
	{
		label: 'list',
		kind: 'class',
		insertText: 'list(${1})'
	},
	{
		label: 'dict',
		kind: 'class',
		insertText: 'dict(${1})'
	},
	{
		label: 'set',
		kind: 'class',
		insertText: 'set(${1})'
	},
	{
		label: 'tuple',
		kind: 'class',
		insertText: 'tuple(${1})'
	},
	{
		label: 'str',
		kind: 'class',
		insertText: 'str(${1})'
	},
	{
		label: 'int',
		kind: 'class',
		insertText: 'int(${1})'
	},
	{
		label: 'float',
		kind: 'class',
		insertText: 'float(${1})'
	},
	{
		label: 'bool',
		kind: 'class',
		insertText: 'bool(${1})'
	}
];

/** @type {PythonCompletion[]} */
export const pythonStdlibModules = [
	{ label: 'math', kind: 'module', insertText: 'import math' },
	{ label: 'random', kind: 'module', insertText: 'import random' },
	{ label: 'json', kind: 'module', insertText: 'import json' },
	{ label: 're', kind: 'module', insertText: 'import re' },
	{ label: 'datetime', kind: 'module', insertText: 'import datetime' },
	{ label: 'collections', kind: 'module', insertText: 'import collections' },
	{ label: 'itertools', kind: 'module', insertText: 'import itertools' },
	{ label: 'functools', kind: 'module', insertText: 'import functools' },
	{ label: 'pathlib', kind: 'module', insertText: 'from pathlib import Path' },
	{ label: 'typing', kind: 'module', insertText: 'from typing import List, Dict, Optional' }
];

/** @type {Record<string, { signature: string, documentation: string }>} */
export const pythonBuiltinSignatures = {
	print: {
		signature: 'print(*objects, sep=" ", end="\\n", file=None, flush=False)',
		documentation: 'Print objects to the text stream.'
	},
	len: {
		signature: 'len(obj)',
		documentation: 'Return the number of items in a container.'
	},
	range: {
		signature: 'range(stop) / range(start, stop[, step])',
		documentation: 'Create an immutable sequence of numbers.'
	},
	open: {
		signature: 'open(file, mode="r", encoding=None, …)',
		documentation: 'Open file and return a stream.'
	},
	isinstance: {
		signature: 'isinstance(obj, classinfo)',
		documentation: 'Return whether an object is an instance of a class.'
	}
};
