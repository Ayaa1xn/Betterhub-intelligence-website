import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePath, parseRoute } from './router';

test('normalizePath converts legacy hash links into clean paths', () => {
  assert.equal(normalizePath('#/blog/future-of-geo/'), '/blog/future-of-geo');
  assert.equal(normalizePath('services'), '/services');
  assert.equal(normalizePath(''), '/');
});

test('parseRoute resolves detail routes correctly', () => {
  assert.deepEqual(parseRoute('/product/hrms'), {
    name: 'product-detail',
    productId: 'hrms',
  });
  assert.deepEqual(parseRoute('/service/ai-solutions'), {
    name: 'service-detail',
    serviceId: 'ai-solutions',
  });
  assert.deepEqual(parseRoute('/privacy-policy'), { name: 'privacy-policy' });
  assert.deepEqual(parseRoute('/admin'), { name: 'admin' });
});
