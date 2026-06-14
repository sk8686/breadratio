import test from 'node:test';
import assert from 'node:assert/strict';

import {
  escapeHtml,
  buildCopyText,
  getCopyButtonMarkup,
  getHydrationDescriptionKey,
} from '../src/utils/calculator-ui.js';

test('escapeHtml safely encodes special characters', () => {
  assert.equal(
    escapeHtml('<Bread & Butter>"\''),
    '&lt;Bread &amp; Butter&gt;&quot;&#39;',
  );
});

test('buildCopyText creates stable multiline output', () => {
  const text = buildCopyText(
    [
      ['Flour', '500g'],
      ['Water', '350g'],
      ['Salt', '10g'],
    ],
    'Total Dough: 860g',
  );

  assert.equal(text, 'Flour: 500g\nWater: 350g\nSalt: 10g\n\nTotal Dough: 860g');
});

test('getCopyButtonMarkup swaps icons based on state', () => {
  assert.match(getCopyButtonMarkup('Copy All'), /<rect x="9" y="9"/);
  assert.match(getCopyButtonMarkup('Copied!', 'success'), /<polyline points="20 6 9 17 4 12"/);
});

test('getHydrationDescriptionKey keeps the current threshold boundaries', () => {
  assert.equal(getHydrationDescriptionKey(57), 'veryStiff');
  assert.equal(getHydrationDescriptionKey(58), 'stiff');
  assert.equal(getHydrationDescriptionKey(65), 'stiff');
  assert.equal(getHydrationDescriptionKey(66), 'standard');
  assert.equal(getHydrationDescriptionKey(78), 'high');
  assert.equal(getHydrationDescriptionKey(85), 'veryHigh');
  assert.equal(getHydrationDescriptionKey(86), 'extreme');
});
