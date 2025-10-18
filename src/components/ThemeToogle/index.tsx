import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getInitialTheme, toggleTheme } from '../../theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  const isDark = theme === 'light';

  return (
    <button
      onClick={() => setTheme(toggleTheme())}
      className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5
                 bg-primary text-primary-foreground
                 ring-1 ring-[color-mix(in oklab,var(--primary) 30%,transparent)]
                 hover:brightness-95 transition"
      title={isDark ? 'Light' : 'Dark'}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      <span className="text-sm">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
