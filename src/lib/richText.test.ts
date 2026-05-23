import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReadTimeFromHtml, sanitizeRichText } from './richText';

test('calculateReadTimeFromHtml enforces a one minute minimum', () => {
  assert.equal(calculateReadTimeFromHtml('<p>Hello world</p>'), '1 min read');
});

test('calculateReadTimeFromHtml counts long content accurately', () => {
  const longHtml = `<p>${'word '.repeat(440)}</p>`;
  assert.equal(calculateReadTimeFromHtml(longHtml), '2 min read');
});

test('sanitizeRichText strips unsafe tags and javascript urls', () => {
  const dirtyHtml =
    '<p>Hello</p><script>alert(1)</script><a href="javascript:alert(1)" onclick="evil()">Test</a><img src="/uploads/example.png" onerror="evil()">';

  assert.equal(
    sanitizeRichText(dirtyHtml),
    '<p>Hello</p><a>Test</a><img src="/uploads/example.png">',
  );
});
