// client/src/tests/doraemonAudio.test.js
import assert from 'node:assert';
import test from 'node:test';
import { getGadgetChimeFrequencies, getDorayakiChompFrequencies } from '../utils/doraemonAudio.js';

test('getGadgetChimeFrequencies returns iconic ascending melody', () => {
  const freqs = getGadgetChimeFrequencies();
  assert.deepStrictEqual(freqs, [523.25, 659.25, 783.99, 1046.50]); // C5, E5, G5, C6
});

test('getDorayakiChompFrequencies returns playful snack tones', () => {
  const freqs = getDorayakiChompFrequencies();
  assert.strictEqual(freqs.length, 2);
  assert.strictEqual(typeof freqs[0], 'number');
});
