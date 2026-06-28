import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveData, loadData, KEYS } from '../utils/storage';

const dark = {
  bg: '#0d0d1a',
  card: '#1a1a2e',
  border: '#2a2a45',
  accent: '#f5a623',
  accentDim: '#2e1f05',
  text: '#ffffff',
  textSub: '#8888aa',
  navBg: '#111122',
  chip: '#2a2a45',
  chipText: '#ccccee',
  danger: '#e74c3c',
  tabActive: '#f5a623',
  tabInactive: '#555577',
};

const light = {
  bg: '#f4f4f8',
  card: '#ffffff',
  border: '#e0e0e8',
  accent: '#f5a623',
  accentDim: '#fff3e0',
  text: '#1a1a2e',
  textSub: '#66668a',
  navBg: '#ffffff',
  chip: '#e8e8f0',
  chipText: '#444466',
  danger: '#e74c3c',
  tabActive: '#f5a623',
  tabInactive: '#aaaaaa',
};

const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    loadData(KEYS.THEME).then((v) => {
      if (v !== null) setIsDark(v);
    });
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    saveData(KEYS.THEME, next);
  };

  return (
    <ThemeContext.Provider value={{ theme: isDark ? dark : light, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
