import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import GlobalState from './globalState';
import App from './App';
import './index.css';
import Logo from '@assets/images/q-logo.png';
import { CCTVProvider } from '@context/CCTVContext';
import { FilterProvider } from '@context/FilterProvider';
const SplashScreen = () => (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }} className='bg-red-200'>
        <div style={{
            animation: 'scaleIn 0.5s ease-in-out',
        }}>

            <img src={Logo} className='w-80 h-80'></img>
        </div>

        <p className='text-red-500 font-bold text-6xl' style={{ fontFamily: 'serif' }}>QeuBox</p>

    </div>
);

// Add these animations to your index.css
const style = document.createElement('style');
style.textContent = `
    @keyframes scaleIn {
        from { transform: scale(0); }
        to { transform: scale(1); }
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }
`;
document.head.appendChild(style);

// Root component to handle splash screen logic
const Root = () => {
    const [isLoading, setIsLoading] = useState(true);
    const isHashRouter = import.meta.env.VITE_USE_HASH_ROUTER === 'true';

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // 2 seconds

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <GlobalState>
            {isHashRouter ? (
                <HashRouter>
                    <FilterProvider>
                        <App />
                    </FilterProvider>
                </HashRouter>
            ) : (
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            )}
        </GlobalState>
    );
};

// Create root element and render
const rootElement = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);
