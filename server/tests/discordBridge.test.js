// server/tests/discordBridge.test.js
import assert from 'node:assert';
import test from 'node:test';
import { formatDoraemonEmbed } from '../discordBridge.js';

test('formatDoraemonEmbed builds valid Discord embed structure', () => {
  const embed = formatDoraemonEmbed('Test Title', 'Test Desc', [{ name: 'Status', value: 'Active' }]);
  assert.strictEqual(embed.title.includes('Test Title'), true);
  assert.strictEqual(embed.description, 'Test Desc');
  assert.strictEqual(embed.color, 0x0099FF); // Doraemon Blue
  assert.strictEqual(embed.fields[0].name, 'Status');
});
