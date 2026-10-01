// client/src/utils/gadgetState.js

export function initialGadgetState() {
  return {
    isPocketOpen: false,
    activeTab: 'remote', // 'remote' | 'clipboard' | 'vision' | 'focus' | 'voice'
    pomodoroTime: 25 * 60,
    isTimerRunning: false,
    clipboardContent: '',
    connected: false,
    lanIp: '127.0.0.1',
    tasks: [
      { id: '1', text: 'Build Doraemon 4D Companion', done: true },
      { id: '2', text: 'Connect Phone over 24/7 Wi-Fi', done: false },
      { id: '3', text: 'Test Screen Vision Lens', done: false }
    ],
    lastVisionResult: null,
    isCapturingVision: false
  };
}

export function reduceGadgetAction(state, action) {
  switch (action.type) {
    case 'TOGGLE_POCKET':
      return { ...state, isPocketOpen: !state.isPocketOpen };

    case 'SET_TAB':
      return { ...state, activeTab: action.tab };

    case 'SET_CLIPBOARD':
      return { ...state, clipboardContent: action.text };

    case 'TOGGLE_TIMER':
      return { ...state, isTimerRunning: !state.isTimerRunning };

    case 'TICK_POMODORO':
      if (state.pomodoroTime <= 0) return { ...state, isTimerRunning: false };
      return { ...state, pomodoroTime: state.pomodoroTime - 1 };

    case 'RESET_POMODORO':
      return { ...state, pomodoroTime: 25 * 60, isTimerRunning: false };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.id ? { ...t, done: !t.done } : t)
      };

    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, { id: Date.now().toString(), text: action.text, done: false }]
      };

    case 'SET_CONNECTED':
      return { ...state, connected: action.connected, lanIp: action.lanIp || state.lanIp };

    case 'SET_VISION_RESULT':
      return { ...state, lastVisionResult: action.result, isCapturingVision: false };

    case 'START_VISION_CAPTURE':
      return { ...state, isCapturingVision: true };

    default:
      return state;
  }
}
