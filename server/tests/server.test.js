// server/tests/server.test.js
import assert from 'node:assert';
import test from 'node:test';
import { getLocalLanIp, handleIncomingEvent } from '../server.js';

test('getLocalLanIp returns valid IPv4 address or localhost fallback', () => {
  const ip = getLocalLanIp();
  assert.match(ip, /^(?:\d{1,3}\.){3}\d{1,3}$/);
});

test('handleIncomingEvent handles volume action safely', async () => {
  const res = await handleIncomingEvent({ type: 'MEDIA_CONTROL', action: 'volume', direction: 'mute' });
  assert.strictEqual(typeof res.success, 'boolean');
});

test('handleIncomingEvent handles unknown event type gracefully', async () => {
  const res = await handleIncomingEvent({ type: 'UNKNOWN_MAGIC_ACTION' });
  assert.strictEqual(res.success, false);
  assert.strictEqual(typeof res.error, 'string');
});
