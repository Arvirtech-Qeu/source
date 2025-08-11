import { useTheme } from './theme_provider';

type ThemeColors = {
  primary: string;
  primaryRgb: string;
  hoverBg: string;
};

export const useThemeColors = (): ThemeColors => {
  const { theme } = useTheme();
  
  const themeMap: Record<string, ThemeColors> = {
    blue: {
      primary: '#4285f4',
      primaryRgb: '66, 133, 244',
      hoverBg: '#e0f0ff'
    },
    red: {
      primary: '#ea4335',
      primaryRgb: '234, 67, 53',
      hoverBg: '#ffdfdf'
    },
    orange: {
      primary: '#ffbb33',
      primaryRgb: '255, 187, 51',
      hoverBg: '#ffeccd'
    },
    purple: {
      primary: '#9c27b0',
      primaryRgb: '156, 39, 176',
      hoverBg: '#f5e6fb'
    }
  };

  return themeMap[theme] || themeMap.blue;
};