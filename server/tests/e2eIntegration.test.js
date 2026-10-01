// server/tests/e2eIntegration.test.js
import assert from 'node:assert';
import test from 'node:test';
import { createDoraemonServer } from '../server.js';

test('server health endpoint returns status ok, companion name and lan ip', async () => {
  const TEST_PORT = 4249;
  const { server } = createDoraemonServer(TEST_PORT);

  await new Promise((resolve) => server.listen(TEST_PORT, '127.0.0.1', resolve));

  try {
    const res = await fetch(`http://127.0.0.1:${TEST_PORT}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert.strictEqual(data.companion, 'Doraemon 4D Hub');
    assert.match(data.lanIp, /^(?:\d{1,3}\.){3}\d{1,3}$/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('server action endpoint accepts event and returns result', async () => {
  const TEST_PORT = 4250;
  const { server } = createDoraemonServer(TEST_PORT);

  await new Promise((resolve) => server.listen(TEST_PORT, '127.0.0.1', resolve));

  try {
    const res = await fetch(`http://127.0.0.1:${TEST_PORT}/api/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'CLIPBOARD_GET' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(typeof data.text, 'string');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
