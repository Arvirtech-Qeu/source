import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'blue' | 'red' | 'orange' | 'purple';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // const [theme, setTheme] = useState<Theme>(() => {
  //   return (localStorage.getItem('appTheme') as Theme) || 'blue';
  // });
  const [theme, setTheme] = useState<Theme>(() => {
    // return (localStorage.getItem('appTheme') as Theme) || 'blue';
    return 'red';
  });

  // Load saved theme from localStorage on initial render
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('appTheme') as Theme | null;
  //   if (savedTheme) {
  //     setTheme(savedTheme);
  //   }
  // }, []);

  // Apply theme changes
  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};