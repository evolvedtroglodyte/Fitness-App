import { useEffect, useCallback } from 'react';
import { useUserStore } from '../stores';

export function useTheme() {
  const preferences = useUserStore((state) => state.preferences);
  const toggleTheme = useUserStore((state) => state.toggleTheme);
  const theme = preferences?.theme || 'system';

  const applyTheme = useCallback(() => {
    const isDarkMode =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    applyTheme();

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    }
  }, [theme, applyTheme]);

  return { theme, toggleTheme };
}