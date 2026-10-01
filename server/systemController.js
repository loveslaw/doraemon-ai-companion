// server/systemController.js
import { exec, spawn } from 'node:child_process';
import util from 'node:util';

const execPromise = util.promisify(exec);

const APP_WHITELIST = {
  code: 'code',
  chrome: 'start chrome',
  spotify: 'start spotify:',
  calc: 'calc',
  calculator: 'calc',
  notepad: 'notepad',
  terminal: 'wt',
  cmd: 'start cmd',
  explorer: 'explorer'
};

export function validateAppName(appName) {
  if (typeof appName !== 'string') return false;
  const clean = appName.trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(APP_WHITELIST, clean);
}

export function getAppCommand(appName) {
  const clean = String(appName).trim().toLowerCase();
  return APP_WHITELIST[clean] || null;
}

export function sanitizeClipboardInput(text) {
  if (text === null || text === undefined) return '';
  return String(text);
}

// Media controls using PowerShell WScript.Shell SendKeys
export async function adjustVolume(direction) {
  try {
    let keyCode = '';
    if (direction === 'up') {
      keyCode = '{PGUP}'; // or audio volume up key: 175
      const ps = `powershell -c "$w = New-Object -ComObject WScript.Shell; 1..5 | % { $w.SendKeys([char]175) }"`;
      await execPromise(ps);
    } else if (direction === 'down') {
      const ps = `powershell -c "$w = New-Object -ComObject WScript.Shell; 1..5 | % { $w.SendKeys([char]174) }"`;
      await execPromise(ps);
    } else if (direction === 'mute') {
      const ps = `powershell -c "$w = New-Object -ComObject WScript.Shell; $w.SendKeys([char]173)"`;
      await execPromise(ps);
    }
    return { success: true, direction };
  } catch (err) {
    console.error('[systemController] Volume error:', err.message);
    return { success: false, error: err.message };
  }
}

export async function toggleMediaPlayPause() {
  try {
    const ps = `powershell -c "$w = New-Object -ComObject WScript.Shell; $w.SendKeys([char]179)"`;
    await execPromise(ps);
    return { success: true };
  } catch (err) {
    console.error('[systemController] Media toggle error:', err.message);
    return { success: false, error: err.message };
  }
}

export async function mediaNextTrack() {
  try {
    const ps = `powershell -c "$w = New-Object -ComObject WScript.Shell; $w.SendKeys([char]176)"`;
    await execPromise(ps);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function mediaPrevTrack() {
  try {
    const ps = `powershell -c "$w = New-Object -ComObject WScript.Shell; $w.SendKeys([char]177)"`;
    await execPromise(ps);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function launchApp(appName) {
  if (!validateAppName(appName)) {
    return { success: false, error: `App "${appName}" is not in whitelist` };
  }
  const cmd = getAppCommand(appName);
  try {
    exec(cmd);
    return { success: true, app: appName };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getClipboard() {
  try {
    const { stdout } = await execPromise('powershell -NoProfile -Command "Get-Clipboard"');
    return stdout ? stdout.trim() : '';
  } catch (err) {
    console.error('[systemController] Get clipboard error:', err.message);
    return '';
  }
}

export async function setClipboard(text) {
  const sanitized = sanitizeClipboardInput(text);
  try {
    // Pipe text to clip
    const child = spawn('clip');
    child.stdin.write(sanitized);
    child.stdin.end();
    return true;
  } catch (err) {
    console.error('[systemController] Set clipboard error:', err.message);
    return false;
  }
}

export async function lockPc() {
  try {
    exec('rundll32.exe user32.dll,LockWorkStation');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
