import assert from 'node:assert/strict';
import test from 'node:test';
import {
	createNode,
	emptySnapshot,
	listChildren,
	mkdir,
	rename,
	unlink,
	writeFile
} from '../src/lib/vfs/vfsTree.js';
import { filePathForNode } from '../src/lib/vfs/vfsPaths.js';
import { formatRelativeTime } from '../src/lib/vfs/formatRelativeTime.js';
import {
	loadThemePreference,
	resolveTheme,
	saveThemePreference,
	THEME_STORAGE_KEY
} from '../src/lib/theme/themePreference.js';
import { parseWorkspaceBundle, serializeWorkspaceBundle } from '../src/lib/vfs/workspaceBundle.js';

test('mkdir rename unlink and paths', () => {
	const snap = emptySnapshot();
	const dir = mkdir(snap, snap.rootId, 'data');
	const file = createNode(snap, dir.id, 'iris.csv', 'file', 'a,b');
	assert.equal(filePathForNode(snap, file), 'data/iris.csv');
	rename(snap, file.id, 'iris2.csv');
	writeFile(snap, file.id, 'x');
	unlink(snap, file.id);
	unlink(snap, dir.id);
	assert.equal(listChildren(snap, snap.rootId).length, 0);
});

test('formatRelativeTime shows now for recent', () => {
	assert.equal(formatRelativeTime(Date.now() - 2000), 'now');
});

test('theme preference round-trip', () => {
	const mem = new Map();
	// @ts-expect-error test stub
	globalThis.localStorage = {
		getItem: (k) => mem.get(k) ?? null,
		setItem: (k, v) => mem.set(k, v)
	};
	saveThemePreference('light');
	assert.equal(loadThemePreference(), 'light');
	assert.equal(resolveTheme('dark'), 'dark');
	mem.clear();
});

test('workspace bundle round-trip', () => {
	const snap = emptySnapshot();
	const raw = serializeWorkspaceBundle(snap);
	const parsed = parseWorkspaceBundle(raw);
	assert.ok(parsed?.nodes.length);
});
