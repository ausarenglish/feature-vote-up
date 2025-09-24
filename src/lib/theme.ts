export type Theme = 'light' | 'dark';

export function getTheme(): Theme {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  localStorage.setItem('theme', theme);
}

export function initTheme() {
  applyTheme(getTheme());
}