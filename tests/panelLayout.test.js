import assert from 'node:assert/strict';
import test from 'node:test';
import {
	clampPanelWidth,
	RAIL_WIDTH_MAX,
	RAIL_WIDTH_MIN,
	SESSION_WIDTH_MAX,
	SESSION_WIDTH_MIN
} from '../src/lib/layout/panelLayout.js';

test('clampPanelWidth respects bounds', () => {
	assert.equal(clampPanelWidth(100, RAIL_WIDTH_MIN, RAIL_WIDTH_MAX), RAIL_WIDTH_MIN);
	assert.equal(clampPanelWidth(999, SESSION_WIDTH_MIN, SESSION_WIDTH_MAX), SESSION_WIDTH_MAX);
	assert.equal(clampPanelWidth(280, RAIL_WIDTH_MIN, RAIL_WIDTH_MAX), 280);
});
