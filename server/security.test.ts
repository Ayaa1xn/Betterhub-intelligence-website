import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from './security';

test('hashPassword and verifyPassword round-trip correctly', () => {
  const hash = hashPassword('BHI@123');
  assert.equal(verifyPassword('BHI@123', hash), true);
  assert.equal(verifyPassword('wrong-password', hash), false);
});
