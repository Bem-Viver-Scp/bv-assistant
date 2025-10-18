export type Theme = 'light' | 'dark';
const KEY = 'theme';

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

export function getInitialTheme(): Theme {
  const saved = localStorage.getItem(KEY) as Theme | null;
  return saved ?? getSystemTheme();
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(KEY, theme);
}

export function toggleTheme(): Theme {
  const current =
    (document.documentElement.getAttribute('data-theme') as Theme) ||
    getInitialTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function listenSystemTheme(cb: (t: 'light' | 'dark') => void) {
  const m = window.matchMedia('(prefers-color-scheme: light)');
  const handler = () => cb(m.matches ? 'light' : 'dark');
  m.addEventListener?.('change', handler);
  return () => m.removeEventListener?.('change', handler);
}
