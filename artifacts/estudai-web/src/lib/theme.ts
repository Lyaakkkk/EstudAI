import { useSyncExternalStore } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
const THEME_KEY = 'estudai-theme';
const valid = (value: unknown): ThemePreference => value === 'light' || value === 'dark' ? value : 'system';
function readPreference(): ThemePreference {
  try { return valid(localStorage.getItem(THEME_KEY)); } catch { return 'system'; }
}
const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
let preference = readPreference();
let resolved: ResolvedTheme = 'light';
let storageError = false;
const listeners = new Set<() => void>();
function applyTheme() {
  resolved = preference === 'system' ? (media?.matches ? 'dark' : 'light') : preference;
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.dataset.themePreference = preference;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  const icon = document.querySelector?.<HTMLLinkElement>('[data-theme-icon]');
  const href = icon?.getAttribute(resolved === 'dark' ? 'data-dark-href' : 'data-light-href');
  if (href) icon?.setAttribute('href', href);
  root.style.backgroundColor = ''; // The pre-paint bootstrap hands over to semantic CSS.
}
function notify() { applyTheme(); listeners.forEach(listener => listener()); }
function onSystemChange() { if (preference === 'system') notify(); }
function onStorage(event: StorageEvent) {
  if (event.key !== THEME_KEY && event.key !== null) return;
  preference = event.key === null ? readPreference() : valid(event.newValue);
  storageError = false;
  notify();
}
export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1 && typeof window !== 'undefined') {
    media?.addEventListener('change', onSystemChange);
    window.addEventListener('storage', onStorage);
    applyTheme();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== 'undefined') {
      media?.removeEventListener('change', onSystemChange);
      window.removeEventListener('storage', onStorage);
    }
  };
}
export function setThemePreference(value: ThemePreference) {
  preference = valid(value);
  try { localStorage.setItem(THEME_KEY, preference); storageError = false; }
  catch { storageError = true; }
  notify();
}
export const getThemeSnapshot = () => preference + ':' + resolved + ':' + storageError;
const getServerSnapshot = () => 'system:light:false';
applyTheme();

/** One store for all selectors; follows live OS changes only in System mode. */
export function useTheme() {
  const snapshot = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot);
  const [selected, active, failed] = snapshot.split(':');
  return { preference: selected as ThemePreference, theme: active as ResolvedTheme, setPreference: setThemePreference, storageError: failed === 'true' };
}
