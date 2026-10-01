// client/src/components/FocusCard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, CheckSquare, Square, Plus, CloudUpload, Check } from 'lucide-react';

export default function FocusCard({ state, dispatch, onDispatch }) {
  const [newTaskText, setNewTaskText] = useState('');
  const [synced, setSynced] = useState(false);

  // Timer tick effect
  useEffect(() => {
    let interval;
    if (state.isTimerRunning && state.pomodoroTime > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK_POMODORO' });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isTimerRunning, state.pomodoroTime]);

  const minutes = Math.floor(state.pomodoroTime / 60);
  const seconds = state.pomodoroTime % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    dispatch({ type: 'ADD_TASK', text: newTaskText.trim() });
    setNewTaskText('');
  };

  const handleSyncToDiscord = () => {
    const completedCount = state.tasks.filter(t => t.done).length;
    const totalCount = state.tasks.length;
    onDispatch({
      type: 'DISCORD_SYNC',
      title: 'Doraemon Focus & Tasks Update',
      description: `Satyam completed **${completedCount}/${totalCount}** tasks in this session!`,
      fields: [
        { name: 'Pomodoro Clock', value: `${timeFormatted} remaining`, inline: true },
        { name: 'Tasks Status', value: state.tasks.map(t => `${t.done ? '✅' : '⏳'} ${t.text}`).join('\n') || 'No tasks', inline: false }
      ]
    });
    setSynced(true);
    setTimeout(() => setSynced(false), 2500);
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-4">
      {/* Pomodoro Timer Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
          Time-Furoshiki Focus
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSyncToDiscord}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-300 text-[11px] font-medium transition-[background,transform]"
        >
          {synced ? <Check className="w-3.5 h-3.5" /> : <CloudUpload className="w-3.5 h-3.5" />}
          <span>{synced ? 'Synced!' : 'Vault to Discord'}</span>
        </motion.button>
      </div>

      {/* Big Digits Display */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="text-4xl font-black tracking-tight text-white font-mono drop-shadow-md">
          {timeFormatted}
        </div>
        <div className="text-[11px] text-zinc-400 mt-1">Deep Work Mode</div>

        {/* Timer Action Buttons */}
        <div className="flex items-center gap-2 mt-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs shadow-md transition-[background,transform]"
          >
            {state.isTimerRunning ? <Pause className="w-4 h-4 fill-zinc-950" /> : <Play className="w-4 h-4 fill-zinc-950" />}
            <span>{state.isTimerRunning ? 'Pause' : 'Start Focus'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: 'RESET_POMODORO' })}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-[background,transform]"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Task Checklist */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="text-xs font-semibold text-zinc-300">Daily Checklist:</div>
        <div className="space-y-1.5 max-h-36 overflow-y-auto">
          {state.tasks.map(task => (
            <div
              key={task.id}
              onClick={() => dispatch({ type: 'TOGGLE_TASK', id: task.id })}
              className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer text-xs transition-[background]"
            >
              {task.done ? (
                <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              )}
              <span className={`flex-grow ${task.done ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>

        {/* Add Task input */}
        <form onSubmit={handleAddTask} className="flex gap-2 mt-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add new task..."
            className="flex-grow bg-zinc-950/70 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-sky-400"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="p-2 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 hover:bg-sky-500/30 text-xs"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
