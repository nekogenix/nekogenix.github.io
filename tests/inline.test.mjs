import assert from 'node:assert/strict';
import { test } from 'node:test';
import { inlineParts, inlineText } from '../src/lib/inline.ts';

test('inline links preserve prose, translated labels and section targets', () => {
  const value =
    'Use [ін’єкцію](wiki/laboratory#pneumatic), then [settings](wiki/settings).';
  assert.deepEqual(inlineParts(value), [
    { text: 'Use ' },
    { text: 'ін’єкцію', target: 'wiki/laboratory#pneumatic' },
    { text: ', then ' },
    { text: 'settings', target: 'wiki/settings' },
    { text: '.' },
  ]);
  assert.equal(inlineText(value), 'Use ін’єкцію, then settings.');
});

test('unsupported links and markup stay literal, while HTTPS references are supported', () => {
  const literal =
    '<b>text</b> [unsafe](javascript:alert) [broken](wiki/not_a_slug)';
  assert.deepEqual(inlineParts(literal), [{ text: literal }]);
  assert.deepEqual(
    inlineParts('[GitHub](https://github.com/nekogenix/nekogenix-mod)'),
    [{ text: 'GitHub', target: 'https://github.com/nekogenix/nekogenix-mod' }],
  );
  assert.equal(inlineText('plain text'), 'plain text');
});
