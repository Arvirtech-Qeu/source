import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToLocalStorage, removeFromLocalStorage, getFromLocalStorage } from '../utils/storage';

interface User {
    email: string;
    isLoginSuccess: boolean;
    authUserName: string;
    roleId: number;
    loginDetails: []
}

export const useAuth = () => {
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const user = getFromLocalStorage('user');
        return !!user; // Initialize based on localStorage
    });

    const [user, setUser] = useState<User | null>(() => {
        return getFromLocalStorage('user');
    });

    useEffect(() => {
        console.log('isAuthenticated updated:', isAuthenticated);
    }, [isAuthenticated]);

    const login = (userData: User) => {
        setIsAuthenticated(true);
        setUser(userData);
        saveToLocalStorage('user', userData); // Save user in localStorage
        // navigate('/dashboard'); // Redirect to dashboard
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        removeFromLocalStorage('user'); // Clear user data
        navigate('/login'); // Redirect to login
    };

    return { isAuthenticated, user, login, logout };
};
