// client/src/tests/gadgetState.test.js
import assert from 'node:assert';
import test from 'node:test';
import { initialGadgetState, reduceGadgetAction } from '../utils/gadgetState.js';

test('reduceGadgetAction opens and closes 4D pocket', () => {
  const state = initialGadgetState();
  assert.strictEqual(state.isPocketOpen, false);
  const openState = reduceGadgetAction(state, { type: 'TOGGLE_POCKET' });
  assert.strictEqual(openState.isPocketOpen, true);
  const closedState = reduceGadgetAction(openState, { type: 'TOGGLE_POCKET' });
  assert.strictEqual(closedState.isPocketOpen, false);
});

test('reduceGadgetAction changes active gadget tab', () => {
  const state = initialGadgetState();
  const next = reduceGadgetAction(state, { type: 'SET_TAB', tab: 'vision' });
  assert.strictEqual(next.activeTab, 'vision');
});

test('reduceGadgetAction ticks and resets pomodoro timer', () => {
  const state = initialGadgetState();
  assert.strictEqual(state.pomodoroTime, 25 * 60);
  const ticked = reduceGadgetAction(state, { type: 'TICK_POMODORO' });
  assert.strictEqual(ticked.pomodoroTime, 25 * 60 - 1);
  const reset = reduceGadgetAction(ticked, { type: 'RESET_POMODORO' });
  assert.strictEqual(reset.pomodoroTime, 25 * 60);
});
