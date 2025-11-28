'use client';

import { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import useThemeStore from '@/store/themeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  // Применяем тему при монтировании компонента
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl"
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
    >
      <div className="relative w-6 h-6">
        <Sun
          className={`absolute inset-0 text-yellow-500 transition-all duration-300 ${
            theme === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-0'
          }`}
          size={24}
        />
        <Moon
          className={`absolute inset-0 text-blue-500 transition-all duration-300 ${
            theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-0'
          }`}
          size={24}
        />
      </div>
    </button>
  );
}
