import { Context, createContext, useContext, useEffect, useState } from 'react';

interface ThemeColors {
  accent: string;
  accentLight: string;
  accentDark: string;
  accentRgb: string;
}

interface ThemeCtxValue {
  theme: ThemeColors;
}

const defaultTheme: ThemeColors = {
  accent: '#5dade2',
  accentLight: '#85c1e9',
  accentDark: '#3498db',
  accentRgb: '93, 173, 226',
};

const ThemeCtx = createContext<ThemeCtxValue>({ theme: defaultTheme });

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);

  useEffect(() => {
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    const lighten = (value: number, percent: number) => Math.min(255, Math.round(value + (255 - value) * percent));
    const darken = (value: number, percent: number) => Math.max(0, Math.round(value * (1 - percent)));

    const updateTheme = (r: number, g: number, b: number) => {
      const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      
      const lightR = lighten(r, 0.15);
      const lightG = lighten(g, 0.15);
      const lightB = lighten(b, 0.15);
      const hexLight = `#${toHex(lightR)}${toHex(lightG)}${toHex(lightB)}`;
      
      const darkR = darken(r, 0.15);
      const darkG = darken(g, 0.15);
      const darkB = darken(b, 0.15);
      const hexDark = `#${toHex(darkR)}${toHex(darkG)}${toHex(darkB)}`;

      const newTheme: ThemeColors = {
        accent: hexColor,
        accentLight: hexLight,
        accentDark: hexDark,
        accentRgb: `${r}, ${g}, ${b}`,
      };

      setTheme(newTheme);

      const root = document.documentElement;
      root.style.setProperty('--theme-accent', hexColor);
      root.style.setProperty('--theme-accent-light', hexLight);
      root.style.setProperty('--theme-accent-dark', hexDark);
      root.style.setProperty('--theme-accent-rgb', `${r}, ${g}, ${b}`);
    };

    const eventListener = (event: MessageEvent) => {
      if (event.data.action === 'setThemeColor') {
        const { r, g, b } = event.data.data;
        if (r !== undefined && g !== undefined && b !== undefined) {
          updateTheme(r, g, b);
        }
      }
    };

    window.addEventListener('message', eventListener);
    return () => window.removeEventListener('message', eventListener);
  }, []);

  return <ThemeCtx.Provider value={{ theme }}>{children}</ThemeCtx.Provider>;
};

export default ThemeProvider;

export const useTheme = () => useContext<ThemeCtxValue>(ThemeCtx as Context<ThemeCtxValue>);


