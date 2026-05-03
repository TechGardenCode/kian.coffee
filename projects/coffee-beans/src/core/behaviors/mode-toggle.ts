/* =====================================================================
   mode-toggle — light/dark switch on <html class="dark"> with localStorage
   persistence. Ports the canonical IIFE from Components.html lines
   1580–1597. Framework-agnostic; no @angular imports.

   Side effects:
   - applyMode() mutates document.documentElement.classList and writes
     localStorage[MODE_STORAGE_KEY].
   - readMode() reads localStorage; falls back to 'dark' if absent.
   - Subscribers are notified on every applyMode() call.
   ===================================================================== */

export type Mode = 'light' | 'dark';

export const MODE_STORAGE_KEY = 'kc-ds-mode';

type Listener = (mode: Mode) => void;
const listeners = new Set<Listener>();

function hasDocument(): boolean {
  return typeof document !== 'undefined';
}

function hasStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

/** Reads the persisted mode from localStorage; defaults to 'dark'. */
export function readMode(): Mode {
  if (!hasStorage()) return 'dark';
  const stored = localStorage.getItem(MODE_STORAGE_KEY);
  return stored === 'light' ? 'light' : 'dark';
}

/** Applies the mode: toggles `html.dark`, persists, notifies subscribers. */
export function applyMode(mode: Mode): void {
  if (hasDocument()) {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }
  if (hasStorage()) {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }
  for (const cb of listeners) cb(mode);
}

/** Flips the current mode and applies it. Returns the new mode. */
export function toggleMode(): Mode {
  const next: Mode = readMode() === 'dark' ? 'light' : 'dark';
  applyMode(next);
  return next;
}

/** Subscribes to mode changes. Returns an unsubscribe function. */
export function subscribeMode(cb: Listener): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Reads the persisted mode and applies it. Idempotent — safe to call
 *  multiple times during bootstrap. Returns the resolved mode. */
export function initMode(): Mode {
  const mode = readMode();
  applyMode(mode);
  return mode;
}
