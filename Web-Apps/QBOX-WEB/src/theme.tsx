// Define custom properties for light and dark themes
// import './styles.css'; // Import your main stylesheet
import '@assets/style.css'; // Import your main stylesheet
import './styles.css'; // Import your main stylesheet
const themeStyles = {
    light: {
        '--background-color': '#ffffff',
        '--text-color': '#000000',
        '--primary-color': '#28A745',
        '--secondary-color': '#FFD700',
        '--accent-color': '#FF6347',
        '--neutral-light': '#F7F7F7',
        '--neutral-dark': '#333333',
    },
    dark: {
        '--background-color': '#1a1a1a',
        '--text-color': '#f1f1f1',
        '--primary-color': '#28A745',
        '--secondary-color': '#FFD700',
        '--accent-color': '#FF6347',
        '--neutral-light': '#333333',
        '--neutral-dark': '#f1f1f1',
    },
};

// Apply the selected theme styles
export const applyTheme = (theme: 'light' | 'dark') => {
    const selectedTheme = themeStyles[theme];
    for (const key in selectedTheme) {
        document.documentElement.style.setProperty(key, selectedTheme[key]);
    }
};

