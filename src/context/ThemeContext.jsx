import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('seha_app_theme');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const setTheme = (t) => {
    setThemeState(t);
    try {
      localStorage.setItem('seha_app_theme', t);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light',
      setTheme: () => {},
      toggleTheme: () => {},
      isDark: false
    };
  }
  return context;
};
