// server/tests/systemController.test.js
import assert from 'node:assert';
import test from 'node:test';
import { validateAppName, sanitizeClipboardInput, getAppCommand } from '../systemController.js';

test('validateAppName allows approved whitelist apps', () => {
  assert.strictEqual(validateAppName('code'), true);
  assert.strictEqual(validateAppName('chrome'), true);
  assert.strictEqual(validateAppName('spotify'), true);
  assert.strictEqual(validateAppName('calc'), true);
  assert.strictEqual(validateAppName('notepad'), true);
  assert.strictEqual(validateAppName('terminal'), true);
  assert.strictEqual(validateAppName('rmdir /s /q c:'), false);
  assert.strictEqual(validateAppName('powershell -e badcode'), false);
});

test('getAppCommand returns correct executable command', () => {
  assert.strictEqual(getAppCommand('code'), 'code');
  assert.strictEqual(getAppCommand('calc'), 'calc');
  assert.strictEqual(getAppCommand('notepad'), 'notepad');
});

test('sanitizeClipboardInput handles strings safely', () => {
  assert.strictEqual(sanitizeClipboardInput('hello world'), 'hello world');
  assert.strictEqual(sanitizeClipboardInput(123), '123');
  assert.strictEqual(sanitizeClipboardInput(''), '');
});
