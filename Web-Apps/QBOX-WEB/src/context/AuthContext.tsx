import React, { createContext, useState, useContext, ReactNode } from 'react'

interface AuthContextType {
    isAuthenticated: boolean
    login: (userData: { name: string; email: string }) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const login = (userData: { name: string; email: string }) => {
        // Here, you can integrate real authentication logic
        setIsAuthenticated(true)
        // You can save user data into context or global state (e.g., Redux)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const logout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
